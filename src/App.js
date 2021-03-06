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

import React, {useReducer, useState} from 'react';
import './App.css';

import BlocklyComponent, {Block, Value, Field, Shadow} from './Blockly';

import BlocklyJS from 'blockly/javascript';

import './blocks/customblocks';
import './generator/generator';
import {RoboCupField} from "./robocup/field";

const App = () => {

    const initialGameState = {
        robotList: []
    };

    const simpleWorkspace = React.createRef();

    /**
     * This holds the current game state and handles updates to the game state.
     * Game state is currently holding only the robots on the field, but is supposed to hold other information
     * like ball position as well.
     */
    const [gameState, dispatch] = useReducer((state, action) => {
        let current_robot = null;
        switch (action.type) {
            case "addRobot":
                //Handles adding a new robot to the field
                return {
                    ...state,
                    robotList: [...state.robotList, action.robot]
                };
            case "setRobotTarget":
                //Handles setting a new target position for the robot on the field.
                current_robot = {...state.robotList[action.index]};
                const copy_robot_list = [...state.robotList]
                copy_robot_list.splice(action.index, 1)
                return {
                    ...state,
                    robotList: [
                        ...copy_robot_list,
                        {
                            ...current_robot,
                            tx: action.target.x,
                            ty: action.target.y
                        }
                    ]
                };
            case "updateRobotPosition":
                //Actually updates the position of a robot on the field
                current_robot = {...state.robotList[action.index]};
                const copy_robot_list2 = [...state.robotList]
                copy_robot_list2.splice(action.index, 1)
                return {
                    ...state,
                    robotList: [
                        ...copy_robot_list2,
                        {
                            ...current_robot,
                            x: action.position.x,
                            y: action.position.y
                        }
                    ]
                };
            default:
                return state;
        }
    }, initialGameState);

    /**
     * Blockly-method to generate the code from the current workspace, print it to console (just for debugging)
     * and then executing the code.
     */
    const generateCode = () => {
        var code = BlocklyJS.workspaceToCode(
            simpleWorkspace.current.workspace
        );
        console.log(code);
        try {
            eval(code);
        } catch (e) {
            alert(e);
        }
    };

    /**
     * Handles adding a robot to a given position on the field.
     * @param pos_x
     * @param pos_y
     */
    const addRobot = (pos_x, pos_y) => {
        dispatch({type: "addRobot", robot: {x: pos_x, y: pos_y, rotation: 0}})
    };

    /**
     * Handles setting a target position for a robot on the field.
     * TODO: This currently only works for the first robot that was added to the field, this needs to be handles with a parameter
     * @param pos_x
     * @param pos_y
     */
    const moveRobot = (pos_x, pos_y) => {
        dispatch({type: "setRobotTarget", index: 0, target: {x: pos_x, y: pos_y}})
    };

    return (
        <div className="App">
            <div>
                <RoboCupField
                    grid_properties={{
                        "title": "Initial",
                        "x": 10,
                        "y": 10,
                        "width": 600,
                        "height": 400,
                    }}
                    gameState={gameState}
                    dispatch={dispatch}
                />
            </div>
            <button onClick={generateCode}>Code Ausführen!</button>
            <BlocklyComponent ref={simpleWorkspace}
                              readOnly={false} trashcan={true}
                              move={{
                                  scrollbars: true,
                                  drag: true,
                                  wheel: true
                              }}>
                <Block type="robot_add"/>
                <Block type="robot_move"/>
                <Block type="controls_ifelse"/>
                <Block type="logic_compare"/>
                <Block type="logic_operation"/>
                <Block type="controls_repeat_ext">
                    <Value name="TIMES">
                        <Shadow type="math_number">
                            <Field name="NUM">10</Field>
                        </Shadow>
                    </Value>
                </Block>
                <Block type="logic_operation"/>
                <Block type="logic_negate"/>
                <Block type="logic_boolean"/>
                <Block type="math_number"/>
            </BlocklyComponent>
        </div>
    );
}

export default App;
