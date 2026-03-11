import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GameState {
  currentTopic: string | null;
  currentLevelIndex: number;
  hintsUsed: number;
  completedLevels: Record<string, number[]>;
}

const initialState: GameState = {
  currentTopic: null,
  currentLevelIndex: 0,
  hintsUsed: 0,
  completedLevels: {}
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setTopic(state, action: PayloadAction<string>) {
      state.currentTopic = action.payload;
      state.currentLevelIndex = 0;
      state.hintsUsed = 0;
    },

    nextLevel(state) {
      state.currentLevelIndex += 1;
      state.hintsUsed = 0;
    },

    useHint(state) {
      state.hintsUsed += 1;
    },

    completeLevel(state, action: PayloadAction<string>) {
      const topic = action.payload;

      if (!state.completedLevels[topic]) {
        state.completedLevels[topic] = [];
      }

      const levelIndex = state.currentLevelIndex;

      // evitar duplicados
      if (!state.completedLevels[topic].includes(levelIndex)) {
        state.completedLevels[topic].push(levelIndex);
      }
    }
  }
});

export const {
  setTopic,
  nextLevel,
  useHint,
  completeLevel
} = gameSlice.actions;

export default gameSlice.reducer;