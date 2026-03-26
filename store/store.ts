import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistStore,
  persistReducer,
} from "redux-persist";

// 👇 tus slices
import currentPageSlice from "@/store/reducers/currentPageSlice";
import energySlice from "@/store/reducers/energySlice";
import languageSlice from "@/store/reducers/languageSlice";
import musicSlice from "@/store/reducers/musicSlice";
import vipSlice from "@/store/reducers/vipSlice";
import topicSlice from "@/store/reducers/topicsSlice";
import timerSlice from "@/store/reducers/timerSlice";
import favoritesSlice from "@/store/reducers/favoritesSlice";

// 🔥 combinas reducers
const rootReducer = combineReducers({
  currentPage: currentPageSlice,
  energy: energySlice,
  language: languageSlice,
  music: musicSlice,
  vip: vipSlice,
  topics: topicSlice,
  timer: timerSlice,
  favorites: favoritesSlice,
});

// 🔥 config de persistencia
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  // opcional: excluir cosas
  // blacklist: ["timer"]
};

// 🔥 reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🔥 store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // necesario para evitar warnings
    }),
});

// 🔥 persistor
export const persistor = persistStore(store);