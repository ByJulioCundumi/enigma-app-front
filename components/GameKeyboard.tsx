import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  word: string;
}

const ROWS = [
  "QWERTYUIOP",
  "ASDFGHJKLÑ",
  "ZXCVBNM",
];

export default function WordInputKeyboard({ word }: Props) {
  const cleanWord = useMemo(
    () => word.trim().toUpperCase(),
    [word]
  );

  const words = useMemo(
    () => cleanWord.split(/\s+/),
    [cleanWord]
  );

  const totalLetters = useMemo(
    () => words.join("").length,
    [words]
  );

  const hiddenLetters = cleanWord.replace(/\s+/g, "").split("");

  const [letters, setLetters] = useState<(string | null)[]>(
    Array(totalLetters).fill(null)
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  /* ===============================
     LÓGICA TECLADO
  =============================== */

  const handleKeyPress = (key: string) => {
    const updated = [...letters];
    updated[selectedIndex] = key;
    setLetters(updated);

    const nextEmpty = updated.findIndex((l) => l === null);
    if (nextEmpty !== -1) {
      setSelectedIndex(nextEmpty);
    }
  };

  const handleSelectBox = (index: number) => {
    setSelectedIndex(index);
  };

  const handleRemoveLetter = (index: number) => {
    const updated = [...letters];
    updated[index] = null;
    setLetters(updated);
    setSelectedIndex(index);
  };

  const handleClearAll = () => {
    setLetters(Array(totalLetters).fill(null));
    setSelectedIndex(0);
  };

  const handleRevealRandomLetter = () => {
    const emptyIndexes = letters
      .map((l, i) => (l === null ? i : null))
      .filter((i) => i !== null) as number[];

    if (emptyIndexes.length === 0) return;

    const randomIndex =
      emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];

    const updated = [...letters];
    updated[randomIndex] = hiddenLetters[randomIndex];
    setLetters(updated);
  };

  /* ===============================
     RENDER
  =============================== */

  let globalIndex = 0;

  return (
    <View style={styles.container}>
      {/* 🔤 PALABRAS */}
      <View style={styles.wordWrapper}>
        {words.map((singleWord, wordIndex) => {
          const wordLength = singleWord.length;

          const wordBoxes = letters.slice(
            globalIndex,
            globalIndex + wordLength
          );

          const currentStartIndex = globalIndex;
          globalIndex += wordLength;

          return (
            <View key={wordIndex} style={styles.wordRow}>
              {wordBoxes.map((letter, i) => {
                const absoluteIndex = currentStartIndex + i;

                return (
                  <TouchableOpacity
                    key={absoluteIndex}
                    activeOpacity={0.8}
                    onPress={() =>
                      letter
                        ? handleRemoveLetter(absoluteIndex)
                        : handleSelectBox(absoluteIndex)
                    }
                    style={[
                      styles.letterBox,
                      selectedIndex === absoluteIndex &&
                        styles.selectedBox,
                    ]}
                  >
                    <Text style={styles.letterText}>
                      {letter ?? ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>

      {/* 🧩 BOTONES DE ACCIÓN */}
      <View style={styles.actionsContainer}>
        <ActionButton
          icon="trash-outline"
          onPress={handleClearAll}
        />
        <ActionButton
          icon="share-social-outline"
          onPress={() => {}}
        />
        <ActionButton
          icon="shuffle-outline"
          onPress={handleRevealRandomLetter}
        />
        <ActionButton
          icon="bulb-outline"
          onPress={() => {}}
        />
      </View>

      {/* ⌨️ TECLADO */}
      <View style={styles.keyboardSection}>
        <View style={styles.keyboardContainer}>
          {ROWS.map((row, rowIndex) => {
            const lettersRow = row.split("");

            return (
              <View key={rowIndex} style={styles.row}>
                {lettersRow.map((letter) => (
                  <TouchableOpacity
                    key={letter}
                    activeOpacity={0.85}
                    style={styles.keyWrapper}
                    onPress={() => handleKeyPress(letter)}
                  >
                    <LinearGradient
                      colors={["#334155", "#1e293b"]}
                      style={styles.keyOuter}
                    >
                      <View style={styles.keyInner}>
                        <Text style={styles.keyText}>
                          {letter}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.addContainer} >

      </View>
    </View>
  );
}

/* ===============================
   BOTÓN REUTILIZABLE
=============================== */

function ActionButton({
  icon,
  onPress,
}: {
  icon: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.actionButton}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color="#f8fafc" />
    </TouchableOpacity>
  );
}

/* ===============================
   ESTILOS
=============================== */

const styles = StyleSheet.create({
    addContainer: {
        width: "100%",
        minHeight: 50
    },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
    gap: 10
  },

  wordWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },

  wordRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  letterBox: {
    width: 38,
    height: 45,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },

  selectedBox: {
    borderColor: "#22d3ee",
    shadowColor: "#22d3ee",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },

  letterText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#f8fafc",
  },

  /* ACCIONES */

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 40,
  },

  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  /* TECLADO */

  keyboardSection: {
    paddingHorizontal: 14,
  },

  keyboardContainer: {
    backgroundColor: "rgba(15, 23, 42, 0.98)",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  keyWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },

  keyOuter: {
    height: 40,
    borderRadius: 14,
    padding: 2,
  },

  keyInner: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },

  keyText: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
});