import { Page, Locator, expect } from '@playwright/test';

/**
 * Корзина (/cart/) — блочная корзина WooCommerce.
 * Локаторы подтверждены через codegen на живом zenair.by.
 */
export class CartPage {
  readonly page: Page;
  readonly increaseQty: Locator;
  readonly decreaseQty: Locator;
  readonly removeItem: Locator;
  readonly estimatedTotal: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.increaseQty = page.getByRole('button', { name: /Увеличить количество/ });
    this.decreaseQty = page.getByRole('button', { name: /Уменьшить количество/ });
    this.removeItem = page.getByRole('button', { name: /Удалить товар/ });
    this.estimatedTotal = page.getByText(/Предполагаемый итог/);
    this.checkoutLink = page.getByRole('link', { name: /Перейти к оформлению заказа/ });
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart/');
  }

  itemByName(name: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(name, 'i') });
  }

  async expectHasItem(name: string): Promise<void> {
    await expect(this.itemByName(name).first()).toBeVisible();
    await expect(this.estimatedTotal).toBeVisible();
  }
}
