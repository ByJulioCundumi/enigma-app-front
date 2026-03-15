import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import VipButton from "./VipButton";

const { width } = Dimensions.get("window");

type Props = {
  description?: string;
  category?: string;
  level?: number;
  imageUrl?: string;
  isIndex?: boolean;
};

export default function LevelCard({
  description = "Este actor protagonizó Terminator y es un icono de acción de los 80",
  category = "Personajes",
  level = 12,
  imageUrl = `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 1000)}`,
  isIndex = true,
}: Props) {
  const cardSize = isIndex
    ? { width: width * 0.9, height: 230 }
    : { width: 400, height: 230 };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, cardSize]}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)"]}
          style={styles.gradient}
        />

        {/* Badge de categoría */}
        <View style={styles.categoryBadge}>
          <Octicons name="multi-select" size={12} color="#fff" />
          <Text style={styles.categoryText}>Tema: {category}</Text>
        </View>

        {/* Badge de nivel */}
        <View style={styles.levelBadge}>
          <FontAwesome6 name="ranking-star" size={16} color="#fff" />
          <Text style={styles.levelText}>{level}</Text>
        </View>

        {/* Descripción */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>

      <VipButton/>
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
    top: 60,
    left: 15,
    backgroundColor: "#f59e0b",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  levelText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  descriptionContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
  },

  descriptionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
  },
});