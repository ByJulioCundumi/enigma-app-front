import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ITimerState {
  startTimestamp: number | null;
  endTimestamp: number | null;
  extraTimeUsed: number;
}

export const initialState: ITimerState = {
  startTimestamp: null,
  endTimestamp: null,
  extraTimeUsed: 0,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {

    startLevelTimer(state, action: PayloadAction<number>) {
      const duration = action.payload;

      const now = Date.now();

      state.startTimestamp = now;
      state.endTimestamp = now + duration * 1000;
      state.extraTimeUsed = 0;
    },

    addExtraTimeToTimer(state, action: PayloadAction<number>) {
      if (!state.endTimestamp) return;

      state.endTimestamp += action.payload * 1000;
      state.extraTimeUsed += 1;
    },

    resetTimer(state) {
      state.startTimestamp = null;
      state.endTimestamp = null;
      state.extraTimeUsed = 0;
    },

  },
});

export const {
  startLevelTimer,
  addExtraTimeToTimer,
  resetTimer
} = timerSlice.actions;

export default timerSlice.reducer;