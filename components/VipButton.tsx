import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { setVipLocal } from "@/store/reducers/vipSlice";

const { width } = Dimensions.get("window");

export default function VipButton({ onRestore }: any) {
  const dispatch = useDispatch();

  const { isVip, endDate } = useSelector((state: any) => state.vip);

  const [visible, setVisible] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true
        })
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  /* -------- SIMULAR COMPRA -------- */
  const handleBuy = () => {
    const now = Date.now();
    const month = 1000 * 60 * 60 * 24 * 30;

    dispatch(
      setVipLocal({
        startDate: now,
        endDate: now + month
      })
    );
  };

  /* -------- RESTORE -------- */
  const handleRestore = async () => {
    if (!onRestore) return;

    try {
      setRestoring(true);
      await onRestore();
    } catch (e) {
      console.log("Error restaurando compra:", e);
    } finally {
      setRestoring(false);
    }
  };

  /* -------- FORMATEAR FECHA -------- */
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* BOTÓN VIP */}
      <TouchableOpacity
        style={styles.vipButton}
        activeOpacity={0.9}
        onPress={() => setVisible(true)}
      >
        <View style={styles.glow} />

        <MaterialCommunityIcons
          name="gamepad-variant-outline"
          size={20}
          color="#ffc400"
          style={{marginTop: -2}}
        />

        {!isVip ? 
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              VIP: $1.19
            </Text>
          </View>
          :
          <View style={styles.badgeVip}>
            <Text style={styles.badgeText}>
              <MaterialCommunityIcons name="account-check-outline" size={12} color="black" /> VIP
            </Text>
          </View>
        }
        
      </TouchableOpacity>

      {/* MODAL */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>

            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.modalContainer,
                  {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim
                  }
                ]}
              >
                <LinearGradient
                  colors={["#0f172a", "#0f172a", "#0f172a"]}
                  style={styles.modal}
                >
                  <View style={styles.topGlow} />

                  {/* HEADER */}
                  <View style={styles.header}>
                    <View style={styles.crownWrapper}>
                      <MaterialCommunityIcons
                        name="crown"
                        size={36}
                        color="#ffc400"
                      />
                    </View>

                    <Text style={styles.title}>
                      {isVip ? "¡ERES JUGADOR VIP!" : "VIP PLAYER"}
                    </Text>

                    {!isVip && (
                      <View style={styles.bestValue}>
                        <Text style={styles.bestValueText}>
                          Únetenos ;)
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* CONTENIDO */}
                  {isVip ? (
                    <>
                      <Text style={styles.subtitle}>
                        Disfruta de todos los beneficios
                      </Text>

                      <View style={styles.benefitsGrid}>
                        <BenefitCard icon="close-circle" text="Sin anuncios" />
                        <BenefitCard icon="flash" text="Energía infinita" />
                        <BenefitCard icon="star" text="Todo desbloqueado" />
                      </View>

                      <Text style={styles.expireText}>
                        Expira: {formatDate(endDate)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.subtitle}>
                        Desbloquea la mejor experiencia de juego
                      </Text>

                      <View style={styles.benefitsGrid}>
                        <BenefitCard icon="close-circle" text="Sin anuncios" />
                        <BenefitCard icon="flash" text="Energía infinita" />
                        <BenefitCard icon="star" text="Tematicas exclusivas" />
                      </View>

                      <View style={styles.priceContainer}>
                        <Text style={styles.priceBig}>$1.19</Text>
                        <Text style={styles.priceSmall}>/ mes</Text>
                      </View>

                      <Text style={styles.guarantee}>
                        Cancela en cualquier momento
                      </Text>

                      {/* COMPRAR */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.buyButton}
                        onPress={handleBuy}
                      >
                        <LinearGradient
                          colors={["#FFD700", "#FFB800", "#FFA500"]}
                          style={styles.buyGradient}
                        >
                          <Text style={styles.buyText}>
                            ACTIVAR VIP
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      {/* RESTORE */}
                      <View style={styles.restoreContainer}>
                        <Text style={styles.restoreText}>
                          ¿Ya compraste VIP?
                        </Text>

                        <TouchableOpacity
                          onPress={handleRestore}
                          disabled={restoring}
                          style={styles.restoreButton}
                        >
                          {restoring ? (
                            <ActivityIndicator color="#ffc400" />
                          ) : (
                            <>
                              <MaterialCommunityIcons
                                name="restore"
                                size={18}
                                color="#ffc400"
                              />
                              <Text style={styles.restoreButtonText}>
                                Restaurar compra
                              </Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </LinearGradient>
              </Animated.View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

/* ---------- COMPONENTE BENEFICIO ---------- */
function BenefitCard({ icon, text }: any) {
  return (
    <View style={styles.benefitCard}>
      <MaterialCommunityIcons name={icon} size={18} color="#ffc400" />
      <Text style={styles.benefitCardText}>{text}</Text>
    </View>
  );
}

/* ---------- ESTILOS ---------- */
const styles = StyleSheet.create({
  vipButton: {
    width: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: "#050c1d",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffc400",
    position: "absolute",
    top: 70,
    left: 25,
    elevation: 10
  },

  glow: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 60,
    backgroundColor: "rgba(255, 196, 0, 0.2)"
  },

  badge: {
    position: "absolute",
    bottom: -10,
    backgroundColor: "#ffc400",
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 10,
    width: 58,
    alignItems: "center"
  },

  badgeVip: {
    position: "absolute",
    bottom: -10,
    backgroundColor: "#ffc400",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    width: 45,
    alignItems: "center"
  },

  badgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#1e293b"
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center"
  },

  modalContainer: {
    width: "85%"
  },

  modal: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ffc400",
    overflow: "hidden"
  },

  topGlow: {
    position: "absolute",
    top: -40,
    alignSelf: "center",
    width: 200,
    height: 100,
    borderRadius: 100,
    backgroundColor: "rgba(255,215,0,0.15)"
  },

  header: {
    alignItems: "center",
    marginBottom: 10
  },

  crownWrapper: {
    backgroundColor: "rgba(255,215,0,0.1)",
    padding: 12,
    borderRadius: 50,
    marginBottom: 6
  },

  title: {
    color: "#ffc400",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1
  },

  bestValue: {
    marginTop: 6,
    backgroundColor: "#ffc400",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10
  },

  bestValueText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#1e293b"
  },

  subtitle: {
    color: "#cbd5f5",
    textAlign: "center",
    marginBottom: 18
  },

  benefitsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  benefitCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 196, 0, 0.2)"
  },

  benefitCardText: {
    color: "#e5e7eb",
    fontSize: 11,
    marginTop: 5,
    textAlign: "center"
  },

  priceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 10
  },

  priceBig: {
    color: "#ffc400",
    fontSize: 36,
    fontWeight: "900"
  },

  priceSmall: {
    color: "#94a3b8",
    marginLeft: 4,
    marginBottom: 6
  },

  buyButton: {
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 5
  },

  buyGradient: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 14
  },

  buyText: {
    color: "#1e293b",
    fontWeight: "900",
    fontSize: 16
  },

  guarantee: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 11,
    marginBottom: 10
  },

  expireText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 10
  },

  restoreContainer: {
    marginTop: 16,
    alignItems: "center"
  },

  restoreText: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 6
  },

  restoreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10
  },

  restoreButtonText: {
    color: "#ffc400",
    fontSize: 13,
    fontWeight: "600"
  }
});