import ActionName from "../helper/ActionName";

const RobotActions = {
  addRobot: (robotCellX, robotCellY, rotation, field_half) => {
    return {
      type: ActionName.Robot.AddRobot,
      robot: {
        position: {
          x: robotCellX,
          y: robotCellY,
          rotation: rotation,
        }
      },
      field_half: field_half
    }
  },
  addTargetRotation: (radians, ind) => {
    return {
      type: ActionName.Robot.AddTargetRotation,
      index: ind,
      relativeTarget: {
        rotation: radians,
      }
    }
  },
  setTargetPosition: (robotCellX, robotCellY, ind) => {
    return {
      type: ActionName.Robot.SetTargetPosition,
      index: ind,
      target: {
        x: robotCellX,
        y: robotCellY,
      }
    }
  },
  walkForward: (blocks, ind) => {
    return {
      type: ActionName.Robot.WalkForward,
      index: ind,
      blocks: blocks,
    }
  },
  setPosition: (robotPixelX, robotPixelY, new_rot, idx) => {
    return {
      type: ActionName.Robot.SetPosition,
      index: idx,
      position: {
        rotation: new_rot,
        x: robotPixelX,
        y: robotPixelY,
      }
    }
  },
  reset: () => {
    return {
      type: ActionName.Robot.Reset
    }
  },

};

export default RobotActions;
