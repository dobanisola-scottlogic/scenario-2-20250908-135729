## Building & Running  (When developing locally without Code Server / VS-Code)


In the Gradle tasks on the right hand side of your IntelliJ double click `build`. You will need to build your project
whenever you make a change to your bot that you wish to reconnect and test.

To connect your bot so you can test it against the default bots login to your hackathon viewer with the username and
password provided. Go to the `Remote Bot` dashboard, click `Connect` then run the following command and wait until it
has connected.

```
java  -Dorg.slf4j.simpleLogger.showDateTime=true -Dorg.slf4j.simpleLogger.dateTimeFormat="yyyy-MM-dd HH:mm:ss:SSS Z"
-Dorg.slf4j.simpleLogger.defaultLogLevel=all  -jar <path_to_your_repository>/libs/remote-1.0-SNAPSHOT-all.jar
--botclasspath <path_to_your_repository>/build/classes/java/main --bot com.contestantbots.team.ExampleBot
--team <your_team_name> --host <host_name_supplied_to_you> --port 8080
```

Now you can test your bot against the default bot by clicking `Test` and waiting. Change the speed of the game play to
more easily see what is going on, you can also replay the game but sliding the slider on the lower chart back.