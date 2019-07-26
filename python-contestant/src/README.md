# Python Contestant Repository

This directory holds the stub project to be given to hackathon Python contestants.
It contains:
- main.py - entry point of the Python app, listens to stdin, initialises and converses with the contestant Bot, writes response to stdout
- setup.py - custom step to build documentation site and contestant distributable
- requirements.txt - the project's dependencies (required for running main.py)
- doc-requirements.txt - dependencies for building the documentation, also installs requirements.txt
- contestant-README.md - the README.md file for contestants
- bots - abstract base Bot class that contestants implement
- game - the game's dataclasses, helper classes and methods
- docs - source for the Sphinx documentation site
- util - utility module for JSON handling and converting camelCase/snake_case attributes


## NOTE  
The gradle build builds a python-contestant.zip that is used with code-server
Currently it relies upon the docs_html having benn previously built using python.

## TODO: Need better way to assemble docs_html via python so it can be picked up by the gradle build.


#~~# Build documentation (don't need this bit any longer '~~~~& contestant distributable~~')~~

To build:
- Install Python
- Open a terminal at the root of this project
- Create a new virtual environment
```bash
python -m venv venv
```
- Activate the virtual environment

**Bash**
```bash
source venv/Scripts/activate
```

**Command Prompt/Powershell**
```bash
.\venv\Scripts\activate
```

- Install documentation dependencies
```bash
pip install -r doc-requirements.txt
```

- Run the setup.py build step
```bash
python setup.py contestant_repo
```

~~- Distributable tarball and zip will be in `dist/` directory~~
