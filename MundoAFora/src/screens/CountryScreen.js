import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";
import { Button, Icon, Flag } from "../components/UI";
import { s, colors } from "../styles/theme";
const sections = [
  [
    "Visão geral",
    "document-text-outline",
    "Conheça um panorama sobre o país, sua gente e suas oportunidades.",
  ],
  [
    "Vistos e documentos",
    "card-outline",
    "Informações gerais sobre vistos, documentos e processos.",
  ],
  [
    "Economia e custos",
    "bar-chart-outline",
    "Entenda o cenário econômico, mercado de trabalho e custo de vida.",
  ],
  [
    "Cultura e cidades",
    "business-outline",
    "Explore a cultura, as principais cidades e o estilo de vida.",
  ],
];
export default function CountryScreen({
  country,
  back,
  findResidents,
  favorites,
  toggleFavorite,
}) {
  const [expanded, setExpanded] = useState(null);
  const content = {
    "Visão geral": country.summary,
    "Vistos e documentos":
      "Consulte o órgão oficial do país para os requisitos do visto adequado ao seu objetivo.",
    "Economia e custos":
      "Pesquise moradia, alimentação e transporte na cidade em que pretende viver.",
    "Cultura e cidades":
      "Converse com residentes sobre costumes, idioma e adaptação.",
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={country.image}
        style={{ height: 270, justifyContent: "space-between" }}
      >
        <View style={[s.row, { padding: 18, justifyContent: "space-between" }]}>
          <Pressable
            accessibilityLabel="Voltar"
            onPress={back}
            style={{
              backgroundColor: "#FFFFFFDD",
              padding: 7,
              borderRadius: 24,
            }}
          >
            <Icon name="arrow-back" color={colors.navy} />
          </Pressable>
          <Pressable
            accessibilityLabel="Alternar favorito"
            accessibilityState={{ selected: favorites.includes(country.id) }}
            onPress={() => toggleFavorite(country.id)}
            style={{
              backgroundColor: "#FFFFFFDD",
              padding: 7,
              borderRadius: 24,
            }}
          >
            <Icon
              name={favorites.includes(country.id) ? "heart" : "heart-outline"}
            />
          </Pressable>
        </View>
        <View
          style={{
            padding: 20,
            paddingBottom: 30,
            backgroundColor: "rgba(0,20,35,.55)",
          }}
        >
          <Text style={{ color: "white", fontSize: 34, fontWeight: "800" }}>
            {country.name}
          </Text>
          <View style={[s.row, { gap: 8 }]}>
            <Flag country={country} />
            <Text style={{ color: "white", fontSize: 17 }}>
              {country.continent}
            </Text>
          </View>
        </View>
      </ImageBackground>
      <View
        style={[
          s.page,
          {
            marginTop: -17,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "white",
            padding: 14,
          },
        ]}
      >
        <View style={[s.row, { marginBottom: 12 }]}>
          {[
            ["Idioma", country.language, "chatbubbles-outline"],
            ["Moeda", country.currency, "server-outline"],
          ].map(([label, value, icon]) => (
            <View
              key={label}
              style={[
                s.row,
                {
                  flex: 1,
                  backgroundColor: "#F1F4F8",
                  borderRadius: 13,
                  padding: 12,
                  gap: 9,
                },
              ]}
            >
              <Icon name={icon} size={28} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: colors.text }}>
                  {label}
                </Text>
                <Text style={[s.label, { fontSize: 15 }]}>{value}</Text>
              </View>
            </View>
          ))}
        </View>
        {sections.map(([title, icon, description]) => (
          <View key={title} style={[s.card, { padding: 13, marginBottom: 8 }]}>
            <Pressable
              style={s.row}
              onPress={() => setExpanded(expanded === title ? null : title)}
              accessibilityRole="button"
              accessibilityState={{ expanded: expanded === title }}
            >
              <Icon name={icon} size={28} />
              <View style={{ flex: 1 }}>
                <Text style={[s.label, { fontSize: 16 }]}>{title}</Text>
                <Text
                  style={{ fontSize: 12, lineHeight: 17, color: colors.text }}
                >
                  {description}
                </Text>
              </View>
              <Icon
                name={expanded === title ? "chevron-down" : "chevron-forward"}
                size={18}
                color={colors.text}
              />
            </Pressable>
            {expanded === title && (
              <Text style={[s.text, { marginTop: 12 }]}>{content[title]}</Text>
            )}
          </View>
        ))}
        <Button
          title="Conversar com residentes"
          onPress={() => findResidents(country.id)}
        />
      </View>
    </ScrollView>
  );
}
