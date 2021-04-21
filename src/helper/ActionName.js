/**
 * Abstraction of all actions that can be performed in the different Reducers.
 */

const ActionName = {
  Application: {
    NextTask: 'NextTask',
    SetTask: 'SetTask'
  },
  Robot: {
    AddRobot: 'Robot.AddRobot',
    SetTargetPosition: 'Robot.SetTargetPosition',
    SetPosition: 'Robot.SetPosition',
    AddTargetRotation: 'Robot.AddTargetRotation',
    WalkForward: 'Robot.WalkForward',
    Reset: 'Robot.Reset'
  },
  Ball: {
    SetTargetPosition: 'Ball.SetTargetPosition',
    SetPosition: 'Ball.SetPosition',
    BallKick: 'Ball.BallKick',
    Reset: 'Ball.Reset'
  },
  Interface: {
    ToggleGoalAlert: 'Interface.ToggleGoalAlert',
    ToggleOwnGoalAlert: 'Interface.ToggleOwnGoalAlert',
    ToggleOutOfBoundsAlert: 'Interface.ToggleOutOfBoundsAlert',
  }
};

export default ActionName;
