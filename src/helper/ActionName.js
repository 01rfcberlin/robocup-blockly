/**
 * Abstraction of all actions that can be performed in the different Reducers.
 *
 * @type {{Application: {Status: string, NextTask: string, SetTask: string}, Robot: {Add: string, SetTargetPosition: string, UpdatePosition: string, Reset: string}}}
 */

const ActionName = {
  Application: {
    NextTask: 'NextTask',
    SetTask: 'SetTask'
  },
  Robot: {
    Add: 'AddRobot',
    SetTargetPosition: 'SetRobotTarget',
    UpdatePosition: 'UpdateRobotPosition',
    Turn: 'TurnRobot',
    Reset: 'Reset'
  },
  Ball: {
    SetTargetPosition: 'SetBallTarget',
    UpdatePosition: 'UpdateBallPosition',
    BallKick: 'BallKick',
    Reset: 'Reset'
  }
};

export default ActionName;
