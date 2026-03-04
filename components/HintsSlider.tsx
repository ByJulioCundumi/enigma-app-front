import React, { useState, useMemo, useEffect } from "react";
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
  baseCost?: number;
  increment?: number;
  onSpendCoins?: (amount: number) => boolean;
}

export default function HintsSlider({
  hints = [],
  baseCost = 10,
  increment = 10,
  onSpendCoins,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealedHints, setRevealedHints] = useState<boolean[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 🔒 Mantener estado sincronizado si cambian las pistas
  useEffect(() => {
    setRevealedHints(hints.map(() => false));
    setCurrentIndex(0);
  }, [hints]);

  if (!hints || hints.length === 0) return null;

  // 🔒 Asegurar índice válido
  const safeIndex = Math.min(
    Math.max(currentIndex, 0),
    hints.length - 1
  );

  const currentCost = useMemo(() => {
    return baseCost + safeIndex * increment;
  }, [baseCost, increment, safeIndex]);

  const isRevealed = revealedHints[safeIndex] ?? false;

  const handleReveal = () => {
    if (isRevealed) return;
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      let canUnlock = true;

      // Si existe función real
      if (onSpendCoins) {
        canUnlock = onSpendCoins(currentCost);
      }

      // Mock automático si no existe
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
      {/* Flecha izquierda */}
      <TouchableOpacity
        onPress={handlePrev}
        disabled={safeIndex === 0}
        style={[styles.arrow, safeIndex === 0 && styles.disabled]}
      >
        <FontAwesome6 name="chevron-left" size={14} color="#fff" />
      </TouchableOpacity>

      {/* Contenido central */}
      <View style={styles.content}>
        <Text style={styles.index}>
          {safeIndex + 1}/{hints.length}
        </Text>

        <View style={styles.textWrapper}>
          {isRevealed ? (
            <Text
              style={styles.text}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {hints[safeIndex]}
            </Text>
          ) : (
            <Text style={styles.lockedText}>
              🔒 Pista {safeIndex+1} bloqueada
            </Text>
          )}
        </View>

        {!isRevealed && (
          <TouchableOpacity
            style={[
              styles.coinButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={handleReveal}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            <FontAwesome6 name="coins" size={12} color="#fff" />
            <Text style={styles.coinText}>{currentCost}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Flecha derecha */}
      <TouchableOpacity
        onPress={handleNext}
        disabled={safeIndex === hints.length - 1}
        style={[
          styles.arrow,
          safeIndex === hints.length - 1 && styles.disabled,
        ]}
      >
        <FontAwesome6 name="chevron-right" size={14} color="#fff" />
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
    color: "#ffcc25",
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

  coinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
  },

  disabledButton: {
    opacity: 0.5,
  },

  coinText: {
    marginLeft: 4,
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },
});