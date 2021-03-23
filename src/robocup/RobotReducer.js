import ActionName from "../helper/ActionName";

const initialState = {
  robotList: []
};

/**
 * This handles the overall state of the robots on the field within a given task.
 *
 * @param state
 * @param action
 * @returns {RobotReducer.props|{robotList: *[]}|{robotList: []}}
 * @constructor
 */
function RobotReducer(state, action) {
  console.log("RobotReducer", action.type);

  let current_robot = null;

  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    case ActionName.Robot.Add:
      //Handles adding a new robot to the field
      return {
        ...state,
        robotList: [...state.robotList, action.robot]
      };
    case ActionName.Robot.SetTargetPosition:
      //Handles setting a new target position for the robot on the field.
      current_robot = {...state.robotList[action.index]};
      console.log("Current robot: " + current_robot)
      const copy_robot_list = [...state.robotList];
      copy_robot_list.splice(action.index, 1);
      return {
        ...state,
        robotList: [
          ...copy_robot_list,
          {
            ...current_robot,
            target: {
              x: action.target.x,
              y: action.target.y
            }
          }
        ]
      };
    case ActionName.Robot.UpdatePosition:
      //Actually updates the position of a robot on the field
      current_robot = {...state.robotList[action.index]};
      const copy_robot_list2 = [...state.robotList]
      copy_robot_list2.splice(action.index, 1)
      return {
        ...state,
        robotList: [
          ...copy_robot_list2,
          {
            ...current_robot,
            position: {
              x: action.position.x,
              y: action.position.y
            }
          }
        ]
      };
    case ActionName.Robot.Reset:
      return initialState;
    default:
      return state;
  }
}

export default RobotReducer;
