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
  onLogout,
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
              <View key={label} style={{ paddingVertical: 10  }}>
                <Text style={s.text}>{label}</Text>
                <Text style={s.label}>{value}</Text>
              </View>
            ))}
          </View>
          <View style={s.card}>
            <Text style={s.section}>Sobre mim</Text>
            <Text style={s.text}>{profile.bio}</Text>
          </View>
          <Text style={s.sectionProfile}>Interesses</Text>
          <View style={[s.rowPerfil, { flexWrap: "wrap" }]}>
            {["Moradia", "Trabalho", "Cultura"].map((t) => (
              <View style={s.chip} key={t}>
                <Text style={s.chipText}>{t}</Text>
              </View>
            ))}
          </View>
   
        
        </>
      )}
      <Button title="Sair" outline onPress={onLogout} />
     
    </ScrollView>
  );
}
