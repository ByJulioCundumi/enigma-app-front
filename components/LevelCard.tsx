import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import { IRootState } from "@/store/rootState";
import {
  selectCurrentLevel,
  selectCurrentTopic,
} from "@/store/selectors/topicSelectors";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function LevelCard() {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const topic = useSelector(selectCurrentTopic);
  const levelData = useSelector(selectCurrentLevel);

  const selectedTopicId = useSelector(
    (state: IRootState) => state.topics.selectedTopic
  );

  const topicProgress = useSelector((state: IRootState) =>
    state.topics.progress[state.topics.selectedTopic]
  );

  const currentLevelIndex = topicProgress?.currentLevel ?? 0;
  const level = currentLevelIndex + 1;

  const totalLevels = topic?.levels.length ?? 0;

  const cardSize = { width: width * 0.9, height: 260 };

  const clues = [
    { image: "https://picsum.photos/id/1025/600/600", text: "Mar" },
    { image: "https://picsum.photos/id/1011/600/600", text: "Agua" },
    { image: "https://picsum.photos/id/1080/600/600", text: "Comida" },
    { image: "https://picsum.photos/id/1069/600/600", text: "Pescar" },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, cardSize]}>

        {/* GRID */}
        <View style={styles.cluesContainer}>
          {clues.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.clueBox}
              activeOpacity={0.85}
              onPress={() => setSelectedImage(item.image)}
            >
              <ImageBackground
                source={{ uri: item.image }}
                style={styles.image}
                resizeMode="cover"
              >
                <View style={styles.imageBadge}>
                  <Text style={styles.clueText}>{item.text}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        {/* BADGE CENTRAL */}
        <View style={styles.badgeWrapper}>
          <View style={styles.badgeOuterRing}>
            <LinearGradient
              colors={["#fff7b0", "#e6b800", "#e6b800"]}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={styles.badgeCore}
            >
              <View style={styles.topGlow} />
              <View style={styles.sideGlow} />
              <Text style={styles.badgeText}>{level}</Text>
            </LinearGradient>
          </View>
        </View>

      </View>

      {/* 🔥 MODAL */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        
        {/* CLIC FUERA → CIERRA */}
        <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
          <View style={styles.modalOverlay}>

            {/* BOTÓN CERRAR */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedImage(null)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            {/* CONTENEDOR CENTRADO */}
            <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
              <View style={styles.imageContainer}>
                {selectedImage && (
                  <ImageBackground
                    source={{ uri: selectedImage }}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>

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
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#0b1225",
    justifyContent: "center",
    alignItems: "center",
  },

  cluesContainer: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  clueBox: {
    width: "48%",
    height: 90,
    borderRadius: 16,
    overflow: "hidden",
  },

  image: {
    flex: 1,
    justifyContent: "flex-end",
  },

  imageBadge: {
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingVertical: 6,
    alignItems: "center",
  },

  clueText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  badgeWrapper: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeOuterRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#c997003a",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 14,
  },

  badgeCore: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff6c2",
  },

  topGlow: {
    position: "absolute",
    top: 6,
    left: 10,
    width: 45,
    height: 18,
    backgroundColor: "rgba(255, 255, 255, 0.24)",
    borderRadius: 20,
  },

  sideGlow: {
    position: "absolute",
    bottom: 10,
    right: 12,
    width: 20,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
  },

  badgeText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#5a3b00",
  },

  // 🔥 MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "90%",
    height: "80%",
  },

  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 30,
  },
});