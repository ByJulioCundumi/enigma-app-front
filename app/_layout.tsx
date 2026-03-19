import { store } from "@/store/store";
import { Stack } from "expo-router";
import { Provider} from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";

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
      <View style={styles.container}>
        
        {/* 🔥 OCULTA BARRA SUPERIOR */}
        <StatusBar hidden />

        <View style={styles.stackContainer}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#0c1f48" },
            }}
          />
        </View>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03051b"
  },
  stackContainer: {
    flex: 1,
  },
});