import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { Icon } from "../components/UI";
import { BLUE, NAVY, MUTED, styles } from "./AuthStyles";

export default function LoginScreen({ onLogin, onGoToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");

  function submit() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Informe um e-mail válido.");
    if (!password) return setError("Informe sua senha.");
    onLogin({ name: "Visitante", email: email.trim().toLowerCase(), kind: "Planejando a mudança" });
  }

  function field(label, icon, value, onChangeText, secret = false, show = false, toggle) {
    return (
      <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.inputRow}>
          <Icon name={icon} color={NAVY} size={23} />
          <TextInput accessibilityLabel={label} style={styles.input} value={value} onChangeText={onChangeText} placeholder={label === "E-mail" ? "seuemail@exemplo.com" : "Digite sua senha"} placeholderTextColor={MUTED} secureTextEntry={secret && !show} autoCapitalize="none" autoCorrect={false} keyboardType={label === "E-mail" ? "email-address" : "default"} />
          {secret && <Pressable accessibilityRole="button" accessibilityLabel={show ? "Ocultar senha" : "Mostrar senha"} onPress={toggle} style={styles.eye}><Icon name={show ? "eye-off-outline" : "eye-outline"} color={NAVY} /></Pressable>}
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.hero}>
          <Image source={require("../../assets/logo.png")} resizeMode="contain" style={{ width: 230, height: 220 }} />
          <Text style={styles.slogan}>CONEXÕES QUE TE LEVAM MAIS LONGE</Text>
        </View>
        <View style={[styles.body, styles.loginBody]}>
          <Text style={[styles.title, { textAlign: "center" }]}>Bem-vindo de volta!</Text>
          <Text style={[styles.subtitle, { textAlign: "center", marginBottom: 28 }]}>Entre para conhecer destinos{"\n"}e conversar com residentes.</Text>
          {field("E-mail", "mail-outline", email, setEmail)}
          {field("Senha", "lock-closed-outline", password, setPassword, true, visible, () => setVisible(!visible))}
          <Pressable onPress={() => Alert.alert("Recuperar senha", "A recuperação de senha ficará disponível quando o app tiver autenticação real.")}>
            <Text style={[styles.link, { textAlign: "right", marginBottom: 22 }]}>Esqueci minha senha</Text>
          </Pressable>
          {!!error && <Text accessibilityRole="alert" style={{ color: "#B42318", marginVertical: 10 }}>{error}</Text>}
          <Pressable accessibilityRole="button" onPress={submit} style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}><Text style={styles.buttonText}>Entrar</Text></Pressable>
          <View style={styles.footer}>
            <Text style={styles.hint}>Ainda não tem uma conta?</Text>
            <Pressable accessibilityRole="button" onPress={onGoToRegister}><Text style={[styles.link, { fontWeight: "700", fontSize: 18 }]}>Criar conta</Text></Pressable>
          </View>
          <Text style={styles.demo}>Modo demonstração: não autentica nem salva contas ou senhas. Os dados do perfil duram apenas esta sessão.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
