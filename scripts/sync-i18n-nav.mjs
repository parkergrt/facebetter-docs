import { readFileSync, writeFileSync } from "node:fs";

const docsPath = new URL("../docs.json", import.meta.url);
const docs = JSON.parse(readFileSync(docsPath, "utf8"));

const EN_PAGES = {
  intro: [
    "index",
    "intro/overview",
    "intro/pricing",
    "intro/enable-service",
    "intro/license",
    "intro/resource-packs",
    "intro/use-with-ai",
    "intro/makeup",
    "intro/release-note",
  ],
  android: [
    "android/quick-start",
    "android/implement-beauty",
    "android/third-party-integration",
    "android/error-handling",
    "android/api-reference",
    "android/best-practices",
    "android/faq",
  ],
  ios: [
    "ios/quick-start",
    "ios/implement-beauty",
    "ios/third-party-integration",
    "ios/error-handling",
    "ios/api-reference",
    "ios/best-practices",
    "ios/faq",
  ],
  macos: [
    "macos/quick-start",
    "macos/implement-beauty",
    "macos/third-party-integration",
    "macos/error-handling",
    "macos/api-reference",
    "macos/best-practices",
    "macos/faq",
  ],
  windows: [
    "windows/quick-start",
    "windows/implement-beauty",
    "windows/third-party-integration",
    "windows/error-handling",
    "windows/api-reference",
    "windows/best-practices",
    "windows/faq",
  ],
  linux: [
    "linux/quick-start",
    "linux/implement-beauty",
    "linux/third-party-integration",
    "linux/error-handling",
    "linux/api-reference",
    "linux/best-practices",
    "linux/faq",
  ],
  web: [
    "web/quick-start",
    "web/implement-beauty",
    "web/third-party-integration",
    "web/error-handling",
    "web/api-reference",
    "web/best-practices",
    "web/faq",
  ],
  flutter: [
    "flutter/quick-start",
    "flutter/implement-beauty",
    "flutter/third-party-integration",
    "flutter/api-reference",
  ],
  effect: [
    "effect-creator/introduction",
    "effect-creator/face-sticker",
    "effect-creator/screen-sticker",
    "effect-creator/face-makeup",
  ],
};

function prefixPages(code, pages) {
  if (code === "en") return pages;
  return pages.map((p) => `${code}/${p}`);
}

function siteHref(code, path = "") {
  if (code === "en") return `https://facebetter.net${path || ""}`;
  return `https://facebetter.net/${code}${path}`;
}

const labels = {
  en: {
    sdk: "SDK Docs",
    intro: "Introduction",
    effectTab: "Effect Creator",
    effectGroup: "Effect Creator",
    website: "Website",
    dashboard: "Dashboard",
    download: "Download",
  },
  zh: {
    sdk: "SDK 文档",
    intro: "产品介绍",
    effectTab: "贴纸制作",
    effectGroup: "贴纸制作",
    website: "官网",
    dashboard: "控制台",
    download: "下载",
  },
  es: {
    sdk: "Docs del SDK",
    intro: "Introducción",
    effectTab: "Effect Creator",
    effectGroup: "Effect Creator",
    website: "Sitio web",
    dashboard: "Consola",
    download: "Descargas",
  },
  "pt-BR": {
    sdk: "Docs do SDK",
    intro: "Introdução",
    effectTab: "Effect Creator",
    effectGroup: "Effect Creator",
    website: "Site",
    dashboard: "Console",
    download: "Downloads",
  },
  ko: {
    sdk: "SDK 문서",
    intro: "소개",
    effectTab: "이펙트 제작",
    effectGroup: "이펙트 제작",
    website: "웹사이트",
    dashboard: "콘솔",
    download: "다운로드",
  },
  ja: {
    sdk: "SDK ドキュメント",
    intro: "はじめに",
    effectTab: "エフェクト作成",
    effectGroup: "エフェクト作成",
    website: "ウェブサイト",
    dashboard: "コンソール",
    download: "ダウンロード",
  },
};

const platforms = [
  ["android", "Android", "android", "brands"],
  ["ios", "iOS", "apple", "brands"],
  ["macos", "macOS", "laptop", "solid"],
  ["windows", "Windows", "windows", "brands"],
  ["linux", "Linux", "linux", "brands"],
  ["web", "Web", "globe", "solid"],
  ["flutter", "Flutter", "mobile", "solid"],
];

function langNav(code) {
  const l = labels[code];
  return {
    language: code,
    tabs: [
      {
        tab: l.sdk,
        groups: [
          {
            group: l.intro,
            pages: prefixPages(code, EN_PAGES.intro),
            icon: "book-open",
            iconType: "solid",
          },
          ...platforms.map(([key, name, icon, iconType]) => ({
            group: name,
            pages: prefixPages(code, EN_PAGES[key]),
            icon,
            iconType,
          })),
        ],
      },
      {
        tab: l.effectTab,
        groups: [
          {
            group: l.effectGroup,
            pages: prefixPages(code, EN_PAGES.effect),
            icon: "wand-magic-sparkles",
            iconType: "solid",
          },
        ],
      },
    ],
    navbar: {
      links: [
        { label: l.website, href: siteHref(code) },
        { label: l.dashboard, href: siteHref(code, "/dashboard") },
        { label: l.download, href: siteHref(code, "/download") },
      ],
    },
  };
}

docs.navigation.languages = ["en", "zh", "ja", "ko", "es", "pt-BR"].map(langNav);

if (docs.seo?.metatags?.canonical) {
  delete docs.seo.metatags.canonical;
}

docs.redirects = [
  { source: "/docs/:slug*", destination: "/:slug*" },
  { source: "/zh/docs/:slug*", destination: "/zh/:slug*" },
  { source: "/ja/docs/:slug*", destination: "/ja/:slug*" },
  { source: "/ko/docs/:slug*", destination: "/ko/:slug*" },
  { source: "/es/docs/:slug*", destination: "/es/:slug*" },
  { source: "/pt-BR/docs/:slug*", destination: "/pt-BR/:slug*" },
  { source: "/en/:slug*", destination: "/:slug*" },
];

writeFileSync(docsPath, JSON.stringify(docs, null, 2) + "\n");
console.log(
  "updated docs.json languages:",
  docs.navigation.languages.map((l) => l.language).join(", "),
);
