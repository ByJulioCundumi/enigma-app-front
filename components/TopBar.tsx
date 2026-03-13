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
import { LinearGradient } from "expo-linear-gradient";
import SettingsButton from "./SettingsButton";

const { width } = Dimensions.get("window");

interface Props {
  lives?: number;
}

export default function TopBar({ lives = 253 }: Props) {
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
        
        {/* IZQUIERDA */}
        <View style={styles.leftGroup}>
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

          <Stat value={lives} />
        </View>

        {/* DERECHA */}
        <RewardAdsButton />

      </View>
    </View>
  );
}

/* ================= REWARD ADS ================= */

const RewardAdsButton = () => {
  return (
    <TouchableOpacity activeOpacity={0.85}>
      <LinearGradient
        colors={["#db3859", "#f84868"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.adButton}
      >
        <MaterialCommunityIcons
          name="play-circle"
          size={18}
          color="#fff"
        />

        <Text style={styles.adText}>ADS</Text>

        <View style={styles.rewardBadge}>
          <Text style={styles.rewardText}>+5</Text>
          <FontAwesome6 name="bolt-lightning" size={10} color="#fff" />
        </View>
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

const Stat = ({ value }: any) => {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.statBadge}>
      
      <View style={styles.energyIcon}>
        <FontAwesome6 name="bolt-lightning" size={9} color="#fff" />
      </View>

      <Text style={styles.statText}>{formatNumber(value)}</Text>

      <View style={styles.plusButton}>
        <Ionicons name="add" size={12} color="#fff" />
      </View>

    </TouchableOpacity>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 30,
    width: "100%",
    alignItems: "center",
    zIndex: 20,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.95,
    borderRadius: 28,
    paddingHorizontal: 12,
    backgroundColor: "rgba(17, 24, 39, 0)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0)",
  },

  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ENERGIA */

  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#df405d",
    borderWidth: 1,
    borderColor: "rgba(255,92,124,0.35)",
    gap: 6,
  },

  energyIcon: {
    width: 17.5,
    height: 17.5,
    borderRadius: 10,
    backgroundColor: "#be2a45",
    alignItems: "center",
    justifyContent: "center",
  },

  statText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#fff",
  },

  plusButton: {
    marginLeft: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#b41633",
    alignItems: "center",
    justifyContent: "center",
  },

  /* REWARD ADS */

  adButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    shadowColor: "#ff2d55",
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },

  adText: {
    fontWeight: "800",
    fontSize: 12,
    color: "#fff",
  },

  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },

  rewardText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
  },
});
