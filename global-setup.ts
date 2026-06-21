import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const STORAGE_STATE = path.join(__dirname, '.auth', 'state.json');

async function globalSetup(_config: FullConfig): Promise<void> {
  const baseURL = process.env.ZEN_BASE_URL || 'https://zenair.by';
  const login = process.env.ZEN_LOGIN;
  const password = process.env.ZEN_PASSWORD;

  if (!login || !password) {
    throw new Error(
      'ZEN_LOGIN / ZEN_PASSWORD не заданы. Скопируй .env.example в .env и заполни (или задай секреты в CI).'
    );
  }

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

  // Форма-заглушка auth.php (на всех страницах, пока нет сессии).
  await page.fill('input[name="login"]', login);
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.click('button[type="submit"]'),
  ]);

  if (await page.locator('.auth-card').count()) {
    await browser.close();
    throw new Error('Логин на zenair не прошёл — проверь ZEN_LOGIN / ZEN_PASSWORD.');
  }

  // Принимаем cookie один раз — баннер сохранится в сессии и не будет мешать тестам.
  const cookieBtn = page.getByRole('button', { name: 'Принять' });
  if (await cookieBtn.isVisible().catch(() => false)) {
    await cookieBtn.click().catch(() => undefined);
    await page.waitForTimeout(300);
  }

  await page.context().storageState({ path: STORAGE_STATE });
  await browser.close();
}

export default globalSetup;
