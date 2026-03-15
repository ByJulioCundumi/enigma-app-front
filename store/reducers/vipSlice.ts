import { createSlice } from "@reduxjs/toolkit";

const VIP_DURATION = 15 * 60 * 1000; // 15 minutos en ms

export interface IVipState {
  adsWatched: number;
  vipStartAt: number | null;
  vipExpireAt: number | null;
}

const initialState: IVipState = {
  adsWatched: 0,
  vipStartAt: null,
  vipExpireAt: null,
};

const vipSlice = createSlice({
  name: "vip",
  initialState,
  reducers: {

    incrementAd: (state) => {
      state.adsWatched += 1;
    },

    resetAds: (state) => {
      state.adsWatched = 0;
    },

    activateVip: (state) => {

      const now = Date.now();

      state.vipStartAt = now;
      state.vipExpireAt = now + VIP_DURATION;
      state.adsWatched = 0;

    },

    resetVip: (state) => {

      state.vipStartAt = null;
      state.vipExpireAt = null;

    },

    tickVip: (state) => {

      if (!state.vipStartAt || !state.vipExpireAt) return;

      const now = Date.now();

      const elapsed = now - state.vipStartAt;

      // detección si adelantan el reloj
      if (elapsed > VIP_DURATION) {

        state.vipStartAt = null;
        state.vipExpireAt = null;
        return;

      }

      // detección si atrasan el reloj
      if (now < state.vipStartAt) {

        state.vipStartAt = null;
        state.vipExpireAt = null;
        return;

      }

      // expiración normal
      if (now >= state.vipExpireAt) {

        state.vipStartAt = null;
        state.vipExpireAt = null;

      }

    },

  },
});

export const {
  incrementAd,
  resetAds,
  activateVip,
  tickVip,
  resetVip
} = vipSlice.actions;

export default vipSlice.reducer;