import { test } from '@playwright/test';
import { openConditioners } from './helpers';
import fs from 'fs';
import path from 'path';

/** Diagnostic — inspects product page DOM to find the real "add to cart" trigger. */
test('debug: product page', async ({ page }) => {
  const outDir = path.join(__dirname, '..', 'test-results', '_debug');
  fs.mkdirSync(outDir, { recursive: true });

  const productName = process.env.ZEN_PRODUCT_NAME || 'Gree-Airy-black';
  await page.goto('/');
  await openConditioners(page);
  await page.getByRole('link', { name: productName }).first().click();
  await page.locator('body').waitFor();

  fs.writeFileSync(path.join(outDir, 'product-url.txt'), page.url());

  // All buttons + their accessible names
  const buttons = await page.locator('button').evaluateAll((els) =>
    els.map((el) => ({
      text: el.textContent?.trim().slice(0, 80) ?? '',
      name: el.getAttribute('name'),
      id: el.id,
      cls: el.className,
      type: el.getAttribute('type'),
    })),
  );
  fs.writeFileSync(path.join(outDir, 'product-buttons.json'), JSON.stringify(buttons, null, 2));

  // Anchors that look like add-to-cart
  const cartAnchors = await page.locator('a').evaluateAll((els) =>
    els
      .map((el) => ({
        text: el.textContent?.trim().slice(0, 80) ?? '',
        href: (el as HTMLAnchorElement).href,
        cls: el.className,
      }))
      .filter((a) => /корзин|cart/i.test(a.text + ' ' + a.cls)),
  );
  fs.writeFileSync(path.join(outDir, 'product-cart-anchors.json'), JSON.stringify(cartAnchors, null, 2));

  await page.screenshot({ path: path.join(outDir, 'product.png'), fullPage: true });
  const aria = await page.locator('main, [role="main"], body').first().ariaSnapshot();
  fs.writeFileSync(path.join(outDir, 'product-aria.yaml'), aria.slice(0, 8000));
});
