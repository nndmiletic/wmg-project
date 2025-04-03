import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { assertions } from '../data/assertions';
import { credentials } from '../data/credentials';
import { urls } from '../data/urls';

test('Attempt login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.navigateToLoginPage();
  await loginPage.verifyHomePage(assertions.homePageTitle, urls.baseUrl);

  //Attempt login with invalid credentials
  await loginPage.login(credentials.invalid.username, credentials.invalid.password);
  await loginPage.verifyInvalidLogin();
});