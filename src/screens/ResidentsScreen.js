import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { countries, residents } from "../data/countries";
import { s, colors } from "../styles/theme";
import { Brand, Button, Icon } from "../components/UI";
export default function ResidentsScreen({ filter, clearFilter, openChat }) {
  const list = residents.filter((r) => !filter || r.countryId === filter);
  return (
    <ScrollView contentContainerStyle={s.page}>
      <Brand />
    
      
      {filter && (
        <Button title="Mostrar todos os países" onPress={clearFilter} outline />
      )}
      {list.map((r) => (
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
                {r.name} • {countries.find((c) => c.id === r.countryId).name}
              </Text>
              <Text style={s.text}>Residente em {r.city}</Text>
            </View>
          </View>
          <Text style={[s.text, { marginTop: 12 }]}>{r.bio}</Text>
          <Button title="Iniciar conversa" onPress={() => openChat(r)} />
        </View>
      ))}
    </ScrollView>
  );
}
