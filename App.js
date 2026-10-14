import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigation from "./src/navigation/AppNavigation";

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigation />
    </SafeAreaProvider>
  );
}
