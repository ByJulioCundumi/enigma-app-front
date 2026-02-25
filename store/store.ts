import { configureStore } from '@reduxjs/toolkit'
import navbarSlice from "@/store/reducers/navbarSlice"

export const store = configureStore({
  reducer: {
    navbar: navbarSlice
  },
})