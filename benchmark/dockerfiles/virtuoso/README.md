This directory is based on [tenforce/docker-virtuoso](https://github.com/tenforce/docker-virtuoso).

# Virtuoso docker
Docker for hosting Virtuoso.

The Virtuoso is built from a specific commit SHA in https://github.com/openlink/virtuoso-opensource.

## Running your Virtuoso
    docker build -t virtuoso .
    docker run --name my-virtuoso \
        -p 8890:8890 -p 1111:1111 \
        -v $(pwd)/data/virtuoso:/data \
        -d virtuoso
or 
    docker-compose up -d

The Virtuoso database folder is mounted in `/data`.

The Docker image exposes port 8890 and 1111.
