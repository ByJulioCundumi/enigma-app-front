import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Profile() {
  // 🔥 Datos internos (luego puedes conectarlo a Redux)
  const level = 27;

  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.profileWrapper}>
      <LinearGradient
        colors={["#6366F1", "#8B5CF6", "#F59E0B"]}
        style={styles.profileOuter}
      >
        <View style={styles.profileInner}>
          <Image
            source={{
              uri: "https://api.dicebear.com/7.x/adventurer/png?seed=Julio",
            }}
            style={styles.avatar}
          />
        </View>
      </LinearGradient>

      {/* Badge de nivel */}
      <View style={styles.levelBadge}>
        <Text style={styles.levelText}>Lv {level}</Text>
      </View>
    </TouchableOpacity>
  );
}

const AVATAR_SIZE = 46;
const BADGE_SIZE = 18;

const styles = StyleSheet.create({
  profileWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },

  profileOuter: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    padding: 3,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },

  profileInner: {
    flex: 1,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    backgroundColor: "#0f172a",
  },

  avatar: {
    width: "100%",
    height: "100%",
  },

  levelBadge: {
    position: "absolute",
    bottom: -6,
    backgroundColor: "#111827",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8B5CF6",
  },

  levelText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#fff",
  },
});