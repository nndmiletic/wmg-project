import { test } from '@playwright/test';
import { config } from '../config';
import { LoginPage } from '../pages/LoginPage';
import { assertions } from '../data/assertions';
import { urls } from '../data/urls';

test('Attempt login with valid credentials, and logout', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigateToLoginPage();
  await loginPage.verifyHomePage(assertions.homePageTitle, urls.baseUrl);

  //Login
  if (!config.valid.username || !config.valid.password) {
    throw new Error('Valid username or password is not defined in the configuration.');
  }
  await loginPage.login(config.valid.username, config.valid.password);
  await loginPage.verifyLoginSuccess(assertions.userIconButton);

  //Logout
  await loginPage.logout();
});