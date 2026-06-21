import { Page, Locator } from '@playwright/test';

/**
 * Главная страница.
 * Селекторы — предположение по PROJECT.md (квиз «подбор по площади», табы «Топ сезона»).
 * Подтверди через `npm run codegen`, затем уточни здесь.
 */
export class HomePage {
  readonly page: Page;
  readonly quiz: Locator;
  readonly seasonTabs: Locator;
  readonly modelCounter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.quiz = page.locator('.ac-picker, [data-ac-picker]'); // TODO: уточнить
    this.seasonTabs = page.locator('.season-top [role="tab"], .season-top .tab'); // TODO
    this.modelCounter = page.locator('[data-models-count], .ac-picker__count'); // TODO
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
