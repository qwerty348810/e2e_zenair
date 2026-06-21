import { Page } from '@playwright/test';

/** Закрывает cookie-баннер, если он показался. */
export async function acceptCookies(page: Page): Promise<void> {
  const btn = page.getByRole('button', { name: 'Принять' });
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => undefined);
  }
}

/**
 * Раскрывает мегаменю «Каталог» и переходит в «Кондиционеры».
 * Тема в main.js ветвится по `matchMedia('(hover: none)')`: на десктопе меню
 * открывается по mouseenter, на touch — по клику. Спрашиваем сам браузер,
 * чтобы не зависеть от имени Playwright-проекта.
 */
export async function openConditioners(page: Page): Promise<void> {
  const trigger = page.locator('.catnav-catalog');
  const dropdown = page.locator('.catnav-catalog .catalog-dropdown');
  const link = dropdown.getByRole('link', { name: /^Кондиционеры/ });

  const touch = await page.evaluate(() => matchMedia('(hover: none)').matches);
  if (touch) {
    await trigger.click();
  } else {
    await trigger.hover();
  }
  await link.waitFor({ state: 'visible' });
  await link.click();
}

/**
 * Главная → Каталог → Кондиционеры → первая карточка → «В корзину».
 * Возвращает имя выбранного товара (из .prodcard-name), чтобы спека потом
 * могла найти его в корзине без хардкода в .env.
 *
 * Кнопка `button[name="add-to-cart"]` есть и у похожих товаров на странице
 * товара — поэтому жмём строго `.single_add_to_cart_button`.
 */
export async function addProductToCart(page: Page): Promise<string> {
  await page.goto('/');
  await acceptCookies(page);
  await openConditioners(page);

  const card = page.locator('.prodcard-name').first();
  const name = ((await card.textContent()) ?? '').trim();
  await card.click();
  await page.locator('button.single_add_to_cart_button').click();
  return name;
}
