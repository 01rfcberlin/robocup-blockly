import React from 'react';
import './App.css';

import './customblocks';
import './generator';
import {useDispatch, useSelector} from "react-redux";
import ApplicationActions from "./applicationLogic/ApplicationActions";
import TaskDetails from "./tasks/task.json";
import Task from "./tasks/Task";
import {Col, Container, Row} from "reactstrap";
import InterfaceActions from "./robocup/InterfaceActions";

const App = () => {

    const dispatch = useDispatch();

    const { currentTask } = useSelector(state => {
        return state.application;
    });

    //Contains the individual tasks that the students can work through.
    const taskList = [
        TaskDetails.tasks.task1,
        TaskDetails.tasks.task2,
        TaskDetails.tasks.task3,
        TaskDetails.tasks.task4,
        TaskDetails.tasks.task5,
        TaskDetails.tasks.task6,
        TaskDetails.tasks.task7,
        TaskDetails.tasks.task8,
        TaskDetails.tasks.task9,
        TaskDetails.tasks.task10,
        TaskDetails.tasks.task11,
    ];

    return (
      <Container style={{minWidth: "90vw", minHeight: "95vh"}} className="App">
        <Row className="tasks" style={{marginTop: "10px", marginBottom: "10px"}}>
            <Col xs={1}>
                <a href="https://01.rfc-berlin.de"><img alt="Logo of the RFC Berlin" width={"50px"} src={process.env.PUBLIC_URL + "/logo.png"}/></a>
            </Col>
            <Col className={"justify-content-md-center"} xs={11}>
            <h3 className="task-text" style={{marginRight: "10px"}}>Aufgabe:</h3>
              {
                taskList.map((task, i) => {
                  let className = "task";
                  let barName = "bar";
                  if (i<=currentTask) {
                    className += " current-task";
                  }
                  if (i<currentTask) {
                    barName += " current-task";
                  }
                  const key = "task-" + i;
                  return (
                      <span key={key}>
                        <button style={{borderRadius: "50%"}} className={className} onClick={() => {
                            dispatch(ApplicationActions.setTask(i));
                            dispatch(InterfaceActions.toggleOwnGoalAlert(false));
                            dispatch(InterfaceActions.toggleGoalAlert(false));
                            dispatch(InterfaceActions.toggleOutOfBoundsAlert(false));
                        }}>
                          {i+1}
                        </button>
                          { (i < taskList.length -1) && <span className={barName}></span> }
                      </span>
                  )
                })
              }
            </Col>
        </Row>
          <Task task_properties={taskList[currentTask]}/>
      </Container>
    );
};

export default App;
