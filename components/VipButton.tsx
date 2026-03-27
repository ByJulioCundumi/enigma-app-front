import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { openVipModal, closeVipModal } from "@/store/reducers/vipSlice";
import { playSound } from "@/hooks/playSound";
import { useIAP } from "@/hooks/useIAP";

interface Props {
  onBuyGame?: () => void;
}

export default function VipButton({ onBuyGame }: Props) {
  const dispatch = useDispatch();
  const { buyVIP, restoreVIP } = useIAP();

  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);

  const { isVipModalOpen, isVip } = useSelector(
    (state: IRootState) => state.vip
  );

  const { language } = useSelector(
    (state: IRootState) => state.language
  );

  const isEs = language === "es";

  // 🛒 COMPRAR
  const handleBuy = async () => {
    if (loadingBuy) return;

    playSound(require("@/assets/sounds/soundWind.mp3"));
    setLoadingBuy(true);

    try {
      await buyVIP();
      onBuyGame?.();
    } catch (e) {
      console.log("Compra cancelada o error");
    } finally {
      setLoadingBuy(false);
    }
  };

  // 🔄 RESTAURAR
  const handleRestore = async () => {
    if (loadingRestore) return;

    playSound(require("@/assets/sounds/soundWind.mp3"));
    setLoadingRestore(true);

    try {
      await restoreVIP();
    } catch (e) {
      console.log("Error restaurando");
    } finally {
      setLoadingRestore(false);
    }
  };

  return (
    <>
      {/* BOTÓN VIP */}
      <TouchableOpacity
        style={styles.vipButton}
        activeOpacity={0.9}
        onPress={() => {
          dispatch(openVipModal());
          playSound(require("@/assets/sounds/soundWind.mp3"));
        }}
      >
        <View style={styles.glow} />

        {!isVip ? (
          <FontAwesome5
            name="shopping-basket"
            size={17}
            color="#FFD700"
            style={{ marginTop: -4 }}
          />
        ) : (
          <MaterialCommunityIcons
            name="crown"
            size={20}
            color="#FFD700"
            style={{ marginTop: -2 }}
          />
        )}

        {!isVip && (
          <View style={styles.badge}>
            <Text numberOfLines={1} style={styles.badgeText}>
              $11.99
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* MODAL */}
      <Modal visible={isVipModalOpen} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => dispatch(closeVipModal())}
        >
          <Pressable style={styles.popup}>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {isEs ? "Jugador VIP" : "VIP Player"}
              </Text>

              <Text style={styles.subtitle}>
                {isVip
                  ? isEs
                    ? "Ya eres VIP 🎉"
                    : "You are already VIP 🎉"
                  : isEs
                  ? "Desbloquea la mejor experiencia de juego"
                  : "Unlock the ultimate gaming experience"}
              </Text>
            </View>

            {/* BENEFICIOS */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitCard}>
                <Ionicons name="infinite" size={18} color="#22c55e" />
                <Text style={styles.benefitTitle}>
                  {isEs ? "Energía ilimitada" : "Unlimited energy"}
                </Text>
              </View>

              <View style={styles.benefitCard}>
                <Ionicons name="ban" size={18} color="#FFD700" />
                <Text style={styles.benefitTitle}>
                  {isEs ? "Sin anuncios" : "No ads"}
                </Text>
              </View>

              <View style={styles.benefitCard}>
                <MaterialCommunityIcons
                  name="palette"
                  size={18}
                  color="#5cacf6"
                />
                <Text style={styles.benefitTitle}>
                  {isEs ? "Temáticas exclusivas" : "Exclusive themes"}
                </Text>
              </View>

              <View style={styles.benefitCard}>
                <MaterialCommunityIcons
                  name="crown"
                  size={18}
                  color="#FFD700"
                />
                <Text style={[styles.benefitTitle, { color: "#FFD700" }]}>
                  {isEs ? "VIP para siempre" : "VIP forever"}
                </Text>
              </View>
            </View>

            {/* BOTÓN COMPRAR */}
            {!isVip && (
              <>
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={handleBuy}
                  disabled={loadingBuy}
                >
                  {loadingBuy ? (
                    <ActivityIndicator color="black" />
                  ) : (
                    <>
                      <MaterialIcons
                        name="local-offer"
                        size={18}
                        color="black"
                      />
                      <Text style={styles.buyText}>
                        {isEs
                          ? "Comprar por $11.99"
                          : "Buy for $11.99"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* RESTAURAR */}
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={handleRestore}
                  disabled={loadingRestore}
                >
                  {loadingRestore ? (
                    <ActivityIndicator color="#cc9e20" />
                  ) : (
                    <Text style={styles.restoreText}>
                      {isEs
                        ? "Restaurar compra"
                        : "Restore purchase"}
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* MENSAJE SI YA ES VIP */}
            {isVip && (
              <View style={styles.vipMessageContainer}>
                <Text style={styles.vipMessage}>
                  {isEs
                    ? "Gracias por apoyar el juego ❤️"
                    : "Thanks for supporting the game ❤️"}
                </Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  vipButton: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: "#0b0b1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
  },

  glow: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 60,
    backgroundColor: "rgba(255,215,0,0.18)",
  },

  badge: {
  position: "absolute",
  bottom: -8,
  backgroundColor: "#FFD700",
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 10,
  alignSelf: "flex-start", // 👈 importante
},
  
  badgeText: {
  fontSize: 10,
  fontWeight: "900",
  color: "#1a1a1a",
  includeFontPadding: false,
},

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    padding: 22,
  },

  popup: {
    backgroundColor: "#0f172a",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "#FFD700",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    color: "#FFD700",
    fontSize: 24,
    fontWeight: "900",
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 13,
    textAlign: "center",
  },

  benefitsContainer: {
    gap: 12,
    marginBottom: 20,
  },

  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#1B273E",
    padding: 14,
    borderRadius: 14,
  },

  benefitTitle: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },

  buyButton: {
    backgroundColor: "#ffc400",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },

  buyText: {
    color: "#161616",
    fontWeight: "900",
  },

  restoreButton: {
    alignItems: "center",
    padding: 10,
  },

  restoreText: {
    color: "#cc9e20",
    fontWeight: "700",
  },

  vipMessageContainer: {
    marginTop: 10,
    alignItems: "center",
  },

  vipMessage: {
    color: "#FFD700",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 13,
  },
});