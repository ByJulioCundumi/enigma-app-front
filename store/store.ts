import { configureStore } from '@reduxjs/toolkit'
import currentPageSlice from "@/store/reducers/currentPageSlice"

export const store = configureStore({
  reducer: {
    currentPage: currentPageSlice
  },
})