import React from "react";
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import {
  selectCurrentLevel,
  selectCurrentTopic,
} from "@/store/selectors/topicSelectors";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type Props = {
  isIndex?: boolean;
};

export default function LevelCard({ isIndex = true }: Props) {
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
      : `${currentLevelIndex}/${totalLevels}`;

  const cardSize = { width: width * 0.9, height: 260 };

  // 🔥 fallback seguro
  const clues = levelData?.clues ?? [];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, cardSize]}>
        {/* GRID */}
        <View style={styles.cluesContainer}>
          {clues.length > 0 ? (
            clues.map((item, index) => (
              <View key={index} style={styles.clueBox}>
                <Image source={item.image} style={styles.icon} />
                <Text style={styles.clueText}>{item.text}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: "#fff" }}>No clues</Text>
          )}
        </View>

        {/* BADGE */}
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
              <Text style={styles.badgeText}>{level}</Text>
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
    borderWidth: 1,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#ffffff42",
    justifyContent: "center",
    alignItems: "center",
  },
  cluesContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  clueBox: {
    width: "48%",
    backgroundColor: "#121a33",
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#1f2a4d",
  },
  icon: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
  clueText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 6,
  },

  // BADGE
  badgeWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeOuterRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#c997003a",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
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
    fontSize: 24,
    fontWeight: "900",
    color: "#5a3b00",
  },
});