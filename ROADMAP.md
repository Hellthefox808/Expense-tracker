# Project Roadmap

This roadmap details the planned future milestones and enhancements for the Expense Tracker.

## Milestone 1: Multi-User Authentication (Planned)
- Implement user sign-up, login, and sessions using Passport.js or JSON Web Tokens (JWT).
- Support isolated user databases so each user can manage their private transactions.
- Implement session storage inside Redis or MongoDB.

## Milestone 2: Recurring Outflows & Budgets (Planned)
- Add support for setting monthly limits/budgets per category.
- Display visual gauges warning users when category spending exceeds 80% of budget.
- Configure cron-based recurring logs for fixed subscriptions (e.g., streaming, rent).

## Milestone 3: Advanced Visual Reporting (Planned)
- Support CSV/PDF export of historical expense statements.
- Integrate Chart.js line charts tracking monthly trends over a 12-month period.
- Add category filters based on custom date ranges.
