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
  toggleOutOfBoundsAlert: (showAlert) => {
    return {
      type: ActionName.Interface.ToggleOutOfBoundsAlert,
      showAlert: showAlert
    }
  },

};

export default InterfaceActions;
