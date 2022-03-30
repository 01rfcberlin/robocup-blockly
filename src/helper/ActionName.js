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
    SetFixedMovement: 'Robot.SetFixedMovement',
    IncreaseFixedMovementIndex: 'IncreaseFixedMovementIndex',
    AddTargetRotation: 'Robot.AddTargetRotation',
    WalkForward: 'Robot.WalkForward',
    Reset: 'Robot.Reset'
  },
  Ball: {
    SetTargetPosition: 'Ball.SetTargetPosition',
    SetPosition: 'Ball.SetPosition',
    BallKick: 'Ball.BallKick',
    AddBall: 'Ball.AddBall',
    Reset: 'Ball.Reset',
  },
  Interface: {
    ToggleGoalAlert: 'Interface.ToggleGoalAlert',
    ToggleOwnGoalAlert: 'Interface.ToggleOwnGoalAlert',
    ToggleOutOfBoundsAlert: 'Interface.ToggleOutOfBoundsAlert',
    SetVisibility: "Interface.SetVisibility"
  }
};

export default ActionName;
