# Stop and remove containers
docker-compose down -v

# Start and build docker image
docker-compose up --build

# Export db data
//find postgresql container name
docker ps
// execute the pg\_dump to create dump
docker exec -t <container_name> pg\_dumpall -c -U priem > db\_backup.sql

# Export docker image
docker save -o my\_image.tar <image-name>

# Import docker image on another system
docker load -i my\_image.tar
