import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url);
const locales = ["ja", "ko", "es", "pt-BR"];
const localeAlts = locales.join("|");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function rewrite(content, locale) {
  let next = content;
  // Absolute docs paths that are not already locale-prefixed.
  next = next.replace(
    /(?<!:)(\/?)(\/)(intro|android|ios|macos|windows|linux|web|flutter|effect-creator)(\/[\w./-]*)/g,
    (m, _a, slash, section, rest) => {
      if (m.includes(`/${locale}/`)) return m;
      return `${slash}${locale}/${section}${rest}`;
    },
  );
  next = next.replaceAll("](/intro/", `](/${locale}/intro/`);
  next = next.replaceAll('href="/intro/', `href="/${locale}/intro/`);
  next = next.replaceAll("](/android/", `](/${locale}/android/`);
  next = next.replaceAll('href="/android/', `href="/${locale}/android/`);
  next = next.replaceAll("](/ios/", `](/${locale}/ios/`);
  next = next.replaceAll('href="/ios/', `href="/${locale}/ios/`);
  next = next.replaceAll("](/macos/", `](/${locale}/macos/`);
  next = next.replaceAll('href="/macos/', `href="/${locale}/macos/`);
  next = next.replaceAll("](/windows/", `](/${locale}/windows/`);
  next = next.replaceAll('href="/windows/', `href="/${locale}/windows/`);
  next = next.replaceAll("](/linux/", `](/${locale}/linux/`);
  next = next.replaceAll('href="/linux/', `href="/${locale}/linux/`);
  next = next.replaceAll("](/web/", `](/${locale}/web/`);
  next = next.replaceAll('href="/web/', `href="/${locale}/web/`);
  next = next.replaceAll("](/flutter/", `](/${locale}/flutter/`);
  next = next.replaceAll('href="/flutter/', `href="/${locale}/flutter/`);
  next = next.replaceAll("](/effect-creator/", `](/${locale}/effect-creator/`);
  next = next.replaceAll(
    'href="/effect-creator/',
    `href="/${locale}/effect-creator/`,
  );
  next = next.replaceAll(
    "https://docs.facebetter.net/android/",
    `https://docs.facebetter.net/${locale}/android/`,
  );
  next = next.replaceAll(
    "https://docs.facebetter.net/ios/",
    `https://docs.facebetter.net/${locale}/ios/`,
  );
  next = next.replaceAll(
    "https://docs.facebetter.net/web/",
    `https://docs.facebetter.net/${locale}/web/`,
  );

  const sitePaths = [
    "/dashboard",
    "/download",
    "/pricing",
    "/sign-in",
    "/sign-up",
    "/contact",
    "/features",
  ];
  for (const path of sitePaths) {
    next = next.replaceAll(
      `https://facebetter.net${path}`,
      `https://facebetter.net/${locale}${path}`,
    );
  }
  next = next.replaceAll(
    "](https://facebetter.net)",
    `](https://facebetter.net/${locale})`,
  );
  next = next.replaceAll(
    "(https://facebetter.net)",
    `(https://facebetter.net/${locale})`,
  );

  // Avoid double prefixes
  const doubled = new RegExp(`/${locale}/${locale}/`, "g");
  next = next.replace(doubled, `/${locale}/`);
  next = next.replace(
    new RegExp(`https://facebetter.net/${locale}/${locale}`, "g"),
    `https://facebetter.net/${locale}`,
  );
  return next;
}

let count = 0;
for (const locale of locales) {
  const files = walk(new URL(`../${locale}`, import.meta.url).pathname);
  for (const file of files) {
    const before = readFileSync(file, "utf8");
    const after = rewrite(before, locale);
    if (after !== before) {
      writeFileSync(file, after);
      count += 1;
    }
  }
}
console.log(`rewrote links in ${count} files`);
