import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";

interface Props {
  value: number;
}

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
};

export default function EnergyStat({ value }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.statBadge}>
      
      <View style={styles.energyIcon}>
        <FontAwesome6 name="bolt-lightning" size={9} color="#fff" />
      </View>

      <Text style={styles.statText}>{formatNumber(value)}</Text>

      <View style={styles.plusButton}>
        <Ionicons name="add" size={12} color="#fff" />
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#df405d",
    borderWidth: 1,
    borderColor: "rgba(255,92,124,0.35)",
    gap: 6,
  },

  energyIcon: {
    width: 17.5,
    height: 17.5,
    borderRadius: 10,
    backgroundColor: "#be2a45",
    alignItems: "center",
    justifyContent: "center",
  },

  statText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#fff",
  },

  plusButton: {
    marginLeft: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#b41633",
    alignItems: "center",
    justifyContent: "center",
  },
});