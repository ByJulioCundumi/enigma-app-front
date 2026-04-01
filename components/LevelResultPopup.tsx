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
import { addEnergy, consumeEnergy } from "@/store/reducers/energySlice";
import { IRootState } from "@/store/rootState";
import { stopTimeSound } from "@/hooks/playTimeSound";
import { selectCurrentTopic } from "@/store/selectors/topicSelectors";
import { markTopicCompleted } from "@/store/reducers/topicsSlice";
import WhiteFlashBurst from "./WhiteFlashBurst";
import {
  incrementVipPopupCounter,
  openVipModal,
  resetVipPopupCounter,
} from "@/store/reducers/vipSlice";
import { isConnectedToInternet } from "@/utils/isConnectedToInternet";
import SunburstBackground from "./SunburstBackground";
import ConfettiBurst from "./ConfettiBurst";

const RETRY_COST = 2;

type Props = {
  visible: boolean;
  success: boolean;
  energy: number;
  onContinue: () => void;
  onRetry: () => void;
  onHome: () => void;
  word?: string;
};

export default function LevelResultPopup({
  visible,
  success,
  energy,
  onContinue,
  onRetry,
  onHome,
  word,
}: Props) {
  const dispatch = useDispatch();

  const { language } = useSelector((state: IRootState) => state.language);
  const { selectedTopic, progress } = useSelector(
    (state: IRootState) => state.topics
  );
  const { isVip, vipPopupCounter } = useSelector(
    (state: IRootState) => state.vip
  );

  const topic = useSelector(selectCurrentTopic);

  const isEs = language === "es";

  const currentLevel = progress[selectedTopic]?.currentLevel ?? 0;
  const totalLevels = topic?.levels.length ?? 0;

  const isLastLevel = currentLevel + 1 === totalLevels;
  const isTopicCompleted = progress[selectedTopic]?.completed ?? false;

  const [showConfetti, setShowConfetti] = useState(false);

  // Animaciones
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const warningOpacity = useRef(new Animated.Value(0)).current;

  const [mounted, setMounted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const isProcessingRef = useRef(false);
  const rewardGivenRef = useRef(false);
  const [flashTrigger, setFlashTrigger] = useState(false);
  const levelData = topic?.levels[currentLevel];

  // 🎯 Imagen dinámica
  const resultImage = success
  ? levelData?.image
  : require("@/assets/images/ui/fail.jpg");

  // 🎬 Animación entrada/salida
  useEffect(() => {
    if (visible) {
      setMounted(true);
      stopTimeSound();

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

  // 🎁 Recompensa final
  useEffect(() => {
    if (
      visible &&
      success &&
      isLastLevel &&
      !isTopicCompleted &&
      !rewardGivenRef.current
    ) {
      dispatch(markTopicCompleted(selectedTopic));
      dispatch(addEnergy(15));
      rewardGivenRef.current = true;
    }

    if (!visible) rewardGivenRef.current = false;
  }, [visible, success]);


  useEffect(() => {
  if (visible && success) {
    setShowConfetti(true);
  } else {
    setShowConfetti(false);
  }
}, [visible, success]);

  // ⚡ Flash efecto
  useEffect(() => {
    if (!visible || !success) return;

    setFlashTrigger(false);
    const id = requestAnimationFrame(() => setFlashTrigger(true));
    return () => cancelAnimationFrame(id);
  }, [visible, success]);

  // 💰 Monetización
  useEffect(() => {
    if (!visible || isVip) return;

    dispatch(incrementVipPopupCounter());
  }, [visible]);

  useEffect(() => {
    const handle = async () => {
      if (isVip) return;

      if (vipPopupCounter > 0 && vipPopupCounter % 5 === 0) {
        const isConnected = await isConnectedToInternet();

        if (isConnected) {
          // showInterstitialAd()
        } else {
          dispatch(openVipModal());
        }

        dispatch(resetVipPopupCounter());
      }
    };

    handle();
  }, [vipPopupCounter]);

  if (!mounted) return null;

  // ⚠️ Warning energía
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
      {showConfetti && <ConfettiBurst active />}
      <Animated.View
        style={[
          styles.container,
          {
            opacity,
            transform: [{ scale }, { translateY }],
          },
        ]}
      >

        <SunburstBackground isSuccess={success} />
        {/* 🖼️ Imagen dinámica */}
        <View style={styles.imgContainer}>
          <Image source={resultImage} style={styles.image} />
        </View>

        {/* 🧠 Texto */}
        <Text style={styles.title}>
          {isTopicCompleted
            ? isEs
              ? "🎉 ¡Temática completada!"
              : "🎉 Topic completed!"
            : success
            ? `✨  ${word?.toUpperCase() || ""}  ✨`
            : isEs
            ? "😤 ¡Casi lo logras!"
            : "😤 So close!"}
        </Text>

        <Text style={styles.subtitle}>
          {success
            ? isEs
              ? "Buen trabajo!"
              : "Great job!"
            : isEs
            ? "Inténtalo de nuevo 💪"
            : "Try again 💪"}
        </Text>

        {/* 🎮 Botones */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.homeButton} onPress={onHome}>
            <Ionicons name="return-up-back-outline" size={18} color="#fff" />
          </TouchableOpacity>

          {!isTopicCompleted &&
            (success ? (
              <TouchableOpacity
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
                style={[
                  styles.retryButton,
                  isDisabled && { opacity: 0.6 },
                ]}
                onPress={handleRetry}
                disabled={isDisabled}
              >
                <Ionicons name="refresh" size={18} color="#fff" />

                <Text style={{color: "#fff", fontWeight: 800}}>
                  {isEs
                    ? "Reintentar"
                    : "Try Again"}
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
            ))}
        </View>

        {/* ⚠️ Warning */}
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
            {isEs
              ? "No tienes energía"
              : "Not enough energy"}
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
    width: "95%",
    maxWidth: 500,
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },

  imgContainer: {
    width: "100%",
    height: 220,
    marginBottom: 26,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ffffffbe"
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    color: "#94a3b8",
    marginTop: 6,
    textAlign: "center",
  },

  buttons: {
    marginTop: 18,
    gap: 12,
  },

  homeButton: {
    backgroundColor: "#374151",
    padding: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "center",
  },

  continueButton: {
    flexDirection: "row",
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },

  retryButton: {
    flexDirection: "row",
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "800",
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