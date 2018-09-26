# Code Challenge - Server

# Git #

* All code shall be reviewed before merge to develop via pull request
* Follow branch naming conventions, using JIRA ticket numbers
* Include a JIRA issue number in every commit message
* Keep all pull requests specific to one piece of work and make them small and frequent where possible

# Code Style #

* Do not use acronyms and abbreviations (except Id)
* Always use curly braces to enclose if/for/while etc
* Don't break early, use loop conditions
* Use single return point where practical
* Tab size 4, insert spaces
* Format a file before checking in
* Class or Type name should match the filename try and limit to one Class or Type per file
* Code should be self commenting, though classes may be commented with a general description of their responsibilities. If you feel the need to comment in a function then split it down and ensure the function name is descriptive. Include comments where code is not intuitive

## Java ##

* camelCase for fields and methods, PascalCase for Types, CAPITAL_CASE for constants and enum values
* Use Streams liberally

## JypeScript ##

* Use Pascal Case for Types (class, constructor function), Camel Case for everything else
* Prefer arrow functions (e.g. =>) over bind
* Use '===' and '!=='; for length check always use '> 0'
* Avoid magic strings and numbers, create these as private fields
* Keep functions small (<25 lines)
* Avoid locally-defined functions (i.e. function defined within another function)
* Use ' rather than "
* Don't use comma separated variable lists, favour separate variable statements
* Use let in favour of var

## CSS ##

* Use camel case for selectors

-----------------------

# Developer Setup #

## Heroku ##
* Install Heroku Toolbelt

## IntelliJ IDEA ##

* Install
* Import the top level gradle project
** Use the task wrapper configuration
* Ensure Code Style is using the project configuration

### Extensions ###

* Install Save Actions and Enabled 'Organise imports', 'Reformat code', 'Rearrange code', 'Add final to local variable' and 'Add final to field'

## See the viewer folder readme for info on viewer development ##

-----------------------

# Build and Run #

## Server ##

### Build ###
gradlew :server:shadowJar

### Run ###
heroku local -f Procfile.windows

## Client ##

### Build ###
gradlew :client:shadowJar

### Run ###
java -jar client\build\libs\client-1.0-SNAPSHOT-all.jar
