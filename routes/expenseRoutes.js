const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { validateExpenseInput } = require('../middleware/validation');

// Dashboard Route
router.get('/', expenseController.getDashboard);

// Add Expense Route
router.post('/add', validateExpenseInput, expenseController.addExpense);

// Delete Expense Route
router.delete('/delete/:id', expenseController.deleteExpense);

module.exports = router;
