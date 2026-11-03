import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../styles/theme";

/**
 * Botão reutilizável do aplicativo.
 * Mantém a identidade visual do Mundo a Fora e oferece variante contornada.
 */
export default function PrimaryButton({
  title,
  onPress,
  outline = false,
  disabled = false,
  style,
  textStyle,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        outline ? styles.outline : styles.filled,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, outline ? styles.outlineLabel : styles.filledLabel, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  filled: { backgroundColor: colors.primary, borderColor: colors.primary },
  outline: { backgroundColor: colors.surface, borderColor: colors.primary },
  label: { fontSize: 16, fontWeight: "700", textAlign: "center" },
  filledLabel: { color: colors.surface },
  outlineLabel: { color: colors.primary },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
});
