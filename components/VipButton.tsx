import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";

import { activateVip, incrementAd, tickVip } from "@/store/reducers/vipSlice";
import { addEnergy } from "@/store/reducers/energySlice";
import { playSound } from "@/hooks/playSound";

interface Props {
  onWatchAd?: () => Promise<boolean>;
}

export default function VipButton({ onWatchAd }: Props) {

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

  const vipActive = vipExpireAt !== null;

  const {language} = useSelector(
    (state: IRootState) => state.language
  );

  const isEs = language === "es";

  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(VIP_DURATION);

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

  const progress = (adsWatched / REQUIRED_ADS) * 100;

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
        <View style={styles.glow}/>

        <MaterialCommunityIcons
          name="crown"
          size={20}
          color="#FFD700"
          style={{marginTop: -3}}
        />

        <View style={styles.badge}>
          {vipActive ? (
            <Text style={styles.badgeText}>
              {formatTime(timeLeft)}
            </Text>
          ) : (
            <View style={{flexDirection:"row",alignItems:"center",gap:3}}>
              <MaterialCommunityIcons name="movie-open-play" size={14} color="#1a1a1a" />
              <Text style={styles.badgeText}>
                {adsWatched}/{REQUIRED_ADS}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>


      {/* POPUP */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.overlay}
          onPress={() => {
            setVisible(false)
            playSound(require("@/assets/sounds/soundWind.mp3"));
          }}
        >
          <Pressable style={styles.popup}>

            {/* HEADER */}
            <View style={styles.header}>


              <View style={{flexDirection: "row", alignItems: "center", gap:10}}>
                <View style={styles.crownCircle}>
                <MaterialCommunityIcons
                  name="crown"
                  size={27}
                  color="#FFD700"
                />
              </View>

                <Text style={styles.title}>
                  {isEs ? "Jugador VIP" : "VIP Player"}
                </Text>
              </View>

              <Text style={styles.subtitle}>
                {isEs
                  ? "Activa beneficios premium por 15 minutos"
                  : "Activate premium perks for 15 minutes"}
              </Text>

            </View>


            {/* TIMER */}
            <View style={styles.timerCard}>
              <Text style={styles.timerLabel}>
                {isEs ? "Tiempo VIP" : "VIP Time"}
              </Text>

              <Text style={styles.timer}>
                {formatTime(vipActive ? timeLeft : VIP_DURATION)}
              </Text>
            </View>


            {/* BENEFICIOS */}
            <View style={styles.benefitsContainer}>

              {/* ENERGIA EXTRA */}
              <View style={styles.benefitCard}>
                <View style={[styles.iconCircle,{backgroundColor:"#1f3a2a"}]}>
                  <Ionicons name="flash" size={18} color="#22c55e"/>
                </View>
                <View>
                  <Text style={styles.benefitTitle}>
                    +{ENERGY_REWARD} {isEs ? "Energía" : "Energy"}
                  </Text>
                  <Text style={styles.benefitDesc}>
                    {isEs
                      ? "Recompensa instantánea al activar VIP"
                      : "Instant reward when activating VIP"}
                  </Text>
                </View>
              </View>

              {/* ENERGIA x2 */}
              <View style={[styles.benefitCard, styles.goldHighlight]}>
                <View style={[styles.iconCircle,{backgroundColor:"#3b2f0f"}]}>
                  <Ionicons name="flash-outline" size={18} color="#FFD700"/>
                </View>
                <View>
                  <Text style={[styles.benefitTitle,{color:"#FFD700"}]}>
                    {isEs ? "Energía x2" : "Energy x2"}
                  </Text>
                  <Text style={styles.benefitDesc}>
                    {isEs
                      ? "Gana el doble de energía en cada acción"
                      : "Earn double energy from every action"}
                  </Text>
                </View>
              </View>

              {/* SIN ANUNCIOS */}
              <View style={styles.benefitCard}>
                <View style={[styles.iconCircle,{backgroundColor:"#2b2f45"}]}>
                  <Ionicons name="ban" size={18} color="#60a5fa"/>
                </View>
                <View>
                  <Text style={styles.benefitTitle}>
                    {isEs ? "Sin anuncios" : "No ads"}
                  </Text>
                  <Text style={styles.benefitDesc}>
                    {isEs
                      ? "Juega sin interrupciones"
                      : "Play without interruptions"}
                  </Text>
                </View>
              </View>

            </View>


            {!vipActive && (
              <View style={styles.progressCard}>

                <View style={styles.progressHeader}>
                  <Text style={styles.progressText}>
                    {isEs ? "Anuncios vistos" : "Ads viewed"}
                  </Text>

                  <Text style={styles.progressCount}>
                    {adsWatched}/{REQUIRED_ADS}
                  </Text>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%` }
                    ]}
                  />
                </View>

              </View>
            )}


            {!vipActive && (
              <TouchableOpacity
                style={styles.watchButton}
                onPress={watchAd}
              >
                <Ionicons name="play-circle" size={20} color="#1a1a1a"/>

                <Text style={styles.watchText}>
                  {isEs ? "Ver anuncio" : "View ad"}
                </Text>
              </TouchableOpacity>
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
    elevation:10,
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
    shadowColor:"#FFD700",
    shadowOpacity:0.3,
    shadowRadius:20,
    elevation:10
  },

  header:{
    alignItems:"center",
    marginBottom:20
  },

  crownCircle:{
    width:45,
    height:45,
    borderRadius:40,
    backgroundColor:"#1f2937",
    justifyContent:"center",
    alignItems:"center",
    borderWidth:2,
    borderColor:"#FFD700"
  },

  title:{
    display: "flex",
    alignItems: "center",
    gap: 10,
    color:"#FFD700",
    fontSize:24,
    fontWeight:"900"
  },

  subtitle:{
    color:"#cbd5e1",
    fontSize:13,
    textAlign:"center",
    marginTop:6
  },

  timerCard:{
    backgroundColor:"#1a2233",
    borderRadius:16,
    padding:10,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    marginBottom:18,
    borderWidth:1,
    borderColor:"#FFD70033"
  },

  timerLabel:{
    color:"#9ca3af",
    fontSize:12
  },

  timer:{
    color:"#FFD700",
    fontSize:32,
    fontWeight:"900",
    marginTop:4
  },

  benefitsContainer:{
    gap:12,
    marginBottom:20
  },

  benefitCard:{
    flexDirection:"row",
    alignItems:"center",
    gap:12,
    backgroundColor:"#1B273E",
    padding:14,
    borderRadius:14
  },

  goldHighlight:{
    borderWidth:1,
    borderColor:"#FFD70055",
    backgroundColor:"#2a2110"
  },

  iconCircle:{
    width:36,
    height:36,
    borderRadius:12,
    justifyContent:"center",
    alignItems:"center"
  },

  benefitTitle:{
    color:"white",
    fontWeight:"800",
    fontSize:14
  },

  benefitDesc:{
    color:"#94A3B8",
    fontSize:11
  },

  progressCard:{
    backgroundColor:"#1B273E",
    padding:14,
    borderRadius:14,
    marginBottom:18
  },

  progressHeader:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:8
  },

  progressText:{
    color:"#94A3B8",
    fontSize:12
  },

  progressCount:{
    color:"white",
    fontWeight:"900"
  },

  progressBar:{
    height:7,
    backgroundColor:"#0F172A",
    borderRadius:8,
    overflow:"hidden"
  },

  progressFill:{
    height:"100%",
    backgroundColor:"#FFD700"
  },

  watchButton:{
    flexDirection:"row",
    backgroundColor:"#FFD700",
    paddingVertical:15,
    borderRadius:16,
    justifyContent:"center",
    alignItems:"center",
    gap:8,
    shadowColor:"#FFD700",
    shadowOpacity:0.4,
    shadowRadius:10,
    elevation:6
  },

  watchText:{
    color:"#1a1a1a",
    fontWeight:"900",
    fontSize:16
  }

});