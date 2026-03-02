import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ICurrentPage {
  currentPage: string;
}

const initialState: ICurrentPage = {
  currentPage: "index",
};

const CurrentPageSlice = createSlice({
  name: "currentPage",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = CurrentPageSlice.actions;
export default CurrentPageSlice.reducer;