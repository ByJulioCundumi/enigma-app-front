import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import {
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CONTAINER_WIDTH = width * 0.92;

interface Props {
  lives?: number;
  coins?: number;
  level?: number;
}

export default function TopBar({
  lives = 253,
  coins = 221,
  level = 27,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* ===== LEFT: LEVEL CIRCLE ===== */}
        <View style={styles.leftContainer}>
          <TouchableOpacity activeOpacity={0.85}>
            <LinearGradient
              colors={["#6366F1", "#ffbb00", "#6366F1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.levelOuter}
            >
              <View style={styles.levelInner}>
                <Text style={styles.levelText}>Lv.{level}</Text>
              </View>
            </LinearGradient>

            {/* ⭐ LEVEL ICON BADGE */}
            <View style={styles.levelIconBadge}>
              <LinearGradient
                colors={["#041c49", "#041c49"]}
                style={styles.levelIconInner}
              >
                <FontAwesome6 name="ranking-star" size={8} color="#FFD700" />
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>

        {/* ===== CENTER: STATS ===== */}
        <View style={styles.statsContainer}>
          <Stat
            type="lives"
            icon={
              <FontAwesome6
                name="heart-circle-bolt"
                size={17}
                color="#ff5c7c"
              />
            }
            value={lives}
          />
          <Stat
            type="coins"
            icon={<FontAwesome5 name="coins" size={16} color="#FBBF24" />}
            value={coins}
          />
        </View>

        {/* ===== RIGHT: REWARD BUTTON ===== */}
        <TouchableOpacity style={styles.rewardButton} activeOpacity={0.85}>
          <View style={styles.rewardContent}>
            <MaterialCommunityIcons
              name="movie-open-play"
              size={18}
              color="#FFC83D"
            />
            <FontAwesome5 name="coins" size={12} color="#FFC83D" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ============================= */
/*        STAT COMPONENT         */
/* ============================= */

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
};

const Stat = ({ icon, value, type }: any) => {
  const isLives = type === "lives";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.statBadge,
        isLives ? styles.livesBadge : styles.coinsBadge,
      ]}
    >
      {icon}
      <Text style={styles.statText} numberOfLines={1}>
        {formatNumber(value)}
      </Text>
      <View style={[styles.plusButton, isLives && styles.plusLives]}>
        <Ionicons name="add" size={12} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
};

/* ============================= */
/*            STYLES             */
/* ============================= */

const LEVEL_SIZE = 46;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 55 : 40,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: CONTAINER_WIDTH,
    height: 64,
    borderRadius: 26,
    paddingHorizontal: 14,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  leftContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: LEVEL_SIZE,
    marginRight: 2,
  },

  /* LEVEL CIRCLE */

  levelOuter: {
    width: LEVEL_SIZE,
    height: LEVEL_SIZE,
    borderRadius: LEVEL_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
  },

  levelInner: {
    width: LEVEL_SIZE - 6,
    height: LEVEL_SIZE - 6,
    borderRadius: (LEVEL_SIZE - 6) / 2,
    backgroundColor: "#041c49",
    justifyContent: "center",
    alignItems: "center",
  },

  levelText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
  },

  /* LEVEL ICON BADGE */

  levelIconBadge: {
    position: "absolute",
    top: -0,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  levelIconInner: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgb(255, 196, 0)",
  },

  /* STATS */

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 20,
    minWidth: 55,
  },

  livesBadge: {
    backgroundColor: "rgba(241,96,123,0.18)",
    borderWidth: 1,
    borderColor: "rgba(223,94,118,0.38)",
  },

  coinsBadge: {
    backgroundColor: "rgba(251,191,36,0.15)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.4)",
  },

  statText: {
    marginLeft: 5,
    fontSize: 11.5,
    fontWeight: "900",
    color: "#fff",
  },

  plusButton: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
  },

  plusLives: {
    backgroundColor: "#ff5c7c",
  },

  /* REWARD BUTTON */

  rewardButton: {
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: "#FFD700",
  },

  rewardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  rewardText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFD700",
    letterSpacing: 0.5,
  },
});