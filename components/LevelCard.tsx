import { IRootState } from "@/store/rootState";
import {
  selectCurrentLevel,
  selectIsTopicCompleted,
} from "@/store/selectors/topicSelectors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import LevelInfo from "./LevelInfo";
export default function LevelCard() {
  const { width, height } = useWindowDimensions();
  const MAX_WIDTH = 500;

const cardWidth = Math.min(width * 0.9, MAX_WIDTH);

  // 🔥 ESCALA BASE
  let scale = 1;
  if (height < 700) {
  scale = 0.75; // 🔥 mucho más pequeño
} else if (height < 812) {
  scale = 1; // 🔥 pequeño moderado
} else if (height > 900) {
  scale = 1.15; // 🔥 grande
}

  const levelData = useSelector(selectCurrentLevel);

  const topicProgress = useSelector(
    (state: IRootState) => state.topics.progress[state.topics.selectedTopic],
  );

  const currentLevelIndex = topicProgress?.currentLevel ?? 0;
  const { language } = useSelector((state: IRootState) => state.language);

  const prevLevelRef = useRef(currentLevelIndex);
  const currentOrderRef = useRef([0, 1, 2, 3]);

  // 🔥 tamaños escalados
  const cardHeight = 250 * scale;

  const boxWidth = cardWidth * 0.42;
  const boxHeight = 100 * scale;

  const gapX = (cardWidth - boxWidth * 2) / 3;
  const gapY = (cardHeight - boxHeight * 2) / 3;

  const words = levelData?.words ?? ["Casa", "Perro", "Sol", "Árbol"];

  const isEs = language === "es";
    const isTopicCompleted = useSelector(selectIsTopicCompleted);
    const showCongrats = isTopicCompleted;

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

  useEffect(() => {
    floatAnims.forEach((anim, i) => {
      const loop = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -5 * scale,
            duration: 1200 + i * 120,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 5 * scale,
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

  useEffect(() => {
    if (prevLevelRef.current !== currentLevelIndex) {
      prevLevelRef.current = currentLevelIndex;

      const prevOrder = currentOrderRef.current;
      const newOrder = [prevOrder[3], prevOrder[0], prevOrder[1], prevOrder[2]];

      const animations = newOrder.map((itemIndex, newPosIndex) =>
        Animated.timing(animatedPositions[itemIndex], {
          toValue: positions[newPosIndex],
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      );

      Animated.parallel(animations).start();
      currentOrderRef.current = newOrder;
    }
  }, [currentLevelIndex, scale]);

  return (
    <View style={styles.wrapper}>
      <LevelInfo />

      <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        <View style={styles.topics}>
          <View style={styles.circle}></View>
        </View>
        {
         showCongrats ? (
            <View style={styles.congratsContainer}>
              <Text style={styles.congratsTitle}>{isEs ? "🎉 ¡Felicidades! 🎉" : "🎉 Congratulations! 🎉"}</Text>
              <Text style={styles.congratsSubtitle}>
                {isEs ? "Has completado todo el juego :)" : "You've completed the entire game :)"}
              </Text>
            </View>
          ) : 
        items.map((item, index) => {
          return (
            <Animated.View
              key={index}
              style={[
                styles.clueBox,
                {
                  width: boxWidth,
                  height: boxHeight,
                  borderRadius: 16 * scale,
                  transform: [
                    { translateX: animatedPositions[index].x },
                    { translateY: animatedPositions[index].y },
                  ],
                },
              ]}
            >
              <LinearGradient style={styles.gradient} colors={colors[index] as [string, string]}>
                <Animated.View
                  style={[
                    styles.shine,
                    {
                      width: 50 * scale,
                      height: 50 * scale,
                      borderRadius: 25 * scale,
                    },
                  ]}
                />

                <Animated.View
                  style={[
                    styles.shineB,
                    {
                      width: 50 * scale,
                      height: 50 * scale,
                      borderRadius: 25 * scale,
                    },
                  ]}
                />

                <View style={styles.questionBackground}>
                  <Animated.Text
                    style={[
                      styles.backgroundQuestionMark,
                      {
                        fontSize: 85 * scale,
                        transform: [
                          {
                            scale: floatAnims[index].interpolate({
                              inputRange: [-5 * scale, 5 * scale],
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
                  <Text
                    style={[styles.wordText, { fontSize: 16 * scale }]}
                    numberOfLines={2}
                  >
                    {item.content}
                  </Text>
                </View>
              </LinearGradient>
            </Animated.View>
          );
        })}
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
    marginBottom: -10,
  },

  topics: {
  ...StyleSheet.absoluteFillObject,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100
},

circle:{
  width: 27,
  height: 27,
  borderRadius: 100,
  backgroundColor: "#ffffff1c"
},

congratsContainer: {
  position: "absolute",
  width: "100%",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},

congratsTitle: {
  fontSize: 25,
  fontWeight: "900",
  color: "#17ccbd",
  marginBottom: 10,
},

congratsSubtitle: {
  fontSize: 14,
  color: "#ffffffcc",
  textAlign: "center",
},

  clueBox: {
    position: "absolute",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.85)",
  },

  gradient: { flex: 1 },

  questionBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },

  backgroundQuestionMark: {
    fontWeight: "900",
    color: "rgba(255,255,255,0.35)",
    marginTop: -12
  },

  wordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  wordText: {
    fontWeight: "900",
    textAlign: "center",
    color: "#ffffff",
    textShadowColor: "rgba(0, 0, 0, 0.16)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  badgeWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
  },

  badgeOuterRing: {
    justifyContent: "center",
    alignItems: "center",
  },

  badgeCore: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#ffffff56",
  },

  shine: {
    position: "absolute",
    top: -20,
    left: -20,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  shineB: {
    position: "absolute",
    bottom: -18,
    right: -18,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
});