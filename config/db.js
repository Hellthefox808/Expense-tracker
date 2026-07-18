const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connString = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker';
        
        const conn = await mongoose.connect(connString);
        
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Database Connection Error: ${err.message}`);
        // Exit process with failure in production, or let it retry in dev
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

// Monitor mongoose connection states
mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
});

module.exports = connectDB;
