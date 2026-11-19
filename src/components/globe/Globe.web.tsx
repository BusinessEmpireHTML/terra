import React from "react";
import { View } from "react-native";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import type { GlobeProps } from "./globeTypes";

export * from "./globeTypes";

/**
 * Web entry point. Skia needs CanvasKit (WebAssembly) before any Skia code
 * runs, so the canvas component is imported only after it has loaded. The
 * wasm file is copied to public/ by `npm install` (see the postinstall script)
 * and served from the site root, whatever the current route is.
 */
export function Globe(props: GlobeProps) {
  return (
    <WithSkiaWeb
      getComponent={() => import("./GlobeCanvas")}
      componentProps={props}
      opts={{ locateFile: (file: string) => `/${file}` }}
      fallback={<View style={{ width: props.size, height: props.size }} />}
    />
  );
}
