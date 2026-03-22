import { IRootState } from "@/store/rootState";
import { Octicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { selectCurrentTopic } from "@/store/selectors/topicSelectors";

export default function TopicButton() {
  const { language } = useSelector((state: IRootState) => state.language);
  const isEs = language === "es";

  const topic = useSelector(selectCurrentTopic);

  // 🔥 nombre dinámico real
  const topicName = topic?.name;

  return (
    <View style={styles.wrapper}>
      <View style={styles.badge}>
        <Octicons name="multi-select" size={12} color="#fff" />

        <Text
          numberOfLines={1}
          ellipsizeMode="clip"
          style={styles.text}
        >
          {isEs
            ? `Tema: ${topicName ?? "Aleatorio"}`
            : `Topic: ${topicName ?? "Random"}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    left: 0,
    top: -14,
    marginTop: 13,
    zIndex: 200
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff15",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 16,

    alignSelf: "flex-start", // 🔥 ancho dinámico
    gap: 8,
  },

  text: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
    flexShrink: 0, // 🔥 evita que se comprima
  },
});