import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Vibration,
  Dimensions,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";

/* ================= COMPONENTS ================= */
import LevelCard from "@/components/LevelCard";
import EnergyStat from "@/components/EnergyStat";
import LevelResultPopup from "@/components/LevelResultPopup";
import TimeBar from "@/components/TimeBar";
import WordInputBox from "@/components/WordInputBox";
import GameActions from "@/components/GameActions";
import GameKeyboard from "@/components/GameKeyboard";
import VipButton from "@/components/VipButton";
import ConfettiCannon from "react-native-confetti-cannon";

/* ================= STORE ================= */
import {
  nextLevel,
  resetSelectedTopic,
} from "@/store/reducers/topicsSlice";
import {
  addEnergy,
  consumeEnergy,
} from "@/store/reducers/energySlice";
import {
  addExtraTimeToTimer,
  resetTimer,
  startLevelTimer,
} from "@/store/reducers/timerSlice";
import {
  selectCurrentLevel,
  selectIsTopicCompleted,
} from "@/store/selectors/topicSelectors";
import { IRootState } from "@/store/rootState";
import { setCurrentPage } from "@/store/reducers/currentPageSlice";

/* ================= HOOKS / UTILS ================= */
import { useSoundEffect } from "@/hooks/useSoundEffect";
import { useTimeSound } from "@/hooks/useTimeSound";


/* ================= CONSTANTS ================= */
const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const shuffle = (array: string[]) =>
  [...array].sort(() => Math.random() - 0.5);


const TOTAL_TIME = 60;
const EXTRA_TIME = 60;
const MAX_TIME = 120;
const MAX_TIME_USES = 3;

/* ================= HELPERS ================= */
const generateKeyboardLetters = (word: string) => {
  const cleanWord = word.replace(/ /g, "");
  const wordLetters = cleanWord.split("");

  // 🎯 1. asegurar letras de la palabra
  let pool = [...wordLetters];

  // 🎯 2. rellenar hasta 27
  while (pool.length < 22) {
    const randomLetter =
      ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

    // evita exceso de repetición
    const count = pool.filter((l) => l === randomLetter).length;

    if (count < 2) {
      pool.push(randomLetter);
    }
  }

  // 🎯 3. mezclar
  const shuffled = shuffle(pool);

  // 🎯 4. convertir a keys
  const keys = shuffled.map((l) => ({
    letter: l,
    used: false,
  }));

  // 🎯 5. dividir en 3 filas de 9
  return [
    keys.slice(0, 8),
    keys.slice(8, 16),
    keys.slice(16, 22),
  ];
};

/* ================= COMPONENT ================= */
export default function GameRoom() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { width } = Dimensions.get("window");

  /* ---------- STATE ---------- */
  const [showResult, setShowResult] = useState(false);
  const [levelSuccess, setLevelSuccess] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [validationState, setValidationState] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const [letters, setLetters] = useState<string[]>([]);

  /* ================= STATE ================= */
  const [keyboardLetters, setKeyboardLetters] = useState<
    { letter: string; used: boolean }[][]
  >([]);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  /* ---------- SELECTORS ---------- */
  const levelData = useSelector(selectCurrentLevel);
  
  const { startTimestamp, endTimestamp, extraTimeUsed } = useSelector(
    (state: IRootState) => state.timer
  );
  
  const { isVip } = useSelector((state: IRootState) => state.vip);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const word = levelData?.word ?? "";
  const cleanWordLength = word.replace(/ /g, "").length;
  const energy = useSelector((state: any) => state.energy.energy);
  const shouldShowArrows = cleanWordLength > 7;
  
  const isTopicCompleted = useSelector(selectIsTopicCompleted);

  /* ---------- DERIVED ---------- */
  const remainingLetters = letters.filter(
    (l, i) => word[i] !== " " && l === ""
  ).length;

  const hintDisabled = remainingLetters <= 2 || energy <= 0;
  const timeDisabled = extraTimeUsed >= MAX_TIME_USES || energy <= 0;

  const windSound = useSoundEffect(require("@/assets/sounds/soundWind.mp3"));
  const actionSound = useSoundEffect(require("@/assets/sounds/soundDistorted.mp3"));
  const failedLevel = useSoundEffect(require("@/assets/sounds/soundError3.mp3"));
  const errorSound = useSoundEffect(require("@/assets/sounds/soundError2.mp3"));
  const timeSound = useTimeSound(require("@/assets/sounds/soundTime.mp3"));
  const levelUpSound = useSoundEffect(require("@/assets/sounds/soundLevelUp.mp3"));
  const clickSound = useSoundEffect(require("@/assets/sounds/soundClick2.mp3"));
  const clickSoundTwo = useSoundEffect(require("@/assets/sounds/soundClick5.mp3"));
  const clickSoundThree = useSoundEffect(require("@/assets/sounds/soundClick6.mp3"));

  const gameEnabled = !isTopicCompleted && timerActive;

  /* ================= EFFECTS ================= */
  useEffect(() => {
  dispatch(setCurrentPage("gameMode"));

  if (!isTopicCompleted) {
    timeSound.play();
  }

  return () => {
    dispatch(resetTimer());
    dispatch(resetSelectedTopic());
    timeSound.pause();
  };
}, [isTopicCompleted]);

  useEffect(() => {
  if (!word || isTopicCompleted) return;

  dispatch(startLevelTimer(TOTAL_TIME));

  setLetters(
    word.split("").map((l) => (l === " " ? " " : ""))
  );

  setSelectedIndex(0);
  setKeyboardLetters(generateKeyboardLetters(word));
  setValidationState("idle");
}, [word, isTopicCompleted]);

  /* ================= HELPERS INTERNOS ================= */

  // 🔍 Buscar letra en teclado
  const findKey = (
    letter: string,
    onlyUsed?: boolean
  ): { row: number; col: number } | null => {
    for (let row = 0; row < keyboardLetters.length; row++) {
      for (let col = 0; col < keyboardLetters[row].length; col++) {
        const key = keyboardLetters[row][col];

        if (
          key.letter === letter &&
          (onlyUsed === undefined || key.used === onlyUsed)
        ) {
          return { row, col };
        }
      }
    }
    return null;
  };

  // 🧠 Clonar teclado
  const cloneKeyboard = () =>
    keyboardLetters.map((row) =>
      row.map((k) => ({ ...k }))
    );

useEffect(() => {
  if (!timerActive || isTopicCompleted) return;
  if (!startTimestamp || !endTimestamp) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTimestamp) / 1000;
      const remaining = Math.ceil((endTimestamp - now) / 1000);

      if (elapsed > MAX_TIME || remaining <= 0) {
        failedLevel.play()

        clearInterval(interval);
        setTimerActive(false);
        setLevelSuccess(false);
        setShowResult(true);
        setTimeLeft(0);

        timeSound.pause()
        return;
      }

      setTimeLeft(remaining);
    }, 250);

    return () => clearInterval(interval);
  }, [timerActive, startTimestamp, endTimestamp]);

  /* ================= LOGIC ================= */

  const triggerShake = () => {
    shakeAnim.setValue(0);

    Animated.timing(shakeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start(() => shakeAnim.setValue(0));
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
    const allFilled = currentLetters.every(
      (l, i) => l === " " || l !== ""
    );

    if (!allFilled) return setValidationState("idle");

    const formedWord = currentLetters.join("");

    if (formedWord !== word) {
      errorSound.play();
      setValidationState("incorrect");
      triggerShake();
      Vibration.vibrate(100);
    } else {
      setShowConfetti(true);
      setValidationState("correct");
      setTimerActive(false);
      setLevelSuccess(true);

      isVip
        ? dispatch(addEnergy(2))
        : dispatch(addEnergy(1));

      levelUpSound.play();
      timeSound.pause();
    }
  };

  /* ================= LOGIC ================= */

  const addLetter = (
    letter: string,
    row: number,
    col: number
  ) => {
    if (!timerActive || isTopicCompleted) return;
    const newLetters = [...letters];
    if (newLetters[selectedIndex] === " ") return;

    const previousLetter = newLetters[selectedIndex];
    const newKeyboard = cloneKeyboard();

    // liberar letra previa
    if (previousLetter) {
      const prev = findKey(previousLetter, true);
      if (prev) {
        newKeyboard[prev.row][prev.col].used = false;
      }
    }

    // asignar nueva letra
    newLetters[selectedIndex] = letter;
    setLetters(newLetters);

    newKeyboard[row][col].used = true;
    setKeyboardLetters(newKeyboard);

    moveCursorNext(selectedIndex);
    checkWordCompletion(newLetters);

    clickSound.play();
  };

  const removeLetter = (index: number) => {
    if (!gameEnabled) return;
    const removedLetter = letters[index];

    if (!removedLetter || removedLetter === " ") return;

    const newLetters = [...letters];
    newLetters[index] = "";

    setLetters(newLetters);
    setSelectedIndex(index);
    setValidationState("idle");

    const newKeyboard = cloneKeyboard();
    const pos = findKey(removedLetter, true);

    if (pos) {
      newKeyboard[pos.row][pos.col].used = false;
    }

    setKeyboardLetters(newKeyboard);

    clickSoundTwo.play();
  };

  const clearLetters = (sound: boolean) => {
    if (!gameEnabled) return;
    setLetters(
      word.split("").map((l) => (l === " " ? " " : ""))
    );

    setSelectedIndex(0);
    setKeyboardLetters(generateKeyboardLetters(word));
    setValidationState("idle");

    if (sound) {
      clickSoundThree.play();
    }
  };

  const useHint = () => {
    if (energy <= 0 || remainingLetters <= 2) return;
    if (!gameEnabled) return;

    const availableIndexes = letters
      .map((l, i) =>
        word[i] !== " " && l !== word[i] ? i : -1
      )
      .filter((i) => i !== -1);

    if (!availableIndexes.length) return;

    const randomIndex =
      availableIndexes[
        Math.floor(Math.random() * availableIndexes.length)
      ];

    const correctLetter = word[randomIndex];
    const newLetters = [...letters];
    newLetters[randomIndex] = correctLetter;

    setLetters(newLetters);

    const newKeyboard = cloneKeyboard();
    const pos = findKey(correctLetter, false);

    if (pos) {
      newKeyboard[pos.row][pos.col].used = true;
    }

    setKeyboardLetters(newKeyboard);

    dispatch(consumeEnergy(1));

    moveCursorNext(randomIndex);
    checkWordCompletion(newLetters);

    actionSound.play();
  };

  const addExtraTime = () => {
    if (energy <= 0 || extraTimeUsed >= MAX_TIME_USES) return;
    if (!gameEnabled) return;

    dispatch(addExtraTimeToTimer(EXTRA_TIME));
    dispatch(consumeEnergy(1));

    actionSound.play();
  };

  /* ================= HANDLERS ================= */

  const handleContinue = () => {
    if (isTopicCompleted) return;

    dispatch(nextLevel());
    dispatch(startLevelTimer(TOTAL_TIME));

    setShowResult(false);
    setTimerActive(true);

    timeSound.play();
    windSound.play();
  };

  const handleRetry = () => {
    clearLetters(false);
    dispatch(startLevelTimer(TOTAL_TIME));

    setShowResult(false);
    setTimerActive(true);

    timeSound.play();
    windSound.play();
  };

  const handleHome = () => {
    if (levelSuccess && !isTopicCompleted) {
      dispatch(nextLevel());
    }

    windSound.play();
    dispatch(resetTimer());
    router.replace("/");
  };

  /* ================= RENDER ================= */

  return (
    <LinearGradient
      colors={["#0c1936", "#0f172a", "#0f172a", "#0f172a"]}
      locations={[0, 0.35, 0.7, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.screen}
    >

      {/* 🎉 CONFETTI */}
      <Modal transparent visible={showConfetti} animationType="none">
        <View style={{ flex: 1 }}>
          <ConfettiCannon
            count={60}
            origin={{ x: width / 2, y: 0 }}
            fadeOut
            fallSpeed={1800}
            onAnimationEnd={() => {
              setShowConfetti(false);

              // pequeño delay opcional para suavidad
              setTimeout(() => {
                handleContinue();
              }, 200);
            }}
          />
        </View>
      </Modal>

      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={{ flexDirection: "row", gap: 15 }}>
            <VipButton />
            <EnergyStat />
          </View>
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <LevelCard />

          <TimeBar timeLeft={timeLeft} totalTime={TOTAL_TIME} />

          <WordInputBox
            letters={letters}
            word={word}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            validationState={validationState}
            onRemoveLetter={removeLetter}
            shouldShowArrows={shouldShowArrows}
            shakeAnim={shakeAnim}
          />

          <View style={styles.bottom}>
            <GameActions
            onClear={() => clearLetters(true)}
            onHint={useHint}
            onAddTime={addExtraTime}
            hintDisabled={hintDisabled}
            timeDisabled={timeDisabled}
          />

          <GameKeyboard
            letters={keyboardLetters}
            onPressKey={addLetter}
          />
          </View>
        </ScrollView>
      </View>

      <LevelResultPopup
        visible={showResult}
        energy={energy}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    </LinearGradient>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f172a" },
  container: { flex: 1, paddingTop: 30,  },
  scrollContent: { flexGrow: 1, alignItems: "center"},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
    width: "90%",
    marginHorizontal: "auto"
  },
  backButton: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 12,
  },
  bottom:{
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  }
});