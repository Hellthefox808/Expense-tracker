# Contributing to Ravi's Expense Tracker

Thank you for your interest in contributing to our project! To keep things clean, secure, and maintainable, please follow these guidelines:

## Contribution Workflow

1. **Fork the Repository:** Create a personal fork on GitHub.
2. **Clone locally:** Set up your workspace and install dependencies:
   ```bash
   npm install
   ```
3. **Configure Environment:** Set up your local `.env` configuration.
4. **Create a branch:** Create a feature branch matching standard names:
   - `feature/your-feature-name`
   - `bugfix/your-bugfix-name`
5. **Run Checks:** Ensure your edits pass syntax validation and automated tests:
   ```bash
   npm test
   ```
6. **Commit Changes:** Use descriptive commit messages. Signed commits are highly encouraged.
7. **Submit PR:** Submit a Pull Request targeting the `main` branch. Provide a brief explanation of what was changed and attach test logs if necessary.

## Code Standards

- **Formatting:** Write clean, consistent code. Add comments describing helper functions.
- **Architectural Isolation:** Follow the Model-View-Controller pattern. Never write database queries directly inside routes or EJS files.
- **Security Protections:** Sanitize user inputs and handle potential exception states gracefully using the global boundary error handler.
