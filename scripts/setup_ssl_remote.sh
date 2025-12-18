#!/bin/bash
SERVER_IP="95.181.162.229"
SERVER_PASS="pxRMFcL6HWcX"
SERVER_USER="root"
REMOTE_DIR="/root/gravity"
DOMAINS=("protocol.futurist-ai.net")
RSA_KEY_SIZE=4096
DATA_PATH="./certbot"
EMAIL="admin@futurist.agency" # Change this if needed
STAGING=0 # Set to 1 if you're testing your setup to avoid hitting request limits

echo "🚀 Setting up SSL for $DOMAINS on $SERVER_IP..."

# 1. Sync config files first (Nginx config, Docker Compose)
echo "📦 Syncing configuration..."
sshpass -p "$SERVER_PASS" rsync -avz ./nginx ./docker-compose.prod.yml ./scripts $SERVER_USER@$SERVER_IP:$REMOTE_DIR/

# 2. Execute the initialization logic remotely to ensure paths are correct
sshpass -p "$SERVER_PASS" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "cd $REMOTE_DIR && bash -s" <<EOF
  if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ] || [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
    echo "### Downloading recommended TLS parameters ..."
    mkdir -p "$DATA_PATH/conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$DATA_PATH/conf/options-ssl-nginx.conf"
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$DATA_PATH/conf/ssl-dhparams.pem"
  fi

  echo "### Creating dummy certificate for $DOMAINS ..."
  path="/etc/letsencrypt/live/$DOMAINS"
  mkdir -p "$DATA_PATH/conf/live/$DOMAINS"
  
  if [ ! -e "$DATA_PATH/conf/live/$DOMAINS/cert.pem" ]; then
    openssl req -x509 -nodes -newkey rsa:4096 -days 1 \
      -keyout "$DATA_PATH/conf/live/$DOMAINS/privkey.pem" \
      -out "$DATA_PATH/conf/live/$DOMAINS/fullchain.pem" \
      -subj "/CN=localhost"
  fi

  echo "### Starting nginx ..."
  docker compose -f docker-compose.prod.yml up --force-recreate -d nginx
  
  echo "### Deleting dummy certificate for $DOMAINS ..."
  rm -Rf "$DATA_PATH/conf/live/$DOMAINS" && \
  rm -Rf "$DATA_PATH/conf/archive/$DOMAINS" && \
  rm -Rf "$DATA_PATH/conf/renewal/$DOMAINS.conf"

  echo "### Requesting Let's Encrypt certificate for $DOMAINS ..."
  # Join $DOMAINS to -d args
  domain_args=""
  for domain in "${DOMAINS[@]}"; do
    domain_args="\$domain_args -d \$domain"
  done

  # Select appropriate email arg
  case "$EMAIL" in
    "") email_arg="--register-unsafely-without-email" ;;
    *) email_arg="-m $EMAIL" ;;
  esac

  # Enable staging mode if needed
  if [ $STAGING != "0" ]; then staging_arg="--staging"; fi

  docker compose -f docker-compose.prod.yml run --rm --entrypoint "\
    certbot certonly --webroot -w /var/www/certbot \
    \$staging_arg \
    \$email_arg \
    \$domain_args \
    --rsa-key-size $RSA_KEY_SIZE \
    --agree-tos \
    --force-renewal" certbot

  echo "### Reloading nginx ..."
  docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
EOF

echo "✅ SSL Setup complete! Visit https://${DOMAINS[0]}"
