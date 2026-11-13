import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "../components/UI";
import {
  Avatar,
  Flag,
  countryName,
  residenceCountries,
  ui,
} from "../components/ProfileUI";

export default function ProfileScreen({
  profile,
  setProfile,
  onLogout,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...profile });
  const [saving, setSaving] = useState(false);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [choosingCountry, setChoosingCountry] = useState(false);

  const current = editing ? draft : profile;

  const visibleCountries = residenceCountries.filter((item) =>
    item.name
      .toLocaleLowerCase("pt-BR")
      .includes(countrySearch.toLocaleLowerCase("pt-BR"))
  );

  function startEditing() {
    setDraft({ ...profile });
    setError("");
    setCountrySearch("");
    setChoosingCountry(false);
    setEditing(true);
  }

  function change(field, value) {
    setDraft((old) => ({
      ...old,
      [field]: value,
    }));
  }

  async function choosePhoto() {
    if (picking || saving) return;

    setPicking(true);
    setError("");

    try {
      if (Platform.OS !== "web") {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          setError(
            "Permita o acesso às fotos nas configurações do aparelho."
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.45,
        base64: true,
      });

      if (result.canceled) return;

      const asset = result.assets[0];

      if (!asset?.base64 || asset.base64.length > 2800000) {
        setError("Escolha uma foto menor, de até 2 MB.");
        return;
      }

      change(
        "avatarUrl",
        `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`
      );
    } catch {
      setError("Não foi possível abrir a foto. Tente novamente.");
    } finally {
      setPicking(false);
    }
  }

  async function save() {
    if (!draft.name?.trim()) {
      setError("Informe seu nome.");
      return;
    }

    if (
      draft.residenceCountry &&
      !residenceCountries.some(
        (item) => item.code === draft.residenceCountry
      )
    ) {
      setError("Selecione um país válido.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await setProfile({
        ...draft,
        name: draft.name.trim(),
        location: (draft.location || "").trim(),
      });

      setEditing(false);
      setChoosingCountry(false);
    } catch {
      setError(
        "Não foi possível salvar. Suas alterações continuam aqui para tentar novamente."
      );
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setDraft({ ...profile });
    setError("");
    setChoosingCountry(false);
    setEditing(false);
  }

  const details = [
    [
      "location-outline",
      "País onde moro",
      countryName(profile.residenceCountry) || "Não informado",
    ],
    [
      "business-outline",
      "Cidade",
      profile.location || "Não informada",
    ],
    [
      "language-outline",
      "Idiomas",
      profile.languages || "Não informados",
    ],
    [
      "airplane-outline",
      "País de interesse",
      profile.destination || "Não informado",
    ],
  ];

  return (
    <KeyboardAvoidingView
      style={ui.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={ui.page}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={ui.brand}>MUNDO A FORA</Text>
        <Text style={ui.title}>Meu perfil</Text>

        <View style={ui.cover}>
          <Image
            source={require("../../assets/portugal.jpg")}
            style={ui.coverImage}
            resizeMode="cover"
          />

          <View style={ui.coverOverlay} />

          <View
            style={{
              position: "absolute",
              top: 20,
              left: 24,
            }}
          >
            <Icon name="airplane" color="white" size={30} />
          </View>
        </View>

        <View style={ui.identity}>
          <View style={ui.photoRing}>
            <Avatar
              uri={current.avatarUrl}
              name={current.name}
              size={126}
            />
          </View>

          <Text style={ui.name}>
            {current.name || "Seu nome"}
          </Text>

          <Text style={[ui.muted, { marginTop: 4 }]}>
            {profile.kind}
          </Text>

          <View style={ui.location}>
            <Flag code={current.residenceCountry} />

            <Text style={ui.locationText}>
              {[
                current.location,
                countryName(current.residenceCountry),
              ]
                .filter(Boolean)
                .join(", ") || "Localização não informada"}
            </Text>
          </View>

          {!editing ? (
            <Pressable
              accessibilityRole="button"
              onPress={startEditing}
              style={[
                ui.primary,
                {
                  alignSelf: "stretch",
                  marginTop: 20,
                },
              ]}
            >
              <Icon
                name="create-outline"
                color="white"
                size={21}
              />

              <Text style={ui.primaryText}>
                Editar perfil
              </Text>
            </Pressable>
          ) : (
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                marginTop: 15,
                alignItems: "center",
              }}
            >
              <Pressable
                disabled={saving || picking}
                onPress={choosePhoto}
                style={ui.centeredButton}
              >
                <Text style={ui.link}>
                  {picking ? "Abrindo..." : "Alterar foto"}
                </Text>
              </Pressable>

              {!!draft.avatarUrl && (
                <Pressable
                  disabled={saving || picking}
                  onPress={() => change("avatarUrl", "")}
                  style={ui.centeredButton}
                >
                  <Text style={ui.muted}>
                    Remover foto
                  </Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        {editing ? (
          <View style={ui.card}>
            <Text style={ui.section}>
              Editar perfil
            </Text>

            <Text style={ui.label}>Nome</Text>

            <TextInput
              accessibilityLabel="Nome"
              style={ui.input}
              editable={!saving}
              value={draft.name || ""}
              onChangeText={(value) => change("name", value)}
              maxLength={120}
            />

            <Text style={ui.label}>
              País onde moro
            </Text>

            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={() =>
                setChoosingCountry((old) => !old)
              }
              style={[
                ui.input,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                },
              ]}
            >
              <Flag
                code={draft.residenceCountry}
                size={20}
              />

              <Text
                style={{
                  flex: 1,
                  color: "#102653",
                }}
              >
                {countryName(draft.residenceCountry) ||
                  "Selecione seu país"}
              </Text>

              <Icon name="chevron-down" size={18} />
            </Pressable>

            {choosingCountry && (
              <View style={{ marginTop: 10 }}>
                <TextInput
                  accessibilityLabel="Buscar país"
                  placeholder="Buscar país..."
                  style={ui.input}
                  value={countrySearch}
                  onChangeText={setCountrySearch}
                />

                <ScrollView
                  style={{ maxHeight: 210 }}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {visibleCountries.map((item) => (
                    <Pressable
                      key={item.code}
                      onPress={() => {
                        change("residenceCountry", item.code);
                        setChoosingCountry(false);
                        setCountrySearch("");
                      }}
                      style={ui.detail}
                    >
                      <Flag code={item.code} size={20} />

                      <Text style={ui.body}>
                        {item.name}
                      </Text>
                    </Pressable>
                  ))}

                  {!visibleCountries.length && (
                    <Text style={ui.body}>
                      Nenhum país encontrado.
                    </Text>
                  )}
                </ScrollView>
              </View>
            )}

            {[
              ["Cidade", "location", "Ex.: Lisboa"],
              [
                "País de interesse",
                "destination",
                "Ex.: Portugal",
              ],
              [
                "Idiomas",
                "languages",
                "Ex.: Português e inglês",
              ],
              [
                "Sobre mim",
                "bio",
                "Conte um pouco sobre você...",
              ],
            ].map(([label, key, placeholder]) => (
              <View key={key}>
                <Text style={ui.label}>{label}</Text>

                <TextInput
                  accessibilityLabel={label}
                  editable={!saving}
                  style={[
                    ui.input,
                    key === "bio" && {
                      minHeight: 110,
                      textAlignVertical: "top",
                    },
                  ]}
                  placeholder={placeholder}
                  placeholderTextColor="#8A97AD"
                  multiline={key === "bio"}
                  maxLength={key === "bio" ? 600 : 120}
                  value={draft[key] || ""}
                  onChangeText={(value) =>
                    change(key, value)
                  }
                />
              </View>
            ))}

            {!!error && (
              <Text
                accessibilityRole="alert"
                style={ui.error}
              >
                {error}
              </Text>
            )}

            <Pressable
              disabled={saving || picking}
              onPress={save}
              style={[
                ui.primary,
                {
                  marginTop: 20,
                  opacity: saving || picking ? 0.5 : 1,
                },
              ]}
            >
              <Text style={ui.primaryText}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </Text>
            </Pressable>

            <Pressable
              disabled={saving || picking}
              onPress={cancel}
              style={ui.centeredButton}
            >
              <Text style={ui.link}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={ui.card}>
              <Text style={ui.section}>
                Sobre mim
              </Text>

              <Text style={ui.body}>
                {profile.bio ||
                  "Conte sua história e compartilhe suas experiências."}
              </Text>
            </View>

            <View style={ui.card}>
              <Text style={ui.section}>
                Minha conexão com o mundo
              </Text>

              {details.map(([icon, label, value]) => (
                <View key={label} style={ui.detail}>
                  <Icon
                    name={icon}
                    size={21}
                    color="#243C66"
                  />

                  <Text style={ui.detailLabel}>
                    {label}
                  </Text>

                  <Text style={ui.detailValue}>
                    {value}
                  </Text>

                  {label === "País onde moro" && (
                    <Flag
                      code={profile.residenceCountry}
                      size={20}
                    />
                  )}
                </View>
              ))}
            </View>

            <Pressable
              onPress={onLogout}
              style={[
                ui.centeredButton,
                { marginTop: 12 },
              ]}
            >
              <Text
                style={{
                  color: "#B23C4B",
                  fontWeight: "600",
                }}
              >
                Sair da conta
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}