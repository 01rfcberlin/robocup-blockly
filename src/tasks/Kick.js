import {RoboCupField} from "../robocup/field";
import BlocklyComponent, {Block, Field, Shadow, Value} from "../Blockly";
import React, {useEffect} from "react";
import {useBlockly} from "../helper/useBlockly";
import RobotActions from "../robocup/RobotActions";
import {useDispatch} from "react-redux";
import BallActions from "../robocup/BallActions";
import ExecuteResetButton from "../helper/ExecuteResetButton";

/**
 * TASK
 * ====
 *
 * Initial: Ball positioned on right penalty point, robot right in front of the ball, facing the goal
 * Task: Kick ball into goal
 * Required Actions: Kick
 * Required Coding Concepts: --
 *
 * @returns {*}
 * @constructor
 */
const Kick = ({task_properties}) => {

    const blockly = useBlockly();

    const dispatch = useDispatch();

    // Initialize the robot position on the field for the given task
    const reset = () => {
        dispatch(RobotActions.reset());
        dispatch(RobotActions.addRobot(task_properties.own_robot.position.x,task_properties.own_robot.position.y, task_properties.own_robot.position.rotation));
        dispatch(BallActions.updateBall(0,0));
        dispatch(BallActions.moveBall(task_properties.ball.position.x,task_properties.ball.position.y));
    };

    useEffect(reset, []);

    return(
        <div>
            <div>
                <RoboCupField/>
            </div>
            <ExecuteResetButton execute={blockly.generateCode} reset={reset} />
            <BlocklyComponent ref={blockly.simpleWorkspace}
                              readOnly={false} trashcan={true}
                              move={{
                                  scrollbars: true,
                                  drag: true,
                                  wheel: true
                              }}>
                <Block type="ball_kick"/>
            </BlocklyComponent>
        </div>
    )


};

export default Kick
