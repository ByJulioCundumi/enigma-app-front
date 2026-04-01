import { IRootState } from "@/store/rootState";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, // 👈 IMPORTANTE
} from "react-native";
import { useSelector } from "react-redux";
import { 
  selectCurrentTopic
} from "@/store/selectors/topicSelectors";
import { getTopics } from "@/assets/data/topics/topics";
import { Octicons } from "@expo/vector-icons";

export default function TopicButton({ onPress }: { onPress: () => void }) {
  const { language } = useSelector((state: IRootState) => state.language);
  const isEs = language === "es";

  const topic = useSelector(selectCurrentTopic);

  const topicId = useSelector((state: IRootState) => state.topics.selectedTopic);
  const currentLevelIndex = useSelector(
    (state: IRootState) => state.topics.progress[topicId]?.currentLevel ?? 0
  );

  const topics = getTopics(language);
  const totalLevels = topics[topicId]?.levels.length ?? 1;

  const isRandom = topicId === "random";

  const topicName = topic?.name ?? (isEs ? "Aleatorio" : "Random");
  const levelNumber = currentLevelIndex + 1;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.badge}>
        <Octicons name="multi-select" size={14} color="#fff" />

        <Text numberOfLines={1} style={styles.topicText}>
          {topicName}
        </Text>

        <View style={styles.levelChip}>
          <Text style={styles.levelText}> 
            {isEs
              ? isRandom
                ? `Nv. ${levelNumber}`
                : `Nv. ${levelNumber}/${totalLevels}`
              : isRandom
                ? `Lv. ${levelNumber}`
                : `Lv. ${levelNumber}/${totalLevels}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    top: -16,
    marginTop: 16,
    zIndex: 200,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff10",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999, // 🔥 pill perfecta
    gap: 8,

    borderWidth: 1,
    borderColor: "#ffffff20",
  },

  topicText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    maxWidth: 140,
  },

  levelChip: {
    backgroundColor: "#FFD70020",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  levelText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "800",
  },
});