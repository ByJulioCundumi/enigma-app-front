import GameModeSelector from "@/components/GameModeSelector";
import Ranking from "@/components/Ranking";
import TopicsCta from "@/components/TopicsCta";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { IRootState } from "@/store/rootState";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import TopicList from "@/components/TopicList";

export default function Index() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { gameMode } = useSelector((state: IRootState) => state.gameMode);

  const requiredHearts = gameMode === "normal" ? 3 : 1;

  const floatProgress = useSharedValue(0);
  const shineProgress = useSharedValue(0);

  useEffect(() => {
    floatProgress.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    shineProgress.value = withRepeat(
      withTiming(1, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    dispatch(setCurrentPage("index"));
  }, []);

  const floatStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatProgress.value, [0, 1], [0, -8]);
    const scale = interpolate(floatProgress.value, [0, 1], [1, 1.02]);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const shineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shineProgress.value, [0, 1], [-260, 260]);

    return {
      transform: [{ translateX }, { rotate: "25deg" }],
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
          "rgba(27, 46, 90, 0.4)",
          "rgba(18, 36, 66, 0.19)",
          "rgb(46, 45, 128)",
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.container}
      >
        <View style={styles.top}>
          <TopicsCta useTimer={false} />
        </View>

        <View style={styles.playSection}>
          <Animated.View style={floatStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.buttonOuter}
              onPress={() => router.push("/GameRoom")}
            >
              <View style={styles.buttonInner}>
                {/* brillo animado */}
                <Animated.View
                  pointerEvents="none"
                  style={[styles.shineContainer, shineStyle]}
                >
                  <LinearGradient
                    colors={[
                      "rgba(255,255,255,0.27)",
                      "rgba(255,255,255,0.05)",
                      "rgba(255,255,255,0.25)",
                      "rgba(255,255,255,0.27)",
                      "rgba(255,255,255,0.08)",
                      "rgba(255,255,255,0.28)",
                      "rgba(255,255,255,0.3)",
                    ]}
                    locations={[0, 0.2, 0.35, 0.5, 0.65, 0.8, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.shine}
                  />
                </Animated.View>

                {/* contenido */}
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Jugar</Text>

                  <FontAwesome5 name="dice" size={18} color="#e7e7e7" />

                  <View style={styles.energyBadge}>
                    <FontAwesome6
                      name="bolt-lightning"
                      size={14}
                      color="#ff5c7c"
                    />
                    <Text style={styles.energyText}>{requiredHearts}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.rankingSection}>
          <TopicList />
        </View>

        <View style={styles.bottom}>
          <GameModeSelector />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 130,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },

  top: {
    width: "100%",
    marginBottom: 20,
  },

  playSection: {
    alignItems: "center",
    marginBottom: 12,
  },

  rankingSection: {
    flex: 1,
    width: "100%",
    marginBottom: 12,
  },

  bottom: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonOuter: {
    borderRadius: 24,
    width: 230,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffffff6e",
    backgroundColor: "#714aff",
  },

  buttonInner: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    zIndex: 2,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1,
  },

  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: -4,
  },

  energyText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  shineContainer: {
    position: "absolute",
    width: 20,
    height: 200,
    zIndex: 1,
  },

  shine: {
    flex: 1,
  },
});