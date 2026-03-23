import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Easing } from "react-native";

type Props = {
  trigger: boolean;
};

export default function WhiteFlashBurst({ trigger }: Props) {
  const scale = useRef(new Animated.Value(0.2)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (!trigger) return;

    // 🛑 detener animación anterior (clave para evitar glitch)
    animationRef.current?.stop();

    // 🔄 reset limpio
    scale.setValue(0.2);
    opacity.setValue(0);

    // 🚀 animación mejor sincronizada
    const animation = Animated.parallel([
      Animated.timing(scale, {
        toValue: 2.2,
        duration: 450,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 350,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animationRef.current = animation;

    animation.start(() => {
      // 🧼 asegurar estado final limpio
      opacity.setValue(0);
    });

    return () => {
      animation.stop();
    };
  }, [trigger]);

  return (
    <View pointerEvents="none" style={styles.wrapper}>
      <Animated.View
        style={[
          styles.flash,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  flash: {
    width: 220,
    height: 220,
    borderRadius: 200,
    backgroundColor: "#00ff7385",
  },
});