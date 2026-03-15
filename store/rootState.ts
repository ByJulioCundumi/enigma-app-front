import { ICurrentPage } from "./reducers/currentPageSlice";
import { IEnergyState } from "./reducers/energySlice";
import { IGameMode } from "./reducers/gameModeSlice";
import { ILanguageState } from "./reducers/languageSlice";
import { IMusicState } from "./reducers/musicSlice";
import { ISoundState } from "./reducers/soundSlice";
import { ITopicsState } from "./reducers/topicsSlice";
import { IVipState } from "./reducers/vipSlice";

export interface IRootState {
  currentPage: ICurrentPage;
  gameMode: IGameMode,
  energy: IEnergyState,
  language: ILanguageState,
  sound: ISoundState,
  music: IMusicState,
  vip: IVipState,
  topics: ITopicsState
}
