import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  trigger: boolean;
};

export default function WhiteFlashBurst({ trigger }: Props) {
  const scale = useRef(new Animated.Value(0.2)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!trigger) return;

    // reset
    scale.setValue(0.2);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(scale, {
        toValue: 2.5, // 🔥 expansión fuerte
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
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