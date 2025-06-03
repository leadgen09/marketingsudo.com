const mongoose = require('mongoose');

const competitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    socialMedia: {
        twitter: String,
        linkedin: String,
        reddit: String
    },
    metrics: {
        mentions: {
            total: Number,
            byPlatform: {
                twitter: Number,
                linkedin: Number,
                reddit: Number
            }
        },
        sentiment: {
            overall: String,
            byPlatform: {
                twitter: String,
                linkedin: String,
                reddit: String
            }
        },
        engagement: {
            average: Number,
            byPlatform: {
                twitter: Number,
                linkedin: Number,
                reddit: Number
            }
        }
    },
    trends: [{
        topic: String,
        growth: Number,
        sentiment: String
    }],
    keywords: [{
        term: String,
        frequency: Number,
        sentiment: String
    }],
    marketShare: {
        type: Number,
        min: 0,
        max: 100
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Competitor', competitorSchema); 