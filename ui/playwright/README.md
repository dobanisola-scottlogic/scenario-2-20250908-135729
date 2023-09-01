# hackathon-playwright
For unit and integration testing of the hackathon UI.

## Commands 

**npx test playwright:** will run the Playwright tests against the current local Hackathon. 
For this to be functional, make sure that the hackathon is running in the background.

These tests will also generate reports after completion. The report will be opened automatically
on test failure, or can be opened with the following command:

```
npx playwright show-report playwright\test-results

```

Click [here](https://playwright.dev/docs/test-cli) for a list of command line options that 
may be used when running Playwright tests. For example, 'npx playwright tests --ui' allows
for an interactive UI to be opened, allowing you to examine what is going on at each individual
step of the test.