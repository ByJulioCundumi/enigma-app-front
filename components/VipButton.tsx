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

interface Props {
  onWatchAd?: () => Promise<boolean>;
}

export default function VipButton({ onWatchAd }: Props) {

  const REQUIRED_ADS = 3;
  const VIP_DURATION = 15 * 60;

  const [visible, setVisible] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);
  const [vipTime, setVipTime] = useState(VIP_DURATION);
  const [vipActive, setVipActive] = useState(false);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {

    if (!vipActive) return;

    const interval = setInterval(() => {

      setVipTime((prev) => {

        if (prev <= 1) {

          clearInterval(interval);
          setVipActive(false);
          setAdsWatched(0);
          return VIP_DURATION;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [vipActive]);


  const watchAd = async () => {

    if (adsWatched >= REQUIRED_ADS) return;

    let success = true;

    if (onWatchAd) {
      success = await onWatchAd();
    }

    if (!success) return;

    const newCount = adsWatched + 1;
    setAdsWatched(newCount);

    if (newCount >= REQUIRED_ADS) {

      setVipActive(true);
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
          style={{marginTop: -8}}
        />

        <View style={styles.badge}>

          {vipActive ? (
            <Text style={styles.badgeText}>
              {formatTime(vipTime)}
            </Text>
          ) : (
            <View style={{flexDirection: "row", alignItems: "center", gap: 3}}>
              <MaterialCommunityIcons name="movie-open-play" size={14} color="black" />
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

            {/* HEADER VIP */}

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


            {/* CRONOMETRO */}

            <View style={styles.timerCard}>

              <Text style={styles.timerLabel}>
                Tiempo VIP
              </Text>

              <Text style={styles.timer}>
                {formatTime(vipActive ? vipTime : VIP_DURATION)}
              </Text>

            </View>


            {/* PROGRESO */}

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


            {/* BENEFICIOS */}

            <View style={styles.benefitsContainer}>

              <View style={styles.benefitCard}>
                <Ionicons name="flash" size={18} color="#22c55e"/>
                <Text style={styles.benefitText}>
                  Energía x2
                </Text>
              </View>

              <View style={styles.benefitCard}>
                <MaterialCommunityIcons name="crown" size={18} color="#eab308"/>
                <Text style={styles.benefitText}>
                  Temáticas VIP
                </Text>
              </View>

              <View style={styles.benefitCard}>
                <Ionicons name="ban" size={18} color="#3b82f6"/>
                <Text style={styles.benefitText}>
                  Sin anuncios
                </Text>
              </View>

            </View>


            {/* BOTON VER ANUNCIO */}

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
    position: "absolute",
    top: 15,
    right: 15
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
    borderRadius:10
  },

  badgeText:{
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
    marginBottom:16
  },

  timerLabel:{
    color:"#94A3B8",
    fontSize:12
  },

  timer:{
    color:"#FFD700",
    fontSize:30,
    fontWeight:"900",
    marginTop:2
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

  benefitsContainer:{
    gap:10,
    marginBottom:20
  },

  benefitCard:{
    flexDirection:"row",
    alignItems:"center",
    gap:10,
    backgroundColor:"#1E2B45",
    padding:12,
    borderRadius:12
  },

  benefitText:{
    color:"#E2E8F0",
    fontSize:13,
    fontWeight:"600"
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