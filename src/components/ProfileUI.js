import React, { useEffect, useState } from "react";
import { Image, Text, View, StyleSheet } from "react-native";
import portuguese from "i18n-iso-countries/langs/pt.json";

export const residenceCountries = Object.entries(portuguese.countries)
  .map(([code, value]) => ({
    code,
    name: Array.isArray(value) ? value[0] : value,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

export function countryName(code) {
  return residenceCountries.find((item) => item.code === code)?.name || "";
}

export function Flag({ code, size = 23 }) {
  if (!residenceCountries.some((item) => item.code === code)) {
    return null;
  }

  const flag = [...code]
    .map((letter) =>
      String.fromCodePoint(127397 + letter.charCodeAt(0))
    )
    .join("");

  return (
    <Text
      accessibilityLabel={`Bandeira de ${countryName(code)}`}
      style={{ fontSize: size }}
    >
      {flag}
    </Text>
  );
}

export function Avatar({ uri, name = "", size = 48 }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [uri]);

  const dimensions = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri && !failed) {
    return (
      <Image
        source={{ uri }}
        accessibilityLabel={`Foto de ${name}`}
        onError={() => setFailed(true)}
        style={dimensions}
      />
    );
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <View style={[dimensions, ui.avatarFallback]}>
      <Text
        style={{
          color: "#174FC6",
          fontWeight: "800",
          fontSize: size * 0.34,
        }}
      >
        {initials || "?"}
      </Text>
    </View>
  );
}

export const ui = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F8FF",
  },
  page: {
    paddingBottom: 28,
  },
  brand: {
    textAlign: "center",
    color: "#102653",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 20,
    letterSpacing: 1,
  },
  title: {
    textAlign: "center",
    color: "#102653",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 8,
    marginBottom: 22,
  },
  cover: {
    height: 145,
    backgroundColor: "#123A7E",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 45, 110, 0.38)",
  },
  identity: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -60,
  },
  photoRing: {
    borderWidth: 5,
    borderColor: "#F5F8FF",
    borderRadius: 80,
  },
  avatarFallback: {
    backgroundColor: "#DFE9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: "#102653",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 12,
    textAlign: "center",
  },
  muted: {
    color: "#73809A",
    fontSize: 14,
    lineHeight: 21,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  locationText: {
    color: "#102653",
    fontSize: 16,
    flexShrink: 1,
  },
  primary: {
    backgroundColor: "#1754D1",
    minHeight: 48,
    padding: 14,
    borderRadius: 13,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#DDE5F2",
    borderRadius: 19,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
  },
  section: {
    color: "#102653",
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 10,
  },
  body: {
    color: "#52617C",
    fontSize: 15,
    lineHeight: 23,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E3E9F4",
  },
  detailLabel: {
    color: "#52617C",
    flex: 1,
    fontSize: 14,
  },
  detailValue: {
    color: "#102653",
    fontSize: 14,
    maxWidth: "52%",
    textAlign: "right",
  },
  label: {
    color: "#253C66",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F4F7FC",
    borderWidth: 1,
    borderColor: "#DFE6F2",
    borderRadius: 12,
    padding: 13,
    color: "#102653",
    fontSize: 15,
    minHeight: 48,
  },
  link: {
    color: "#1754D1",
    fontSize: 14,
    fontWeight: "600",
  },
  error: {
    color: "#B42318",
    lineHeight: 21,
    marginVertical: 12,
  },
  centeredButton: {
    padding: 15,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});