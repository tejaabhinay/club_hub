const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Club = require('./models/Club');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        // Optional: Clear existing data to avoid duplicates if re-running
        // await User.deleteMany({});
        // await Club.deleteMany({});

        console.log('Creating SuperAdmin...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Check if superadmin already exists
        let superAdmin = await User.findOne({ email: 'admin@uni.com' });
        if (!superAdmin) {
            superAdmin = await User.create({
                name: 'Super Admin',
                email: 'admin@uni.com',
                password: hashedPassword,
                role: 'superadmin'
            });
            console.log('SuperAdmin created successfully.');
        } else {
            console.log('SuperAdmin already exists.');
        }

        console.log('Creating Sample Club...');
        // Check if club already exists
        let club = await Club.findOne({ name: 'The Coding Titans' });
        if (!club) {
            club = await Club.create({
                name: 'The Coding Titans',
                description: 'A club for MERN enthusiasts',
                achievements: ['Best Web App 2025', 'Hackathon Winners'],
                head: superAdmin._id,
                members: [superAdmin._id]
            });
            
            // Add club to SuperAdmin's joinedClubs
            superAdmin.joinedClubs.push(club._id);
            await superAdmin.save();

            console.log('Sample Club created successfully.');
        } else {
            console.log('Sample Club already exists.');
        }

        console.log('Seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
