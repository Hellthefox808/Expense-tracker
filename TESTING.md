# Testing Guide

We write automated integration and unit tests using **Jest** and **Supertest** to verify routing logic, database queries, and input filters.

## Test Environment Isolation

To protect development datasets, tests dynamically override standard MongoDB parameters before loading the server module:

- The test runner injects `NODE_ENV=test` and runs against a clean MongoDB instance (defined by `mongodb://localhost:27017/expense_tracker_test`).
- Databases are automatically wiped clean inside Jest lifecycle hooks (`beforeEach` and `afterAll`).

---

## Running Automated Tests

```bash
# Execute Jest test suite
npm test
```

### Test Coverage Checklist

1. **Schema Assertions:** Required fields, Category restrictions, and amount bounds checks.
2. **Dashboard Rendering:** Tests GET `/` response, pagination, and empty table fallbacks.
3. **Filter Logic:** Verifies server-side description matching and category sorting query filters.
4. **Mutations Validation:** Tests POST `/add` inputs verification and DELETE `/delete/:id` logic.
