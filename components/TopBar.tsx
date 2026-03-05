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
} from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "@/store/rootState";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { useRouter } from "expo-router";
import Profile from "./Profile";
import VipButton from "./VipButton";
import SettingsButton from "./SettingsButton";

const { width } = Dimensions.get("window");

interface Props {
  lives?: number;
  coins?: number;
}

export default function TopBar({
  lives = 253,
  coins = 221,
}: Props) {
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

        {/* PERFIL */}
        <Profile />
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
});