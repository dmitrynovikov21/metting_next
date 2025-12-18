#!/bin/bash
SERVER_IP="95.181.162.229"
SERVER_PASS="pxRMFcL6HWcX"
SERVER_USER="root"
REMOTE_DIR="/root/gravity"

# Install sshpass if strictly needed (I ran brew install already)

echo "🚀 Deploying to $SERVER_IP..."

# 1. Create remote directory
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

# 2. Sync files (excluding node_modules and .git)
# We sync the current directory to remote
echo "📦 Syncing files..."
sshpass -p "$SERVER_PASS" rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'venv' --exclude '__pycache__' ./ $SERVER_USER@$SERVER_IP:$REMOTE_DIR

# 3. Build and Run Docker Compose
sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR && docker compose -f docker-compose.prod.yml down && docker compose -f docker-compose.prod.yml up --build -d"

echo "✅ App deployed! Check http://$SERVER_IP:3000"
