import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Dimensions, Animated, Vibration } from "react-native";
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import LevelCard from "@/components/LevelCard";
import { useRouter } from "expo-router";
import EnergyStat from "@/components/EnergyStat";
import { nextLevel, resetSelectedTopic } from "@/store/reducers/topicsSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLevel } from "@/store/selectors/topicSelectors";
import LevelResultPopup from "@/components/LevelResultPopup";
import { addEnergy, consumeEnergy } from "@/store/reducers/energySlice";
import { addExtraTimeToTimer, resetTimer, startLevelTimer } from "@/store/reducers/timerSlice";
import { LinearGradient } from "expo-linear-gradient";
import { IRootState } from "@/store/rootState";
import { playSound } from "@/hooks/playSound";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";
import { playTimeSound, stopTimeSound } from "@/hooks/playTimeSound";
import VipButton from "@/components/VipButton";
import { checkVip } from "@/utils/checkVip";

const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateKeyboardLetters = (word: string) => {
  const cleanWord = word.replace(/ /g, "");
  const wordLetters = cleanWord.split("");

  const screenWidth = Dimensions.get("window").width;
  const KEY_SIZE = 46;
  const lettersPerRow = Math.floor((screenWidth - 40) / KEY_SIZE);

  const rows = wordLetters.length <= lettersPerRow * 2 ? 2 : 3;

  const totalSlots = rows * lettersPerRow;

  const extraLettersCount = totalSlots - wordLetters.length;

  const extraLetters = [];

  for (let i = 0; i < extraLettersCount; i++) {
    const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    extraLetters.push(randomLetter);
  }

  const pool = [...wordLetters, ...extraLetters];
  const shuffled = shuffleArray(pool);

  return shuffled.map((l) => ({
    letter: l,
    used: false,
  }));
};

const TOTAL_TIME = 30;
const EXTRA_TIME = 30;
const MAX_TIME = 60;
const MAX_TIME_USES = 1;

export default function GameRoom() {
  const dispatch = useDispatch();
  const [showResult, setShowResult] = useState(false);
  const [levelSuccess, setLevelSuccess] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const levelData = useSelector(selectCurrentLevel);
  const energy = useSelector((state: any) => state.energy.energy);
  const word = levelData?.word ?? "";
  const words = word.split(" ");
  const scrollRef = useRef<ScrollView>(null);
  const cleanWordLength = word.replace(/ /g, "").length;
const shouldShowArrows = cleanWordLength > 7;
const [validationState, setValidationState] = useState<"idle" | "correct" | "incorrect">("idle");
const shakeAnim = useRef(new Animated.Value(0)).current;
  
  const [letters, setLetters] = useState<string[]>(
    word.split("").map((l) => (l === " " ? " " : ""))
  );
  const [keyboardLetters, setKeyboardLetters] = useState<
  { letter: string; used: boolean }[]
  >([]);
  
  const { startTimestamp, endTimestamp, extraTimeUsed } = useSelector(
    (state: IRootState) => state.timer
  );

  const { vipExpireAt } = useSelector(
    (state: IRootState) => state.vip
  );

  const isVip = checkVip(vipExpireAt)

  
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const router = useRouter();

  const screenWidth = Dimensions.get("window").width;
const KEY_SIZE = 46;

const lettersPerRow = Math.floor((screenWidth - 40) / KEY_SIZE);

const rows = word.length <= lettersPerRow * 2 ? 2 : 3;

const triggerShake = () => {
  shakeAnim.setValue(0);

  Animated.timing(shakeAnim, {
    toValue: 1,
    duration: 400,
    useNativeDriver: true,
  }).start(() => {
    shakeAnim.setValue(0); // reset limpio
  });
};

  useEffect(() => {
    dispatch(setCurrentPage("gameMode"))
    
    return () => {
      dispatch(resetTimer());
      dispatch(resetSelectedTopic());
      stopTimeSound();
    };
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    if (!startTimestamp || !endTimestamp) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTimestamp) / 1000;
      const remaining = Math.ceil((endTimestamp - now) / 1000);

      if (elapsed > MAX_TIME) {
        playSound(require("@/assets/sounds/soundFail4.mp3"));
        clearInterval(interval);
        setTimerActive(false);
        setLevelSuccess(false);
        setShowResult(true);
        stopTimeSound();
        return;
      }

      if (remaining <= 0) {
        playSound(require("@/assets/sounds/soundFail4.mp3"));
        clearInterval(interval);
        setTimerActive(false);
        setLevelSuccess(false);
        setShowResult(true);
        setTimeLeft(0);
        stopTimeSound();
        return;
      }

      setTimeLeft(remaining);
    }, 250);

    return () => {
      clearInterval(interval)
    };
  }, [timerActive, startTimestamp, endTimestamp]);

  useEffect(() => {
    if (!word) return;
    dispatch(startLevelTimer(TOTAL_TIME));
    playTimeSound(require("@/assets/sounds/soundTime.mp3"));
    setLetters(word.split("").map((l) => (l === " " ? " " : "")));
    setSelectedIndex(0);
    setKeyboardLetters(generateKeyboardLetters(word));
    setValidationState("idle");
  }, [word]);

  const progress = timeLeft / TOTAL_TIME;

  const getBarColor = () => {
    if (progress > 0.5) return "#22c55e";
    if (progress > 0.25) return "#f59e0b";
    return "#ef4444";
  };

  const moveCursorNext = (start: number) => {
    for (let i = start + 1; i < letters.length; i++) {
      if (letters[i] !== " " && letters[i] === "") {
        setSelectedIndex(i);
        return;
      }
    }
  };

  const checkWordCompletion = (currentLetters: string[]) => {
  const allFilled = currentLetters.every((l, i) => l === " " || l !== "");
  if (!allFilled) {
    setValidationState("idle"); // 👈 si ya no está completa, quitamos color
    return;
  }

  const formedWord = currentLetters.join("");

  if (formedWord === word) {
    setValidationState("correct"); // ✅ verde
    setTimerActive(false);
    setLevelSuccess(true);
    setShowResult(true);
    isVip ? dispatch(addEnergy(2)) : dispatch(addEnergy(1));
    playSound(require("@/assets/sounds/soundLevelUp.mp3"));
  } else {
    setValidationState("incorrect"); // ❌ rojo
    triggerShake(); // 🔥 AQUÍ
    playSound(require("@/assets/sounds/soundError2.mp3"));
    Vibration.vibrate(100);
  }
};

  const handleContinue = () => {
    dispatch(nextLevel());
    dispatch(startLevelTimer(TOTAL_TIME));
    setShowResult(false);
    setTimerActive(true);
    playSound(require("@/assets/sounds/soundWind.mp3"));
  };

  const handleRetry = () => {
    clearLetters(false);
    dispatch(startLevelTimer(TOTAL_TIME));
    setShowResult(false);
    setTimerActive(true);
    playSound(require("@/assets/sounds/soundWind.mp3"));
    playTimeSound(require("@/assets/sounds/soundTime.mp3"));
  };

  const handleHome = () => {
    playSound(require("@/assets/sounds/soundWind.mp3"));
    dispatch(resetTimer());
    router.replace("/");
  };

  const scrollLeft = () => {
  scrollRef.current?.scrollTo({ x: 0, animated: true });
};

const scrollRight = () => {
  scrollRef.current?.scrollToEnd({ animated: true });
};

  const addLetter = (letter: string, keyboardIndex: number) => {
  if (!timerActive) return;

  const newLetters = [...letters];

  if (newLetters[selectedIndex] === " ") return;

  const previousLetter = newLetters[selectedIndex];

  // 🔥 1. LIBERAR letra anterior si existe
  if (previousLetter && previousLetter !== "") {
    const prevKeyboardIndex = keyboardLetters.findIndex(
      (k) => k.letter === previousLetter && k.used
    );

    if (prevKeyboardIndex !== -1) {
      const newKeyboard = [...keyboardLetters];
      newKeyboard[prevKeyboardIndex].used = false;
      setKeyboardLetters(newKeyboard);
    }
  }

  // 🔥 2. COLOCAR nueva letra
  newLetters[selectedIndex] = letter;
  setLetters(newLetters);

  // 🔥 3. MARCAR nueva como usada
  const newKeyboard = [...keyboardLetters];
  newKeyboard[keyboardIndex].used = true;
  setKeyboardLetters(newKeyboard);

  moveCursorNext(selectedIndex);
  checkWordCompletion(newLetters);
  playSound(require("@/assets/sounds/soundClick2.mp3"));
};

  const removeLetter = (index: number) => {
    const removedLetter = letters[index];
    const newLetters = [...letters];
    if (removedLetter !== "" && removedLetter !== " ") {
      newLetters[index] = "";
      setLetters(newLetters);
      setSelectedIndex(index);
      setValidationState("idle");
      playSound(require("@/assets/sounds/soundClick3.mp3"));
      const keyboardIndex = keyboardLetters.findIndex(
        (k) => k.letter === removedLetter && k.used
      );
      if (keyboardIndex !== -1) {
        const newKeyboard = [...keyboardLetters];
        newKeyboard[keyboardIndex].used = false;
        setKeyboardLetters(newKeyboard);
      }
    }
  };

  const clearLetters = (sound:boolean) => {
    setLetters(word.split("").map((l) => (l === " " ? " " : "")));
    setSelectedIndex(0);
    setKeyboardLetters((prev) => prev.map((k) => ({ ...k, used: false })));
    setValidationState("idle");
    if(sound){
      playSound(require("@/assets/sounds/soundClick3.mp3"));
    }
  };

  const useHint = () => {
  if (energy <= 0) return;
  if (remainingLetters <= 3) return;

  const availableIndexes = letters
    .map((l, i) => (word[i] !== " " && l !== word[i] ? i : -1))
    .filter((i) => i !== -1);

  if (availableIndexes.length === 0) return;

  const randomIndex =
    availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

  const correctLetter = word[randomIndex];

  // 👉 1. Colocar la letra en el tablero
  const newLetters = [...letters];
  newLetters[randomIndex] = correctLetter;
  setLetters(newLetters);

  // 👉 2. Marcar la letra como usada en el teclado
  const keyboardIndex = keyboardLetters.findIndex(
    (k) => k.letter === correctLetter && !k.used
  );

  if (keyboardIndex !== -1) {
    const newKeyboard = [...keyboardLetters];
    newKeyboard[keyboardIndex].used = true;
    setKeyboardLetters(newKeyboard);
  }

  // 👉 3. Consumir energía
    dispatch(consumeEnergy(1));

  moveCursorNext(randomIndex);
  checkWordCompletion(newLetters);

  playSound(require("@/assets/sounds/soundDistorted.mp3"));
};

  const addExtraTime = () => {
    if ( energy <= 0) return;
    if (extraTimeUsed >= MAX_TIME_USES) return;
    dispatch(addExtraTimeToTimer(EXTRA_TIME));
    dispatch(consumeEnergy(1));
    playSound(require("@/assets/sounds/soundDistorted.mp3"));
  };

  const remainingLetters = letters.filter(
    (l, i) => word[i] !== " " && l === ""
  ).length;

  const hintDisabled = remainingLetters <= 3 || energy <= 0;
  const timeDisabled = extraTimeUsed >= MAX_TIME_USES || energy <= 0;

  return (
    <LinearGradient
          colors={[
            "#0c1936",  // azul oscuro profundo
            "#0f172a",  // azul intenso
            "#0f172a",  // azul vibrante
            "#0f172a",  // azul claro brillante
          ]}
          locations={[0, 0.35, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.screen}
        >

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={{flexDirection: "row", alignItems: "center", gap: 15}}>
            <VipButton/>
            <EnergyStat />
          </View>
        </View>

        {/* Contenido principal */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Imagen */}
          <View style={styles.imageWrapper}>
            <LevelCard/>
          </View>

          {/* 2. Barra de tiempo */}
          <View style={styles.timeBarContainer}>
            <FontAwesome6 name="bolt-lightning" size={12} color="#fff" />
            <Text style={styles.x2Text}>x2</Text>
            <View style={styles.timeBarBackground}>
              <View
                style={[
                  styles.timeBarFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: getBarColor(),
                  },
                ]}
              />
            </View>
            <Text style={styles.timeText}>{timeLeft}s</Text>
          </View>

          {/* 3. Palabra a completar */}
          <Animated.View
  style={[
    styles.wordContainer,
    {
      transform: [
  {
    translateX: shakeAnim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -12, 12, -8, 0],
    }),
  },
]
    },
    !shouldShowArrows && { alignSelf: "center", width: "auto" }
  ]}
>
  {/* Flecha izquierda */}
  {shouldShowArrows && (
  <TouchableOpacity onPress={scrollLeft} style={styles.arrowButton}>
    <Ionicons name="chevron-back" size={22} color="#fff" />
  </TouchableOpacity>
)}

  {/* Scroll horizontal */}
  <ScrollView
  ref={scrollRef}
  horizontal
  showsHorizontalScrollIndicator={false}
  style={!shouldShowArrows && { flexGrow: 0 }}
  contentContainerStyle={[
    styles.wordScrollContent,
    !shouldShowArrows && {
      justifyContent: "center",
      flexGrow: 0
    }
  ]}
>
    {letters.map((l, index) => {
      if (word[index] === " ") {
        return <View key={index} style={{ width: 12 }} />;
      }

      return (
        <TouchableOpacity
          key={index}
          onPress={() => {
            setSelectedIndex(index);
            removeLetter(index);
          }}
          style={[
  styles.letterBox,
  selectedIndex === index && styles.selectedLetterBox,

  validationState === "correct" && styles.correctBox,
  validationState === "incorrect" && styles.incorrectBox,
]}
        >
          <Text style={styles.letterText}>{l}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>

  {/* Flecha derecha */}
  {shouldShowArrows && (
  <TouchableOpacity onPress={scrollRight} style={styles.arrowButton}>
    <Ionicons name="chevron-forward" size={22} color="#fff" />
  </TouchableOpacity>
)}
</Animated.View>

          {/* 4. Botones de acción */}
          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.clearButton} onPress={()=> clearLetters(true)}>
              <MaterialCommunityIcons name="delete-sweep" size={24} color="#fff" />
            </TouchableOpacity>

            <View style={styles.actionWrapper}>
              <TouchableOpacity
                style={[styles.hintButton, hintDisabled && styles.disabledButton]}
                onPress={useHint}
                disabled={hintDisabled}
              >
                <MaterialCommunityIcons name="lightbulb-on" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.hintCostBadge}>
                <MaterialCommunityIcons name="lightning-bolt" size={12} color="#fff" />
                <Text style={styles.hintCostText}>1</Text>
              </View>
            </View>

            <View style={styles.actionWrapper}>
              <TouchableOpacity
                style={[styles.timeButton, timeDisabled && styles.disabledButton]}
                onPress={addExtraTime}
                disabled={timeDisabled}
              >
                <MaterialCommunityIcons name="timer-plus" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.timeBadge}>
                <MaterialCommunityIcons name="lightning-bolt" size={12} color="#ffffff" />
                <Text style={styles.hintCostText}>1</Text>
              </View>
            </View>
          </View>

          {/* 5. Teclado */}
          <View style={styles.keyboard}>
            {keyboardLetters.map((key, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.key, key.used && styles.keyUsed]}
                disabled={key.used}
                onPress={() => addLetter(key.letter, index)}
              >
                <Text style={styles.keyText}>{key.letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <LevelResultPopup
        visible={showResult}
        success={levelSuccess}
        energy={energy}
        onContinue={handleContinue}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  backButton: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 12,
  },
  imageWrapper: {
    borderRadius: 16,
    marginBottom: 16,
  },

arrowButton: {
  width: 34,
  height: 34,
  borderRadius: 10,
  backgroundColor: "#1e293b",
  justifyContent: "center",
  alignItems: "center",
  marginHorizontal: 6,
},
  timeBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 20,
    gap: 12,
    width: "100%",
  },
  x2Text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  timeBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: "#334155",
    borderRadius: 10,
    overflow: "hidden",
  },
  timeBarFill: {
    height: "100%",
  },
  correctBox: {
  borderColor: "#22c55e94",
  backgroundColor: "#22c55e22",
},

incorrectBox: {
  borderColor: "#ef444477",
  backgroundColor: "#ef444422",
},
  timeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    minWidth: 40,
    textAlign: "right",
  },
  timeBox:{
    flexDirection: "row",
    gap: 3,
    backgroundColor: "#ff006ace",
    width: 74
  },
  wordRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 6,
  },
  selectedLetterBox: {
    borderColor: "#f59e0b",
    backgroundColor: "#1e293b88",
  },
  letterText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  footerActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
    width: "100%",
    marginTop: 70
  },
  clearButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  actionWrapper: {
    position: "relative",
  },
  hintButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#f59e0b",
    justifyContent: "center",
    alignItems: "center",
  },
  timeButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#334155",
    opacity: 0.6,
  },
  hintCostBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fac000",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 28,
    justifyContent: "center",
  },
  timeBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16a34a",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 28,
    justifyContent: "center",
  },
  hintCostText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 2,
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 5,
    width: "100%",
    maxWidth: 420,
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

  wordContainer: {
  flexDirection: "row", // 🔥 CLAVE: todo en línea
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 24,
  backgroundColor: "#ffffff11",
  borderRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 8,
  width: "100%", // 🔥 evita que se encoja
},

wordScrollContent: {
  flexDirection: "row",
  alignItems: "center",
  flexGrow: 1, // 🔥 importante para centrar cuando es corto
  justifyContent: "center",
},

letterBox: {
  width: 34,
  height: 34,
  marginHorizontal: 4,
  borderRadius: 10,
  backgroundColor: "#1e293b",
  borderWidth: 2,
  borderColor: "#334155",
  justifyContent: "center",
  alignItems: "center",
},
});