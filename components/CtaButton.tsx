import { IRootState } from "@/store/rootState";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

export default function CtaButton() {
  const {language} = useSelector((state:IRootState)=> state.language)
  const isEs = language === "es";

  return (
      <View style={styles.openButtonWrapper}>
        <TouchableOpacity
          style={styles.openButton}
        >
          <Text style={styles.openButtonText}>{isEs ? "¿Qué palabra es?" : "What word is it?"}</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2262c2ce",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "center",
    gap: 8,
    marginTop: 15,
  },

  openButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 14,
  },

  openButtonWrapper: {
    alignSelf: "center",
  },
});