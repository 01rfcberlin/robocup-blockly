import ActionName from "../helper/ActionName";

const BallActions = {
  setTargetPosition: (pos_x, pos_y) => {
    return {
      type: ActionName.Ball.SetTargetPosition,
      target: {
        x: pos_x,
        y: pos_y
      }
    }
  },
  ballKick: (blocks, ind) => {
    return {
      type: ActionName.Ball.BallKick,
      target: {
        blocks: blocks
      },
      robot: {
        index: ind
      }
    }
  },
  setPosition: (new_x, new_y) => {
    return {
      type: ActionName.Ball.SetPosition,
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
