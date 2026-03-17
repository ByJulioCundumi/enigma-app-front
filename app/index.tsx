import PlayButton from "@/components/PlayButton";
import TopicList from "@/components/TopicList";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import TopBar from "@/components/TopBar";
import LevelCard from "@/components/LevelCard";
import { useDispatch } from "react-redux";
import { validateLocalVip } from "@/store/reducers/vipSlice";

export default function Index() {
  const float = useSharedValue(0);
  const dispatch = useDispatch()

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

  useEffect(() => {
    dispatch(validateLocalVip())
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    const translateY = interpolate(float.value, [0, 1], [0, -12]);
    const scale = interpolate(float.value, [0, 1], [1, 1.03]);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <LinearGradient
      colors={[
        "#143788",  // azul oscuro profundo
        "#184cc4",  // azul intenso
        "#2c68f5",  // azul vibrante
        "#5185ff",  // azul claro brillante
      ]}
      locations={[0, 0.35, 0.7, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <TopBar />

      <Animated.Image
        source={require("../assets/images/logo3.png")}
        style={[styles.logo, logoStyle]}
        resizeMode="contain"
      />

      <View style={styles.gameSection}>
        <LevelCard isIndex={true} />
      </View>

      <TopicList />
      <PlayButton />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 120,
  },

  gameSection: {
    gap: 15,
    marginTop: -20,
  },

  logo: {
    width: 450,
    height: 240,
  },
});