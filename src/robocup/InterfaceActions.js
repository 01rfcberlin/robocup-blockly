import ActionName from "../helper/ActionName";

const InterfaceActions = {
  toggleGoalAlert: (showAlert) => {
    return {
      type: ActionName.Interface.ToggleGoalAlert,
      showAlert: showAlert
    }
  },
  toggleBallReachedAlert: (showAlert) => {
    return {
      type: ActionName.Interface.ToggleBallReachedAlert,
      showAlert: showAlert
    }
  },
  toggleOwnGoalAlert: (showAlert) => {
    return {
      type: ActionName.Interface.ToggleOwnGoalAlert,
      showAlert: showAlert
    }
  },
  toggleOutOfBoundsAlert: (showAlert) => {
    return {
      type: ActionName.Interface.ToggleOutOfBoundsAlert,
      showAlert: showAlert
    }
  },
  setVisibility: (visibility) => {
    return {
      type: ActionName.Interface.SetVisibility,
      visibility: visibility
    }
  },
  setAim: (aim) => {
  return {
    type: ActionName.Interface.SetAim,
    aim: aim
  }
},
  setVisionField: (visibility) => {
    return {
      type: ActionName.Interface.SetVisionField,
      visibility: visibility
    }
  },
};

export default InterfaceActions;
