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

import React from 'react';
import './App.css';

import './blocks/customblocks';
import './generator/generator';
import {useDispatch, useSelector} from "react-redux";
import ApplicationActions from "./applicationLogic/ApplicationActions";
import Walk from "./tasks/Walk";
import Kick from "./tasks/Kick";
import WalkAndTurn from "./tasks/WalkAndTurn";
import Task from "./tasks/task.json";
import WalkAndRepeat from "./tasks/WalkAndRepeat";
import WalkAndRepeatUntil from "./tasks/WalkAndRepeatUntil";
import WalkAndTurnAndRepeatUntil from "./tasks/WalkAndTurnAndRepeatUntil";

const App = () => {

    const dispatch = useDispatch();

    const { currentTask } = useSelector(state => {
        return state.application;
    });


    //Contains the individual tasks that the students can work through.
    const taskList = [
        <Kick task_properties={Task.tasks.task1}/>,
        <Walk task_properties={Task.tasks.task2}/>,
        <WalkAndTurn task_properties={Task.tasks.task3}/>,
        <Walk task_properties={Task.tasks.task4}/>,
        <WalkAndRepeat task_properties={Task.tasks.task5}/>,
        <WalkAndRepeat task_properties={Task.tasks.task6}/>,
        <WalkAndRepeatUntil task_properties={Task.tasks.task7}/>,
        <WalkAndTurnAndRepeatUntil task_properties={Task.tasks.task8}/>,
    ];

    return (
      <div className="App">
        <div className="tasks">
          <div className="task-text">Aufgabe:</div>
          {
            taskList.map((task, i) => {
              let className = "task";
              if (i==currentTask) {
                className += " current-task";
              }
              const key = "task-" + i;
              return (
                <div key={key} className={className} onClick={() => {dispatch(ApplicationActions.setTask(i))}}>
                  {i+1}
                </div>
              )
            })
          }
        </div>
        {taskList[currentTask]}
      </div>
    );
};

export default App;
