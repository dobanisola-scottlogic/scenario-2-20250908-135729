import { test, expect } from '@playwright/test';
import { LoginPage } from '../pageObjectModel/login-page';

test('admin can successfully log in', async ({ page }) => {
  await page.goto('http://localhost:8080/application/');
  const login = new LoginPage(page);
  await login.inputUsername('admin');
  await login.inputPassword('secret');
  await login.attemptLogin();
  await expect(page).toHaveTitle('Hackathon Viewer');
});
