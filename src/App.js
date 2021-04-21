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

const App = () => {

    const dispatch = useDispatch();

    const { currentTask } = useSelector(state => {
        return state.application;
    });

    const { goalsLeft, goalsRight, outOfBound } = useSelector(state => {
        return state.gameState;
    });

    const [showGoalAlert, setShowGoalAlert] = useState(false);
    const [showOwnGoalAlert, setShowOwnGoalAlert] = useState(false);
    const [showOutofBoundAlert, setShowOutofBoundAlert] = useState(false);


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

    useEffect(() => {
        if(!showGoalAlert && goalsLeft > 0) {
            setShowGoalAlert(true);
        }
    },[goalsLeft]);

    useEffect(() => {
        if(!showOwnGoalAlert && goalsRight > 0) {
            setShowOwnGoalAlert(true);
        }
    },[goalsRight]);

    useEffect(() => {
        if(!showOutofBoundAlert && outOfBound == true) {
            setShowOutofBoundAlert(true);
        }
    },[outOfBound]);

    return (
      <div className="App">
          {showGoalAlert &&
              <Alert variant={'success'} onClose={() => setShowGoalAlert(false)} dismissible>
                  <Alert.Heading>Toooooor!</Alert.Heading>
                  <p>Sehr gut, du hast die Aufgabe gelöst. Jetzt kannst du weiter mit der nächsten Aufgabe machen.</p>
              </Alert>
          }
          {showOwnGoalAlert &&
          <Alert variant={'warning'} onClose={() => setShowGoalAlert(false)} dismissible>
              <Alert.Heading>Eigentor!</Alert.Heading>
              <p>Um das Spiel zu gewinnen, solltest du lieber auf das andere Tor schießen :D</p>
          </Alert>
          }
          {showOutofBoundAlert &&
          <Alert variant={'warning'} onClose={() => setShowOutofBoundAlert(false)} dismissible>
              <Alert.Heading>Roboter hat das Spielfeld verlassen!</Alert.Heading>
              <p>Du soltest lieber mit deinem Roboter im Spielfeld bleiben :D</p>
          </Alert>
          }
        <div className="tasks" style={{marginBottom: "20px"}}>
          <h4 className="task-text">Aufgabe:</h4>
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
                        setShowGoalAlert(false);
                        setShowOutofBoundAlert(false);
                    }}>
                      {i+1}
                    </button>
                      { (i < taskList.length -1) && <span className={barName}></span> }
                  </span>
              )
            })
          }
        </div>
          <Task task_properties={taskList[currentTask]}/>
      </div>
    );
};

export default App;
