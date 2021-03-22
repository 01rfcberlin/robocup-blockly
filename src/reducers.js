import { combineReducers } from "redux";
import RobotReducer from "./robocup/RobotReducer";
import ApplicationReducer from "./applicationLogic/ApplicationReducer";

/*
 * Combines all reducers and their state to be used when creating the store
 */
const combinedReducers = combineReducers({
  RobotReducer,
  ApplicationReducer
});

const rootReducer = (state, action) => {
  return combinedReducers(state, action);
};

export default rootReducer;
