/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Main React component that includes the Blockly component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import React, {useEffect, useState} from 'react';
import './App.css';

import './blocks/customblocks';
import './generator/generator';
import {useDispatch, useSelector} from "react-redux";
import ApplicationActions from "./applicationLogic/ApplicationActions";
import TaskDetails from "./tasks/task.json";
import Alert from 'react-bootstrap/Alert'
import Task from "./tasks/Task";
import {Col, Container, Row} from "reactstrap";
import InterfaceActions from "./robocup/InterfaceActions";

const App = () => {

    const dispatch = useDispatch();

    const { currentTask } = useSelector(state => {
        return state.application;
    });

    const { goalsLeft, goalsRight, outOfBound } = useSelector(state => {
        return state.gameState;
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
    ];

    return (
      <Container style={{minWidth: "90vw", minHeight: "95vh"}} className="App">
        <Row className="tasks" style={{marginTop: "10px", marginBottom: "10px"}}>
            <Col xs={1}>
                <img width={"50px"} src={"/logo.png"}/>
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
                      <span>
                        <button style={{borderRadius: "50%"}} className={className} key={key} onClick={() => {
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
