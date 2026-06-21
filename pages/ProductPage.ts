import { Page, Locator } from '@playwright/test';

/**
 * Страница товара. Главная кнопка "В корзину" — `.single_add_to_cart_button`
 * (WooCommerce). На странице есть ещё кнопки `button[name="add-to-cart"]`
 * из блока похожих товаров — их игнорируем.
 */
export class ProductPage {
  readonly page: Page;
  readonly addToCart: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCart = page.locator('button.single_add_to_cart_button');
    this.viewCartLink = page.getByRole('link', { name: /Просмотр корзины/ });
  }

  async addCurrentToCart(): Promise<void> {
    await this.addToCart.click();
  }
}
