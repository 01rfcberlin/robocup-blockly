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
import GoStraight from "./tasks/GoStraight";
import {useDispatch, useSelector} from "react-redux";
import ApplicationActions from "./applicationLogic/ApplicationActions";
import GoFurtherStraight from "./tasks/GoFurtherStraight";
import GoalKick from "./tasks/GoalKick";
import StraightAndTurn from "./tasks/StraightAndTurn";


const App = () => {

    const dispatch = useDispatch();

    const { currentTask } = useSelector(state => {
        return state.ApplicationReducer;
    });

    //Contains the individual tasks that the students can work through.
    const taskList = [
        <GoalKick/>,
        <GoFurtherStraight/>,
        <StraightAndTurn/>
    ];

    // TODO: This currently doesn't have a logic to handle that you should not be able to go lower than task 0 and higher
    //  than the maximum available tasks.
    return (
        <div className="App">
            <div>
                Current Task Number: {currentTask}
                <button onClick={() => {dispatch(ApplicationActions.nextTask())}}>Next Task</button>
            </div>
            {taskList[currentTask]}
        </div>
    );
};

export default App;
