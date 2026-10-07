import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Alert } from "react-native";
import { Icon } from "../components/UI";

const blue = "#0062FF", navy = "#091344", muted = "#64729B";
export default function AuthScreen({ mode, onChangeMode, onEnter }) {
  const register = mode === "cadastro";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [kind, setKind] = useState("Planejando a mudança");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  function submit() {
    if (register && !name.trim()) return setError("Informe seu nome completo.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Informe um e-mail válido.");
    if (!password) return setError("Informe sua senha.");
    if (register && password.length < 8) return setError("Use pelo menos 8 caracteres na senha.");
    if (register && password !== confirmation) return setError("As senhas não coincidem.");
    if (register && !accepted) return setError("Aceite os termos para continuar.");
    onEnter({ name: register ? name.trim() : "Visitante", email: email.trim().toLowerCase(), kind });
  }
  function field(label, icon, value, onChangeText, secret = false, show = false, toggle) {
    return <View style={styles.field}><Text style={styles.label}>{label}</Text><View style={styles.inputRow}><Icon name={icon} color={navy} size={23} /><TextInput accessibilityLabel={label} style={styles.input} value={value} onChangeText={onChangeText} placeholder={label === "E-mail" ? "seuemail@exemplo.com" : secret ? "Digite sua senha" : "Seu nome completo"} placeholderTextColor={muted} secureTextEntry={secret && !show} autoCapitalize={label === "Nome completo" ? "words" : "none"} autoCorrect={false} keyboardType={label === "E-mail" ? "email-address" : "default"} />{secret && <Pressable accessibilityRole="button" accessibilityLabel={show ? "Ocultar senha" : "Mostrar senha"} onPress={toggle} style={styles.eye}><Icon name={show ? "eye-off-outline" : "eye-outline"} color={navy} /></Pressable>}</View></View>;
  }
  const info = (title) => Alert.alert(title, "Esta é uma versão de demonstração. As políticas definitivas serão disponibilizadas antes do lançamento e da coleta de dados reais.");
  return <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }} behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
    <View style={register ? styles.smallBrand : styles.hero}><Image source={require("../../assets/logo.png")} resizeMode="contain" style={{ width: register ? 150 : 230, height: register ? 110 : 220 }} />{!register && <Text style={styles.slogan}>CONEXÕES QUE TE LEVAM MAIS LONGE</Text>}</View>
    <View style={[styles.body, !register && styles.loginBody]}><Text style={[styles.title, !register && { textAlign: "center" }]}>{register ? "Crie sua conta" : "Bem-vindo de volta!"}</Text><Text style={[styles.subtitle, !register && { textAlign: "center", marginBottom: 28 }]}>{register ? "Conecte-se com quem já vive no seu próximo destino." : "Entre para conhecer destinos\ne conversar com residentes."}</Text>
    {register && field("Nome completo", "person-outline", name, setName)}
    {field("E-mail", "mail-outline", email, setEmail)}
    {field("Senha", "lock-closed-outline", password, setPassword, true, visible, () => setVisible(!visible))}
    {register ? <><Text style={styles.hint}>Use pelo menos 8 caracteres.</Text>{field("Confirmar senha", "lock-closed-outline", confirmation, setConfirmation, true, confirmVisible, () => setConfirmVisible(!confirmVisible))}<Text style={styles.label}>Seu momento</Text><View style={styles.options}>{[["Planejando a mudança", "airplane-outline", "Quero morar fora", "Estou planejando me mudar."], ["Residente no exterior", "home-outline", "Já moro no exterior", "Quero compartilhar minha experiência."]].map(([id, icon, title, text]) => <Pressable key={id} accessibilityRole="radio" accessibilityState={{ checked: kind === id }} onPress={() => setKind(id)} style={[styles.option, kind === id && styles.selected]}><View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}><Icon name={kind === id ? "radio-button-on" : "radio-button-off"} color={kind === id ? blue : navy} /><Icon name={icon} color={kind === id ? blue : navy} /></View><Text style={styles.optionTitle}>{title}</Text><Text style={styles.hint}>{text}</Text></Pressable>)}</View><View style={styles.terms}><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: accepted }} accessibilityLabel="Aceitar os termos de demonstração" onPress={() => setAccepted(!accepted)} style={styles.eye}><Icon name={accepted ? "checkbox" : "square-outline"} color={blue} /></Pressable><Text style={{ flex: 1, color: muted }}>Aceito os <Text style={styles.link} onPress={() => info("Termos de uso")}>termos de uso</Text> e a <Text style={styles.link} onPress={() => info("Política de privacidade")}>política de privacidade</Text>.</Text></View></> : <Pressable onPress={() => Alert.alert("Recuperar senha", "A recuperação de senha ficará disponível quando o app tiver autenticação real.")}><Text style={[styles.link, { textAlign: "right", marginBottom: 22 }]}>Esqueci minha senha</Text></Pressable>}
    {!!error && <Text accessibilityRole="alert" style={{ color: "#B42318", marginVertical: 10 }}>{error}</Text>}
    <Pressable accessibilityRole="button" onPress={submit} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}><Text style={styles.buttonText}>{register ? "Criar conta" : "Entrar"}</Text></Pressable>
    <View style={styles.footer}><Text style={styles.hint}>{register ? "Já tem uma conta?" : "Ainda não tem uma conta?"}</Text><Pressable accessibilityRole="button" onPress={() => onChangeMode(register ? "login" : "cadastro")}><Text style={[styles.link, { fontWeight: "700", fontSize: 18 }]}>{register ? "Entrar" : "Criar conta"}</Text></Pressable></View><Text style={styles.demo}>Modo demonstração: não autentica nem salva contas ou senhas. Os dados do perfil duram apenas esta sessão.</Text>
    </View></ScrollView></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({
  hero: { backgroundColor: "#00213B", alignItems: "center", paddingTop: 12, paddingBottom: 36 }, smallBrand: { alignItems: "center", paddingTop: 12 }, slogan: { color: "white", fontSize: 10, letterSpacing: 1.4 }, body: { padding: 24, width: "100%", maxWidth: 560, alignSelf: "center" }, loginBody: { marginTop: -18, borderTopLeftRadius: 22, borderTopRightRadius: 22, backgroundColor: "white", flex: 1 }, title: { color: navy, fontSize: 30, fontWeight: "800", marginBottom: 8 }, subtitle: { color: muted, fontSize: 18, lineHeight: 26, marginBottom: 20 }, label: { color: navy, fontSize: 16, fontWeight: "700", marginBottom: 8 }, field: { marginBottom: 16 }, inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F7FB", borderColor: "#DBE4F3", borderWidth: 1, borderRadius: 14, paddingLeft: 16, minHeight: 56 }, input: { flex: 1, color: navy, fontSize: 16, padding: 12, minWidth: 0 }, eye: { minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" }, hint: { color: muted, fontSize: 13, lineHeight: 20 }, link: { color: blue, textDecorationLine: "underline" }, options: { flexDirection: "row", gap: 10, marginBottom: 10 }, option: { flex: 1, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "#DBE4F3" }, selected: { borderColor: blue, backgroundColor: "#E8F2FF" }, optionTitle: { color: navy, fontSize: 14, fontWeight: "700", marginBottom: 3 }, terms: { flexDirection: "row", alignItems: "center", marginBottom: 12 }, button: { backgroundColor: blue, padding: 17, borderRadius: 15, alignItems: "center" }, buttonText: { color: "white", fontSize: 19, fontWeight: "700" }, footer: { alignItems: "center", gap: 8, borderTopWidth: 1, borderColor: "#DBE4F3", paddingTop: 20, marginTop: 24 }, demo: { color: muted, fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 18 }
});
