import {RoboCupField} from "../robocup/field";
import BlocklyComponent, {Block} from "../Blockly";
import {useEffect, useState, useRef} from "react";
import {Container} from 'reactstrap';
import RobotActions from "../robocup/RobotActions";
import BlocklyJS from "blockly/javascript";
import {useDispatch, useSelector} from "react-redux";
import BallActions from "../robocup/BallActions";
import * as constants from "../constants.js";
import {ballKickable} from "../robocup/GameStateReducer.js";
import {Col, Row} from "reactstrap";
import Blockly from 'blockly/core';
import InterfaceActions from "../robocup/InterfaceActions";
import * as queries from "../robocup/queries.js";
import * as translations from "../robocup/translations.js";

// These are the functions that are made available inside the JS interpreter.
// These functions just wrap calls to dispatch and thus function as glue
// between Blockly and Redux.
const blocklyFunctions = {
  addRobot: ({dispatch}) => (
    (pos_x, pos_y) => {
      dispatch(RobotActions.addRobot(pos_x,pos_y));
    }
  ),

  setRobotTargetPosition: ({dispatch}) => (
    (pos_x, pos_y, ind, team) => {
      dispatch(RobotActions.setTargetPosition(pos_x,pos_y, ind, team));
    }
  ),

  ballKick: ({dispatch, robotListRef}) => (
    (block, ind, team) => {
      dispatch(BallActions.ballKick(block,ind, team));
      tickOpponentRobots(team,robotListRef,dispatch);
    }
  ),

  addRobotTargetRotation: ({dispatch, robotListRef}) => (
    (radians, ind, team) => {
      dispatch(RobotActions.addTargetRotation(radians, ind, team));
      tickOpponentRobots(team,robotListRef,dispatch);
    }
  ),

  moveForward: ({dispatch, robotListRef}) => (
    (block, ind, team) => {
      dispatch(RobotActions.walkForward(block,ind, team));
      dispatch(BallActions.ballKick(1, ind, team));
      tickOpponentRobots(team,robotListRef,dispatch);
    }
  ),

  startBlock: ({reachedCodeEnd}) => (
    () => {
    }
  ),

  codeEnd: ({reachedCodeEnd}) => (
    () => {
      reachedCodeEnd.current = true;
    }
  ),

  nextToBall: ({ballStateRef, robotListRef}) => (
    (id, team) => {
      return ballKickable(ballStateRef.current.position, robotListRef.current[team][id].position);
    }
  ),

  isRobotAboveGoal: ({robotListRef}) => (
    (id, team) => {
      const y = translations.pixelToCell(robotListRef.current[team][id].position).y;
      return y < 3;
    }
  ),
  isRobotBeneathGoal: ({robotListRef}) => (
    (id, team) => {
      const y = translations.pixelToCell(robotListRef.current[team][id].position).y;
      return y > 5;
    }
  ),
  isRobotCenteredToGoal: ({robotListRef}) => (
    (id, team) => {
      const y = translations.pixelToCell(robotListRef.current[team][id].position).y;
      return y >= 3 && y <= 5;
    }
  ),

  waitBlock: ({dispatch, robotListRef}) => (
    (team) => {
        tickOpponentRobots(team,robotListRef,dispatch);
    }
  ),

  highlightBlock: ({workspaceRef}) => (
    (blockId) => {
      workspaceRef.current.workspace.highlightBlock(blockId);
    }
  ),

  ballInLeftVisionField: ({ballStateRef, robotListRef}) => (
    (id, team) => {
      return queries.ballInLeftVisionField(robotListRef.current[team][id].position, ballStateRef.current.position);
    }
  ),
  ballInMidVisionField: ({ballStateRef, robotListRef}) => (
    (id, team) => {
      return queries.ballInMidVisionField(robotListRef.current[team][id].position, ballStateRef.current.position);
    }
  ),
  ballInRightVisionField: ({ballStateRef, robotListRef}) => (
    (id, team) => {
      return queries.ballInRightVisionField(robotListRef.current[team][id].position, ballStateRef.current.position);
    }
  ),

};

function tickOpponentRobots(own_team, robotListRef, dispatch) {
    let other_team = "right";
    if (own_team === "right") {
        other_team = "left"
    }
    for (let robot in robotListRef.current[other_team]) {
        if (robotListRef.current[other_team][robot].fixedMovement) {
            let currFixedMovement = robotListRef.current[other_team][robot].fixedMovement
            convertFixedMovements(currFixedMovement.actionList[currFixedMovement.index], robot, other_team, dispatch);
            dispatch(RobotActions.increaseFixedMovementIndex(robot, other_team));
        }
    }
}

function convertFixedMovements(action, robot, team, dispatch) {
    switch (action) {
        case "move_one_block_ahead":
            dispatch(RobotActions.walkForward(1, robot, team));
            dispatch(BallActions.ballKick(1, robot, team));
            break;
        case "turn_left":
            dispatch(RobotActions.addTargetRotation(-Math.PI/2, robot, team));
            break;
        default:
            break;
    }
}

function console_log(...args){
  if (constants.debugInterpreterLogs) {
    console.log(...args);
  }
}

export default function Task(props) {
  const dispatch = useDispatch();
  const { robotList, ball } = useSelector(state => {
    return state.gameState;
  });

  // hack to render this component, when the execute/reset button was clicked
  const [curTriggerRendering, triggerRendering] = useState(1);

  const workspaceRef = useRef();
  const workspaceInterpreterRef = useRef();
  // This property only is for understanding if the code is still executing
  // inside interpreterStep(). It's a debug variable, so that we can return
  // early in interpreterStep() if we are finished with the execution. This
  // makes the flow easier to understand but if we return early or not should
  // have no effect on the actual execution.
  const reachedCodeEnd = useRef();

  // TODO: Can this be solved without a ref? Or do we really need a ref?
  const robotListRef = useRef();
  robotListRef.current = robotList;

  const ballStateRef = useRef();
  ballStateRef.current = ball;

  const [showTip, setShowTip] = useState(false);

  const toggleTip = () => {
      setShowTip(!showTip);
  };

  const taskBody = () => {
      return props.task_properties.task.body.map((element, index) => {
          return <p style={{marginTop: "10px"}} key={`task-body-${index}`}> {element} </p>
      })
  };

  const taskTip = () => {
      return props.task_properties.task.tip.map((element, index) => {
          return <p key={`task-tip-${index}`}> {element} </p>
      })
  };

  // Called when switching to a new task
  function init() {
    // Remove existing blocks from workspace
    workspaceRef.current.workspace.clear();

    // Clearing the workspace also removes the start block. Add a start block
    // again (or initially add it)
    //
    // TODO: The position of the start block should be fixed (not movable)
    let parentBlock = workspaceRef.current.workspace.newBlock('start_block');
    workspaceRef.current.workspace.addChangeListener(Blockly.Events.disableOrphans);
    parentBlock.initSvg();
    parentBlock.render();
    parentBlock.moveBy(20,20);

    reset();
  }

  function blocklyBlocks() {
        return props.task_properties.codeBlocks.map(blockName => {
            const key = "blockType_" + blockName;
            return <Block key={key} type={blockName} />
        });
    }

    function getRandomArbitrary(min, max) {
      let rand = parseInt(Math.random() * (max - min) + min);
      return rand;
    }

    function getRandomRotation() {
      let potential_rotations = [0,90,180,270];
      let rand = potential_rotations[Math.floor(Math.random()*potential_rotations.length)];
      return rand;
    }

  // Called when clicking on the reset button. Resets the robot position on the
  // field to the original position and abort execution
  // machen, sondern nur über hooks dinge ändern in der "klasse"?
  function reset() {
    // Remove the highlight from the last execution
    workspaceRef.current.workspace.highlightBlock(null);

    // Reset targets in the Redux state
    dispatch(RobotActions.reset());

    // Reset the position of the robot to the original position. This depends on the actual task and thus has to be passed via the props.
    resetGameState();

    // Abort execution
    workspaceInterpreterRef.current = null;
  }

  useEffect(() => {
    init();
  }, [props.task_properties, workspaceRef.current]);

  function instantiateInterpreter() {
    BlocklyJS.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    BlocklyJS.addReservedWords('highlightBlock');

    const code = BlocklyJS.workspaceToCode(workspaceRef.current.workspace) + "; codeEnd();";

    // remove the highlight from the last execution
    workspaceRef.current.workspace.highlightBlock(null);

    function initApi(interpreter, globalObject) {
      // Let the JS interpreter know about the functions from
      // blocklyFunctions
      for (const funName in blocklyFunctions) {
        const fun = blocklyFunctions[funName]({
          dispatch,
          workspaceRef,
          reachedCodeEnd,
          robotListRef,
          ballStateRef,
          tickOpponentRobots,
        });

        interpreter.setProperty(globalObject, funName, interpreter.createNativeFunction((...args) => {
          console_log("Interpreter:", funName);
          const ret = fun(...args);
          if (typeof ret !== "undefined") {
            console_log("Interpreter:", funName, "=>", ret);
          }
          return ret;
        }));
      }
    };

    const Interpreter = window["Interpreter"];
    const myInterpreter = new Interpreter(code, initApi);
    console_log(code)
    reachedCodeEnd.current = false;
    workspaceInterpreterRef.current = myInterpreter;
  }

    // Resets the robot position on the field to the original position
    function resetGameState () {
        //Determines whether the ball should be placed random or at a fixed position
        dispatch(InterfaceActions.setVisibility(props.task_properties.visibility))
        dispatch(InterfaceActions.setAim(props.task_properties.aim))
        dispatch(InterfaceActions.setVisionField(props.task_properties.visionField))
        let ball_x = -1;
        let ball_y = -1;
        if (props.task_properties.ball.random) {
            ball_x = getRandomArbitrary(props.task_properties.ball.random.x.min,props.task_properties.ball.random.x.max);
            ball_y = getRandomArbitrary(props.task_properties.ball.random.y.min,props.task_properties.ball.random.y.max);
        }
        else {
            ball_x = props.task_properties.ball.position.x;
            ball_y = props.task_properties.ball.position.y;
        }
        dispatch(BallActions.addBall(ball_x,ball_y));
        let robot_x = -1;
        let robot_y = -1;
        let robot_rotation = 0;
        if (props.task_properties.own_robot.random) {
            robot_x = getRandomArbitrary(props.task_properties.own_robot.random.x.min,props.task_properties.own_robot.random.x.max);
            robot_y = getRandomArbitrary(props.task_properties.own_robot.random.y.min,props.task_properties.own_robot.random.y.max);
            robot_rotation = getRandomRotation() * 2*Math.PI/360;
        }
        else if (props.task_properties.own_robot.rel_ball) {
            robot_x = ball_x + props.task_properties.own_robot.rel_ball.x;
            robot_y = ball_y + props.task_properties.own_robot.rel_ball.y;
            robot_rotation = props.task_properties.own_robot.rel_ball.rotation * 2*Math.PI/360;
        }
        else {
            robot_x = props.task_properties.own_robot.position.x;
            robot_y = props.task_properties.own_robot.position.y;
            robot_rotation = props.task_properties.own_robot.position.rotation * 2*Math.PI/360;
        }
        dispatch(RobotActions.addRobot(
            robot_x,
            robot_y,
            robot_rotation,
            "left"
        ));
        if(props.task_properties.opponent_robot) {
            let opponent_x = -1;
            let opponent_y = -1;
            let opponent_rotation = 0;
            if (props.task_properties.opponent_robot.random) {
                opponent_x = getRandomArbitrary(props.task_properties.opponent_robot.random.x.min,props.task_properties.opponent_robot.random.x.max);
                opponent_y = getRandomArbitrary(props.task_properties.opponent_robot.random.y.min,props.task_properties.opponent_robot.random.y.max);
                opponent_rotation = getRandomRotation() * 2*Math.PI/360;
            }
            else {
                opponent_x = props.task_properties.opponent_robot.position.x;
                opponent_y = props.task_properties.opponent_robot.position.y;
                opponent_rotation = props.task_properties.opponent_robot.position.rotation * 2*Math.PI/360;
            }

            dispatch(RobotActions.addRobot(
                opponent_x,
                opponent_y,
                opponent_rotation,
                "right"
            ));

            if (props.task_properties.opponent_robot.movement) {
                dispatch(RobotActions.setFixedMovement(0, "right", props.task_properties.opponent_robot.movement));
            }
        }
    };

  // Note that you should pass all the state you need in the step function via
  // React refs in the function.
  function interpreterStep() {
    const workspaceInterpreter = workspaceInterpreterRef.current;
    const robot = robotListRef.current["left"][0];
    const ballRef = ballStateRef.current

    // Execution was stopped via the reset button (or never begun)
    if (workspaceInterpreter === null) return;

    // Execution of the current code is finished
    if (reachedCodeEnd.current === null || reachedCodeEnd.current) return;

    // If the robot is still moving (i.e. the robot is still executing the
    // last task), then don't begin the next task.
    if (robot.isActive || ballRef.isMoving) {
      return;
    }

    console_log("interpreterStep()");

    // Note: If you here get a JS error at this line that states
    // something like "ReferenceError: ... is not defined" this means
    // that inside the JS interpreter an object couldn't be found.
    // Inside the JS interpreter you can't access objects from
    // outside the JS interpreter - you have to pass everything
    // explicitly into the JS interpreter (compare how we pass the
    // dispatch function into the blockly functions).
    //
    // TODO: Maybe we should use .stepCallExpression() here instead? It is
    // weird that we need to call the step function multiple times for one
    // function call.
    workspaceInterpreter.step();
  }

  useEffect(() => {
    const id = setInterval(interpreterStep, constants.step_execution_interval);
    return () => {
      clearInterval(id);
    };
  }, []);

  let buttonText;
  let buttonClass;
  if (workspaceInterpreterRef.current !== null) {
    buttonText = "Nochmal!";
    buttonClass = "executeButton reset";
  } else {
    buttonText = "Code ausführen!";
    buttonClass = "executeButton execute";
  }



  return(
      <Container style={{minWidth: "100%", minHeight: "100%"}}>
          <Row>
          <Col xs={12}>
              <Row>
                  <Col xs={4}>
                      <Row>
                          <RoboCupField/>
                      </Row>
                      <Row className={"justify-content-md-center"} style={{marginTop: "20px"}}>
                              <h3>{props.task_properties.task.heading}</h3>
                              {taskBody()}
                      </Row>
                      <Row>
                          <Col xs={8}>
                              {
                                  showTip && <p>{taskTip()}</p>
                              }
                          </Col>
                          <Col xs={4}>
                              <img alt="Click this for hints" height={"100px"} src={process.env.PUBLIC_URL + "/bueroklammer.jpg"} onClick={() => {toggleTip()}}></img>
                          </Col>
                      </Row>
                      <Row><a href="https://01.rfc-berlin.de/de/privacy-policy/">Datenschutzerklärung</a></Row>
                  </Col>
                  <Col xs={1}/>
                  <Col xs={7}>
                      <Row style={{height: "80vh"}}>
                          <BlocklyComponent ref={workspaceRef}
                                            readOnly={false}
                                            trashcan={true}
                                            media={process.env.PUBLIC_URL + "/media/"}
                                            move={{
                                                scrollbars: true,
                                                drag: true,
                                                wheel: false
                                            }}>
                              {blocklyBlocks()}
                          </BlocklyComponent>
                      </Row>
                      <Row style={{marginTop: "20px"}}>
                          <Col xs={12}>
                              <button size="lg" className={buttonClass} onClick={() => {
                                if (workspaceInterpreterRef.current !== null) {
                                  reset();
                                  triggerRendering(curTriggerRendering + 1);
                                } else {
                                    dispatch(InterfaceActions.setVisibility(true))
                                    instantiateInterpreter();
                                  triggerRendering(curTriggerRendering + 1);
                                }
                              }}>{buttonText}</button>
                          </Col>
                      </Row>
                      <Row className={"justify-content-md-center"} style={{marginTop: "10px"}}>
                          <Col xs={12}>
                              <b>Optimale Anzahl Blöcke: {props.task_properties.optimal_blocks}</b>
                          </Col>
                      </Row>
                  </Col>
              </Row>
          </Col>
          <Col xs={1}/>
          </Row>
      </Container>
  )
}
