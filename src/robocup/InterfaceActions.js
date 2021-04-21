import ActionName from "../helper/ActionName";

const InterfaceActions = {
  toggleGoalAlert: (showAlert) => {
    return {
      type: ActionName.Interface.ToggleGoalAlert,
      showAlert: showAlert
    }
  },
  toggleOwnGoalAlert: (showAlert) => {
    return {
      type: ActionName.Interface.ToggleOwnGoalAlert,
      showAlert: showAlert
    }
  },
  toggleOutOfBounds: (showAlert) => {
    return {
      type: ActionName.Interface.ToggleOutOfBounds,
      showAlert: showAlert
    }
  },

};

export default InterfaceActions;
