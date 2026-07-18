const validateExpenseInput = (req, res, next) => {
    const { description, amount, category } = req.body;
    const validCategories = ['Food', 'Education', 'Technology', 'Entertainment', 'Other'];
    
    const errors = [];
    
    if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.push('Description is required.');
    } else if (description.length > 100) {
        errors.push('Description cannot exceed 100 characters.');
    }
    
    const parsedAmount = Number(amount);
    if (amount === undefined || amount === null || amount === '') {
        errors.push('Amount is required.');
    } else if (isNaN(parsedAmount) || parsedAmount < 0.01) {
        errors.push('Amount must be at least ₹0.01.');
    }
    
    if (!category || !validCategories.includes(category)) {
        errors.push('Invalid category specified.');
    }
    
    if (errors.length > 0) {
        req.validationErrors = errors;
    }
    
    next();
};

module.exports = {
    validateExpenseInput
};
