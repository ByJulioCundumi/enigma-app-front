import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { consumeEnergy } from "@/store/reducers/energySlice";
import { IRootState } from "@/store/rootState";
import SunburstBackground from "./SunburstBackground";

const RETRY_COST = 2;

type Props = {
  visible: boolean;
  energy: number;
  onRetry: () => void;
  onHome: () => void;
};

export default function LevelResultPopup({
  visible,
  energy,
  onRetry,
  onHome,
}: Props) {
  const dispatch = useDispatch();

  const { language } = useSelector((state: IRootState) => state.language);

  const isEs = language === "es";

  // Animaciones
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const warningOpacity = useRef(new Animated.Value(0)).current;

  const [mounted, setMounted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const isProcessingRef = useRef(false);

  const zoomAnim = useRef(new Animated.Value(1)).current;

  // Imagen fija (fallo)
  const resultImage = require("@/assets/images/ui/fail.jpg");

  useEffect(() => {
    if (!visible) return;

    const zoomLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(zoomAnim, {
          toValue: 1.05,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );

    zoomLoop.start();

    return () => {
      zoomAnim.stopAnimation();
    };
  }, [visible]);

  // Animación entrada/salida
  useEffect(() => {
    if (visible) {
      setMounted(true);

      isProcessingRef.current = false;
      setIsDisabled(false);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible]);

  if (!mounted) return null;

  // Warning energía
  const showEnergyWarning = () => {
    Animated.sequence([
      Animated.timing(warningOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(1400),
      Animated.timing(warningOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRetry = () => {
    if (isProcessingRef.current) return;

    if (energy < RETRY_COST) {
      showEnergyWarning();
      return;
    }

    isProcessingRef.current = true;
    setIsDisabled(true);

    dispatch(consumeEnergy(RETRY_COST));
    onRetry();
  };

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
        <SunburstBackground isSuccess={false} />

        <Animated.View
          style={[
            styles.imgContainer,
            {
              transform: [{ scale: zoomAnim }],
            },
          ]}
        >
          <Image source={resultImage} style={styles.image} />
        </Animated.View>

        <Text style={styles.title}>
          {isEs ? "Casi lo logras" : "So close"}
        </Text>

        <Text style={styles.subtitle}>
          {isEs ? "Inténtalo de nuevo" : "Try again"}
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.homeButton} onPress={onHome}>
            <Ionicons name="return-up-back-outline" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.retryButton, isDisabled && { opacity: 0.6 }]}
            onPress={handleRetry}
            disabled={isDisabled}
          >
            <Ionicons name="refresh" size={18} color="#fff" />

            <Text style={{ color: "#fff", fontWeight: "800" }}>
              {isEs ? "Reintentar" : "Try Again"}
            </Text>

            <View style={styles.energyBadge}>
              <FontAwesome6
                name="bolt-lightning"
                size={10}
                color="#fff"
              />
              <Text style={styles.energyBadgeText}>-{RETRY_COST}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.energyWarning,
            { opacity: warningOpacity },
          ]}
        >
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={18}
            color="#fff"
          />
          <Text style={styles.energyWarningText}>
            {isEs ? "No tienes energía" : "Not enough energy"}
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
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 28,
    padding: 29,
    alignItems: "center",
  },

  imgContainer: {
    width: 320,
    height: 230,
    marginBottom: 26,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffffff9c"
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    backgroundColor: "#ccd1ff1e",
    padding: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    letterSpacing: 4
  },

  subtitle: {
    color: "#95a5bb",
    marginTop: 10,
    textAlign: "center",
    fontSize: 14
  },

  buttons: {
    marginTop: 50,
    gap: 12,
  },

  homeButton: {
    backgroundColor: "#374151",
    padding: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "center",
  },

  retryButton: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },

  energyBadge: {
    flexDirection: "row",
    backgroundColor: "#b91c1c",
    paddingHorizontal: 6,
    borderRadius: 6,
    marginLeft: 6,
    alignItems: "center",
    gap: 2
  },

  energyBadgeText: {
    color: "#fff",
    fontSize: 11,
  },

  energyWarning: {
    position: "absolute",
    bottom: -20,
    flexDirection: "row",
    backgroundColor: "#dc2626",
    padding: 8,
    borderRadius: 10,
    gap: 6,
  },

  energyWarningText: {
    color: "#fff",
    fontWeight: "700",
  },
});