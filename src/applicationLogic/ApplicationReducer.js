import ActionName from "../helper/ActionName";


const initialState = {
  currentTask: 0
};

/**
 * This handles the overall state of the application. Currently only the current task, but should eventually contain
 * information like the overall time and time for the current task as well.
 *
 * @param state
 * @param action
 * @returns {{currentTask: *}|ApplicationReducer.props|{currentTask: number}|{currentTask: QueueChildMessage}}
 * @constructor
 */
function ApplicationReducer(state, action) {
  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    // TODO: This currently doesn't have a logic to handle that you should not
    // be able to go higher than the maximum available tasks.
    case ActionName.Application.NextTask:
      //Handles going to the next task
      return {
        ...state,
        currentTask: state.currentTask + 1
      };
    case ActionName.Application.SetTask:
      //Handles going to a specific Task
      return {
        ...state,
        currentTask: action.task
      };
    default:
      return state;
  }
}

export default ApplicationReducer;
