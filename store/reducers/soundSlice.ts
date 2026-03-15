import { createSlice } from "@reduxjs/toolkit";

export interface ISoundState {
  enabled: boolean;
}

const initialState: ISoundState = {
  enabled: true,
};

const SoundSlice = createSlice({
  name: "sound",
  initialState,
  reducers: {
    toggleSound: (state) => {
      state.enabled = !state.enabled;
    },

    setSound: (state, action) => {
      state.enabled = action.payload;
    },
  },
});

export const { toggleSound, setSound } = SoundSlice.actions;
export default SoundSlice.reducer;