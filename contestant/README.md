
[//]: # (BEGIN SKIP)

# Contestant Repo
This folder contains a stub project to be given to hackathon contestants, containing:
  - a small amount of source code to get started with
  - documentation and tutorials
  - a Gradle project that contestants can use to build their bot and configure their IDE
  
This folder _shouldn't_ be given to contestants directly because:
 - a small amount of its contents are not for contestants (such as this bit of the README)
 - its build depends on other subprojects, so will fail in isolation
 
Instead, run `./gradlew contestant:build` to assemble it into a form suitable for consumption by contestants.
See below for details.
 
## Building & Testing

The normal Gradle lifecycle tasks will turn this subproject into a standalone project that can be given to contestants:
  - The `assemble` lifecycle task depends on `assembleContestantRepo`
  - The `check` lifecycle task depends on `checkContestantRepo`
  
### `assembleContestantRepo`

This task creates a standalone version of this subproject.
It copies the entire subproject into folder in the `build` directory, with the following modifications:
  - Files matching `.gitignore` patterns are not copied
  - In any file, any lines between (and including) <code>BEGIN&nbsp;SKIP</code> and <code>END&nbsp;SKIP</code>
    are stripped out (that is how this portion of the README is excluded)
  - Inter-project and Maven dependencies are replaced with file dependencies in a `libs` subdirectory
  
### `checkContestantRepo`

This task depends on `assembleContestantRepo` and runs a separate `gradlew check` process on it.
If the child process fails, so does this task.

If this task is run alongside other verification tasks (e.g. by running `gradlew check`), then this will be the last to
run. This ensures other checks succeed before the relatively expensive operation of assembling the contestant repo
(along with all its dependencies), and then running a separate build process inside it is attempted.

**The remainder of this README file is what contestants will see.**

[//]: # (END SKIP)

# Scott Logic Hackathon

## Setup

### 1 (Optional) Install Git
You don't need to have Git installed in order to take part, but it might help if you're collaborating with others.
However, if you're not familiar with Git, now may not be the best time to learn it.

On Windows, you can download Git for Windows [here](https://gitforwindows.org/).
This also gives you access to a Linux-style Bash shell terminal called Git Bash.

### 2 Download this project
If you have Git installed, you can clone the repository to your local machine using the clone URL above.
Alternatively, there's also a link above to download the repository as a zip or tar archive.

A third option, which may make working with your team mates easier, is to register a username on this git server,
then fork the project and clone it from there. That will allow you to share code with your team mates by pushing Git
commits back up to your forked project.

### 3 Install

There's an installation script in the root folder of this repository. This will download and set up an appropriate
Java Development Kit for your machine.

Optionally, if your Scott Logic host tells you that you need to do this, you can add the `-r` option to configure a
proxy URL for downloading the necessary dependencies.

Open a terminal (command prompt), and run the command below.

Windows command prompt:
```batch
install [-r http://<proxy_host>:8081/repository]
```

Mac or Linux shell:
```sh
./install.sh [-r http://<proxy_host>:8081/repository]
```

In both of the above, `<proxy_host>` is the hostname provided to you by the Scott Logic host at your event,
if necessary. As an example, if the hostname given to you is `WS01161`, then (on Windows):
```batch
install -r http://WS01161:8081/repository
```

If you're told that no proxy needs to be set up, then all you need to type is
```batch
install
```

### 4 (Optional) Install and import into a Java IDE
It will probably be easier to do development in a Java IDE - ideally one that supports importing Gradle projects, like
[Eclipse](https://www.eclipse.org/downloads/) or [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).
Make sure you've set your IDE's JDK to the one downloaded in the above step.
You can find it in the `<project_root_dir>/tools/jdk` folder.

#### Eclipse

Make sure you have the downloaded JDK set as an "installed JRE". Go to **_Window &rarr; Preferences &rarr; Java &rarr;
Installed JREs &rarr; Add &rarr; Standard VM &rarr; Next &rarr; Directory..._**, and navigate to the
`<project_root_dir>/tools/jdk/<jdk_name>` folder.

To open the project, go to **_File &rarr; Import... &rarr; Gradle &rarr; Existing Gradle Project_**,
and follow the prompts in the wizard. 

#### IntelliJ IDEA

First, ensure you have the downloaded JDK set as one of your SDKs. Hit `Ctrl+Alt+Shift+S`, then go to
**_Project Settings &rarr; Project &rarr; New... &rarr; JDK_**, and navigate to the
`<project_root_dir>/tools/jdk/<jdk_name>` folder.

If you **_Open_** the repostory's root folder as a new project, it should detect Gradle and start the import wizard
automatically.

## Building & Running

The repository includes a pre-compiled game simulator application.
It can be run from either the command line, or your IDE.

After each phase of the game, the application prints an ASCII-art representation of the game's current state to the
console. You can review this before hitting `Enter` to play the next phase.
Since the printed state takes up quite a few lines in the console,
you may find that your IDE's output console can't be made big enough to properly review it,
in which case you may prefer to build and run the game from a command-line terminal.   

### From your IDE

There's a `void main(...)` method in the `ExampleBot` class. You can use that to run or debug a game simulation from
within your IDE.

### From your command line terminal

Open a command line terminal in the root folder of this project and run one of the following commands.

Windows command prompt:
```batch
gradlew run -P mainClass=<your_bot_class_fully_qualified_name>
```

Unix shell:
```sh
./gradlew run -P mainClass=<your_bot_class_fully_qualified_name>
```

### Game Output
The turn-by-turn game output is rendered as an ascii-art representation of the board with the following key:
 - `A`-`D`: spawn point
 - `a`-`d`: player
 - `X`: out of bounds
 - `+`: collectable

With the initial Bot you should see a very short game consisting of 7 phases ending due to the `LONE_SURVIVOR` end
condition.  The turn-by-turn replay should show 8 players appearing from one spawn point (don't get your hopes up, these
belong to the default bot), and none appearing from the other spawn point.  This is because the initial Bot does not
issue any orders, resulting in each player being eliminated by the next player to emerge from the spawn point.

If you have successfully reached this point then you're all set to start improving on the initial Bot to ensure your
players have a longer, and perhaps more prosperous, life.

## Next Steps
First things first, rename the Bot class so that there are no namespace clashes when uploading to the server,
additionally you might want to change the display name which is shown when testing locally.  There are only a few
restrictions on the compiled code:
- the jar file must be < 20MB
- the com.contestantbots.team package should only contain classes that extend `com.scottlogic.hackathon.game.Bot`
- any helper or utility classes should either be
  - inner classes of your Bot, or
  - not have a public constructor
- your Bot should take no more than half a second to calculate the moves or else it will be disqualified
- your Bot should take no more than 2 seconds for its `initialise(...)` method to run (if implemented) or else it will
  be disqualified
- you can include more than one Bot class in the uploaded jar file to allow you to test different strategies, however
only one Bot can be active at any given time

When you're ready to move on this [tutorial](docs/tutorial/index.md) provides a step-by-step guide to adding
some basic intelligence to your bot.
