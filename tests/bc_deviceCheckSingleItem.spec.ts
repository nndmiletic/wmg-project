import { test, expect, Page } from '@playwright/test';
import { DevicePage } from '../pages/DevicePage';
import { assertions } from '../data/assertions';
import { urls } from '../data/urls';

test('Verify the display of single item (device)', async ({ page }) => {
    const devicePage = new DevicePage(page);

    await page.goto(urls.Category.Telefoni);

    //Verify the first device
    await devicePage.verifyAtLeastOneDeviceVisible();

    const firstDevice = page.locator('.device-item').first();
    await expect(firstDevice.locator('.device-name')).toHaveText(assertions.firstDeviceExpectedName);
    await expect(firstDevice.locator('.price-wrapper .price')).toBeVisible();

    //Opening the first device page and verify page elements
    await devicePage.verifyFirstDeviceDetailsPage();
    await devicePage.verifyProductSpecifications();
});