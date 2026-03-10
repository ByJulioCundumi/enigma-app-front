import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsButton() {
  const [visible, setVisible] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const currentLanguage = "ES";

  return (
    <>
      {/* BOTÓN AJUSTES */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="settings" size={22} color="#755dff" />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.popup}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Ajustes</Text>
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <Ionicons name="close" size={24} color="#334155" />
                  </TouchableOpacity>
                </View>

                {/* Opciones */}
                <View style={styles.optionRow}>
                  <Text style={styles.optionText}>Sonidos</Text>
                  <Switch
                    value={soundEnabled}
                    onValueChange={setSoundEnabled}
                  />
                </View>

                <View style={styles.optionRow}>
                  <Text style={styles.optionText}>Música</Text>
                  <Switch
                    value={musicEnabled}
                    onValueChange={setMusicEnabled}
                  />
                </View>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.resetButton}>
                  <Text style={styles.resetText}>
                    Restablecer progreso
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  popup: {
    width: "85%",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },

  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },

  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 15,
  },

  resetButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  resetText: {
    color: "#fff",
    fontWeight: "700",
  },
});