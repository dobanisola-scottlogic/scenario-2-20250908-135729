###### Building Code-Server

The Dockerfile installs Ubuntu with Python and Java SDKs

###### For Python 3 (3.7.4) we include 

pip installs for
+ astar==0.9
+ dacite==1.00
+ pylint==2.3.1

VS-Code python extension


###### For Java 11 SDK we include

- Java 11 from headless
- maven
- gradle

VS-Code extensions:

Using specific extension versions which are known to work with this version of code-server (which is a little behind latest vs-code)

- java 0.46.0
- java-debugger 0.20.0
- java-test 0.18.1
- python 2019.6.24221
- html-preview 0.2.5


###### VS-Code (1.1156-vsc1.33.1)

The user is `coder` and member of a group; with `gid 1024`

###### Contestant Files

The contestant user files are untarred into the coder/project directory

If the local host `project` directory has a group owner with the same 'gid' as 'coder' ie `1024` then we can share permissions

```bash
 sudo chown :1024 project
 sudo chmod 755 project
 sudo chmod g+s project

```
 Now any files added to the local host `project` directory will inherit the necessary permissions to be accessible by `coder`
 
 
 
###### Building and Running
```bash
gradle dockerBuild
```

This will produce a hackathon/hackathon-contestant image that can be started thus

```bash
docker  run -it --rm -e GAME_SERVER_HOST=172.17.0.1 -e GAME_SERVER_PORT=8080 -e TEAM_NAME=team -e PASSWORD='team' --name code-server --security-opt=seccomp:unconfined -p 127.0.0.1:80:8080 --expose 80  hackathon-contestant --auth password
```

where 

-   GAME_SERVER_HOST:  The Host machine that this contestant plays games on
-   GAME_SERVER_PORT:  The Port of the machine that this contestant plays games on 
-   TEAM_NAME:         The name by which the Game Server identifies the contestant
-   PASSWORD:          The password to use to access code server

If you want to run the code-server on a different internal port then you can pass an additional environment variable

-   CODE_SERVER_PORT:  The internal port that code server should run on. Defaults to 80 if not supplied

This can be useful when developing locally and you want to run two clients on the same docker host network where ports are not published

for example

```bash
docker  run -it --rm --network="host" -e GAME_SERVER_HOST=127.0.0.1 -e GAME_SERVER_PORT=8080 -e TEAM_NAME=team1 -e PASSWORD='pass1'  --name code-server --security-opt=seccomp:unconfined hackathon-contestant --auth password
docker  run -it --rm --network="host" -e GAME_SERVER_HOST=127.0.0.1 -e GAME_SERVER_PORT=8080 -e TEAM_NAME=team2 -e PASSWORD='pass2' -e CODE_SERVER_PORT=8445 --name code-server1 --security-opt=seccomp:unconfined hackathon-contestant --auth password
``` 
 would spin up two containers one on the default 8443 port and the second on 8445 port
 
 @TODO:
 ### Code-Server 2
 ```bash
docker  run -it --rm --network="host" -e GAME_SERVER_HOST=127.0.0.1 -e GAME_SERVER_PORT=8090 -e TEAM_NAME=team1 -e PASSWORD='pass1'  --name code-server --security-opt=seccomp:unconfined hackathon-contestant:latest --auth password 
```
default port is now 8080

###### Pushing to AWS ECR

To push the hackathon-contestant image to ECR supplying the repository as argument

```bash
./push-to-aws.sh 032044580362.dkr.ecr.eu-west-2.amazonaws.com
```


###### Python Contestant Workspace

- In the VS-Code editor open the python-contestant folder (Ctrl - o)
- Documentation is available at python-contestant/docs_html/index.html. Preview with (Ctrl-shift v) 
- In the Menu: Terminal ->  Run task -> run-python-contestant

###### Java Contestant Workspace

- In the VS-Code editor open the java-contestant folder (Ctrl - o)
- It takes a few seconds for the Java extension to build the workspace
- In the Menu: Terminal ->  Run task -> run-java-contestant

