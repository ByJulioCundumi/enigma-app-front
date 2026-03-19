import { configureStore } from '@reduxjs/toolkit'
import currentPageSlice from "@/store/reducers/currentPageSlice"
import energySlice from "@/store/reducers/energySlice"
import languageSlice from "@/store/reducers/languageSlice"
import musicSlice from "@/store/reducers/musicSlice"
import vipSlice from "@/store/reducers/vipSlice"
import topicSlice from "@/store/reducers/topicsSlice"
import timerSlice from "@/store/reducers/timerSlice"

export const store = configureStore({
  reducer: {
    currentPage: currentPageSlice,
    energy: energySlice,
    language: languageSlice,
    music: musicSlice,
    vip: vipSlice,
    topics: topicSlice,
    timer: timerSlice,
  },
})