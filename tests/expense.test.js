const TEST_MONGO_URI = 'mongodb://localhost:27017/expense_tracker_test';
process.env.MONGO_URI = TEST_MONGO_URI;

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Expense = require('../models/Expense');

beforeAll(async () => {
    // If mongoose has an active connection, disconnect first to avoid conflicts
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(TEST_MONGO_URI);
});

afterAll(async () => {
    // Clean up test database collections and disconnect
    await Expense.deleteMany({});
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Expense.deleteMany({});
});

describe('Expense Tracker Test Suite', () => {

    describe('Model Validation tests', () => {
        
        it('should require description, amount, and category', async () => {
            const exp = new Expense({});
            let err = null;
            try {
                await exp.validate();
            } catch (error) {
                err = error;
            }
            expect(err).not.toBeNull();
            expect(err.errors.description).toBeDefined();
            expect(err.errors.amount).toBeDefined();
            expect(err.errors.category).toBeDefined();
        });

        it('should reject descriptions longer than 100 characters', async () => {
            const exp = new Expense({
                description: 'a'.repeat(101),
                amount: 10,
                category: 'Food'
            });
            let err = null;
            try {
                await exp.validate();
            } catch (error) {
                err = error;
            }
            expect(err).not.toBeNull();
            expect(err.errors.description).toBeDefined();
        });

        it('should reject amounts equal to or less than 0', async () => {
            const exp = new Expense({
                description: 'Apples',
                amount: 0,
                category: 'Food'
            });
            let err = null;
            try {
                await exp.validate();
            } catch (error) {
                err = error;
            }
            expect(err).not.toBeNull();
            expect(err.errors.amount).toBeDefined();
        });

        it('should reject invalid categories', async () => {
            const exp = new Expense({
                description: 'Apples',
                amount: 10,
                category: 'Car' // Invalid enum value
            });
            let err = null;
            try {
                await exp.validate();
            } catch (error) {
                err = error;
            }
            expect(err).not.toBeNull();
            expect(err.errors.category).toBeDefined();
        });

        it('should accept valid configurations', async () => {
            const exp = new Expense({
                description: 'Web development books',
                amount: 120.50,
                category: 'Education'
            });
            let err = null;
            try {
                await exp.validate();
            } catch (error) {
                err = error;
            }
            expect(err).toBeNull();
        });

    });

    describe('GET / - Dashboard', () => {

        it('should return 200 OK and show page layout and outline empty list', async () => {
            const res = await request(app)
                .get('/')
                .expect(200);

            expect(res.text).toContain("Ravi's Expense Tracker");
            expect(res.text).toContain('No transactions found.');
            expect(res.text).toContain('₹0');
        });

        it('should list and aggregate existing transactions', async () => {
            await Expense.create([
                { description: 'Burger', amount: 300, category: 'Food' },
                { description: 'Tutorial', amount: 500, category: 'Education' },
                { description: 'Keyboard', amount: 200, category: 'Technology' }
            ]);

            const res = await request(app)
                .get('/')
                .expect(200);

            expect(res.text).toContain('Burger');
            expect(res.text).toContain('Tutorial');
            expect(res.text).toContain('Keyboard');
            expect(res.text).toContain('₹1000'); // Sum total spent
        });

        it('should apply category and description search filters server-side', async () => {
            await Expense.create([
                { description: 'Burger', amount: 300, category: 'Food' },
                { description: 'Macbook', amount: 150000, category: 'Technology' }
            ]);

            // Filter for Food
            const resFood = await request(app)
                .get('/?category=Food')
                .expect(200);
            expect(resFood.text).toContain('Burger');
            expect(resFood.text).not.toContain('Macbook');

            // Search for Mac
            const resSearch = await request(app)
                .get('/?search=mac')
                .expect(200);
            expect(resSearch.text).toContain('Macbook');
            expect(resSearch.text).not.toContain('Burger');
        });

    });

    describe('POST /add - Add Transaction', () => {

        it('should create new transaction and redirect to / on success', async () => {
            const res = await request(app)
                .post('/add')
                .send({
                    description: 'Subscription',
                    amount: '499',
                    category: 'Technology'
                })
                .expect(302);

            expect(res.headers.location).toBe('/');
            
            const count = await Expense.countDocuments();
            expect(count).toBe(1);
            
            const exp = await Expense.findOne();
            expect(exp.description).toBe('Subscription');
            expect(exp.amount).toBe(499);
            expect(exp.category).toBe('Technology');
        });

        it('should return 400 Bad Request and list errors on invalid payload', async () => {
            const res = await request(app)
                .post('/add')
                .send({
                    description: '',
                    amount: '-10',
                    category: 'InvalidCat'
                })
                .expect(400);

            expect(res.text).toContain('Please correct the following errors:');
            expect(res.text).toContain('Description is required.');
            expect(res.text).toContain('Amount must be at least ₹0.01.');
            expect(res.text).toContain('Invalid category specified.');
            
            const count = await Expense.countDocuments();
            expect(count).toBe(0);
        });

    });

    describe('DELETE /delete/:id - Remove Transaction', () => {

        it('should delete existing transaction and redirect to /', async () => {
            const exp = await Expense.create({
                description: 'Snacks',
                amount: 50,
                category: 'Food'
            });

            const res = await request(app)
                .delete(`/delete/${exp._id}`)
                .expect(302);

            expect(res.headers.location).toBe('/');
            
            const found = await Expense.findById(exp._id);
            expect(found).toBeNull();
        });

        it('should return 404 for non-existent transaction ids', async () => {
            const validFakeId = new mongoose.Types.ObjectId();
            await request(app)
                .delete(`/delete/${validFakeId}`)
                .expect(404);
        });

    });

    describe('PUT /edit/:id - Edit Transaction', () => {

        it('should update existing transaction and redirect to / on success', async () => {
            const exp = await Expense.create({
                description: 'Snacks',
                amount: 50,
                category: 'Food'
            });

            const res = await request(app)
                .put(`/edit/${exp._id}`)
                .send({
                    description: 'Healthy Snacks',
                    amount: '120.50',
                    category: 'Food'
                })
                .expect(302);

            expect(res.headers.location).toBe('/');
            
            const updated = await Expense.findById(exp._id);
            expect(updated.description).toBe('Healthy Snacks');
            expect(updated.amount).toBe(120.50);
            expect(updated.category).toBe('Food');
        });

        it('should return 400 Bad Request and list errors on invalid payload', async () => {
            const exp = await Expense.create({
                description: 'Notebook',
                amount: 80,
                category: 'Education'
            });

            const res = await request(app)
                .put(`/edit/${exp._id}`)
                .send({
                    description: '',
                    amount: '0',
                    category: 'InvalidCategory'
                })
                .expect(400);

            expect(res.text).toContain('Please correct the following errors:');
            expect(res.text).toContain('Description is required.');
            expect(res.text).toContain('Amount must be at least ₹0.01.');
            expect(res.text).toContain('Invalid category specified.');
            
            const unchanged = await Expense.findById(exp._id);
            expect(unchanged.description).toBe('Notebook');
            expect(unchanged.amount).toBe(80);
        });

        it('should return 404 for non-existent transaction ids', async () => {
            const validFakeId = new mongoose.Types.ObjectId();
            await request(app)
                .put(`/edit/${validFakeId}`)
                .send({
                    description: 'Books',
                    amount: '400',
                    category: 'Education'
                })
                .expect(404);
        });

    });

});
