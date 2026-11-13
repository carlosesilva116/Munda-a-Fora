import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Icon } from "../components/UI";
import {
  Avatar,
  Flag,
  countryName,
} from "../components/ProfileUI";

function messageTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatScreen({
  resident,
  messages = [],
  send,
  back,
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const scroll = useRef(null);

  const currentCountry = countryName(resident?.residenceCountry);
  const city = resident?.city || resident?.location;

  async function submit() {
    if (!draft.trim() || sending) return;

    setSending(true);
    setError("");

    try {
      await send(resident.id, draft.trim());
      setDraft("");
    } catch {
      setError(
        "Mensagem não enviada. Toque em enviar para tentar novamente."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={st.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={st.header}>
        <Pressable
          onPress={back}
          accessibilityRole="button"
          accessibilityLabel="Voltar para conversas"
          style={st.back}
        >
          <Icon name="arrow-back" color="#102653" />
        </Pressable>

        <Avatar
          uri={resident?.avatarUrl}
          name={resident?.name || ""}
          size={55}
        />

        <View style={{ flex: 1 }}>
          <View style={st.nameRow}>
            <Text style={st.name}>
              {resident?.name || "Conversa"}
              {currentCountry ? ` · ${currentCountry}` : ""}
            </Text>

            <Flag
              code={resident?.residenceCountry}
              size={21}
            />
          </View>

          <Text style={st.subtitle}>
            {city
              ? `Residente em ${city}`
              : "Cidade não informada"}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scroll}
        style={{ flex: 1 }}
        contentContainerStyle={st.messages}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          scroll.current?.scrollToEnd({ animated: true })
        }
      >
        <View style={st.divider}>
          <View style={st.line} />

          <Text style={st.dividerText}>
            MUNDO A FORA
          </Text>

          <View style={st.line} />
        </View>

        {!messages.length && (
          <View style={st.empty}>
            <Icon
              name="chatbubbles-outline"
              size={42}
            />

            <Text style={st.emptyTitle}>
              Uma conversa pode abrir caminhos
            </Text>

            <Text style={st.emptyText}>
              Apresente-se e compartilhe suas dúvidas.
            </Text>
          </View>
        )}

        {messages.map((message) => {
          const time = messageTime(message.createdAt);

          return (
            <View
              key={message.id}
              style={[
                st.messageRow,
                message.mine && st.myMessageRow,
              ]}
            >
              {!message.mine && (
                <Avatar
                  uri={resident?.avatarUrl}
                  name={resident?.name || ""}
                  size={32}
                />
              )}

              <View
                style={[
                  st.bubble,
                  message.mine
                    ? st.myBubble
                    : st.theirBubble,
                ]}
              >
                <Text
                  style={[
                    st.messageText,
                    message.mine && {
                      color: "white",
                    },
                  ]}
                >
                  {message.text}
                </Text>

                {!!time && (
                  <Text
                    style={[
                      st.time,
                      message.mine && {
                        color: "#D5E3FF",
                      },
                    ]}
                  >
                    {time}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {!!error && (
        <Text
          accessibilityRole="alert"
          style={st.error}
        >
          {error}
        </Text>
      )}

      <View style={st.composer}>
        <TextInput
          accessibilityLabel="Mensagem"
          style={st.input}
          placeholder="Escreva uma mensagem..."
          placeholderTextColor="#8794AA"
          multiline
          maxLength={5000}
          editable={!sending}
          value={draft}
          onChangeText={setDraft}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Enviar mensagem"
          disabled={!draft.trim() || sending}
          onPress={submit}
          style={[
            st.send,
            (!draft.trim() || sending) && {
              opacity: 0.45,
            },
          ]}
        >
          <Icon
            name={
              sending
                ? "ellipsis-horizontal"
                : "send"
            }
            color="white"
            size={23}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F8FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  back: {
    padding: 8,
    minHeight: 44,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  name: {
    color: "#102653",
    fontSize: 17,
    fontWeight: "800",
    flexShrink: 1,
  },
  subtitle: {
    color: "#697993",
    fontSize: 13,
    marginTop: 5,
  },
  messages: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginTop: 12,
    marginBottom: 36,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D8E1F0",
  },
  dividerText: {
    color: "#71809B",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 22,
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "81%",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: "#1754D1",
    borderBottomRightRadius: 5,
  },
  theirBubble: {
    backgroundColor: "#E9EDF5",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    color: "#14294F",
    fontSize: 16,
    lineHeight: 24,
  },
  time: {
    color: "#7B88A0",
    fontSize: 11,
    textAlign: "right",
    marginTop: 5,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    padding: 14,
    backgroundColor: "white",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#DBE3F0",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D8E0EE",
    borderRadius: 26,
    paddingHorizontal: 17,
    paddingVertical: 13,
    minHeight: 49,
    maxHeight: 130,
    color: "#14294F",
    fontSize: 15,
    backgroundColor: "#FAFBFE",
  },
  send: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1754D1",
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#B42318",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  empty: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyTitle: {
    textAlign: "center",
    color: "#102653",
    fontWeight: "700",
    fontSize: 17,
    marginTop: 18,
  },
  emptyText: {
    color: "#73809A",
    textAlign: "center",
    marginTop: 10,
  },
});