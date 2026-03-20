import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Switch
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";

import { activateVip, incrementAd, tickVip } from "@/store/reducers/vipSlice";
import { addEnergy } from "@/store/reducers/energySlice";
import { playSound } from "@/hooks/playSound";
import { restorePurchase, setPurchased } from "@/store/reducers/purchaseSlice";

interface Props {
  onWatchAd?: () => Promise<boolean>;
  onBuyGame?: () => void;
}

export default function VipButton({ onWatchAd, onBuyGame }: Props) {

  const REQUIRED_ADS = 3;
  const VIP_DURATION = 15 * 60;
  const ENERGY_REWARD = 15;

  const dispatch = useDispatch();

  const adsWatched = useSelector(
    (state: IRootState) => state.vip.adsWatched
  );

  const vipExpireAt = useSelector(
    (state: IRootState) => state.vip.vipExpireAt
  );

  const vipStartAt = useSelector(
    (state: IRootState) => state.vip.vipStartAt
  );

  const hasPurchased = useSelector(
    (state: IRootState) => state.purchase.hasPurchased
  );

  const vipActive = vipExpireAt !== null || hasPurchased;

  const { language } = useSelector(
    (state: IRootState) => state.language
  );

  const isEs = language === "es";

  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(VIP_DURATION);

  const [isPremiumMode, setIsPremiumMode] = useState(false);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {

      dispatch(tickVip());

      if (vipExpireAt) {
        const remaining = Math.max(
          0,
          Math.floor((vipExpireAt - Date.now()) / 1000)
        );
        setTimeLeft(remaining);
      } else {
        setTimeLeft(VIP_DURATION);
      }

    }, 1000);

    return () => clearInterval(interval);

  }, [vipExpireAt, vipStartAt]);

  const watchAd = async () => {

    if (adsWatched >= REQUIRED_ADS) return;

    let success = true;

    if (onWatchAd) {
      success = await onWatchAd();
    }

    if (!success) return;

    const newCount = adsWatched + 1;

    dispatch(incrementAd());

    if (newCount >= REQUIRED_ADS) {
      dispatch(activateVip());
      dispatch(addEnergy(ENERGY_REWARD));

      setVisible(false);
      playSound(require("@/assets/sounds/soundWind.mp3"));
    }
  };

  const handleBuy = () => {
    playSound(require("@/assets/sounds/soundWind.mp3"));
    dispatch(setPurchased()); // 🔥 simulado
    onBuyGame?.();
  };

  const handleRestore = () => {
    playSound(require("@/assets/sounds/soundWind.mp3"));
    dispatch(restorePurchase()); // 🔄 simulado
  };

  return (
    <>
      {/* BOTON VIP */}
      <TouchableOpacity
        style={styles.vipButton}
        activeOpacity={0.9}
        onPress={() => {
          setVisible(true)
          playSound(require("@/assets/sounds/soundWind.mp3"));
        }}
      >
        <View style={styles.glow} />

        <MaterialCommunityIcons
          name="crown"
          size={20}
          color="#FFD700"
        />

        <View style={styles.badge}>
          {hasPurchased ? (
            <Text style={styles.badgeText}>VIP</Text>
          ) : vipActive ? (
            <Text style={styles.badgeText}>
              {formatTime(timeLeft)}
            </Text>
          ) : (
            <Text style={styles.badgeText}>
              {adsWatched}/{REQUIRED_ADS}
            </Text>
          )}
        </View>
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
              <Text style={styles.title}>
                {isEs ? "Jugador VIP" : "VIP Player"}
              </Text>

              <Text style={styles.subtitle}>
                {hasPurchased
                  ? (isEs ? "Gracias por apoyar el juego ❤️" : "Thanks for supporting the game ❤️")
                  : (isEs ? "Elige cómo activar los beneficios" : "Choose how to activate perks")}
              </Text>
            </View>

            {/* 🔥 SOLO SI NO HA COMPRADO */}
            {!hasPurchased && (
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>
                  {isPremiumMode
                    ? (isEs ? "VIP Por Siempre" : "VIP Forever")
                    : (isEs ? "Modo gratis (15m)" : "Free mode (15m)")}
                </Text>

                <Switch
                  value={isPremiumMode}
                  onValueChange={setIsPremiumMode}
                  trackColor={{ false: "#555", true: "#555" }}
                  thumbColor={isPremiumMode ? "#ffffff" : "#fff"}
                />
              </View>
            )}

            {/* BENEFICIOS */}
            <View style={styles.benefitsContainer}>

              {!hasPurchased && !isPremiumMode ? (
                <>
                  <View style={styles.benefitCard}>
                    <Ionicons name="flash" size={18} color="#22c55e" />
                    <Text style={styles.benefitTitle}>
                      +{ENERGY_REWARD} {isEs ? "Energía" : "Energy"}
                    </Text>
                  </View>

                  <View style={styles.benefitCard}>
                    <Ionicons name="flash-outline" size={18} color="#FFD700" />
                    <Text style={styles.benefitTitle}>
                      {isEs ? "Energía x2" : "Energy x2"}
                    </Text>
                  </View>

                  <View style={styles.benefitCard}>
                    <MaterialCommunityIcons name="palette" size={18} color="#5cacf6" />
                    <Text style={styles.benefitTitle}>
                      {isEs ? "Temáticas exclusivas" : "Exclusive themes"}
                    </Text>
                  </View>

                  <View style={styles.benefitCard}>
                    <Ionicons name="ban" size={18} color="#60a5fa" />
                    <Text style={styles.benefitTitle}>
                      {isEs ? "Sin anuncios (15 Minutos)" : "No ads (15 Minutes)"}
                    </Text>
                  </View>
                </>
              ) : (
                <>
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
                    <MaterialCommunityIcons name="palette" size={18} color="#5cacf6" />
                    <Text style={styles.benefitTitle}>
                      {isEs ? "Temáticas exclusivas" : "Exclusive themes"}
                    </Text>
                  </View>

                  <View style={styles.benefitCard}>
                    <MaterialCommunityIcons name="crown" size={18} color="#FFD700" />
                    <Text style={[styles.benefitTitle, { color: "#FFD700" }]}>
                      {isEs ? "VIP para siempre" : "VIP forever"}
                    </Text>
                  </View>

                  {/* 🎉 MENSAJE EXPERIENCIA */}
                  {
                    hasPurchased && <View style={styles.vipMessageContainer}>
                    <Text style={styles.vipMessage}>
                      {isEs
                        ? "Disfruta la mejor experiencia de juego 🚀"
                        : "Enjoy the best gaming experience 🚀"}
                    </Text>
                  </View>
                  }
                </>
              )}
            </View>

            {/* BOTONES */}
            {/* BOTONES */}
{!hasPurchased && (
  <>
    {/* 🎥 VER ANUNCIO */}
    {!vipActive && !isPremiumMode && (
      <TouchableOpacity
        style={styles.watchButton}
        onPress={watchAd}
      >
        <Text style={styles.watchText}>
          {isEs ? "Ver anuncio" : "Watch ad"} {adsWatched}/{REQUIRED_ADS}
        </Text>
      </TouchableOpacity>
    )}

    {/* 💰 COMPRAR SOLO SI SWITCH ACTIVO */}
    {isPremiumMode && (
      <>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuy}
        >
          <Text style={styles.buyText}>
            {isEs ? "Comprar por $11.99" : "Buy for $11.99"}
          </Text>
        </TouchableOpacity>

        {/* 🔄 RESTORE */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
        >
          <Text style={styles.restoreText}>
            {isEs ? "Restaurar compra" : "Restore purchase"}
          </Text>
        </TouchableOpacity>
      </>
    )}
  </>
)}

          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({

  vipButton:{
    width:42,
    height:42,
    borderRadius:50,
    backgroundColor:"#0b0b1a",
    justifyContent:"center",
    alignItems:"center",
    borderWidth:2,
    borderColor:"#FFD700",
  },

  glow:{
    position:"absolute",
    width:55,
    height:55,
    borderRadius:60,
    backgroundColor:"rgba(255,215,0,0.18)"
  },

  badge:{
    position:"absolute",
    bottom:-8,
    backgroundColor:"#FFD700",
    paddingHorizontal:8,
    paddingVertical:2,
    borderRadius:10,
    minWidth:50,
    alignItems:"center",
  },

  badgeText:{
    fontSize:10,
    fontWeight:"900",
    color:"#1a1a1a"
  },

  overlay:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0.85)",
    justifyContent:"center",
    padding:22
  },

  popup:{
    backgroundColor:"#0f172a",
    borderRadius:28,
    padding:24,
    borderWidth:1.5,
    borderColor:"#FFD700",
  },

  header:{
    alignItems:"center",
    marginBottom:10
  },

  title:{
    color:"#FFD700",
    fontSize:24,
    fontWeight:"900"
  },

  subtitle:{
    color:"#cbd5e1",
    fontSize:13,
    textAlign:"center",
  },

  timerCard:{
    backgroundColor:"#1a2233",
    borderRadius:16,
    padding:5,
    paddingHorizontal:20,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:10,
    borderWidth:1,
    borderColor:"#FFD70033"
  },

  timerLabel:{ color:"#9ca3af", fontSize:12 },

  timer:{
    color:"#FFD700",
    fontSize:32,
    fontWeight:"900"
  },

  benefitsContainer:{ gap:12, marginBottom:20 },

  benefitCard:{
    flexDirection:"row",
    alignItems:"center",
    gap:12,
    backgroundColor:"#1B273E",
    padding:14,
    borderRadius:14
  },

  benefitTitle:{
    color:"white",
    fontWeight:"800",
    fontSize:14
  },

  watchButton:{
    backgroundColor:"#FFD700",
    padding:15,
    borderRadius:16,
    alignItems:"center"
  },

  watchText:{
    color:"#1a1a1a",
    fontWeight:"900"
  },

  switchRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:20
  },

  switchLabel:{
    color:"white",
    fontWeight:"700"
  },

  buyButton:{
    backgroundColor:"#ffc400",
    padding:14,
    borderRadius:14,
    alignItems:"center",
    marginBottom:10
  },

  buyText:{
    color:"#161616",
    fontWeight:"900"
  },

  restoreButton:{
    alignItems:"center",
    padding:10
  },

  restoreText:{
    color:"#60a5fa",
    fontWeight:"700"
  },

  vipMessageContainer:{
  marginTop:10,
  alignItems:"center"
},

vipMessage:{
  color:"#FFD700",
  fontWeight:"800",
  textAlign:"center",
  fontSize:13
}

});