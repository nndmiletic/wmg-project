import { Page, Locator, expect } from '@playwright/test';
import { assertions } from '../data/assertions';
import { urls } from '../data/urls';

export class CartPage {
    readonly page: Page;

    //Locators for page elements
    private stickyCart: Locator;
    private addToCartButton: Locator;
    private insuranceContainer: Locator;
    private insuranceCheckbox: Locator;
    private continueButton: Locator;
    private cartSummary: Locator;
    private tariffNameLocator: Locator;
    private deviceNameLocator: Locator;
    private insuranceOptionLocator: Locator;
    private priceRowFirst: Locator;
    private priceRowLast: Locator;
    private vatTitle: Locator;
    private continueShoppingButton: Locator;
    private finishPurchaseButton: Locator;

    constructor(page: Page) {
        this.page = page;

        //Initializing all locators
        this.stickyCart = page.locator('.product-sticky-cart');
        this.addToCartButton = this.stickyCart.locator('button:has-text("Dodaj u korpu")');
        this.insuranceContainer = page.locator('.insurance-container-wrapper');
        this.insuranceCheckbox = page.locator('.insurance-container-wrapper .price-checkbox-wrapper .toggle-switch-checkbox-label');
        this.continueButton = this.stickyCart.locator('button:has-text("Nastavi")');
        this.cartSummary = page.locator('.product-details-cart-summary');
        this.tariffNameLocator = page.locator('.cart-item.mini-cart-item.tariff .title');
        this.deviceNameLocator = page.locator('.cart-item.mini-cart-item.device .brand');
        this.insuranceOptionLocator = page.locator('.cart-item.mini-cart-item.insurance .title');
        this.priceRowFirst = page.locator('.price-container.ecb2c .price-row').first().locator('.ecb2c__flex-price .price');
        this.priceRowLast = page.locator('.price-container.ecb2c .price-row').nth(1).locator('.ecb2c__flex-price .price');
        this.vatTitle = page.locator('.vat-title');
        this.continueShoppingButton = page.getByText('Nastavi sa kupovinom');
        this.finishPurchaseButton = page.getByText('Završi kupovinu');
    }

    //Methods for interacting with the page elements
    async verifySpecificationsAndAddToCart() {
        await expect(this.stickyCart).toBeVisible();
        await expect(this.addToCartButton).toBeVisible();
        await this.addToCartButton.click();
    }

    async addInsuranceAndContinue() {
        await expect(this.page.url()).toBe(urls.firstDeviceUrlChanged);
        await expect(this.insuranceContainer).toBeVisible();
        await expect(this.insuranceContainer.locator('.insurance-container .title')).toBeVisible();
        await expect(this.insuranceContainer.locator('.insurance-container .title')).toHaveText(assertions.insuranceText);
        await expect(this.insuranceContainer.locator('.price-checkbox-wrapper')).toBeVisible();
        await expect(this.insuranceCheckbox).toBeVisible();
        await this.insuranceCheckbox.click();
        await expect(this.stickyCart).toBeVisible();
        await expect(this.continueButton).toBeVisible();
        await this.continueButton.click();
    }

    async verifyCartOverview() {
        await expect(this.cartSummary).toBeVisible();
        await expect(this.cartSummary.locator('.main-title')).toBeVisible();
        await expect(this.cartSummary.locator('.main-title')).toHaveText(assertions.cartTitle);
        await expect(this.tariffNameLocator).toHaveText(assertions.cartTariff);
        await expect(this.deviceNameLocator).toHaveText(assertions.cartBrand);
        await expect(this.insuranceOptionLocator).toHaveText(assertions.cartInsurance);
        await expect(this.page.locator('.price-container.ecb2c')).toBeVisible();
        await expect(this.page.getByText('Ukupni troškovi')).toBeVisible();
        await expect(this.priceRowFirst).toBeVisible();
        await expect(this.priceRowLast).toBeVisible();
        await expect(this.priceRowFirst).not.toBeEmpty();
        await expect(this.priceRowLast).not.toBeEmpty();
        const firstPriceValue = await this.priceRowFirst.innerText();
        const lastPriceValue = await this.priceRowLast.innerText();
        const firstPriceNumber = parseFloat(firstPriceValue.replace(/\D/g, ''));
        const lastPriceNumber = parseFloat(lastPriceValue.replace(/\D/g, ''));
        expect(firstPriceNumber).toBeLessThan(10000);
        expect(lastPriceNumber).toBeLessThan(10000);
        await expect(this.vatTitle).toBeVisible();
        await expect(this.continueShoppingButton).toBeVisible();
        await expect(this.finishPurchaseButton).toBeVisible();
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.page).toHaveURL(urls.continueShoppingUrlTelefoni);
    }
}