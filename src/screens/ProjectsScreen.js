import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Linking, Alert } from "react-native";
import { Icon, Brand } from "../components/UI";
import { colors, s } from "../styles/theme";

const categories = ["Todos", "Educação", "Moradia", "Trabalho", "Imigração", "Saúde", "Outros"];

export default function ProjectsScreen({ projects = [], onApply }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const filtered = useMemo(() => projects.filter((p) => {
    const matchesCategory = category === "Todos" || p.service === category;
    const haystack = [p.title, p.companyName, p.description, p.city, p.state, p.country, p.service].join(" ").toLocaleLowerCase();
    return matchesCategory && haystack.includes(query.trim().toLocaleLowerCase());
  }), [projects, query, category]);

  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={[s.page, { paddingTop: 24 }]}>
    <Brand />
    <Text style={s.title}>Projetos e oportunidades</Text>
    <Text style={s.subtitle}>Conheça os projetos publicados por empresas e confira os detalhes, requisitos e formas de contato.</Text>
    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "white", borderWidth: 1, borderColor: colors.line, borderRadius: 14, paddingHorizontal: 12, marginBottom: 14 }}>
      <Icon name="search-outline" color={colors.text} />
      <TextInput accessibilityLabel="Buscar projetos" value={query} onChangeText={setQuery} placeholder="Buscar por empresa, projeto ou país" placeholderTextColor="#8A9AAF" style={{ flex: 1, padding: 13, color: colors.navy }} />
      {!!query && <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => setQuery("")}><Icon name="close-circle" color={colors.text} /></Pressable>}
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10, flexGrow: 0 }}>
      <View style={{ flexDirection: "row", gap: 8, paddingBottom: 4 }}>
        {categories.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: category === item }} onPress={() => setCategory(item)} style={{ borderRadius: 22, paddingVertical: 9, paddingHorizontal: 14, backgroundColor: category === item ? colors.blue : "white", borderWidth: 1, borderColor: category === item ? colors.blue : colors.line }}><Text style={{ color: category === item ? "white" : colors.text, fontWeight: "700" }}>{item}</Text></Pressable>)}
      </View>
    </ScrollView>
    <Text style={[s.text, { marginBottom: 12 }]}>{filtered.length} {filtered.length === 1 ? "projeto encontrado" : "projetos encontrados"}</Text>
    {filtered.length === 0 ? <View style={[s.card, { alignItems: "center", paddingVertical: 32 }]}>
      <View style={{ backgroundColor: colors.pale, borderRadius: 40, padding: 16, marginBottom: 12 }}><Icon name="briefcase-outline" size={30} color={colors.blue} /></View>
      <Text style={[s.label, { textAlign: "center", marginBottom: 8 }]}>{projects.length === 0 ? "Ainda não há projetos publicados" : "Nenhum projeto encontrado"}</Text>
      <Text style={[s.text, { textAlign: "center" }]}>{projects.length === 0 ? "Quando uma empresa cadastrar uma oportunidade, ela aparecerá aqui com sua descrição completa." : "Tente alterar a busca ou escolher outra categoria."}</Text>
    </View> : filtered.map((project) => <View key={project.id} style={[s.card, { padding: 18 }]}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        <View style={{ backgroundColor: colors.pale, padding: 12, borderRadius: 13 }}><Icon name="briefcase-outline" size={23} color={colors.blue} /></View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.blue, fontWeight: "800", fontSize: 12, textTransform: "uppercase", marginBottom: 5 }}>{project.service}</Text>
          <Text style={s.label}>{project.title || project.service + " — oportunidade"}</Text>
          <Text style={[s.text, { marginTop: 5, fontWeight: "700", color: colors.text }]}>{project.companyName}</Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.bg, borderRadius: 12, padding: 12, marginTop: 16, gap: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><Icon name="location-outline" color={colors.blue} /><Text style={[s.text, { flex: 1 }]}>{[project.city, project.state, project.country].filter(Boolean).join(", ")}</Text></View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><Icon name="people-outline" color={colors.blue} /><Text style={[s.text, { flex: 1 }]}>{project.vacancies} {Number(project.vacancies) === 1 ? "vaga disponível" : "vagas disponíveis"}</Text></View>
      </View>
      <Text style={[s.section, { fontSize: 17, marginTop: 18, marginBottom: 7 }]}>Descrição do projeto</Text>
      <Text style={s.text}>{project.description || "A empresa ainda não adicionou uma descrição detalhada."}</Text>
      {!!project.requirements && <><Text style={[s.section, { fontSize: 17, marginTop: 17, marginBottom: 7 }]}>Requisitos e perfil desejado</Text><Text style={s.text}>{project.requirements}</Text></>}
      {!!project.benefits && <><Text style={[s.section, { fontSize: 17, marginTop: 17, marginBottom: 7 }]}>Benefícios / o que está incluído</Text><Text style={s.text}>{project.benefits}</Text></>}
      {!!onApply && !!project.id && <Pressable accessibilityRole="button" onPress={() => onApply(project.id)} style={{ alignItems: "center", backgroundColor: colors.blue, borderRadius: 12, padding: 14, marginTop: 14 }}><Text style={{ color: "white", fontWeight: "800" }}>Inscrever-me no projeto</Text></Pressable>}
      {!!project.contact && <Pressable accessibilityRole="button" onPress={() => {
        const value = String(project.contact).trim();
        if (/^https?:\/\//i.test(value)) Linking.openURL(value).catch(() => Alert.alert("Não foi possível abrir o link"));
        else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) Linking.openURL("mailto:" + value).catch(() => Alert.alert("Não foi possível abrir o e-mail"));
        else Alert.alert("Contato da empresa", value);
      }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.blue, borderRadius: 12, padding: 14, marginTop: 18 }}>
        <Icon name="chatbubble-outline" color="white" /><Text style={{ color: "white", fontWeight: "800" }}>Contato / candidatura</Text>
      </Pressable>}
      {!!project.createdAt && <Text style={{ color: colors.text, fontSize: 11, marginTop: 14 }}>Publicado em {new Date(project.createdAt).toLocaleDateString("pt-BR")}</Text>}
    </View>)}
  </ScrollView>;
}
