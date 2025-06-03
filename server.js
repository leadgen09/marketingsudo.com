const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const snoowrap = require('snoowrap');
const { TwitterApi } = require('twitter-api-v2');
const LinkedInApi = require('linkedin-api');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const Audience = require('./models/Audience');
const SearchResult = require('./models/SearchResult');
const Trend = require('./models/Trend');
const Competitor = require('./models/Competitor');

// OpenAI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Reddit API configuration
const redditConfig = {
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
};

// Twitter API configuration
const twitterConfig = {
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET
};

// LinkedIn API configuration
const linkedinConfig = {
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    accessToken: process.env.LINKEDIN_ACCESS_TOKEN
};

// Serve static files
app.use(express.static('public'));

// Privacy Policy route
app.get('/privacy-policy', (req, res) => {
    res.sendFile(__dirname + '/public/privacy-policy.html');
});

// LinkedIn OAuth endpoints
app.get('/auth/linkedin', (req, res) => {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinConfig.clientId}&redirect_uri=${encodeURIComponent('http://localhost:3000/auth/linkedin/callback')}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    res.redirect(authUrl);
});

app.get('/auth/linkedin/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
                grant_type: 'authorization_code',
                code,
                client_id: linkedinConfig.clientId,
                client_secret: linkedinConfig.clientSecret,
                redirect_uri: 'http://localhost:3000/auth/linkedin/callback'
            }
        });

        // Store the access token
        linkedinConfig.accessToken = tokenResponse.data.access_token;
        
        // Redirect to the app
        res.redirect('/');
    } catch (error) {
        console.error('LinkedIn auth error:', error);
        res.status(500).send('Authentication failed');
    }
});

// Search Endpoints
app.post('/api/search', async (req, res) => {
    try {
        const { platforms, timeRange, engagementLevel } = req.body;
        
        // Initialize results array
        const results = [];
        
        // Search each platform
        for (const platform of platforms) {
            let platformResults = [];
            
            switch (platform) {
                case 'reddit':
                    platformResults = await searchReddit(timeRange, engagementLevel);
                    break;
                case 'twitter':
                    platformResults = await searchTwitter(timeRange, engagementLevel);
                    break;
                case 'linkedin':
                    platformResults = await searchLinkedIn(timeRange, engagementLevel);
                    break;
            }
            
            // Process and analyze each result
            for (const result of platformResults) {
                // Analyze sentiment and problem indicators
                const sentiment = await analyzeSentiment(result.content);
                const problemIndicators = await detectProblemIndicators(result.content);
                
                // Create search result document
                const searchResult = new SearchResult({
                    platform,
                    title: result.title,
                    content: result.content,
                    url: result.url,
                    engagement: {
                        likes: result.likes || 0,
                        comments: result.comments || 0,
                        shares: result.shares || 0
                    },
                    metadata: {
                        author: result.author,
                        date: result.date,
                        subreddit: result.subreddit,
                        hashtags: result.hashtags || [],
                        mentions: result.mentions || []
                    },
                    sentiment,
                    problemIndicators,
                    trending: result.trending || false
                });
                
                await searchResult.save();
                results.push(searchResult);
            }
        }
        
        // Sort results by problem relevance and engagement
        results.sort((a, b) => {
            const aScore = a.problemIndicators.length * (a.engagement.likes + a.engagement.comments);
            const bScore = b.problemIndicators.length * (b.engagement.likes + b.engagement.comments);
            return bScore - aScore;
        });
        
        res.json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Audience Management Endpoints
app.post('/api/audiences', async (req, res) => {
    try {
        const audience = new Audience(req.body);
        await audience.save();
        res.json(audience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/audiences/:id/insights', async (req, res) => {
    try {
        const insights = await getAudienceInsights(req.params.id);
        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI Categorization Endpoints
app.post('/api/categorize', async (req, res) => {
    try {
        const { content } = req.body;
        const categories = await getAICategories(content);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Trend Tracking Endpoints
app.get('/api/trends', async (req, res) => {
    try {
        const trends = await getTrends();
        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Competitive Analysis Endpoints
app.get('/api/competitors', async (req, res) => {
    try {
        const analysis = await getCompetitorAnalysis();
        res.json(analysis);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper functions for platform-specific searches
async function searchReddit(timeRange, engagementLevel) {
    try {
        const r = new snoowrap({
            userAgent: 'MarketingSudo/1.0',
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD
        });

        const subreddits = ['marketing', 'digitalmarketing', 'content_marketing', 'socialmedia'];
        const results = [];

        for (const subreddit of subreddits) {
            const posts = await r.getSubreddit(subreddit)
                .search({
                    query: 'problem OR issue OR challenge OR struggle',
                    time: timeRange,
                    sort: 'top',
                    limit: 10
                });

            for (const post of posts) {
                if (meetsEngagementLevel(post, engagementLevel)) {
                    results.push({
                        title: post.title,
                        content: post.selftext,
                        url: `https://reddit.com${post.permalink}`,
                        author: post.author.name,
                        date: new Date(post.created_utc * 1000).toISOString(),
                        subreddit: post.subreddit_name_prefixed,
                        likes: post.ups,
                        comments: post.num_comments,
                        trending: post.ups > 100
                    });
                }
            }
        }

        return results;
    } catch (error) {
        console.error('Reddit search error:', error);
        return [];
    }
}

async function searchTwitter(timeRange, engagementLevel) {
    try {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET
        });

        const tweets = await client.v2.search('problem OR issue OR challenge OR struggle', {
            'tweet.fields': ['public_metrics', 'created_at', 'author_id'],
            max_results: 50
        });

        return tweets.data.map(tweet => ({
            title: tweet.text.substring(0, 100),
            content: tweet.text,
            url: `https://twitter.com/user/status/${tweet.id}`,
            author: tweet.author_id,
            date: tweet.created_at,
            likes: tweet.public_metrics.like_count,
            comments: tweet.public_metrics.reply_count,
            shares: tweet.public_metrics.retweet_count,
            trending: tweet.public_metrics.like_count > 100
        }));
    } catch (error) {
        console.error('Twitter search error:', error);
        return [];
    }
}

async function searchLinkedIn(timeRange, engagementLevel) {
    try {
        if (!linkedinConfig.accessToken) {
            throw new Error('LinkedIn access token not available');
        }

        const client = axios.create({
            baseURL: 'https://api.linkedin.com/v2',
            headers: {
                'Authorization': `Bearer ${linkedinConfig.accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });

        // Search for posts
        const searchResponse = await client.get('/posts', {
            params: {
                q: 'problem OR issue OR challenge OR struggle',
                count: 50,
                start: 0
            }
        });

        const posts = searchResponse.data.elements;
        return posts.map(post => ({
            title: post.specificContent.commercialContent.title,
            content: post.specificContent.commercialContent.text,
            url: `https://www.linkedin.com/feed/update/${post.id}`,
            author: post.author,
            date: new Date(post.created.time).toISOString(),
            likes: post.likesSummary.totalLikes,
            comments: post.commentsSummary.totalFirstLevelComments,
            shares: post.sharesSummary.totalShares,
            trending: post.likesSummary.totalLikes > 50
        }));
    } catch (error) {
        console.error('LinkedIn search error:', error);
        return [];
    }
}

function meetsEngagementLevel(post, level) {
    const engagement = post.ups + post.num_comments;
    switch (level) {
        case 'High Engagement':
            return engagement > 100;
        case 'Medium Engagement':
            return engagement > 50;
        case 'Low Engagement':
            return engagement > 10;
        default:
            return true;
    }
}

// Helper function to analyze sentiment
async function analyzeSentiment(text) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Analyze the sentiment of this text and return only one word: positive, negative, or neutral:\n\n${text}`,
            max_tokens: 10,
            temperature: 0.3
        });
        
        return response.data.choices[0].text.trim().toLowerCase();
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        return 'neutral';
    }
}

// Helper function to detect problem indicators
async function detectProblemIndicators(text) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `Analyze this text and identify specific problems or pain points mentioned. Return a JSON array of problems:\n\n${text}\n\nProblems:`,
            max_tokens: 150,
            temperature: 0.5
        });
        
        const problems = JSON.parse(response.data.choices[0].text.trim());
        return problems;
    } catch (error) {
        console.error('Problem detection error:', error);
        return [];
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 