import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { countries } from "../data/countries";
import { s, colors } from "../styles/theme";
import { Button, CountryCard, Icon } from "../components/UI";
export default function HomeScreen({ navigate, openCountry }) {
  const [query, setQuery] = useState("");
  const list = query
    ? countries.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()),
      )
    : countries.filter((c) => ["portugal", "japan"].includes(c.id));
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: colors.navy,
          alignItems: "center",
          padding: 24,
        }}
      >
        <Image
          source={require("../../assets/logo.png")}
          style={{ width: 200, height: 190 }}
          resizeMode="contain"
        />
      </View>
      <View style={s.page}>
        <Text style={s.title}>Seu próximo destino começa aqui</Text>
        <Text style={s.subtitle}>
          Descubra países e converse com quem já mora lá.
        </Text>
        <TextInput
          accessibilityLabel="Buscar um país"
          style={s.input}
          placeholder="Buscar um país"
          value={query}
          onChangeText={setQuery}
        />
        <Pressable
          onPress={() => navigate("residentes")}
          style={[s.card, { backgroundColor: colors.pale }]}
        >
          <View style={s.row}>
            <Icon name="people" />
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Converse com residentes</Text>
              <Text style={s.text}>
                Conheça experiências de moradia, cultura e adaptação.
              </Text>
            </View>
          </View>
        </Pressable>
        <Text style={s.section}>
          {query ? "Resultados" : "Destinos em destaque"}
        </Text>
        {list.map((c) => (
          <CountryCard key={c.id} country={c} onPress={() => openCountry(c)} />
        ))}
        {!list.length && <Text style={s.text}>Nenhum país encontrado.</Text>}
        <Button title="Explorar países" onPress={() => navigate("países")} />
      </View>
    </ScrollView>
  );
}
