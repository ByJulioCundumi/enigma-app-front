import GameModeSelector from "@/components/GameModeSelector";
import PlayButton from "@/components/PlayButton";
import TopicList from "@/components/TopicList";
import TopicsCta from "@/components/TopicsCta";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, ImageBackground, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

export default function Index() {

  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    const translateY = interpolate(float.value, [0, 1], [0, -12]);
    const scale = interpolate(float.value, [0, 1], [1, 1.03]);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <ImageBackground
      source={require("../assets/images/bg7.webp")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          "rgba(40, 70, 139, 0.4)",
          "rgba(18, 36, 66, 0.19)",
          "rgb(46, 45, 128)",
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}
      >

        <Animated.Image
          source={require("../assets/images/logo3.png")}
          style={[styles.logo, logoStyle]}
          resizeMode="contain"
        />

        <View style={styles.gameSection}>
          <TopicsCta useTimer={false} />
          <PlayButton />
        </View>

        <GameModeSelector />

      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 120,
  },

  gameSection: {
    gap: 20,
    marginTop: -20,
  },

  logo: {
    width: 300,
    height: 205,
  },
});
