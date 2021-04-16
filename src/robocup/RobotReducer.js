import ActionName from "../helper/ActionName";
import * as constants from "../constants.js";
import RobotActions from "./RobotActions";

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

const setRobotTarget = (state, index, x, y) => {
  //Handles setting a new target position for the robot on the field.
  let current_robot = {...state.robotList[index]};
  //console.log("Robot.SetTargetPosition: Current robot: " + current_robot)
  const copy_robot_list = [...state.robotList];
  copy_robot_list.splice(index, 1);
  return {
    ...state,
    robotList: [
      ...copy_robot_list,
      {
        ...current_robot,
        target: {
          ...current_robot.position,
          x: x,
          y: y
        },
        isActive: true
      }
    ]
  };
}

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
      action.robot.position.rotation = action.robot.position.rotation;
      action.robot.isActive = false;
      return {
        ...state,
        robotList: [...state.robotList, action.robot]
      };
    case ActionName.Robot.SetTargetPosition:
      return setRobotTarget(state, action.index, action.target.x, action.target.y);
    case ActionName.Robot.UpdatePosition:
      //Actually updates the position of a robot on the field
      current_robot = {...state.robotList[action.index]};
      //console.log("Robot.UpdatePosition: Current robot: " + current_robot)
      const copy_robot_list2 = [...state.robotList];
      copy_robot_list2.splice(action.index, 1);
      const is_active = (current_robot.target.x && current_robot.target.x != action.position.x) ||
                        (current_robot.target.y && current_robot.target.y != action.position.y) ||
                        (current_robot.target.rotation &&current_robot.target.rotation != action.position.rotation);
      return {
        ...state,
        robotList: [
          ...copy_robot_list2,
          {
            ...current_robot,
            position: {
              rotation: action.position.rotation,
              x: action.position.x,
              y: action.position.y
            },
            isActive: is_active
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
            target: {
              ...current_robot.target,
              rotation: current_robot.position.rotation + action.target.rotation,
            },
            is_active: true
          }
        ]
      };
    case ActionName.Robot.Walk:
      current_robot = {...state.robotList[action.index]};
      if(current_robot.position.rotation == 90) {
        return setRobotTarget(state, action.index, current_robot.position.x + (action.blocks * constants.cell_width), current_robot.position.y);
      }
      else if(current_robot.position.rotation == 270) {
        return setRobotTarget(state, action.index, current_robot.position.x - (action.blocks * constants.cell_width), current_robot.position.y);
      }
      else if(current_robot.position.rotation == 180) {
        return setRobotTarget(state, action.index, current_robot.position.x, current_robot.position.y + (action.blocks * constants.cell_height));
      }
      else if(current_robot.position.rotation == 0) {
        return setRobotTarget(state, action.index, current_robot.position.x, current_robot.position.y - (action.blocks * constants.cell_height));
      }
    case ActionName.Robot.Reset:
      return initialState;
    default:
      return state;
  }
}

export default RobotReducer;
