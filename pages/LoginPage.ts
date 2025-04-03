import { Page, Locator, expect } from '@playwright/test';
import { urls } from '../data/urls';

export class LoginPage {
    readonly page: Page;

    //Locators for page elements
    private userMenu: Locator;
    private loginForm: Locator;
    private usernameField: Locator;
    private passwordField: Locator;
    private loginButton: Locator;
    private logoutButton: Locator;
    private authorizedForm: Locator;
    private errorMessageEmail: Locator;
    private errorMessagePassword: Locator;

    constructor(page: Page) {
        this.page = page;

        //Initializing all locators
        this.userMenu = page.locator('.ecb2c__user-menu');
        this.loginForm = page.locator('.header-login-form.ecb2c');
        this.usernameField = page.getByRole('textbox', { name: 'Korisničko ime/Imejl/Broj' });
        this.passwordField = page.locator('#password');
        this.loginButton = page.getByRole('button', { name: 'Prijavi se' });
        this.logoutButton = page.locator('.logout-btn');
        this.authorizedForm = page.locator('.header-login-form.authorized');
        this.errorMessageEmail = page.locator('div.login-input-wrap input#email').locator('..').locator('span.error-message');
        this.errorMessagePassword = page.locator('div.login-input-wrap input#password').locator('..').locator('span.error-message');
    }

    //Methods for interacting with the page elements
    async navigateToLoginPage() {
        await this.page.goto(urls.baseUrl);
    }

    async verifyHomePage(title: string, url: string) {
        await expect(this.page).toHaveURL(url);
        await expect(this.page).toHaveTitle(title);
    }

    async login(username: string, password: string) {
        await this.userMenu.locator('.user-info.b2c-ecommerce-component').click();
        await expect(this.loginForm).toBeVisible();
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    async verifyLoginSuccess(expectedUsername: string) {
        await this.page.waitForSelector(`text=${expectedUsername}`, { state: 'visible' });
    }

    async logout() {
        await this.userMenu.locator('.user-info.b2c-ecommerce-component').click();
        await expect(this.authorizedForm).toBeVisible();
        await this.logoutButton.click();
    }

    async verifyInvalidLogin() {
        await this.page.waitForLoadState('networkidle');
        await this.errorMessageEmail.waitFor({ state: 'attached', timeout: 5000 });
        await this.errorMessagePassword.waitFor({ state: 'attached', timeout: 5000 });
    }
}