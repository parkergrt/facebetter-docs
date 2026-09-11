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

Original VitePress marketing site lives in `../fb-platform/website/` (en/zh). SDK docs have been migrated here.

HarmonyOS docs were intentionally not migrated (hidden in the old site).

## Writing notes

对外客户文档规范（禁止暴露实现细节）：`.cursor/rules/customer-docs.mdc`，完整流程见 `.cursor/skills/facebetter-customer-docs/SKILL.md`。

- Prefer Mintlify components: `Tip`, `Warning`, `Note`, `Frame`, `Card`, `CardGroup`
- Link marketing/dashboard pages with absolute `https://facebetter.net/...` URLs
- Keep platform guides self-contained: quick-start → implement → errors → API
- Reshape / makeup / whitening / smoothing enums live in `intro/makeup.mdx` (and `zh/intro/makeup.mdx`). Platform API pages link there instead of duplicating tables.
- This site documents **SDK 2.0 only**. Do not describe 1.x APIs (`setBeautyParam`, `licenseJson`, `registerFilter`, `ProcessMode`, `FBBeautyEffectEngine` singleton).
- Version placeholders: **2.0.0**. Changelog: `intro/release-note.mdx`
