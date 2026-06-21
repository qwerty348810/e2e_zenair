import { Page } from '@playwright/test';

/** Закрывает cookie-баннер, если он показался. */
export async function acceptCookies(page: Page): Promise<void> {
  const btn = page.getByRole('button', { name: 'Принять' });
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => undefined);
  }
}

/** Раскрывает мегаменю «Каталог» (наведением) и переходит в «Кондиционеры». */
export async function openConditioners(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Каталог/ }).hover();
  const link = page.getByRole('link', { name: /Кондиционеры/ });
  await link.first().waitFor({ state: 'visible' });
  await link.first().click();
}

/** Главная → Каталог → Кондиционеры → карточка товара → «В корзину». */
export async function addProductToCart(page: Page): Promise<void> {
  const productName = process.env.ZEN_PRODUCT_NAME || 'Gree-Airy-black';
  await page.goto('/');
  await acceptCookies(page);
  await openConditioners(page);
  await page.getByRole('link', { name: productName }).first().click();
  await page.locator('button[name="add-to-cart"]').click();
}