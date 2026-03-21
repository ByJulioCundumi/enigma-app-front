import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import {
  selectCurrentLevel,
  selectCurrentTopic,
} from "@/store/selectors/topicSelectors";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type Props = {
  isAnimated?: boolean; // 👈 nuevo parámetro
};

export default function LevelCard({ isAnimated = true }: Props) {
  const topic = useSelector(selectCurrentTopic);
  const levelData = useSelector(selectCurrentLevel);

  const selectedTopicId = useSelector(
    (state: IRootState) => state.topics.selectedTopic
  );

  const topicProgress = useSelector(
    (state: IRootState) =>
      state.topics.progress[state.topics.selectedTopic]
  );

  const currentLevelIndex = topicProgress?.currentLevel ?? 0;
  const level = currentLevelIndex + 1;
  const totalLevels = topic?.levels.length ?? 0;

  const levelText =
    selectedTopicId === "random"
      ? `${level}`
      : `${level}/${totalLevels}`;

  const cardWidth = width * 0.9;
  const cardHeight = 240;

  const boxWidth = cardWidth * 0.42;
  const boxHeight = 95;

  const gapX = (cardWidth - boxWidth * 2) / 3;
  const gapY = (cardHeight - boxHeight * 2) / 3;

  const images = levelData?.images ?? [];
  const words = levelData?.words ?? [];

  if (images.length < 2 || words.length < 2) return null;

  const positions = [
    { x: gapX, y: gapY },
    { x: gapX * 2 + boxWidth, y: gapY },
    { x: gapX * 2 + boxWidth, y: gapY * 2 + boxHeight },
    { x: gapX, y: gapY * 2 + boxHeight },
  ];

  const items = [
    { type: "image", content: images[0] },
    { type: "word", content: words[0] },
    { type: "image", content: images[1] },
    { type: "word", content: words[1] },
  ];

  const anims = useRef(
    items.map((_, i) => new Animated.ValueXY(positions[i]))
  ).current;

  const order = useRef([0, 1, 2, 3]).current;
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isAnimated) return; // 👈 si está desactivado, no animar

    let isMounted = true;

    const loop = () => {
      if (!isMounted) return;

      const first = order.shift();
      if (first !== undefined) order.push(first);

      const animations = anims.map((anim, i) => {
        return Animated.timing(anim, {
          toValue: positions[order[i]],
          duration: 1000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        });
      });

      Animated.parallel(animations).start(() => {
        if (isMounted) {
          setTimeout(loop, 1200);
        }
      });
    };

    if (!hasStarted.current) {
      hasStarted.current = true;
      loop();
    }

    return () => {
      isMounted = false;
    };
  }, [isAnimated]); // 👈 dependencia importante

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
        {items.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.clueBox,
              {
                width: boxWidth,
                height: boxHeight,
                transform: anims[index].getTranslateTransform(),
              },
            ]}
          >
            {item.type === "image" ? (
              <>
                <Image source={item.content} style={styles.icon} />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.6)"]}
                  style={styles.overlay}
                />
              </>
            ) : (
              <View style={styles.wordContainer}>
                <Text style={styles.wordText} numberOfLines={2}>
                  {item.content}
                </Text>
              </View>
            )}
          </Animated.View>
        ))}

        <View style={styles.badgeWrapper}>
          <View style={styles.badgeOuterRing}>
            <LinearGradient
              colors={["#fff7b0", "#e6b800", "#e6b800"]}
              style={styles.badgeCore}
            >
              <View style={styles.topGlow} />
              <View style={styles.sideGlow} />
              <Text style={styles.badgeText}>{levelText}</Text>
            </LinearGradient>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },
  card: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#ffffff10",
  },
  clueBox: {
    position: "absolute",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#0b0f1d",
  },
  icon: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
  },
  wordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  wordText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  badgeWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    zIndex: 10,
  },
  badgeOuterRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#c997003a",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeCore: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff6c2",
  },
  topGlow: {
    position: "absolute",
    top: 6,
    left: 10,
    width: 40,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 20,
  },
  sideGlow: {
    position: "absolute",
    bottom: 8,
    right: 10,
    width: 18,
    height: 18,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#5a3b00",
  },
});