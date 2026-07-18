const Expense = require('../models/Expense');

// Helper to fetch and aggregate dashboard data
const getDashboardData = async (req) => {
    const filter = {};
    
    // Server-side filtering
    if (req.query.search) {
        filter.description = { $regex: req.query.search, $options: 'i' };
    }
    
    if (req.query.category && req.query.category !== 'All') {
        filter.category = req.query.category;
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const count = await Expense.countDocuments(filter);
    const expenses = await Expense.find(filter).sort({ date: -1 }).skip(skip).limit(limit);
    const totalPages = Math.ceil(count / limit) || 1;

    // Database Aggregation for Chart & Total Outflow
    const stats = await Expense.aggregate([
        {
            $group: {
                _id: '$category',
                total: { $sum: '$amount' }
            }
        }
    ]);

    let chartData = {
        'Food': 0, 'Education': 0, 'Technology': 0, 'Entertainment': 0, 'Other': 0
    };
    let totalSpent = 0;

    stats.forEach(item => {
        if (chartData[item._id] !== undefined) {
            chartData[item._id] = item.total;
        }
        totalSpent += item.total;
    });

    // Fetch highest expense item
    const highestExpenseItem = await Expense.findOne(filter).sort({ amount: -1 }).limit(1);
    const highestExpense = highestExpenseItem ? highestExpenseItem.amount : 0;
    const highestExpenseName = highestExpenseItem ? highestExpenseItem.description : 'None';

    return {
        expenses,
        chartData,
        totalSpent,
        totalCount: count,
        highestExpense,
        highestExpenseName,
        page,
        totalPages,
        filters: {
            search: req.query.search || '',
            category: req.query.category || 'All'
        }
    };
};

// GET: Dashboard page
exports.getDashboard = async (req, res, next) => {
    try {
        const dashboardData = await getDashboardData(req);
        res.render('index', { 
            ...dashboardData, 
            errors: null 
        });
    } catch (err) {
        next(err);
    }
};

// POST: Add new expense
exports.addExpense = async (req, res, next) => {
    try {
        // If validation middleware found errors
        if (req.validationErrors) {
            const dashboardData = await getDashboardData(req);
            return res.status(400).render('index', {
                ...dashboardData,
                errors: req.validationErrors
            });
        }

        const { description, amount, category } = req.body;
        
        await Expense.create({ 
            description: description.trim(), 
            amount: Number(amount), 
            category 
        });
        
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

// DELETE: Remove expense
exports.deleteExpense = async (req, res, next) => {
    try {
        const expense = await Expense.findByIdAndDelete(req.params.id);
        
        if (!expense) {
            const error = new Error('Expense not found');
            error.statusCode = 404;
            throw error;
        }
        
        res.redirect('/');
    } catch (err) {
        next(err);
    }
};

// PUT: Edit existing expense
exports.editExpense = async (req, res, next) => {
    try {
        // If validation middleware found errors
        if (req.validationErrors) {
            const dashboardData = await getDashboardData(req);
            return res.status(400).render('index', {
                ...dashboardData,
                errors: req.validationErrors
            });
        }

        const { description, amount, category } = req.body;
        const expense = await Expense.findByIdAndUpdate(
            req.params.id,
            {
                description: description.trim(),
                amount: Number(amount),
                category
            },
            { new: true, runValidators: true }
        );

        if (!expense) {
            const error = new Error('Expense not found');
            error.statusCode = 404;
            throw error;
        }

        res.redirect('/');
    } catch (err) {
        next(err);
    }
};
