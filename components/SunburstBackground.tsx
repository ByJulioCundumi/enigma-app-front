import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Dimensions, Easing } from "react-native";
import Svg, { Polygon } from "react-native-svg";

const { width, height } = Dimensions.get("screen");
const SIZE = Math.max(width, height) * 2;

type Props = {
  isSuccess?: boolean; // 👈 nueva prop
};

export default function SunburstBackground({ isSuccess = true }: Props) {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 60000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rays = 24;
  const angleStep = 360 / rays;

  // 🎨 Colores dinámicos
  const primaryColor = isSuccess
    ? "rgba(131, 255, 214, 0.12)" // azul
    : "rgba(255, 120, 120, 0.11)"; // rojo

  const secondaryColor = isSuccess
    ? "rgba(156, 255, 186, 0.03)" // verde/azulado
    : "rgba(255, 80, 80, 0.03)"; // rojo más suave

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
        fill={i % 2 === 0 ? primaryColor : secondaryColor}
      />
    );
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.sunburst,
        {
          transform: [
            { translateX: -SIZE / 2 },
            { translateY: -SIZE / 2 },
            { rotate },
          ],
        },
      ]}
    >
      <Svg width={SIZE} height={SIZE}>
        {rayElements}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sunburst: {
    position: "absolute",
    top: "30%",
    left: "57%",
    width: SIZE,
    height: SIZE,
  },
});