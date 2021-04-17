import ActionName from "../helper/ActionName";

const RobotActions = {
  addRobot: (pos_x, pos_y, rotation) => {
    return {
      type: ActionName.Robot.AddRobot,
      robot: {
        position: {
          x: pos_x,
          y: pos_y,
          rotation: rotation
        }
      }
    }
  },
  addTargetRotation: (degree, ind) => {
    return {
      type: ActionName.Robot.AddTargetRotation,
      index: ind,
      relativeTarget: {
        rotation: degree
      }
    }
  },
  setTargetPosition: (pos_x, pos_y, ind) => {
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
      type: ActionName.Robot.WalkForward,
      index: ind,
      blocks: blocks
    }
  },
  setPosition: (new_x, new_y, new_rot, idx) => {
    return {
      type: ActionName.Robot.SetPosition,
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
