import React, { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const word = "ARNOLD";

const hints = [
  "Actor famoso de Terminator",
  "Ex gobernador de California",
  "Protagonista de películas de acción de los 80 y 90",
];

export default function GameRoom() {
  const [seconds, setSeconds] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(15);

  const [currentHintIndex, setCurrentHintIndex] = useState<number>(0);

  const [letters, setLetters] = useState<string[]>(
    word.split("").map((l) => (l === " " ? " " : ""))
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [unlockedHints, setUnlockedHints] = useState<boolean[]>(
    hints.map((_, i) => i === 0)
  );

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      clearInterval(timer);
    };
  }, []);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const nextHint = () => {
    setCurrentHintIndex((prev) =>
      prev === hints.length - 1 ? 0 : prev + 1
    );
  };

  const prevHint = () => {
    setCurrentHintIndex((prev) =>
      prev === 0 ? hints.length - 1 : prev - 1
    );
  };

  const unlockHint = () => {
    if (unlockedHints[currentHintIndex]) return;
    if (energy <= 0) return;

    const newUnlocked = [...unlockedHints];
    newUnlocked[currentHintIndex] = true;

    setUnlockedHints(newUnlocked);
    setEnergy((prev) => prev - 1);
  };

  const moveCursorNext = (start: number) => {
    for (let i = start + 1; i < letters.length; i++) {
      if (letters[i] !== " ") {
        setSelectedIndex(i);
        return;
      }
    }
  };

  const addLetter = (letter: string) => {
    const newLetters = [...letters];

    if (newLetters[selectedIndex] === " ") return;

    newLetters[selectedIndex] = letter;

    setLetters(newLetters);

    moveCursorNext(selectedIndex);
  };

  const removeLetter = (index: number) => {
    const newLetters = [...letters];

    if (newLetters[index] !== " ") {
      newLetters[index] = "";
      setLetters(newLetters);
      setSelectedIndex(index);
    }
  };

  const clearLetters = () => {
    setLetters(word.split("").map((l) => (l === " " ? " " : "")));
    setSelectedIndex(0);
  };

  const useHint = () => {
    if (energy <= 0) return;

    const availableIndexes = letters
      .map((l, i) => (word[i] !== " " && l !== word[i] ? i : -1))
      .filter((i) => i !== -1);

    if (availableIndexes.length === 0) return;

    const randomIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    const newLetters = [...letters];

    newLetters[randomIndex] = word[randomIndex];

    setLetters(newLetters);

    setEnergy((prev) => prev - 1);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv 12</Text>
          </View>
        </View>

        {/* PISTAS */}

        <View style={styles.hintContainer}>
          <TouchableOpacity onPress={prevHint}>
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>

          <View style={styles.hintTextWrapper}>
            <Text style={styles.hintCounter}>
              {currentHintIndex + 1}/{hints.length}
            </Text>

            {unlockedHints[currentHintIndex] ? (
              <Text style={styles.hintText}>
                Pista {currentHintIndex + 1}: {hints[currentHintIndex]}
              </Text>
            ) : (
              <View style={styles.lockedHint}>
                <MaterialCommunityIcons name="lock" size={14} color="#fff" />

                <Text style={styles.lockedHintText}>Pista {currentHintIndex+1} bloqueada</Text>

                <TouchableOpacity
                  style={styles.hintUnlockBadge}
                  onPress={unlockHint}
                >
                  <MaterialCommunityIcons
                    name="lightning-bolt"
                    size={12}
                    color="#000"
                  />
                  <Text style={styles.hintUnlockCostText}>1</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={nextHint}>
            <Ionicons name="chevron-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.energyBadge}>
          <MaterialCommunityIcons name="lightning-bolt" size={18} color="#fff" />
          <Text style={styles.energyText}>{energy}</Text>
        </View>
      </View>

      {/* GAME AREA */}

      <View style={styles.gameArea}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: "https://picsum.photos/600/400" }}
            style={styles.image}
          />
        </View>

        <View style={styles.keyboard}>
          {alphabet.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.key}
              onPress={() => addLetter(letter)}
            >
              <Text style={styles.keyText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* FOOTER */}

      <View style={styles.footer}>
        <View style={styles.timer}>
          <MaterialCommunityIcons
            name="timer-outline"
            size={18}
            color="#ffd166"
          />
          <Text style={styles.timerText}>{formatTime()}</Text>
        </View>

        <View style={styles.wordContainer}>
          {letters.map((l, i) =>
            l === " " ? (
              <View key={i} style={styles.space} />
            ) : (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setSelectedIndex(i);
                  removeLetter(i);
                }}
                style={[
                  styles.letterBox,
                  selectedIndex === i && styles.selectedLetterBox,
                ]}
              >
                <Text style={styles.letterText}>{l}</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearLetters}>
            <MaterialCommunityIcons name="delete-sweep" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.hintWrapper}>
            <TouchableOpacity style={styles.hintButton} onPress={useHint}>
              <MaterialCommunityIcons name="lightbulb-on" size={20} color="#fff" />
            </TouchableOpacity>

            <View style={styles.hintCostBadge}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={10}
                color="#fff"
              />
              <Text style={styles.hintCostText}>1</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.actionButtonShare}>
            <Ionicons name="share-social" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
  },

  levelBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  levelText: {
    color: "#fff",
    fontWeight: "700",
  },

  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 20,
    backgroundColor: "#1e293b",
    padding: 8,
    borderRadius: 12,
    height: 50,
  },

  hintTextWrapper: {
    flex: 1,
    alignItems: "center",
  },

  hintCounter: {
    color: "#94a3b8",
    fontSize: 11,
  },

  hintText: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
  },

  lockedHint: {
    flexDirection: "row",
    alignItems: "center",
  },

  lockedHintText: {
    color: "#fff",
    marginHorizontal: 6,
  },

  hintUnlockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#facc15",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 4,
  },

  hintUnlockCostText: {
    color: "#000",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 2,
  },

  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f97316",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  energyText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 4,
  },

  gameArea: {
    flexDirection: "row",
    flex: 1,
    marginTop: 15,
    gap: 10,
  },

  imageWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#ffffff",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  keyboard: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 6,
  },

  key: {
    width: 32,
    height: 32,
    margin: 3,
    borderRadius: 8,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  keyText: {
    color: "#fff",
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  timer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  timerText: {
    color: "#ffd166",
    marginLeft: 6,
    fontWeight: "700",
  },

  wordContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },

  letterBox: {
    width: 30,
    height: 36,
    margin: 2,
    borderRadius: 6,
    backgroundColor: "#1e293b",
    borderWidth: 2,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  selectedLetterBox: {
    borderColor: "#f59e0b",
    backgroundColor: "#334155",
  },

  space: {
    width: 14,
  },

  letterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  footerActions: {
    flexDirection: "row",
    alignItems: "center",
  },

  clearButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  hintWrapper: {
    marginLeft: 8,
  },

  hintButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
  },

  hintCostBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f97316",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
  },

  hintCostText: {
    color: "#fff",
    fontSize: 9,
    marginLeft: 1,
    fontWeight: "700",
  },

  actionButtonShare: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});