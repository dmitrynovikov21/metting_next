#!/bin/bash
SERVER_IP="95.181.162.229"
# Use env variable or default hardcoded (fallback)
SERVER_PASS="${SSH_PASSWORD:-pxRMFcL6HWcX}"
SERVER_USER="root"
REMOTE_DIR="/root/gravity"

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo "sshpass could not be found. Installing via brew..."
    brew install sshpass
fi

echo "🚀 Deploying to $SERVER_IP..."

# 0. Setup Swap if missing (CRITICAL for Next.js build)
echo "🔧 Checking Swap configuration..."
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "
  if [ ! -f /swapfile ]; then
    echo 'Creating 4GB swapfile to handle Next.js build...'
    fallocate -l 4G /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=4096
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo '✅ Swap created.'
  else
    echo '✅ Swapfile already exists.'
  fi
  # Verify memory status
  free -h
"

# 1. Create remote directory
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_DIR"

# 2. Sync files (excluding node_modules and .git)
# We sync the current directory to remote
echo "📦 Syncing files..."
sshpass -p "$SERVER_PASS" rsync -avz --exclude 'node_modules' --exclude '.git' --exclude '.next' --exclude 'venv' --exclude '__pycache__' --exclude '_tmp_upload' ./ $SERVER_USER@$SERVER_IP:$REMOTE_DIR

# 3. Build and Run Docker Compose
echo "🏗 Building and starting containers..."
# We use 'docker compose' (v2) or 'docker-compose' (v1) detection
sshpass -p "$SERVER_PASS" ssh $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR && \
  docker compose -f docker-compose.prod.yml down || true && \
  docker compose -f docker-compose.prod.yml up --build -d && \
  docker system prune -f" # Cleanup to save space

echo "✅ App deployed! Check http://$SERVER_IP:3000 (front) and http://$SERVER_IP:8000 (api)"
