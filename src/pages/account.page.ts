import { Page, Locator } from "@playwright/test";

export class AccountPage {

    readonly page: Page;
    readonly welcomeMessage: Locator

constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByRole('heading', { name: 'Welcome' });
}}