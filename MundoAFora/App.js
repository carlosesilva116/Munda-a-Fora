import React, { useEffect, useState } from "react";
import { View, Text, Image, Pressable, BackHandler } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { colors } from "./src/styles/theme";
import { Icon } from "./src/components/UI";
import HomeScreen from "./src/screens/HomeScreen";
import CountriesScreen from "./src/screens/CountriesScreen";
import CountryScreen from "./src/screens/CountryScreen";
import CompareScreen from "./src/screens/CompareScreen";
import ResidentsScreen from "./src/screens/ResidentsScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import AuthScreen from "./src/screens/AuthScreen";
const tabs = [
  ["início", "home-outline", "Início"],
  ["países", "globe-outline", "Países"],
  ["comparar", "bar-chart-outline", "Comparar"],
  ["chat", "chatbubble-outline", "Chat"],
  ["perfil", "person-outline", "Perfil"],
];
export default function App() {
  const [splash, setSplash] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [screen, setScreen] = useState("início");
  const [country, setCountry] = useState(null);
  const [resident, setResident] = useState(null);
  const [filter, setFilter] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [conversations, setConversations] = useState({});
  const [profile, setProfile] = useState({
    name: "Lucas Almeida",
    kind: "Planejando a mudança",
    location: "São Paulo, Brasil",
    destination: "Portugal",
    languages: "Português",
    bio: "Estou pesquisando sobre morar em Portugal e quero conhecer experiências de quem já vive lá.",
  });
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2500);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const h = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!signedIn) {
        if (authMode === "cadastro") { setAuthMode("login"); return true; }
        return false;
      }
      if (screen === "início") return false;
      setScreen(
        screen === "conversa"
          ? "residentes"
          : screen === "destino"
            ? "países"
            : "início",
      );
      return true;
    });
    return () => h.remove();
  }, [screen, signedIn, authMode]);
  function navigate(target) {
    setScreen(target);
    if (target === "chat") {
      setResident(null);
      setFilter(null);
    }
  }
  function openCountry(c) {
    setCountry(c);
    setScreen("destino");
  }
  function findResidents(id = null) {
    setFilter(id);
    setScreen("residentes");
  }
  function openChat(r) {
    setResident(r);
    setConversations((old) =>
      old[r.id]
        ? old
        : {
            ...old,
            [r.id]: [
              {
                id: "intro",
                mine: false,
                text: `Olá! Sou ${r.name} e moro em ${r.city}. Esta é uma conversa de demonstração.`,
              },
            ],
          },
    );
    setScreen("conversa");
  }
  function send(id, text) {
    setConversations((old) => ({
      ...old,
      [id]: [
        ...(old[id] || []),
        { id: Date.now() + "-me", mine: true, text },
        {
          id: Date.now() + "-demo",
          mine: false,
          text: "Resposta de demonstração: podemos conversar sobre adaptação, moradia e rotina. Para falar com pessoas reais, o chat ainda precisa ser conectado a um servidor.",
        },
      ],
    }));
  }
  function toggleFavorite(id) {
    setFavorites((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  }
  const active = ["residentes", "conversa"].includes(screen)
    ? "chat"
    : screen === "destino"
      ? "países"
      : screen;
  let content;
  if (screen === "início")
    content = <HomeScreen navigate={navigate} openCountry={openCountry} />;
  else if (screen === "países")
    content = <CountriesScreen openCountry={openCountry} />;
  else if (screen === "destino")
    content = (
      <CountryScreen
        key={country.id}
        country={country}
        back={() => navigate("países")}
        findResidents={findResidents}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    );
  else if (screen === "comparar")
    content = <CompareScreen openCountry={openCountry} />;
  else if (screen === "conversa")
    content = (
      <ChatScreen
        key={resident.id}
        resident={resident}
        messages={conversations[resident.id] || []}
        send={send}
        back={() => setScreen("residentes")}
      />
    );
  else if (screen === "perfil")
    content = (
      <ProfileScreen
        profile={profile}
        setProfile={setProfile}
        favorites={favorites}
        openCountry={openCountry}
        navigate={navigate}
        onLogout={() => { setSignedIn(false); setAuthMode("login"); setScreen("início"); setFavorites([]); setConversations({}); setCountry(null); setResident(null); setFilter(null); }}
      />
    );
  else
    content = (
      <ResidentsScreen
        filter={filter}
        clearFilter={() => setFilter(null)}
        openChat={openChat}
      />
    );
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: splash || (!signedIn && authMode === "login") ? colors.navy : colors.bg }}
      >
        <StatusBar style={splash || (!signedIn && authMode === "login") ? "light" : "dark"} />
        {splash ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={require("./assets/logo.png")}
              style={{ width: 280, height: 280 }}
              resizeMode="contain"
            />
            <Text style={{ color: "white", marginTop: 24 }}>
              Conexões que te levam mais longe
            </Text>
          </View>
        ) : !signedIn ? (
          <AuthScreen key={authMode} mode={authMode} onChangeMode={setAuthMode} onEnter={(user) => {
            setProfile({ name: user.name, email: user.email, kind: user.kind, location: "", destination: "", languages: "Português", bio: "" });
            setScreen("início"); setSignedIn(true);
          }} />
        ) : (
          <>
            <View style={{ flex: 1 }}>{content}</View>
            <View
              style={{
                flexDirection: "row",
                borderTopWidth: 1,
                borderColor: colors.line,
                backgroundColor: "white",
                paddingVertical: 10,
              }}
            >
              {tabs.map(([id, icon, label]) => (
                <Pressable
                  key={id}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active === id }}
                  accessibilityLabel={label}
                  onPress={() => navigate(id)}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    minHeight: 44,
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    name={icon}
                    color={active === id ? colors.blue : colors.text}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      marginTop: 4,
                      color: active === id ? colors.blue : colors.text,
                      fontWeight: active === id ? "700" : "400",
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
