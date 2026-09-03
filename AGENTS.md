# Facebetter documentation

Mintlify docs for the Facebetter realtime beauty SDK.

## Structure

- `docs.json` — site config, navigation, i18n
- English pages at repo root (`intro/`, `android/`, …)
- Chinese pages under `zh/` with the same tree
- Top tabs: **SDK Docs** / **Effect Creator** (贴纸制作)
- Platforms live in sidebar groups under SDK Docs
- Images in `images/`

## Source of truth for content migration

Original VitePress docs live in the Facebetter SDK monorepo:

- `../fb/site/docs/en/docs/`
- `../fb/site/docs/zh/docs/`

HarmonyOS docs were intentionally not migrated (hidden in the old site).

## Writing notes

- Prefer Mintlify components: `Tip`, `Warning`, `Note`, `Frame`, `Card`, `CardGroup`
- Link marketing/dashboard pages with absolute `https://facebetter.net/...` URLs
- Keep platform guides self-contained: quick-start → implement → errors → API
- SDK version placeholders were expanded to `1.2.2` during migration; update when releasing
