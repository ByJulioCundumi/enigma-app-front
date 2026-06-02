import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  onClear: () => void;
  onHint: () => void;
  onAddTime: () => void;

  hintDisabled: boolean;
  timeDisabled: boolean;
};

export default function GameActions({
  onClear,
  onHint,
  onAddTime,
  hintDisabled,
  timeDisabled,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Borrar */}
      <TouchableOpacity style={styles.clearButton} onPress={onClear}>
        <MaterialCommunityIcons name="delete-sweep" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Pista */}
      <View style={styles.actionWrapper}>
        <TouchableOpacity
          style={[styles.hintButton, hintDisabled && styles.disabledButton]}
          onPress={onHint}
          disabled={hintDisabled}
        >
          <MaterialCommunityIcons name="lightbulb-on" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.badge}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={10}
            color="#fff"
          />
          <Text style={styles.badgeText}>2</Text>
        </View>
      </View>

      {/* Tiempo */}
      <View style={styles.actionWrapper}>
        <TouchableOpacity
          style={[styles.timeButton, timeDisabled && styles.disabledButton]}
          onPress={onAddTime}
          disabled={timeDisabled}
        >
          <MaterialCommunityIcons name="timer-plus" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.timeBadge}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={10}
            color="#fff"
          />
          <Text style={styles.badgeText}>2</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 18,
    width: "auto",
    marginTop: 10,
    paddingVertical: 8,
    paddingTop: 11,
    paddingHorizontal: 14,
    borderRadius: 15,
    backgroundColor: "#ffffff13",
    alignSelf: "center"
  },
  actionWrapper: {
    position: "relative",
  },
  clearButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  hintButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
  },
  timeButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#334155",
    opacity: 0.6,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fac000",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    minWidth: 28,
    justifyContent: "center",
  },
  timeBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 8,
    minWidth: 28,
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    marginLeft: 2,
  },
});