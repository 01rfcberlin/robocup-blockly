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
 * Initial: Ball positioned on right penalty point, robot one field below center mark, facing the center mark
 * Task: Kick ball into goal
 * Required Actions: Turn, Walk, Kick
 * Required Coding Concepts: --
 *
 * @returns {*}
 * @constructor
 */
const StraightAndTurn = () => {

    const blockly = useBlockly();

    const dispatch = useDispatch();

    //Initialize the robot position on the field for the given task
    useEffect(() => {
        dispatch(RobotActions.reset());
        dispatch(RobotActions.addRobot(300,250));
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
                <Block type="move_one_block_ahead"/>
                <Block type="turn_right"/>
            </BlocklyComponent>
        </div>
    )


};

export default StraightAndTurn