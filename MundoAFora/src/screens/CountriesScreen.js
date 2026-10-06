import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { countries } from "../data/countries";
import { s, colors } from "../styles/theme";
import { Brand, CountryCard, Search } from "../components/UI";
export default function CountriesScreen({ openCountry }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const list = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) &&
      (filter === "Todos" || c.continent === filter),
  );
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Brand />
      <Text style={s.title}>Explore os países</Text>
      <Text style={s.subtitle}>
        Conheça destinos, culturas e oportunidades em todo o mundo.
      </Text>
      <Search value={query} onChangeText={setQuery} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 18 }}
      >
        {["Todos", "Europa", "Ásia", "Américas"].map((f) => (
          <Pressable
            accessibilityRole="button"
            key={f}
            onPress={() => setFilter(f)}
            style={[s.chip, filter === f && { backgroundColor: colors.blue }]}
          >
            <Text style={[s.chipText, filter === f && { color: "white" }]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {list.map((c) => (
        <CountryCard key={c.id} country={c} onPress={() => openCountry(c)} />
      ))}
      {!list.length && (
        <Text style={s.text}>Nenhum país corresponde à busca.</Text>
      )}
    </ScrollView>
  );
}
