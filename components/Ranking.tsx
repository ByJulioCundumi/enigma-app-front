import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  rank?: number; // posición del jugador
  onPress?: () => void;
}

export default function Ranking({
  rank = 128,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.wrapper}
      onPress={onPress}
    >
      {/* Anillo global */}
      <LinearGradient
        colors={["#2563EB", "#6366F1", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.outerRing}
      >
        <View style={styles.innerContainer}>
          <MaterialCommunityIcons
            name="earth"
            size={26}
            color="#93C5FD"
            style={{marginTop: -7.5}}
          />
        </View>
      </LinearGradient>

      {/* Badge posición */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Jugadores</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 28,
    left: 18,
    alignItems: "center",
  },

  outerRing: {
    width: 92,
    height: 52,
    borderRadius: 15,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#3B82F6",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 15,
  },

  innerContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    bottom: -5,
    backgroundColor: "#2563EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.8,
  },
});