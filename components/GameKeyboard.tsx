import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Key = {
  letter: string;
  used: boolean;
};

type Props = {
  letters: Key[][];
  onPressKey: (letter: string, row: number, col: number) => void;
};

export default function GameKeyboard({ letters, onPressKey }: Props) {
  return (
    <View style={styles.container}>
      {letters.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, colIndex) => (
            <TouchableOpacity
              key={`${rowIndex}-${colIndex}`}
              style={[styles.key, key.used && styles.keyUsed]}
              disabled={key.used}
              onPress={() =>
                onPressKey(key.letter, rowIndex, colIndex)
              }
            >
              <Text style={styles.keyText}>{key.letter}</Text>
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
    padding: 10,
    paddingVertical: 20,
    zIndex: 100,
    backgroundColor: "#1e293b",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 6,
  },
  key: {
    width: 33,
    height: 40,
    marginHorizontal: 3,
    borderRadius: 7,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7e7e7e50"
  },
  keyUsed: {
    opacity: 0.25,
  },
  keyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});