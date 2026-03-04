import { configureStore } from '@reduxjs/toolkit'
import currentPageSlice from "@/store/reducers/currentPageSlice"
import gameModeSlice from "@/store/reducers/gameModeSlice"

export const store = configureStore({
  reducer: {
    currentPage: currentPageSlice,
    gameMode: gameModeSlice
  },
})