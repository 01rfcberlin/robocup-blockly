import {RoboCupField} from "../robocup/field";
import BlocklyComponent, {Block, Field, Shadow, Value} from "../Blockly";
import React, {useEffect} from "react";
import {useBlockly} from "../helper/useBlockly";
import {useDispatch} from "react-redux";
import RobotActions from "../robocup/RobotActions";
import BallActions from "../robocup/BallActions";
import ExecuteResetButton from "../helper/ExecuteResetButton";

/**
 * TASK
 * ====
 *
 * Initial: Ball positioned on right penalty point, robot one field below center mark, facing the center mark
 * Task: Kick ball into goal
 * Required Actions: Turn, Walk, Kick
 * Required Coding Concepts: --
 *
 * @returns {*}
 * @constructor
 */
const WalkAndTurn = ({task_properties}) => {

    const blockly = useBlockly();

    const dispatch = useDispatch();

    // Initialize the robot position on the field for the given task
    const reset = () => {
        dispatch(RobotActions.reset());
        dispatch(RobotActions.addRobot(
          task_properties.own_robot.position.x,
          task_properties.own_robot.position.y,
          task_properties.own_robot.position.rotation * 2*Math.PI/360
        ));
        dispatch(BallActions.setPosition(task_properties.ball.position.x,task_properties.ball.position.y));
    };

    useEffect(reset, []);

    useEffect(() => {
        let parentBlock = blockly.simpleWorkspace.current.workspace.newBlock('start_block');
        parentBlock.initSvg();
        parentBlock.render();
        parentBlock.moveBy(20,20)
    }, []);

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
                <Block type="move_one_block_ahead"/>
                <Block type="ball_kick"/>
                <Block type="turn_right"/>
                <Block type="turn_left"/>
            </BlocklyComponent>
        </div>
    )


};

export default WalkAndTurn
