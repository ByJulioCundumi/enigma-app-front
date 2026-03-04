import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGameMode {
  gameMode: string;
}

const initialState: IGameMode = {
  gameMode: "normal",
};

const GameModeSlice = createSlice({
  name: "gameMode",
  initialState,
  reducers: {
    setGameMode: (state, action: PayloadAction<string>) => {
      state.gameMode = action.payload;
    },
  },
});

export const { setGameMode } = GameModeSlice.actions;
export default GameModeSlice.reducer;