import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMusicState {
  enabled: boolean;
}

const initialState: IMusicState = {
  enabled: true,
};

const MusicSlice = createSlice({
  name: "music",
  initialState,
  reducers: {
    toggleMusic: (state) => {
      state.enabled = !state.enabled;
    },

    setMusic: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
  },
});

export const { toggleMusic, setMusic } = MusicSlice.actions;
export default MusicSlice.reducer;