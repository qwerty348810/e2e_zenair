import { Page, Locator } from '@playwright/test';

/** Страница товара. Кнопка добавления подтверждена: button[name="add-to-cart"]. */
export class ProductPage {
  readonly page: Page;
  readonly addToCart: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCart = page.locator('button[name="add-to-cart"]');
    this.viewCartLink = page.getByRole('link', { name: /Просмотр корзины/ });
  }

  async addCurrentToCart(): Promise<void> {
    await this.addToCart.click();
  }
}
