import { createSlice } from "@reduxjs/toolkit";
import { IRootState } from "@/store/rootState";

export interface IPurchaseState {
  hasPurchased: boolean;
  restored: boolean; // opcional: saber si vino de restore
}

const initialState: IPurchaseState = {
  hasPurchased: false,
  restored: false,
};

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {

    // ✅ cuando el usuario compra
    setPurchased(state) {
      state.hasPurchased = true;
      state.restored = false;
    },

    // 🔄 restaurar compra (simulado o desde store real)
    restorePurchase(state) {
      state.hasPurchased = true;
      state.restored = true;
    },

    // ❌ reset (solo debug o logout)
    resetPurchase(state) {
      state.hasPurchased = false;
      state.restored = false;
    }

  },
});

export const {
  setPurchased,
  restorePurchase,
  resetPurchase,
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
