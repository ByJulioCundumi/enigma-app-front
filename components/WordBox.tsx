import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  word: string;
  currentInput?: string;
  status?: "default" | "correct" | "wrong";
}

export default function WordBox({
  word,
  currentInput = "",
  status = "default",
}: Props) {
  const letters = word.split("");

  return (
    <View style={styles.container}>
      {letters.map((letter, index) => {
        const typedLetter = currentInput[index] || "";

        const isFilled = typedLetter !== "";

        return (
          <View
            key={index}
            style={[
              styles.letterBox,
              isFilled && styles.filled,
              status === "correct" && styles.correct,
              status === "wrong" && styles.wrong,
            ]}
          >
            <Text style={styles.letterText}>
              {typedLetter.toUpperCase()}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const BOX_SIZE = 48;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  letterBox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#334155",
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },

  filled: {
    borderColor: "#6366F1",
  },

  correct: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },

  wrong: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },

  letterText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },
});