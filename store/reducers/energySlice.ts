import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IEnergyState {
  energy: number;
}

const initialState: IEnergyState = {
  energy: 10,
};

const EnergySlice = createSlice({
  name: "energy",
  initialState,
  reducers: {
    setEnergy: (state, action: PayloadAction<number>) => {
      state.energy = action.payload;
    },

    addEnergy: (state, action: PayloadAction<number>) => {
      state.energy += action.payload;
    },

    consumeEnergy: (state, action: PayloadAction<number>) => {
      state.energy = Math.max(0, state.energy - action.payload);
    },
  },
});

export const { setEnergy, addEnergy, consumeEnergy } = EnergySlice.actions;
export default EnergySlice.reducer;