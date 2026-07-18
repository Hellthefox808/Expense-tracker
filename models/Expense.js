const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [100, 'Description cannot exceed 100 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['Food', 'Education', 'Technology', 'Entertainment', 'Other'],
            message: '{VALUE} is not a valid category'
        }
    },
    date: {
        type: Date,
        default: Date.now,
        index: true // Index for performance optimization on chronological sorting
    }
});

// Compound index for category and date filtering optimization
expenseSchema.index({ category: 1, date: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
