import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const CONFETTI_COUNT = 20;

// 🎨 Paleta tipo juego
const COLORS = [
  "#ff3b30", // rojo
  "#ff9500", // naranja
  "#ffcc00", // amarillo
  "#34c759", // verde
  "#007aff", // azul
  "#5856d6", // morado
  "#ff2d55", // rosa
  "#ffffff", // blanco (para brillo)
];

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function ConfettiBurst({ active }: { active: boolean }) {
  const particles = useRef(
    Array.from({ length: CONFETTI_COUNT }).map(() => {
      const startX = random(0, width);

      return {
        startX,
        color: randomColor(), // 🎨 color único
        x: new Animated.Value(startX),
        y: new Animated.Value(-20),
        rotate: new Animated.Value(0),
        scale: new Animated.Value(random(0.7, 1.3)),
        opacity: new Animated.Value(1),
      };
    })
  ).current;

  useEffect(() => {
    if (!active) return;

    const animations = particles.map((p) =>
      Animated.parallel([
        Animated.timing(p.y, {
          toValue: height + 40,
          duration: random(2000, 3200),
          useNativeDriver: true,
        }),
        Animated.timing(p.x, {
          toValue: p.startX + random(-100, 100),
          duration: random(2000, 3200),
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: 1,
          duration: random(1500, 2800),
          useNativeDriver: true,
        }),
        Animated.timing(p.opacity, {
          toValue: 0,
          duration: random(2200, 3200),
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(30, animations).start();
  }, [active]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((p, i) => {
        const rotate = p.rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                backgroundColor: p.color, // 🎨 color aplicado
                opacity: p.opacity,
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { rotate },
                  { scale: p.scale },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: "absolute",
    width: 6,
    height: 10,
    borderRadius: 2,
    zIndex: 200
  },
});