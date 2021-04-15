import {RoboCupField} from "../robocup/field";
import BlocklyComponent, {Block, Field, Shadow, Value} from "../Blockly";
import React, {useEffect} from "react";
import {useBlockly} from "../helper/useBlockly";
import RobotActions from "../robocup/RobotActions";
import {useDispatch} from "react-redux";
import BallActions from "../robocup/BallActions";

/**
 * TASK
 * ====
 *
 * Initial: Ball positioned on right penalty point, robot three fields away from the ball, facing the goal
 * Task: Kick ball into goal
 * Required Actions: Walk, Kick
 * Required Coding Concepts: --
 *
 * @returns {*}
 * @constructor
 */
const GoFurtherStraight = () => {

    const blockly = useBlockly();

    const dispatch = useDispatch();

    //Initialize the robot position on the field for the given task
    useEffect(() => {
        dispatch(RobotActions.reset())
        dispatch(RobotActions.addRobot(300,220));
        dispatch(RobotActions.turnRobot(90,0));
        dispatch(BallActions.updateBall(0,0));
        dispatch(BallActions.moveBall(470,220));
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
                <Block type="ball_kick"/>
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

export default GoFurtherStraight