import React, { useMemo, useState } from "react";
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchCountries } from "../../utils/search";
import { useT } from "../../i18n/useT";
import { Flag } from "../ui/Flag";
import { COUNTRIES } from "../../data/countries";
import { useTheme } from "../../theme/ThemeProvider";
import { GradientBackground } from "../ui/Primitives";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (cca3: string) => void;
}

export function CountrySearchSheet({ visible, onClose, onSelect }: Props) {
  const { colors, type, space, radius } = useTheme();
  const t = useT();
  const [query, setQuery] = useState("");
  const insets = useSafeAreaInsets();

  const results = useMemo(() => searchCountries(COUNTRIES, query, t.lang), [query, t.lang]);

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <GradientBackground>
        {/* iOS page sheets sit below the status bar already; Android/web modals are full-screen. */}
        <View style={{ flex: 1, paddingTop: Platform.OS === "ios" ? space.lg : insets.top + space.md, paddingHorizontal: space.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.md }}>
            <Text accessibilityRole="header" style={[type.title, { color: colors.textPrimary, flex: 1 }]}>
              {t("search.title")}
            </Text>
            <Pressable onPress={close} hitSlop={12} accessibilityRole="button" accessibilityLabel={t("search.close")}>
              <Ionicons name="close" size={26} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surfaceRaised,
              borderRadius: radius.md,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.border,
              paddingHorizontal: space.md,
              marginBottom: space.md,
            }}
          >
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("search.placeholder")}
              placeholderTextColor={colors.textMuted}
              accessibilityLabel={t("search.a11y")}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              clearButtonMode="while-editing"
              onSubmitEditing={() => {
                if (results.length > 0) {
                  setQuery("");
                  onSelect(results[0].id);
                }
              }}
              autoFocus
              style={[type.body, { color: colors.textPrimary, flex: 1, paddingVertical: 12, paddingHorizontal: space.sm }]}
            />
          </View>

          <FlatList
            data={results}
            keyExtractor={(c) => c.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={{ paddingBottom: insets.bottom + space.lg }}
            ListEmptyComponent={
              <View style={{ paddingTop: space.xl, alignItems: "center" }}>
                <Text style={[type.body, { color: colors.textMuted }]}>{t("search.noMatch", { query })}</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setQuery("");
                  onSelect(item.id);
                }}
                accessibilityRole="button"
                accessibilityLabel={item.capital ? t("search.itemA11y", { country: t.country(item), capital: item.capital[0] }) : t.country(item)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: space.sm,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                }}
              >
                <Flag cca2={item.cca2} width={30} style={{ marginRight: space.sm }} />
                <View style={{ flex: 1 }}>
                  <Text style={[type.body, { color: colors.textPrimary }]}>{t.country(item)}</Text>
                  {item.capital && (
                    <Text style={[type.bodySmall, { color: colors.textMuted }]}>{item.capital[0]}</Text>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </Pressable>
            )}
          />
        </View>
      </GradientBackground>
    </Modal>
  );
}
