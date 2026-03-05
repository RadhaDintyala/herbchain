const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chain', require('./routes/api'));

const PORT = process.env.PORT || 5000;

// Since MongoDB might not be installed on the user's machine or running,
// we will start the server and attempt to connect, but not crash if it fails.
// We'll also provide a fallback in auth to use in-memory users if Mongo fails.

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        app.locals.mongoConnected = true;
        return;
    }
    try {
        const dbUri = process.env.MONGO_URI || "mongodb+srv://24hp1a0539_db_user:rbgJ7urL44E3LFR1@cluster0.4r1hdf0.mongodb.net/herbchain?appName=Cluster0";
        await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        app.locals.mongoConnected = true;
        console.log('MongoDB Connected seamlessly...');
    } catch (err) {
        console.error('MongoDB connection failed. Using in-memory fallback.', err.message);
        app.locals.mongoConnected = false;
    }
};

// Vercel Serverless handling or Local running
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running locally on port ${PORT}`);
            setInterval(() => { }, 1000 * 60 * 60);
        });
    });
} else {
    // For Vercel Serverless Functions
    app.use(async (req, res, next) => {
        await connectDB();
        next();
    });
}

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
