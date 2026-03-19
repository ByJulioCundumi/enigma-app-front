import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Switch,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";
import { toggleMusic } from "@/store/reducers/musicSlice";
import { playSound } from "@/hooks/playSound";

export default function SettingsButton() {
  const [visible, setVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useDispatch();

  const musicEnabled = useSelector((state: IRootState) => state.music.enabled);

  const {language} = useSelector(
    (state: IRootState) => state.language
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

  return (
    <>
      {/* BOTÓN AJUSTES */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={openModal}
        activeOpacity={0.85}
      >
        <Ionicons name="settings" size={22} color="#f1f5f9" />
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
                  <Text style={styles.title}>{isEs ? "Ajustes" : "Settings"}</Text>

                  <TouchableOpacity onPress={closeModal}>
                    <Ionicons name="close" size={26} color="#cbd5f5" />
                  </TouchableOpacity>
                </View>

                {/* MUSICA */}
                <View style={styles.card}>
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name="musical-notes"
                      size={22}
                      color="#34d399"
                    />
                    <Text style={styles.optionText}>{isEs ? "Música" : "Music"}</Text>
                  </View>

                  <Switch
                    value={musicEnabled}
                    onValueChange={(value) => {
                      dispatch(toggleMusic());
                    }}
                    trackColor={{ false: "#334155", true: "#22c55e" }}
                    thumbColor="#ffffff"
                  />
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  popup: {
    width: "88%",
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
    letterSpacing: 0.3,
  },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  optionText: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#e2e8f0",
  },
});