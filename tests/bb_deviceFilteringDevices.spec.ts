import { test, expect, Page } from '@playwright/test';
import { DevicePage } from '../pages/DevicePage';
import { assertions } from '../data/assertions';
import { urls } from '../data/urls';

test('Apply filtering, select descending price order, and verify first device - brand, price, tariff', async ({ page }) => {
    const devicePage = new DevicePage(page);

    await page.goto(urls.Category.Telefoni);
    await devicePage.verifyPageTitle(assertions.pageTitle);

    //Verify main content and filters
    await devicePage.verifyMainContent();
    await devicePage.verifyFiltersAndDropdown();

    await devicePage.applyPriceRangeFilter();
    await devicePage.applyTariffFilter(assertions.firstDeviceExpectedTariff);

    //Order by descending price
    await devicePage.orderByDescendingPrice();

    //Verify the filtered results - details of first device
    const expectedBrand = assertions.firstDeviceExpectedBrand;
    const expectedMaxPrice = assertions.firstDeviceExpectedMaxPrice;
    const expectedTariff = assertions.firstDeviceExpectedTariff;

    await devicePage.verifyFirstDevice(expectedBrand, expectedMaxPrice, expectedTariff);
});