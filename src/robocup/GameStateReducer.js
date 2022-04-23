import ActionName from "../helper/ActionName";
import * as constants from "../constants.js";
import * as angles from "./angles";
import * as translations from "./translations.js";
import * as queries from "./queries.js";

const initialState = {
  teamNameLeft: "01.RFC Berlin",
  teamNameRight: "Hamburg Bit-Bots",
  // The robot position is the center of the robot.
  robotList: {
    "left": [],
    "right": []
  },
  // Don't already define position and target here because the code checks if
  // position and target are already defined or not and does different things
  // depending on this.
  ball: {},
  goalsLeft: 0,
  goalsRight: 0,
  outOfBound: false,
  toggleGoalAlert: false,
  toggleBallReachedAlert: false,
  toogleOwnGoalAlert: false,
  toggleOutOfBoundsAlert: false,
  visible: true,
  winToggled: false,
  aim: "",
  visionField: false,
};

const setRobotTarget = (state, index, team, robotCell) => {
  //Handles setting a new target position for the robot on the field.
  let current_robot = {...state.robotList[team][index]};
  const copy_robot_list = [...state.robotList[team]];
  copy_robot_list.splice(index, 1);

  // Check if robot will move to a cell out of the field
  let outofbounds = state.outOfBound;
  let toggleOut = state.toggleOutOfBoundsAlert;
  let goalt = state.toggleGoalAlert;
  let owngoalt = state.toggleOwnGoalAlert;
  let toggleBallReached = state.toggleBallReachedAlert;
  if (robotCell.x >= 10 || robotCell.x <= 0 || robotCell.y <= 0 || robotCell.y >= 8) {
    outofbounds = true;
    toggleOut = true;
    goalt = false;
    owngoalt = false;
  }
  if ((robotCell.x > 0 && robotCell.x < 10) && (robotCell.y > 0 && robotCell.y < 8)) {
    outofbounds = false;
    toggleOut = false;
    goalt = false;
    owngoalt = false;
  }

  if(state.aim === "ball" && state.winToggled) {
    toggleBallReached = false;
  }

  const robotPixel = translations.cellToPixelWithCenteredRobot(robotCell);

  return {
    ...state,
    robotList: {
      ...state.robotList,
      [team]: [
        ...copy_robot_list,
        {
          ...current_robot,
          target: {
            ...current_robot.position,
            ...robotPixel,
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
      ]

    },
    outOfBound: outofbounds,
    toggleOutOfBoundsAlert: toggleOut,
    toggleGoalAlert: goalt,
    toggleOwnGoalAlert: owngoalt,
    toggleBallReachedAlert: toggleBallReached,
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
  let current_robot = null;

  if (typeof state === "undefined") {
    return initialState;
  }

  switch (action.type) {
    case ActionName.Robot.AddRobot:
      const pos = translations.cellToPixelWithCenteredRobot(action.robot.position);
      action.robot.position.x = pos.x;
      action.robot.position.y = pos.y;
      action.robot.isActive = false;
      action.robot.isActiveDueToMoving = false;
      action.robot.isActiveDueToRotating = false;
      return {
        ...state,
        robotList: {
          ...state.robotList,
          [action.team]: [...state.robotList[action.team], action.robot]
        }
      };
    case ActionName.Robot.SetTargetPosition:
      return setRobotTarget(state, action.index, action.team, action.target);
    case ActionName.Robot.SetPosition:
      //Actually updates the position of a robot on the field
      current_robot = {...state.robotList[action.team][action.index]};
      const copy_robot_list2 = [...state.robotList[action.team]];
      copy_robot_list2.splice(action.index, 1);

      const isActiveDueToMoving =
          (current_robot.target && (typeof current_robot.target.x !== 'undefined') && current_robot.target.x !== action.position.x) ||
          (current_robot.target && (typeof current_robot.target.y !== 'undefined') && current_robot.target.y !== action.position.y);
      const isActiveDueToRotating = current_robot.target && (typeof current_robot.target.rotation !== 'undefined') && !angles.angle_almost_equals(current_robot.target.rotation, action.position.rotation);
      
      let new_rot = 0;
      if (action.position.rotation) {
        new_rot = angles.normalize_angle(action.position.rotation);
      }

      let toggleBallReached = state.toggleBallReachedAlert;
      let winning = state.winToggled;
      if (queries.ballKickable(state.ball.position, current_robot.position) && state.aim === "ball" && !state.winToggled) {
        toggleBallReached = true;
        winning = true;
      }


      return {
        ...state,
        robotList: {
          ...state.robotList,
          [action.team]: [
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
            }
          ]
        },
        toggleBallReachedAlert: toggleBallReached,
        winToggled: winning
      };
    case ActionName.Robot.AddTargetRotation:
      //Turn the robot on the field
      current_robot = {...state.robotList[action.team][action.index]};
      const copy_robot_list3 = [...state.robotList[action.team]];
      copy_robot_list3.splice(action.index, 1);

      const new_rotation = angles.normalize_angle(current_robot.position.rotation + action.relativeTarget.rotation);

      return {
        ...state,
        robotList: {
          ...state.robotList,
          [action.team]: [
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
        }
      };
    case ActionName.Robot.WalkForward:
      current_robot = {...state.robotList[action.team][action.index]};
      const gaze_direction = angles.classify_gaze_direction(current_robot.position.rotation);

      const robotCell = translations.pixelToCell(current_robot.position);

      if (gaze_direction === angles.gaze_directions.right) {
        return setRobotTarget(state, action.index, action.team,{x:robotCell.x + action.blocks, y:robotCell.y});
      } else if (gaze_direction === angles.gaze_directions.left) {
        return setRobotTarget(state, action.index, action.team,{x:robotCell.x - action.blocks, y:robotCell.y});
      } else if (gaze_direction === angles.gaze_directions.bottom) {
        return setRobotTarget(state, action.index, action.team,{x:robotCell.x, y:robotCell.y + action.blocks});
      } else if (gaze_direction === angles.gaze_directions.top) {
        return setRobotTarget(state, action.index, action.team,{x:robotCell.x, y:robotCell.y - action.blocks});
      } else {
        console.assert(false);
        return {};
      }
    case ActionName.Robot.SetFixedMovement:
      current_robot = {...state.robotList[action.team][action.index]};
      const copy_robot_list5 = [...state.robotList[action.team]];
      copy_robot_list5.splice(action.index, 1);
      return {
        ...state,
        robotList: {
          ...state.robotList,
          [action.team]: [
            ...copy_robot_list5,
            {
              ...current_robot,
              fixedMovement: {
                "actionList": action.movementList,
                "index": 0
              },
            }
          ]
        }
      }
    case ActionName.Robot.IncreaseFixedMovementIndex:
      current_robot = {...state.robotList[action.team][action.index]};
      const copy_robot_list6 = [...state.robotList[action.team]];
      copy_robot_list6.splice(action.index, 1);
      return {
        ...state,
        robotList: {
          ...state.robotList,
          [action.team]: [
            ...copy_robot_list6,
            {
              ...current_robot,
              fixedMovement: {
                ...current_robot.fixedMovement,
                "index": (current_robot.fixedMovement.index + 1)%current_robot.fixedMovement.actionList.length
              },
            }
          ]
        }
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
      current_robot = {...state.robotList[action.team][action.robot.index]};
      const copy_robot_list4 = [...state.robotList[action.team]];
      copy_robot_list4.splice(action.index, 1);

      const goalCellsY = [3, 4, 5]

      const ballCell = translations.pixelToCell(state.ball.position);
      let newBallCell = ballCell;

      const kickable = queries.ballKickable(state.ball.position, current_robot.position);
      if (kickable) {
        const gaze_direction = angles.classify_gaze_direction(current_robot.position.rotation);

        if (gaze_direction === angles.gaze_directions.left) {
          newBallCell.x -= action.target.blocks;
        } else if (gaze_direction === angles.gaze_directions.right) {
          newBallCell.x += action.target.blocks;
        } else if (gaze_direction === angles.gaze_directions.bottom) {
          newBallCell.y += action.target.blocks;
        } else if (gaze_direction === angles.gaze_directions.top) {
          newBallCell.y -= action.target.blocks;
        } else {
          console.assert(false);
          return {};
        }
      }

      let goalsL = state.goalsLeft;
      let goalsR = state.goalsRight;
      let toggleGoal = state.toggleGoalAlert;
      let toggleOwnGoal = state.toggleOwnGoalAlert;
      let toggleOut = state.toggleOutOfBoundsAlert;
      let winning2 = state.winToggled;

      if(newBallCell.x >= constants.num_x_cells-1 && goalCellsY.includes(newBallCell.y) && state.aim === "goal" && !state.winToggled) {
        goalsL += 1;
        toggleGoal = true;
        toggleOwnGoal = false;
        toggleOut = false;
        winning2 = true;
      }

      if(newBallCell.x <= 0 && goalCellsY.includes(newBallCell.y)) {
        goalsR += 1;
        toggleOwnGoal = true;
        toggleGoal = false;
        toggleOut = false;
      }

      let newBallPixel;
      // set target position once when it's not set yet
      if (kickable || state.ball.target === undefined) {
        newBallPixel = translations.cellToPixelWithEastBall(newBallCell);
      } else {
        // Do not reset target in case the ball is not kickable. This is relevant
        // when there is an opponent player that also moves.
        newBallPixel = state.ball.target;
      }

      return {
        ...state,
        ball: {
          ...state.ball,
          target: newBallPixel,
          isMoving: true
        },
        robotList: {
          ...state.robotList,
          [action.team]: [
          ...copy_robot_list4,
          {
            ...current_robot,
          }]
        },
        goalsLeft: goalsL,
        goalsRight: goalsR,
        toggleGoalAlert: toggleGoal,
        toggleOwnGoalAlert: toggleOwnGoal,
        toggleOutOfBoundsAlert: toggleOut,
        winToggled: winning2,
      };
    case ActionName.Ball.AddBall:
      const ballPixel = translations.cellToPixelWithEastBall(action.position);
      return {
        ...state,
        ball: {
          ...state.ball,
          position: ballPixel,
         }
       };
    case ActionName.Ball.SetPosition:
      //Actually updates the position of the ball on the field
      const isBallMoving =
          (state.ball.target && (typeof state.ball.target.x !== 'undefined') && state.ball.target.x !== action.position.x) ||
          (state.ball.target && (typeof state.ball.target.y !== 'undefined') && state.ball.target.y !== action.position.y)

      return {
        ...state,
        ball:{
          ...state.ball,
          position: {
            x: action.position.x,
            y: action.position.y
          },
          isMoving: isBallMoving
        }
      };
    case ActionName.Ball.Reset:
      return initialState;
    case ActionName.Interface.ToggleGoalAlert:
      return {
        ...state,
        toggleGoalAlert: action.showAlert
      };
    case ActionName.Interface.ToggleBallReachedAlert:
      return {
        ...state,
        toggleBallReachedAlert: action.showAlert
      };
    case ActionName.Interface.ToggleOwnGoalAlert:
      return {
        ...state,
        toggleOwnGoalAlert: action.showAlert
      };
    case ActionName.Interface.toggleOutOfBoundsAlert:
      return {
        ...state,
        toggleOutOfBoundsAlert: action.showAlert
      };
    case ActionName.Interface.SetVisibility:
      return {
        ...state,
        visible: action.visibility
      };
    case ActionName.Interface.SetAim:
      return {
        ...state,
        aim: action.aim
      };
    case ActionName.Interface.SetVisionField:
      return {
        ...state,
        visionField: action.visibility
      };
    default:
      return state;
  }
}

export default GameStateReducer;
