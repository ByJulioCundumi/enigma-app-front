import GameModeSelector from "@/components/GameModeSelector";
import Ranking from "@/components/Ranking";
import SettingsButton from "@/components/SettingsButton";
import TopicsCta from "@/components/TopicsCta";
import TopicSelector from "@/components/TopicSelector";
import VipButton from "@/components/VipButton";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useDispatch } from "react-redux";

const { width } = Dimensions.get("window");

export default function Index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 4000,
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
    <ImageBackground
      source={require("../assets/images/bg2.avif")}
      resizeMode="cover"
      style={styles.container}
    >
      <LinearGradient
        colors={["rgba(9, 21, 49, 0.7)", "rgba(18, 36, 66, 0.78)", "rgba(47, 45, 128, 0.71)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, animatedStyle]}>
            <Image
              source={require("../assets/images/logo3.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>

          <View style={styles.box}>
            <TopicsCta useTimer={false} />

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.buttonOuter}
              onPress={() => router.push("/GameRoom")}
            >
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>Jugar</Text>
              </View>
            </TouchableOpacity>
          </View>

          <GameModeSelector />

          <Ranking />
          <VipButton />
        </View>
      </LinearGradient>
    </ImageBackground>
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
    marginTop: -50,
  },

  box: {
    gap: 0,
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

  buttonOuter: {
    marginTop: 18,
    borderRadius: 24,
    width: 300,
    marginHorizontal: "auto",
  },

  buttonInner: {
    backgroundColor: "#5153ff",
    borderRadius: 16,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 17,
    letterSpacing: 1,
  },
});