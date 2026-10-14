import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { countries } from "../data/countries";
import { Brand, Button } from "../components/UI";
import { s, colors } from "../styles/theme";
export default function CompareScreen({ openCountry }) {
  const [left, setLeft] = useState("portugal");
  const [right, setRight] = useState("japan");
  const a = countries.find((c) => c.id === left),
    b = countries.find((c) => c.id === right);
  function selector(value, setValue, other) {
    return (
      <View style={{ flex: 1 }}>
        {countries.map((c) => (
          <Pressable
            key={c.id}
            disabled={c.id === other}
            onPress={() => setValue(c.id)}
            style={[
              s.chip,
              { marginBottom: 8, opacity: c.id === other ? 0.35 : 1 },
              value === c.id && { backgroundColor: colors.blue },
            ]}
          >
            <Text style={[s.chipText, value === c.id && { color: "white" }]}>
              {c.name}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Brand />
      <Text style={s.title}>Compare destinos</Text>
      <Text style={s.subtitle}>
        Selecione dois países para consultar informações lado a lado.
      </Text>
      <View style={s.row}>
        {selector(left, setLeft, right)}
        {selector(right, setRight, left)}
      </View>
      <View style={[s.row, { marginVertical: 14 }]}>
        <Text style={[s.label, { flex: 1 }]}>{a.name}</Text>
        <Text style={[s.label, { flex: 1 }]}>{b.name}</Text>
      </View>
      {[
        ["Idioma", "language"],
        ["Moeda", "currency"],
        ["Continente", "continent"],
      ].map(([label, key]) => (
        <View key={key} style={s.row}>
          {[a, b].map((c) => (
            <View key={c.id} style={[s.card, { flex: 1, minHeight: 95 }]}>
              <Text style={s.text}>{label}</Text>
              <Text style={s.label}>{c[key]}</Text>
            </View>
          ))}
        </View>
      ))}
      <Button title={"Ver " + a.name} onPress={() => openCountry(a)} />
      <Button title={"Ver " + b.name} onPress={() => openCountry(b)} outline />
    </ScrollView>
  );
}
