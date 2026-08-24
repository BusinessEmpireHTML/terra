import React from "react";
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../theme/ThemeProvider";

/** Full-bleed background gradient: ink navy in dark mode, warm vellum in light mode. */
export function GradientBackground({ children }: { children: React.ReactNode }) {
  const { colors, scheme } = useTheme();
  const stops =
    scheme === "dark"
      ? ([colors.backgroundDeep, colors.background, colors.surface] as const)
      : ([colors.background, colors.backgroundDeep] as const);
  return (
    <LinearGradient colors={stops} style={StyleSheet.absoluteFill}>
      {children}
    </LinearGradient>
  );
}

/** A frosted "instrument glass" card — the app's primary surface. */
export function GlassCard({ children, style, ...rest }: ViewProps) {
  const { colors, radius, scheme } = useTheme();
  return (
    <BlurView
      intensity={scheme === "dark" ? 28 : 40}
      tint={scheme === "dark" ? "dark" : "light"}
      style={[
        {
          borderRadius: radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
          overflow: "hidden",
          backgroundColor: scheme === "dark" ? "rgba(21,36,53,0.55)" : "rgba(255,255,255,0.5)",
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </BlurView>
  );
}

interface AnimatedPressableProps {
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

/** A pressable that settles with a small spring instead of the default opacity fade. */
export function AnimatedPressable({
  children,
  onPress,
  haptic = true,
  style,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 14, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      {...rest}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Small mono-numeral label/value pair — reads like a field journal entry. */
export function FactRow({ label, value }: { label: string; value: string }) {
  const { colors, type, space } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: space.xs }}>
      <Text style={[type.label, { color: colors.textMuted, textTransform: "uppercase" }]}>{label}</Text>
      <Text style={[type.data, { color: colors.textPrimary }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

/** A quick-fact pill for grid layouts (population, area, etc.). */
export function FactPill({ label, value }: { label: string; value: string }) {
  const { colors, type, space, radius } = useTheme();
  return (
    <View
      style={{
        flexBasis: "48%",
        backgroundColor: colors.surfaceRaised,
        borderRadius: radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        paddingVertical: space.sm,
        paddingHorizontal: space.md,
        marginBottom: space.sm,
      }}
    >
      <Text style={[type.label, { color: colors.accent, textTransform: "uppercase" }]}>{label}</Text>
      <Text style={[type.data, { color: colors.textPrimary, marginTop: 2, fontSize: 16 }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

/** Section eyebrow used above every content block. */
export function SectionHeader({ title }: { title: string }) {
  const { colors, type, space } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.sm, marginTop: space.lg }}>
      <View style={{ width: 18, height: StyleSheet.hairlineWidth * 2, backgroundColor: colors.accent, marginRight: space.sm }} />
      <Text style={[type.section, { color: colors.accent, textTransform: "uppercase" }]}>{title}</Text>
    </View>
  );
}

/** Honest "not built yet" card for sections coming in later phases. */
export function ComingSoonCard({ title, note }: { title: string; note: string }) {
  const { colors, type, space, radius } = useTheme();
  return (
    <View
      style={{
        borderRadius: radius.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderStyle: "dashed",
        borderColor: colors.border,
        padding: space.md,
        marginBottom: space.sm,
        opacity: 0.7,
      }}
    >
      <Text style={[type.body, { fontFamily: "Manrope_700Bold", color: colors.textSecondary }]}>{title}</Text>
      <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: 2 }]}>{note}</Text>
    </View>
  );
}
