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
    if (isConnected) return;
    try {
        const dbUri = process.env.MONGO_URI;
        if (!dbUri) {
            throw new Error("MONGO_URI is missing in environment variables!");
        }

        await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 5000,
        });
        
        isConnected = true;
        console.log('MongoDB Connected seamlessly...');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1); // Exit if DB connection fails on startup
    }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chain', require('./routes/api'));

// Health Check (Good for Render to know the app is alive)
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 5000;

// THE FIX: Listen on all interfaces (0.0.0.0) for Cloud Deployment
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is LIVE and listening on port ${PORT}`);
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;