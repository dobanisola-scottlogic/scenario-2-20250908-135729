import { Given } from "@cucumber/cucumber";
import { page } from "../support/world";

Given(
  "I login using the username {string} and the password {string}",
  async function (username: string, password: string) {
    await page.getByPlaceholder("Team Name").fill(username);
    await page.getByPlaceholder("Password").fill(password);
    await page.getByRole("button", { name: "Login" }).click();
  }
);