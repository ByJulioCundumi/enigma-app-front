import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

type Mode = "normal" | "survival";

interface Props {
  onModeChange?: (mode: Mode) => void;
}

export default function GameModeSelector({ onModeChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [selectedMode, setSelectedMode] = useState<Mode>("normal");

  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 18,
        stiffness: 120,
      });
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [visible]);

  const closeModal = () => {
    translateY.value = withTiming(400, { duration: 250 });
    opacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => setVisible(false), 250);
  };

  const selectMode = (mode: Mode) => {
    setSelectedMode(mode);
    onModeChange?.(mode);
    closeModal();
  };

  const animatedSheet = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlay = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modeLabel =
    selectedMode === "normal" ? "Normal" : "Supervivencia";

  return (
    <>
      {/* ===== BOTÓN PRINCIPAL ===== */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
        style={{ alignSelf: "center" }}
      >
        <LinearGradient
          colors={["#6366f1", "#4f46e5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainButton}
        >
          <Ionicons name="game-controller" size={18} color="#fff" />
          <Text style={styles.mainButtonText}>
            Modo de Juego / {modeLabel}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* ===== MODAL ===== */}
      <Modal transparent visible={visible} animationType="none">
        <Animated.View style={[styles.overlay, animatedOverlay]}>
          <Pressable style={{ flex: 1 }} onPress={closeModal} />

          <Animated.View style={[styles.sheet, animatedSheet]}>
            <View style={styles.handle} />

            <Text style={styles.title}>Selecciona el modo</Text>

            <View style={styles.modesContainer}>
              <ModeCard
                icon="flash"
                title="Modo Normal"
                description="Juego clásico sin límite de tiempo"
                active={selectedMode === "normal"}
                onPress={() => selectMode("normal")}
              />

              <ModeCard
                icon="timer"
                title="Supervivencia"
                description="Contra reloj hasta fallar"
                active={selectedMode === "survival"}
                onPress={() => selectMode("survival")}
              />
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

/* ========================= */
/* ===== MODE CARD ===== */
/* ========================= */

function ModeCard({
  icon,
  title,
  description,
  active,
  onPress,
}: {
  icon: any;
  title: string;
  description: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.modeCard,
        active && styles.modeCardActive,
      ]}
    >
      <View style={styles.modeLeft}>
        <View
          style={[
            styles.iconWrapper,
            active && styles.iconWrapperActive,
          ]}
        >
          <Ionicons
            name={icon}
            size={18}
            color={active ? "#fff" : "#cbd5e1"}
          />
        </View>

        <View>
          <Text
            style={[
              styles.modeTitle,
              active && styles.modeTitleActive,
            ]}
          >
            {title}
          </Text>
          <Text style={styles.modeDescription}>
            {description}
          </Text>
        </View>
      </View>

      {active && (
        <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
      )}
    </TouchableOpacity>
  );
}

/* ========================= */
/* ===== STYLES ===== */
/* ========================= */

const styles = StyleSheet.create({
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    shadowColor: "#6366f1",
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  mainButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#0f172a",
    paddingTop: 16,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },

  handle: {
    width: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#334155",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
    letterSpacing: 1,
  },

  modesContainer: {
    gap: 14,
  },

  modeCard: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modeCardActive: {
    backgroundColor: "#1e1b4b",
    borderWidth: 1,
    borderColor: "#6366f1",
  },

  modeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapperActive: {
    backgroundColor: "#6366f1",
  },

  modeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#e2e8f0",
  },

  modeTitleActive: {
    color: "#ffffff",
  },

  modeDescription: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 4,
  },
});