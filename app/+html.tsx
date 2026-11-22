import type { ReactNode } from "react";
import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";
import { darkColors, lightColors } from "../src/theme/tokens";

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.

/** Where the site is hosted (set by the deploy workflow), for absolute link-preview URLs. */
const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const BASE = process.env.EXPO_BASE_URL ?? "";
const TITLE = "Terra — explore the world, one country at a time";
const DESCRIPTION =
  "A geography app you explore instead of memorize: a gesture-driven globe, every country's story, and spaced-repetition quizzes.";
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: ReactNode }) {
  // Since Expo SDK 58, the page's scripts, styles and metadata arrive as
  // `headNodes`/`bodyNodes` and must be rendered here — without them the
  // exported pages have no <script> tags and stay blank.
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />

        {/* Link previews (chat apps, social): what a shared Terra or challenge link looks like. */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Terra" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        {SITE_URL ? <meta property="og:image" content={`${SITE_URL}/og.jpg`} /> : null}
        {SITE_URL ? <meta property="og:image:width" content="1200" /> : null}
        {SITE_URL ? <meta property="og:image:height" content="630" /> : null}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Add to Home Screen. */}
        <link rel="manifest" href={`${BASE}/manifest.json`} />
        <link rel="apple-touch-icon" href={`${BASE}/apple-touch-icon.png`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Terra" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content={lightColors.background} />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content={darkColors.background} />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Raw CSS so the page background matches the app's palette before React hydrates (no white flash in dark mode). */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: ${lightColors.background};
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: ${darkColors.background};
  }
}`;
