import { After, Before, setDefaultTimeout } from "@cucumber/cucumber";
import {
  Browser,
  chromium,
  Page,
} from "@playwright/test";

let page: Page;
let browser: Browser;
setDefaultTimeout(60000);

Before(async () => {
  try {
    browser = await chromium.launch({ headless: false });
    const uiContext = await browser.newContext();
    page = await uiContext.newPage();
    await page.goto("http://localhost:8080/application/");
  } catch (error) {
      throw new Error(`chrome navigation to demo site failed due to ${error instanceof Error}`);
    }
    
  return page;
});

After(async () => {
  await browser.close();
});

export { page, browser };