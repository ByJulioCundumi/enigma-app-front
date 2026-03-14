import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  value: number;
  onWatchAd?: () => void;
}

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num;
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function EnergyStat({ value, onWatchAd }: Props) {

  const [showPopup, setShowPopup] = useState(false);
  const [vipSeconds, setVipSeconds] = useState(0);

  const isVip = vipSeconds > 0;

  useEffect(() => {
    if (vipSeconds <= 0) return;

    const timer = setInterval(() => {
      setVipSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [vipSeconds]);

  const handleWatch = () => {
    setShowPopup(false);
    setVipSeconds((prev) => prev + 600);
    onWatchAd?.();
  };

  const popup = useMemo(() => (
    <Modal transparent visible={showPopup} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>

          <View style={styles.vipIconCircle}>
            <MaterialCommunityIcons name="crown" size={38} color="#ffd54f" />
          </View>

          <Text style={styles.popupTitle}>VIP Boost</Text>

          <Text style={styles.popupSubtitle}>
            Watch a short ad and receive:
          </Text>

          <View style={styles.rewardsContainer}>

            <View style={styles.rewardCard}>
              <FontAwesome6 name="bolt-lightning" size={20} color="#ffcf33" />
              <Text style={styles.rewardValue}>+3</Text>
              <Text style={styles.rewardLabel}>Energy</Text>
            </View>

            <View style={styles.rewardCard}>
              <MaterialCommunityIcons name="crown" size={20} color="#ffd54f" />
              <Text style={styles.rewardValue}>10m</Text>
              <Text style={styles.rewardLabel}>VIP</Text>
            </View>

            <View style={styles.rewardCard}>
              <MaterialCommunityIcons name="play-box-lock" size={20} color="#ffd54f" />
              <Text style={styles.rewardValue}>10m</Text>
              <Text style={styles.rewardLabel}>No Ads</Text>
            </View>

          </View>

          <TouchableOpacity style={styles.watchButton} onPress={handleWatch}>
            <MaterialCommunityIcons name="movie-open-play" size={18} color="#fff" />
            <Text style={styles.watchText}>Watch Ad</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowPopup(false)}>
            <Text style={styles.cancel}>Maybe Later</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  ), [showPopup]);

  return (
    <>
      <TouchableOpacity activeOpacity={0.85} style={styles.statBadge}>

        <View style={styles.energyIcon}>
          <FontAwesome6 name="bolt-lightning" size={9} color="#fff" />
        </View>

        <Text style={styles.statText}>{formatNumber(value)}</Text>

        <TouchableOpacity
          activeOpacity={0.85}
          style={[styles.vipButton, isVip && styles.vipActive]}
          onPress={() => setShowPopup(true)}
        >
          <MaterialCommunityIcons name="crown" size={14} color="#fff" />

          {isVip ? (
            <Text style={styles.timer}>{formatTime(vipSeconds)}</Text>
          ) : (
            <Text style={styles.reward}>+10m</Text>
          )}
        </TouchableOpacity>

      </TouchableOpacity>

      {popup}
    </>
  );
}

const styles = StyleSheet.create({
  statBadge:{
    flexDirection:"row",
    alignItems:"center",
    paddingHorizontal:10,
    height:36,
    borderRadius:20,
    backgroundColor:"#df405d",
    borderWidth:1,
    borderColor:"rgba(255,92,124,0.35)",
    gap:6,
  },

  energyIcon:{
    width:17.5,
    height:17.5,
    borderRadius:10,
    backgroundColor:"#be2a45",
    alignItems:"center",
    justifyContent:"center",
  },

  statText:{
    fontSize:13,
    fontWeight:"900",
    color:"#fff",
  },

  vipButton:{
    flexDirection:"row",
    alignItems:"center",
    gap:3,
    marginLeft:6,
    paddingHorizontal:7,
    height:20,
    borderRadius:10,
    backgroundColor:"#be2a45",
  },

  vipActive:{
    backgroundColor:"#be2a45",
  },

  reward:{
    fontSize:10,
    fontWeight:"900",
    color:"#fff",
  },

  timer:{
    fontSize:10,
    fontWeight:"900",
    color:"#fff",
  },

  overlay:{
    flex:1,
    backgroundColor:"rgba(0,0,0,0.65)",
    justifyContent:"center",
    alignItems:"center",
  },

  popup:{
    width:300,
    backgroundColor:"#2b1a3a",
    borderRadius:22,
    padding:22,
    alignItems:"center",
  },

  vipIconCircle:{
    width:70,
    height:70,
    borderRadius:35,
    backgroundColor:"#3c2452",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:10,
  },

  popupTitle:{
    fontSize:20,
    fontWeight:"900",
    color:"#fff",
  },

  popupSubtitle:{
    fontSize:13,
    color:"#cfc4dd",
    marginTop:4,
    marginBottom:14,
  },

  rewardsContainer:{
    flexDirection:"row",
    gap:10,
    marginBottom:16,
  },

  rewardCard:{
    width:85,
    backgroundColor:"#3a2550",
    borderRadius:14,
    padding:10,
    alignItems:"center",
  },

  rewardValue:{
    fontSize:16,
    fontWeight:"900",
    color:"#fff",
    marginTop:4,
  },

  rewardLabel:{
    fontSize:11,
    color:"#c7b9d9",
  },

  watchButton:{
    flexDirection:"row",
    alignItems:"center",
    gap:6,
    backgroundColor:"#df405d",
    paddingHorizontal:20,
    paddingVertical:11,
    borderRadius:16,
    marginTop:8,
  },

  watchText:{
    color:"#fff",
    fontWeight:"900",
    fontSize:14,
  },

  cancel:{
    marginTop:10,
    color:"#b7a9c8",
    fontSize:13,
  },
});