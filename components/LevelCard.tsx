import { IRootState } from "@/store/rootState";
import {
  selectCurrentLevel,
  selectCurrentTopic,
} from "@/store/selectors/topicSelectors";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import TopicButton from "./TopicButton";

export default function LevelCard() {
  const { width, height } = useWindowDimensions();
  const MAX_WIDTH = 500;

  // 🔥 IMPORTANTE: imagen en constante
  const topicImage = require("@/assets/images/topics/animals.jpg");

  const [modalVisible, setModalVisible] = useState(false);

  const cardWidth = Math.min(width * 0.9, MAX_WIDTH);

  let scale = 1;
  if (height < 700) scale = 0.75;
  else if (height < 812) scale = 1;
  else if (height > 900) scale = 1.15;

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

  const cardHeight = 240 * scale;

  const boxWidth = cardWidth * 0.42;
  const boxHeight = 95 * scale;

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

  const animatedPositions = useRef(
    positions.map((pos) => new Animated.ValueXY(pos)),
  ).current;

  const isCompleted = topicProgress?.completed ?? false;

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
  }, []);

  return (
    <View style={styles.wrapper}>
      <TopicButton />

      <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        {items.map((item, index) => (
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
        ))}

        {/* BADGE */}
        <View
          style={[
            styles.badgeWrapper,
            {
              transform: [
                { translateX: -43 * scale },
                { translateY: -43 * scale },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.badgeOuterRing,
              {
                width: 86 * scale,
                height: 86 * scale,
                borderRadius: 43 * scale,
              },
            ]}
          >
            <View
              style={[
                styles.badgeCore,
                {
                  width: 90 * scale,
                  height: 90 * scale,
                  borderRadius: 50 * scale,
                },
              ]}
            >
              {isCompleted ? (
                <FontAwesome6
                  name="flag-checkered"
                  size={26 * scale}
                  color="#5a3b00"
                />
              ) : (
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    source={topicImage}
                    style={{
                      width: 82 * scale,
                      height: 82 * scale,
                      borderRadius: 50 * scale,
                      resizeMode: "cover",
                    }}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* 🔥 MODAL CORREGIDO */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          
          {/* Fondo clickeable */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
          />

          {/* Imagen */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            style={styles.imageWrapper}
          >
            <Image source={topicImage} style={styles.fullImage} />
          </TouchableOpacity>

        </View>
      </Modal>
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
  },

  badgeWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 10,
  },

  badgeOuterRing: {
    backgroundColor: "#c997003a",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeCore: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#ffffff56",
  },

  // 🔥 MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  imageWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "95%",
    maxWidth: "95%",
    aspectRatio: 1,
    borderRadius: 20,
    resizeMode: "contain",
  },
});