import ActionName from "../helper/ActionName";

const BallActions = {
  setTargetPosition: (ballCellX, ballCellY) => {
    return {
      type: ActionName.Ball.SetTargetPosition,
      target: {
        x: ballCellX,
        y: ballCellY,
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
  setPosition: (ballPixelX, ballPixelY) => {
    return {
      type: ActionName.Ball.SetPosition,
      position: {
        x: ballPixelX,
        y: ballPixelY,
      }
    }
  },
  addBall: (ballCellX, ballCellY) => {
    return {
      type: ActionName.Ball.AddBall,
      position: {
        x: ballCellX,
        y: ballCellY,
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
