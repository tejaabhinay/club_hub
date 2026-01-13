const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Club = require('./models/Club');
const Event = require('./models/Event');
const connectDB = require('./config/db');

dotenv.config();

const seedEvent = async () => {
    try {
        await connectDB();

        console.log('Finding Club...');
        const club = await Club.findOne({ name: 'The Coding Titans' });

        if (!club) {
            console.log('Club "The Coding Titans" not found. Please run seed.js first.');
            process.exit(1);
        }

        console.log('Creating Sample Event...');
        const eventData = {
            title: 'MERN Stack Workshop',
            description: 'Learn to build a Hub from scratch.',
            date: new Date(Date.now() + 86400000), // Tomorrow
            venue: 'Lab 404',
            clubId: club._id,
            registeredStudents: [],
            attendedStudents: [],
            isCompleted: false
        };

        // Check if event already exists to avoid duplicates
        const existingEvent = await Event.findOne({ title: eventData.title, clubId: club._id });
        
        if (existingEvent) {
             console.log('Sample Event already exists.');
        } else {
             await Event.create(eventData);
             console.log('📅 Sample Event Created!');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding event:', error);
        process.exit(1);
    }
};

seedEvent();
