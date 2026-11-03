import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Icon } from "../components/UI";
import { colors, s } from "../styles/theme";

const services = ["Educação", "Moradia", "Trabalho", "Imigração", "Saúde", "Outros"];

export default function AddEmpresaProjetoScreen({ companyName = "", onSave, onCancel }) {
  const [company, setCompany] = useState(companyName);
  const [service, setService] = useState("Trabalho");
  const [vacancies, setVacancies] = useState("1");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  function field(label, value, setter, placeholder, keyboardType = "default") {
    return <View style={{ marginBottom: 14 }}><Text style={{ color: colors.navy, fontWeight: "700", marginBottom: 7 }}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={setter} placeholder={placeholder} placeholderTextColor="#8A9AAF" keyboardType={keyboardType} autoCapitalize="words" style={[s.input, { marginBottom: 0 }]} /></View>;
  }
  function submit() {
    if (!company.trim() || !service || !vacancies.trim() || !city.trim() || !state.trim() || !country.trim() || !title.trim() || !description.trim()) return setError("Preencha os campos obrigatórios, incluindo o título e a descrição.");
    if (!Number.isInteger(Number(vacancies)) || Number(vacancies) < 1) return setError("Informe uma quantidade de vagas válida (mínimo 1).");
    onSave({ id: String(Date.now()), companyName: company.trim(), service, vacancies: String(Number(vacancies)), city: city.trim(), state: state.trim(), country: country.trim(), title: title.trim(), description: description.trim(), requirements: requirements.trim(), benefits: benefits.trim(), contact: contact.trim(), createdAt: new Date().toISOString() });
  }

  return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[s.page, { paddingTop: 24 }]}>
      <Pressable accessibilityRole="button" onPress={onCancel} style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 20 }}><Icon name="arrow-back" size={20} /><Text style={{ color: colors.blue, fontWeight: "700" }}>Voltar aos projetos</Text></Pressable>
      <Text style={s.title}>Adicionar projeto</Text>
      <Text style={s.subtitle}>Compartilhe uma oportunidade com pessoas que planejam morar no exterior.</Text>
      {field("Nome da empresa", company, setCompany, "Nome da empresa")}
      <Text style={{ color: colors.navy, fontWeight: "700", marginBottom: 8 }}>Qual é o serviço?</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {services.map((item) => <Pressable key={item} accessibilityRole="radio" accessibilityState={{ selected: service === item }} onPress={() => setService(item)} style={{ paddingVertical: 10, paddingHorizontal: 14, borderRadius: 22, backgroundColor: service === item ? colors.blue : "white", borderWidth: 1, borderColor: service === item ? colors.blue : colors.line }}><Text style={{ color: service === item ? "white" : colors.text, fontWeight: "700" }}>{item}</Text></Pressable>)}
      </View>
      {field("Título do projeto *", title, setTitle, "Ex.: Programa de contratação internacional")}
      <View style={{ marginBottom: 14 }}><Text style={{ color: colors.navy, fontWeight: "700", marginBottom: 7 }}>Descrição completa *</Text><TextInput accessibilityLabel="Descrição completa" value={description} onChangeText={setDescription} placeholder="Explique a oportunidade, o que a empresa oferece e como funciona..." placeholderTextColor="#8A9AAF" multiline textAlignVertical="top" style={[s.input, { minHeight: 125, marginBottom: 0 }]} /></View>
      <View style={{ marginBottom: 14 }}><Text style={{ color: colors.navy, fontWeight: "700", marginBottom: 7 }}>Requisitos e perfil desejado</Text><TextInput accessibilityLabel="Requisitos e perfil desejado" value={requirements} onChangeText={setRequirements} placeholder="Experiência, documentos, idioma ou qualificações (opcional)" placeholderTextColor="#8A9AAF" multiline textAlignVertical="top" style={[s.input, { minHeight: 85, marginBottom: 0 }]} /></View>
      <View style={{ marginBottom: 14 }}><Text style={{ color: colors.navy, fontWeight: "700", marginBottom: 7 }}>Benefícios / o que está incluído</Text><TextInput accessibilityLabel="Benefícios" value={benefits} onChangeText={setBenefits} placeholder="Ex.: apoio com moradia, orientação, bolsa (opcional)" placeholderTextColor="#8A9AAF" multiline textAlignVertical="top" style={[s.input, { minHeight: 75, marginBottom: 0 }]} /></View>
      {field("Contato ou link para candidatura", contact, setContact, "E-mail, telefone ou site (opcional)")}
      {field("Quantidade de vagas *", vacancies, setVacancies, "Ex.: 5", "number-pad")}
      <Text style={s.section}>Localização do projeto</Text>
      {field("Cidade", city, setCity, "Cidade")}
      {field("Estado / província", state, setState, "Estado ou província")}
      {field("País", country, setCountry, "País")}
      {!!error && <Text accessibilityRole="alert" style={{ color: "#B42318", marginBottom: 12 }}>{error}</Text>}
      <Pressable accessibilityRole="button" onPress={submit} style={({ pressed }) => ({ backgroundColor: colors.blue, borderRadius: 14, padding: 16, alignItems: "center", opacity: pressed ? 0.8 : 1, marginTop: 6 })}><Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>Publicar projeto</Text></Pressable>
      <Pressable accessibilityRole="button" onPress={onCancel} style={{ padding: 15, alignItems: "center", marginBottom: 20 }}><Text style={{ color: colors.text, fontWeight: "700" }}>Cancelar</Text></Pressable>
    </ScrollView>
  </KeyboardAvoidingView>;
}
