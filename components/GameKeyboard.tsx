import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

type Key = {
  letter: string;
  used: boolean;
};

type Props = {
  letters: Key[][];
  onPressKey: (
    letter: string,
    row: number,
    col: number
  ) => void;
};

export default function GameKeyboard({
  letters,
  onPressKey,
}: Props) {
  const { width } = useWindowDimensions();

  // 🔹 Ancho base (Samsung A15 aprox)
  const BASE_WIDTH = 360;

  // 🔹 Escala proporcional (con límites para que no se rompa)
  const scale = Math.min(Math.max(width / BASE_WIDTH, 0.85), 1.6);

  const dynamicFontSize = 18 * scale;
  const dynamicKeyWidth = 32 * scale;
  const dynamicKeyHeight = 38 * scale;

  return (
    <View style={styles.container}>
      {letters.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, colIndex) => (
            <TouchableOpacity
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.key,
                {
                  width: dynamicKeyWidth,
                  height: dynamicKeyHeight,
                },
                key.used && styles.keyUsed,
              ]}
              disabled={key.used}
              onPress={() =>
                onPressKey(key.letter, rowIndex, colIndex)
              }
            >
              <Text
                style={[
                  styles.keyText,
                  { fontSize: dynamicFontSize },
                ]}
              >
                {key.letter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    borderRadius: 16,
    paddingVertical: 20,
    paddingBottom: 25,
    backgroundColor: "#1a2433",
    gap: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "center",
  },

  key: {
    marginHorizontal: 3.5,
    borderRadius: 8,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff1a"
  },

  keyUsed: {
    opacity: 0.25,
  },

  keyText: {
    color: "#fff",
    fontWeight: "bold",
  },
});