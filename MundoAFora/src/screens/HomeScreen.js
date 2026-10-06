import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
} from "react-native";
import { countries } from "../data/countries";
import { s, colors } from "../styles/theme";
import { Button, CountryCard, Icon, Search } from "../components/UI";
export default function HomeScreen({ navigate, openCountry }) {
  const [query, setQuery] = useState("");
  const portugal = countries.find((c) => c.id === "portugal");
  const japan = countries.find((c) => c.id === "japan");
  const list = countries.filter((c) =>
    c.name.toLowerCase().includes(query.trim().toLowerCase()),
  );
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View
        style={{
          backgroundColor: "#001E38",
          alignItems: "center",
          height: 210,
          padding: 12,
        }}
      >
        <Image
          source={require("../../assets/logo.png")}
          resizeMode="contain"
          style={{ width: 205, height: 195 }}
        />
      </View>
      <View
        style={[
          s.page,
          {
            marginTop: -16,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            backgroundColor: "white",
            paddingTop: 18,
          },
        ]}
      >
        <Text style={s.title}>Seu próximo destino começa aqui</Text>
        <Text
          style={[
            s.subtitle,
            { fontSize: 14, lineHeight: 19, marginBottom: 12 },
          ]}
        >
          Descubra países, compare informações e planeje sua jornada com mais
          segurança.
        </Text>
        <Search value={query} onChangeText={setQuery} />
        <Pressable
          onPress={() => navigate("residentes")}
          style={[
            s.row,
            {
              backgroundColor: colors.pale,
              borderRadius: 15,
              padding: 12,
              gap: 13,
            },
          ]}
        >
          <Icon name="people" size={55} />
          <View style={{ flex: 1 }}>
            <Text style={[s.label, { fontSize: 15 }]}>
              Converse com quem já mora lá
            </Text>
            <Text style={{ fontSize: 13, lineHeight: 17, color: colors.text }}>
              Tire suas dúvidas com residentes e tenha orientações reais.
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: colors.blue,
                marginTop: 3,
              }}
            >
              Encontrar residentes →
            </Text>
          </View>
        </Pressable>
        <View
          style={[
            s.row,
            { justifyContent: "space-between", marginVertical: 13 },
          ]}
        >
          <Text style={[s.label, { fontSize: 18 }]}>
            {query ? "Resultados" : "Destinos em destaque"}
          </Text>
          <Pressable onPress={() => navigate("países")}>
            <Text style={{ color: colors.blue, fontSize: 13 }}>
              Ver todos ›
            </Text>
          </Pressable>
        </View>
        {query ? (
          list.map((c) => (
            <CountryCard
              key={c.id}
              country={c}
              onPress={() => openCountry(c)}
            />
          ))
        ) : (
          <>
            <Pressable onPress={() => openCountry(portugal)}>
              <ImageBackground
                source={portugal.image}
                style={{
                  height: 145,
                  justifyContent: "flex-end",
                  marginBottom: 7,
                }}
                imageStyle={{ borderRadius: 13 }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(0,24,48,.72)",
                    padding: 12,
                    borderBottomLeftRadius: 13,
                    borderBottomRightRadius: 13,
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 21, fontWeight: "800" }}
                  >
                    Portugal
                  </Text>
                  <Text style={{ color: "white", fontSize: 12 }}>
                    História, cultura e novas oportunidades de vida na Europa.
                  </Text>
                </View>
              </ImageBackground>
            </Pressable>
            <CountryCard country={japan} onPress={() => openCountry(japan)} />
          </>
        )}
        {query && !list.length && (
          <Text style={s.text}>Nenhum país encontrado.</Text>
        )}
        <Button title="Explorar países" onPress={() => navigate("países")} />
      </View>
    </ScrollView>
  );
}
