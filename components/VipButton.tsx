import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function VipButton() {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.wrapper}>
      {/* Anillo premium */}
      <LinearGradient
        colors={["#F59E0B", "#FBBF24", "#FDE68A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.outerRing}
      >
        <View style={styles.innerContainer}>
          <MaterialCommunityIcons
            name="crown"
            size={25}
            color="#FBBF24"
            style={{marginTop: -7.5}}
          />
        </View>
      </LinearGradient>

      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Hazte VIP</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 28,
    right: 18,
    alignItems: "center",
  },

  outerRing: {
    width: 92,
    height: 52,
    borderRadius: 15,
    padding: 3, // crea efecto de anillo
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#F59E0B",
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 15,
  },

  innerContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    backgroundColor: "#0f172a", // azul oscuro premium
    justifyContent: "center",
    alignItems: "center",
  },

  badge: {
    position: "absolute",
    bottom: -4,
    backgroundColor: "#F59E0B",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: 0.8,
  },
});