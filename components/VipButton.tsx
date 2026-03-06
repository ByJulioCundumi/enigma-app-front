import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function VipButton() {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.wrapper}>
      {/* Anillo premium */}
      <LinearGradient
        colors={["#F59E0B", "#FBBF24", "#F59E0B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.outerRing}
      >
        <View style={styles.innerContainer}>
          
          {/* Icono NO ADS */}
          <View style={styles.noAdsContainer}>
            <View style={styles.noAdsCircle}>
              <Text style={styles.noAdsText}>ADS</Text>
              <View style={styles.noAdsLine} />
            </View>
          </View>

        </View>
      </LinearGradient>

      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>VIP: $1.22 USD</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 40,
    right: 18,
    alignItems: "center",
  },

  outerRing: {
    width: 120,
    height: 55,
    borderRadius: 15,
    padding: 3,
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
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },

  /* NO ADS ICON */

  noAdsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -5
  },

  noAdsCircle: {
    width: 28,
    height: 28,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
  },

  noAdsText: {
    color: "#F59E0B",
    fontWeight: "900",
    fontSize: 8,
    letterSpacing: 1,
  },

  noAdsLine: {
    position: "absolute",
    width: 27,
    height: 2,
    backgroundColor: "#f59f0bc9",
    transform: [{ rotate: "-45deg" }],
  },

  badge: {
    position: "absolute",
    bottom: -8,
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
    fontSize: 9,
    fontWeight: "900",
    color: "#fafafa",
    letterSpacing: 0.8,
  },
});