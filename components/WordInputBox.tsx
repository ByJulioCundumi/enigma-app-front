import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ValidationState = "idle" | "correct" | "incorrect";

type Props = {
  letters: string[];
  word: string;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  validationState: ValidationState;
  onRemoveLetter: (index: number) => void;
  shouldShowArrows: boolean;
  shakeAnim: Animated.Value;
};

export default function WordInputBox({
  letters,
  word,
  selectedIndex,
  setSelectedIndex,
  validationState,
  onRemoveLetter,
  shouldShowArrows,
  shakeAnim,
}: Props) {
  const scrollRef = useRef<ScrollView | null>(null);

  // 👉 medidas FIJAS (coinciden con styles)
  const LETTER_WIDTH = 34;
  const LETTER_MARGIN = 8; // 4 + 4
  const ITEM_SIZE = LETTER_WIDTH + LETTER_MARGIN;

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;

    const x = index * ITEM_SIZE;

    scrollRef.current.scrollTo({
      x: Math.max(0, x - 80), // offset para que se vea el siguiente espacio
      animated: true,
    });
  };

  // 🔥 auto scroll cuando cambia el cursor
  useEffect(() => {
    scrollToIndex(selectedIndex);
  }, [selectedIndex]);

  const scrollLeft = () => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
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
          ],
        },
        !shouldShowArrows && { alignSelf: "center", width: "auto" },
      ]}
    >
      {/* Flecha izquierda */}
      {shouldShowArrows && (
        <TouchableOpacity onPress={scrollLeft} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Scroll */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={!shouldShowArrows && { flexGrow: 0 }}
        contentContainerStyle={[
          styles.wordScrollContent,
          !shouldShowArrows && {
            justifyContent: "center",
            flexGrow: 0,
          },
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
                onRemoveLetter(index);
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
  );
}

const styles = StyleSheet.create({
  wordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: "#ffffff11",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    width: "100%",
  },

  wordScrollContent: {
    flexDirection: "row",
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
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

  selectedLetterBox: {
    borderColor: "#f59e0b",
    backgroundColor: "#1e293b88",
  },

  correctBox: {
    borderColor: "#22c55e94",
    backgroundColor: "#22c55e22",
  },

  incorrectBox: {
    borderColor: "#ef444477",
    backgroundColor: "#ef444422",
  },

  letterText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});