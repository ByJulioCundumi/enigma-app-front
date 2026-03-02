import FloatingParticles from "@/components/FloatingParticles";
import GameModeSelector from "@/components/GameModeSelector";
import SettingsButton from "@/components/SettingsButton";
import TopicsCta from "@/components/TopicsCta";
import TopicSelector from "@/components/TopicSelector";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

export default function Index() {
  const dispatch = useDispatch();
  const floatY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-10, {
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );

    scale.value = withRepeat(
      withTiming(1.03, {
        duration: 3500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    dispatch(setCurrentPage("index"));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={["#0c1f48", "#162d51", "#312e81"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <FloatingParticles />

      <View style={styles.content}>
        {/* ===== LOGO ===== */}
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ===== DESCRIPCIÓN PREMIUM ===== */}
        <View style={styles.box}>
          <TopicsCta />
          <GameModeSelector />
        </View>

        <SettingsButton />
        <TopicSelector />
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
    gap: 10,
    marginTop: 40,
  },

  box: {
    gap: 60,
  },

  /* ===== LOGO ===== */

  logoContainer: {
    alignItems: "center",
    backgroundColor: "#280f590a",
    borderRadius: 160,
  },

  logoImage: {
    width: 260,
    height: 260,
    marginBottom: -45,
  },
});
