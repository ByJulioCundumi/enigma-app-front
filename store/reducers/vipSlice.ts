import { createSlice } from "@reduxjs/toolkit";

export interface IVipState {
  isVip: boolean;              // 🔥 usuario compró
  isVipModalOpen: boolean;     // modal abierto/cerrado
  vipPopupCounter: number;     // opcional (para lógica futura)
  restored: boolean;           // saber si fue restaurado
}

const initialState: IVipState = {
  isVip: false,
  isVipModalOpen: false,
  vipPopupCounter: 0,
  restored: false,
};

const vipSlice = createSlice({
  name: "vip",
  initialState,
  reducers: {

    // ✅ COMPRA
    setVip(state) {
      state.isVip = true;
      state.restored = false;
    },

    // 🔄 RESTORE
    restoreVip(state) {
      state.isVip = true;
      state.restored = true;
    },

    // ❌ RESET (debug/logout)
    resetVip(state) {
      state.isVip = false;
      state.restored = false;
    },

    // 📦 MODAL
    openVipModal(state) {
      state.isVipModalOpen = true;
    },

    closeVipModal(state) {
      state.isVipModalOpen = false;
    },

    // 🔁 (opcional UX)
    incrementVipPopupCounter(state) {
      state.vipPopupCounter += 1;
    },

    resetVipPopupCounter(state) {
      state.vipPopupCounter = 0;
    },
  },
});

export const {
  setVip,
  restoreVip,
  resetVip,
  openVipModal,
  closeVipModal,
  incrementVipPopupCounter,
  resetVipPopupCounter,
} = vipSlice.actions;

export default vipSlice.reducer;