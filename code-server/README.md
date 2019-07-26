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
docker  run -it --rm -e GAME_SERVER_HOST=WS01273 -e GAME_SERVER_PORT=8080 -e TEAM_NAME=team -e PASSWORD='LetMe1N' --name code-server --security-opt=seccomp:unconfined -p 127.0.0.1:8443:8443  hackathon/hackathon-contestant:latest --allow-http --no-auth
```

where 

-   GAME_SERVER_HOST:  The Host machine that this contestant plays games on
-   GAME_SERVER_PORT:  The Port of the machine that this contestant plays games on 
-   TEAM_NAME:         The name by which the Game Server identifies the contestant
-   PASSWORD:          The password to use to access code server


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

