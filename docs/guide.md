# Project User & Developer Guide

Welcome to the Expense Tracker guide. This document explains the architecture components, data design, and local usage procedures.

## Core Workflows

1. **Dashboard Loading:** When you visit `/`, the controller coordinates pagination bounds, queries the database, aggregates outflow statistics per category via MongoDB Aggregations, and compiles metrics.
2. **Transaction Insertion:** When you submit a transaction, inputs are routed through validation checks to prevent malformed or invalid entries. On success, the document is saved and index triggers sort the feed chronologically.
3. **Transaction Deletion:** Prompts a 3D dialog modal. On confirmation, the backend deletes the target ID and updates total metrics.

## Schema Information

The model defines properties with strict validation constraints:
- `description`: String, 1-100 characters.
- `amount`: Number, >= 0.01.
- `category`: Enum String matching specific values (`Food`, `Education`, `Technology`, `Entertainment`, `Other`).
- `date`: Date, defaults to current timestamp.
