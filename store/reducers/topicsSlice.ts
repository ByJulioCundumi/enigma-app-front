import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTopics } from "@/assets/data/topics/topics";

const initialTopics = getTopics("es"); // idioma inicial

export interface ITopicProgress {
  currentLevel: number;
  completed: boolean;
}

export interface ITopicsState {
  selectedTopic: keyof typeof initialTopics;
  progress: Record<string, ITopicProgress>;
}

const initialProgress: Record<string, ITopicProgress> = {};

Object.keys(initialTopics).forEach((key) => {
  initialProgress[key] = {
    currentLevel: 0,
    completed: false,
  };
});

const initialState: ITopicsState = {
  selectedTopic: "random",
  progress: initialProgress,
};

const topicsSlice = createSlice({
  name: "topics",
  initialState,

  reducers: {
    selectTopic: (
      state,
      action: PayloadAction<keyof typeof initialTopics>
    ) => {
      state.selectedTopic = action.payload;
    },

    resetSelectedTopic: (state) => {
      state.selectedTopic = "random";
    },

    nextLevel: (state) => {
      const topicId = state.selectedTopic;

      const progress = state.progress[topicId];

      if (!progress) return;

      // 🔥 OJO: ya no usamos topics aquí
      progress.currentLevel += 1;
    },

    setLevel: (
      state,
      action: PayloadAction<{
        topicId: keyof typeof initialTopics;
        level: number;
      }>
    ) => {
      const { topicId, level } = action.payload;

      if (!state.progress[topicId]) return;

      state.progress[topicId].currentLevel = level;
    },

    resetTopic: (
      state,
      action: PayloadAction<keyof typeof initialTopics>
    ) => {
      const topicId = action.payload;

      if (!state.progress[topicId]) return;

      state.progress[topicId] = {
        currentLevel: 0,
        completed: false,
      };
    },
  },
});

export const {
  selectTopic,
  resetSelectedTopic,
  nextLevel,
  setLevel,
  resetTopic,
} = topicsSlice.actions;

export default topicsSlice.reducer;