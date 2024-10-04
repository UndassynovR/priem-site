## Docker Setup and Data Management

### Stop and Remove Containers

To stop the Docker containers and remove the associated volumes (this will also remove the PostgreSQL data):

```
docker-compose down -v
```

### Start and Build Docker Image

To start and rebuild the Docker image, use:

```
docker-compose up --build
```

### Export PostgreSQL Database Data

To export the PostgreSQL database data from the container, follow these steps:

1. **Find the PostgreSQL container name**:

   Run the following command to list the running containers:

   ```
   docker ps
   ```

2. **Execute the `pg_dumpall` to create a database dump**:

   Replace `<container_name>` with the actual PostgreSQL container name and run:

   ```
   docker exec -t <container_name> pg_dumpall -c -U priem > db_backup.sql
   ```

   This will create a dump of the entire database and save it to `db_backup.sql`.

### Export Docker Image

To export the Docker image to a file:

```
docker save -o my_image.tar <image-name>
```

This will create an image archive (`my_image.tar`) that can be transferred to another system.

### Import Docker Image on Another System

To load the Docker image archive on another system, use:

```
docker load -i my_image.tar
```

This will import the Docker image from the archive into Docker on the new system.

