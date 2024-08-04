import { produce } from "immer";
import { Action } from "../actions";
import { ActionType } from "../action-types";

export interface AppState {
  isSearching: boolean;
  previousSession: string;
  currentSession: string;
}

const initState: AppState = {
  isSearching: false,
  previousSession: "init",
  currentSession: "init",
};

const appReducer = produce(
  (state: AppState = initState, action: Action): AppState => {
    switch (action.type) {
      case ActionType.SET_SEARCHING:
        state.isSearching = action.payload.isSearching;
        return state;
      case ActionType.SET_SESSION:
        state.previousSession = state.currentSession;
        state.currentSession = action.payload.session_id;
        return state;
      default:
        return state;
    }
  }
);

export default appReducer;
