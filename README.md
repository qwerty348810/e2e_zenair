# ZenAir — E2E Tests (Playwright + TypeScript)

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![CI](https://github.com/qwerty348810/zenair-e2e/actions/workflows/playwright.yml/badge.svg)

End-to-end tests for the ZenAir WooCommerce store. The site is password-protected during development, so the suite logs in through the dev gate once in `global-setup` and reuses the session via `storageState`.

## How auth works

`global-setup.ts` opens the site, submits the `auth.php` login form (`input[name="login"]`, `input[name="password"]`), and saves the PHP session cookie to `.auth/state.json`. Every test then starts already authenticated. Credentials come from environment variables only — never committed.

## Setup

```bash
npm install
npx playwright install
cp .env.example .env      # then fill ZEN_PASSWORD
npm run test:smoke        # smoke suite (auth + availability)
```

## Test layout

| Spec | Status | Covers |
|------|--------|--------|
| `tests/smoke.spec.ts` | always on | Auth gate passed, key pages respond, real content renders |
| `tests/shop.spec.ts` | on | Catalog → product → add to cart, quantity change, item removal |
| `tests/checkout.spec.ts` | on | Checkout reaches the order screen (address, shipping, payment) — **order is never placed** |

## Selectors

Locators are user-facing (`getByRole` / `getByLabel`), confirmed against the live site with Playwright codegen:

```bash
npm run codegen   # opens zenair.by already logged in (loads saved session)
```

## Important

- **Checkout never places an order.** Cash-on-delivery is enabled, so "Оформить заказ" would create a real order in WooCommerce admin. The checkout spec asserts the button is present and enabled, then stops — it never clicks it.
- **Secrets stay out of git.** `.env` and `.auth/` are git-ignored. In CI, set `ZEN_LOGIN` / `ZEN_PASSWORD` as repository secrets (Settings → Secrets and variables → Actions).

## Author

**Dmitry Yakovlev** — QA / E2E Engineer & Web Developer · [dmitryyakovlev.by](https://dmitryyakovlev.by)
