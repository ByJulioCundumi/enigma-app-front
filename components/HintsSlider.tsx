import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Props {
  hints: string[];
  onSpendEnergy?: (amount: number) => boolean;
}

export default function HintsSlider({
  hints = [],
  onSpendEnergy,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState<boolean[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const ENERGY_COST = 1;

  useEffect(() => {
    setRevealedHints(hints.map(() => false));
    setCurrentIndex(0);
  }, [hints]);

  if (!hints || hints.length === 0) return null;

  const safeIndex = Math.min(Math.max(currentIndex, 0), hints.length - 1);

  const isRevealed = revealedHints[safeIndex] ?? false;

  const handleReveal = () => {
    if (isRevealed) return;
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      let canUnlock = true;

      if (onSpendEnergy) {
        canUnlock = onSpendEnergy(ENERGY_COST);
      }

      if (canUnlock) {
        setRevealedHints((prev) => {
          const updated = [...prev];
          updated[safeIndex] = true;
          return updated;
        });
      }
    } catch (error) {
      console.log("Error al liberar pista:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    if (safeIndex < hints.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePrev}
        disabled={safeIndex === 0}
        style={[styles.arrow, safeIndex === 0 && styles.disabled]}
      >
        <FontAwesome6 name="chevron-left" size={12} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.index}>
          {safeIndex + 1}/{hints.length}
        </Text>

        <View style={styles.textWrapper}>
          {isRevealed ? (
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              {hints[safeIndex]}
            </Text>
          ) : (
            <Text style={styles.lockedText}>
              Pista {safeIndex + 1} bloqueada
            </Text>
          )}
        </View>

        {!isRevealed && (
          <TouchableOpacity
            style={[
              styles.energyButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={handleReveal}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            <FontAwesome6 name="bolt-lightning" size={11} color="#fff" />
            <Text style={styles.energyText}>1</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={handleNext}
        disabled={safeIndex === hints.length - 1}
        style={[
          styles.arrow,
          safeIndex === hints.length - 1 && styles.disabled,
        ]}
      >
        <FontAwesome6 name="chevron-right" size={12} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width * 0.88,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#ffffff08",
    borderWidth: 1,
    borderColor: "#ffffff14",
  },

  arrow: {
    padding: 6,
  },

  disabled: {
    opacity: 0.3,
  },

  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 6,
  },

  index: {
    fontSize: 11,
    color: "#ff2579",
    marginRight: 6,
    fontWeight: "700",
  },

  textWrapper: {
    flex: 1,
  },

  text: {
    fontSize: 13,
    color: "#d1d5db",
  },

  lockedText: {
    fontSize: 13,
    color: "#9ca3af",
    fontStyle: "italic",
  },

  energyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6161bd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
  },

  disabledButton: {
    opacity: 0.5,
  },

  energyText: {
    marginLeft: 4,
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },
});