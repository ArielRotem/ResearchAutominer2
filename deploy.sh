#!/bin/bash

# Stop on first error
set -e

# Pull the latest images from Docker Hub
echo "Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull

# Restart the services
echo "Restarting services..."
docker-compose -f docker-compose.prod.yml up -d

echo "Deployment complete!"
