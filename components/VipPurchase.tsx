import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import { setPurchased, restorePurchase } from "@/store/reducers/purchaseSlice";
import { playSound } from "@/hooks/playSound";

interface Props {
  isEs: boolean;
  onBuyGame?: () => void;
}

export default function VipPurchase({ isEs, onBuyGame }: Props) {

  const dispatch = useDispatch();

  const handleBuy = () => {
    playSound(require("@/assets/sounds/soundWind.mp3"));
    dispatch(setPurchased()); // 🔥 luego reemplazas por RevenueCat
    onBuyGame?.();
  };

  const handleRestore = () => {
    playSound(require("@/assets/sounds/soundWind.mp3"));
    dispatch(restorePurchase());
  };

  return (
    <View>
      {/* 💰 COMPRAR */}
      <TouchableOpacity
        style={styles.buyButton}
        onPress={handleBuy}
      >
        <MaterialIcons name="local-offer" size={18} color="black" />
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
    </View>
  );
}

const styles = StyleSheet.create({
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
  },

  restoreText:{
    color:"#cc9e20",
    fontWeight:"700"
  },
});