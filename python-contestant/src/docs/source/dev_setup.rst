Contestant Instructions
=======================


Setup
-----

1. (Optional) Install Git
.........................

You don't need to have Git installed in order to take part, but it might
help if you're collaborating with others. However, if you're not
familiar with Git, now may not be the best time to learn it.

On Windows, you can download Git for Windows
`here <https://gitforwindows.org/>`__. This also gives you access to a
Linux~style Bash shell terminal called Git Bash.


2. Java Installation
.....................

You will need a Java Runtime Environment on your machine in order to connect to the hackathon's server.
Download and install via `Oracle <https://www.java.com/en/download/>`_.

If you already have Java installed, check that the version is at least 8 or newer. Otherwise, download a newer one
through the above link.

.. code:: batch

    java -version

3. Python Installation
......................

You will need to install Python on your machine. You can download an installation
`here <https://www.python.org/downloads/>`_.

1. Run the installer and select the **Customize Installation** option.
2. Select all checkboxes in the Optional Features window and click Next.
3. In the Advanced Options window, select the **Add Python to environment variables** checkbox, and also select the
   **Install for all users** checkbox if you have Administrator rights on your machine.
4. Make a note of the installation location and click Install.

After installing Python, run the following command in a terminal to check the installed version:

.. code:: batch

    python --version

It should output a version 3.7 or later.


4. Import project into an IDE/Editor
..................................................

It will probably be easier to do development in a Python IDE - as they can provide
features such as intelligent code editing, safe refactoring, debugging, and other
useful built-in developer tools.

We recommend you use JetBrains' PyCharm IDE for developing your Python code.
Alternatively, you may use Visual Studio Code as a Python editor.

PyCharm
~~~~~~~

You can find a link to download PyCharm's Community Edition
`here <https://www.jetbrains.com/pycharm/download>`__.

**Import Project**

1. Run PyCharm after the installation is complete.

2. When prompted, select "Open", browse to the directory of this project and select it.

**Setup Python Interpreter**

1. Open PyCharm's settings by going to File > Settings, or by using the Ctrl + Alt + S shortcut.
2. Click and expand "Project: python-contestant", and select the "Project Interpreter" option.
3. Open the "Add Python Interpreter" window by clicking on the cog next to the project interpreter dropdown.
4. Select "New Environment", and use "<project-directory>/venv" as the environment's location. Make sure the Base
   interpreter is selected as the Python installation from step 2.
5. Click OK and PyCharm will setup a Python
   `virtual environment <https://docs.python.org/3/glossary.html#term-virtual-environment>`_ for your project.
6. Click OK again to close the settings window.

**Install Dependencies**

1. Open the requirements.txt file using the Project view (Alt + 1 if you can't see it).
2. PyCharm will prompt that package requirements are not satisfied.
3. Click "Install requirements" on the prompt.
4. The project's three dependencies will be installed via `pip <https://pypi.org/project/pip/>`_.

Visual Studio Code
~~~~~~~~~~~~~~~~~~

Download and install VS Code (`link <https://code.visualstudio.com>`_).

**Import Project**

1. Run VS Code after the installation is complete.
2. Click File > Open Folder..., browse to the project's directory location and select it.
3. Install the VS Code `Python extension <https://marketplace.visualstudio.com/items?itemName=ms-python.python>`_.

**Setup virtual environment**

1. Open a new VS Code Terminal (Ctl + Shift + ')
2. Run the following to create a Python
   `virtual environment <https://docs.python.org/3/glossary.html#term-virtual-environment>`_ for your project:

    .. code:: batch

        python -m venv venv

3. Activate the virtual environment:

    .. tabs::

        .. group-tab:: Powershell

            .. code:: batch

                .\venv\Scripts\activate

            - You might see this error or similar related to Powershell as below:

            .. code:: batch

                .\venv\Scripts\activate : File ..\python-contestant\venv\Scripts\activate cannot be loaded because running scripts is disabled on
                this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
                At line:1 char:1
                + .\venv\Scripts\activate
                + ~~~~~~~~~~~~~~~~~~~~~~~
                    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
                    + FullyQualifiedErrorId : UnauthorizedAccess

            - To fix this, create a **.vscode** directory in the root directory of the project, and create a file named
              **settings.json** under it. Add the following to the file:

                .. code:: json

                    {
                        "terminal.integrated.shellArgs.windows": ["-ExecutionPolicy", "Bypass"]
                    }

            - Restart your VS Code terminal. If you are prompted whether you want to allow VS code to change the policy for the
              workspace, click Allow and restart your terminal again to apply the changes.

            - Run the activate command again.

        .. group-tab:: Bash

            .. code:: batch

                 source venv/Scripts/activate


4. Your terminal should now indicate that the virtual environment is active next to the command line prompt:

    .. code:: batch

        (venv) python-contestant>

   Should you wish to deactivate the virtual environment, you can run:

    .. code:: batch

        (venv) python-contestant> deactivate


5. Install the project's dependencies using `pip <https://pypi.org/project/pip/>`_:

    .. code:: batch

        (venv) python-contestant> pip install -r requirements.txt

Running your bot
----------------

To connect your bot to the hackathon's server, you need to run the Java remote-client application found in the lib
directory and provide the command to run this Python application.

The entry point for Python application is at main.py in the root directory. This will start a Python process that works
with the remote-client to pass the current game state to your bot and return your list of moves to the server.

To connect your bot so you can test it against the default bots login to your hackathon viewer with the username and
password provided. Go to the Remote Bot dashboard, click Connect then run the following command and wait until it has
connected.

    .. tabs::

        .. group-tab:: Powershell

            .. code:: batch

                java -jar lib\remote-1.0-SNAPSHOT-all.jar -c "<path-to-your-project-directory>\venv\Scripts\python <path-to-your-project-directory>\main.py" --team <team-name> --host <hackathon-host> --port <hackathon-host-port>

        .. group-tab:: Bash

            .. code:: batch

                java -jar lib/remote-1.0-SNAPSHOT-all.jar -c "<path-to-your-project-directory>/venv/Scripts/python <path-to-your-project-directory>/main.py" --team <team-name> --host <hackathon-host> --port <hackathon-host-port>

Now you can test your bot against the default bot by clicking Test and waiting. Change the speed of the game play to
more easily see what is going on, you can also replay the game but sliding the slider on the lower chart back.

Restrictions
------------

There are only a few restrictions on the code:

- You must export your Bot's class implementation in contestant/__init__.py, further instructions are in the file.
- You may edit/create .py files only in the contestant package.
- Your Bot should take no more than 2 seconds for its `initialise()` method to run (if implemented) or else it will be
  disqualified,
- Your Bot should take no more than half a second to calculate the moves or else it will be disqualified.
- The returned list of moves should not be or contain ``None``

Next Steps
----------

When you're ready to move on, this :doc:`tutorial <tutorials/index>` provides a step-by-step guide to adding some basic
intelligence to your bot.
