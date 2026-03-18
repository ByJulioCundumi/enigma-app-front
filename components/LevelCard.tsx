import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import VipButton from "./VipButton";
import { useSelector } from "react-redux";

import { IRootState } from "@/store/rootState";
import {
  selectCurrentLevel,
  selectCurrentTopic,
} from "@/store/selectors/topicSelectors";

const { width, height } = Dimensions.get("window");

type Props = {
  isIndex?: boolean;
};

export default function LevelCard({ isIndex = true }: Props) {
  const topic = useSelector(selectCurrentTopic);
  const levelData = useSelector(selectCurrentLevel);

  const selectedTopicId = useSelector(
    (state: IRootState) => state.topics.selectedTopic
  );

  const topicProgress = useSelector((state: IRootState) =>
    state.topics.progress[state.topics.selectedTopic]
  );

  const {language} = useSelector(
      (state: IRootState) => state.language
    );
  
  const isEs = language === "es";

  const description = levelData?.description ?? "";
  const image = levelData?.image;

  const currentLevelIndex = topicProgress?.currentLevel ?? 0;
  const level = currentLevelIndex + 1;

  const totalLevels = topic?.levels.length ?? 0;

  const levelText =
    selectedTopicId === "random"
      ? `${level}`
      : `${currentLevelIndex}/${totalLevels}`;

  const cardSize = { width: width * 0.9, height: 230 };

  const [showHint, setShowHint] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

  const [visible, setVisible] = useState(false);

  const toggleHint = () => {
    if (showHint) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setShowHint(false));
    } else {
      setShowHint(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, cardSize]}>

        {/* Imagen clickeable */}
        {image && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setVisible(true)}
            style={styles.imageContainer}
          >
            <Image source={image} style={styles.image} />
          </TouchableOpacity>
        )}

        {/* Overlay sin bloquear */}
        <LinearGradient
          pointerEvents="none"
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />

        {/* Nivel */}
        <View style={styles.levelBadge}>
          <FontAwesome6 name="ranking-star" size={14} color="#ffc400" />
          <Text style={styles.levelText}>{levelText}</Text>
        </View>

        {/* Botón pista */}
        <TouchableOpacity style={styles.hintButton} onPress={toggleHint}>
          <Ionicons name="information-circle" size={28} color="#fff" />
          {!showHint && <Text style={{ color: "#fff" }}>{isEs ? "Pista" : "Hint"}</Text>}
        </TouchableOpacity>

        {/* Panel pista */}
        {showHint && (
          <Animated.View
            style={[
              styles.hintPanel,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <Text style={styles.hintText}>{description}</Text>
          </Animated.View>
        )}
      </View>

      <VipButton />

      {/* 🔥 MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalBackground}>

            {/* Botón cerrar */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {/* Imagen */}
            <TouchableWithoutFeedback onPress={() => setVisible(false)}>
              <Image source={image} style={styles.fullImage} />
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
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
    backgroundColor: "#000",
  },

  imageContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },

  levelBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#050c1d7a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "#ffc400",
    zIndex: 3,
  },

  levelText: {
    color: "#ffc400",
    fontWeight: "800",
    fontSize: 14,
  },

  hintButton: {
    position: "absolute",
    bottom: 15,
    left: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    zIndex: 3,
  },

  hintPanel: {
    position: "absolute",
    bottom: 12,
    left: 60,
    maxWidth: 240,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    zIndex: 3,
  },

  hintText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },

  fullImage: {
    width: "90%",
    height: height,
    resizeMode: "contain",
  },

  // 🔥 botón cerrar pro
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 30,
    padding: 6,
  },
});