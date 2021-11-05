# Scott Logic Coding Challenge

### NOTE:
- In VS-Code editor preview this file with (ctrl - shift -v )
- To preview links (ctr - click) the link 

# Java Contestant Instructions

## Building & Running

### Login to Game Server
Before you can test your Bot you need to login to the Game Server and set it up to wait for a connection from your bot.

Log in to the Game Server (You should have been given the URL) using your team name and password. Click on `Remote Bot` and hit the `Connect` button in the dialog. You should see the status change to `Waiting` indicating that the Game Server is awaitng your bot.

Be sure to leave the page open in your browser

### Java Contestant Build, Execute, Repeat

The code that you will write will be in the `com.contestantbots.team.ExampleBot` class and should implement the makeMoves method.  You will learn how to do this in the tutorial.

Initially it takes a maybe 30 seconds for the Java extension to run and build the workspace.  After it is built the workspace the first time you will see a bin directory appear in the explorer tab indicating there are now compiled classes needed to now run your bot.


In the Menu: _`Terminal ->  New Terminal `_ 
In the terminal type _` ./run_java_contestant.sh `_ 
If the bot has successfully connected to the Game Server you should see the page change to show options to choose Maps and Milestones to test your bot

Select the map and milestone then hit `Test` to see your bot in action.

Next you can either test against another Milestone bot or make changes to your code.  If you wish to make changes to your code you will need to kill the current task `ctrl - c` in the terminal.
Once you have made the changes then the Java plugin should automatically recompile.  You will see any errors in the blue bar at the bottom of the browser.

Once you have the next version of your code ready to test then rerun the `run-java-contestant` task.



#### Restrictions
There are only a few restrictions on the compiled code:
- the com.contestant bots.team package should only contain  `com.contestantbots.team.ExampleBot`
- any helper or utility classes should either be
  - inner classes of your Bot, or
  - not have a public constructor
- your Bot should take no more than half a second to calculate the moves or else it will be disqualified
- your Bot should take no more than 2 seconds for its `initialise(...)` method to run (if implemented) or else it will
  be disqualified

## Next Steps Tutorial

When you're ready to move on this [tutorial](/tutorial/index.md) provides a step-by-step guide to adding
some basic intelligence to your bot.
