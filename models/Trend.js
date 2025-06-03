const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['reddit', 'twitter', 'linkedin', 'all']
    },
    metrics: {
        mentions: Number,
        engagement: Number,
        growthRate: Number,
        sentiment: {
            positive: Number,
            negative: Number,
            neutral: Number
        }
    },
    timeSeries: [{
        timestamp: Date,
        value: Number
    }],
    relatedTopics: [{
        topic: String,
        correlation: Number
    }],
    influencers: [{
        name: String,
        platform: String,
        influenceScore: Number
    }],
    categories: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['emerging', 'growing', 'peaking', 'declining'],
        default: 'emerging'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trend', trendSchema); 