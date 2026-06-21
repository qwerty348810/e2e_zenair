import { Page, Locator } from '@playwright/test';

/** Каталог. «Каталог» — кнопка с hover-меню, «Кондиционеры» — ссылка внутри него. */
export class CatalogPage {
  readonly page: Page;
  readonly catalogButton: Locator;
  readonly categoryConditioners: Locator;

  constructor(page: Page) {
    this.page = page;
    this.catalogButton = page.getByRole('button', { name: /Каталог/ });
    this.categoryConditioners = page.getByRole('link', { name: /Кондиционеры/ });
  }

  async openConditioners(): Promise<void> {
    await this.catalogButton.hover();
    await this.categoryConditioners.first().waitFor({ state: 'visible' });
    await this.categoryConditioners.first().click();
  }

  productLink(name: string): Locator {
    return this.page.getByRole('link', { name });
  }
}