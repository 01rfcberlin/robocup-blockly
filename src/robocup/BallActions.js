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
  ballKick: (blocks, ind, team) => {
    return {
      type: ActionName.Ball.BallKick,
      target: {
        blocks: blocks
      },
      robot: {
        index: ind
      },
      team: team
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
