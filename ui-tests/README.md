# hackathon-playwright
For unit and integration testing of the hackathon UI.

## Commands

**npm install:** to be done before anything else. 

**npm test:** will run the Playwright tests against the current local Hackathon. 

For this to be functional, make sure that the hackathon is running in the background and that
no manual testing has occurred to ensure that tests will not fail due to unexpected previous 
inputs.

These tests will also generate reports after completion. The link will be provided in the 
terminal used to run the tests; otherwise they can be found as html files under 
reports/cucumber

To utilise tags found in the feature files append '-- --tags @tag' to the command
above. Further information may be found [here,] https://cucumber.io/docs/cucumber/api/?lang=javascript#tags, bearing in mind that double quotes should be used for multiple 
tags. An example of the usage of tags in running your tests may be found below:

    ```
    npm test -- --tags @unit

    ```

## Available tags

- @unit
- @integration
- @login
