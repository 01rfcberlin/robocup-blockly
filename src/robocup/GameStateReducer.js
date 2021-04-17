import ActionName from "../helper/ActionName";
import * as constants from "../constants.js";
import RobotActions from "./RobotActions";
import * as angles from "./angles";

// map a position for the robot to the center of a grid
const closest_cell_center = (x, y) => {
  return {
    x: Math.floor(x / constants.cell_width)*constants.cell_width + constants.cell_width/2 - constants.robot_width,
    y: Math.floor(y / constants.cell_height)*constants.cell_height + constants.cell_height/2 - constants.robot_height,
  };
};

const getGridCell = (x, y) => {
    return {
      x: Math.floor(x / constants.cell_width),
      y: Math.floor(y / constants.cell_height),
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
                        (current_robot.target.rotation && !angles.angle_almost_equals(current_robot.target.rotation, action.position.rotation));

      let new_rot = 0;
      if (action.position.rotation) {
        new_rot = angles.normalize_angle(action.position.rotation);
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

      const new_rotation = angles.normalize_angle(current_robot.position.rotation + action.relativeTarget.rotation);
      console.log("AddTargetRotation", new_rotation, current_robot.position.rotation, action.relativeTarget.rotation,
current_robot.position.rotation + action.relativeTarget.rotation);

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
      const gaze_direction = angles.classify_gaze_direction(current_robot.position.rotation);

      if (gaze_direction == angles.gaze_directions.right) {
        return setRobotTarget(state, action.index, current_robot.position.x + (action.blocks * constants.cell_width), current_robot.position.y);
      } else if (gaze_direction == angles.gaze_directions.left) {
        return setRobotTarget(state, action.index, current_robot.position.x - (action.blocks * constants.cell_width), current_robot.position.y);
      } else if (gaze_direction == angles.gaze_directions.bottom) {
        return setRobotTarget(state, action.index, current_robot.position.x, current_robot.position.y + (action.blocks * constants.cell_height));
      } else if (gaze_direction == angles.gaze_directions.top) {
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
    //   const goalCellsX = [1, 10];
      const goalCellsY = [3, 4, 5]


      let new_ball_x = state.ball.position.x;
      let new_ball_y = state.ball.position.y;
      if(ballCellX == robotCellX && ballCellY == robotCellY) {
        const gaze_direction = angles.classify_gaze_direction(current_robot.position.rotation);

        if (gaze_direction == angles.gaze_directions.left) {
          new_ball_x = state.ball.position.x - (action.target.blocks * constants.cell_width);
        } else if (gaze_direction == angles.gaze_directions.right) {
          new_ball_x = state.ball.position.x + (action.target.blocks * constants.cell_width);
        } else if (gaze_direction == angles.gaze_directions.bottom) {
          new_ball_y = state.ball.position.y + (action.target.blocks * constants.cell_height);
        } else if (gaze_direction == angles.gaze_directions.top) {
          new_ball_y = state.ball.position.y - (action.target.blocks * constants.cell_height);
        }
      }

      const ballPos = getGridCell(new_ball_x, new_ball_y);

      if(ballPos.x >= constants.num_x_cells-1 && goalCellsY.includes(ballPos.y)) {
        console.log("TOOR Home Team")
        // TODO: add goal for Hometeam or succes windows or whatever
      }

      if(ballPos.x <= 0 && goalCellsY.includes(ballPos.y)) {
        console.log("TOOR Away Team")
        // TODO: add goal for Hometeam or succes windows or whatever
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
