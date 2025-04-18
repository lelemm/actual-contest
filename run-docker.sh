# Build and run the Docker container with docker-compose
echo "Building and starting Docker container..."
docker-compose up -d

echo "Container is running at http://localhost:3000"
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
