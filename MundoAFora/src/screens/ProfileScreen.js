import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { s, colors } from "../styles/theme";
import { Brand, Button, Icon, CountryCard } from "../components/UI";
import { countries } from "../data/countries";
export default function ProfileScreen({
  profile,
  setProfile,
  favorites,
  openCountry,
  navigate,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [error, setError] = useState("");
  function save() {
    if (!draft.name.trim()) {
      setError("Informe seu nome.");
      return;
    }
    setProfile({ ...draft, name: draft.name.trim() });
    setEditing(false);
    setError("");
  }
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Brand />
      <Text style={s.title}>Meu perfil</Text>
      <View style={{ alignItems: "center", marginVertical: 12 }}>
        <View
          style={{
            backgroundColor: colors.pale,
            padding: 26,
            borderRadius: 65,
          }}
        >
          <Icon name="person" size={64} />
        </View>
        <Text style={[s.title, { marginTop: 14 }]}>{profile.name}</Text>
        <View style={s.chip}>
          <Text style={s.chipText}>{profile.kind}</Text>
        </View>
      </View>
      {editing ? (
        <View style={s.card}>
          {[
            ["Nome", "name"],
            ["Onde moro", "location"],
            ["País de interesse", "destination"],
            ["Idiomas", "languages"],
            ["Sobre mim", "bio"],
          ].map(([label, key]) => (
            <View key={key}>
              <Text style={s.text}>{label}</Text>
              <TextInput
                accessibilityLabel={label}
                style={s.input}
                value={draft[key]}
                multiline={key === "bio"}
                onChangeText={(value) => setDraft({ ...draft, [key]: value })}
              />
            </View>
          ))}
          <Text style={s.text}>Meu momento</Text>
          {["Planejando a mudança", "Residente no exterior"].map((kind) => (
            <Pressable
              key={kind}
              onPress={() => setDraft({ ...draft, kind })}
              style={[
                s.chip,
                { marginVertical: 5 },
                draft.kind === kind && { backgroundColor: colors.blue },
              ]}
            >
              <Text
                style={[s.chipText, draft.kind === kind && { color: "white" }]}
              >
                {kind}
              </Text>
            </Pressable>
          ))}
          {!!error && <Text style={{ color: "#B42318" }}>{error}</Text>}
          <Button title="Salvar alterações" onPress={save} />
          <Button title="Cancelar" outline onPress={() => setEditing(false)} />
        </View>
      ) : (
        <>
          <Button
            title="Editar perfil"
            outline
            onPress={() => {
              setDraft(profile);
              setEditing(true);
            }}
          />
          <View style={s.card}>
            {[
              ["Onde moro", profile.location],
              ["Quero morar em", profile.destination],
              ["Idiomas", profile.languages],
            ].map(([label, value]) => (
              <View key={label} style={{ paddingVertical: 10 }}>
                <Text style={s.text}>{label}</Text>
                <Text style={s.label}>{value}</Text>
              </View>
            ))}
          </View>
          <View style={s.card}>
            <Text style={s.section}>Sobre mim</Text>
            <Text style={s.text}>{profile.bio}</Text>
          </View>
          <Text style={s.section}>Interesses</Text>
          <View style={[s.row, { flexWrap: "wrap" }]}>
            {["Moradia", "Trabalho", "Cultura"].map((t) => (
              <View style={s.chip} key={t}>
                <Text style={s.chipText}>{t}</Text>
              </View>
            ))}
          </View>
          <Text style={s.section}>Países favoritos</Text>
          {countries
            .filter((c) => favorites.includes(c.id))
            .map((c) => (
              <CountryCard
                key={c.id}
                country={c}
                onPress={() => openCountry(c)}
              />
            ))}
          {!favorites.length && (
            <Text style={s.text}>
              Toque no coração na tela de um país para salvá-lo.
            </Text>
          )}
          <Button title="Minhas conversas" onPress={() => navigate("chat")} />
        </>
      )}
      <Text style={[s.text, { fontSize: 12, marginTop: 14 }]}>
        Os dados desta versão ficam disponíveis durante a sessão e são
        reiniciados ao fechar o app.
      </Text>
    </ScrollView>
  );
}
