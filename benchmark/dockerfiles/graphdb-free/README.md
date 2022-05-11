This directory is based on [Ontotext-AD/graphdb-docker](https://github.com/Ontotext-AD/graphdb-docker)

## Running your GraphDB Free Edition

First, register on the Ontotext website for the GraphDB Free edition (graphdb-${edition}-${version}-dist.zip)
and download the zip file and place it in this directory.

After that, change the version in Dockerfile (`ARG version=*.*.*`) or in docker-compose.yml(`version: *.*.*`) to the downloaded version number.

Then,
    docker build -t graphdb-free-local .
    docker run -d -p 7200:7200 graphdb-free-local
or 
    docker-compose up -d
