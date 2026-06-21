import { Page, Locator, expect } from '@playwright/test';

/** Страница-заглушка auth.php (форма пароля периода разработки). */
export class AuthPage {
  readonly page: Page;
  readonly card: Locator;
  readonly login: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    this.card = page.locator('.auth-card');
    this.login = page.locator('input[name="login"]');
    this.password = page.locator('input[name="password"]');
    this.submit = page.locator('button[type="submit"]');
  }

  async expectGateGone(): Promise<void> {
    await expect(this.card).toHaveCount(0);
  }
}
