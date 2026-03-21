import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable
} from "react-native";
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { addEnergy } from "@/store/reducers/energySlice";
import { playSound } from "@/hooks/playSound";

const ENERGY_REWARD = 3;
const VIP_REWARD = 100;

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
};

export default function EnergyStat() {
  const dispatch = useDispatch();

  const energy = useSelector(
    (state: IRootState) => state.energy.energy
  );

  const { language } = useSelector(
    (state: IRootState) => state.language
  );

  const { hasPurchased } = useSelector(
    (state: IRootState) => state.purchase
  );

  const isEs = language === "es";

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👉 ANUNCIO (usuario normal)
  const watchAd = async () => {
    if (loading) return;

    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    dispatch(addEnergy(ENERGY_REWARD));

    setLoading(false);
    setVisible(false);
    playSound(require("@/assets/sounds/soundWind.mp3"));
  };

  // 👉 VIP (sin anuncio)
  const getVipEnergy = () => {
    dispatch(addEnergy(VIP_REWARD));
    setVisible(false);
    playSound(require("@/assets/sounds/soundWind.mp3"));
  };

  return (
    <>
      {/* BOTON ENERGIA */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.statBadge}
        onPress={() => {
          setVisible(true);
          playSound(require("@/assets/sounds/soundWind.mp3"));
        }}
      >
        <View style={styles.energyIcon}>
          <FontAwesome6 name="bolt-lightning" size={9} color="#fff" />
        </View>

        <Text style={styles.statText}>
          {formatNumber(energy)}
        </Text>

        <View style={styles.plusButton}>
          <Ionicons name="add" size={12} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* POPUP */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => {
            setVisible(false);
            playSound(require("@/assets/sounds/soundWind.mp3"));
          }}
        >
          <Pressable style={styles.popup}>

            {/* HEADER */}
            <View style={styles.header}>

              <View style={styles.energyCircle}>
                <FontAwesome6
                  name="bolt-lightning"
                  size={30}
                  color="#ffc400"
                />
              </View>

              <Text style={styles.title}>
                {isEs ? "Obtener Energía" : "Get Energy"}
              </Text>

              <Text style={styles.subtitle}>
                {hasPurchased
                  ? (isEs
                      ? "Beneficio VIP: obtén energía ilimitada"
                      : "VIP benefit: get unlimited energy")
                  : (isEs
                      ? "Mira un anuncio corto para continuar jugando"
                      : "Watch a short ad to keep playing")}
              </Text>
            </View>

            {/* RECOMPENSA */}
            <View style={styles.rewardCard}>
              <Text style={styles.rewardLabel}>
                {isEs ? "Recompensa" : "Reward"}
              </Text>

              <View style={styles.rewardRow}>
                <FontAwesome6
                  name="bolt-lightning"
                  size={20}
                  color="#ffd000"
                />

                <Text style={styles.rewardText}>
                  +{hasPurchased ? VIP_REWARD : ENERGY_REWARD}{" "}
                  {isEs ? "Energía" : "Energy"}
                </Text>
              </View>
            </View>

            {/* BOTON DINAMICO */}
            <TouchableOpacity
              style={[
                styles.watchButton,
                hasPurchased && styles.vipButton
              ]}
              onPress={hasPurchased ? getVipEnergy : watchAd}
              disabled={loading && !hasPurchased}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name={hasPurchased ? "crown" : "play-circle"}
                size={22}
                color="#1a1a1a"
              />

              <Text style={styles.watchText}>
                {hasPurchased
                  ? (isEs ? "Obtener Energía" : "Get Energy")
                  : (loading
                      ? (isEs ? "Cargando..." : "Loading...")
                      : (isEs ? "Ver anuncio" : "Watch ad"))}
              </Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({

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
    minWidth: 70
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

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 24,
  },

  popup: {
    backgroundColor: "#111827",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "#ffc400",
    shadowColor: "#ffc400",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },

  header: {
    alignItems: "center",
    marginBottom: 22,
  },

  energyCircle: {
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "#ffc400",
  },

  title: {
    color: "#ffd000",
    fontSize: 22,
    fontWeight: "900",
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },

  rewardCard: {
    backgroundColor: "#1a2233",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#FFD70033",
  },

  rewardLabel: {
    color: "#9ca3af",
    fontSize: 12,
    marginBottom: 6,
  },

  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  rewardText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFD700",
  },

  vipBadge: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "900",
    color: "#FFD700",
    backgroundColor: "#ffd000",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  watchButton: {
    flexDirection: "row",
    backgroundColor: "#ffd000",
    paddingVertical: 15,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    shadowColor: "#FFD700",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },

  vipButton: {
    backgroundColor: "#ffd000",
  },

  watchText: {
    color: "#1a1a1a",
    fontWeight: "900",
    fontSize: 16,
  },

});