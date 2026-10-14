import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, BackHandler } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../styles/theme";
import { Icon } from "../components/UI";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CountriesScreen from "../screens/CountriesScreen";
import CountryScreen from "../screens/CountryScreen";
import CompareScreen from "../screens/CompareScreen";
import ResidentsScreen from "../screens/ResidentsScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeEmpresaScreen from "../screens/HomeEmpresaScreen";
import AddEmpresaProjetoScreen from "../screens/AddEmpresaProjetoScreen";

const tabs = [
  ["início", "home-outline", "Início"],
  ["países", "globe-outline", "Países"],
  ["comparar", "bar-chart-outline", "Comparar"],
  ["chat", "chatbubble-outline", "Chat"],
  ["perfil", "person-outline", "Perfil"],
];

export default function AppNavigation() {
  const [appStage, setAppStage] = useState("splash");
  const [screen, setScreen] = useState("início");
  const [country, setCountry] = useState(null);
  const [resident, setResident] = useState(null);
  const [filter, setFilter] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [companyProjects, setCompanyProjects] = useState([]);
  const [conversations, setConversations] = useState({});
  const [profile, setProfile] = useState({ name: "Lucas Almeida", kind: "Planejando a mudança", location: "São Paulo, Brasil", destination: "Portugal", languages: "Português", bio: "Estou pesquisando sobre morar em Portugal e quero conhecer experiências de quem já vive lá." });

  const finishSplash = useCallback(() => setAppStage("login"), []);

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (appStage === "register") { setAppStage("login"); return true; }
      if (appStage !== "app") return false;
      if (screen === "início" || screen === "homeEmpresa") return false;
      if (screen === "novoProjeto") { setScreen("homeEmpresa"); return true; }
      setScreen(screen === "conversa" ? "residentes" : screen === "destino" ? "países" : "início");
      return true;
    });
    return () => handler.remove();
  }, [appStage, screen]);

  function enterApp(user) {
    setProfile({ name: user.name, email: user.email, kind: user.kind, companyName: user.companyName || "", location: "", destination: "", languages: "Português", bio: "" });
    setScreen(user.kind === "Empresa" ? "homeEmpresa" : "início");
    setAppStage("app");
  }

  function navigate(target) {
    setScreen(target);
    if (target === "chat") { setResident(null); setFilter(null); }
  }

  function openCountry(c) { setCountry(c); setScreen("destino"); }

  function findResidents(id = null) { setFilter(id); setScreen("residentes"); }

  function openChat(r) {
    setResident(r);
    setConversations((old) => old[r.id] ? old : { ...old, [r.id]: [{ id: "intro", mine: false, text: `Olá! Sou ${r.name} e moro em ${r.city}. Esta é uma conversa de demonstração.` }] });
    setScreen("conversa");
  }

  function send(id, text) {
    const now = Date.now();
    setConversations((old) => ({ ...old, [id]: [...(old[id] || []), { id: now + "-me", mine: true, text }, { id: now + "-demo", mine: false, text: "Resposta de demonstração: podemos conversar sobre adaptação, moradia e rotina. Para falar com pessoas reais, o chat ainda precisa ser conectado a um servidor." }] }));
  }

  function toggleFavorite(id) { setFavorites((old) => old.includes(id) ? old.filter((x) => x !== id) : [...old, id]); }

  function logout() {
    setAppStage("login"); setScreen("início"); setFavorites([]); setConversations({}); setCountry(null); setResident(null); setFilter(null);
  }

  if (appStage === "splash") {
    return <><StatusBar style="light" /><SplashScreen onFinish={finishSplash} /></>;
  }

  if (appStage === "login") {
    return <><StatusBar style="light" /><LoginScreen onLogin={enterApp} onGoToRegister={() => setAppStage("register")} /></>;
  }

  if (appStage === "register") {
    return <><StatusBar style="dark" /><RegisterScreen onRegister={enterApp} onGoToLogin={() => setAppStage("login")} /></>;
  }

  const active = ["residentes", "conversa"].includes(screen) ? "chat" : screen === "destino" ? "países" : screen;
  const isCompany = ["homeEmpresa", "novoProjeto"].includes(screen);
  let content;
  if (screen === "homeEmpresa") content = <HomeEmpresaScreen companyName={profile.companyName || profile.name} projects={companyProjects} onAddProject={() => setScreen("novoProjeto")} onLogout={logout} />;
  else if (screen === "novoProjeto") content = <AddEmpresaProjetoScreen companyName={profile.companyName || profile.name} onCancel={() => setScreen("homeEmpresa")} onSave={(project) => { setCompanyProjects((old) => [project, ...old]); setScreen("homeEmpresa"); }} />;
  else if (screen === "início") content = <HomeScreen navigate={navigate} openCountry={openCountry} />;
  else if (screen === "países") content = <CountriesScreen openCountry={openCountry} />;
  else if (screen === "destino") content = <CountryScreen key={country?.id} country={country} back={() => navigate("países")} findResidents={findResidents} favorites={favorites} toggleFavorite={toggleFavorite} />;
  else if (screen === "comparar") content = <CompareScreen openCountry={openCountry} />;
  else if (screen === "conversa") content = <ChatScreen key={resident?.id} resident={resident} messages={resident ? conversations[resident.id] || [] : []} send={send} back={() => setScreen("residentes")} />;
  else if (screen === "perfil") content = <ProfileScreen profile={profile} setProfile={setProfile} favorites={favorites} openCountry={openCountry} navigate={navigate} onLogout={logout} />;
  else content = <ResidentsScreen filter={filter} clearFilter={() => setFilter(null)} openChat={openChat} />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>{content}</View>
      {!isCompany && <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: colors.line, backgroundColor: "white", paddingVertical: 10 }}>
        {tabs.map(([id, icon, label]) => (
          <Pressable key={id} accessibilityRole="tab" accessibilityState={{ selected: active === id }} accessibilityLabel={label} onPress={() => navigate(id)} style={{ flex: 1, alignItems: "center", minHeight: 44, justifyContent: "center" }}>
            <Icon name={icon} color={active === id ? colors.blue : colors.text} />
            <Text style={{ fontSize: 11, marginTop: 4, color: active === id ? colors.blue : colors.text, fontWeight: active === id ? "700" : "400" }}>{label}</Text>
          </Pressable>
        ))}
      </View>}
    </View>
  );
}
