import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../styles/theme";

/**
 * Campo de formulário reutilizável, seguindo o padrão de componentes do StudyFlow.
 */
export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  editable = true,
  multiline = false,
}) {
  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.multiline, !editable && styles.disabled]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", gap: 8, marginBottom: 12 },
  label: { color: colors.text, fontSize: 14, fontWeight: "600" },
  input: {
    minHeight: 50,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 16,
  },
  multiline: { minHeight: 110 },
  disabled: { opacity: 0.6 },
});
