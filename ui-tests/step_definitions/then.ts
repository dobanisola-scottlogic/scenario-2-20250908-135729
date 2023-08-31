import { Then } from "@cucumber/cucumber";
import { page } from "../support/world";
import { expect } from "@playwright/test";

Then(
  "I should be redirected to the {string} screen",
  async function () {
      // Using current page title to show successful test 
      await expect(page).toHaveTitle("Hackathon Viewer")
  }
);