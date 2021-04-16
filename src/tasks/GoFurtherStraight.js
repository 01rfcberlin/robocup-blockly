import {RoboCupField} from "../robocup/field";
import BlocklyComponent, {Block, Field, Shadow, Value} from "../Blockly";
import React, {useEffect} from "react";
import {useBlockly} from "../helper/useBlockly";
import RobotActions from "../robocup/RobotActions";
import {useDispatch} from "react-redux";
import BallActions from "../robocup/BallActions";
import ExecuteResetButton from "./ExecuteResetButton";

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

    // Initialize the robot position on the field for the given task
    const reset = () => {
        dispatch(RobotActions.reset())
        dispatch(RobotActions.addRobot(300,220, 90));
        dispatch(BallActions.updateBall(0,0));
        dispatch(BallActions.moveBall(470,220));
    };

    useEffect(reset, []);

    return(
        <div>
            <div>
                <RoboCupField
                    grid_properties={{
                    }}
                />
            </div>
            <ExecuteResetButton execute={blockly.generateCode} reset={reset} />
            <BlocklyComponent ref={blockly.simpleWorkspace}
                              readOnly={false} trashcan={true}
                              move={{
                                  scrollbars: true,
                                  drag: true,
                                  wheel: true
                              }}>
                <Block type="move_one_block_ahead"/>
                <Block type="ball_kick"/>
            </BlocklyComponent>
        </div>
    )


};

export default GoFurtherStraight
