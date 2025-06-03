const mongoose = require('mongoose');

const searchResultSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
        enum: ['reddit', 'twitter', 'linkedin']
    },
    query: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    engagement: {
        likes: Number,
        comments: Number,
        shares: Number
    },
    metadata: {
        author: String,
        date: Date,
        subreddit: String,
        hashtags: [String],
        mentions: [String]
    },
    categories: [{
        type: String
    }],
    sentiment: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
    },
    trending: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SearchResult', searchResultSchema); 