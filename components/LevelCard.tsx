import { IRootState } from "@/store/rootState";
import {
  selectCurrentLevel,
  selectCurrentTopic,
} from "@/store/selectors/topicSelectors";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import TopicButton from "./TopicButton";

const { width } = Dimensions.get("window");

export default function LevelCard() {
  const topic = useSelector(selectCurrentTopic);
  const levelData = useSelector(selectCurrentLevel);

  const selectedTopicId = useSelector(
    (state: IRootState) => state.topics.selectedTopic,
  );

  const topicProgress = useSelector(
    (state: IRootState) => state.topics.progress[state.topics.selectedTopic],
  );

  const currentLevelIndex = topicProgress?.currentLevel ?? 0;
  const level = currentLevelIndex + 1;
  const totalLevels = topic?.levels.length ?? 0;

  const prevLevelRef = useRef(currentLevelIndex);

  const currentOrderRef = useRef([0, 1, 2, 3]);

  const levelText =
    selectedTopicId === "random" ? `${level}` : `${level}/${totalLevels}`;

  const cardWidth = width * 0.9;
  const cardHeight = 240;

  const boxWidth = cardWidth * 0.42;
  const boxHeight = 95;

  const gapX = (cardWidth - boxWidth * 2) / 3;
  const gapY = (cardHeight - boxHeight * 2) / 3;

  const words = levelData?.words ?? ["Casa", "Perro", "Sol", "Árbol"];

  const positions = [
    { x: gapX, y: gapY },
    { x: gapX * 2 + boxWidth, y: gapY },
    { x: gapX * 2 + boxWidth, y: gapY * 2 + boxHeight },
    { x: gapX, y: gapY * 2 + boxHeight },
  ];

  const items = [
    { content: words[0] },
    { content: words[1] },
    { content: words[2] },
    { content: words[3] },
  ];

  const colors = [
    ["#84d4ff", "#3dc2ff"],
    ["#ffec8e", "#ffd54f"],
    ["#92ffb6", "#59e78f"],
    ["#d0a7ff", "#b388ff"],
  ];

  const floatAnims = useRef(items.map(() => new Animated.Value(0))).current;
  const shineAnim = useRef(new Animated.Value(0)).current;

  const animatedPositions = useRef(
    positions.map((pos) => new Animated.ValueXY(pos)),
  ).current;

  const isCompleted = topicProgress?.completed ?? false;

  useEffect(() => {
    floatAnims.forEach((anim, i) => {
      const loop = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -5,
            duration: 1200 + i * 120,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 5,
            duration: 1200 + i * 120,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]).start(() => loop());
      };
      loop();
    });

    Animated.loop(
      Animated.sequence([
        Animated.timing(shineAnim, {
          toValue: 1,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(shineAnim, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // 🚀 ROTACIÓN MÁS LENTA
  useEffect(() => {
    if (prevLevelRef.current !== currentLevelIndex) {
      prevLevelRef.current = currentLevelIndex;

      const prevOrder = currentOrderRef.current;

      const newOrder = [prevOrder[3], prevOrder[0], prevOrder[1], prevOrder[2]];

      const animations = newOrder.map((itemIndex, newPosIndex) =>
        Animated.timing(animatedPositions[itemIndex], {
          toValue: positions[newPosIndex],
          duration: 1000, // ⬅️ antes 500, ahora más suave
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      );

      Animated.parallel(animations).start();

      currentOrderRef.current = newOrder;
    }
  }, [currentLevelIndex]);

  return (
    <View style={styles.wrapper}>
      <TopicButton />
      <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        {items.map((item, index) => {
          return (
            <Animated.View
              key={index}
              style={[
                styles.clueBox,
                {
                  width: boxWidth,
                  height: boxHeight,
                  transform: [
                    { translateX: animatedPositions[index].x },
                    { translateY: animatedPositions[index].y },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={colors[index] as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
              >
                <Animated.View style={[styles.shine]} />
                <Animated.View style={[styles.shineB]} />

                <View style={styles.questionBackground}>
                  <Animated.Text
                    style={[
                      styles.backgroundQuestionMark,
                      {
                        transform: [
                          {
                            scale: floatAnims[index].interpolate({
                              inputRange: [-5, 5],
                              outputRange: [0.95, 1.05],
                            }),
                          },
                          { translateY: floatAnims[index] },
                        ],
                      },
                    ]}
                  >
                    ?
                  </Animated.Text>
                </View>

                <View style={styles.wordContainer}>
                  <Text style={styles.wordText} numberOfLines={2}>
                    {item.content}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          );
        })}

        <View style={styles.badgeWrapper}>
          <View style={styles.badgeOuterRing}>
            <LinearGradient
              colors={["#fff7b0", "#e6b800", "#e6b800"]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.badgeCore}
            >
              <View style={styles.topGlow} />
              <View style={styles.sideGlow} />
              {isCompleted ? (
                <FontAwesome6 name="flag-checkered" size={26} color="#5a3b00" />
              ) : (
                <Text style={styles.badgeText}>{levelText}</Text>
              )}
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%", alignItems: "center" },
  card: {
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#ffffff18",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  clueBox: {
    position: "absolute",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
  },
  gradient: { flex: 1 },
  shine: {
    position: "absolute",
    top: -20,
    left: -20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  shineB: {
    position: "absolute",
    bottom: -18,
    right: -18,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  questionBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundQuestionMark: {
    fontSize: 85,
    fontWeight: "900",
    color: "rgba(255,255,255,0.35)",
    marginTop: -10,
  },
  wordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  wordText: {
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.37)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  badgeWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -43 }, { translateY: -43 }],
    zIndex: 10,
  },
  badgeOuterRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#c997003a",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeCore: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff6c2",
  },
  topGlow: {
    position: "absolute",
    top: 6,
    left: 10,
    width: 45,
    height: 18,
    backgroundColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 20,
  },
  sideGlow: {
    position: "absolute",
    bottom: 10,
    right: 12,
    width: 20,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#ffffff",
  },
});
