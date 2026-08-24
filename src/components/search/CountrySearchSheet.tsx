import React, { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.common.toLowerCase().includes(q) ||
        c.name.official.toLowerCase().includes(q) ||
        (c.capital ?? []).some((cap) => cap.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <GradientBackground>
        <View style={{ flex: 1, paddingTop: 64, paddingHorizontal: space.lg }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space.md }}>
            <Text style={[type.title, { color: colors.textPrimary, flex: 1 }]}>Jump anywhere</Text>
            <Pressable onPress={onClose} hitSlop={12}>
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
              placeholder="Country or capital…"
              placeholderTextColor={colors.textMuted}
              autoFocus
              style={[type.body, { color: colors.textPrimary, flex: 1, paddingVertical: 12, paddingHorizontal: space.sm }]}
            />
          </View>

          <FlatList
            data={results}
            keyExtractor={(c) => c.id}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View style={{ paddingTop: space.xl, alignItems: "center" }}>
                <Text style={[type.body, { color: colors.textMuted }]}>No country matches "{query}"</Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setQuery("");
                  onSelect(item.id);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: space.sm,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 22, marginRight: space.sm }}>{item.flagEmoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[type.body, { color: colors.textPrimary }]}>{item.name.common}</Text>
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
