import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Streak {
  value: number;
  date: string;
}

export default function StreakList() {

  const normalBest: Streak = {
    value: 18,
    date: "12 Mar 2026",
  };

  const timerBest: Streak = {
    value: 10,
    date: "10 Mar 2026",
  };

  return (
    <View style={styles.container}>

      <View style={styles.cardNormal}>
        <View style={styles.left}>
          <View style={styles.iconNormal}>
            <MaterialCommunityIcons name="trophy" size={16} color="white" />
          </View>

          <View>
            <Text style={styles.mode}>Normal</Text>
            <Text style={styles.date}>Mejor Racha: {normalBest.date}</Text>
          </View>
        </View>

        <Text style={styles.valueNormal}>{normalBest.value}</Text>
      </View>


      <View style={styles.cardTimer}>
        <View style={styles.left}>
          <View style={styles.iconTimer}>
            <MaterialCommunityIcons name="timer-outline" size={16} color="white" />
          </View>

          <View>
            <Text style={styles.mode}>Contrar Reloj</Text>
            <Text style={styles.date}>Mejor Racha: {timerBest.date}</Text>
          </View>
        </View>

        <Text style={styles.valueTimer}>{timerBest.value}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignSelf: "center",
    marginTop: 40,
    gap: 10,
    backgroundColor: "#ffffff0e",
    padding: 20,
    borderRadius: 20
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardNormal: {
    width: 250,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#152a52",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#3b82f6",
  },

  cardTimer: {
    width: 250,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4a1d2a",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ef4444",
  },

  iconNormal: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
  },

  iconTimer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },

  mode: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },

  date: {
    color: "#cbd5f5",
    fontSize: 10,
  },

  valueNormal: {
    fontSize: 24,
    fontWeight: "900",
    color: "#60a5fa",
  },

  valueTimer: {
    fontSize: 24,
    fontWeight: "900",
    color: "#f87171",
  },

});