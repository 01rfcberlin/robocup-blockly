import ActionName from "../helper/ActionName";


const ApplicationActions = {
  nextTask: () => {
    return {
      type: ActionName.Application.NextTask,
    }
  },
  setTask: (taskNumber) => {
    return {
      type: ActionName.Application.SetTask,
      task: taskNumber
    }
  }
};

export default ApplicationActions;
