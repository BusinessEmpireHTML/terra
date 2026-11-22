import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * app.json holds the configuration; this only adds what depends on where the
 * web build is hosted. GitHub Pages serves a project site from a sub-path
 * (https://<owner>.github.io/terra/), so the deploy workflow sets
 * TERRA_BASE_URL=/terra. Local development and native builds leave it unset.
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  experiments: {
    ...config.experiments,
    baseUrl: process.env.TERRA_BASE_URL || undefined,
  },
});
