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
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "@/store/rootState";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

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
  const dispatch = useDispatch();
  const router = useRouter()
  const { currentPage } = useSelector(
    (state: IRootState) => state.currentPage
  );

  const goToIndex = () => {
    router.push("/")
    dispatch(setCurrentPage("index"));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>

        {/* IZQUIERDA DINÁMICA */}
        {currentPage === "index" && (
          <TouchableOpacity activeOpacity={0.85} style={styles.vipWrapper}>
            <LinearGradient
              colors={["#6366F1", "#8B5CF6", "#F59E0B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.vipOuter}
            >
              <View style={styles.vipInner}>
                <MaterialIcons
                  name="workspace-premium"
                  size={14}
                  color="#FBBF24"
                />
                <Text style={styles.vipText}>Hazte VIP</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {currentPage === "gameRoom" && (
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
                name="heart-circle-bolt"
                size={15}
                color="#ff5c7c"
              />
            }
            value={lives}
            type="lives"
          />
          <Stat
            icon={
              <FontAwesome5
                name="coins"
                size={14}
                color="#FBBF24"
              />
            }
            value={coins}
            type="coins"
          />
        </View>

        {/* LEVEL */}
        <TouchableOpacity activeOpacity={0.85} style={styles.levelWrapper}>
          <LinearGradient
            colors={["#6366F1", "#8B5CF6", "#F59E0B"]}
            style={styles.levelOuter}
          >
            <View style={styles.levelInner}>
              <Text style={styles.levelNumber}>{level}</Text>
            </View>

            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </View>
  );
}

/* ================= STAT ================= */

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
      <View
        style={[
          styles.plusButton,
          isLives && styles.plusLives,
        ]}
      >
        <Ionicons name="add" size={10} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

/* ================= STYLES ================= */

const LEVEL_SIZE = 44;
const BADGE_SIZE = 18;

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
    height: 64,
    borderRadius: 28,
    paddingHorizontal: 12,
    backgroundColor: "rgba(17, 24, 39, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  /* BOTÓN VOLVER */

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },

  /* VIP */

  vipWrapper: {
    height: 37,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: -5,
  },

  vipOuter: {
    height: 37,
    borderRadius: 22,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  vipInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 12,
    height: "100%",
    borderRadius: 20,
    backgroundColor: "#0f172a",
  },

  vipText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#FBBF24",
    letterSpacing: 0.5,
  },

  /* STATS */

  statsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 6,
  },

  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 32,
    borderRadius: 20,
  },

  livesBadge: {
    backgroundColor: "rgba(255,92,124,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,92,124,0.35)",
  },

  coinsBadge: {
    backgroundColor: "rgba(251,191,36,0.15)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.35)",
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
    backgroundColor: "#FBBF24",
    alignItems: "center",
    justifyContent: "center",
  },

  plusLives: {
    backgroundColor: "#ff5c7c",
  },

  /* LEVEL */

  levelWrapper: {
    width: LEVEL_SIZE,
    height: LEVEL_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },

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
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },

  levelNumber: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },

  levelBadge: {
    position: "absolute",
    bottom: 3,
    left: -5,
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    backgroundColor: "#140f2a",
    borderWidth: 1.5,
    borderColor: "#7852ff",
    justifyContent: "center",
    alignItems: "center",
  },

  levelBadgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "900",
  },
});