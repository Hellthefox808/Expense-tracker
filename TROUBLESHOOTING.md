# Troubleshooting Guide

This guide describes issues commonly encountered when running the Expense Tracker locally or in production, and how to resolve them.

---

## 1. Port Conflict (`EADDRINUSE`)

### Symptom:
`Error: listen EADDRINUSE: address already in use :::3001` or `:::3000`

### Cause:
Another application is already listening on the designated port.

### Fix:
Change the active port mapping inside the `.env` file:
```env
PORT=3002
```

---

## 2. Database Connection Failures (`MongooseServerSelectionError`)

### Symptom:
`MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster`

### Cause:
Local MongoDB daemon is stopped or firewall blocked connectivity.

### Fix:
1. Confirm MongoDB is active:
   ```powershell
   # Windows PowerShell
   Get-Service -Name MongoDB
   ```
2. Start MongoDB:
   ```powershell
   # Windows PowerShell
   Start-Service -Name MongoDB
   ```

---

## 3. Rate Limit Lockouts (`Too many requests`)

### Symptom:
Users get `Too many requests, please try again later.` (HTTP 429 status code) when attempting multiple modifications.

### Cause:
The express-rate-limit middleware throttled transactions to protect server CPU.

### Fix:
Modify rate limit parameters inside [server.js](file:///c:/Users/ravir/Desktop/PROJECT/p1/expense%20tracker/server.js) to accommodate larger team networks.
