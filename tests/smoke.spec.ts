import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';

/**
 * Smoke: проверяет, что автоматизация проходит сквозь пароль разработки
 * и сайт отвечает. Эти тесты не зависят от внутренних селекторов магазина —
 * запускаются всегда и держат CI зелёным.
 */
test.describe('Smoke — доступ и доступность', () => {
  test('сессия проходит пароль: на главной нет формы авторизации', async ({ page }) => {
    await page.goto('/');
    await new AuthPage(page).expectGateGone();
    await expect(page).not.toHaveTitle(/в разработке|техническом обслуживании/i);
  });

  test('ключевые разделы отвечают без ошибок', async ({ page }) => {
    for (const url of ['/', '/cart/', '/checkout/']) {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      expect(response?.status() ?? 500, `URL ${url}`).toBeLessThan(400);
      await expect(page.locator('.auth-card')).toHaveCount(0);
    }
  });

  test('на странице есть контент сайта, а не заглушка', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('header, .site-header, #masthead').first()).toBeVisible();
  });
});
