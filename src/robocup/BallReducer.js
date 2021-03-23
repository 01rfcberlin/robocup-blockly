import ActionName from "../helper/ActionName";

const initialState = {
  ball_position: { },
  ball_target: { }
};

/**
 * This handles the overall state of the ball on the field within a given task.
 *
 * @param state
 * @param action
 * @returns {RobotReducer.props|{robotList: *[]}|{robotList: []}}
 * @constructor
 */
function BallReducer(state, action) {
  console.log("BallReducer", action.type);

  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    case ActionName.Ball.SetTargetPosition:
      //Handles setting a new target position for the ball on the field.
      return {
        ...state,
        ball_target: {
          x: action.target.x,
          y: action.target.y
        }
      };
    case ActionName.Ball.UpdatePosition:
      //Actually updates the position of the ball on the field
      return {
        ...state,
        ball_position: {
          x: action.position.x,
          y: action.position.y
        }
      };
    case ActionName.Ball.Reset:
      return initialState;
    default:
      return state;
  }
}

export default BallReducer;
