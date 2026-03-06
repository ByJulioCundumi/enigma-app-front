import GameModeSelector from "@/components/GameModeSelector";
import Ranking from "@/components/Ranking";
import SettingsButton from "@/components/SettingsButton";
import TopicsCta from "@/components/TopicsCta";
import TopicSelector from "@/components/TopicSelector";
import VipButton from "@/components/VipButton";
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
  interpolate,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

export default function Index() {
  const dispatch = useDispatch();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 4000, // más lento = más suave = menos estrés visual
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    dispatch(setCurrentPage("index"));
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, 1], [0, -8]);
    const scale = interpolate(progress.value, [0, 1], [1, 1.02]);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <LinearGradient
      colors={["#0c1f48", "#162d51", "#312e81"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, animatedStyle]}>
          <Image
            source={require("../assets/images/logo2.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.box}>
          <TopicsCta />
          <GameModeSelector />
        </View>

        <Ranking/>
        <VipButton/>
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
    marginTop: -50
  },
  box: {
    gap: 80,
  },
  logoContainer: {
    alignItems: "center",
    backgroundColor: "#280f590a",
    borderRadius: 160,
  },
  logoImage: {
    width: 350,
    height: 350,
    marginBottom: -100,
  },
});