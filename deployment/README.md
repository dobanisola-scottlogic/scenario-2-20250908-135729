# Deployment

This subproject contains code and scripts to assist with various strategies for creating a 'production' deployment of
the [server](../server) along with various supplementary services.

A couple of strategies are supported (to a greater or lesser extent).

## Docker Compose

This deployment strategy uses Docker compose to deploy the following services to a single machine:

  - The game server, accessible on port 8080
  - A PostgreSQL database for the game server to use
  - A [Gitea](https://gitea.io) Git server, hosting the [contestant repo](../contestant) at
    `ScottLogic/coding-challenge`, accessible on port 3000
  - A [Nexus](https://www.sonatype.com/nexus-repository-sonatype) repository, that can act as a proxy for downloading
    JDKs and Gradle distributions if Internet bandwidth is poor.
    
### Advantages

  - Fully automated setup
  - Free if hosted on a local machine
  - Also provides contestant repo
  - If hosted on local machine, can reduce Internet bandwidth requirements
  
### Disadvantages

  - If hosted locally, you must make sure that contestants can access the IP address of the machine.
    Universities often put guests on segregated networks that make this impossible.
  - No provisioning of cloud or Internet hosts/resources.
  
### Setup

  1. Install Docker, Docker Compose, and Git on the server machine
  2. Clone this repository onto the server machine
  3. Open a shell in the root of the cloned repository, and run
      ```bash
      ./gradlew up
      ```
      
The deployment can be brought down again with `./gradlew down`.

## AWS CloudFormation

This deployment strategy uses [CloudFormation](https://aws.amazon.com/cloudformation/) templates to set up and deploy
AWS resources for running the [game server](../server) and a supporting database (using Amazon RDS).

### Advantages

  - Reachable from any internet-connected machine
  - No requirement for local hosting resources
  
### Disadvantages

  - Not fully automated &ndash; uploading of game server Docker image to registry must be done manually
  - Costs money
  - Server has a long URL (this can be fixed using a URL shortener)
  - Need to host or distribute contestant stub repository separately
  - May be hampered by poor Internet connection at events
  
### Setup

  1. Create an Amazon CloudFormation stack using the
      [cloudformation-infrastructure.yml](./cloudformation-infrastructure.yml) template in this directory.
      This stack can be left deployed if you make subsequent changes to the software or need to rebuild for some
      reason.
  2. Ensure you have Docker installed
  3. Open a shell in the root of this repository and run
      ```bash
      ./gradlew server:dockerBuild
      ```
      This will create a Docker image named 'hackathon-server'
  4. Upload the created image to a Docker container registry accessible from AWS.
     You can use [Amazon ECR](https://aws.amazon.com/ecr/) for this.
  5. Create an Amazon CloudFormation stack using the
      [cloudformation-server.yml](./cloudformation-server.yml) template in this directory.
      
The server should be accessible via the URL of the public load balancer deployed in the first stack
(see the "outputs" tab in the CloudFormation console).

If you need to update the server image, delete the stack produced in step 5, then repeat steps 3-5.

The [push-to-aws.sh](push-to-aws.sh) script in this directory is a work-in-progress attempt to automate this process.
