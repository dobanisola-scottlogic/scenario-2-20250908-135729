import { When } from "@cucumber/cucumber";
import { page } from "../support/world";

When("I click the {string} button", async function (button: string) {
      await page.getByRole("button", {name: button}).click()
  }
);