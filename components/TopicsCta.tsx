import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");
const AnimatedView = Animated.createAnimatedComponent(View);

export default function TopicsCta() {
  const float = useSharedValue(0);
  const sweep = useSharedValue(-200);

  const topic = "Naturaleza";

  useEffect(() => {
    float.value = withRepeat(
      withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    sweep.value = withRepeat(
      withTiming(width + 200, {
        duration: 2600,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sweep.value }, { rotate: "18deg" }],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.card, floatStyle]}>

        {/* BLOBS DECORATIVOS */}
        <Svg style={styles.blobTop} width={200} height={180} viewBox="0 0 200 200">
          <Path
            fill="rgba(255,255,255,0.08)"
            d="M40,-60C55,-50,70,-40,75,-25C80,-10,75,10,65,25C55,40,40,50,25,60C10,70,-5,80,-20,75C-35,70,-50,55,-60,40C-70,25,-75,10,-70,-5C-65,-20,-50,-35,-35,-45C-20,-55,-10,-60,5,-65C20,-70,30,-70,40,-60Z"
            transform="translate(100 100)"
          />
        </Svg>

        <Svg style={styles.blobBottom} width={160} height={160} viewBox="0 0 200 200">
          <Path
            fill="rgba(255,255,255,0.05)"
            d="M30,-50C45,-40,60,-30,65,-15C70,0,65,20,55,35C45,50,30,60,15,65C0,70,-15,70,-30,65C-45,60,-60,50,-65,35C-70,20,-65,0,-60,-15C-55,-30,-50,-40,-40,-50C-30,-60,-15,-70,0,-70C15,-70,30,-60,30,-50Z"
            transform="translate(100 100)"
          />
        </Svg>

        {/* CONTENIDO */}
        <View style={styles.content}>

          {/* BADGE SIMPLE */}
          <View style={styles.topicBadge}>
            <Ionicons name="rocket" size={14} color="#fff" />
            <Text style={styles.topicText}>Tema: {topic}</Text>
          </View>

          <Text style={styles.description}>
            Es una formación natural de la Tierra que puede expulsar lava,
            ceniza y gases. ?
          </Text>
        </View>

        {/* BOTÓN */}
        <TouchableOpacity activeOpacity={0.9} style={styles.buttonOuter}>
          <View style={styles.buttonInner}>
            <AnimatedView style={[styles.sweep, sweepStyle]} />
            <Text style={styles.buttonText}>Jugar Enigma</Text>
            <Ionicons name="rocket" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
  },

  card: {
    width: width * 0.92,
    backgroundColor: "#1e293b",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "#334155",
    overflow: "hidden",
    position: "relative",
  },

  blobTop: {
    position: "absolute",
    top: -40,
    right: -30,
    zIndex: 0,
  },

  blobBottom: {
    position: "absolute",
    bottom: -50,
    left: -40,
    zIndex: 0,
  },

  content: {
    zIndex: 2,
    marginBottom: 18,
  },

  /* 🔹 BADGE SIMPLE */
  topicBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#334053",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#00ffb3",
    flexDirection: "row",
    gap: 7,
    alignItems: "center"
  },

  topicText: {
    color: "#00ffb3",
    fontSize: 13,
    fontWeight: "700",
  },

  description: {
    color: "#e2e8f0",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    backgroundColor: "#f3f3f31f",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10
  },

  buttonOuter: {
    backgroundColor: "#ffdd81",
    borderRadius: 24,
  },

  buttonInner: {
    backgroundColor: "#ffc400",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ffffff40",
    gap: 10,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 17,
    letterSpacing: 1,
  },

  sweep: {
    position: "absolute",
    width: 20,
    height: "250%",
    backgroundColor: "rgba(255,255,255,0.8)",
    opacity: 0.3,
  },
});