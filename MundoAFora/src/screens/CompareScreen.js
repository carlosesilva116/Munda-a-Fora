import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { countries } from "../data/countries";
import { Brand, Button, Icon, Flag } from "../components/UI";
import { s, colors } from "../styles/theme";
export default function CompareScreen({ openCountry }) {
  const [left, setLeft] = useState("portugal"),
    [right, setRight] = useState("japan"),
    [select, setSelect] = useState(null),
    [details, setDetails] = useState(false);
  const a = countries.find((c) => c.id === left),
    b = countries.find((c) => c.id === right);
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Brand />
      <Text style={[s.title, { textAlign: "center", marginTop: 10 }]}>
        Compare destinos
      </Text>
      <Text style={[s.subtitle, { textAlign: "center", fontSize: 14 }]}>
        Analise informações lado a lado e encontre o país ideal para seus
        objetivos.
      </Text>
      <View style={[s.row, { marginBottom: 10 }]}>
        {[a, b].map((c, i) => (
          <Pressable
            key={i}
            accessibilityLabel={`Selecionar ${i === 0 ? "primeiro" : "segundo"} país`}
            onPress={() => setSelect(i)}
            style={[
              s.row,
              {
                flex: 1,
                backgroundColor: "#EBF3FD",
                borderRadius: 12,
                padding: 10,
                gap: 7,
                minHeight: 58,
              },
            ]}
          >
            <Flag country={c} />
            <Text style={[s.label, { flex: 1, fontSize: 15 }]}>{c.name}</Text>
            <Icon name="chevron-down" size={19} color={colors.navy} />
          </Pressable>
        ))}
      </View>
      {[
        ["Idioma", "language", "chatbubble-outline"],
        ["Moeda", "currency", "server-outline"],
        ["Continente", "continent", "map-outline"],
      ].map(([label, key, icon]) => (
        <View key={key} style={s.row}>
          {[a, b].map((c) => (
            <View
              key={c.id}
              style={[
                s.card,
                {
                  flex: 1,
                  minHeight: 126,
                  borderWidth: 0,
                  backgroundColor: "#F1F4F8",
                  padding: 16,
                  marginBottom: 10,
                },
              ]}
            >
              <Icon name={icon} size={28} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: 12,
                  marginTop: 15,
                  marginBottom: 5,
                }}
              >
                {label}
              </Text>
              <Text style={[s.label, { fontSize: 17 }]}>{c[key]}</Text>
            </View>
          ))}
        </View>
      ))}
      <Button title="Ver detalhes" onPress={() => setDetails(true)} />
      <Modal
        visible={select !== null || details}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setSelect(null);
          setDetails(false);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,15,50,.35)",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <View style={[s.card, { padding: 20 }]}>
            <Text style={s.section}>
              {details ? "Ver detalhes de qual destino?" : "Escolha um país"}
            </Text>
            {(details ? [a, b] : countries).map((c) => (
              <Pressable
                key={c.id}
                disabled={!details && c.id === (select === 0 ? right : left)}
                onPress={() => {
                  if (details) {
                    setDetails(false);
                    openCountry(c);
                  } else {
                    (select === 0 ? setLeft : setRight)(c.id);
                    setSelect(null);
                  }
                }}
                style={[
                  s.row,
                  {
                    paddingVertical: 13,
                    opacity:
                      !details && c.id === (select === 0 ? right : left)
                        ? 0.35
                        : 1,
                  },
                ]}
              >
                <Flag country={c} />
                <Text style={s.label}>{c.name}</Text>
              </Pressable>
            ))}
            <Button
              title="Fechar"
              outline
              onPress={() => {
                setSelect(null);
                setDetails(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
