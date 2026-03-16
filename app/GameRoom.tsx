import React, { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome6, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import LevelCard from "@/components/LevelCard";
import { useRouter } from "expo-router";
import SunburstBackground from "@/components/SunburstBackground";
import EnergyStat from "@/components/EnergyStat";
import { nextLevel, resetSelectedTopic } from "@/store/reducers/topicsSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentLevel } from "@/store/selectors/topicSelectors";
import LevelResultPopup from "@/components/LevelResultPopup";
import { addEnergy, consumeEnergy } from "@/store/reducers/energySlice";
import { addExtraTimeToTimer, resetTimer, startLevelTimer } from "@/store/reducers/timerSlice";

const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const keyboardRows = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","Ñ"],
  ["Z","X","C","V","B","N","M"],
];

const TOTAL_TIME = 30;
const EXTRA_TIME = 30;
const MAX_TIME = 60;
const MAX_TIME_USES = 1;

export default function GameRoom() {
  const dispatch = useDispatch()
  const [showResult, setShowResult] = useState(false);
  const [levelSuccess, setLevelSuccess] = useState(false);
  const [timerActive, setTimerActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_TIME);
  const levelData = useSelector(selectCurrentLevel);
  const energy = useSelector((state: any) => state.energy.energy);
  const word = levelData?.word ?? "";
  const words = word.split(" ");
  
  const [letters, setLetters] = useState<string[]>(
    word.split("").map((l) => (l === " " ? " " : ""))
  );

  const { startTimestamp, endTimestamp, extraTimeUsed } = useSelector(
  (state: any) => state.timer
);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      dispatch(resetTimer());
    };
  }, []);

  useEffect(() => {

  if (!timerActive) return;
  if (!startTimestamp || !endTimestamp) return;

  const interval = setInterval(() => {

    const now = Date.now();

    const elapsed = (now - startTimestamp) / 1000;
    const remaining = Math.ceil((endTimestamp - now) / 1000);

    // detección de manipulación
    if (elapsed > MAX_TIME) {

      clearInterval(interval);

      setTimerActive(false);
      setLevelSuccess(false);
      setShowResult(true);

      return;
    }

    if (remaining <= 0) {

      clearInterval(interval);

      setTimerActive(false);
      setLevelSuccess(false);
      setShowResult(true);

      setTimeLeft(0);

      return;
    }

    setTimeLeft(remaining);

  }, 250);

  return () => clearInterval(interval);

}, [timerActive, startTimestamp, endTimestamp]);

  useEffect(() => {

  return () => {

    dispatch(resetSelectedTopic());

  };

}, []);

useEffect(() => {

  if (!word) return;

  dispatch(startLevelTimer(TOTAL_TIME));

  setLetters(word.split("").map((l) => (l === " " ? " " : "")));
  setSelectedIndex(0);

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

  if (!allFilled) return;

  const formedWord = currentLetters.join("");

  if (formedWord === word) {

  setTimerActive(false);
  setLevelSuccess(true);
  setShowResult(true);

  dispatch(addEnergy(2));

  return;

}
};


const handleContinue = () => {

  dispatch(nextLevel());
  dispatch(startLevelTimer(TOTAL_TIME));

  setShowResult(false);
  setTimerActive(true);

};

const handleRetry = () => {

  clearLetters();

  dispatch(startLevelTimer(TOTAL_TIME));

  setShowResult(false);
  setTimerActive(true);

};

const handleHome = () => {

  dispatch(resetTimer());
  router.replace("/");

};

  const addLetter = (letter: string) => {

  if (!timerActive) return;

  const newLetters = [...letters];

  if (newLetters[selectedIndex] === " ") return;

  newLetters[selectedIndex] = letter;

  setLetters(newLetters);

  moveCursorNext(selectedIndex);

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

    if (remainingLetters <= 3) return;

    const availableIndexes = letters
      .map((l, i) => (word[i] !== " " && l !== word[i] ? i : -1))
      .filter((i) => i !== -1);

    if (availableIndexes.length === 0) return;

    const randomIndex =
      availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    const newLetters = [...letters];

    newLetters[randomIndex] = word[randomIndex];

    setLetters(newLetters);

    dispatch(consumeEnergy(1));
    moveCursorNext(randomIndex);

    checkWordCompletion(newLetters);

  };

  const addExtraTime = () => {

  if (energy <= 0) return;
  if (extraTimeUsed >= MAX_TIME_USES) return;

  dispatch(addExtraTimeToTimer(EXTRA_TIME));
  dispatch(consumeEnergy(1));

};

  const remainingLetters = letters.filter(
    (l, i) => word[i] !== " " && l === ""
  ).length;

  const hintDisabled = remainingLetters <= 3 || energy <= 0;

  const timeDisabled = extraTimeUsed >= MAX_TIME_USES || energy <= 0;

  return (
    <View style={styles.screen}>

      <SunburstBackground color="green" />

      <View style={styles.container}>

        <View style={styles.header}>

          <View style={styles.headerLeft}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace("/")}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

          </View>

          <EnergyStat/>

        </View>

        <View style={styles.gameArea}>

          <View style={styles.imageWrapper}>
            <LevelCard isIndex={false} />
          </View>

          <View style={styles.rightArea}>

            <View style={styles.keyboard}>

  {keyboardRows.map((row, rowIndex) => (

    <View key={rowIndex} style={[
    styles.keyboardRow,
    rowIndex === 1 && { paddingHorizontal: 20 },
    rowIndex === 2 && { paddingHorizontal: 50 },
  ]}>

      {row.map((letter, index) => (

        <TouchableOpacity
          key={index}
          style={styles.key}
          onPress={() => addLetter(letter)}
        >
          <Text style={styles.keyText}>{letter}</Text>
        </TouchableOpacity>

      ))}

    </View>

  ))}

</View>

            <View style={styles.wordContainer}>

              {words.map((singleWord, wordIndex) => {

                const startIndex =
                  words.slice(0, wordIndex).join("").length + wordIndex;

                return (

                  <View key={wordIndex} style={styles.wordRow}>

                    {singleWord.split("").map((_, i) => {

                      const letterIndex = startIndex + i;

                      const l = letters[letterIndex];

                      return (

                        <TouchableOpacity
                          key={letterIndex}
                          onPress={() => {
                            setSelectedIndex(letterIndex);
                            removeLetter(letterIndex);
                          }}
                          style={[
                            styles.letterBox,
                            selectedIndex === letterIndex &&
                              styles.selectedLetterBox,
                          ]}
                        >
                          <Text style={styles.letterText}>{l}</Text>
                        </TouchableOpacity>

                      );

                    })}

                  </View>

                );

              })}

            </View>

          </View>

        </View>

        <View style={styles.footer}>

          <View style={styles.timeBarContainer}>

            <FontAwesome6 name="bolt-lightning" size={9} color="#fff" />

            <Text style={{ color: "#fff" }}>x2 </Text>

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

          <View style={styles.footerActions}>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearLetters}
            >
              <MaterialCommunityIcons
                name="delete-sweep"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>

            <View style={styles.hintWrapper}>

              <TouchableOpacity
                style={[
                  styles.hintButton,
                  hintDisabled && styles.disabledButton
                ]}
                onPress={useHint}
                disabled={hintDisabled}
              >
                <MaterialCommunityIcons
                  name="lightbulb-on"
                  size={20}
                  color="#fff"
                />
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

            <View style={styles.timeWrapper}>

              <TouchableOpacity
                style={[
                  styles.timeButton,
                  timeDisabled && styles.disabledButton
                ]}
                onPress={addExtraTime}
                disabled={timeDisabled}
              >
                <MaterialCommunityIcons
                  name="timer-plus"
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>

              <View style={styles.timeBadge}>
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={10}
                  color="#fff"
                />
                <Text style={styles.hintCostText}>1</Text>
              </View>

            </View>

          </View>

        </View>

      </View>

      <LevelResultPopup
        visible={showResult}
        success={levelSuccess}
        energy={energy}
        onContinue={handleContinue}
        onRetry={handleRetry}
        onHome={handleHome}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },

  keyboardRow: {
  flexDirection: "row",
  justifyContent: "center",
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
    padding: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 8,
  },

  gameArea: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 20,
  },

  imageWrapper: {
    width: 400,
    height: 230,
    borderRadius: 16,
  },

  rightArea: {
    flex: 1,
    justifyContent: "center",
  },

  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 8,
  },

  key: {
    width: 30,
    height: 30,
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

  wordContainer: {
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#ffffff1e",
    borderRadius: 10,
    padding: 4,
    paddingHorizontal: 10,
    alignSelf: "center",
  },

  wordRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "auto"
  },

  letterBox: {
    width: 28,
    height: 28,
    margin: 3,
    borderRadius: 6,
    backgroundColor: "#1e293b",
    borderWidth: 2,
    borderColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },

  selectedLetterBox: {
    borderColor: "#f59e0b",
  },

  letterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  timeBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 10,
    width: 400,
  },

  timeBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#334155",
    borderRadius: 10,
    overflow: "hidden",
  },

  timeBarFill: {
    height: "100%",
    borderRadius: 10,
  },

  timeText: {
    color: "#fff",
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

  timeWrapper: {
    marginLeft: 8,
  },

  timeButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#334155",
    opacity: 0.5,
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

  timeBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#16a34a",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center"
  },

});