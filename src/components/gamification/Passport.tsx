import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../../theme/ThemeProvider";
import { DENSE_TEXT_MAX_SCALE, fontFamily } from "../../theme/tokens";
import { useT } from "../../i18n/useT";
import { localeFor, type TranslationKey } from "../../i18n/core";
import { expeditionTitle } from "../../i18n/catalog";
import { EXPEDITIONS } from "../../gamification/expeditions";
import type { Stamp } from "../../gamification/passport";
import { GLOBE_THEMES, isGlobeThemeUnlocked } from "../../theme/globeThemes";
import { useAppStore } from "../../store/useAppStore";

/** One stamp per expedition: inked once completed, a dashed outline until then. Tap to open the expedition. */
export function PassportStamps({ stamps }: { stamps: Stamp[] }) {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const router = useRouter();
  const byId = new Map(stamps.map((s) => [s.expeditionId, s]));
  const date = (iso: string) => new Date(iso).toLocaleDateString(localeFor(t.lang), { month: "short", day: "numeric", year: "numeric" });

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
      {EXPEDITIONS.map((e, i) => {
        const stamp = byId.get(e.id);
        const title = expeditionTitle(e, t.lang);
        // A slight, fixed tilt per stamp, like real ink stamps.
        const tilt = `${((i * 37) % 9) - 4}deg`;
        return (
          <Pressable
            key={e.id}
            onPress={() => router.push(`/expeditions/${e.id}`)}
            accessibilityRole="button"
            accessibilityLabel={stamp ? t("passport.stampA11y", { title, date: date(stamp.earnedAt) }) : t("passport.lockedA11y", { title })}
            style={{ flexBasis: "30%", flexGrow: 1, alignItems: "center" }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderStyle: stamp ? "solid" : "dashed",
                borderColor: stamp ? colors.ember : colors.border,
                backgroundColor: stamp ? colors.ember + "18" : "transparent",
                transform: [{ rotate: stamp ? tilt : "0deg" }],
              }}
            >
              <Ionicons name={(stamp ? e.icon : "lock-closed-outline") as React.ComponentProps<typeof Ionicons>["name"]} size={stamp ? 24 : 18} color={stamp ? colors.ember : colors.textMuted} />
            </View>
            <Text
              numberOfLines={2}
              style={[type.bodySmall, { color: stamp ? colors.textPrimary : colors.textMuted, fontSize: 11, lineHeight: 14, textAlign: "center", marginTop: 4 }]}
            >
              {title}
            </Text>
            {stamp && (
              <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.ember, fontSize: 8, marginTop: 1 }]}>
                {date(stamp.earnedAt).toUpperCase()}
              </Text>
            )}
          </Pressable>
        );
      })}
      {stamps.length === 0 && (
        <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.xs, width: "100%", textAlign: "center" }]}>{t("passport.empty")}</Text>
      )}
    </View>
  );
}

/** Globe styles, unlocked by stamps. */
export function GlobeStylePicker({ stampCount }: { stampCount: number }) {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const current = useAppStore((s) => s.globeTheme);
  const setGlobeTheme = useAppStore((s) => s.setGlobeTheme);

  return (
    <View>
      <View accessibilityRole="radiogroup" style={{ flexDirection: "row", flexWrap: "wrap", gap: space.sm }}>
        {GLOBE_THEMES.map((theme) => {
          const unlocked = isGlobeThemeUnlocked(theme.id, stampCount);
          const active = current === theme.id;
          const label = t(`globeStyle.${theme.id}` as TranslationKey);
          const need = theme.unlockAt === 1 ? t("globeStyle.unlockAtOne") : t("globeStyle.unlockAt", { count: theme.unlockAt });
          return (
            <Pressable
              key={theme.id}
              disabled={!unlocked}
              onPress={() => setGlobeTheme(theme.id)}
              accessibilityRole="radio"
              accessibilityState={{ checked: active, disabled: !unlocked }}
              accessibilityLabel={unlocked ? label : t("globeStyle.lockedA11y", { name: label, count: theme.unlockAt })}
              style={{
                flexBasis: "30%",
                flexGrow: 1,
                alignItems: "center",
                paddingVertical: space.sm,
                borderRadius: radius.md,
                borderWidth: active ? 2 : 1,
                borderColor: active ? colors.accent : colors.border,
                backgroundColor: colors.surfaceRaised,
                opacity: unlocked ? 1 : 0.55,
              }}
            >
              {/* A tiny globe: ocean color with an outline ring in the border color. */}
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: theme.swatch[0],
                  borderWidth: 3,
                  borderColor: theme.swatch[1],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!unlocked && <Ionicons name="lock-closed" size={12} color={theme.swatch[1]} />}
              </View>
              <Text style={[type.bodySmall, { color: colors.textPrimary, fontSize: 12, marginTop: 4, textAlign: "center", fontFamily: active ? fontFamily.bodySemiBold : undefined }]}>
                {label}
              </Text>
              {!unlocked && (
                <Text maxFontSizeMultiplier={DENSE_TEXT_MAX_SCALE} style={[type.label, { color: colors.textMuted, fontSize: 8 }]}>
                  🛂 {need.toUpperCase()}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
      <Text style={[type.bodySmall, { color: colors.textMuted, marginTop: space.sm }]}>{t("globeStyle.hint")}</Text>
    </View>
  );
}
