require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to Database
connectDB();

// Security HTTP Headers with tailored Content Security Policy for CDNs
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'", 
                "cdn.tailwindcss.com", 
                "cdn.jsdelivr.net", 
                "'unsafe-inline'", 
                "'unsafe-eval'"
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "fonts.googleapis.com", 
                "cdn.tailwindcss.com"
            ],
            fontSrc: [
                "'self'", 
                "fonts.gstatic.com"
            ],
            imgSrc: [
                "'self'", 
                "data:", 
                "blob:"
            ],
            connectSrc: [
                "'self'"
            ]
        }
    }
}));

// Rate Limiting (mitigate brute force / DDoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to 150 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

// Request Logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// Set EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Enable Method Override (for DELETE support via query/body)
app.use(methodOverride('_method'));

// Mount Application Routes
app.use('/', expenseRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.statusCode = 404;
    next(err);
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
let server;

if (process.env.NODE_ENV !== 'test') {
    server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

// Graceful shutdown handling
const gracefulShutdown = () => {
    console.log('Initiating graceful shutdown...');
    if (server) {
        server.close(() => {
            console.log('HTTP server closed.');
            const mongoose = require('mongoose');
            mongoose.connection.close().then(() => {
                console.log('MongoDB connection closed.');
                process.exit(0);
            }).catch((err) => {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            });
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = app; // Export for integration testing
