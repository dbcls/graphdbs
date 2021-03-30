## Running your Stardog

### Initialize license

On the first time, you should initialize the license of Stardog.
Build the stardog image:

    docker-compose build
    
Run the containers:

    docker-compose run stardog

You will be asked about license.
Answer the questions on the console.
After that, the Stardog license file will be saved in `/stardog-home` and Stardog will boot.

### Booting on second time or after

Just `docker-compose up -d`


### Creating DB

You can create your db by a command such as:

    docker-compose exec stardog stardog-admin db create -n exampleDB example.ttl 
    
### Send a querying to DB

You can query a command such as:

    docker-compose exec stardog stardog query exampleDB "SELECT DISTINCT ?s WHERE { ?s ?p ?o } LIMIT 10"

### If you need GUI

See https://www.stardog.com/studio/ and install it.
