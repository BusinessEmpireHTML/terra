import React, { memo } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";
import { FLAG_SVGS } from "../../data/flags";
import { flagFromCca2 } from "../../utils/geo";

interface Props {
  cca2: string;
  /** Width in px; height follows the 3:2 aspect ratio. */
  width: number;
  /** Screen-reader label. Omit to hide the flag from screen readers (e.g. in the flag quiz, where it's the question). */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A country flag drawn from bundled SVG, so it looks the same on every
 * platform (emoji flags render as two letters on Windows) and stays sharp at
 * any size.
 */
export const Flag = memo(function Flag({ cca2, width, label, style }: Props) {
  const height = Math.round((width * 2) / 3);
  const xml = FLAG_SVGS[cca2.toUpperCase()];
  const a11y = label
    ? { accessible: true, accessibilityRole: "image" as const, accessibilityLabel: label }
    : { accessibilityElementsHidden: true, importantForAccessibility: "no-hide-descendants" as const };
  return (
    <View
      {...a11y}
      style={[
        {
          width,
          height,
          borderRadius: Math.max(2, Math.round(width * 0.06)),
          overflow: "hidden",
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "rgba(0,0,0,0.25)",
        },
        style,
      ]}
    >
      {xml ? (
        <SvgXml xml={xml} width={width} height={height} />
      ) : (
        <Text style={{ fontSize: height * 0.9, lineHeight: height }}>{flagFromCca2(cca2)}</Text>
      )}
    </View>
  );
});
