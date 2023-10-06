# Scott Logic Coding Challenge

### NOTE:
- In the Cloud9 environment, view this file by right-clicking in the folder tree
  and selecting Preview

# Java Contestant Instructions

## Building & Running

When you first connect to your Cloud9 instance, you will have been prompted to
activate enhanced Java support. If you didn't do this, you can do so now via
**Preferences**, **Java Support**, **Enhanced Java Support**.

In the terminal at the bottom of the Cloud9 IDE, change to the `java-contestant`
directory:
```bash
cd java-contestant
```
… then run `./gradlew build` to build your bot:
```bash
./gradlew build
```

### Login to Game Server
Before you can test your Bot you need to login to the Game Server and set it up
to wait for a connection from your bot.

Log in to the Game Server (you should have been given the URL) using your team
name and password. Click on `Remote Bot` and hit the `Connect` button in the
dialog. You should see the status change to `Waiting` indicating that the Game
Server is awaitng your bot.

Be sure to leave the page open in your browser.

### Java Contestant Build, Execute, Repeat

The code that you will write will be in the `com.contestantbots.team.ExampleBot`
class and should implement the `makeMoves` method.  You will learn how to do
this in the tutorial.

In the terminal type _` ./run_java_contestant.sh `_ You will be prompted for the
name of your team.

If the bot has successfully connected to the Game Server you should see the page
change to show options to choose Maps and Milestones to test your bot.

Select the map and milestone then hit `Test` to see your bot in action.

Next you can either test against another Milestone bot or make changes to your
code. If you wish to make changes to your code you will need to kill the current
task using `Ctrl+C` in the terminal. Once you have made the changes and saved
the file, re-run the Gradle command to recompile your code, resolving any errors
until you have a successful build.

Once you have the next version of your code ready to test then rerun the
`run-java-contestant` command.


#### Restrictions
There are only a few restrictions on the compiled code:
- the com.contestant bots.team package should only contain
  `com.contestantbots.team.ExampleBot`
- any helper or utility classes should either be
  - inner classes of your Bot, or
  - not have a public constructor
- your Bot should take no more than half a second to calculate the moves or else
  it will be disqualified
- your Bot should take no more than 2 seconds for its `initialise(...)` method
  to run (if implemented) or else it will be disqualified

## Next Steps Tutorial

When you're ready to move on this [tutorial](tutorial/index.md) provides a
step-by-step guide to adding some basic intelligence to your bot.
