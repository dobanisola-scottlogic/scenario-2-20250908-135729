# Running An Event

## General Format

Events are typically run for 3-5 hours, including introductions, coding time, and a final competition/prize giving.

The event should be advertised in advance to make sure:
  - Attendees know when/where they need to be
  - Attendees have a rough idea of what they'll be doing
  - Organizers have a rough idea of how many people will attend
  - Attendees are aware of any pre-requisites they must fulfil (this will depend on how the event is run)
  
At the event, attendees will need to be organised into teams of 2-4.
They can come 'as a team', or can be grouped with other lone attendees when they arrive.
At past events, there were a mixture of pre- and jit-organised teams.

Each team must work together to write a 'bot' that plays the game.
Bots are uploaded to a central server, where they are pitted against each other in a competition.
The exact format and timings of the competition has varied between past events -
there is not yet a fixed recommended format.

There should be a prize for the winning team, and possibly for runners up or losers.
It should be ensured that prizes can be easily split among team members.

There should be a number of organisers at the event:
  - At least 1 'public speaker', communicating instructions to attendees, and being a commentator on competitions.
  - At least 1 'IT super-user' who should have good administrative knowledge of the software and deployment
    infrastructure.
    They will administer the server and be the final point of contact for technical questions and problems.
  - Several other 'helpers' with some experience of the software from a competitor's viewpoint,
    to provide assistance to attendees. This could be technical set-up assistance,
    help or advice with strategy and teamwork, or just making sure that people aren't bored.
    
### Tutorial

There is a [tutorial](contestant/docs/tutorial/index.md) that contestants can follow to get them started with
development. Following it to completion will likely take up a significant portion of the available time,
so in previous events we have warned attendees of this and suggested that they skim it for reference instead.
Some of the algorithms it suggests lead to sub-optimal solutions, so it's also worth explicitly
"not guaranteeing that it will work" to attendees. At past events, people have found this amusing.

### Server Access

Each team needs a team name and password that they can use to log in to the game server and upload their bot
implementations. The server currently has no 'registration' functionality, so an administrator must manually create
these at the event. At past events, teams were asked to come up with an amusing name,
which the administrator then used to set up their credentials on the server.
Attendees don't need access to the server to begin coding, so this can be done once everyone is settled down.

### Competition Format

There is currently no fixed or automated way to run a competition across several games.

Here is one format that worked well at the Durham 2018 event:
  - A series of games of 4 teams were devised, following a round-robin type format.
  - The first game was played about half way through the event, with a game roughly every 10 minutes after that.
  - Teams were allowed to continue developing and upload revisions to their bots once games had started.
  - Differing numbers of points were awarded to the team that came 1st, 2nd, and 3rd in each game.
    These were tracked on an Excel spreadsheet.
  - At the end of the event, the 3 teams with the highest score were pitted against each other in a
    best-of-3/sudden-death final.
    
An advantage of this format is that it encourages teams to upload implementations early, and refine later.
Without this, there's a tendency for teams to put off running/testing/submitting an implementation until the very last
minute, only to discover that it has a bug, so is disqualified.

## Technical Requirements

The following resources are required:

  - Computers for development, at least one per team. Past events have operated a 'bring your own laptop' system.
    Windows, Mac and Linux are supported.
  - A computer with a large format display, such as a projector, for screening the competition.
  - A deployed [server](server) to upload bots to and run the competition on.
  - A means of distributing the [contestant stub project](contestant) to attendees.
  
### Server Deployment

The [deployment](deployment) subproject describes some ways of deploying the server.

### Contestant Stub Project

The stub contestant project needs to be available on the computers that attendees will use for development.
If attendees bring their own laptops to the event, the stub project can be delivered as a Git repository or as a
zip/tar archive. Both these methods are described below, or you can see the
[README of the contestant subproject](contestant) for more details.

#### As A Git Repository

  1. From the root of this project, run:
      ```bash
      ./gradlew contestant:gitRepo
      ```
      This will extract the stub project into a git repository in the `contestant/build/gitRepo` subfolder.
  2. Create an empty public project on public Git server (e.g. GitHub)
  3. Add the repository created in step 2 as a remote to the repository created in step 1, and push.
   
#### As A Zip/Tar

   1. From the root of this project, run:
      ```bash
      ./gradlew contestant:assemble
      ```
      This will create 2 archive files in the `contestant/build/distributions` subfolder:
      a `.zip` for Windows, and a `.tar.gz` for Linux and Mac.
   2. Distribute copies of these archives to attendees; as a download, by email, by USB, or however.
   
## Issues and Lessons Learnt

### IDE Setup

At past events, attendees have struggled to get their IDE setup correctly.
In part, this was due to a couple of bugs in setup scripts,
and unknown incompatibilities with IDEs (particularly Eclipse), but these have now been fixed.
A large part of the problem was definitely down to attendees not reading the instructions properly.
Instead, they would attempt to set up the project in their IDE in the way that they're used to:
manually, with no additional libraries on the classpath.

They need to be encouraged to read the instructions carefully, and use their IDE's Gradle import functionality to
set up the project. Both Eclipse and IntelliJ should be able to do this fine.

### Long-Running Bots, Infinite Loops, and Privileged Execution

There are a number of known issues with having unaudited contestant code run on the server:

  - While bots are disqualified if their code takes too long to execute, and the game continues without waiting,
    the executing contestant code is not forcibly terminated. If it is particularly long-running, or infinite,
    the resulting resource drain could end up having an impact on the server machine.
    The only known way to terminate such code is to restart the server application.
    See [GitHub issue #64](https://github.com/ScottLogic/hackathon-ai-game/issues/64).
  - The server application does not currently set up a SecurityManager, or any other means of restricting bots' access
    to privileged code. See [GitHub issue #85](https://github.com/ScottLogic/hackathon-ai-game/issues/85).
    
In practice, these issues have not caused a problem at past events. However, aside from fixing the associated bugs,
it's worth taking a few steps to mitigate the chances of this causing a problem:
  - Ensure we have the means to restart the server during an event.
  - Warn attendees against accidentally introducing an infinite loop. This can happen quite easily:
    for instance, code may pick directions for a player to move in randomly until they find one that is not obstructed,
    but a player can become surrounded by obstructions, so there is no available direction to move in.
    
### Unknown Server Performance Bug

[GitHub issue #93](https://github.com/ScottLogic/hackathon-ai-game/issues/93) details a bug that causes the server to
stop responding when the number of games gets large. The precise cause and fix of this is not yet known.
It has only occurred once, during the Durham 2018 event, where it was worked around by destroying and rebuilding the
entire [AWS 'server' stack](deployment#aws-cloudformation) then recreating teams on the new server.
It is not known whether a less drastic intervention would have also worked, as none other was tried.

Beyond putting time into fixing the bug, actions that may reduce the chance of this causing a problem include:
  - Ensure we have the means to restart the server (and wipe the database?) during an event.
  - Discouraging attendees from uploading too many revisions of their bot code,
    or invoking the server's "Play Against Current Milestone" functionality too much.
  - As a temporary work-around, one could alter the code to disable the "Play Against Current Milestone" button,
    and/or automatically discard all but the latest result of each team playing against the built in "Miletone" bots.
  - Preemptively wipe/reboot the server at a convenient moment.
  
### Runner-Up or Last Place Prizes

At the Durham event, a conciliatory prize was awarded to the team that came last.
While it was not announced in advance that this would be done, so teams couldn't decide to aim to lose in order to win
a prize, some of the teams that performed well but didn't win perhaps felt a bit hard-done-by.

In addition, the team that lost did so mainly because they opted not to submit an implementation until the very end
of the event. Having not been properly trialled, their bot consistently threw an exception in every game,
so was always disqualified, and the team were left with no opportunity to discover and fix this.
It is felt that rewarding this team, that effectively suffered from not following repeated recommendations,
may have been a little unjust to other teams.

In future events if more than one prize is available, it would be recommended that this be given to the runners-up,
rather than the losers.
  
## Past Experience

### Durham, November 2018

  - The event was organised with the help of the University's Computing Society by John Wright.
  
  - It ran from 1pm to 6pm on a Saturday, and was followed by food and drinks at a local pub (organised by the CompSoc).
  
  - Scott Logic provided free soft drinks.
  
  - The server was deployed on Amazon CloudFormation stacks
  
  - The contestant stub repository was published via GitHub
  
  - There were about 15 attendees, organised into 6 teams. Only 1 team had organised themselves ahead of the event,
    but most of the rest of the attendees happily grouped themselves into teams.
  
  - Attendees brought their own laptops, mostly running Linux or OSX.
  
  - Most attendees used IntelliJ. There were a couple of issues with IDE setup, as documented [above](#ide-setup),
    but people mostly got going fairly quickly. One attendee insisted on developing in Vim,
    which caused discoverability problems particularly as he wasn't familiar with Java.
  
  - Some teams followed the tutorial extensively, whereas others basically ignored it.
  
  - Most teams chose to collaborate via GitHub, although it is not known how much they actually ended up relying on it.
  
  - The competition was run using the points based system described [above](#competition-format).
  
  - The server stack had to be rebuilt towards the end of the event, due to a [bug](#unknown-server-performance-bug),
    which meant team credentials had to be recreated, and teams were asked to re-upload their final bots.
  
  - Prizes were awarded to the team that came first, and [the team that came last](#runner-up-or-last-place-prizes).
  
  - The event was generally well-received, and people seemed to enjoy themselves.
  
### Heriot-Watt, October 2018

  - The event was organised by Matthew Nicholson, with the help of a professor from the University Computing Department.
  
  - It ran from 2pm to 6pm on a Wednesday.
  - Scott Logic provided free soft drinks, beer, and snacks.
  
  - There were about 30 attendees, organised into 10 teams. Only 1 team had organised themselves ahead of the event,
    but most of the rest of the attendees happily grouped themselves into teams.
  
  - Attendees brought their own laptops, mostly running Windows.
  
  - Most attendees used Eclipse, as this was what they were familiar with. Setup took a long time,
    as Eclipse had not been properly tested, and there were incompatibilities between Eclipse, Java 9, and Gradle.
    Most attendees had no experience with any development tool use, and were used to having everything pre-packaged for
    them. The professor even spoke of providing students with VMs including everything pre-set-up.
  
  - Almost all teams followed the tutorial for a significant portion of time before diverging.
  
  - Teams generally collaborated via pair programming, or by sending code snippets to each other via messengers.
  
  - The server, and a Git server hosting the contestant stub repository, were deployed using Docker Compose to a laptop
    brought to the event. Upon arriving, it was discovered that this laptop would be on a segregated network,
    so attendees couldn't actually access it. To work around this:
    - The contestant stub repository was pushed to a public GitHub repo
    - Attendees submitted their bots by dropping them in a shared Dropbox folder, and an administrator had to upload
      them. This caused quite a few problems, as several uploads were rejected by the server,
      which had to be communicated back to the contestants for them to rectify, so the process could be repeated
      (sometimes several times).
  
  - Time limits on contestant code execution were laxer than they are now
    (see [PR #96](https://github.com/ScottLogic/hackathon-ai-game/pull/96)),
    which meant games took a long time to simulate on the server.
  
  - Due to the issues with uploading to the server and long-running simulations, there was only time to play each
    team's submission in a single game, against one opponent. The winners of each game were ranked based on on the
    number of players they had on the board at the end of the game. This was unsatisfactory, particularly as one team
    developed a very good strategy that allowed them to win their game very quickly without building up their army of
    players. The second place prize was awarded to them, even though they were not second according to the rankings.
  
  - There were two prizes, given to the teams that came "first" and "second" (see previous bullet).
  
  - The event was generally well-received, and people seemed to enjoy themselves.
    One attendee emailed after the event to ask if there was a way for him to keep developing and testing his strategy.