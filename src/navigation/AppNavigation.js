import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  BackHandler,
  Alert,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "../styles/theme";
import { Icon } from "../components/UI";
import {
  Avatar,
  Flag,
  countryName,
} from "../components/ProfileUI";

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

import {
  authApi,
  profileApi,
  projectsApi,
  favoritesApi,
  residentsApi,
  chatsApi,
} from "../services/api";

import { isBackendConfigured } from "../services/supabase";

const tabs = [
  ["início", "home-outline", "Início"],
  ["países", "globe-outline", "Países"],
  ["projetos", "briefcase-outline", "Projetos"],
  ["chat", "chatbubble-outline", "Chat"],
  ["perfil", "person-outline", "Perfil"],
];

const emptyProfile = {
  name: "",
  kind: "Planejando a mudança",
  avatarUrl: "",
  residenceCountry: "",
  location: "",
  destination: "",
  languages: "Português",
  bio: "",
};

const countryIds = {
  PT: "portugal",
  US: "usa",
  PY: "paraguay",
  GB: "uk",
  JP: "japan",
};

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
  const [savedChats, setSavedChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatSearch, setChatSearch] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);

  const [profile, setProfileState] = useState({
    ...emptyProfile,
  });

  const [busy, setBusy] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!isBackendConfigured) return;

    authApi
      .session()
      .then(async (session) => {
        if (!session) return;

        const user = await profileApi.getMine();

        if (user) {
          await enterApp(user);
        }
      })
      .catch((e) => Alert.alert("Sessão", e.message));
  }, []);

  const finishSplash = useCallback(() => {
    setAppStage((current) =>
      current === "splash" ? "login" : current
    );
  }, []);

  useEffect(() => {
    const handler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (appStage === "register") {
          setAppStage("login");
          return true;
        }

        if (appStage !== "app") return false;

        if (screen === "início" || screen === "homeEmpresa") {
          return false;
        }

        if (
          screen === "novoProjeto" ||
          screen === "perfilEmpresa"
        ) {
          setScreen("homeEmpresa");
          return true;
        }

        if (screen === "conversa") {
          setScreen("chat");
          return true;
        }

        setScreen(screen === "destino" ? "países" : "início");
        return true;
      }
    );

    return () => handler.remove();
  }, [appStage, screen]);

  // ==========================================
  // CARREGAR DADOS DO USUÁRIO
  // ==========================================

  async function enterApp(user) {
    setUserId(user.id || null);

    setProfileState({
      ...emptyProfile,
      ...user,
      name: user.name || "",
      kind: user.kind || emptyProfile.kind,
      avatarUrl: user.avatarUrl || "",
      residenceCountry: user.residenceCountry || "",
      companyName: user.companyName || "",
      companyCountry: user.companyCountry || "",
      originCountry: user.originCountry || "",
      companyId: user.companyId || "",
      industry: user.industry || "",
      website: user.website || "",
      companyBio: user.companyBio || "",
      location: user.location || "",
      destination: user.destination || "",
      languages: user.languages || "Português",
      bio: user.bio || "",
    });

    if (isBackendConfigured) {
      try {
        const projects = await projectsApi.list({
          mine: false,
        });

        setCompanyProjects(projects);
      } catch (e) {
        Alert.alert("Projetos", e.message);
      }

      try {
        const items = await favoritesApi.list();
        setFavorites(items);
      } catch (e) {
        Alert.alert("Favoritos", e.message);
      }

      try {
        const directory = await residentsApi.list();
        setSavedResidents(directory);
      } catch (e) {
        Alert.alert("Residentes", e.message);
      }

      await loadChats();
    }

    setScreen(
      user.kind === "Empresa" ? "homeEmpresa" : "início"
    );
    setAppStage("app");
  }

  // ==========================================
  // NAVEGAÇÃO
  // ==========================================

  function navigate(target) {
    setScreen(target);

    if (target === "chat") {
      setResident(null);
      setFilter(null);
      setChatSearch("");
      loadChats();
    }
  }

  function openCountry(item) {
    setCountry(item);
    setScreen("destino");
  }

  async function findResidents(id = null) {
    setFilter(id);
    setScreen("residentes");

    if (!isBackendConfigured) return;

    try {
      const directory = await residentsApi.list();
      setSavedResidents(directory);
    } catch (e) {
      Alert.alert("Residentes", e.message);
    }
  }

  // ==========================================
  // CONVERSAS
  // ==========================================

  async function loadChats() {
    if (!isBackendConfigured) return;

    setLoadingChats(true);

    try {
      const chats = await chatsApi.list();

      const updatedChats = await Promise.all(
        chats.map(async (chat) => {
          const other = await chatsApi.otherMember(chat.id);

          return {
            ...chat,
            displayTitle:
              other?.name || chat.title || "Conversa",
            avatarUrl: other?.avatarUrl || "",
            residenceCountry:
              other?.residenceCountry || "",
            city: other?.location || "",
          };
        })
      );

      setSavedChats(updatedChats);
    } catch (e) {
      Alert.alert("Conversas", e.message);
    } finally {
      setLoadingChats(false);
    }
  }

  async function loadChatMessages(chatId) {
    const messages = await chatsApi.messages(chatId);

    setChatMessages(
      messages.map((message) => ({
        id: message.id,
        mine:
          String(message.sender_id) === String(userId),
        text: message.body,
        createdAt: message.created_at,
      }))
    );
  }

  async function openChat(person) {
    try {
      if (!isBackendConfigured) {
        setActiveChat(null);
        setResident(person);

        setConversations((old) => ({
          ...old,
          [person.id]: old[person.id] || [
            {
              id: "intro",
              mine: false,
              text:
                `Olá! Sou ${person.name}. ` +
                "Esta é uma conversa de demonstração.",
            },
          ],
        }));

        setScreen("conversa");
        return;
      }

      const chat = await chatsApi.openDirect(
        person.id,
        person.name
      );

      const other = await chatsApi.otherMember(chat.id);

      setActiveChat(chat);
      setChatMessages([]);

      setResident({
        ...person,
        id: other?.id || person.id,
        name: other?.name || person.name,
        city: other
          ? other.location || ""
          : person.city || "",
        avatarUrl: other
          ? other.avatarUrl || ""
          : person.avatarUrl || "",
        residenceCountry: other
          ? other.residenceCountry || ""
          : person.residenceCountry || "",
      });

      await loadChatMessages(chat.id);

      setScreen("conversa");
      loadChats();
    } catch (e) {
      Alert.alert(
        "Não foi possível abrir a conversa",
        e.message
      );
    }
  }

  async function openSavedChat(chat) {
    try {
      const other = await chatsApi.otherMember(chat.id);

      setActiveChat(chat);
      setChatMessages([]);

      setResident({
        id: other?.id || chat.id,
        name: other?.name || chat.title || "Conversa",
        city: other?.location || "",
        destination: other?.destination || "",
        avatarUrl: other?.avatarUrl || "",
        residenceCountry:
          other?.residenceCountry || "",
        countryId:
          countryIds[other?.residenceCountry] || null,
      });

      await loadChatMessages(chat.id);
      setScreen("conversa");
    } catch (e) {
      Alert.alert("Conversas", e.message);
    }
  }

  async function sendMessage(text) {
    const body = text.trim();

    if (!body) return;

    if (!isBackendConfigured) {
      if (!resident?.id) {
        throw new Error(
          "Não foi possível identificar esta conversa."
        );
      }

      const now = Date.now();

      setConversations((old) => ({
        ...old,
        [resident.id]: [
          ...(old[resident.id] || []),
          {
            id: `${now}-${Math.random()}`,
            mine: true,
            text: body,
            createdAt: new Date(now).toISOString(),
          },
        ],
      }));

      return;
    }

    if (!activeChat?.id) {
      throw new Error(
        "Não foi possível identificar esta conversa."
      );
    }

    // O erro segue para ChatScreen, que mantém o texto
    // no campo e permite tentar o envio novamente.
    const saved = await chatsApi.send(
      activeChat.id,
      body
    );

    setChatMessages((old) => [
      ...old,
      {
        id: saved.id,
        mine:
          String(saved.sender_id) === String(userId),
        text: saved.body,
        createdAt: saved.created_at,
      },
    ]);
  }

  // ==========================================
  // FAVORITOS
  // ==========================================

  async function toggleFavorite(id) {
    try {
      if (isBackendConfigured) {
        const added = await favoritesApi.toggle(id);

        setFavorites((old) =>
          added
            ? [...old, String(id)]
            : old.filter(
                (item) => String(item) !== String(id)
              )
        );
      } else {
        setFavorites((old) =>
          old.includes(id)
            ? old.filter((item) => item !== id)
            : [...old, id]
        );
      }
    } catch (e) {
      Alert.alert("Favoritos", e.message);
    }
  }

  // ==========================================
  // AUTENTICAÇÃO E PERFIL
  // ==========================================

  async function login(credentials) {
    if (busy) return;

    setBusy(true);

    try {
      const user = await authApi.signIn(
        credentials.email,
        credentials.password
      );

      await enterApp(user);
    } catch (e) {
      Alert.alert("Não foi possível entrar", e.message);
    } finally {
      setBusy(false);
    }
  }

  async function register(values) {
    if (busy) return;

    setBusy(true);

    try {
      const user = await authApi.signUp(values);
      const session = await authApi.session();

      if (!user.id || !session) {
        Alert.alert(
          "Confirme seu e-mail",
          "A conta foi criada. Confirme o e-mail antes de entrar."
        );

        setAppStage("login");
        return;
      }

      await enterApp(user);
    } catch (e) {
      Alert.alert(
        "Não foi possível criar a conta",
        e.message
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateProfile(next) {
    if (!isBackendConfigured) {
      setProfileState(next);
      return;
    }

    if (!userId) {
      throw new Error(
        "Entre na sua conta para salvar o perfil."
      );
    }

    // Atualiza a tela somente depois de salvar no banco.
    const saved = await profileApi.update(next);

    setProfileState((old) => ({
      ...old,
      ...saved,
    }));

    setSavedResidents((old) =>
      old.map((person) =>
        person.id === saved.id
          ? {
              ...person,
              name: saved.name,
              avatarUrl: saved.avatarUrl,
              residenceCountry: saved.residenceCountry,
              city: saved.location,
              languages: saved.languages,
              bio: saved.bio,
              destination: saved.destination,
              countryId:
                countryIds[saved.residenceCountry] || null,
            }
          : person
      )
    );
  }

  async function updateCompanyProfile(next) {
    try {
      await updateProfile(next);
    } catch (e) {
      Alert.alert(
        "Perfil não salvo",
        e.message
      );

      throw e;
    }
  }

  async function logout() {
    try {
      if (isBackendConfigured) {
        await authApi.signOut();
      }
    } catch (e) {
      Alert.alert("Sessão", e.message);
      return;
    }

    setUserId(null);
    setProfileState({ ...emptyProfile });
    setAppStage("login");
    setScreen("início");

    setFavorites([]);
    setCompanyProjects([]);
    setSavedResidents([]);
    setConversations({});
    setSavedChats([]);
    setActiveChat(null);
    setChatMessages([]);
    setChatSearch("");
    setCountry(null);
    setResident(null);
    setFilter(null);
  }

  // ==========================================
  // TELAS DE AUTENTICAÇÃO
  // ==========================================

  if (appStage === "splash") {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={finishSplash} />
      </>
    );
  }

  if (appStage === "login") {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen
          onLogin={login}
          onGoToRegister={() => setAppStage("register")}
        />
      </>
    );
  }

  if (appStage === "register") {
    return (
      <>
        <StatusBar style="dark" />
        <RegisterScreen
          onRegister={register}
          onGoToLogin={() => setAppStage("login")}
        />
      </>
    );
  }

  // ==========================================
  // CONTEÚDO PRINCIPAL
  // ==========================================

  const active = ["residentes", "conversa"].includes(screen)
    ? "chat"
    : screen === "destino"
      ? "países"
      : screen;

  const isCompany = [
    "homeEmpresa",
    "novoProjeto",
    "perfilEmpresa",
  ].includes(screen);

  const filteredChats = savedChats.filter((chat) =>
    (chat.displayTitle || chat.title || "")
      .toLocaleLowerCase("pt-BR")
      .includes(chatSearch.toLocaleLowerCase("pt-BR"))
  );

  let content;

  if (screen === "homeEmpresa") {
    content = (
      <HomeEmpresaScreen
        companyName={profile.companyName || profile.name}
        projects={companyProjects.filter(
          (project) => project.owner_id === userId
        )}
        onAddProject={() => setScreen("novoProjeto")}
        onEditProfile={() => setScreen("perfilEmpresa")}
        onLogout={logout}
      />
    );
  } else if (screen === "perfilEmpresa") {
    content = (
      <CompanyProfileScreen
        profile={profile}
        setProfile={updateCompanyProfile}
        onBack={() => setScreen("homeEmpresa")}
      />
    );
  } else if (screen === "novoProjeto") {
    content = (
      <AddEmpresaProjetoScreen
        companyName={profile.companyName || profile.name}
        onCancel={() => setScreen("homeEmpresa")}
        onSave={async (project) => {
          try {
            const saved = isBackendConfigured
              ? await projectsApi.create(project)
              : project;

            setCompanyProjects((old) => [saved, ...old]);
            setScreen("homeEmpresa");
          } catch (e) {
            Alert.alert(
              "Projeto não publicado",
              e.message
            );
          }
        }}
      />
    );
  } else if (screen === "início") {
    content = (
      <HomeScreen
        navigate={navigate}
        openCountry={openCountry}
      />
    );
  } else if (screen === "países") {
    content = (
      <CountriesScreen openCountry={openCountry} />
    );
  } else if (screen === "destino") {
    content = (
      <CountryScreen
        key={country?.id}
        country={country}
        back={() => navigate("países")}
        findResidents={findResidents}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    );
  } else if (screen === "projetos") {
    content = (
      <ProjectsScreen
        projects={companyProjects}
        onApply={async (id) => {
          try {
            await projectsApi.apply(id);

            Alert.alert(
              "Inscrição realizada",
              "Sua inscrição foi registrada."
            );
          } catch (e) {
            Alert.alert("Inscrição", e.message);
          }
        }}
      />
    );
  } else if (screen === "conversa") {
    content = (
      <ChatScreen
        key={activeChat?.id || resident?.id}
        resident={resident}
        messages={
          isBackendConfigured
            ? chatMessages
            : conversations[resident?.id] || []
        }
        send={(_, text) => sendMessage(text)}
        back={() => navigate("chat")}
      />
    );
  } else if (screen === "perfil") {
    content = (
      <ProfileScreen
        profile={profile}
        setProfile={updateProfile}
        favorites={favorites}
        openCountry={openCountry}
        navigate={navigate}
        onLogout={logout}
      />
    );
  } else if (screen === "chat") {
    content = (
      <View
        style={{
          flex: 1,
          backgroundColor: "#F5F8FF",
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <View>
            <Text
              style={{
                color: "#73809A",
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 2,
              }}
            >
              SUA COMUNIDADE
            </Text>

            <Text
              style={{
                color: "#102653",
                fontSize: 28,
                fontWeight: "800",
                marginTop: 6,
              }}
            >
              Conversas
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Abrir meu perfil"
            onPress={() => navigate("perfil")}
          >
            <Avatar
              uri={profile.avatarUrl}
              name={profile.name}
              size={48}
            />
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "white",
            borderRadius: 15,
            paddingHorizontal: 14,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#E1E8F3",
          }}
        >
          <Icon name="search-outline" size={20} />

          <TextInput
            accessibilityLabel="Buscar conversas"
            placeholder="Buscar uma conversa..."
            placeholderTextColor="#8794AA"
            value={chatSearch}
            onChangeText={setChatSearch}
            style={{
              flex: 1,
              paddingVertical: 14,
              color: "#102653",
              fontSize: 15,
            }}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => findResidents()}
          style={{
            backgroundColor: "#1754D1",
            padding: 18,
            borderRadius: 17,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Icon
            name="people-outline"
            color="white"
            size={26}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: 15,
              }}
            >
              Encontre novas conexões
            </Text>

            <Text
              style={{
                color: "#D6E3FF",
                fontSize: 12,
                marginTop: 5,
              }}
            >
              Converse com brasileiros pelo mundo
            </Text>
          </View>

          <Icon
            name="arrow-forward"
            color="white"
            size={21}
          />
        </Pressable>

        <Text
          style={{
            color: "#102653",
            fontSize: 16,
            fontWeight: "700",
            marginBottom: 15,
          }}
        >
          Suas conversas · {savedChats.length}
        </Text>

        {loadingChats && (
          <Text
            style={{
              color: "#73809A",
              marginBottom: 12,
            }}
          >
            Atualizando conversas...
          </Text>
        )}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {!filteredChats.length ? (
            <View
              style={{
                backgroundColor: "white",
                padding: 28,
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <Icon
                name="chatbubbles-outline"
                size={40}
              />

              <Text
                style={{
                  color: "#102653",
                  fontSize: 17,
                  fontWeight: "700",
                  marginTop: 16,
                  textAlign: "center",
                }}
              >
                {chatSearch
                  ? "Nenhuma conversa encontrada"
                  : "Sua próxima conexão está aqui"}
              </Text>

              <Text
                style={{
                  color: "#73809A",
                  lineHeight: 22,
                  textAlign: "center",
                  marginTop: 10,
                }}
              >
                {chatSearch
                  ? "Tente buscar por outro nome."
                  : "Encontre um residente para começar uma conversa."}
              </Text>
            </View>
          ) : (
            filteredChats.map((chat) => (
              <Pressable
                key={chat.id}
                accessibilityRole="button"
                onPress={() => openSavedChat(chat)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: "white",
                  padding: 16,
                  borderRadius: 18,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#E5EBF5",
                }}
              >
                <Avatar
                  uri={chat.avatarUrl}
                  name={chat.displayTitle || chat.title || ""}
                  size={52}
                />

                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <Text
                      style={{
                        color: "#102653",
                        fontSize: 16,
                        fontWeight: "700",
                        flexShrink: 1,
                      }}
                    >
                      {chat.displayTitle ||
                        chat.title ||
                        "Conversa"}
                    </Text>

                    <Flag
                      code={chat.residenceCountry}
                      size={19}
                    />
                  </View>

                  {!!chat.residenceCountry && (
                    <Text
                      style={{
                        color: "#73809A",
                        fontSize: 12,
                        marginTop: 5,
                      }}
                    >
                      {[
                        chat.city,
                        countryName(chat.residenceCountry),
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </Text>
                  )}

                  <Text
                    style={{
                      color: "#73809A",
                      fontSize: 12,
                      marginTop: 5,
                    }}
                  >
                    Toque para continuar a conversa
                  </Text>
                </View>

                <Icon
                  name="chevron-forward"
                  size={18}
                />
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    );
  } else {
    content = (
      <ResidentsScreen
        filter={filter}
        clearFilter={() => setFilter(null)}
        openChat={openChat}
        residents={savedResidents}
      />
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}
    >
      <StatusBar style="dark" />

      <View style={{ flex: 1 }}>
        {content}
      </View>

      {!isCompany && (
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderColor: "#DFE6F2",
            backgroundColor: "white",
            paddingVertical: 10,
          }}
        >
          {tabs.map(([id, icon, label]) => (
            <Pressable
              key={id}
              accessibilityRole="tab"
              accessibilityState={{
                selected: active === id,
              }}
              accessibilityLabel={label}
              onPress={() => navigate(id)}
              style={{
                flex: 1,
                alignItems: "center",
                minHeight: 44,
                justifyContent: "center",
              }}
            >
              {id === "perfil" && profile.avatarUrl ? (
                <Avatar
                  uri={profile.avatarUrl}
                  name={profile.name}
                  size={26}
                />
              ) : (
                <Icon
                  name={icon}
                  color={
                    active === id
                      ? "#1754D1"
                      : "#65738C"
                  }
                />
              )}

              <Text
                style={{
                  fontSize: 11,
                  marginTop: 4,
                  color:
                    active === id
                      ? "#1754D1"
                      : "#65738C",
                  fontWeight:
                    active === id ? "700" : "400",
                }}
              >
                {label}
              </Text>

              {active === id && (
                <View
                  style={{
                    height: 3,
                    width: 25,
                    borderRadius: 3,
                    backgroundColor: "#1754D1",
                    marginTop: 5,
                  }}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}