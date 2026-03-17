import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable
} from "react-native";
import { Entypo, FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { addEnergy } from "@/store/reducers/energySlice";

const ENERGY_REWARD = 3;

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
};

export default function EnergyStat() {
  const {isVip} = useSelector((state:IRootState)=>state.vip)
  const dispatch = useDispatch();

  const energy = useSelector(
    (state: IRootState) => state.energy.energy
  );

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const watchAd = async () => {

    if (loading) return;

    setLoading(true);

    // simulación anuncio
    await new Promise(resolve => setTimeout(resolve, 1500));

    dispatch(addEnergy(ENERGY_REWARD));

    setLoading(false);
    setVisible(false);

  };

  return (
    <>
      {/* BOTON ENERGIA */}

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.statBadge}
        onPress={() => {
          if (!isVip) setVisible(true);
        }}
      >
        
        <View style={styles.energyIcon}>
          <FontAwesome6 name="bolt-lightning" size={9} color="#fff" />
        </View>

        <Text style={styles.statText}>
          {!isVip ? formatNumber(energy) : <Entypo name="infinity" size={14} color="#fff" />}
        </Text>

        {
          !isVip && <View style={styles.plusButton}>
          <Ionicons name="add" size={12} color="#fff" />
        </View>
        }

      </TouchableOpacity>


      {/* POPUP */}

      <Modal visible={visible} transparent animationType="fade">

        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >

          <Pressable style={styles.popup}>

            {/* HEADER */}

            <View style={styles.header}>

              <View style={styles.energyCircle}>
                <FontAwesome6
                  name="bolt-lightning"
                  size={28}
                  color="#FFD54A"
                />
              </View>

              <Text style={styles.title}>
                Obtener Energía
              </Text>

              <Text style={styles.subtitle}>
                Mira un anuncio corto para continuar jugando
              </Text>

            </View>


            {/* RECOMPENSA */}

            <View style={styles.rewardCard}>

              <Text style={styles.rewardLabel}>
                Recompensa
              </Text>

              <View style={styles.rewardRow}>

                <FontAwesome6
                  name="bolt-lightning"
                  size={18}
                  color="#FFD54A"
                />

                <Text style={styles.rewardText}>
                  +{ENERGY_REWARD} Energía
                </Text>

              </View>

            </View>


            {/* BOTON */}

            <TouchableOpacity
              style={styles.watchButton}
              onPress={watchAd}
              disabled={loading}
            >

              <MaterialCommunityIcons
                name="play-circle"
                size={20}
                color="white"
              />

              <Text style={styles.watchText}>
                {loading ? "Cargando..." : "Ver anuncio"}
              </Text>

            </TouchableOpacity>


            {/* CANCELAR */}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}
            >

              <Text style={styles.cancelText}>
                Ahora no
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
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 24,
  },

  popup: {
    backgroundColor: "#162033",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "#2a3955",
  },

  header: {
    alignItems: "center",
    marginBottom: 18,
  },

  energyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#22304a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },

  rewardCard: {
    backgroundColor: "#1E2A44",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  rewardLabel: {
    color: "#94A3B8",
    fontSize: 12,
    marginBottom: 6,
  },

  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  rewardText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFD54A",
  },

  watchButton: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  watchText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },

  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },

  cancelText: {
    color: "#94A3B8",
    fontSize: 13,
  },

});