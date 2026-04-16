import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";

import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import InterstitialManager from "@/components/InterstitialManager";

export default function RootLayout() {

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const enableImmersiveMode = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
    };

    enableImmersiveMode();

    const subscription = NavigationBar.addVisibilityListener(({ visibility }) => {
      if (visibility === "visible") {
        setTimeout(() => {
          NavigationBar.setVisibilityAsync("hidden");
        }, 3000);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={styles.container}>
          <StatusBar hidden />

          <InterstitialManager />

          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              contentStyle: { backgroundColor: "#0c1f48" },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="GameRoom" />
          </Stack>

        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050624",
  },
});