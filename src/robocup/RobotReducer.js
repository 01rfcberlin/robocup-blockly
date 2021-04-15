import ActionName from "../helper/ActionName";
import * as constants from "../constants.js";

// map a position for the robot to the center of a grid
function closest_cell_center(x, y) {
  return {
    x: Math.floor(x / constants.cell_width)*constants.cell_width + constants.cell_width/2 - constants.robot_width,
    y: Math.floor(y / constants.cell_height)*constants.cell_height + constants.cell_height/2 - constants.robot_height,
  };
}

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
  // console.log("RobotReducer", action.type);

  let current_robot = null;

  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    case ActionName.Robot.Add:
      //Handles adding a new robot to the field
      const pos = closest_cell_center(action.robot.position.x, action.robot.position.y);
      action.robot.position.x = pos.x;
      action.robot.position.y = pos.y;
      return {
        ...state,
        robotList: [...state.robotList, action.robot]
      };
    case ActionName.Robot.SetTargetPosition:
      //Handles setting a new target position for the robot on the field.
      current_robot = {...state.robotList[action.index]};
      //console.log("Robot.SetTargetPosition: Current robot: " + current_robot)
      const copy_robot_list = [...state.robotList];
      copy_robot_list.splice(action.index, 1);
      return {
        ...state,
        robotList: [
          ...copy_robot_list,
          {
            ...current_robot,
            target: {
              ...current_robot.position,
              x: action.target.x,
              y: action.target.y
            }
          }
        ]
      };
    case ActionName.Robot.UpdatePosition:
      //Actually updates the position of a robot on the field
      current_robot = {...state.robotList[action.index]};
      //console.log("Robot.UpdatePosition: Current robot: " + current_robot)
      const copy_robot_list2 = [...state.robotList]
      copy_robot_list2.splice(action.index, 1)
      return {
        ...state,
        robotList: [
          ...copy_robot_list2,
          {
            ...current_robot,
            position: {
              ...current_robot.position,
              x: action.position.x,
              y: action.position.y
            }
          }
        ]
      };
    case ActionName.Robot.Turn:
      //Turn the robot on the field
      current_robot = {...state.robotList[action.index]};
      const copy_robot_list3 = [...state.robotList]
      copy_robot_list3.splice(action.index, 1)
      return {
        ...state,
        robotList: [
          ...copy_robot_list3,
          {
            ...current_robot,
            position: {
              ...current_robot.position,
              rotation: action.position.rotation,
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
