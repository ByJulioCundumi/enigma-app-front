import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ILanguageState {
  language: string;
}

const initialState: ILanguageState = {
  language: "es",
};

const LanguageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = LanguageSlice.actions;
export default LanguageSlice.reducer;