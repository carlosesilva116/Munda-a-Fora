import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Icon } from "../components/UI";
import { BLUE, NAVY, MUTED, styles } from "./AuthStyles";

export default function RegisterScreen({ onRegister, onGoToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [kind, setKind] = useState("Planejando a mudança");
  const [companyName, setCompanyName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    if (!name.trim()) return setError(kind === "Empresa" ? "Informe o nome do responsável." : "Informe seu nome completo.");
    if (kind === "Empresa" && !companyName.trim()) return setError("Informe o nome da empresa.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Informe um e-mail válido.");
    if (!password) return setError("Informe sua senha.");
    if (password.length < 8) return setError("Use pelo menos 8 caracteres na senha.");
    if (password !== confirmation) return setError("As senhas não coincidem.");
    if (!accepted) return setError("Aceite os termos para continuar.");
    onRegister({ name: name.trim(), email: email.trim().toLowerCase(), kind, companyName: companyName.trim() });
  }

  function field(label, icon, value, onChangeText, secret = false, show = false, toggle) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputRow}>
          <Icon name={icon} color={NAVY} size={23} />
          <TextInput accessibilityLabel={label} style={styles.input} value={value} onChangeText={onChangeText} placeholder={label === "E-mail" ? "seuemail@exemplo.com" : secret ? "Digite sua senha" : "Seu nome completo"} placeholderTextColor={MUTED} secureTextEntry={secret && !show} autoCapitalize={label === "Nome completo" ? "words" : "none"} autoCorrect={false} keyboardType={label === "E-mail" ? "email-address" : "default"} />
          {secret && <Pressable accessibilityRole="button" accessibilityLabel={show ? "Ocultar senha" : "Mostrar senha"} onPress={toggle} style={styles.eye}><Icon name={show ? "eye-off-outline" : "eye-outline"} color={NAVY} /></Pressable>}
        </View>
      </View>
    );
  }

  const info = (title) => Alert.alert(title, "Esta é uma versão de demonstração. As políticas definitivas serão disponibilizadas antes do lançamento e da coleta de dados reais.");

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.smallBrand}>
          <Image source={require("../../assets/logo.png")} resizeMode="contain" style={{ width: 150, height: 110 }} />
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>Crie sua conta</Text>
          <Text style={styles.subtitle}>Conecte-se com quem já vive no seu próximo destino.</Text>
          {field("Nome completo", "person-outline", name, setName)}
          {kind === "Empresa" && <View style={styles.field}><Text style={styles.label}>Nome da empresa</Text><View style={styles.inputRow}><Icon name="business-outline" color={NAVY} size={23} /><TextInput accessibilityLabel="Nome da empresa" style={styles.input} value={companyName} onChangeText={setCompanyName} placeholder="Razão social ou nome comercial" placeholderTextColor={MUTED} autoCapitalize="words" /></View></View>}
          {field("E-mail", "mail-outline", email, setEmail)}
          {field("Senha", "lock-closed-outline", password, setPassword, true, visible, () => setVisible(!visible))}
          <Text style={styles.hint}>Use pelo menos 8 caracteres.</Text>
          {field("Confirmar senha", "lock-closed-outline", confirmation, setConfirmation, true, confirmVisible, () => setConfirmVisible(!confirmVisible))}
          <Text style={styles.label}>Seu momento</Text>
          <View style={styles.options}>
            {[["Planejando a mudança", "airplane-outline", "Quero morar fora", "Estou planejando me mudar."], ["Residente no exterior", "home-outline", "Já moro no exterior", "Quero compartilhar minha experiência."], ["Empresa", "business-outline", "Sou uma empresa", "Quero publicar oportunidades e projetos."]].map(([id, icon, title, text]) => (
              <Pressable key={id} accessibilityRole="radio" accessibilityState={{ checked: kind === id }} onPress={() => setKind(id)} style={[styles.option, kind === id && styles.selected]}>
                <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}><Icon name={kind === id ? "radio-button-on" : "radio-button-off"} color={kind === id ? BLUE : NAVY} /><Icon name={icon} color={kind === id ? BLUE : NAVY} /></View>
                <Text style={styles.optionTitle}>{title}</Text><Text style={styles.hint}>{text}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.terms}>
            <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: accepted }} accessibilityLabel="Aceitar os termos de demonstração" onPress={() => setAccepted(!accepted)} style={styles.eye}><Icon name={accepted ? "checkbox" : "square-outline"} color={BLUE} /></Pressable>
            <Text style={{ flex: 1, color: MUTED }}>Aceito os <Text style={styles.link} onPress={() => info("Termos de uso")}>termos de uso</Text> e a <Text style={styles.link} onPress={() => info("Política de privacidade")}>política de privacidade</Text>.</Text>
          </View>
          {!!error && <Text accessibilityRole="alert" style={{ color: "#B42318", marginVertical: 10 }}>{error}</Text>}
          <Pressable accessibilityRole="button" onPress={submit} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}><Text style={styles.buttonText}>Criar conta</Text></Pressable>
          <View style={styles.footer}>
            <Text style={styles.hint}>Já tem uma conta?</Text>
            <Pressable accessibilityRole="button" onPress={onGoToLogin}><Text style={[styles.link, { fontWeight: "700", fontSize: 18 }]}>Entrar</Text></Pressable>
          </View>
          <Text style={styles.demo}>Modo demonstração: não autentica nem salva contas ou senhas. Os dados do perfil duram apenas esta sessão.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
