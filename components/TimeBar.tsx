import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

type Props = {
  timeLeft: number;
  totalTime: number;
};

export default function TimeBar({ timeLeft, totalTime }: Props) {
  const timeProgress = timeLeft / totalTime;

  const getBarColor = () => {
    if (timeProgress > 0.5) return "#22c55e";
    if (timeProgress > 0.25) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <View style={styles.timeBarContainer}>
      <FontAwesome6 name="bolt-lightning" size={12} color="#fff" />

      <Text style={styles.x2Text}>x2</Text>

      <View style={styles.timeBarBackground}>
        <View
          style={[
            styles.timeBarFill,
            {
              width: `${timeProgress * 100}%`,
              backgroundColor: getBarColor(),
            },
          ]}
        />
      </View>

      <Text style={styles.timeText}>{timeLeft}s</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timeBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 20,
    gap: 12,
    width: "100%",
    marginTop: 15
  },
  x2Text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  timeBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#334155",
    borderRadius: 10,
    overflow: "hidden",
  },
  timeBarFill: {
    height: "100%",
  },
  timeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    minWidth: 40,
    textAlign: "right",
  },
});