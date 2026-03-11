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
import { FontAwesome6, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
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
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";

const { width } = Dimensions.get("window");

const TOTAL_SECONDS = 15;
const TOTAL_MS = TOTAL_SECONDS * 1000;

type Props = {
  useTimer?: boolean;
};

export default function TopicsCta({ useTimer = true }: Props) {
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

  const mockImage =
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800";

  const topicName = "Volcanes";

  const level = 7;

  useEffect(() => {
    if (currentPage === "gameRoom") {
      pulse.value = withRepeat(
        withTiming(1, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      );

      if (useTimer) {
        timerProgress.value = 1;
        setSecondsLeft(TOTAL_SECONDS);

        timerProgress.value = withTiming(0, {
          duration: TOTAL_MS,
          easing: Easing.linear,
        });

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
      }
    } else {
      cancelAnimation(pulse);
      cancelAnimation(timerProgress);
      pulse.value = 0;
      timerProgress.value = 1;
      setSecondsLeft(TOTAL_SECONDS);
    }
  }, [currentPage, useTimer]);

  const popingStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.02]);

    return {
      transform: [{ scale }],
    };
  });

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
      <View style={styles.topicHeader}>
        <LinearGradient
          colors={["#6366f1", "#4338ca"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topicHeaderInner}
        >
          <Octicons name="multi-select" size={12} color="#fff" />
          <Text style={styles.topicTitle}>{topicName}</Text>
        </LinearGradient>
      </View>

      <Animated.View style={[styles.card, popingStyle]}>
        <LinearGradient
          colors={["#627fff7a", "#192e508c", "#312e81a4"]}
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

                  <View style={styles.levelBadge}>
                    <FontAwesome6 name="ranking-star" size={10} color="#fff" />
                    <Text style={styles.levelBadgeText}>Lv. {level}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.descriptionContainer}>
                <Text style={styles.description}>
                  Es una formación natural de la Tierra que puede expulsar
                  lava, ceniza y gases.
                </Text>

                {useTimer &&
                  currentPage === "gameRoom" &&
                  gameMode === "survival" && (
                    <View style={styles.timerRow}>
                      <Animated.Text
                        style={[styles.timerText, timerTextStyle]}
                      >
                        <MaterialCommunityIcons
                          name="heart-minus-outline"
                          size={14}
                          color="#f44b81"
                        />{" "}
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
          </View>
        </LinearGradient>
      </Animated.View>

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
  wrapper: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
  },

  topicHeader: {
    position: "absolute",
    top: 6,
    alignSelf: "center",
    zIndex: 10,
  },

  topicHeaderInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffffff4b",
  },

  topicTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.5,
  },

  card: {
    width: width * 0.92,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#c1c1c147",
    backgroundColor: "#0a033121",
    padding: 5
  },

  cardInner: {
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingTop: 28,
  },

  content: { gap: 10 },

  row: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginTop: -14
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
    position: "relative",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    borderColor: "#ffffffcf",
    borderWidth: 1,
  },

  levelBadge: {
    position: "absolute",
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: "#000000b0",
    borderRadius: 8,
    paddingVertical: 3,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#ffffff55",
  },

  levelBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
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