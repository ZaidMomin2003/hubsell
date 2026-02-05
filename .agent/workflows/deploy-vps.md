---
description: How to deploy Cleanmails to a Linux VPS (Contabo/Ubuntu)
---

# Deploying Cleanmails to your Contabo VPS

Follow these steps to set up your email verification engine on your new server (**167.86.126.159**).

## 1. Connect to your VPS
Open **PuTTY**, enter the IP `167.86.126.159`, and log in (usually as `root`).

## 2. Server Preparation
Run these commands to update your system and install the necessary tools:
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y
```

## 3. Upload/Setup the Code
The easiest way is to clone your repository or upload the files. If you don't have Git set up yet, you can create a folder and copy the files:
```bash
mkdir cleanmails && cd cleanmails
```
*(You will need to transfer your files here using SCP, FileZilla, or Git)*

## 4. Launch with Docker
Once the `Dockerfile` and `docker-compose.yml` are on the server, simply run:
```bash
docker-compose up -d --build
```

## 5. Access the Dashboard
Your application will be live at:
`http://167.86.126.159:8080`

### Important Environment Variables
You should update your `docker-compose.yml` on the server with your specific settings:
- `VALIDATION_RATE`: Speed limit
- `LOCAL_IPS`: Your VPS local IPs for rotation
- `SMTP_FROM_EMAIL`: Your "From" address

---
**Note:** Contabo is your hosting provider. You don't "install" Contabo; you install the software (Cleanmails) onto the server they provided.
