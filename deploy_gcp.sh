#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
GIT_REPO_URL="https://github.com/ArielRotem/ResearchAutominer2.git"
PROJECT_DIR="ResearchAutominer2" # Name of the directory after cloning
DOCKER_COMPOSE_VERSION="1.29.2" # Match your local version

# --- Function to check if a command exists ---
command_exists () {
  command -v "$1" >/dev/null 2>&1
}

echo "Starting GCP deployment script..."

# --- 1. Install Docker if not already installed ---
if ! command_exists docker; then
  echo "Docker not found. Installing Docker..."
  sudo apt-get update
  sudo apt-get install -y docker.io
  sudo systemctl start docker
  sudo systemctl enable docker
  echo "Docker installed."
else
  echo "Docker already installed."
fi

# --- 2. Install Docker Compose if not already installed ---
if ! command_exists docker-compose; then
  echo "Docker Compose not found. Installing Docker Compose v${DOCKER_COMPOSE_VERSION}..."
  sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  echo "Docker Compose installed."
else
  echo "Docker Compose already installed."
fi

# --- 3. Add current user to docker group (if not already) ---
if ! id -nG "$USER" | grep -qw "docker"; then
  echo "Adding user '$USER' to the 'docker' group."
  sudo usermod -aG docker "$USER"
  echo "User added to docker group. Please log out and log back in to your SSH session for changes to take effect."
  echo "You can do this by typing 'exit' and then reconnecting."
  exit 0 # Exit here, user needs to re-login for docker group changes to apply
else
  echo "User '$USER' is already in the 'docker' group."
fi

# --- 4. Clone or pull the Git repository ---
if [ -d "$PROJECT_DIR" ]; then
  echo "Project directory '$PROJECT_DIR' already exists. Pulling latest changes..."
  cd "$PROJECT_DIR"
  git pull
  cd ..
else
  echo "Cloning Git repository: $GIT_REPO_URL"
  git clone "$GIT_REPO_URL"
fi

# Navigate into the project directory
cd "$PROJECT_DIR"

# --- 5. Start the Nginx Reverse Proxy ---
echo "Starting Nginx Reverse Proxy..."
cd reverse-proxy
# Create the shared network if it doesn't exist (idempotent)
docker network create reverse-proxy_web || true
docker-compose up -d
cd .. # Go back to project root

# --- 6. Start the Research Autominer Application ---
echo "Starting Research Autominer Application..."
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment script finished."
echo "Your application should now be running."
echo "Remember to configure your DNS to point to this VM's external IP address."
echo "If you had to re-login, please re-run this script to complete the deployment."
