import { Page, Locator, expect } from '@playwright/test';
import { assertions } from '../data/assertions';
import { urls } from '../data/urls';

export class DevicePage {
    readonly page: Page;

    //Locators for page elements
    private pageWrap: Locator;
    private ecommerceComponent: Locator;
    private categoryTextBanner: Locator;
    private title: Locator;
    private categoryTabsSection: Locator;
    private filterSection: Locator;
    private devices: Locator;
    private dropdown: Locator;
    private categoryTabs: Locator;
    private rangeCategoryItems: Locator;
    private tariffCategoryContainer: Locator;
    private orderOption: Locator;
    private firstDevice: Locator;
    private deviceName: Locator;
    private devicePrice: Locator;
    private galleryNavLocator: Locator;
    private installmentSection: Locator;
    private installmentOptions: Locator;
    private tariffName: Locator;
    private changeTariffButton: Locator;
    private tariffsContainer: Locator;
    private tariffOmorikaS: Locator;
    private closeTariffButton: Locator;
    private productTabs: Locator;
    private classificationContainer: Locator;

    constructor(page: Page) {
        this.page = page;

        //Initializing all locators
        this.pageWrap = page.locator('#page-wrap');
        this.ecommerceComponent = page.locator('#b2cEcommerceComponent');
        this.categoryTextBanner = page.locator('.text-banner.category-text-banner.ecb2c');
        this.title = page.locator('.text-banner.category-text-banner.ecb2c h1.title');
        this.categoryTabsSection = page.locator('#categoryTabs');
        this.filterSection = page.locator('#b2cEcommerceComponent .container .main-page-content .ecb2c__top-filter-section');
        this.devices = page.locator('.device-item');
        this.dropdown = page.locator('#vs2__combobox');
        this.categoryTabs = page.locator('#categoryTabs .pills-centered .pills-static');
        this.rangeCategoryItems = page.locator('.ecb2c__facet-category .category-item.clearfix');
        this.tariffCategoryContainer = page.locator('.ecb2c__facet-category');
        this.orderOption = page.locator('#vs2__listbox [role="option"]:text("Cene - Opadajuće")');
        this.firstDevice = page.locator('.device-item').first();
        this.deviceName = this.firstDevice.locator('.device-name');
        this.devicePrice = this.firstDevice.locator('.price-wrapper .price');
        this.galleryNavLocator = page.locator('.gallery-nav.without-slider');
        this.installmentSection = page.locator('.pdp-section-title', { hasText: 'Rata za uređaj' }).locator('..');
        this.installmentOptions = this.installmentSection.locator('.option-btns button');
        this.tariffName = page.locator('.selected-tariff').first();
        this.changeTariffButton = page.locator('.just-red-text.to-vpp-btn');
        this.tariffsContainer = page.locator('.tariffs.container.pdp-container');
        this.tariffOmorikaS = page.locator('.tariff-single').filter({ hasText: 'Omorika S' });
        this.closeTariffButton = page.locator('.just-red-text.to-vpp-btn.open');
        this.productTabs = page.locator('.product-tabs');
        this.classificationContainer = page.locator('.classification-container-tab');
    }

    //Methods for interacting with the page elements
    async verifyPageTitle(expectedTitle: string) {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    async verifyCategoryTabs(tabs: string[]) {
        await expect(this.categoryTabsSection).toBeVisible();
        for (const tab of tabs) {
            const tabLocator = this.categoryTabs.locator(`text=${tab}`).first();
            await expect(tabLocator).toBeVisible();
            await expect(tabLocator).toHaveText(tab);
        }
    }

    async verifyMainContent() {
        await expect(this.pageWrap).toBeVisible();
        await expect(this.ecommerceComponent).toBeVisible();
        await expect(this.categoryTextBanner).toBeVisible();
        await expect(this.title).toBeVisible();
        await expect(this.title).toHaveText(assertions.categoryBannerText);
    }

    async verifyFiltersAndDropdown() {
        await expect(this.filterSection).toBeVisible();
        await expect(this.dropdown).toBeVisible();
    }

    async applyPriceRangeFilter() {
        const rangeCatItemFirst = this.rangeCategoryItems.first();
        await rangeCatItemFirst.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator('.ecb2c__selected-filters-container .selected-filter .selected-filter-text').nth(0)).toHaveText(' 0 - 5.000 ');
        const rangeCatItemSecond = this.rangeCategoryItems.nth(1);
        await rangeCatItemSecond.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.locator('.ecb2c__selected-filters-container .selected-filter .selected-filter-text').nth(1)).toHaveText(' 5.000 - 10.000 ');
    }

    async applyTariffFilter(tariffName: string) {
        const tariffItem = this.tariffCategoryContainer.locator(`text=${tariffName}`);
        await tariffItem.scrollIntoViewIfNeeded();
        await tariffItem.click();
        await this.page.waitForLoadState('networkidle');
    }

    async orderByDescendingPrice() {
        await this.dropdown.click();
        await this.orderOption.click();
        await expect(this.dropdown.locator('.vs__selected')).toHaveText('Cene - Opadajuće');
    }

    async verifyFirstDevice(expectedBrand: string, expectedMaxPrice: number, expectedTariff: string) {
        const firstDevice = this.devices.first();
        await expect(firstDevice.locator('.brand-name')).toHaveText(expectedBrand);
        const priceText = await firstDevice.locator('.price-wrapper .price').textContent();
        if (!priceText) {
            throw new Error('Price is missing');
        }
        const price = parseFloat(priceText.replace(/[^\d.-]/g, ''));
        expect(price).toBeLessThanOrEqual(expectedMaxPrice);
        await expect(firstDevice.locator('.bottom-section .tariff-name')).toHaveText(expectedTariff);
    }

    async scrollToLoadAllDevices(selector: string) {
        let previousCount = 0;
        let currentCount = await this.page.locator(selector).count();
        while (currentCount > previousCount) {
            previousCount = currentCount;
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await this.page.waitForTimeout(2000);
            currentCount = await this.page.locator(selector).count();
        }
        console.log(`Total number of found devices: ${currentCount}`);
        return currentCount;
    }

    async verifyAtLeastOneDeviceVisible() {
        await this.page.waitForSelector('.device-item', { timeout: 10000 });
        await expect(this.devices.first()).toBeVisible();
    }

    async verifyFirstDeviceDetailsPage() {
        const firstDevice = this.devices.first();
        await firstDevice.click();
        await expect(this.page).toHaveURL(urls.firstDeviceUrl);
        await expect(this.page.locator('#page-wrap')).toBeVisible();
        await expect(this.page.locator('#b2cEcommerceComponent')).toBeVisible();
        await expect(this.page.locator('.container.pdp-container').first()).toBeVisible();
        await expect(this.page.locator('.steps-and-counter-wrapper.step-1')).toBeVisible();
    }

    async verifyProductSpecifications() {
        await expect(this.productTabs).toBeVisible();
        await expect(this.page.locator('.product-tabs .tabs .tab').first()).toBeVisible();
        await expect(this.page.locator('.product-tabs .tabs .tab').nth(1)).toBeVisible();
        await this.page.locator('.product-tabs .tabs .tab').nth(1).click();
        const classificationContainer = this.page.locator('.classification-container-tab');
        await expect(classificationContainer).toBeVisible();
    }

    async verifyFirstDeviceDetails() {
        await expect(this.firstDevice).toBeVisible();
        await expect(this.deviceName).toBeVisible();
        await expect(this.deviceName).not.toBeEmpty();
        await expect(this.deviceName).toHaveText('S24 128GB');
        await expect(this.devicePrice).toBeVisible();
        await expect(this.devicePrice).not.toBeEmpty();
    }

    async openFirstDeviceDetailsPage() {
        await this.firstDevice.click();
        await expect(this.page).toHaveURL(urls.firstDeviceUrl);
        await expect(this.pageWrap).toBeVisible();
        await expect(this.ecommerceComponent).toBeVisible();
        await expect(this.page.locator('.container.pdp-container').first()).toBeVisible();
        await expect(this.page.locator('.steps-and-counter-wrapper.step-1')).toBeVisible();
        await expect(this.page.locator('.swiper-slide.swiper-slide-active')).toBeVisible();
        await expect(this.galleryNavLocator).toBeVisible();
        await expect(this.galleryNavLocator.locator('.active')).toBeVisible();
        await expect(this.galleryNavLocator.locator('.image-wrap')).toHaveCount(4);
        await expect(this.page.getByText('Podeli link').first()).toBeVisible();
        await expect(this.page.locator('.pdp-product-info')).toBeVisible();
        await this.page.locator('.pdp-product-info').scrollIntoViewIfNeeded();
        await expect(this.page.locator('.pdp-section').first()).toBeVisible();
        await expect(this.page.locator('.pdp-section .pdp-section-title').first()).toHaveText(assertions.pdpSectionTitles[0]);
        await expect(this.page.locator('.pdp-section').nth(1)).toBeVisible();
        await expect(this.page.locator('.pdp-section .pdp-section-title').nth(1)).toHaveText(assertions.pdpSectionTitles[1]);
    }

    async selectInstallmentOptions() {
        await expect(this.installmentOptions).toHaveCount(3);
        await expect(this.installmentOptions.nth(0)).toHaveText('24');
        await expect(this.installmentOptions.nth(1)).toHaveText('12');
        await expect(this.installmentOptions.nth(2)).toHaveText('6');
        await this.installmentOptions.nth(1).click();
        await this.installmentOptions.nth(2).click();
        await this.installmentOptions.nth(0).click();
        await expect(this.installmentOptions.nth(0)).toHaveClass(/active/);
    }

    async changeTariff() {
        await expect(this.page.locator('.pdp-product-info .pdp-section.separated')).toBeVisible();
        await expect(this.page.locator('.pdp-section-title').nth(2)).toHaveText(assertions.pdpSectionTitles[2]);
        await expect(this.tariffName).toHaveText('Omorika M');
        await expect(this.changeTariffButton).toBeVisible();
        await expect(this.changeTariffButton).toHaveText('Promeni paket');
        await this.changeTariffButton.click();
        await this.tariffsContainer.scrollIntoViewIfNeeded();
        await expect(this.tariffsContainer).toBeVisible();
        const selectedOptionText = await this.page.locator('.vs__selected').nth(1).innerText();
        await expect(selectedOptionText).toBe('Omorika');
        await this.tariffOmorikaS.locator('.choose-device').click();
        await expect(this.closeTariffButton).toBeVisible();
        await expect(this.closeTariffButton).toHaveText('Zatvori');
        await this.closeTariffButton.click();
        await expect(this.tariffName).toHaveText('Omorika S');
    }
}