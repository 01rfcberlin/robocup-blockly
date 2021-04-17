import ActionName from "../helper/ActionName";
import * as constants from "../constants.js";
import RobotActions from "./RobotActions";

// map a position for the robot to the center of a grid
const closest_cell_center = (x, y) => {
  return {
    x: Math.floor(x / constants.cell_width)*constants.cell_width + constants.cell_width/2 - constants.robot_width,
    y: Math.floor(y / constants.cell_height)*constants.cell_height + constants.cell_height/2 - constants.robot_height,
  };
};

const initialState = {
  teamNameLeft: "01.RFC Berlin",
  teamNameRight: "Hamburg Bit-Bots",
  robotListLeft: [],
  robotListRight: [],
  // Don't already define position and target here because the code checks if
  // position and target are already defined or not and does different things
  // depending on this.
  ball: {},
  goalsLeft: 0,
  goalsRight: 0
};

const setRobotTarget = (state, index, x, y) => {
  //Handles setting a new target position for the robot on the field.
  let current_robot = {...state.robotListLeft[index]};
  //console.log("Robot.SetTargetPosition: Current robot: " + current_robot)
  const copy_robot_list = [...state.robotListLeft];
  copy_robot_list.splice(index, 1);
  return {
    ...state,
    robotListLeft: [
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
};

/**
 * This handles the overall state of the game, including the state of each robot and the ball.
 *
 * @param state
 * @param action
 * @returns {GameStateReducer.props|{robotList: *[]}|{robotList: []}}
 * @constructor
 */
function GameStateReducer(state, action) {
  // console.log("GameStateReducer", action.type);

  let current_robot = null;

  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    case ActionName.Robot.AddRobot:
      //Handles adding a new robot to the field
      const pos = closest_cell_center(action.robot.position.x, action.robot.position.y);
      action.robot.position.x = pos.x;
      action.robot.position.y = pos.y;
      action.robot.position.rotation = action.robot.position.rotation;
      action.robot.isActive = false;
      return {
        ...state,
        robotListLeft: [...state.robotListLeft, action.robot]
      };
    case ActionName.Robot.SetTargetPosition:
      return setRobotTarget(state, action.index, action.target.x, action.target.y);
    case ActionName.Robot.SetPosition:
      //Actually updates the position of a robot on the field
      current_robot = {...state.robotListLeft[action.index]};
      const copy_robot_list2 = [...state.robotListLeft];
      copy_robot_list2.splice(action.index, 1);
      const is_active = (current_robot.target.x && current_robot.target.x != action.position.x) ||
                        (current_robot.target.y && current_robot.target.y != action.position.y) ||
                        (current_robot.target.rotation &&current_robot.target.rotation != action.position.rotation);
      let new_rot = 0;
      if (action.position.rotation)
      {
        new_rot = action.position.rotation;
      }
      if (new_rot >= 360) {
        new_rot = new_rot - 360;
      } else if (new_rot <= -360) {
        new_rot = new_rot + 360;
      }
      return {
        ...state,
        robotListLeft: [
          ...copy_robot_list2,
          {
            ...current_robot,
            position: {
              rotation: new_rot,
              x: action.position.x,
              y: action.position.y
            },
            isActive: is_active
          }
        ]
      };
    case ActionName.Robot.AddTargetRotation:
      //Turn the robot on the field
      current_robot = {...state.robotListLeft[action.index]};
      const copy_robot_list3 = [...state.robotListLeft];
      copy_robot_list3.splice(action.index, 1);
      let new_rotation = current_robot.position.rotation + action.relativeTarget.rotation;
      if (new_rotation >= 360) {
        new_rotation = new_rotation - 360;
      } else if (new_rotation <= -360) {
        new_rotation = new_rotation + 360;
      }
      return {
        ...state,
        robotListLeft: [
          ...copy_robot_list3,
          {
            ...current_robot,
            target: {
              ...current_robot.target,
              rotation: new_rotation
            },
            is_active: true
          }
        ]
      };
    case ActionName.Robot.WalkForward:
      current_robot = {...state.robotListLeft[action.index]};
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
    case ActionName.Ball.SetTargetPosition:
      //Handles setting a new target position for the ball on the field.
      return {
        ...state,
        ball: {
          ...state.ball,
          target: {
            x: action.target.x,
            y: action.target.y
          }
        }
      };
    case ActionName.Ball.BallKick:
      //Handles setting a new target position for the ball on the field.
      current_robot = {...state.robotListLeft[action.robot.index]};

      const robotCellX = Math.floor(current_robot.position.x/constants.cell_width);
      const robotCellY = Math.floor(current_robot.position.y/constants.cell_height);
      const ballCellX = Math.floor(state.ball.position.x/constants.cell_width);
      const ballCellY = Math.floor(state.ball.position.y/constants.cell_height);


      let new_ball_x = state.ball.position.x;
      let new_ball_y = state.ball.position.y;
      if(ballCellX == robotCellX && ballCellY == robotCellY) {
        if(current_robot.position.rotation == 90) {
          new_ball_x = state.ball.position.x + (action.target.blocks * constants.cell_width);
        }
        else if(current_robot.position.rotation == 270) {
          new_ball_x = state.ball.position.x - (action.target.blocks * constants.cell_width);
        }
        else if(current_robot.position.rotation == 180) {
          new_ball_y = state.ball.position.y + (action.target.blocks * constants.cell_height);
        }
        else if(current_robot.position.rotation == 0) {
          new_ball_y = state.ball.position.y - (action.target.blocks * constants.cell_height);
        }
      }
      return {
        ...state,
        ball: {
          ...state.ball,
          target: {
            x: new_ball_x,
            y: new_ball_y
          }
        }
      };
    case ActionName.Ball.SetPosition:
      //Actually updates the position of the ball on the field
      return {
        ...state,
        ball:{
          ...state.ball,
          position: {
            x: action.position.x,
            y: action.position.y
          }
        }
      };
    case ActionName.Ball.Reset:
      return initialState;
    default:
      return state;
  }
}

export default GameStateReducer;
