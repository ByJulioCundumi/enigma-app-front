import React, { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import LevelCard from "@/components/LevelCard";
import { useRouter } from "expo-router";

const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const word = "ARNOLD";
const hints = [
  "Actor famoso de Terminator",
  "Ex gobernador de California",
  "Protagonista de películas de acción de los 80 y 90",
];

const TOTAL_TIME = 30;

export default function GameRoom() {
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const [maxTime, setMaxTime] = useState<number>(TOTAL_TIME);
  const [energy, setEnergy] = useState<number>(15);
  const [timePurchases, setTimePurchases] = useState<number>(0);
  const MAX_TIME_PURCHASES = 3;
  const [currentHintIndex, setCurrentHintIndex] = useState<number>(0);
  const [letters, setLetters] = useState<string[]>(
    word.split("").map((l) => (l === " " ? " " : ""))
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [unlockedHints, setUnlockedHints] = useState<boolean[]>(
    hints.map((_, i) => i === 0)
  );

  const router = useRouter()

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          console.log("Tiempo terminado → mostrar anuncio");
          setTimePurchases(0);
          return TOTAL_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      clearInterval(timer);
    };
  }, []);

  const progress = timeLeft / maxTime;

  const getBarColor = () => {
    if (progress > 0.5) return "#22c55e";
    if (progress > 0.25) return "#f59e0b";
    return "#ef4444";
  };

  const buyTime = () => {
    if (energy <= 0 || timePurchases >= MAX_TIME_PURCHASES) return;

    setEnergy((prev) => prev - 1);
    setTimeLeft((prev) => prev + 30);
    setMaxTime((prev) => prev + 30);
    setTimePurchases((prev) => prev + 1);
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
    if (unlockedHints[currentHintIndex] || energy <= 0) return;

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

  // Función para verificar si la palabra está completa
  const checkWordCompletion = (currentLetters: string[]) => {
    // Revisar si todas las letras están llenas (sin "")
    const allFilled = currentLetters.every((l, i) => l === " " || l !== "");
    if (!allFilled) return;

    const formedWord = currentLetters.join("");
    if (formedWord === word) {
      console.log("¡Palabra correcta!: ", formedWord);
    } else {
      console.log("Palabra incorrecta: ", formedWord);
    }
  };

  const addLetter = (letter: string) => {
    const newLetters = [...letters];
    if (newLetters[selectedIndex] === " ") return;

    newLetters[selectedIndex] = letter;
    setLetters(newLetters);

    moveCursorNext(selectedIndex);

    // Revisar si se completó la palabra
    checkWordCompletion(newLetters);
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

    // Revisar si se completó la palabra después de usar pista
    checkWordCompletion(newLetters);
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={()=> router.replace("/")}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.energyBadge}>
          <MaterialCommunityIcons name="lightning-bolt" size={18} color="#fff" />
          <Text style={styles.energyText}>{energy}</Text>
        </View>
      </View>

      {/* --- GAME AREA --- */}
      <View style={styles.gameArea}>
        <View style={styles.imageWrapper}>
          <LevelCard isIndex={false} />
        </View>

        <View style={styles.rightArea}>
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
        </View>
      </View>

      {/* --- FOOTER --- */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social" size={18} color="#fff" />
          <Text style={styles.shareText}>Compartir</Text>
        </TouchableOpacity>

        <View style={styles.timeBarContainer}>
          <MaterialCommunityIcons name="timer-outline" size={18} color="#fff" />
          <View style={styles.timeBarBackground}>
            <View
              style={[
                styles.timeBarFill,
                { width: `${progress * 100}%`, backgroundColor: getBarColor() },
              ]}
            />
          </View>
          <Text style={styles.timeText}>{timeLeft}s</Text>
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
              <MaterialCommunityIcons name="lightning-bolt" size={10} color="#fff" />
              <Text style={styles.hintCostText}>1</Text>
            </View>
          </View>

          <View style={styles.timeWrapper}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timePurchases >= MAX_TIME_PURCHASES && styles.disabledButton,
              ]}
              onPress={buyTime}
              disabled={timePurchases >= MAX_TIME_PURCHASES}
            >
              <MaterialCommunityIcons name="timer-plus" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.hintCostBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={10} color="#fff" />
              <Text style={styles.hintCostText}>1</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", paddingHorizontal: 30, paddingTop: 10, paddingBottom: 10 },
  disabledButton: { opacity: 0.4 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  backButton: { backgroundColor: "#1e293b", padding: 5, borderRadius: 10, marginRight: 8 },
  levelText: { color: "#fff", fontWeight: "700" },
  hintContainer: { flexDirection: "row", alignItems: "center", gap: 5, flex: 1, marginHorizontal: 0, backgroundColor: "#1e293b", padding: 8, paddingVertical: 13, borderRadius: 12, height: 40 },
  hintTextWrapper: { flex: 1, alignItems: "center", flexDirection: "row", gap: 20, marginTop: -2 },
  hintCounter: { color: "#94a3b8", fontSize: 11, marginBottom: -2.5 },
  hintText: { color: "#fff", fontSize: 13 },
  lockedHint: { flexDirection: "row", alignItems: "center" },
  lockedHintText: { color: "#fff", marginHorizontal: 6 },
  hintUnlockBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#facc15", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginLeft: 4 },
  hintUnlockCostText: { color: "#000", fontSize: 10, fontWeight: "700", marginLeft: 2 },
  energyBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#f97316", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  energyText: { color: "#fff", fontWeight: "700", marginLeft: 4 },
  gameArea: { flexDirection: "row", alignItems: "center", flex: 1, marginTop: 15, gap: 20 },
  imageWrapper: { width: 400, height: 230, borderRadius: 16, },
  image: { width: "100%", height: "100%" },
  rightArea: { flex: 1, justifyContent: "center" },
  keyboard: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", backgroundColor: "#1e293b", borderRadius: 16, padding: 8 },
  key: { width: 32, height: 32, margin: 3, borderRadius: 8, backgroundColor: "#334155", justifyContent: "center", alignItems: "center" },
  keyText: { color: "#fff", fontWeight: "700" },
  wordContainer: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  letterBox: { width: 32, height: 38, margin: 3, borderRadius: 6, backgroundColor: "#1e293b", borderWidth: 2, borderColor: "#334155", justifyContent: "center", alignItems: "center" },
  selectedLetterBox: { borderColor: "#f59e0b" },
  letterText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  space: { width: 14 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 },
  shareButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#22c55e", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  shareText: { color: "#fff", marginLeft: 6, fontWeight: "700" },
  timeBarContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e293b", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, gap: 10, width: 300 },
  timeBarBackground: { flex: 1, height: 8, backgroundColor: "#334155", borderRadius: 10, overflow: "hidden" },
  timeBarFill: { height: "100%", borderRadius: 10 },
  timeText: { color: "#fff", fontWeight: "700" },
  footerActions: { flexDirection: "row", alignItems: "center" },
  clearButton: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#ef4444", justifyContent: "center", alignItems: "center" },
  hintWrapper: { marginLeft: 8 },
  timeWrapper: { marginLeft: 8 },
  hintButton: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#f59e0b", justifyContent: "center", alignItems: "center" },
  timeButton: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#3b82f6", justifyContent: "center", alignItems: "center" },
  hintCostBadge: { position: "absolute", top: -6, right: -6, flexDirection: "row", alignItems: "center", backgroundColor: "#f97316", paddingHorizontal: 4, paddingVertical: 1, borderRadius: 6 },
  hintCostText: { color: "#fff", fontSize: 9, marginLeft: 1, fontWeight: "700" },
});