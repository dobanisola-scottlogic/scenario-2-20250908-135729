# Hackathon Code Challenge - Server

This subproject contains the web server application for running Hackathon events.
It statically serves the [viewer](../viewer) front end at the `/application` endpoint,
and also defines back-end `/api` endpoints for the viewer to communicate with.

The server is written as a [Dropwizard](https://www.dropwizard.io/1.3.5/docs/) application,
with resource management and dependency injection via [Google Guice](https://github.com/google/guice).

## Building and Running

The server can be built, run, or deployed in several modes.

### Running locally

To run the server locally, for testing during development:

```bash
./gradlew server:run [-P database=<database_file>]
```
You should now be able to access the server by navigating to <http://localhost:8080/application>.

The `database` property is optional, and specifies the path of an H2 database file for the server to use as its DB.
If this property is omitted, an in-memory database will be used.

### Building a redistributable application

You can use `./gradlew server:installDist` to assemble an "installation folder",
including start scripts for Windows and Unix in the `build/install/hackathon-server` subdirectory.
At present, some command-line arguments are mandatory when running from here:

```bash
cd build/install/hackathon-server
bin/hackathon-server server conf/server.yml
```

The application can automatically be packed into a zip or tar archive using `./gradlew server:distZip` or
`./gradlew server:distTar`.

### Building a Docker image

As the preferred alternative to the redistributable application, you can build the server as a Docker image.
This **requires Docker to be installed on your machine**.

```bash
./gradlew server:dockerBuild
```

This will create an image called 'hackathon-server' in your local Docker registry.
To run it, you need to expose port 8080 on the container.

Alternatively, you can build and run the container using Gradle in one go:

```bash
./gradlew server:dockerRun
```

Use `docker ps` to see the container running.

To see the console output for the container:
```bash
docker logs $(docker ps -qaf ancestor=hackathon-server)
```

To stop the container:
```bash
docker stop $(docker ps -qaf ancestor=hackathon-server)
```

Alternatively, you can stop and remove all containers running on your machine with the following Bash command:
```bash
docker rm -f $(docker ps -qa)
```

### Production deployment

See the [deployment](../deployment) subproject.
