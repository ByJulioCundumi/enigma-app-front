import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Vibration,
  Dimensions,
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

/* ================= STORE ================= */
import {
  nextLevel,
  resetSelectedTopic,
} from "@/store/reducers/topicsSlice";
import { addEnergy, consumeEnergy } from "@/store/reducers/energySlice";
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
import { playSound } from "@/hooks/playSound";
import { playTimeSound, stopTimeSound } from "@/hooks/playTimeSound";
import { checkVip } from "@/utils/checkVip";

/* ================= CONSTANTS ================= */
const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const TOTAL_TIME = 30;
const EXTRA_TIME = 30;
const MAX_TIME = 120;
const MAX_TIME_USES = 3;

/* ================= HELPERS ================= */
const shuffleArray = (array: string[]) => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateKeyboardLetters = (word: string) => {
  const cleanWord = word.replace(/ /g, "");
  const wordLetters = cleanWord.split("");

  const screenWidth = Dimensions.get("window").width;

  const KEY_SIZE = 46;
  const PADDING = 20;

  const availableWidth = screenWidth - PADDING * 2;

  const lettersPerRow = Math.floor(availableWidth / (KEY_SIZE + 8));

  // 👉 IMPORTANTE: mínimo 3 filas si la palabra es grande
  let rows = 2;

  if (wordLetters.length > lettersPerRow * 2) {
    rows = 3;
  }

  const totalSlots = rows * lettersPerRow;

  const extraLettersCount = Math.max(
    0,
    totalSlots - wordLetters.length
  );

  const extraLetters = Array.from({ length: extraLettersCount }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]
  );

  const pool = [...wordLetters, ...extraLetters];

  return shuffleArray(pool).map((l) => ({
    letter: l,
    used: false,
  }));
};

/* ================= COMPONENT ================= */
export default function GameRoom() {
  const dispatch = useDispatch();
  const router = useRouter();

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
  const [keyboardLetters, setKeyboardLetters] = useState<
    { letter: string; used: boolean }[]
  >([]);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  /* ---------- SELECTORS ---------- */
  const levelData = useSelector(selectCurrentLevel);
  const energy = useSelector((state: any) => state.energy.energy);
  const isTopicCompleted = useSelector(selectIsTopicCompleted);

  const { startTimestamp, endTimestamp, extraTimeUsed } = useSelector(
    (state: IRootState) => state.timer
  );

  const { vipExpireAt } = useSelector((state: IRootState) => state.vip);
  const isVip = checkVip(vipExpireAt);

  const word = levelData?.word ?? "";
  const cleanWordLength = word.replace(/ /g, "").length;
  const shouldShowArrows = cleanWordLength > 7;

  /* ---------- DERIVED ---------- */
  const remainingLetters = letters.filter(
    (l, i) => word[i] !== " " && l === ""
  ).length;

  const hintDisabled = remainingLetters <= 2 || energy <= 0;
  const timeDisabled = extraTimeUsed >= MAX_TIME_USES || energy <= 0;

  /* ================= EFFECTS ================= */

  useEffect(() => {
    dispatch(setCurrentPage("gameMode"));
    playTimeSound(require("@/assets/sounds/soundTime.mp3"));

    return () => {
      dispatch(resetTimer());
      dispatch(resetSelectedTopic());
      stopTimeSound();
    };
  }, []);

  useEffect(() => {
    if (!word) return;

    dispatch(startLevelTimer(TOTAL_TIME));

    setLetters(word.split("").map((l) => (l === " " ? " " : "")));
    setSelectedIndex(0);
    setKeyboardLetters(generateKeyboardLetters(word));
    setValidationState("idle");
  }, [word]);

  useEffect(() => {
    if (!timerActive) return;
    if (!startTimestamp || !endTimestamp) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTimestamp) / 1000;
      const remaining = Math.ceil((endTimestamp - now) / 1000);

      if (elapsed > MAX_TIME || remaining <= 0) {
        playSound(require("@/assets/sounds/soundError3.mp3"));
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
    const allFilled = currentLetters.every((l, i) => l === " " || l !== "");
    if (!allFilled) return setValidationState("idle");

    const formedWord = currentLetters.join("");

    if (formedWord === word) {
      setValidationState("correct");
      setTimerActive(false);
      setLevelSuccess(true);
      setShowResult(true);

      isVip ? dispatch(addEnergy(2)) : dispatch(addEnergy(1));

      playSound(require("@/assets/sounds/soundLevelUp.mp3"));
    } else {
      setValidationState("incorrect");
      triggerShake();
      playSound(require("@/assets/sounds/soundError2.mp3"));
      Vibration.vibrate(100);
    }
  };

  const addLetter = (letter: string, keyboardIndex: number) => {
    if (!timerActive) return;

    const newLetters = [...letters];
    if (newLetters[selectedIndex] === " ") return;

    const previousLetter = newLetters[selectedIndex];

    if (previousLetter) {
      const prevKeyboardIndex = keyboardLetters.findIndex(
        (k) => k.letter === previousLetter && k.used
      );

      if (prevKeyboardIndex !== -1) {
        const newKeyboard = [...keyboardLetters];
        newKeyboard[prevKeyboardIndex].used = false;
        setKeyboardLetters(newKeyboard);
      }
    }

    newLetters[selectedIndex] = letter;
    setLetters(newLetters);

    const newKeyboard = [...keyboardLetters];
    newKeyboard[keyboardIndex].used = true;
    setKeyboardLetters(newKeyboard);

    moveCursorNext(selectedIndex);
    checkWordCompletion(newLetters);

    playSound(require("@/assets/sounds/soundClick2.mp3"));
  };

  const removeLetter = (index: number) => {
    const removedLetter = letters[index];
    if (!removedLetter || removedLetter === " ") return;

    const newLetters = [...letters];
    newLetters[index] = "";
    setLetters(newLetters);

    setSelectedIndex(index);
    setValidationState("idle");

    playSound(require("@/assets/sounds/soundClick5.mp3"));

    const keyboardIndex = keyboardLetters.findIndex(
      (k) => k.letter === removedLetter && k.used
    );

    if (keyboardIndex !== -1) {
      const newKeyboard = [...keyboardLetters];
      newKeyboard[keyboardIndex].used = false;
      setKeyboardLetters(newKeyboard);
    }
  };

  const clearLetters = (sound: boolean) => {
    setLetters(word.split("").map((l) => (l === " " ? " " : "")));
    setSelectedIndex(0);
    setKeyboardLetters((prev) => prev.map((k) => ({ ...k, used: false })));
    setValidationState("idle");

    if (sound) {
      playSound(require("@/assets/sounds/soundClick6.mp3"));
    }
  };

  const useHint = () => {
    if (energy <= 0 || remainingLetters <= 2) return;

    const availableIndexes = letters
      .map((l, i) => (word[i] !== " " && l !== word[i] ? i : -1))
      .filter((i) => i !== -1);

    if (!availableIndexes.length) return;

    const randomIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    const correctLetter = word[randomIndex];

    const newLetters = [...letters];
    newLetters[randomIndex] = correctLetter;
    setLetters(newLetters);

    const keyboardIndex = keyboardLetters.findIndex(
      (k) => k.letter === correctLetter && !k.used
    );

    if (keyboardIndex !== -1) {
      const newKeyboard = [...keyboardLetters];
      newKeyboard[keyboardIndex].used = true;
      setKeyboardLetters(newKeyboard);
    }

    dispatch(consumeEnergy(1));
    moveCursorNext(randomIndex);
    checkWordCompletion(newLetters);

    playSound(require("@/assets/sounds/soundDistorted.mp3"));
  };

  const addExtraTime = () => {
    if (energy <= 0 || extraTimeUsed >= MAX_TIME_USES) return;

    dispatch(addExtraTimeToTimer(EXTRA_TIME));
    dispatch(consumeEnergy(1));
    playSound(require("@/assets/sounds/soundDistorted.mp3"));
  };

  /* ================= HANDLERS ================= */

  const handleContinue = () => {
    if (isTopicCompleted) return;

    dispatch(nextLevel());
    dispatch(startLevelTimer(TOTAL_TIME));
    setShowResult(false);
    setTimerActive(true);

    playTimeSound(require("@/assets/sounds/soundTime.mp3"));
    playSound(require("@/assets/sounds/soundWind.mp3"));
  };

  const handleRetry = () => {
    clearLetters(false);
    dispatch(startLevelTimer(TOTAL_TIME));
    setShowResult(false);
    setTimerActive(true);

    playTimeSound(require("@/assets/sounds/soundTime.mp3"));
    playSound(require("@/assets/sounds/soundWind.mp3"));
  };

  const handleHome = () => {
    if (levelSuccess && !isTopicCompleted) {
      dispatch(nextLevel());
    }

    playSound(require("@/assets/sounds/soundWind.mp3"));
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

          <GameActions
            onClear={() => clearLetters(true)}
            onHint={useHint}
            onAddTime={addExtraTime}
            hintDisabled={hintDisabled}
            timeDisabled={timeDisabled}
          />

          <GameKeyboard letters={keyboardLetters} onPressKey={addLetter} />
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0f172a", paddingBottom: 20 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 25,  },
  scrollContent: { flexGrow: 1, alignItems: "center"},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  backButton: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 12,
  },
});