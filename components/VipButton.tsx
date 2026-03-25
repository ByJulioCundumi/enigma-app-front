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
import { MaterialCommunityIcons, Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";

import { activateVip, closeVipModal, incrementAd, openVipModal, tickVip } from "@/store/reducers/vipSlice";
import { addEnergy } from "@/store/reducers/energySlice";
import { playSound } from "@/hooks/playSound";
import { restorePurchase, setPurchased } from "@/store/reducers/purchaseSlice";
import VipPurchase from "./VipPurchase";
import { checkVip } from "@/utils/checkVip";
import { isConnectedToInternet } from "@/utils/isConnectedToInternet";

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

  const {vipExpireAt, isVipModalOpen, vipEntry} = useSelector(
    (state: IRootState) => state.vip
  );

  const vipStartAt = useSelector(
    (state: IRootState) => state.vip.vipStartAt
  );

  const hasPurchased = useSelector(
    (state: IRootState) => state.purchase.hasPurchased
  );

  const [noInternetVisible, setNoInternetVisible] = useState(false);

  const showNoInternetMessage = () => {
  setNoInternetVisible(true);

  setTimeout(() => {
    setNoInternetVisible(false);
  }, 2000);
};

  const isVip = checkVip(vipExpireAt);
  const vipActive = isVip || hasPurchased;

  const { language } = useSelector(
    (state: IRootState) => state.language
  );

  const isEs = language === "es";

  const [timeLeft, setTimeLeft] = useState(VIP_DURATION);
  const isPremiumMode = vipEntry === "purchase";

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
  // 🚫 no hacer nada si ya es VIP o compró
  if (hasPurchased || isVip) return;

  // 🚫 límite alcanzado
  if (adsWatched >= REQUIRED_ADS) return;

  // 🌐 verificar internet (ESPERA REAL)
  const isConnected = await isConnectedToInternet();

  if (!isConnected) {
    showNoInternetMessage(); // 🔥 NOTIFICACIÓN
    return;
  }

  let success = true;

  if (onWatchAd) {
    success = await onWatchAd(); // anuncio real
  }

  // 🚫 si no completó el anuncio
  if (!success) return;

  const newCount = adsWatched + 1;

  // ✅ contar anuncio
  dispatch(incrementAd());

  // 🎯 activar VIP
  if (newCount >= REQUIRED_ADS) {
    dispatch(activateVip());
    dispatch(addEnergy(ENERGY_REWARD));

    dispatch(closeVipModal());
    playSound(require("@/assets/sounds/soundWind.mp3"));
  }
};

  return (
    <>
      {/* BOTON VIP */}
      <TouchableOpacity
        style={styles.vipButton}
        activeOpacity={0.9}
        onPress={() => {
          const entry = hasPurchased
            ? "purchase"     // ya compró → mostrar estado VIP
            : vipActive
            ? "ads"          // tiene VIP temporal → mostrar progreso
            : "ads";         // default → anuncios

          dispatch(openVipModal(entry));
          playSound(require("@/assets/sounds/soundWind.mp3"));
        }}
      >
        <View style={styles.glow} />

        <MaterialCommunityIcons
          name="crown"
          size={20}
          color="#FFD700"
          style={{marginTop: -5}}
        />

        <View style={styles.badge}>
          {hasPurchased ? (
            <Text style={styles.badgeText}>VIP</Text>
          ) : vipActive ? (
            <Text style={styles.badgeText}>
              {formatTime(timeLeft)}
            </Text>
          ) : (
            <View style={{flexDirection: "row", alignItems: "center", gap: 3}}>
              <MaterialCommunityIcons name="movie-open-play" size={12} color="black" />
              <Text style={styles.badgeText}>
              {adsWatched}/{REQUIRED_ADS}
            </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* POPUP */}
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
                  onValueChange={(value) => {
                    dispatch(openVipModal(value ? "purchase" : "ads"));
                  }}
                  trackColor={{ false: "#555", true: "#555" }}
                  thumbColor={isPremiumMode ? "#ffffff" : "#fff"}
                />
              </View>
            )}

            {/* TIMER */}

            {
              !isPremiumMode && <View style={styles.timerCard}>

              <Text style={styles.timerLabel}>
                {isEs ? "Tiempo VIP" : "VIP Time"}
              </Text>

              <Text style={styles.timer}>
                {formatTime(vipActive ? timeLeft : VIP_DURATION)}
              </Text>

            </View>
            }

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
                </>
              )}
            </View>

            {/* BOTONES */}
{!hasPurchased && (
  <>
    {/* 🎥 VER ANUNCIO */}
    {!vipActive && !isPremiumMode && (
      <TouchableOpacity
        style={styles.watchButton}
        onPress={watchAd}
      >
          <MaterialCommunityIcons name="movie-open-play" size={18} color="black" />
        <Text style={styles.watchText}>
          {isEs ? "Ver anuncio" : "Watch ad"} {adsWatched}/{REQUIRED_ADS}
        </Text>
      </TouchableOpacity>
    )}

    {isPremiumMode && (
      <VipPurchase
        isEs={isEs}
        onBuyGame={onBuyGame}
      />
    )}
  </>
)}

          </Pressable>
        </Pressable>
      </Modal>
      {noInternetVisible && (
  <View style={styles.noInternetToast}>
    <MaterialCommunityIcons
      name="wifi-off"
      size={16}
      color="#fff"
    />
    <Text style={styles.noInternetText}>
      {isEs
        ? "Se requiere conexión a internet"
        : "Internet connection required"}
    </Text>
  </View>
)}
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

  noInternetToast: {
  position: "absolute",
  bottom: 40,
  alignSelf: "center",
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#dc2626",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 12,
  gap: 6,
  zIndex: 999,
},

noInternetText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 12,
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
    display: "flex",
    fontSize:10,
    fontWeight:"900",
    color:"#1a1a1a",
    gap: 3
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

    // 👇 NUEVO
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
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
    alignItems:"center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5
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
    marginBottom:10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5
  },

  buyText:{
    color:"#161616",
    fontWeight:"900"
  },

  restoreButton:{
    alignItems:"center",
    padding:10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  restoreText:{
    color:"#cc9e20",
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