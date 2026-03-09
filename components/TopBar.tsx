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
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "@/store/rootState";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { useRouter } from "expo-router";
import SettingsButton from "./SettingsButton";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface Props {
  lives?: number;
  level?: number;
}

export default function TopBar({ lives = 253, level = 27 }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { currentPage } = useSelector(
    (state: IRootState) => state.currentPage
  );

  const goToIndex = () => {
    router.push("/");
    dispatch(setCurrentPage("index"));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* IZQUIERDA DINÁMICA */}
        {currentPage === "index" ? (
          <SettingsButton />
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backButton}
            onPress={goToIndex}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        )}

        {/* STATS */}
        <View style={styles.statsContainer}>
          <Stat
            icon={
              <FontAwesome6
                name="bolt-lightning"
                size={15}
                color="#ff5c7c"
              />
            }
            value={lives}
            type="lives"
          />

          <Stat
            icon={
              <FontAwesome6
                name="ranking-star"
                size={12}
                color="#60a5fa"
              />
            }
            value={level}
            type="level"
          />
        </View>

        {/* BOTON REWARD ADS */}
        <RewardAdsButton />
      </View>
    </View>
  );
}

/* ================= REWARD ADS ================= */

const RewardAdsButton = () => {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.adWrapper}>
      <LinearGradient
        colors={["#ff5c7c", "#ff2d55"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.adButton}
      >
        <MaterialCommunityIcons name="movie-open-play" size={16} color="#fff" />

        <Text style={styles.adText}>+5</Text>

        <FontAwesome6 name="bolt-lightning" size={13} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );
};

/* ================= STAT ================= */

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
};

const Stat = ({ icon, value, type }: any) => {
  const isLives = type === "lives";
  const isLevel = type === "level";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.statBadge,
        isLives && styles.livesBadge,
        isLevel && styles.levelBadge,
      ]}
    >
      {icon}

      <Text style={styles.statText} numberOfLines={1}>
        {isLevel ? `Lv. ${value}` : formatNumber(value)}
      </Text>

      {isLives && (
        <View style={[styles.plusButton, styles.plusLives]}>
          <Ionicons name="add" size={10} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 45,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.95,
    height: 70,
    borderRadius: 28,
    paddingHorizontal: 12,
    backgroundColor: "rgba(17, 24, 39, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  statsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 6,
    marginRight: -32
  },

  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 20,
  },

  livesBadge: {
    backgroundColor: "rgba(255,92,124,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,92,124,0.35)",
  },

  levelBadge: {
    backgroundColor: "rgba(96,165,250,0.15)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.35)",
  },

  statText: {
    marginLeft: 4,
    fontSize: 11,
    fontWeight: "900",
    color: "#fff",
  },

  plusButton: {
    marginLeft: 6,
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  plusLives: {
    backgroundColor: "#ff5c7c",
  },

  adWrapper: {
    marginLeft: 6,
  },

  adButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#ff2d55",
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },

  adText: {
    fontWeight: "900",
    fontSize: 12,
    color: "#fff",
    letterSpacing: 0.8,
  },
});