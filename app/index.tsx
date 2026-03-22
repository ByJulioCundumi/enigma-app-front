import LevelCard from "@/components/LevelCard";
import PlayButton from "@/components/PlayButton";
import TopBar from "@/components/TopBar";
import TopicList from "@/components/TopicList";
import { stopTimeSound } from "@/hooks/playTimeSound";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { IRootState } from "@/store/rootState";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";

export default function Index() {
  const float = useSharedValue(0);
  const dispatch = useDispatch();
  const { currentPage } = useSelector((state: IRootState) => state.currentPage);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    dispatch(setCurrentPage("index"));
  }, []);

  useEffect(() => {
    if (currentPage === "index") {
      stopTimeSound();
    }
  }, [currentPage]);

  useBackgroundMusic(require("@/assets/sounds/music2.mp3"));

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
        "#143788", // azul oscuro profundo
        "#184cc4", // azul intenso
        "#2c68f5", // azul vibrante
        "#2c68f5", // azul claro brillante
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
        <LevelCard />
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
    paddingTop: 130,
  },

  gameSection: {
    gap: 15,
    marginTop: -35,
  },

  logo: {
    width: 450,
    height: 240,
  },
});
