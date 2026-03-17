import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { FontAwesome6, Octicons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import VipButton from "./VipButton";
import { useSelector } from "react-redux";

import { IRootState } from "@/store/rootState";
import {
  selectCurrentLevel,
  selectCurrentTopic,
} from "@/store/selectors/topicSelectors";

const { width } = Dimensions.get("window");

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

  const description = levelData?.description ?? "";
  const image = levelData?.image;
  const category = topic?.name ?? "";

  const currentLevelIndex = topicProgress?.currentLevel ?? 0;
  const level = currentLevelIndex + 1;

  const totalLevels = topic?.levels.length ?? 0;

  const levelText =
    selectedTopicId === "random"
      ? `${level}`
      : `${currentLevelIndex}/${totalLevels}`;

  const cardSize = { width: width * 0.9, height: 230 }

  const [showHint, setShowHint] = useState(false);
  const slideAnim = useRef(new Animated.Value(-250)).current;

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
        {image && <Image source={image} style={styles.image} />}

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />

        {/* Nivel */}
        <View style={styles.levelBadge}>
          <FontAwesome6 name="ranking-star" size={16} color="#ffc400" />
          <Text style={styles.levelText}>{levelText}</Text>
        </View>

        {/* Botón de pista */}
        <TouchableOpacity style={styles.hintButton} onPress={toggleHint}>
          <Ionicons name="information-circle" size={28} color="#fff" />
          {
            !showHint && <Text style={{color: "#fff"}}>Pista</Text>
          }
        </TouchableOpacity>

        {/* Panel deslizante */}
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
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: "#000",
  },

  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },

  gradient: {
    ...StyleSheet.absoluteFillObject,
  },

  categoryBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  categoryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  levelBadge: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#151518",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "#ffc400"
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
    gap: 3
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
  },

  hintText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});