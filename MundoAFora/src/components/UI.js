import React from "react";
import { Text, Pressable, View, Image, TextInput } from "react-native";
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
        padding: 13,
        borderRadius: 24,
        backgroundColor: outline ? "white" : colors.blue,
        borderWidth: 1,
        borderColor: colors.blue,
        opacity: pressed ? 0.7 : 1,
        marginVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      })}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: outline ? colors.blue : "white",
        }}
      >
        {title}
      </Text>
      <Icon
        name="arrow-forward"
        size={22}
        color={outline ? colors.blue : "white"}
      />
    </Pressable>
  );
}
export function Brand({ onProfile }) {
  return (
    <View
      style={[s.row, { marginBottom: 18, justifyContent: "space-between" }]}
    >
      <View style={[s.row, { gap: 7 }]}>
        <Image
          source={require("../../assets/logo.png")}
          style={{
            width: 43,
            height: 43,
            borderRadius: 22,
            backgroundColor: "#001D38",
          }}
        />
        <View>
          <Text style={{ fontSize: 19, fontWeight: "900", color: colors.navy }}>
            MUNDO
          </Text>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 2,
              color: colors.blue,
            }}
          >
            A FORA
          </Text>
        </View>
      </View>
      {onProfile && (
        <Pressable onPress={onProfile} accessibilityLabel="Abrir perfil">
          <Icon name="person-circle-outline" color={colors.navy} />
        </Pressable>
      )}
    </View>
  );
}
export function Search({ value, onChangeText }) {
  return (
    <View
      style={[
        s.row,
        {
          backgroundColor: "#F1F4F9",
          borderRadius: 24,
          paddingHorizontal: 14,
          marginBottom: 14,
          gap: 10,
        },
      ]}
    >
      <Icon name="search-outline" size={22} color={colors.navy} />
      <TextInput
        accessibilityLabel="Buscar um país"
        placeholder="Buscar um país"
        placeholderTextColor={colors.text}
        value={value}
        onChangeText={onChangeText}
        style={{
          flex: 1,
          paddingVertical: 12,
          color: colors.navy,
          fontSize: 14,
        }}
      />
    </View>
  );
}
export function CountryCard({ country, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        s.card,
        s.row,
        {
          padding: 0,
          paddingRight: 10,
          overflow: "hidden",
          gap: 13,
          marginBottom: 7,
        },
      ]}
    >
      <Image
        source={country.image}
        style={{ width: 108, height: 88, borderRadius: 12 }}
      />
      <View style={{ flex: 1, paddingVertical: 6 }}>
        <Text style={[s.label, { fontSize: 16 }]}>{country.name}</Text>
        <Text style={{ color: colors.text, fontSize: 13 }}>
          {country.continent}
        </Text>
        <Text style={{ color: colors.text, fontSize: 12, lineHeight: 16 }}>
          {country.summary}
        </Text>
      </View>
      <Icon name="chevron-forward" size={19} color={colors.navy} />
    </Pressable>
  );
}
export function Flag({ country }) {
  return (
    <Text style={{ fontSize: 24 }}>
      {
        { portugal: "🇵🇹", japan: "🇯🇵", usa: "🇺🇸", paraguay: "🇵🇾", uk: "🇬🇧" }[
          country.id
        ]
      }
    </Text>
  );
}
