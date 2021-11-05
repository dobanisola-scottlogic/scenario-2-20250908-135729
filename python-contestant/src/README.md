# Scott Logic Coding Challenge

### NOTE:
- In VS-Code editor preview this file with (ctrl - shift -v )
- To preview links (ctr - click) the link 

# Python Contestant Instructions

This project contains the following:

- README - what you are reading now
- main.py - the entry point of the Python application, handles server I/O
- util - package containing utility modules e.g. JSON serialisation
- game - package containing the game's API modules, classes, functions
- bots - package containing the abstract Bot class which you will need to implement
- contestant - package containing your Bot implementation, all of your code should go in this package
- docs_html - contestant instructions, tutorials, API reference


## Building & Running

### Login to Game Server
Before you can test your Bot you need to login to the Game Server and set it up to wait for a connection form your bot.

Log in to the Game Server (You should have been given the URL) using your team name and password. Select the Remote Bot heading and hit the `Connect` button in the dialog. You should see the status change to `Waiting` indicating that the Game Server is awaitng your bot.

Be sure to leave the page open in your browser


### Python Contestant Build, Execute, Repeat
The code that you will write will be in the `ExampleBot` class in the file `contestant/bot.py` and should implement the make_moves method.  You will learn how to do this in the tutorial.

In the Menu: _`Terminal ->  New Terminal `_ 
In the terminal type _` ./run_python_contestant.sh`_ 

If the bot has successfully connected to the Game Server you should see the page change to show options to choose Maps and Milestones to test your bot

Select the map and milestone then hit `Test` to see your bot in action.

Next you can either test against another Milestone bot or make changes to your code.  If you wish to make changes to your code you will need to kill the current task `ctrl - c` in the terminal.
You will see any errors in the blue bar at the bottom of the browser.

Once you have the next version of your code ready to test the rerun the `run-python-contestant` task.

#### Restrictions
There are only a few restrictions 
- your Bot should take no more than half a second to calculate the moves or else it will be disqualified
- your Bot should take no more than 2 seconds for its `initialise(...)` method to run (if implemented) or else it will
  be disqualified


## Next Steps Tutorial

When you're ready to move on you can follow the tutorial which provides a step-by-step guide to adding some basic intelligence to your bot. You can access the tutorial by removing `/?folder=/home/coder/project/python-contestant` from the end of the URL used to access VSCode in the browser (i.e. the URL you are at now) and replacing it with `:8081`.
