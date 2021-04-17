import ActionName from "../helper/ActionName";

const RobotActions = {
  addRobot: (pos_x, pos_y, rotation) => {
    return {
      type: ActionName.Robot.Add,
      robot: {
        position: {
          x: pos_x,
          y: pos_y,
          rotation: rotation
        }
      }
    }
  },
  turnRobot: (deg, ind) => {
    return {
      type: ActionName.Robot.Turn,
      index: ind,
      target: {
        rotation: deg
      }
    }
  },
  moveRobot: (pos_x, pos_y, ind) => {
    return {
      type: ActionName.Robot.SetTargetPosition,
      index: ind,
      target: {
        x: pos_x,
        y: pos_y
      }
    }
  },
  walkForward: (blocks, ind) => {
    return {
      type: ActionName.Robot.Walk,
      index: ind,
      blocks: blocks
    }
  },
  updateRobot: (new_x, new_y, new_rot, idx) => {
    return {
      type: ActionName.Robot.UpdatePosition,
      index: idx,
      position: {
        rotation: new_rot,
        x: new_x,
        y: new_y
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
