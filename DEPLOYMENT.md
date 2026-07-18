# Production Deployment Guidelines

This guide details steps to deploy and manage this application in a production environment.

## 🐳 Containerized Deployment (Recommended)
Docker Compose handles the application and MongoDB clustering automatically:

```bash
# Start in background mode
docker-compose up --build -d
```

---

## ⚙️ Standalone Server Setup (Bare Metal / VM)

### 1. Install Node.js & MongoDB
Ensure Node.js (>=18.x) and MongoDB (>=6.x) are running on the target machine.

### 2. Configure Environment Variables
Create a production `.env` file:
```env
PORT=80
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
NODE_ENV=production
```

### 3. Manage Process Lifecycle (PM2)
Install and run the process using **PM2** to guarantee automatic restarts on crash or system reboot:

```bash
# Install PM2 globally
npm install -p pm2 -g

# Start application
pm2 start server.js --name "expense-tracker"

# Save process list
pm2 save
pm2 startup
```

---

## 🔒 Security Hardening

- **SSL/TLS Termination:** Always place a reverse proxy like Nginx or Cloudflare in front of the application to enforce HTTPS.
- **Port Masking:** Ensure MongoDB (port 27017) is bound to `127.0.0.1` and not accessible from the public internet.
