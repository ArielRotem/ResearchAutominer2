#!/bin/bash

# Stop on first error
set -e

# !! IMPORTANT !!
# CHANGE THIS TO YOUR DOCKER HUB USERNAME
DOCKER_USERNAME="arielrotem"

# --- Build and Push Backend ---
echo "Building backend..."
docker build --no-cache -t $DOCKER_USERNAME/research-autominer-backend:latest ./backend

echo "Pushing backend to Docker Hub..."
docker push $DOCKER_USERNAME/research-autominer-backend:latest

# --- Build and Push Frontend ---
echo "Building frontend..."
docker build -t $DOCKER_USERNAME/research-autominer-frontend:latest ./frontend

echo "Pushing frontend to Docker Hub..."
docker push $DOCKER_USERNAME/research-autominer-frontend:latest

echo "All images built and pushed successfully!"
