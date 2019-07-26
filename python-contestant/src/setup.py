import os
import shutil
from distutils.cmd import Command
from distutils.core import run_setup

from setuptools import setup
from sphinx.setup_command import BuildDoc


class BuildHtmlCommand(Command):
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        # Build documentation
        shutil.rmtree("docs/source/_autosummary", ignore_errors=True)
        run_setup('setup.py', ['build_sphinx'])
        # Clean dist and re-create dir
        shutil.copytree("build/sphinx/html", "docs_html")
        shutil.rmtree("build", ignore_errors=True)
        shutil.rmtree("temp", ignore_errors=True)
        shutil.rmtree("docs", ignore_errors=True)


cmdclass = {'build_sphinx': BuildDoc, 'html': BuildHtmlCommand}

setup(
    name='python-contestant',
    packages=['bots', 'game', 'test', 'util', 'contestant'],
    url='',
    license='',
    author='Scott Logic',
    author_email='',
    description='Scott Logic Hackathon Python Contestant',
    cmdclass=cmdclass
)
