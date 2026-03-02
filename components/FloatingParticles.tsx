import React, { useEffect } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const PARTICLES = 10;

const AnimatedView =
  Animated.createAnimatedComponent(View);

export default function FloatingParticles() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { pointerEvents: "none" },
      ]}
    >
      {Array.from({ length: PARTICLES }).map(
        (_, index) => (
          <Particle key={index} />
        )
      )}
    </View>
  );
}

/* ========================== */
/* ===== PARTICLE ===== */
/* ========================== */

function Particle() {
  const progress = useSharedValue(0);
  const startX = useSharedValue(Math.random() * width);
  const drift = useSharedValue((Math.random() - 0.5) * 60);
  const rotationOffset = useSharedValue(
    (Math.random() - 0.5) * 180
  );

  const size = 14 + Math.random() * 10;

  const startAnimation = () => {
    startX.value = Math.random() * width;
    drift.value = (Math.random() - 0.5) * 60;

    // Nueva rotación aleatoria por ciclo
    rotationOffset.value =
      (Math.random() - 0.5) * 360;

    progress.value = 0;

    progress.value = withTiming(
      1,
      {
        duration:
          8000 + Math.random() * 10000,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) {
          runOnJS(startAnimation)();
        }
      }
    );
  };

  useEffect(() => {
    const randomDelay =
      Math.random() * 3000;

    const timeout = setTimeout(() => {
      startAnimation();
    }, randomDelay);

    return () => clearTimeout(timeout);
  }, []);

  const animatedStyle =
    useAnimatedStyle(() => {
      const translateY = interpolate(
        progress.value,
        [0, 1],
        [height + 80, -150]
      );

      const translateX = interpolate(
        progress.value,
        [0, 1],
        [startX.value, startX.value + drift.value]
      );

      const opacity = interpolate(
        progress.value,
        [0, 0.1, 0.9, 1],
        [0, 0.9, 0.9, 0]
      );

      const scale = interpolate(
        progress.value,
        [0, 1],
        [0.7, 1.3]
      );

      // 🔥 Rotación suave
      const rotate = interpolate(
        progress.value,
        [0, 1],
        [rotationOffset.value, rotationOffset.value + 180]
      );

      return {
        position: "absolute",
        transform: [
          { translateX },
          { translateY },
          { scale },
          { rotate: `${rotate}deg` },
        ],
        opacity,
      };
    });

  return (
    <AnimatedView style={animatedStyle}>
      <Svg
        width={size}
        height={size * 1.3}
        viewBox="0 0 24 24"
      >
        <Path
          d="M12 2C7.6 2 4.5 5.1 4.5 8.7H7.2C7.2 6.5 9 4.8 11.8 4.8C14.6 4.8 16.4 6.5 16.4 8.4C16.4 10.1 15.3 11 13.9 11.8C12.1 12.8 11 14 11 16.2V17H13.5V16.3C13.5 14.9 14.3 14.1 15.8 13.2C17.6 12.1 19 10.7 19 8.5C19 5 16 2 12 2ZM11 19.5C11 20.3 11.7 21 12.5 21C13.3 21 14 20.3 14 19.5C14 18.7 13.3 18 12.5 18C11.7 18 11 18.7 11 19.5Z"
          fill="rgba(255, 206, 72, 0.85)"
        />
      </Svg>
    </AnimatedView>
  );
}