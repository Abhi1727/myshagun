# MyShagun - GCP Deployment Guide

## ✅ COMPLETED
- ✅ Code pushed to GitHub: https://github.com/Abhi1727/myshagun
- ✅ Docker images built and pushed to Docker Hub
  - `abhishek1727/myshagun-backend:latest`
  - `abhishek1727/myshagun-web:latest`

---

## 🚀 GCP VM DEPLOYMENT (Debian)

### System Info
```
Instance: instance-20251022-150102
OS: Debian GNU/Linux 6.1.0-40-cloud-amd64
Domain: https://myshagun.us
API Domain: https://api.myshagun.us
```

---

## STEP 1: SSH into GCP VM

```bash
# From your local machine
gcloud compute ssh instance-20251022-150102 --zone=<your-zone>

# Or use GCP Console SSH
```

---

## STEP 2: Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

---

## STEP 3: Clone Repository

```bash
cd ~
git clone https://github.com/Abhi1727/myshagun.git
cd myshagun
```

---

## STEP 4: Setup Environment Variables

### Backend .env
```bash
cd backend
nano .env
```

**Add the following:**
```env
# Database Configuration (Use your existing MySQL)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Email Configuration (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=pariharabhishek34@gmail.com
EMAIL_PASS=your-gmail-app-password

# Server Configuration
PORT=5001
NODE_ENV=production
```

**Save and exit** (Ctrl+X, then Y, then Enter)

---

## STEP 5: Pull and Run Docker Containers

```bash
# Go to project root
cd ~/myshagun

# Pull latest images
docker pull abhishek1727/myshagun-backend:latest
docker pull abhishek1727/myshagun-web:latest

# Start containers
docker-compose up -d

# Check if containers are running
docker ps
```

You should see both containers running:
- `myshagun-backend` on port 5001
- `myshagun-web` on ports 80 & 443

---

## STEP 6: Setup Nginx Reverse Proxy (for HTTPS)

### Install Nginx and Certbot
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Configure Nginx for myshagun.us (Web)
```bash
sudo nano /etc/nginx/sites-available/myshagun.us
```

**Add:**
```nginx
server {
    listen 80;
    server_name myshagun.us www.myshagun.us;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Configure Nginx for api.myshagun.us (Backend API)
```bash
sudo nano /etc/nginx/sites-available/api.myshagun.us
```

**Add:**
```nginx
server {
    listen 80;
    server_name api.myshagun.us;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable Sites
```bash
sudo ln -s /etc/nginx/sites-available/myshagun.us /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.myshagun.us /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## STEP 7: Setup SSL Certificates (HTTPS)

```bash
# Get SSL certificate for myshagun.us
sudo certbot --nginx -d myshagun.us -d www.myshagun.us

# Get SSL certificate for api.myshagun.us
sudo certbot --nginx -d api.myshagun.us
```

**Follow the prompts:**
- Enter your email
- Agree to terms
- Choose option 2 (Redirect HTTP to HTTPS)

Certbot will automatically configure HTTPS and auto-renewal!

---

## STEP 8: Setup MySQL Database

### If MySQL is not installed:
```bash
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### Create Database and Tables:
```bash
# Login to MySQL
sudo mysql -u root -p

# Create database
CREATE DATABASE your_db_name;

# Create user and grant permissions
CREATE USER 'your_db_user'@'localhost' IDENTIFIED BY 'your_db_password';
GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_db_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Run Database Migration:
```bash
cd ~/myshagun/backend

# Create tables
node create_users_table.js
node create_profiles_table.js
node create_otps_table.js
node create_chat_tables.js

# Optional: Seed sample profiles
node seed_profiles.js
```

---

## STEP 9: Configure Firewall

```bash
# Allow HTTP, HTTPS, and API port
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5001/tcp
sudo ufw enable
```

---

## STEP 10: Verify Deployment

### Check if containers are running:
```bash
docker ps
```

### Check container logs:
```bash
# Backend logs
docker logs myshagun-backend

# Web logs
docker logs myshagun-web
```

### Test URLs:
```bash
# Test backend API
curl https://api.myshagun.us/api/profiles/featured

# Open website in browser
# https://myshagun.us
```

---

## 🔄 UPDATING THE APPLICATION

When you make changes and push to GitHub:

```bash
cd ~/myshagun

# Pull latest code
git pull origin main

# Pull latest Docker images
docker pull abhishek1727/myshagun-backend:latest
docker pull abhishek1727/myshagun-web:latest

# Restart containers
docker-compose down
docker-compose up -d
```

---

## 📊 USEFUL COMMANDS

### View logs:
```bash
# Backend logs (live)
docker logs -f myshagun-backend

# Web logs (live)
docker logs -f myshagun-web
```

### Restart containers:
```bash
docker-compose restart
```

### Stop containers:
```bash
docker-compose down
```

### Check Nginx status:
```bash
sudo systemctl status nginx
```

### Restart Nginx:
```bash
sudo systemctl restart nginx
```

### Check SSL certificate expiry:
```bash
sudo certbot certificates
```

---

## 🔧 TROUBLESHOOTING

### If containers won't start:
```bash
# Check logs
docker logs myshagun-backend
docker logs myshagun-web

# Verify .env file exists
ls -la ~/myshagun/backend/.env
```

### If website shows 502 Bad Gateway:
```bash
# Check if containers are running
docker ps

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### If SSL certificate issues:
```bash
# Force renew
sudo certbot renew --force-renewal
```

### Database connection issues:
```bash
# Make sure MySQL is running
sudo systemctl status mysql

# Test connection from backend container
docker exec -it myshagun-backend sh
# Inside container:
nc -zv localhost 3306
```

---

## 🎉 YOUR APP IS NOW LIVE!

- **Website:** https://myshagun.us
- **API:** https://api.myshagun.us
- **GitHub:** https://github.com/Abhi1727/myshagun
- **Docker Hub:**
  - Backend: https://hub.docker.com/r/abhishek1727/myshagun-backend
  - Web: https://hub.docker.com/r/abhishek1727/myshagun-web

---

## 📱 NEXT STEPS

1. **Mobile App:** Deploy to Play Store using the guide in `DEPLOYMENT_GUIDE.md`
2. **Monitoring:** Setup monitoring with tools like Datadog or New Relic
3. **Backups:** Setup automated MySQL backups
4. **CDN:** Consider using Cloudflare for better performance

---

**Need help?** Check the logs first with `docker logs` command!
