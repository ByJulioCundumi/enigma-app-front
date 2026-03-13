import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function LanguageSelector() {
  const [visible, setVisible] = useState(false);
  const [language, setLanguage] = useState<"EN" | "ES">("EN");

  const selectLanguage = (lang: "EN" | "ES") => {
    setLanguage(lang);
    setVisible(false);
  };

  return (
    <>
      {/* BOTÓN IDIOMA */}
      <TouchableOpacity
        style={styles.languageButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="language" size={18} color="#f0f1ff" />
        <Text style={styles.languageText}>{language}</Text>
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
                  <Text style={styles.title}>Language</Text>
                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <Ionicons name="close" size={24} color="#334155" />
                  </TouchableOpacity>
                </View>

                {/* OPCIONES */}

                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "EN" && styles.selectedOption,
                  ]}
                  onPress={() => selectLanguage("EN")}
                >
                  <Text style={styles.optionText}>English</Text>
                  {language === "EN" && (
                    <Ionicons name="checkmark" size={20} color="#2563eb" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.languageOption,
                    language === "ES" && styles.selectedOption,
                  ]}
                  onPress={() => selectLanguage("ES")}
                >
                  <Text style={styles.optionText}>Español</Text>
                  {language === "ES" && (
                    <Ionicons name="checkmark" size={20} color="#2563eb" />
                  )}
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
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  languageText: {
    color: "#f0f1ff",
    fontWeight: "700",
    fontSize: 13,
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

  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  selectedOption: {
    backgroundColor: "#e2e8f0",
  },

  optionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
});