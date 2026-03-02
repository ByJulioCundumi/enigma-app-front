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
import { FontAwesome, FontAwesome6, SimpleLineIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const AnimatedView = Animated.createAnimatedComponent(View);

export default function TopicsCta() {
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
    scale.value = withTiming(imageVisible ? 1 : 0.8, { duration: 250 });
  }, [imageVisible]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: sweep.value }, { rotate: "18deg" }],
  }));

  const popupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.wrapper}>
      
      {/* TARJETA */}
      <LinearGradient
        colors={["#11657077", "#1e293b46", "#312e81a0"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.card}
      >
        <View style={styles.content}>
          
          {/* FILA IMAGEN + DESCRIPCIÓN */}
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setImageVisible(true)}
            >
              <View style={styles.thumbnailCard}>
                <Image source={{ uri: mockImage }} style={styles.thumbnail} />

                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.6)"]}
                  style={styles.thumbnailOverlay}
                />

                <View style={styles.questionBadge}>
                  <FontAwesome name="arrows-h" size={18} color="#091a52" />
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>
                Es una formación natural de la Tierra que puede expulsar lava,
                ceniza y gases.
              </Text>
            </View>
          </View>

          {/* PROGRESO */}
          <View style={styles.levelProgressWrapper}>
            <View style={styles.progressHeader}>
              <Text style={styles.levelTitle}>Tema:  {topic}</Text>
              <Text style={styles.percentageText}>
                0/100  <SimpleLineIcons name="present" size={14} color="#48ff8e" />
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* BOTÓN FUERA DE LA TARJETA */}
      <TouchableOpacity activeOpacity={0.9} style={styles.buttonOuter}>
        <View style={styles.buttonInner}>
          <AnimatedView style={[styles.sweep, sweepStyle]} />
          <Text style={styles.buttonText}>
            Jugar Enigma
          </Text>
        </View>
      </TouchableOpacity>

      {/* POPUP */}
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
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(21, 19, 49, 0.14)",
  },

  content: {
    gap: 10,
  },

  row: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  descriptionContainer: {
    flex: 1,
  },

  description: {
    color: "#e5e7eb",
    fontSize: 14,
    lineHeight: 20,
    padding: 12,
    backgroundColor: "#ffffff10",
    borderRadius: 12,
  },

  thumbnailCard: {
    width: 80,
    height: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffffff00",
  },

  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fff"
  },

  thumbnailOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "40%",
    borderRadius: 16,
  },

  questionBadge: {
    position: "absolute",
    bottom: 35,
    right: -12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  levelProgressWrapper: {
    gap: 6,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  levelTitle: {
    color: "#48ff8e",
    fontWeight: "600",
    fontSize: 14.5,
  },

  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "#30303091",
    borderRadius: 4,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#48ff8e",
  },

  percentageText: {
    display: "flex",
    color: "#48ff8e",
    fontWeight: "700",
    fontSize: 13,
    gap: 10
  },

  /* BOTÓN */
  buttonOuter: {
    marginTop: 18,
    width: width * 0.66,
    borderRadius: 24,
    shadowColor: "#6366f1",
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  buttonInner: {
    backgroundColor: "#5153ff",
    borderRadius: 16,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e7e7e7af",
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
  },
});