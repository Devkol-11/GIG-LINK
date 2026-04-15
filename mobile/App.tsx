import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./src/theme/ThemeProvider";
import { AppButton } from "./src/components/AppButton";

const HomeScreen = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      edges={["top", "bottom", "left", "right"]}
    >
      <AppButton
        label={`Toggle to ${mode === "light" ? "Dark" : "Light"} Mode`}
        onPress={toggleMode}
      />
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
