import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { consumeEnergy } from "@/store/reducers/energySlice";
import { IRootState } from "@/store/rootState";
import { stopTimeSound } from "@/hooks/playTimeSound";

const { width } = Dimensions.get("window");

const RETRY_COST = 2;

type Props = {
  visible: boolean;
  success: boolean;
  energy: number;
  onContinue: () => void;
  onRetry: () => void;
  onHome: () => void;
};

export default function LevelResultPopup({
  visible,
  success,
  energy,
  onContinue,
  onRetry,
  onHome,
}: Props) {
  const dispatch = useDispatch();

  const scale = useRef(new Animated.Value(0.85)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const warningOpacity = useRef(new Animated.Value(0)).current;

  const [mounted, setMounted] = useState(false);

  // 🔥 BLOQUEO REAL (anti multi-click)
  const isProcessingRef = useRef(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { language } = useSelector(
    (state: IRootState) => state.language
  );

  const isEs = language === "es";

  useEffect(() => {
    if (visible) {
      setMounted(true);
      stopTimeSound();

      // reset bloqueo cuando se abre
      isProcessingRef.current = false;
      setIsDisabled(false);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),

        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 90,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.timing(scale, {
          toValue: 0.9,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),

        Animated.timing(translateY, {
          toValue: 40,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMounted(false);
      });
    }
  }, [visible]);

  if (!mounted) return null;

  const showEnergyWarning = () => {
    Animated.sequence([
      Animated.timing(warningOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.delay(1600),
      Animated.timing(warningOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRetry = () => {
    // 🔥 BLOQUEO INSTANTÁNEO (clave)
    if (isProcessingRef.current) return;

    if (energy < RETRY_COST) {
      showEnergyWarning();
      return;
    }

    // 🔥 activar bloqueo
    isProcessingRef.current = true;
    setIsDisabled(true);

    // 🔥 cobrar UNA SOLA VEZ
    dispatch(consumeEnergy(RETRY_COST));

    // 🔥 cerrar inmediatamente (evita spam visual)
    onRetry();
  };

  const accentColor = success ? "#22c55e" : "#ef4444";

  return (
    <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
      <Animated.View
        style={[
          styles.container,
          {
            opacity,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >
        <View style={[styles.iconWrapper, { borderColor: accentColor }]}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={success ? "trophy" : "close"}
              size={38}
              color={success ? "#FFD54A" : "#ef4444"}
            />
          </View>
        </View>

        <Text style={styles.title}>
          {success
            ? isEs
              ? "Nivel completado"
              : "Level completed"
            : isEs
            ? "Nivel fallado"
            : "Level Failed"}
        </Text>

        <Text style={styles.subtitle}>
          {success
            ? isEs
              ? "Excelente trabajo."
              : "Great job."
            : isEs
            ? "Puedes volver a intentarlo."
            : "You can try again."}
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.homeButton}
            onPress={onHome}
          >
            <Ionicons name="home" size={18} color="#fff" />
            <Text style={styles.buttonText}>
              {isEs ? "Inicio" : "Home"}
            </Text>
          </TouchableOpacity>

          {success ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.continueButton}
              onPress={onContinue}
            >
              <Ionicons name="play" size={18} color="#fff" />
              <Text style={styles.buttonText}>
                {isEs ? "Continuar" : "Continue"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.retryButton,
                isDisabled && { opacity: 0.6 },
              ]}
              onPress={handleRetry}
              disabled={isDisabled}
            >
              <Ionicons name="refresh" size={18} color="#fff" />

              <Text style={styles.buttonText}>
                {isEs ? "Reintentar" : "Try again"}
              </Text>

              <View style={styles.energyBadge}>
                <FontAwesome6
                  name="bolt-lightning"
                  size={10}
                  color="#fff"
                />
                <Text style={styles.energyBadgeText}>
                  -{RETRY_COST}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View
          style={[
            styles.energyWarning,
            {
              opacity: warningOpacity,
              transform: [
                {
                  translateY: warningOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={18}
            color="#fff"
          />

          <Text style={styles.energyWarningText}>
            {isEs
              ? "No tienes suficiente energía"
              : "You don't have enough energy"}
          </Text>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "90%",
    backgroundColor: "#030c18",
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1f2937",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },

  iconWrapper: {
    borderWidth: 2,
    borderRadius: 50,
    padding: 6,
    marginBottom: 14,
  },

  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#1e293b",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    color: "#94a3b8",
    fontSize: 15,
    textAlign: "center",
    maxWidth: 360,
    lineHeight: 20,
  },

  buttons: {
    flexDirection: "row",
    marginTop: 18,
    gap: 14,
  },

  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },

  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22c55e",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },

  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ef4444",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f97316",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
    gap: 3,
  },

  energyBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },

  energyWarning: {
    position: "absolute",
    bottom: -24,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc2626",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },

  energyWarningText: {
    color: "#fff",
    fontWeight: "700",
  },
});