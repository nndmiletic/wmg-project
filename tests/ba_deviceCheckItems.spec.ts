import { test, expect, Page } from '@playwright/test';
import { DevicePage } from '../pages/DevicePage';
import { assertions } from '../data/assertions';
import { urls } from '../data/urls';

test.describe('Test to verify the display of devices for categories', () => {
  for (const category of urls.categoryData) {
    test(`Test to verify the display of devices for category: ${category.name}`, async ({ page }) => {
      const devicePage = new DevicePage(page);

      await page.goto(category.url);

      //Verify page title and URL
      await devicePage.verifyPageTitle(assertions.pageTitle);
      await expect(page).toHaveURL(category.url);

      //Verify main content on the page
      await devicePage.verifyMainContent();
      await devicePage.verifyCategoryTabs(assertions.categoryTabs);
      await devicePage.verifyFiltersAndDropdown();

      //Scroll and load all devices
      const totalDevices = await devicePage.scrollToLoadAllDevices('.device-item');
      await devicePage.verifyAtLeastOneDeviceVisible();
    });
  }
});