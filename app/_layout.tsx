import { store } from "@/store/store";
import { Stack } from "expo-router";
import { Provider } from "react-redux";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import TopBar from "@/components/TopBar";

export default function RootLayout() {
  useEffect(() => {
  if (Platform.OS !== "android") return;

  const enableImmersiveMode = async () => {
    await NavigationBar.setBehaviorAsync("overlay-swipe"); 
    await NavigationBar.setVisibilityAsync("hidden");
  };

  enableImmersiveMode();

  const subscription = NavigationBar.addVisibilityListener(({ visibility }) => {
    if (visibility === "visible") {
      setTimeout(() => {
        NavigationBar.setVisibilityAsync("hidden");
      }, 3000); // ⏱ 3 segundos antes de ocultarse otra vez
    }
  });

  return () => {
    subscription?.remove();
  };
}, []);

  return (
    <Provider store={store}>
      <View style={styles.container}>
        <TopBar/>
        <View style={styles.stackContainer}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>

      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stackContainer: {
    flex: 1,
  },
});