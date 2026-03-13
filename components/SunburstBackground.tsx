import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Dimensions, View, Easing } from "react-native";
import Svg, { Rect, Polygon } from "react-native-svg";

const { width, height } = Dimensions.get("screen");
const SIZE = Math.max(width, height) * 2;

const COLORS = {
  blue: "#2563eb",
  green: "#16a34a",
  purple: "#9333ea",
  red: "#dc2626",
  orange: "#ea580c",
};

type Props = {
  color?: keyof typeof COLORS;
};

export default function SunburstBackground({ color = "blue" }: Props) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const bgColor = COLORS[color] ?? COLORS.blue;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 90000, // slower rotation (90 seconds per turn)
        easing: Easing.linear, // constant speed (no acceleration)
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rays = 28;
  const angleStep = 360 / rays;
  const rayElements = [];

  for (let i = 0; i < rays; i++) {
    const angle = (i * angleStep * Math.PI) / 180;
    const nextAngle = ((i + 1) * angleStep * Math.PI) / 180;

    const x1 = SIZE / 2 + Math.cos(angle) * SIZE;
    const y1 = SIZE / 2 + Math.sin(angle) * SIZE;

    const x2 = SIZE / 2 + Math.cos(nextAngle) * SIZE;
    const y2 = SIZE / 2 + Math.sin(nextAngle) * SIZE;

    rayElements.push(
      <Polygon
        key={i}
        points={`${SIZE / 2},${SIZE / 2} ${x1},${y1} ${x2},${y2}`}
        fill={i % 2 === 0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.05)"}
      />
    );
  }

  return (
    <View style={[styles.wrapper, { backgroundColor: bgColor }]}>
      <Svg width="100%" height="100%">
        <Rect x="0" y="0" width="100%" height="100%" fill={bgColor} />
      </Svg>

      <Animated.View style={[styles.sunburst, { transform: [{ rotate }] }]}>
        <Svg width={SIZE} height={SIZE}>{rayElements}</Svg>
      </Animated.View>

      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  sunburst: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    top: -SIZE / 3,
    left: -SIZE / 3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
});