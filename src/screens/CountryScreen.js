import React, { useState } from "react";
import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { Button, Icon } from "../components/UI";
import { s, colors } from "../styles/theme";
const sections = [
  ["Visão geral", "document-text-outline"],
  ["Vistos e documentos", "card-outline"],
  ["Economia e custos", "bar-chart-outline"],
  ["Cultura e cidades", "business-outline"],
];
export default function CountryScreen({
  country,
  back,
  findResidents,
  favorites,
  toggleFavorite,
}) {
  const [expanded, setExpanded] = useState("Visão geral");
  const content = {
    "Visão geral": country.summary,
    "Vistos e documentos":
      "Pesquise a modalidade de visto adequada ao seu objetivo. Confirme requisitos, documentos e prazos no consulado ou órgão oficial do país.",
    "Economia e custos":
      "Compare moradia, alimentação e transporte na cidade de interesse. Os valores dependem da região e do seu estilo de vida.",
    "Cultura e cidades":
      "Converse com residentes sobre idioma, costumes e adaptação. A experiência de cada pessoa pode ser diferente.",
  };
  return (
    <ScrollView>
      <Image source={country.image} style={{ height: 240, width: "100%" }} />
      <View style={s.page}>
        <View style={[s.row, { justifyContent: "space-between" }]}>
          <Pressable accessibilityLabel="Voltar" onPress={back}>
            <Icon name="arrow-back" />
          </Pressable>
          <Pressable
            accessibilityLabel="Alternar favorito"
            onPress={() => toggleFavorite(country.id)}
          >
            <Icon
              name={favorites.includes(country.id) ? "heart" : "heart-outline"}
            />
          </Pressable>
        </View>
        <Text style={[s.title, { marginTop: 16 }]}>{country.name}</Text>
        <Text style={s.subtitle}>{country.continent}</Text>
        <View style={[s.card, s.row]}>
          <View style={{ flex: 1 }}>
            <Text style={s.text}>Idioma</Text>
            <Text style={s.label}>{country.language}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.text}>Moeda</Text>
            <Text style={s.label}>{country.currency}</Text>
          </View>
        </View>
        {sections.map(([title, icon]) => (
          <View key={title} style={s.card}>
            <Pressable
              style={s.row}
              onPress={() => setExpanded(expanded === title ? "" : title)}
            >
              <Icon name={icon} />
              <Text style={[s.label, { flex: 1 }]}>{title}</Text>
              <Icon
                name={expanded === title ? "chevron-up" : "chevron-down"}
                size={18}
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
        <Text style={[s.text, { fontSize: 12, marginTop: 10 }]}>
          Conteúdo inicial de demonstração. Confirme regras migratórias em
          fontes oficiais. Os perfis de residentes são fictícios.
        </Text>
      </View>
    </ScrollView>
  );
}
