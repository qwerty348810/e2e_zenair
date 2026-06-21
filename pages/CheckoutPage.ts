import { Page, Locator, expect } from '@playwright/test';

/**
 * Чекаут (/checkout/) — блочный, локаторы по подписям полей.
 *
 * ВАЖНО: «Оформить заказ» создаёт реальный заказ в админке WooCommerce.
 * В тестах кнопку НЕ нажимаем — только проверяем, что доступна.
 */
export class CheckoutPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly address: Locator;
  readonly city: Locator;
  readonly postcode: Locator;
  readonly freeShipping: Locator;
  readonly codPayment: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByLabel('Имя', { exact: true });
    this.lastName = page.getByLabel('Фамилия', { exact: true });
    this.address = page.getByLabel('Адрес', { exact: true });
    this.city = page.getByLabel('Населённый пункт');
    this.postcode = page.getByLabel('Почтовый индекс');
    this.freeShipping = page.getByText('Free shipping');
    this.codPayment = page.getByText(/Оплата при доставке/);
    this.placeOrderButton = page.getByRole('button', { name: 'Оформить заказ' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout/');
  }

  async fillShipping(opts: {
    first: string;
    last: string;
    address: string;
    city: string;
    postcode: string;
  }): Promise<void> {
    await this.firstName.fill(opts.first);
    await this.lastName.fill(opts.last);
    await this.address.fill(opts.address);
    await this.city.fill(opts.city);
    await this.postcode.fill(opts.postcode);
  }

  async expectReadyButNotPlaced(): Promise<void> {
    await expect(this.freeShipping.first()).toBeVisible();
    await expect(this.codPayment.first()).toBeVisible();
    await expect(this.placeOrderButton).toBeVisible();
    await expect(this.placeOrderButton).toBeEnabled();
    // Кнопку намеренно не нажимаем — иначе создастся заказ.
  }
}
