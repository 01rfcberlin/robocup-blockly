import { combineReducers } from "redux";
import GameStateReducer from "./robocup/GameStateReducer";
import ApplicationReducer from "./applicationLogic/ApplicationReducer";

/*
 * Combines all reducers and their state to be used when creating the store
 */
const combinedReducers = combineReducers({
  gameState: GameStateReducer,
  application: ApplicationReducer,
});

const rootReducer = (state, action) => {
  return combinedReducers(state, action);
};

export default rootReducer;
