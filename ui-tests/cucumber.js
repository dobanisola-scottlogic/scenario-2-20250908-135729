const common = {
        paths: ["./features/unit/*.feature", "./features/integration/*.feature"],
        requireModule: ["ts-node/register"],
        require: ["./step_definitions/*.ts"],
        format: [
          "progress",
          "json:reports/playwright/multiple-cucumber-html-reporter.json",
          "message:reports/playwright/multiple-cucumber-html-reporter.ndjson",
        ],
}

export const test_default = {
  ...common
}