import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IVipState {
  isVip: boolean;
  startDate: number | null;
  endDate: number | null;
  lastChecked: number | null;
}

const initialState: IVipState = {
  isVip: false,
  startDate: null,
  endDate: null,
  lastChecked: null,
};

const vipSlice = createSlice({
  name: "vip",
  initialState,
  reducers: {
    setVipLocal: (
      state,
      action: PayloadAction<{ startDate: number; endDate: number }>
    ) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.isVip = Date.now() < action.payload.endDate;
      state.lastChecked = Date.now();
    },

    clearVip: (state) => {
      state.isVip = false;
      state.startDate = null;
      state.endDate = null;
      state.lastChecked = Date.now();
    },

    validateLocalVip: (state) => {
      if (!state.endDate) {
        state.isVip = false;
        return;
      }

      state.isVip = Date.now() < state.endDate;
    },
  },
});

export const { setVipLocal, clearVip, validateLocalVip } =
  vipSlice.actions;

export default vipSlice.reducer;