import {RoboCupField} from "../robocup/field";
import BlocklyComponent, {Block, Field, Shadow, Value} from "../Blockly";
import React, {useEffect} from "react";
import {useBlockly} from "../helper/useBlockly";
import {useDispatch} from "react-redux";
import RobotActions from "../robocup/RobotActions";
import BallActions from "../robocup/BallActions";

/**
 * TASK
 * ====
 *
 * Initial: Robot positioned in front of the goal
 * Task: Shoot ball into goal
 * Required Actions: Shoot
 * Required Coding Concepts: --
 *
 * @returns {*}
 * @constructor
 */
const GoStraight = () => {

    const blockly = useBlockly();

    const dispatch = useDispatch();

    //Initialize the robot position on the field for the given task
    useEffect(() => {
        dispatch(RobotActions.reset())
        dispatch(RobotActions.addRobot(200,200))
        dispatch(BallActions.updateBall(0,0))
        dispatch(BallActions.moveBall(300,300))
    }, []);

    return(
        <div>
            <div>
                <RoboCupField
                    grid_properties={{
                        "title": "Initial",
                        "x": 10,
                        "y": 10,
                        "width": 600,
                        "height": 400,
                    }}
                />
            </div>
            <button onClick={blockly.generateCode}>Code Ausführen!</button>
            <BlocklyComponent ref={blockly.simpleWorkspace}
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
    )


};

export default GoStraight