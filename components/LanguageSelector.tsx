import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface Language {
  code: string;
  label: string;
}

export default function LanguageSelector() {
  const [visible, setVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("ES");

  // 🔥 Lista preparada para añadir más idiomas
  const languages: Language[] = [
    { code: "ES", label: "Español" },
    { code: "EN", label: "English" },
  ];

  const selectLanguage = (code: string) => {
    setCurrentLanguage(code);
    setVisible(false);
  };

  return (
    <>
      {/* BOTÓN */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <MaterialIcons name="g-translate" size={25} color="#755dff" />

        {/* Badge idioma */}
        <View style={styles.languageBadge}>
          <Text style={styles.languageText}>{currentLanguage}</Text>
        </View>
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
                  <Text style={styles.title}>Select Language</Text>

                  <TouchableOpacity onPress={() => setVisible(false)}>
                    <Ionicons name="close" size={24} color="#334155" />
                  </TouchableOpacity>
                </View>

                {/* Opciones de idioma */}
                {languages.map((lang) => {
                  const selected = lang.code === currentLanguage;

                  return (
                    <TouchableOpacity
                      key={lang.code}
                      style={[
                        styles.languageOption,
                        selected && styles.selectedLanguage,
                      ]}
                      onPress={() => selectLanguage(lang.code)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.languageLabel,
                          selected && styles.selectedLanguageText,
                        ]}
                      >
                        {lang.label}
                      </Text>

                      {selected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color="#6366F1"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  /* BADGE IDIOMA */

  languageBadge: {
    position: "absolute",
    top: 14,
    right: -15,
    backgroundColor: "#6366F1",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  languageText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 0.5,
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
    marginBottom: 18,
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
    borderRadius: 12,
    marginBottom: 8,
  },

  selectedLanguage: {
    backgroundColor: "#eef2ff",
  },

  languageLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },

  selectedLanguageText: {
    color: "#4f46e5",
  },
});