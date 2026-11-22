import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientBackground, PrimaryButton } from "../components/ui/Primitives";
import { useTheme } from "../theme/ThemeProvider";
import { useT } from "../i18n/useT";
import { useSafeBack } from "../hooks/useSafeBack";
import { decodeChallenge, encodeChallenge } from "../quiz/challenge";

/** Type in a challenge code from a friend (for when the link can't open the app, e.g. on web). */
export default function EnterChallengeScreen() {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const router = useRouter();
  const goBack = useSafeBack();
  const [code, setCode] = useState("");
  const decoded = decodeChallenge(code);
  const showError = code.replace(/[\s-]/g, "").length >= 8 && !decoded;

  const go = () => {
    if (decoded) router.replace(`/challenge/${encodeChallenge(decoded)}`);
  };

  return (
    <GradientBackground>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: space.xl }}>
        <View style={{ flexDirection: "row", paddingTop: space.sm }}>
          <Pressable onPress={goBack} hitSlop={12} accessibilityRole="button" accessibilityLabel={t("common.close")}>
            <Ionicons name="close" size={26} color={colors.textPrimary} />
          </Pressable>
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text accessibilityRole="header" style={[type.title, { color: colors.textPrimary, textAlign: "center" }]}>
            {t("challenge.enterTitle")}
          </Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder={t("challenge.enterPlaceholder")}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
            autoFocus
            maxLength={12}
            returnKeyType="go"
            onSubmitEditing={go}
            accessibilityLabel={t("challenge.codeLabel")}
            style={[
              type.data,
              {
                color: colors.textPrimary,
                fontSize: 24,
                letterSpacing: 3,
                textAlign: "center",
                marginTop: space.lg,
                paddingVertical: space.md,
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: showError ? colors.ember : colors.border,
                backgroundColor: colors.surfaceRaised,
              },
            ]}
          />
          <Text style={[type.bodySmall, { color: showError ? colors.ember : colors.textMuted, textAlign: "center", marginTop: space.sm, minHeight: 18 }]}>
            {showError ? t("challenge.invalidBody") : ""}
          </Text>
          <PrimaryButton label={t("challenge.enterGo")} onPress={go} style={{ marginTop: space.md, opacity: decoded ? 1 : 0.5 }} />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}
