import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, BackHandler, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../styles/theme";
import { Icon } from "../components/UI";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CountriesScreen from "../screens/CountriesScreen";
import CountryScreen from "../screens/CountryScreen";
import ProjectsScreen from "../screens/ProjectsScreen";
import ResidentsScreen from "../screens/ResidentsScreen";
import ChatScreen from "../screens/ChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeEmpresaScreen from "../screens/HomeEmpresaScreen";
import AddEmpresaProjetoScreen from "../screens/AddEmpresaProjetoScreen";
import CompanyProfileScreen from "../screens/CompanyProfileScreen";
import { authApi, profileApi, projectsApi, favoritesApi, residentsApi } from "../services/api";
import { isBackendConfigured } from "../services/supabase";

const tabs = [
  ["início", "home-outline", "Início"],
  ["países", "globe-outline", "Países"],
  ["projetos", "briefcase-outline", "Projetos"],
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
  const [savedResidents, setSavedResidents] = useState([]);
  const [conversations, setConversations] = useState({});
  const [profile, setProfileState] = useState({ name: "", kind: "Planejando a mudança", location: "", destination: "", languages: "Português", bio: "" });
  const [busy, setBusy] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => { if (!isBackendConfigured) return; authApi.session().then(async session => { if (!session) return; const user = await profileApi.getMine(); if (user) enterApp(user); }).catch(e => Alert.alert("Backend", e.message)); }, []);

  const finishSplash = useCallback(() => setAppStage("login"), []);

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (appStage === "register") { setAppStage("login"); return true; }
      if (appStage !== "app") return false;
      if (screen === "início" || screen === "homeEmpresa") return false;
      if (screen === "novoProjeto" || screen === "perfilEmpresa") { setScreen("homeEmpresa"); return true; }
      setScreen(screen === "conversa" ? "residentes" : screen === "destino" ? "países" : "início");
      return true;
    });
    return () => handler.remove();
  }, [appStage, screen]);

  async function enterApp(user) {
    setUserId(user.id || null);
    setProfileState({ ...user, name: user.name, email: user.email, kind: user.kind, companyName: user.companyName || "", companyCountry: user.companyCountry || "", originCountry: user.originCountry || "", companyId: user.companyId || "", industry: user.industry || "", website: user.website || "", companyBio: user.companyBio || "", location: user.location || "", destination: user.destination || "", languages: user.languages || "Português", bio: user.bio || "" });
    try { const savedProjects = await projectsApi.list({ mine: false }); setCompanyProjects(savedProjects); const savedFavorites = await favoritesApi.list(); setFavorites(savedFavorites); const directory = await residentsApi.list(); setSavedResidents(directory); } catch (e) { if (isBackendConfigured) Alert.alert("Sincronização", e.message); }
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

  async function toggleFavorite(id) { try { if (isBackendConfigured) { const added = await favoritesApi.toggle(id); setFavorites(old => added ? [...old, String(id)] : old.filter(x => String(x) !== String(id))); } else setFavorites((old) => old.includes(id) ? old.filter((x) => x !== id) : [...old, id]); } catch(e) { Alert.alert("Favoritos", e.message); } }

  async function login(credentials) { try { setBusy(true); const user = await authApi.signIn(credentials.email, credentials.password); await enterApp(user); } catch(e) { Alert.alert("Não foi possível entrar", e.message); } finally { setBusy(false); } }
  async function register(values) { try { setBusy(true); const user = await authApi.signUp(values); if (!user.id) { Alert.alert("Confirme seu e-mail", "A conta foi criada. Confirme o e-mail antes de entrar."); setAppStage("login"); return; } await enterApp(user); } catch(e) { Alert.alert("Não foi possível criar a conta", e.message); } finally { setBusy(false); } }
  async function updateProfile(next) { setProfileState(next); if (!isBackendConfigured || !userId) return; try { const saved = await profileApi.update(next); setProfileState(old => ({...old,...saved})); } catch(e) { Alert.alert("Perfil", e.message); } }

  async function logout() {
    try { if (isBackendConfigured) await authApi.signOut(); } catch(e) { Alert.alert("Sessão", e.message); }
    setUserId(null); setProfileState({ name: "", kind: "Planejando a mudança", location: "", destination: "", languages: "Português", bio: "" });
    setAppStage("login"); setScreen("início"); setFavorites([]); setConversations({}); setCountry(null); setResident(null); setFilter(null);
  }

  if (appStage === "splash") {
    return <><StatusBar style="light" /><SplashScreen onFinish={finishSplash} /></>;
  }

  if (appStage === "login") {
    return <><StatusBar style="light" /><LoginScreen onLogin={login} onGoToRegister={() => setAppStage("register")} /></>;
  }

  if (appStage === "register") {
    return <><StatusBar style="dark" /><RegisterScreen onRegister={register} onGoToLogin={() => setAppStage("login")} /></>;
  }

  const active = ["residentes", "conversa"].includes(screen) ? "chat" : screen === "destino" ? "países" : screen;
  const isCompany = ["homeEmpresa", "novoProjeto", "perfilEmpresa"].includes(screen);
  let content;
  if (screen === "homeEmpresa") content = <HomeEmpresaScreen companyName={profile.companyName || profile.name} projects={companyProjects.filter(project => project.owner_id === userId)} onAddProject={() => setScreen("novoProjeto")} onEditProfile={() => setScreen("perfilEmpresa")} onLogout={logout} />;
  else if (screen === "perfilEmpresa") content = <CompanyProfileScreen profile={profile} setProfile={updateProfile} onBack={() => setScreen("homeEmpresa")} />;
  else if (screen === "novoProjeto") content = <AddEmpresaProjetoScreen companyName={profile.companyName || profile.name} onCancel={() => setScreen("homeEmpresa")} onSave={async (project) => { try { const saved = isBackendConfigured ? await projectsApi.create(project) : project; setCompanyProjects((old) => [saved, ...old]); setScreen("homeEmpresa"); } catch(e) { Alert.alert("Projeto não publicado", e.message); } }} />;
  else if (screen === "início") content = <HomeScreen navigate={navigate} openCountry={openCountry} />;
  else if (screen === "países") content = <CountriesScreen openCountry={openCountry} />;
  else if (screen === "destino") content = <CountryScreen key={country?.id} country={country} back={() => navigate("países")} findResidents={findResidents} favorites={favorites} toggleFavorite={toggleFavorite} />;
  else if (screen === "projetos") content = <ProjectsScreen projects={companyProjects} onApply={async (id) => { try { await projectsApi.apply(id); Alert.alert("Inscrição realizada", "Sua inscrição foi registrada."); } catch(e) { Alert.alert("Inscrição", e.message); } }} />;
  else if (screen === "conversa") content = <ChatScreen key={resident?.id} resident={resident} messages={resident ? conversations[resident.id] || [] : []} send={send} back={() => setScreen("residentes")} />;
  else if (screen === "perfil") content = <ProfileScreen profile={profile} setProfile={updateProfile} favorites={favorites} openCountry={openCountry} navigate={navigate} onLogout={logout} />;
  else content = <ResidentsScreen filter={filter} clearFilter={() => setFilter(null)} openChat={openChat} residents={savedResidents} />;

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
