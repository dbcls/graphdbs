The Dockerfile is based on [neo4j:4.2.3](https://github.com/neo4j/docker-neo4j-publish/blob/876140f24eb644b811a2bffc7bc09d9a39f341e7/4.2.3/community/Dockerfile).

## Running your Neo4j
    docker build -t neo4j-local .
    docker run --name neo4j-local -p 7687:7687 -p 7474:7474 -d neo4j-local

The default username/password is neo4j/neo4j. Password change will be required after first login.
