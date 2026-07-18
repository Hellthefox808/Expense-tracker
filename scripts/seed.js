const mongoose = require('mongoose');
const Expense = require('../models/Expense');
require('dotenv').config();

const seedExpenses = [
    { description: 'Vercel Pro Subscription', amount: 1600, category: 'Technology', date: new Date() },
    { description: 'Team Lunch (Pizza)', amount: 2400, category: 'Food', date: new Date(Date.now() - 24*60*60*1000) },
    { description: 'Udemy Node.js Masterclass', amount: 800, category: 'Education', date: new Date(Date.now() - 3*24*60*60*1000) },
    { description: 'Movie Tickets (IMAX)', amount: 1200, category: 'Entertainment', date: new Date(Date.now() - 5*24*60*60*1000) },
    { description: 'Office Stationery', amount: 350, category: 'Other', date: new Date(Date.now() - 7*24*60*60*1000) }
];

const seed = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
        await mongoose.connect(uri);
        console.log('Connected to Database for seeding...');
        
        await Expense.deleteMany({});
        console.log('Cleared existing expenses.');
        
        await Expense.insertMany(seedExpenses);
        console.log('Successfully seeded database with sample transactions!');
        
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
