import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import {
  acceptCookies,
  addProductToCart,
  openConditioners,
} from './helpers';

test.describe('Каталог и корзина', () => {
  test('из каталога можно открыть товар и добавить его в корзину', async ({ page }) => {
    await page.goto('/');
    await acceptCookies(page);
    await openConditioners(page);

    await page.locator('.prodcard-name').first().click();

    const product = new ProductPage(page);
    await expect(product.addToCart).toBeVisible();
    await product.addCurrentToCart();
    await expect(product.viewCartLink).toBeVisible();
  });

  test('товар отображается в корзине с итоговой суммой', async ({ page }) => {
    const name = await addProductToCart(page);

    const cart = new CartPage(page);
    await cart.goto();
    await cart.expectHasItem(name);
  });

  test('количество можно увеличить, а товар — удалить', async ({ page }) => {
    const name = await addProductToCart(page);

    const cart = new CartPage(page);
    await cart.goto();
    await expect(cart.increaseQty).toBeVisible();

    await cart.increaseQty.click();
    await cart.increaseQty.click();
    await expect(cart.increaseQty).toBeEnabled();

    await cart.removeItem.click();
    await expect(cart.itemByName(name).first()).toBeHidden();
  });
});
