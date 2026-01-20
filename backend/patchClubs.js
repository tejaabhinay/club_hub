const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Club = require('./models/Club');

dotenv.config();

const patchClubs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Patching...');

        const clubs = await Club.find({});
        console.log(`Found ${clubs.length} clubs.`);

        for (const club of clubs) {
            let updated = false;

            if (club.isRecruiting === undefined) {
                club.isRecruiting = false;
                updated = true;
            }

            if (!club.hierarchy) {
                club.hierarchy = [];
                updated = true;
            }
            
            // Also ensure we didn't accidentally save it as null previously
            if (club.hierarchy === null) {
                club.hierarchy = [];
                updated = true;
            }

            if (updated) {
                await club.save();
                console.log(`Patched club: ${club.name}`);
            }
        }

        console.log('All clubs patched successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error patching clubs:', err);
        process.exit(1);
    }
};

patchClubs();
