import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import FloatingParticles from "@/components/FloatingParticles";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import TopicsCta from "@/components/TopicsCta";
import GameModeSelector from "@/components/GameModeSelector";
import TopicSelector from "@/components/TopicSelector";
import SettingsButton from "@/components/SettingsButton";

export default function Index() {
  const floatY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-10, {
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    scale.value = withRepeat(
      withTiming(1.03, {
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#312e81"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <FloatingParticles />

      <View style={styles.content}>
        {/* ===== LOGO ===== */}
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Image
            source={require("../assets/images/logo3.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ===== DESCRIPCIÓN PREMIUM ===== */}
        <View style={styles.box}>
          <TopicsCta/>
          <GameModeSelector/>
        </View>

        <SettingsButton/>
        <TopicSelector/>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },

  box: {
    gap: 20
  },

  /* ===== LOGO ===== */

  logoContainer: {
    alignItems: "center",
  },
  
  logoImage: {
    width: 280,
    height: 280,
  },

});