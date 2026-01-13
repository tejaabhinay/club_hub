const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    achievements: [{
        type: String
    }],
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coordinators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isRecruiting: {
        type: Boolean,
        default: false
    },
    hierarchy: [{
        userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        roleName: String,
        level: Number
    }]
});

module.exports = mongoose.model('Club', clubSchema);
