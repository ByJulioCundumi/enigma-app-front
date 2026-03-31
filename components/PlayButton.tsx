import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  withSequence,
} from "react-native-reanimated";
import { FontAwesome6 } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { consumeEnergy } from "@/store/reducers/energySlice";
import { playSound } from "@/hooks/playSound";
import { stopBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { selectCurrentTopic } from "@/store/selectors/topicSelectors";

export default function PlayButton() {
  const router = useRouter();
  const dispatch = useDispatch();

  const energy = useSelector(
    (state: IRootState) => state.energy.energy
  );

  const requiredEnergy = 2;

  const [showMessage, setShowMessage] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // 🔒 LOCK REAL (anti doble click instantáneo)
  const isProcessingRef = useRef(false);

  const floatProgress = useSharedValue(0);
  const shineProgress = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const messageTranslate = useSharedValue(20);

  const {language} = useSelector(
    (state: IRootState) => state.language
  );

  const isEs = language === "es";

  useEffect(() => {
    floatProgress.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    shineProgress.value = withRepeat(
      withTiming(1, {
        duration: 2500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const shineStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shineProgress.value, [0, 1], [-260, 260]);

    return {
      transform: [{ translateX }, { rotate: "25deg" }],
    };
  });

  const messageStyle = useAnimatedStyle(() => {
    return {
      opacity: messageOpacity.value,
      transform: [{ translateY: messageTranslate.value }],
    };
  });

  const showEnergyMessage = () => {
    setShowMessage(true);

    messageOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: 1500 }),
      withTiming(0, { duration: 300 })
    );

    messageTranslate.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(0, { duration: 1500 }),
      withTiming(20, { duration: 300 })
    );

    setTimeout(() => setShowMessage(false), 2000);
  };

  const handlePlay = () => {
  if (isProcessingRef.current) return;

  isProcessingRef.current = true;
  setIsLocked(true);

  // 🚫 BLOQUEO POR TEMÁTICA COMPLETADA
  if (isTopicCompleted) {
    playSound(require("@/assets/sounds/soundError2.mp3"));
    showCompletedMessage();

    isProcessingRef.current = false;
    setIsLocked(false);
    return;
  }

  // ⚡ ENERGÍA
  if (energy < requiredEnergy) {
    playSound(require("@/assets/sounds/soundError2.mp3"));
    showEnergyMessage();

    isProcessingRef.current = false;
    setIsLocked(false);
    return;
  }

  playSound(require("@/assets/sounds/soundWind.mp3"));

  dispatch(consumeEnergy(requiredEnergy));

  setTimeout(() => {
    router.replace("/GameRoom");
    stopBackgroundMusic();
  }, 100);
};

  const { selectedTopic, progress } = useSelector(
  (state: IRootState) => state.topics
);

const showCompletedMessage = () => {
  setShowMessage(true);

  messageOpacity.value = withSequence(
    withTiming(1, { duration: 200 }),
    withTiming(1, { duration: 1500 }),
    withTiming(0, { duration: 300 })
  );

  messageTranslate.value = withSequence(
    withTiming(0, { duration: 200 }),
    withTiming(0, { duration: 1500 }),
    withTiming(20, { duration: 300 })
  );

  setTimeout(() => setShowMessage(false), 2000);
};

const isTopicCompleted = progress[selectedTopic]?.completed ?? false;

  return (
    <View style={styles.card}>

      {showMessage && (
        <Animated.View style={[styles.toast, messageStyle]}>
          <FontAwesome6 name="bolt-lightning" size={12} color="#FFD54A" />
          <Text style={styles.toastText}>
            {isTopicCompleted
              ? (isEs
                  ? "Esta temática ya fue completada"
                  : "This topic is already completed")
              : (isEs
                  ? "No tienes suficiente energía"
                  : "You don't have enough energy")}
          </Text>
        </Animated.View>
      )}

        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.buttonOuter,
            isLocked && { opacity: 0.6 }
          ]}
          onPress={handlePlay}
          disabled={isLocked} // 🔥 bloqueo visual
        >
          <View style={styles.buttonInner}>
            <Animated.View
              pointerEvents="none"
              style={[styles.shineContainer, shineStyle]}
            >
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.27)",
                  "rgba(255,255,255,0.05)",
                  "rgba(255,255,255,0.25)",
                  "rgba(255,255,255,0.27)",
                  "rgba(255,255,255,0.08)",
                  "rgba(255,255,255,0.28)",
                  "rgba(255,255,255,0.3)",
                ]}
                locations={[0, 0.2, 0.35, 0.5, 0.65, 0.8, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shine}
              />
            </Animated.View>

            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>
                {isEs ? "Jugar" : "Play"}
              </Text>

              <View style={styles.energyBadge}>
                <FontAwesome6
                  name="bolt-lightning"
                  size={14}
                  color="#ffffff"
                />
                <Text style={styles.energyText}>
                  -{requiredEnergy}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50,
  },

  toast: {
    position: "absolute",
    bottom: 70,
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#1e293b",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },

  toastText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  buttonOuter: {
    borderRadius: 24,
    width: 230,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffffff6e",
    backgroundColor: "#ffc400",
  },

  buttonInner: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    zIndex: 2,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 18,
    letterSpacing: 1,
  },

  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  energyText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  shineContainer: {
    position: "absolute",
    width: 20,
    height: 200,
    zIndex: 1,
  },

  shine: {
    flex: 1,
  },
});