import { ICurrentPage } from "./reducers/currentPageSlice";
import { IEnergyState } from "./reducers/energySlice";
import { IFavoritesState } from "./reducers/favoritesSlice";
import { IGameMode } from "./reducers/gameModeSlice";
import { ILanguageState } from "./reducers/languageSlice";
import { IMusicState } from "./reducers/musicSlice";
import { ITimerState } from "./reducers/timerSlice";
import { ITopicsState } from "./reducers/topicsSlice";
import { IVipState } from "./reducers/vipSlice";

export interface IRootState {
  currentPage: ICurrentPage;
  gameMode: IGameMode,
  energy: IEnergyState,
  language: ILanguageState,
  music: IMusicState,
  vip: IVipState,
  topics: ITopicsState,
  timer: ITimerState,
  favorites: IFavoritesState
}
