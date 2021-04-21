import ActionName from "../helper/ActionName";
import * as constants from "../constants.js";
import RobotActions from "./RobotActions";
import * as angles from "./angles";

function getGridCell(pos) {
  return {
    x: Math.floor(pos.x / constants.cell_width),
    y: Math.floor(pos.y / constants.cell_height),
  };
}

// map a position for the robot to the center of a grid
function getGridCellRobotCenter(pos) {
  const cell = getGridCell(pos);
  return {
    x: cell.x*constants.cell_width + constants.cell_width/2 - constants.robot_width,
    y: cell.y*constants.cell_height + constants.cell_height/2 - constants.robot_height,
  };
}

// A ball is only "kickable" if the robot is not moving, i.e. if the ball and
// the robot are on the same cell. this is different from "nextToBall" where
// the robot is allowed to be in motion and the robot and ball are allowed to
// be on different cells.
function ballKickable(ballPos, robotPos) {
  const robotCell = getGridCell(robotPos);
  const ballCell = getGridCell(ballPos);
  console.log("I'm ballKickable:", robotCell, ballCell);
  return ballCell.x == robotCell.x && ballCell.y == robotCell.y;
}

// TODO: the whole "nextToBall" state should be removed again in favor of "ballKickable"
function nextToBall(ballPos, robotPos) {
  return Math.abs(ballPos.x - robotPos.x) < constants.cell_width && Math.abs(ballPos.y - robotPos.y) < constants.cell_height;
}

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
  goalsRight: 0,
  outOfBound: false,
  toggleGoalAlert: false,
  toogleOwnGoalAlert: false,
  toggleOutOfBoundsAlert: false,
};

const setRobotTarget = (state, index, x, y) => {
  //Handles setting a new target position for the robot on the field.
  let current_robot = {...state.robotListLeft[index]};
  //console.log("Robot.SetTargetPosition: Current robot: " + current_robot)
  const copy_robot_list = [...state.robotListLeft];
  copy_robot_list.splice(index, 1);

  // Check if robot moves to a cell out of the field
  let outofbounds = state.outOfBound;
  let toggleOut = state.toggleOutOfBounds;
  if(
      getGridCell({x, y}).x >= 10 ||
      getGridCell({x, y}).x <= 0 ||
      getGridCell({x, y}).y <= 0 ||
      getGridCell({x, y}).y >= 8
  ) {
    outofbounds = true;
    toggleOut = true;
  }

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
        // "is active" means if the robot is moving (either rotating or
        // changing its position). Originally isActive was called
        // reachedTargetPosition and reachedTargetRotation which (but only
        // negated) which emphasizes that "is active" is only about whether the
        // robot reached its target position or not.
        isActive: true,
        isActiveDueToMoving: true,
        // don't overwrite isActiveDueToRotating here. keep the current value
      }
    ],
    outOfBound: outofbounds,
    toggleOutOfBounds: toggleOut
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

  //console.log("GameStateReducer:", action.type);
//  if (state.robotListLeft && state.robotListLeft.length > 0) {
//    console.log("redux", state.robotListLeft[0].isBallKickable);
//  }

  switch (action.type) {
    case ActionName.Robot.AddRobot:
      //Handles adding a new robot to the field
      const pos = getGridCellRobotCenter(action.robot.position);
      console.log(action.type, "isNextToBall := isBallKickable :=", false);
      action.robot.position.x = pos.x;
      action.robot.position.y = pos.y;
      action.robot.position.rotation = action.robot.position.rotation;
      action.robot.isActive = false;
      action.robot.isActiveDueToMoving = false;
      action.robot.isActiveDueToRotating = false;
      action.robot.isBallKickable = false;
      action.robot.isNextToBall = false;
      if (action.field_half == "left") {
        return {
          ...state,
          robotListLeft: [...state.robotListLeft, action.robot]
        };
      }
      else {
        return {
          ...state,
          robotListRight: [...state.robotListRight, action.robot]
        };
      }
    case ActionName.Robot.SetTargetPosition:
      return setRobotTarget(state, action.index, action.target.x, action.target.y);
    case ActionName.Robot.SetPosition:
      //Actually updates the position of a robot on the field
      current_robot = {...state.robotListLeft[action.index]};
      const copy_robot_list2 = [...state.robotListLeft];
      copy_robot_list2.splice(action.index, 1);

      const isActiveDueToMoving =
          (current_robot.target && current_robot.target.x && current_robot.target.x != action.position.x) ||
          (current_robot.target && current_robot.target.y && current_robot.target.y != action.position.y);
      const isActiveDueToRotating = current_robot.target && current_robot.target.rotation && !angles.angle_almost_equals(current_robot.target.rotation, action.position.rotation);

      let new_rot = 0;
      if (action.position.rotation) {
        new_rot = angles.normalize_angle(action.position.rotation);
      }

      const isBallKickable = ballKickable(state.ball.position, current_robot.position);
      const isNextToBall = nextToBall(state.ball.position, current_robot.position);
      console.log(action.type, "isNextToBall :=", isNextToBall, "isBallKickable :=", isBallKickable);

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
            isActive: isActiveDueToMoving || isActiveDueToRotating,
            isActiveDueToMoving,
            isActiveDueToRotating,
            isBallKickable,
            isNextToBall,
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
            isActive: true,
            isActiveDueToRotating: true,
            // don't overwrite isActiveDueToMoving here. keep the current value
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
      };

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

    // In the event ActionName.Robot.SetPosition: wasn't called (eg task 1),
    // we can't rely on the redux state
      current_robot.isBallKickable = ballKickable(state.ball.position, current_robot.position);
      current_robot.isNextToBall = nextToBall(state.ball.position, current_robot.position);
      console.log(action.type, "isNextToBall :=", current_robot.isNextToBall, "isBallKickable :=", current_robot.isBallKickable );

    //   const goalCellsX = [1, 10];
      const goalCellsY = [3, 4, 5]

      let new_ball_x = state.ball.position.x;
      let new_ball_y = state.ball.position.y;



      if (current_robot.isBallKickable) {
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

      const ballPos = getGridCell({x: new_ball_x, y: new_ball_y});

      let goalsL = state.goalsLeft;
      let goalsR = state.goalsRight;
      let toggleGoal = state.toggleGoalAlert;
      let toggleOwnGoal = state.toggleOwnGoalAlert;

      if(ballPos.x >= constants.num_x_cells-1 && goalCellsY.includes(ballPos.y)) {
        // console.log("TOOR Home Team")
        goalsL += 1;
        toggleGoal = true;
      }

      if(ballPos.x <= 0 && goalCellsY.includes(ballPos.y)) {
        // console.log("TOOR Away Team")
        goalsR += 1;
        toggleOwnGoal = true;
      }

      return {
        ...state,
        ball: {
          ...state.ball,
          target: {
            x: new_ball_x,
            y: new_ball_y
          }
        },
        goalsLeft: goalsL,
        goalsRight: goalsR,
        toggleGoalAlert: toggleGoal,
        toggleOwnGoalAlert: toggleOwnGoal,
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
    case ActionName.Interface.ToggleGoalAlert:
      return {
        ...state,
        toggleGoalAlert: action.showAlert
      };
    case ActionName.Interface.ToggleOwnGoalAlert:
      return {
        ...state,
        toggleOwnGoalAlert: action.showAlert
      };
    case ActionName.Interface.ToggleOutOfBounds:
      return {
        ...state,
        toggleOutOfBoundsAlert: action.showAlert
      };
    default:
      return state;
  }
}

export default GameStateReducer;
