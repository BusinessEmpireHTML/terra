import type { ReactNode } from "react";
import { ScrollViewStyleReset, useServerDocumentContext } from "expo-router/html";
import { darkColors, lightColors } from "../src/theme/tokens";

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
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
        <title>Terra — explore the world, one country at a time</title>
        <meta
          name="description"
          content="A geography app you explore instead of memorize: a gesture-driven globe, every country's story, and spaced-repetition quizzes."
        />
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
