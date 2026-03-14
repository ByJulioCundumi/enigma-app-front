import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/rootState";

interface Props {
  word: string;
}

const ROWS = [
  "QWERTYUIOP",
  "ASDFGHJKLÑ",
  "ZXCVBNM",
];

export default function WordInputKeyboard({ word }: Props) {

  const { gameMode } = useSelector((state: IRootState) => state.gameMode);

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

  const handleBackspace = () => {
    const updated = [...letters];
    let targetIndex = selectedIndex;

    if (!updated[targetIndex]) {
      for (let i = targetIndex - 1; i >= 0; i--) {
        if (updated[i]) {
          targetIndex = i;
          break;
        }
      }

      if (!updated[targetIndex]) return;
    }

    updated[targetIndex] = null;
    setLetters(updated);
    setSelectedIndex(targetIndex);
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

  let globalIndex = 0;

  return (
    <View style={styles.container}>

      {/* PALABRAS */}
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
                    onPress={() => handleSelectBox(absoluteIndex)}
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

      {/* ACCIONES */}
      <View style={styles.actionsContainer}>

        <ActionButton
          icon="trash-outline"
          onPress={handleClearAll}
        />

        {gameMode === "normal" && (
          <ActionButton
            icon="share-social-outline"
            onPress={() => {}}
          />
        )}

        {gameMode === "survival" && (
          <ActionButton
            icon="timer-outline"
            onPress={() => {}}
            energyCost={1}
          />
        )}

        <ActionButton
          icon="shuffle-outline"
          onPress={handleRevealRandomLetter}
          energyCost={1}
        />

      </View>

      {/* TECLADO */}
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

                {rowIndex === ROWS.length - 1 && (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.keyWrapper}
                    onPress={handleBackspace}
                  >
                    <LinearGradient
                      colors={["#7a1134", "#520c21"]}
                      style={styles.keyOuter}
                    >
                      <View style={styles.keyInner}>
                        <Ionicons
                          name="backspace-outline"
                          size={20}
                          color="#f8fafc"
                        />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                )}

              </View>
            );
          })}

        </View>
      </View>

      <View style={styles.addContainer}></View>

    </View>
  );
}


/* BOTON REUTILIZABLE */

function ActionButton({
  icon,
  onPress,
  energyCost,
}: {
  icon: any;
  onPress: () => void;
  energyCost?: number;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.actionButton}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color="#f8fafc" />

      {energyCost && (
        <View style={styles.energyBadge}>
          <Ionicons name="flash" size={10} color="#fff" />
          <Text style={styles.energyText}>{energyCost}</Text>
        </View>
      )}

    </TouchableOpacity>
  );
}


/* ESTILOS */

const styles = StyleSheet.create({

  addContainer: {
    width: "100%",
    minHeight: 60,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    gap: 10,
  },

  wordWrapper: {
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 10,
    backgroundColor: "#0e0b3a31",
    paddingVertical: 12,
    borderRadius: 20,
    width: "auto",
    marginHorizontal: "auto",
  },

  wordRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },

  letterBox: {
    width: 35,
    height: 35,
    borderRadius: 5,
    borderBottomWidth: 2,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a2c",
  },

  selectedBox: {
    borderColor: "#0881f3",
  },

  letterText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#cdcecf",
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 20,
  },

  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
  },

  energyBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#f50b65",
  },

  energyText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    marginLeft: 2,
  },

  keyboardSection: {
    paddingHorizontal: 10,
  },

  keyboardContainer: {
    backgroundColor: "rgba(13, 26, 58, 0.98)",
    borderRadius: 24,
    padding: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },

  keyWrapper: {
    flex: 1,
    marginHorizontal: 0,
    gap: 5,
  },

  keyOuter: {
    height: 40,
    minWidth: 35,
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
  },

});