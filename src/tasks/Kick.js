import {RoboCupField} from "../robocup/field";
import BlocklyComponent, {Block, Field, Shadow, Value} from "../Blockly";
import React, {useEffect, useState} from "react";
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

    const [currentNumberBlocks,setCurrentNumberBlocks] = useState(0);

    // Initialize the robot position on the field for the given task
    const reset = () => {
        dispatch(RobotActions.reset());
        dispatch(RobotActions.addRobot(
          task_properties.own_robot.position.x,
          task_properties.own_robot.position.y,
          task_properties.own_robot.position.rotation * 2*Math.PI/360,
            "left"
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
            Optimale Anzahl Blöcke: {currentNumberBlocks}/{task_properties.optimal_blocks}

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
