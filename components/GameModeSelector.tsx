import React from "react";
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
  interpolateColor,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { setGameMode } from "@/store/reducers/gameModeSlice";

type Mode = "normal" | "survival";

const SWITCH_WIDTH = 300;
const SWITCH_HEIGHT = 50;
const OPTION_WIDTH = SWITCH_WIDTH / 2;

export default function GameModeSelector() {
  const dispatch = useDispatch();

  const { gameMode } = useSelector(
    (state: IRootState) => state.gameMode
  );

  /* posición inicial */

  const progress = useSharedValue(
    gameMode === "normal" ? 0 : 1
  );

  const handleChange = (mode: Mode) => {
    if (mode === gameMode) return;

    const target = mode === "normal" ? 0 : 1;

    /* animación inmediata */
    progress.value = withSpring(target, {
      damping: 15,
      stiffness: 160,
      mass: 0.8,
    });

    /* actualizar redux */
    dispatch(setGameMode(mode));
  };

  /* indicador animado */

  const animatedIndicator = useAnimatedStyle(() => {
    const translateX = progress.value * OPTION_WIDTH;

    const dynamicScale =
      1 + Math.sin(progress.value * Math.PI) * 0.05;

    return {
      transform: [{ translateX }, { scale: dynamicScale }],
    };
  });

  /* glow dinámico */

  const animatedContainer = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#0f172a", "#111827"]
    );

    return {
      backgroundColor,
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
        {/* indicador */}
        <Animated.View
          style={[
            styles.animatedIndicator,
            animatedIndicator,
          ]}
        >
          <LinearGradient
            colors={["#6366f1", "#4f46e5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientFill}
          />
        </Animated.View>

        {/* normal */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.option}
          onPress={() => handleChange("normal")}
        >
          <Ionicons
            name="flash"
            size={16}
            color={
              gameMode === "normal"
                ? "#fff"
                : "#ffffff"
            }
          />

          <Text
            style={[
              styles.optionText,
              gameMode === "normal" &&
                styles.activeText,
            ]}
          >
            Normal
          </Text>
        </TouchableOpacity>

        {/* survival */}
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
              gameMode === "survival"
                ? "#fff"
                : "#ffffff"
            }
          />

          <Text
            style={[
              styles.optionText,
              gameMode === "survival" &&
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

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },

  label: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#cbd5e1",
    marginBottom: 10,
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
    color: "#ffffff",
    letterSpacing: 0.5,
  },

  activeText: {
    color: "#fff",
  },
});