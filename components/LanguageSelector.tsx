import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { setLanguage } from "@/store/reducers/languageSlice";
import { playSound } from "@/hooks/playSound";

export default function LanguageSelector() {
  const [visible, setVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  const language = useSelector(
    (state: IRootState) => state.language.language
  );
  
  const isEs = language === "es";

  const openModal = () => {
    setVisible(true);
    playSound(require("@/assets/sounds/soundWind.mp3"));

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false)
      playSound(require("@/assets/sounds/soundWind.mp3"));
    });
  };

  const selectLanguage = (lang: "es" | "en") => {
    dispatch(setLanguage(lang));
    closeModal();
  };

  return (
    <>
      {/* BOTÓN IDIOMA */}
      <TouchableOpacity
        style={styles.languageButton}
        onPress={openModal}
        activeOpacity={0.85}
      >
        <Ionicons name="language" size={18} color="#f1f5f9" />
        <Text style={styles.languageText}>{language.toUpperCase()}</Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  styles.popup,
                  {
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                {/* HEADER */}
                <View style={styles.header}>
                  <Text style={styles.title}>{isEs ? "Idioma" : "Language"}</Text>

                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={26} color="#cbd5f5" />
                  </TouchableOpacity>
                </View>

                {/* ENGLISH */}
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "en" && styles.selectedOption,
                  ]}
                  onPress={() => selectLanguage("en")}
                >
                  <Text style={styles.optionText}>English</Text>

                  {language === "en" && (
                    <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                  )}
                </TouchableOpacity>

                {/* ESPAÑOL */}
                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "es" && styles.selectedOption,
                  ]}
                  onPress={() => selectLanguage("es")}
                >
                  <Text style={styles.optionText}>Español</Text>

                  {language === "es" && (
                    <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                  )}
                </TouchableOpacity>

              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignSelf: "flex-start"
  },

  languageText: {
    color: "#f1f5f9",
    fontWeight: "700",
    fontSize: 13,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  popup: {
    width: "85%",
    backgroundColor: "#0f172a",
    borderRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "#1e293b",

    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    elevation: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f1f5f9",
  },

  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },

  selectedOption: {
    backgroundColor: "#1e293b",
    borderColor: "#22c55e",
  },

  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e2e8f0",
  },
});