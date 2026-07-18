# System Architecture & Design Patterns

This document details the architectural guidelines, layout, and safety components of the Expense Tracker.

## Architectural Model (MVC)

The repository implements a strict Model-View-Controller (MVC) pattern to ensure solid separation of concerns:

- **Model (`models/`):** Configures data schema boundaries, constraints, validation rules, and index optimization (such as compound index sorting on categories and dates).
- **View (`views/`):** Consists of EJS template files rendering structural UI layout with modern styling (Tailwind CSS, Glassmorphic rules) and client scripts.
- **Controller (`controllers/`):** Contains requests execution handlers, performing queries, pagination limits, and MongoDB Aggregations on the database server.
- **Routes (`routes/`):** Declares endpoint mappings translating HTTP methods directly to controller hooks.

---

## Security Infrastructure

We mount defensive layers directly on the Express server:

1. **Helmet CSP Policies:** Protects client sessions from Cross-Site Scripting (XSS) and code injection by restricting script/style assets to self and approved CDNs (Tailwind CSS, Chart.js).
2. **Express Rate Limiter:** Mitigates brute-force spamming and DDoS attempts by throttling IP connection attempts.
3. **Payload Sanitizer:** Validates request bodies against MongoDB injection structures and enforces type boundaries.
4. **Error Boundary Handler:** Catch-all Express middleware logging details server-side while outputting clean, safe, secret-free responses to users.
