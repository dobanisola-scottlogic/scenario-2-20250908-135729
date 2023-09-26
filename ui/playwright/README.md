# hackathon-playwright

For unit and integration testing of the hackathon UI.

## Commands

When running any of the below commands, make sure that your terminal window is located
in the ui directory (e.g. if on the base directory, cd into 'ui' before running any
tests).

When running the server, ensure the environment variable is set to "ENVIRONMENT=dev". This can be done in IntelliJ by navigating to Run > Edit configurations. Then in the Gradle dropdown > select hackathon-ai-game:server > enter ENVIRONMENT=dev into the Environment variables section. Press OK.

**npx playwright test:** will run the Playwright tests against the current local Hackathon.
For this to be functional, make sure that the hackathon server is running. The dev server is automatically run as part of
test configuration.

These tests will also generate reports after completion. The report will be opened automatically
on test failure, or can be opened with the following command:

```
npx playwright show-report 'playwright\report\results'

```

Click [here](https://playwright.dev/docs/test-cli) for a list of command line options that
may be used when running Playwright tests. For example, 'npx playwright test --ui' allows
for an interactive UI to be opened, allowing you to examine what is going on at each individual
step of the test. 'npx playwright codegen' aids in helping find selectors in the case of
any new added components.
