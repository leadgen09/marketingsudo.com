const mongoose = require('mongoose');

const audienceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    interests: [{
        type: String
    }],
    demographics: {
        ageRange: String,
        location: String,
        industry: String
    },
    behavior: {
        engagementLevel: String,
        preferredPlatforms: [String],
        activityPatterns: [String]
    },
    metrics: {
        growthRate: Number,
        engagementScore: Number,
        retentionRate: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Audience', audienceSchema); 