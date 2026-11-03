import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { countries, residents } from "../data/countries";
import { s, colors } from "../styles/theme";
import { Brand, Button, Icon } from "../components/UI";
export default function ResidentsScreen({ filter, clearFilter, openChat, residents: savedResidents }) {
  const sourceResidents = savedResidents !== undefined ? savedResidents : residents;
  const list = sourceResidents.filter((r) => !filter || r.countryId === filter);
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Brand />
    
      
      {filter && (
        <Button title="Mostrar todos os países" onPress={clearFilter} outline />
      )}
      {list.length === 0 ? (
        <View style={s.card}>
          <Text style={s.label}>Nenhum residente encontrado</Text>
          <Text style={s.text}>Quando pessoas cadastradas como residentes completarem seus perfis, elas aparecerão aqui.</Text>
        </View>
      ) : list.map((r) => (
        <View key={r.id} style={s.card}>
          <View style={s.row}>
            <View
              style={{
                padding: 14,
                backgroundColor: colors.pale,
                borderRadius: 30,
              }}
            >
              <Icon name="person" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>
                {r.name} • {countries.find((c) => c.id === r.countryId)?.name || r.destination || "Destino não informado"}
              </Text>
              <Text style={s.text}>Residente em {r.city || "Localização não informada"}</Text>
            </View>
          </View>
          <Text style={[s.text, { marginTop: 12 }]}>{r.bio}</Text>
          <Button title="Iniciar conversa" onPress={() => openChat(r)} />
        </View>
      ))}
    </ScrollView>
  );
}
