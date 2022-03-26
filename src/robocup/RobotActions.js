import ActionName from "../helper/ActionName";

const RobotActions = {
  addRobot: (robotCellX, robotCellY, rotation, team) => {
    return {
      type: ActionName.Robot.AddRobot,
      robot: {
        position: {
          x: robotCellX,
          y: robotCellY,
          rotation: rotation,
        }
      },
      team: team
    }
  },
  addTargetRotation: (radians, ind, team) => {
    return {
      type: ActionName.Robot.AddTargetRotation,
      index: ind,
      relativeTarget: {
        rotation: radians,
      },
      team: team
    }
  },
  setTargetPosition: (robotCellX, robotCellY, ind, team) => {
    return {
      type: ActionName.Robot.SetTargetPosition,
      index: ind,
      target: {
        x: robotCellX,
        y: robotCellY,
      },
      team: team
    }
  },
  walkForward: (blocks, ind, team) => {
    return {
      type: ActionName.Robot.WalkForward,
      index: ind,
      blocks: blocks,
      team: team
    }
  },
  setPosition: (robotPixelX, robotPixelY, new_rot, idx, team) => {
    return {
      type: ActionName.Robot.SetPosition,
      index: idx,
      position: {
        rotation: new_rot,
        x: robotPixelX,
        y: robotPixelY,
      },
      team: team
    }
  },
  reset: () => {
    return {
      type: ActionName.Robot.Reset
    }
  },

};

export default RobotActions;
