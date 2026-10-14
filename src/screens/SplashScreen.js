import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function SplashScreen({ onFinish, duration = 2500 }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.slogan}>Conexões que te levam mais longe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#091344",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 280, height: 280 },
  slogan: { color: "white", marginTop: 24 },
});
