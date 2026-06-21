import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { addProductToCart } from './helpers';

/**
 * Чекаут доходит до экрана оформления: адрес, доставка, способ оплаты и кнопка
 * «Оформить заказ» на месте — но заказ НЕ оформляем (кнопка создаёт реальный
 * заказ в админке). Демонстрируем проверку состояния, а не размещение заказа.
 */
test.describe('Оформление заказа', () => {
  test('чекаут готов к оформлению, но заказ не размещается', async ({ page }) => {
    await addProductToCart(page);

    const cart = new CartPage(page);
    await cart.goto();
    await expect(cart.checkoutLink).toBeVisible();
    await cart.checkoutLink.click();

    const checkout = new CheckoutPage(page);
    await checkout.fillShipping({
      first: 'Dmitry',
      last: 'Yakovlev',
      address: 'тестовый адрес 1',
      city: 'Витебск',
      postcode: '210004',
    });

    await checkout.expectReadyButNotPlaced();
  });
});
