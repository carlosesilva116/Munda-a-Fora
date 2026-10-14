import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { countries } from "../data/countries";
import { s, colors } from "../styles/theme";
import { Icon } from "../components/UI";
export default function ChatScreen({ resident, messages, send, back }) {
  const [draft, setDraft] = useState("");
  const scroll = useRef(null);
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
      <View style={[s.card, s.row, { margin: 16 }]}>
        <Pressable onPress={back} accessibilityLabel="Ver residentes">
          <Icon name="arrow-back" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>
            {resident.name} •{" "}
            {countries.find((c) => c.id === resident.countryId).name}
          </Text>
          <Text style={s.text}>Residente em {resident.city}</Text>
        </View>
        <Icon name="person-circle" size={40} />
      </View>
      
      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((m) => (
          <View
            key={m.id}
            style={{
              alignSelf: m.mine ? "flex-end" : "flex-start",
              backgroundColor: m.mine ? colors.pale : "white",
              borderRadius: 18,
              padding: 14,
              maxWidth: "86%",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: colors.navy, fontSize: 16, lineHeight: 23 }}>
              {m.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={[s.row, { padding: 14 }]}>
        <TextInput
          style={[s.input, { flex: 1, marginBottom: 0, maxHeight: 100 }]}
          placeholder="Escreva uma mensagem..."
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
            padding: 14,
            borderRadius: 28,
          }}
        >
          <Icon name="send" color="white" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
