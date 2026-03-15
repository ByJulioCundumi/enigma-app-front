import { topics } from "@/assets/data/topics/topics";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITopicProgress {
  currentLevel: number;
  completed: boolean;
}

export interface ITopicsState {
  selectedTopic: keyof typeof topics;
  progress: Record<string, ITopicProgress>;
}

const initialProgress: Record<string, ITopicProgress> = {};

Object.keys(topics).forEach((key) => {
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

    selectTopic: (state, action: PayloadAction<keyof typeof topics>) => {
      state.selectedTopic = action.payload;
    },

    resetSelectedTopic: (state) => {
      state.selectedTopic = "random";
    },

    nextLevel: (state) => {

      const topicId = state.selectedTopic;
      const topic = topics[topicId];

      if (!topic) return;

      const progress = state.progress[topicId];
      const totalLevels = topic.levels.length;

      if (progress.currentLevel + 1 >= totalLevels) {
        progress.completed = true;
      } else {
        progress.currentLevel += 1;
      }

    },

    setLevel: (
      state,
      action: PayloadAction<{
        topicId: keyof typeof topics;
        level: number;
      }>
    ) => {

      const { topicId, level } = action.payload;

      if (!state.progress[topicId]) return;

      state.progress[topicId].currentLevel = level;

    },

    resetTopic: (
      state,
      action: PayloadAction<keyof typeof topics>
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