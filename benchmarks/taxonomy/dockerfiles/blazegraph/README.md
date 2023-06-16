This directory is based on [lyrasis/docker-blazegraph/2.1.5](https://github.com/lyrasis/docker-blazegraph/tree/master/2.1.5)

## Running your Blazegraph

    docker build -t blazegraph-local .
    docker run --name blazegraph -d -p 8889:8080 -v $(pwd)/data/RWStore.properties:/RWStore.properties blazegraph-local
or 

    docker-compose up -d

The blazepraph interface can be accessed via http://localhost:8889/bigdata/
