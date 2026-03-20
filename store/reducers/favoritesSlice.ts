import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IFavoritesState {
  topics: Record<string, boolean>;
}

const initialState: IFavoritesState = {
  topics: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,

  reducers: {

    toggleFavoriteTopic: (state, action: PayloadAction<string>) => {

      const id = action.payload;

      state.topics[id] = !state.topics[id];

    },

    setFavoriteTopic: (
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) => {

      const { id, value } = action.payload;

      state.topics[id] = value;

    },

    clearFavorites: (state) => {
      state.topics = {};
    },

  },
});

export const {
  toggleFavoriteTopic,
  setFavoriteTopic,
  clearFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;