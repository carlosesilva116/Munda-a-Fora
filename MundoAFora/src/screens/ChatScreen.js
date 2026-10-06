import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { countries } from "../data/countries";
import { colors, s } from "../styles/theme";
import { Icon, Flag } from "../components/UI";
export default function ChatScreen({ resident, messages, send, back }) {
  const [draft, setDraft] = useState("");
  const scroll = useRef(null),
    country = countries.find((c) => c.id === resident.countryId);
  function submit() {
    if (draft.trim()) {
      send(resident.id, draft.trim());
      setDraft("");
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        ref={scroll}
        contentContainerStyle={{ padding: 18 }}
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: true })
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={[s.row, { justifyContent: "space-between" }]}>
          <Pressable onPress={back} accessibilityLabel="Ver residentes">
            <Icon name="arrow-back" color={colors.navy} />
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Conversa ilustrativa",
                "As mensagens são locais e os perfis são fictícios.",
              )
            }
            accessibilityLabel="Informações da conversa"
          >
            <Icon name="ellipsis-vertical" color={colors.navy} />
          </Pressable>
        </View>
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <View
            style={{
              width: 105,
              height: 105,
              borderRadius: 60,
              backgroundColor: colors.pale,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 9,
            }}
          >
            <Icon name="person" size={65} />
            <View
              style={{
                position: "absolute",
                right: 5,
                bottom: 4,
                width: 20,
                height: 20,
                borderRadius: 12,
                backgroundColor: colors.blue,
                borderWidth: 3,
                borderColor: "white",
              }}
            />
          </View>
          <Text style={[s.label, { fontSize: 21 }]}>
            {resident.name} • {country.name}
          </Text>
          <Text style={s.text}>Residente em {resident.city}</Text>
          <Text style={{ color: "#9AA9C6", fontSize: 13, marginTop: 4 }}>
            Perfil ilustrativo
          </Text>
          <View
            style={[
              s.row,
              {
                backgroundColor: "#F1F4FA",
                borderRadius: 24,
                paddingHorizontal: 15,
                paddingVertical: 7,
                marginTop: 13,
                gap: 9,
              },
            ]}
          >
            <Flag country={country} />
            <Text style={{ color: colors.text, fontSize: 13 }}>
              Quero morar em {country.name}
            </Text>
          </View>
        </View>
        {messages.map((m, i) => (
          <View
            key={m.id}
            style={{
              alignSelf: m.mine ? "flex-end" : "flex-start",
              backgroundColor: m.mine ? colors.pale : "#F1F4FA",
              borderRadius: 18,
              borderBottomRightRadius: m.mine ? 3 : 18,
              borderBottomLeftRadius: m.mine ? 18 : 3,
              padding: 13,
              maxWidth: "85%",
              marginBottom: 15,
            }}
          >
            <Text style={{ color: colors.navy, fontSize: 16, lineHeight: 22 }}>
              {m.text}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 4,
                marginTop: 3,
              }}
            >
              <Text style={{ fontSize: 11, color: "#91A2C5" }}>
                {m.time || `09:${12 + i * 2}`}
              </Text>
              {m.mine && <Icon name="checkmark-done" size={16} />}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={[s.row, { padding: 12, gap: 8 }]}>
        <Pressable
          accessibilityLabel="Anexar arquivo"
          onPress={() =>
            Alert.alert(
              "Anexos",
              "O envio de arquivos ainda não está disponível neste protótipo.",
            )
          }
        >
          <Icon name="attach" color={colors.navy} />
        </Pressable>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: colors.line,
            borderRadius: 24,
            padding: 12,
            maxHeight: 100,
            color: colors.navy,
            backgroundColor: "#F8FAFD",
          }}
          placeholder="Escreva uma mensagem..."
          placeholderTextColor={colors.text}
          accessibilityLabel="Mensagem"
          multiline
          value={draft}
          onChangeText={setDraft}
        />
        <Pressable
          accessibilityLabel="Enviar mensagem de demonstração"
          onPress={submit}
          style={{
            backgroundColor: colors.blue,
            padding: 13,
            borderRadius: 28,
          }}
        >
          <Icon name="send" color="white" size={22} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
