import ActionName from "../helper/ActionName";

const BallActions = {
  moveBall: (pos_x, pos_y) => {
    return {
      type: ActionName.Ball.SetTargetPosition,
      target: {
        x: pos_x,
        y: pos_y
      }
    }
  },
  ballKick: (pos_x, pos_y) => {
    return {
      type: ActionName.Ball.BallKick,
      target: {
        x: pos_x,
        y: pos_y
      }
    }
  },
  updateBall: (new_x, new_y) => {
    return {
      type: ActionName.Ball.UpdatePosition,
      position: {
        x: new_x,
        y: new_y
      }
    }
  },
  reset: () => {
    return {
      type: ActionName.Ball.Reset
    }
  }
};

export default BallActions;
