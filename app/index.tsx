import LevelCard from "@/components/LevelCard";
import PlayButton from "@/components/PlayButton";
import TopBar from "@/components/TopBar";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { IRootState } from "@/store/rootState";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
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
  const { height } = useWindowDimensions();
  const bgMusic = useBackgroundMusic(require("@/assets/sounds/music2.mp3"));

  const float = useSharedValue(0);
  const dispatch = useDispatch();

  const {language} = useSelector(
      (state: IRootState) => state.language
    );
  
    const isEs = language === "es";

  // 🔥 BREAKPOINTS por altura
  const isSmall = height < 750;
  const isLarge = height > 900;
  const logoMarginTop = isSmall ? -20 : 0;

  // 🔥 tamaños del logo según dispositivo
  let logoWidth = 400;
  let logoHeight = 230;

  if (isSmall) {
    logoWidth = 300;
    logoHeight = 170;
  } else if (isLarge) {
    logoWidth = 520;
    logoHeight = 280;
  }

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
    bgMusic.play();

    return ()=>{
      bgMusic.pause();
    }
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
        "#1d77ee",
        "#477dfc",
        "#477dfc",
        "#22b9ff",
      ]}
      locations={[0, 0.35, 0.7, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <TopBar />

      <Animated.Image
        source={require("../assets/images/logo2.png")}
        style={[
          {
            width: logoWidth,
            height: logoHeight,
            marginTop: logoMarginTop, // 👈 aquí
          },
          logoStyle,
        ]}
        resizeMode="contain"
      />

      <View style={styles.gameSection}>
        <LevelCard />
      </View>

      <Text style={styles.textCta}>{isEs ? "¿Qué palabra es?" : "What word is it?"}</Text>

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
    marginTop: -23,
  },
  textCta:{
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    backgroundColor: "#ffffff15",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 25
  }
});