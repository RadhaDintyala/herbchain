const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        app.locals.mongoConnected = true;
        return;
    }
    try {
        // Updated: Strictly using the environment variable for security
        const dbUri = process.env.MONGO_URI;
        
        if (!dbUri) {
            throw new Error("MONGO_URI is missing in environment variables!");
        }

        await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 5000,
        });
        
        isConnected = true;
        app.locals.mongoConnected = true;
        console.log('MongoDB Connected seamlessly...');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        app.locals.mongoConnected = false;
    }
};

// Vercel Serverless handling or Local running
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    // Local logic handled below
} else {
    // For Vercel Serverless Functions
    app.use(async (req, res, next) => {
        await connectDB();
        next();
    });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chain', require('./routes/api'));

const PORT = process.env.PORT || 5000;

// Local running
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running locally on port ${PORT}`);
        });
    });
}

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;