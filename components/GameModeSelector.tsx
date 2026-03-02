import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

type Mode = "normal" | "survival";

interface Props {
  onModeChange?: (mode: Mode) => void;
}

const SWITCH_WIDTH = 300;
const SWITCH_HEIGHT = 50;
const OPTION_WIDTH = SWITCH_WIDTH / 2;

export default function GameModeSelector({ onModeChange }: Props) {
  const [selectedMode, setSelectedMode] =
    useState<Mode>("normal");

  const progress = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(
      selectedMode === "normal" ? 0 : 1,
      {
        damping: 12,
        stiffness: 180,
        mass: 0.8,
      }
    );
  }, [selectedMode]);

  const handleChange = (mode: Mode) => {
    scale.value = withSpring(0.95, { damping: 10 });
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 120);

    setSelectedMode(mode);
    onModeChange?.(mode);
  };

  /* ===== Indicador animado ===== */

  const animatedIndicator = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [0, OPTION_WIDTH]
    );

    const dynamicScale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 1.05, 1]
    );

    return {
      transform: [
        { translateX },
        { scale: dynamicScale },
      ],
    };
  });

  /* ===== Glow dinámico ===== */

  const animatedContainer = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#0f172a", "#111827"]
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        Modalidad de Juego
      </Text>

      <Animated.View
        style={[
          styles.switchContainer,
          animatedContainer,
        ]}
      >
        {/* Indicador */}
        <Animated.View
          style={[
            styles.animatedIndicator,
            animatedIndicator,
          ]}
        >
          <LinearGradient
            colors={
              selectedMode === "normal"
                ? ["#6366f1", "#4f46e5"]
                : ["#6366f1", "#4f46e5"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientFill}
          />
        </Animated.View>

        {/* Normal */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.option}
          onPress={() => handleChange("normal")}
        >
          <Ionicons
            name="flash"
            size={16}
            color={
              selectedMode === "normal"
                ? "#fff"
                : "#94a3b8"
            }
          />
          <Text
            style={[
              styles.optionText,
              selectedMode === "normal" &&
                styles.activeText,
            ]}
          >
            Normal
          </Text>
        </TouchableOpacity>

        {/* Survival */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.option}
          onPress={() =>
            handleChange("survival")
          }
        >
          <Ionicons
            name="timer"
            size={16}
            color={
              selectedMode === "survival"
                ? "#fff"
                : "#94a3b8"
            }
          />
          <Text
            style={[
              styles.optionText,
              selectedMode === "survival" &&
                styles.activeText,
            ]}
          >
            Supervivencia
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

/* ========================= */
/* ===== STYLES ===== */
/* ========================= */

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginVertical: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#cbd5e1",
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  switchContainer: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  animatedIndicator: {
    position: "absolute",
    width: OPTION_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: 22,
  },

  gradientFill: {
    flex: 1,
    borderRadius: 22,
  },

  option: {
    width: OPTION_WIDTH,
    height: SWITCH_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    zIndex: 2,
  },

  optionText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#94a3b8",
    letterSpacing: 0.5,
  },

  activeText: {
    color: "#fff",
  },
});