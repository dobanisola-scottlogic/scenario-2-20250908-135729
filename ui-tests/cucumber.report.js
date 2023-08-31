import { generate } from "multiple-cucumber-html-reporter";

const createdTime = new Date()

const fileName = createdTime.toString().split(' ')[0]
                 + "-"
                 + createdTime.getDate().toString().padStart(2, "0")
                 + "-"
                 + createdTime.getMonth().toString().padStart(2, "0")
                 + "--" 
                 + createdTime.getHours().toString().padStart(2, "0")
                 + "-"
                 + createdTime.getMinutes().toString().padStart(2, "0")
                 + "-"
                 + createdTime.getSeconds().toString().padStart(2, "0")

const generateTime = new Intl.DateTimeFormat("en-GB", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
}).format(createdTime);

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
generate({
  jsonDir: "./reports/playwright/",
  reportPath: `./reports/cucumber/${fileName}.html`,
  customData: {
    title: "Run info",
    data: [
      { label: "Project", value: "Hackathon" },
      { label: "Time of execution", value: generateTime },
    ],
  },
});
