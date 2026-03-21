import { IRootState } from "@/store/rootState";
import { Octicons } from "@expo/vector-icons";
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
          <Octicons name="multi-select" size={12} color="#fff" />
          <Text style={styles.openButtonText}>{isEs ? "Tema: Aleatorio" : "Topic: Random"}</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff15",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "center",
    gap: 8,
    marginBottom: 40,
    marginTop: -40
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