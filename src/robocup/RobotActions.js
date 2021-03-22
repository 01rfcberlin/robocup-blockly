import ActionName from "../helper/ActionName";

const RobotActions = {
  addRobot: (pos_x, pos_y) => {
    return {
      type: ActionName.Robot.Add,
      robot: {
        x: pos_x,
        y: pos_y,
        rotation: 0
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
  updateRobot: (new_x, new_y, idx) => {
    return {
      type: ActionName.Robot.UpdatePosition,
      index: idx,
      position: {
        x: new_x,
        y: new_y
      }
    }
  },
  reset: () => {
    return {
      type: ActionName.Robot.Reset
    }
  }
};

export default RobotActions;
