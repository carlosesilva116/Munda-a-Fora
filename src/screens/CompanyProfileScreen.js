import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { colors, s } from "../styles/theme";
import { Icon, Button } from "../components/UI";

export default function CompanyProfileScreen({ profile, setProfile, onBack }) {
  const [draft, setDraft] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const fields = [
    ["Nome comercial", "companyName", "Nome público da empresa"],
    ["País de registro", "companyCountry", "País onde está registrada"],
    ["País de origem", "originCountry", "País onde foi fundada"],
    ["Identificador empresarial", "companyId", "CNPJ, NIF, EIN ou registro equivalente"],
    ["Setor de atuação", "industry", "Ex.: educação, moradia, tecnologia"],
    ["Site oficial", "website", "https://"],
    ["Descrição da empresa", "companyBio", "Conte um pouco sobre a empresa"],
  ];
  function save() {
    if (!draft.companyName?.trim() || !draft.companyCountry?.trim() || !draft.originCountry?.trim() || !draft.companyId?.trim()) {
      setSaved(false);
      return;
    }
    setProfile({ ...profile, ...draft, companyName: draft.companyName.trim() });
    setSaved(true);
  }
  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={[s.page, { paddingTop: 28 }]}>
    <Pressable onPress={onBack} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 }}><Icon name="arrow-back" color={colors.blue} /><Text style={{ color: colors.blue, fontWeight: "700" }}>Voltar à área da empresa</Text></Pressable>
    <View style={{ backgroundColor: colors.navy, borderRadius: 22, padding: 22, marginBottom: 22 }}>
      <View style={{ width: 58, height: 58, borderRadius: 18, backgroundColor: "#FFFFFF22", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Icon name="business-outline" size={30} color="white" /></View>
      <Text style={{ color: "#B9D5FF", fontWeight: "800", letterSpacing: 1 }}>PERFIL EMPRESARIAL</Text>
      <Text style={{ color: "white", fontSize: 26, fontWeight: "800", marginTop: 8 }}>{draft.companyName || "Sua empresa"}</Text>
      <Text style={{ color: "#DCE8F7", marginTop: 8, lineHeight: 21 }}>Apresente sua organização e ajude pessoas a encontrar oportunidades confiáveis.</Text>
    </View>
    <Text style={s.title}>Dados da empresa</Text>
    <Text style={s.subtitle}>Preencha os dados oficiais. O identificador solicitado varia conforme o país de registro.</Text>
    <View style={s.card}>
      {fields.map(([label, key, placeholder]) => <View key={key} style={{ marginBottom: 10 }}>
        <Text style={[s.text, { fontWeight: "700", marginBottom: 7 }]}>{label}{["companyName","companyCountry","originCountry","companyId"].includes(key) ? " *" : ""}</Text>
        <TextInput accessibilityLabel={label} style={[s.input, { minHeight: key === "companyBio" ? 100 : 48, textAlignVertical: key === "companyBio" ? "top" : "center" }]} value={draft[key] || ""} onChangeText={v => { setDraft({ ...draft, [key]: v }); setSaved(false); }} placeholder={placeholder} placeholderTextColor="#8998AC" multiline={key === "companyBio"} autoCapitalize={key === "companyId" ? "characters" : "sentences"} keyboardType="default" />
      </View>)}
      <Text style={{ color: colors.text, fontSize: 12, marginBottom: 14 }}>* Campos obrigatórios. Os dados ficam nesta demonstração local e ainda não são verificados em bases oficiais.</Text>
      <Button title="Salvar perfil empresarial" onPress={save} />
      {saved && <Text accessibilityRole="alert" style={{ color: "#16804A", fontWeight: "700", marginTop: 12 }}>Perfil atualizado com sucesso nesta sessão.</Text>}
      {!saved && (!draft.companyName?.trim() || !draft.companyCountry?.trim() || !draft.originCountry?.trim() || !draft.companyId?.trim()) && <Text style={{ color: colors.text, fontSize: 12, marginTop: 8 }}>Preencha os quatro campos obrigatórios para salvar.</Text>}
    </View>
  </ScrollView>;
}
