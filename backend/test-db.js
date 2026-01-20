const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// Explicitly specify the path to ensure it's finding the right .env
// Although dotenv.config() defaults to .env in cwd
const envResult = dotenv.config({ path: path.join(__dirname, '.env') });

if (envResult.error) {
    console.error("Error loading .env file:", envResult.error);
}

console.log("Checking environment variables...");
console.log("Keys in process.env:", Object.keys(process.env).filter(k => !k.startsWith('npm_'))); // Filter npm vars

if (process.env.MONGO_URI) {
    console.log("MONGO_URI is DEFINED (type: " + typeof process.env.MONGO_URI + ")");
} else {
    console.error("MONGO_URI is UNDEFINED or Empty");
}

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    } catch (err) {
        console.error("MongoDB Connection Failed:");
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();
