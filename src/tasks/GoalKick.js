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
 * Initial: Ball positioned on right penalty point, robot right in front of the ball, facing the goal
 * Task: Kick ball into goal
 * Required Actions: Kick
 * Required Coding Concepts: --
 *
 * @returns {*}
 * @constructor
 */
const GoalKick = () => {

    const blockly = useBlockly();

    const dispatch = useDispatch();

    //Initialize the robot position on the field for the given task
    useEffect(() => {
        dispatch(RobotActions.reset());
        dispatch(RobotActions.addRobot(460,220));
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
            </BlocklyComponent>
        </div>
    )


};

export default GoalKick