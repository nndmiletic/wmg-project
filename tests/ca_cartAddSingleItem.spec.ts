import { test, expect, Page } from '@playwright/test';
import { urls } from '../data/urls';
import { DevicePage } from '../pages/DevicePage';
import { CartPage } from '../pages/CartPage';

test('Add one device to cart and check cart', async ({ page }) => {
  const devicePage = new DevicePage(page);
  const cartPage = new CartPage(page);

  await page.goto(urls.Category.Telefoni);

  //Verify the first device and explore options
  await devicePage.verifyFirstDeviceDetails();
  await devicePage.openFirstDeviceDetailsPage();
  await devicePage.selectInstallmentOptions();
  await devicePage.changeTariff();
  await devicePage.verifyProductSpecifications();

  //Verify the specifications and add to cart
  await cartPage.verifySpecificationsAndAddToCart();
  await cartPage.addInsuranceAndContinue();
  await cartPage.verifyCartOverview();

  //Choose to continue with shopping
  await cartPage.continueShopping();
});