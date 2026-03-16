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

interface Props {
  onWatchAd?: () => Promise<boolean>;
}

export default function VipButton({ onWatchAd }: Props) {

  const REQUIRED_ADS = 3;
  const VIP_DURATION = 15 * 60;
  const ENERGY_REWARD = 25;

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

      // 🎁 RECOMPENSA DE ENERGÍA
      dispatch(addEnergy(ENERGY_REWARD));

      setVisible(false);

    }

  };

  const progress = (adsWatched / REQUIRED_ADS) * 100;

  return (
    <>
      {/* BOTON VIP */}

      <TouchableOpacity
        style={styles.vipButton}
        activeOpacity={0.9}
        onPress={() => setVisible(true)}
      >

        <View style={styles.glow}/>

        <MaterialCommunityIcons
          name="crown"
          size={20}
          color="#FFD700"
          style={{marginTop:-8}}
        />

        <View style={styles.badge}>

          {vipActive ? (

            <Text style={styles.badgeText}>
              {formatTime(timeLeft)}
            </Text>

          ) : (

            <View style={{flexDirection:"row",alignItems:"center",gap:3}}>
              <MaterialCommunityIcons name="movie-open-play" size={14} color="black"/>
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
          onPress={() => setVisible(false)}
        >

          <Pressable style={styles.popup}>

            <View style={styles.header}>

              <View style={styles.crownCircle}>
                <MaterialCommunityIcons
                  name="crown"
                  size={32}
                  color="#FFD700"
                />
              </View>

              <Text style={styles.title}>
                Zona VIP
              </Text>

              <Text style={styles.subtitle}>
                Desbloquea ventajas exclusivas durante 15 minutos
              </Text>

            </View>


            {/* TIMER */}

            <View style={styles.timerCard}>

              <Text style={styles.timerLabel}>
                Tiempo VIP
              </Text>

              <Text style={styles.timer}>
                {formatTime(vipActive ? timeLeft : VIP_DURATION)}
              </Text>

            </View>


            {/* BENEFICIOS */}

            <View style={styles.benefitsContainer}>

              <View style={styles.benefitCard}>
                <View style={[styles.iconCircle,{backgroundColor:"#1f3a2a"}]}>
                  <Ionicons name="flash" size={18} color="#22c55e"/>
                </View>
                <View>
                  <Text style={styles.benefitTitle}>+25 Energía</Text>
                  <Text style={styles.benefitDesc}>Obtén energía extra al activar VIP</Text>
                </View>
              </View>

              <View style={styles.benefitCard}>
                <View style={[styles.iconCircle,{backgroundColor:"#3a2e12"}]}>
                  <MaterialCommunityIcons name="crown" size={18} color="#FFD700"/>
                </View>
                <View>
                  <Text style={styles.benefitTitle}>Temáticas exclusivas</Text>
                  <Text style={styles.benefitDesc}>Acceso a retos VIP</Text>
                </View>
              </View>

              <View style={styles.benefitCard}>
                <View style={[styles.iconCircle,{backgroundColor:"#2b2f45"}]}>
                  <Ionicons name="ban" size={18} color="#60a5fa"/>
                </View>
                <View>
                  <Text style={styles.benefitTitle}>Sin anuncios</Text>
                  <Text style={styles.benefitDesc}>Juega sin interrupciones</Text>
                </View>
              </View>

            </View>


            {!vipActive && (

              <View style={styles.progressCard}>

                <View style={styles.progressHeader}>

                  <Text style={styles.progressText}>
                    Anuncios vistos
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

                <Ionicons name="play-circle" size={20} color="white"/>

                <Text style={styles.watchText}>
                  Ver anuncio
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
    width:40,
    height:40,
    borderRadius:40,
    backgroundColor:"#1F2A44",
    justifyContent:"center",
    alignItems:"center",
    borderWidth:2,
    borderColor:"#FFD700",
    elevation:8,
    position:"absolute",
    top:15,
    right:15
  },

  glow:{
    position:"absolute",
    width:52,
    height:52,
    borderRadius:46,
    backgroundColor:"rgba(255,215,0,0.15)"
  },

  badge:{
    position:"absolute",
    bottom:-6,
    backgroundColor:"#FFD700",
    paddingHorizontal:8,
    paddingVertical:2,
    borderRadius:10,
    width: 50,
    alignItems: "center"
  },
  
  badgeText:{
    textAlign: "center",
    fontSize:10,
    fontWeight:"900",
    color:"#1e293b"
  },

  overlay:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0.70)",
    justifyContent:"center",
    padding:22
  },

  popup:{
    backgroundColor:"#162033",
    borderRadius:28,
    padding:22,
    borderWidth:1,
    borderColor:"#2a3955"
  },

  header:{
    alignItems:"center",
    marginBottom:18
  },

  crownCircle:{
    width:70,
    height:70,
    borderRadius:35,
    backgroundColor:"#22304a",
    justifyContent:"center",
    alignItems:"center",
    marginBottom:12
  },

  title:{
    color:"white",
    fontSize:22,
    fontWeight:"900"
  },

  subtitle:{
    color:"#94A3B8",
    fontSize:13,
    textAlign:"center",
    marginTop:4
  },

  timerCard:{
    backgroundColor:"#1E2A44",
    borderRadius:16,
    paddingVertical:16,
    alignItems:"center",
    marginBottom:16,
  },

  timerLabel:{
    color:"#94A3B8",
    fontSize:12,
  },

  timer:{
    color:"#FFD700",
    fontSize:30,
    fontWeight:"900",
    marginTop:2,
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

  iconCircle:{
    width:34,
    height:34,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center"
  },

  benefitTitle:{
    color:"white",
    fontWeight:"700",
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
    backgroundColor:"#ffae00",
    paddingVertical:14,
    borderRadius:14,
    justifyContent:"center",
    alignItems:"center",
    gap:8
  },

  watchText:{
    color:"white",
    fontWeight:"900",
    fontSize:16
  }

});