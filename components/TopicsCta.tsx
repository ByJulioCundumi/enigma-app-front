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
import { FontAwesome, FontAwesome6, SimpleLineIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
  interpolateColor,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";

const { width } = Dimensions.get("window");

const TOTAL_SECONDS = 15;
const TOTAL_MS = TOTAL_SECONDS * 1000;

export default function TopicsCta() {
  const sweep = useSharedValue(-200);
  const scaleCard = useSharedValue(1);
  const scaleImage = useSharedValue(0.8);
  const timerProgress = useSharedValue(1);

  const [imageVisible, setImageVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);

  const { currentPage } = useSelector((state: IRootState) => state.currentPage);
  const router = useRouter();

  const mockImage =
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800";

  // Sweep animación botón
  useEffect(() => {
    sweep.value = withRepeat(
      withTiming(width + 200, {
        duration: 2600,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  // Popup imagen
  useEffect(() => {
    scaleImage.value = withTiming(imageVisible ? 1 : 0.8, { duration: 250 });
  }, [imageVisible]);

  // Temporizador y poping
  useEffect(() => {
    if (currentPage === "gameRoom") {
      scaleCard.value = withRepeat(
        withTiming(1.02, {
          duration: 900,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );

      timerProgress.value = 1;
      setSecondsLeft(TOTAL_SECONDS);

      timerProgress.value = withTiming(
        0,
        {
          duration: TOTAL_MS,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            runOnJS(setSecondsLeft)(0);
          }
        }
      );
    } else {
      cancelAnimation(scaleCard);
      cancelAnimation(timerProgress);
      scaleCard.value = 1;
      timerProgress.value = 1;
      setSecondsLeft(TOTAL_SECONDS);
    }
  }, [currentPage]);

  // Actualizar segundos sin interval
  useDerivedValue(() => {
    const secs = Math.ceil(timerProgress.value * TOTAL_SECONDS);
    runOnJS(setSecondsLeft)(secs);
  });

  const popingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleCard.value }],
  }));

  // 🔵➡🔴 Color progresivo
  const colorDerived = useDerivedValue(() =>
    interpolateColor(
      timerProgress.value,
      [1, 0],
      ["#ebb625", "#ef4444"] // Azul -> Rojo
    )
  );

  const timerBarStyle = useAnimatedStyle(() => ({
    width: `${timerProgress.value * 100}%`,
    backgroundColor: colorDerived.value,
  }));

  const timerTextStyle = useAnimatedStyle(() => ({
    color: colorDerived.value,
  }));

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
                  <Image source={{ uri: mockImage }} style={styles.thumbnail} />
                  <LinearGradient
                    colors={["transparent", "rgba(255, 255, 255, 0)"]}
                    style={styles.thumbnailOverlay}
                  />
                  <View style={styles.questionBadge}>
                    <FontAwesome name="arrows-h" size={18} color="#091a52" />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  Es una formación natural de la Tierra que puede expulsar lava,
                  ceniza y gases.
                </Text>

                {currentPage === "gameRoom" && (
                  <View style={styles.timerRow}>
                    <Animated.Text
                      style={[styles.timerText, timerTextStyle]}
                    >
                      <FontAwesome6 name="heart-circle-minus" size={14} color="#f44b81" /> {secondsLeft}
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
                <Text style={styles.levelTitle}>Tema: Al Azar</Text>
                <Text style={styles.percentageText}>
                  0/100{" "}
                  <SimpleLineIcons name="present" size={14} color="#ffe748" />
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {currentPage === "index" && (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.buttonOuter}
          onPress={() => router.replace("/GameRoom")}
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
            <Image source={{ uri: mockImage }} style={styles.fullImage} />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%", alignItems: "center" },

  card: {
    width: width * 0.92,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#c1c1c147"
  },

  cardInner: {
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 15,
  },

  content: { gap: 10 },

  row: { flexDirection: "row", gap: 16, alignItems: "center" },

  descriptionContainer: { flex: 1 },

  description: {
    color: "#e5e7ebea",
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
    backgroundColor: "#ffffff10",
    borderRadius: 12,
  },

  // TIMER
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 5,
  },

  timerText: {
    fontSize: 14,
    fontWeight: "900",
    width: 40,
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

  thumbnailCard: { width: 80, height: 110, borderRadius: 16 },
  thumbnail: { width: "100%", height: "100%", borderRadius: 16, borderColor: "#ffffffcf", borderWidth: 1 },

  thumbnailOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "40%",
    borderRadius: 16,
  },

  questionBadge: {
    position: "absolute",
    bottom: 35,
    right: -12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  levelProgressWrapper: { gap: 6 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between" },

  levelTitle: { color: "#b8b2c3", fontWeight: "600", fontSize: 14.5 },
  percentageText: { color: "#b8b2c3", fontWeight: "700", fontSize: 13 },

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