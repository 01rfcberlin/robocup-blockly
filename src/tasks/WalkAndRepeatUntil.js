import {RoboCupField} from "../robocup/field";
import BlocklyComponent, {Block, Field, Shadow, Value} from "../Blockly";
import React, {useEffect, useState} from "react";
import {useBlockly} from "../helper/useBlockly";
import RobotActions from "../robocup/RobotActions";
import {useDispatch} from "react-redux";
import BallActions from "../robocup/BallActions";
import ExecuteResetButton from "../helper/ExecuteResetButton";
import Blockly from 'blockly/core';
import {Col, Row} from "reactstrap";

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
const WalkAndRepeatUntil = ({task_properties}) => {

    const blockly = useBlockly();

    const dispatch = useDispatch();

    const [currentNumberBlocks, setCurrentNumberBlocks] = useState(0);

    const [showTip, setShowTip] = useState(false);


    // Initialize the robot position on the field for the given task
    const init = () => {
        blockly.setInterpreterIsActive(false);
        blockly.simpleWorkspace.current.workspace.clear();
        let parentBlock = blockly.simpleWorkspace.current.workspace.newBlock('start_block');
        blockly.simpleWorkspace.current.workspace.addChangeListener(Blockly.Events.disableOrphans);
        parentBlock.initSvg();
        parentBlock.render();
        parentBlock.moveBy(20,20)
        reset();
    };

    // Resets the robot position on the field to the original position
    const reset = () => {
        blockly.setInterpreterIsActive(false);
        blockly.simpleWorkspace.current.workspace.highlightBlock(null);
        dispatch(RobotActions.reset());
        dispatch(RobotActions.addRobot(
          task_properties.own_robot.position.x,
          task_properties.own_robot.position.y,
          task_properties.own_robot.position.rotation * 2*Math.PI/360,
            "left"
        ));
        dispatch(BallActions.setPosition(task_properties.ball.position.x,task_properties.ball.position.y));
    };

    const toggleTip = () => {
        setShowTip(!showTip);
    };

    const taskBody = () => {
        return task_properties.task.body.map(element => {
            return <p> {element} </p>
        })
    };

    const taskTip = () => {
        return task_properties.task.tip.map(element => {
            return <p> {element} </p>
        })
    };

    useEffect(() => {
        init();
    }, [task_properties]);

    return(
        <Row style={{minHeight: "90vh"}}>
            <Col xs={1}/>
            <Col xs={10}>
                <Row>
                    <Col xs={4}>
                        <Row>
                            <RoboCupField/>
                        </Row>
                        <Row style={{marginTop: "20px"}}>
                            <Col xs={1}/>
                            <Col xs={10}>
                                <h3>{task_properties.task.heading}</h3>
                                <p style={{marginTop: "10px"}}>{taskBody()}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={8}>
                                {
                                    showTip && <p>{taskTip()}</p>
                                }
                            </Col>
                            <Col xs={4}>
                                <img height={"100px"} src={"/bueroklammer.jpg"} onClick={() => {toggleTip()}}></img>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={1}/>
                    <Col xs={7}>
                        <Row style={{height: "80vh"}}>
                            <BlocklyComponent ref={blockly.simpleWorkspace}
                                              readOnly={false} trashcan={true}
                                              move={{
                                                  scrollbars: true,
                                                  drag: true,
                                                  wheel: true
                                              }}>
                                <Block type="ball_kick"/>
                                <Block type="move_one_block_ahead"/>
                                <Block type="turn_right"/>
                                <Block type="turn_left"/>
                                <Block type="repeat"/>
                                <Block type="repeat_until"/>
                                <Block type="next_to_ball"/>
                            </BlocklyComponent>
                        </Row>
                        <Row style={{marginTop: "20px"}}>
                            <Col xs={2}>
                                <ExecuteResetButton execute={blockly.generateCode} reset={reset} />
                            </Col>
                            <Col xs={1}/>
                            <Col xs={5}>
                                <h4><b>Optimale Anzahl Blöcke: {currentNumberBlocks}/{task_properties.optimal_blocks}</b></h4>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    )


};

export default WalkAndRepeatUntil
