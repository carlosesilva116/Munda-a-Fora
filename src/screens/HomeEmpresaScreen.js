import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Icon } from "../components/UI";
import { colors, s } from "../styles/theme";

export default function HomeEmpresaScreen({ companyName = "Sua empresa", projects = [], onAddProject, onLogout }) {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={[s.page, { paddingTop: 28 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.blue, fontWeight: "700", marginBottom: 6 }}>ÁREA DA EMPRESA</Text>
          <Text style={s.titleHome}>Olá, {companyName}</Text>
          <Text style={s.subtitle}>Gerencie os projetos e encontre pessoas para suas oportunidades.</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Sair" onPress={onLogout} style={{ padding: 10 }}><Icon name="log-out-outline" /></Pressable>
      </View>
      <View style={[s.card, { backgroundColor: colors.navy, borderColor: colors.navy, padding: 20 }]}>
        <Text style={{ color: "white", fontSize: 15 }}>Seus projetos publicados</Text>
        <Text style={{ color: "white", fontSize: 34, fontWeight: "800", marginTop: 4 }}>{projects.length}</Text>
        <Text style={{ color: "#DCE8F7", marginTop: 4 }}>Oportunidades cadastradas nesta sessão</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onAddProject} style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: colors.blue, padding: 16, borderRadius: 15, marginBottom: 22, opacity: pressed ? 0.8 : 1 })}>
        <Icon name="add-circle-outline" color="white" size={22} /><Text style={{ color: "white", fontWeight: "800", fontSize: 16 }}>Adicionar projeto</Text>
      </Pressable>
      <Text style={s.section}>Projetos da empresa</Text>
      {projects.length === 0 ? (
        <View style={[s.card, { alignItems: "center", paddingVertical: 30 }]}>
          <View style={{ backgroundColor: colors.pale, padding: 16, borderRadius: 50, marginBottom: 12 }}><Icon name="briefcase-outline" size={30} /></View>
          <Text style={[s.label, { textAlign: "center", marginBottom: 8 }]}>Nenhum projeto por aqui ainda</Text>
          <Text style={[s.text, { textAlign: "center" }]}>Cadastre seu primeiro projeto para divulgar vagas e oportunidades.</Text>
        </View>
      ) : projects.map((project) => (
        <View key={project.id} style={s.card}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <View style={{ backgroundColor: colors.pale, padding: 12, borderRadius: 12 }}><Icon name="briefcase-outline" size={23} /></View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>{project.companyName}</Text>
              <Text style={{ color: colors.blue, fontWeight: "700", marginTop: 4 }}>{project.service}</Text>
              <Text style={[s.text, { marginTop: 8 }]}><Icon name="people-outline" size={15} color={colors.text} />  {project.vacancies} {Number(project.vacancies) === 1 ? "vaga" : "vagas"}</Text>
              <Text style={[s.text, { marginTop: 4 }]}><Icon name="location-outline" size={15} color={colors.text} />  {project.city}, {project.state}, {project.country}</Text>
            </View>
          </View>
        </View>
      ))}
      <Text style={{ color: colors.text, fontSize: 12, textAlign: "center", marginTop: 14 }}>Os projetos são armazenados localmente durante esta sessão de demonstração.</Text>
    </ScrollView>
  );
}
