import { ICurrentPage } from "./reducers/currentPageSlice";
import { IGameMode } from "./reducers/gameModeSlice";

export interface IRootState {
  currentPage: ICurrentPage;
  gameMode: IGameMode
}
