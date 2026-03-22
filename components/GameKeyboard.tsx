import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";

type Key = {
  letter: string;
  used: boolean;
};

type Props = {
  letters: Key[];
  onPressKey: (letter: string, index: number) => void;
};

export default function GameKeyboard({ letters, onPressKey }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.keyboard}
      showsVerticalScrollIndicator={false}
    >
      {letters.map((key, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.key, key.used && styles.keyUsed]}
          disabled={key.used}
          onPress={() => onPressKey(key.letter, index)}
        >
          <Text style={styles.keyText}>{key.letter}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: 200, // 👉 CLAVE para permitir 3 filas visibles
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 12,
    width: "100%",
  },
  key: {
    width: 38,
    height: 38,
    margin: 4,
    borderRadius: 12,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  keyUsed: {
    opacity: 0.25,
  },
  keyText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});