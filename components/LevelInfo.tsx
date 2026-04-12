import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { FontAwesome6, Octicons } from "@expo/vector-icons";

export default function LevelInfo() {
  const { language } = useSelector((state: IRootState) => state.language);
  const progress = useSelector((state: IRootState) => state.topics.progress);

  const isEs = language === "es";

  const topicId = "random";
  const currentLevel = progress[topicId]?.currentLevel ?? 0;
  const levelNumber = currentLevel + 1;

  return (
    <View style={styles.wrapper}>
      <View style={styles.badge}>
        <FontAwesome6 name="ranking-star" size={14} color="#FFD700" />

        <View style={styles.levelChip}>
          <Text style={styles.levelText}>
            {isEs ? `Nv. ${levelNumber}` : `Lv. ${levelNumber}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    marginBottom: 18,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,

    paddingHorizontal: 14,
    paddingVertical: 6,

    borderRadius: 999,

    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },

  levelChip: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },

  levelText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});