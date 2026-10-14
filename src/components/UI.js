import React from "react";
import { Text, Pressable, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, s } from "../styles/theme";
export function Icon({ name, size = 24, color = colors.blue }) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Button({ title, onPress, outline = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        padding: 15,
        borderRadius: 25,
        backgroundColor: outline ? "white" : colors.blue,
        borderWidth: 1,
        borderColor: colors.blue,
        opacity: pressed ? 0.7 : 1,
        marginVertical: 6,
      })}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "700",
          color: outline ? colors.blue : "white",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Brand() {
  return (
    <View style={[s.row, { marginBottom: 20 }]}>
      <Image
        source={require("../../assets/logo.png")}
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          backgroundColor: colors.navy,
        }}
      />
      <Text style={s.label}>MUNDO A FORA</Text>
    </View>
  );
}
export function CountryCard({ country, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[s.card, s.row]}
    >
      <Image
        source={country.image}
        style={{ width: 88, height: 88, borderRadius: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={s.label}>{country.name}</Text>
        <Text style={s.text}>{country.continent}</Text>
        <Text style={{ color: colors.text, fontSize: 12, marginTop: 4 }}>
          {country.summary}
        </Text>
      </View>
      <Icon name="chevron-forward" size={20} />
    </Pressable>
  );
}
