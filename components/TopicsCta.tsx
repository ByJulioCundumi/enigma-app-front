import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Pressable,
} from "react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
  interpolateColor,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import HintsSlider from "./HintsSlider";

const { width } = Dimensions.get("window");

const TOTAL_SECONDS = 15;
const TOTAL_MS = TOTAL_SECONDS * 1000;

export default function TopicsCta() {
  const pulse = useSharedValue(0);
  const timerProgress = useSharedValue(1);

  const [imageVisible, setImageVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  const { currentPage } = useSelector(
    (state: IRootState) => state.currentPage
  );
  const { gameMode } = useSelector(
    (state: IRootState) => state.gameMode
  );

  const router = useRouter();

  const mockImage =
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800";

  // 🔥 Animaciones solo activas en GameRoom
  useEffect(() => {
    if (currentPage === "gameRoom") {
      // Pulsación ligera
      pulse.value = withRepeat(
        withTiming(1, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );

      // Reset timer
      timerProgress.value = 1;
      setSecondsLeft(TOTAL_SECONDS);

      // Animación visual del progreso (UI thread)
      timerProgress.value = withTiming(0, {
        duration: TOTAL_MS,
        easing: Easing.linear,
      });

      // Timer real en JS cada 1 segundo (mucho más liviano)
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      cancelAnimation(pulse);
      cancelAnimation(timerProgress);
      pulse.value = 0;
      timerProgress.value = 1;
      setSecondsLeft(TOTAL_SECONDS);
    }
  }, [currentPage]);

  // 🔥 Card pulse animado
  const popingStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.02]);
    return {
      transform: [{ scale }],
    };
  });

  // 🔥 Barra progresiva optimizada
  const timerBarStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      timerProgress.value,
      [1, 0],
      ["#ebb625", "#ef4444"]
    );

    return {
      width: `${timerProgress.value * 100}%`,
      backgroundColor,
    };
  });

  const timerTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      timerProgress.value,
      [1, 0],
      ["#ebb625", "#ef4444"]
    );

    return { color };
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.card, popingStyle]}>
        <LinearGradient
          colors={["#425bac77", "#1e293b46", "#312e81a0"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.cardInner}
        >
          <View style={styles.content}>
            <View style={styles.row}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setImageVisible(true)}
              >
                <View style={styles.thumbnailCard}>
                  <Image
                    source={{ uri: mockImage }}
                    style={styles.thumbnail}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  Es una formación natural de la Tierra que puede expulsar
                  lava, ceniza y gases.
                </Text>

                {currentPage === "gameRoom" && gameMode === "survival" && (
                  <View style={styles.timerRow}>
                    <Animated.Text
                      style={[styles.timerText, timerTextStyle]}
                    >
                      {gameMode === "survival" && (
                        <FontAwesome6
                          name="heart-circle-minus"
                          size={14}
                          color="#f44b81"
                        />
                      )}{" "}
                      {secondsLeft}
                    </Animated.Text>

                    <View style={styles.timerContainer}>
                      <Animated.View
                        style={[styles.timerBar, timerBarStyle]}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.levelProgressWrapper}>
              <View style={styles.progressHeader}>
                <Text style={styles.levelTitle}>
                  Nueva Palabra ¿...?
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 7,
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.percentageText}>
                    Nivel 28
                  </Text>
                  <FontAwesome6
                    style={{ marginTop: -2 }}
                    name="ranking-star"
                    size={15}
                    color="#ffcc25"
                  />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {currentPage === "index" && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.buttonOuter}
          onPress={() => router.push("/GameRoom")}
        >
          <View style={styles.buttonInner}>
            <Text style={styles.buttonText}>Jugar</Text>
          </View>
        </TouchableOpacity>
      )}

      <Modal
        visible={imageVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setImageVisible(false)}
        >
          <View style={styles.popupContainer}>
            <Image
              source={{ uri: mockImage }}
              style={styles.fullImage}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },

  card: {
    width: width * 0.92,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#c1c1c147",
  },

  cardInner: {
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 15,
  },

  content: { gap: 10 },

  row: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  descriptionContainer: { flex: 1 },

  description: {
    color: "#e5e7ebea",
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
    backgroundColor: "#ffffff10",
    borderRadius: 12,
  },

  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 5,
  },

  timerText: {
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },

  timerContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#ffffff20",
    borderRadius: 10,
    overflow: "hidden",
  },

  timerBar: {
    height: "100%",
    borderRadius: 10,
  },

  thumbnailCard: {
    width: 80,
    height: 110,
    borderRadius: 16,
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    borderColor: "#ffffffcf",
    borderWidth: 1,
  },

  levelProgressWrapper: { gap: 6 },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  levelTitle: {
    color: "#b8b2c3",
    fontWeight: "600",
    fontSize: 14.5,
  },

  percentageText: {
    color: "#b8b2c3",
    fontWeight: "700",
    fontSize: 13,
  },

  buttonOuter: {
    marginTop: 18,
    width: width * 0.66,
    borderRadius: 24,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupContainer: {
    width: width * 0.85,
    borderRadius: 20,
    overflow: "hidden",
  },

  fullImage: {
    width: "100%",
    height: width * 0.85,
  },
});