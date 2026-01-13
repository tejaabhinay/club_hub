const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    clubId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    registeredStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    attendedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Event', eventSchema);
