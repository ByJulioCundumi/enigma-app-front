import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Pressable,
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
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const AnimatedView = Animated.createAnimatedComponent(View);

export default function TopicsCta() {
  const float = useSharedValue(0);
  const sweep = useSharedValue(-200);
  const scale = useSharedValue(0.8);

  const [imageVisible, setImageVisible] = useState(false);

  const topic = "Naturaleza";

  const currentLevel = 20;
  const maxLevel = 100;
  const progress = (currentLevel / maxLevel) * 100;

  const mockImage =
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800";

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

  useEffect(() => {
    if (imageVisible) {
      scale.value = withTiming(1, { duration: 250 });
    } else {
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [imageVisible]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sweep.value }, { rotate: "18deg" }],
  }));

  const popupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <LinearGradient
           colors={["#0f172a00", "#1e293b46", "#312e81a0"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.card}
          >

        <View style={styles.content}>
          <Text style={styles.description}>
            Es una formación natural de la Tierra que puede expulsar lava,
            ceniza y gases.
          </Text>

          {/* 🔥 MINI IMAGEN */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setImageVisible(true)}
            style={styles.imageWrapper}
          >
            <Image source={{ uri: mockImage }} style={styles.thumbnail} />
          </TouchableOpacity>

          <View style={styles.levelProgressWrapper}>
            <View style={{flexDirection: "row", justifyContent: "space-between"}} >
              <Text style={styles.levelTitle}>Tema: Naturaleza</Text>
              <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.9} style={styles.buttonOuter}>
          <View style={styles.buttonInner}>
            <AnimatedView style={[styles.sweep, sweepStyle]} />
            <Text style={styles.buttonText}>Nivel: 28</Text>
          </View>
        </TouchableOpacity>

      </LinearGradient>

      {/* 🔥 POPUP IMAGEN */}
      <Modal
        visible={imageVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setImageVisible(false)}
        >
          <Animated.View style={[styles.popupContainer, popupStyle]}>
            <Image source={{ uri: mockImage }} style={styles.fullImage} />
          </Animated.View>
        </Pressable>
      </Modal>
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
    backgroundColor: "#03260363",
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "#8e82b07b",
    paddingTop: 30
  },

  content: {
    marginBottom: 18,
    gap: 10
  },

  description: {
    color: "#c7c7c7ea",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    borderRadius: 10,
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#ffffff10"
  },

  /* MINI IMAGEN */
  imageWrapper: {
    alignSelf: "center",
    marginBottom: 14,
    position: "absolute",
    top: -80,
  },

  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 58,
    borderWidth: 3,
    borderColor: "#ffc400bb",
  },

  /* POPUP */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  popupContainer: {
    width: width * 0.85,
    borderRadius: 20,
    overflow: "hidden",
  },

  fullImage: {
    width: "100%",
    height: width * 0.85,
    borderRadius: 20,
  },

  /* PROGRESO */
  levelProgressWrapper: {
    flexDirection: "column",
    gap: 6,
  },

  levelTitle: {
    color: "#d5b54a",
    fontWeight: "500",
    fontSize: 14.5,
  },

  progressBar: {
    width: "100%", 
    height: 5,
    backgroundColor: "#334053",
    borderRadius: 4,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#ffc400",
  },

  percentageText: {
    color: "#ffc400",
    fontWeight: "700",
    fontSize: 13,
  },

  buttonOuter: {
    backgroundColor: "#ffdd81",
    borderRadius: 24,
  },

  buttonInner: {
    backgroundColor: "#ffb300",
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