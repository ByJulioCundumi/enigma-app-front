import React, { useEffect, useState } from "react";
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
import { openVipModal, closeVipModal, setVip } from "@/store/reducers/vipSlice";
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { useVipIAP } from "@/hooks/useVipIAP";

interface Props {
  onBuyGame?: () => void;
}

export default function VipButton({ onBuyGame }: Props) {
  const { 
  buyVip, 
  restoreVipPurchases, 
  products,
  error,
  success,
  clearMessages
} = useVipIAP();
  const dispatch = useDispatch();
  const windSound = useSoundEffect(require("@/assets/sounds/soundWind.mp3"));

  const [loadingBuy, setLoadingBuy] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);

  const { isVipModalOpen, isVip } = useSelector(
    (state: IRootState) => state.vip
  );

  const { language } = useSelector(
    (state: IRootState) => state.language
  );

  const isEs = language === "es";

  const vipProduct = products.find(p => p.id === "enigma_vip_unlock");

  useEffect(() => {
  if (error || success) {
    const timer = setTimeout(() => {
      clearMessages();
    }, 2500);

    return () => clearTimeout(timer);
  }
}, [error, success]);

  // 🛒 COMPRAR
  const handleBuy = async () => {
    if (loadingBuy) return;

    windSound.play();
    setLoadingBuy(true);

    try {
      await buyVip(); // ✅ AQUÍ
    } catch (e) {
      console.log("Compra cancelada o error");
    } finally {
      setLoadingBuy(false);
    }
  };

  // 🔄 RESTAURAR
  const handleRestore = async () => {
    if (loadingRestore) return;

    windSound.play();
    setLoadingRestore(true);

    try {
      await restoreVipPurchases(); // ✅ AQUÍ
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
          clearMessages(); // 👈 agrega esto
          dispatch(openVipModal());
          windSound.play();
        }}
      >
        <View style={styles.glow} />

        {!isVip ? (
          <FontAwesome5
            name="shopping-basket"
            size={14}
            color="#FFD700"
            style={{ marginTop: -2.5 }}
          />
        ) : (
          <MaterialCommunityIcons
            name="badge-account-outline"
            size={20}
            color="#FFD700"
            style={{ marginTop: 0 }}
          />
        )}

        {
          !isVip &&
          <View style={styles.badge}>
             <MaterialIcons name="sell" size={10} color="black" />
             <Text style={styles.badgeText}>
                Plus
              </Text>
          </View>
        }
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
                <View style={{flexDirection: "row", alignItems: "center", gap:5}}>
              <MaterialCommunityIcons
                  name="crown"
                  size={24}
                  color="#FFD700"
                  style={{marginTop: -7}}
                />
              <Text style={styles.title}>
                {isEs ? "Jugador VIP" : "VIP Player"}
              </Text>
                </View>

              <Text style={styles.subtitle}>
                {!isVip
                  ? isEs
                    ? "Desbloquea la mejor experiencia de juego"
                    : "Unlock the ultimate gaming experience"
                  : isEs
                  ? "Disfruta la mejor experiencia de juego"
                  : "Enjoy the ultimate gaming experience"}
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
                          ? `Comprar por ${vipProduct?.displayPrice || "$9.99"}`
                          : `Buy for ${vipProduct?.displayPrice || "$9.99"}`
                        } 
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

            {(error || success) && (
              <View style={styles.vipMessageContainer}>
                <Text
                  style={[
                    styles.vipMessage,
                    { color: error ? "#ef4444" : "#22c55e" } // rojo o verde
                  ]}
                >
                  {error || success}
                </Text>

                <TouchableOpacity onPress={clearMessages}>
                  <Text style={{ color: "#888", fontSize: 11, marginTop: 4 }}>
                    OK
                  </Text>
                </TouchableOpacity>
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
    width: 33,
    height: 33,
    borderRadius: 50,
    backgroundColor: "#0b0b1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700",
  },

  glow: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  badge: {
  position: "absolute",
  bottom: -8,
  backgroundColor: "#FFD700",
  paddingHorizontal: 7,
  paddingVertical: 1.5,
  borderRadius: 10,
  flexDirection: "row",
  alignSelf: "flex-start", // 🔥 clave
  width: 43.5,
  marginLeft: -7,
  alignItems: "center",
  gap: 2
},

badgeText: {
  fontSize: 9,
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
    marginBottom: 10,
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
  marginTop: 12,
  alignItems: "center",
  backgroundColor: "#020617",
  padding: 10,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "#334155",
},

vipMessage: {
  fontWeight: "800",
  textAlign: "center",
  fontSize: 13,
},
});