import { configureStore } from '@reduxjs/toolkit'
import currentPageSlice from "@/store/reducers/currentPageSlice"
import gameModeSlice from "@/store/reducers/gameModeSlice"
import energySlice from "@/store/reducers/energySlice"
import languageSlice from "@/store/reducers/languageSlice"
import soundSlice from "@/store/reducers/soundSlice"
import musicSlice from "@/store/reducers/musicSlice"
import vipSlice from "@/store/reducers/vipSlice"
import topicSlice from "@/store/reducers/topicsSlice"
import timerSlice from "@/store/reducers/timerSlice"
import favoritesSlice from "@/store/reducers/favoritesSlice"

export const store = configureStore({
  reducer: {
    currentPage: currentPageSlice,
    gameMode: gameModeSlice,
    energy: energySlice,
    language: languageSlice,
    sound: soundSlice,
    music: musicSlice,
    vip: vipSlice,
    topics: topicSlice,
    timer: timerSlice,
    favorites: favoritesSlice
  },
})