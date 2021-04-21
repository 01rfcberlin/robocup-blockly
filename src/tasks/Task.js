import {RoboCupField} from "../robocup/field";
import BlocklyComponent from "../Blockly";
import {useEffect, useState, useRef} from "react";
import { Button } from 'reactstrap';
import RobotActions from "../robocup/RobotActions";
import BlocklyJS from "blockly/javascript";
import {useDispatch, useSelector} from "react-redux";
import BallActions from "../robocup/BallActions";
import * as constants from "../constants.js";
import {Col, Row} from "reactstrap";

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
    (pos_x, pos_y, ind) => {
      dispatch(RobotActions.setTargetPosition(pos_x,pos_y, ind));
    }
  ),

  ballKick: ({dispatch}) => (
    (block, ind) => {
      dispatch(BallActions.ballKick(block,ind));
    }
  ),

  addRobotTargetRotation: ({dispatch}) => (
    (radians, ind) => {
      dispatch(RobotActions.addTargetRotation(radians, ind));
    }
  ),

  moveForward: ({dispatch}) => (
    (block, ind) => {
      dispatch(RobotActions.walkForward(block,ind));
      dispatch(BallActions.ballKick(1, 0));
    }
  ),

  startBlock: ({dispatch, reachedCodeEnd}) => (
    () => {
    }
  ),

  codeEnd: ({dispatch, reachedCodeEnd}) => (
    () => {
      reachedCodeEnd.current = true;
    }
  ),

  nextToBall: ({dispatch, robotListLeftRef}) => (
    () => {
      return robotListLeftRef.current[0].isNextToBall;
    }
  ),

  highlightBlock: ({dispatch, workspaceRef}) => (
    (blockId) => {
      workspaceRef.current.workspace.highlightBlock(blockId);
    }
  ),
};

export default function Task(props) {
  const dispatch = useDispatch();
  const { robotListLeft, ball } = useSelector(state => {
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
  const robotListLeftRef = useRef();
  robotListLeftRef.current = robotListLeft;

  const [showTip, setShowTip] = useState(false);

  const toggleTip = () => {
      setShowTip(!showTip);
  };

  const taskBody = () => {
      return props.task_properties.task.body.map(element => {
          return <p> {element} </p>
      })
  };

  const taskTip = () => {
      return props.task_properties.task.tip.map(element => {
          return <p> {element} </p>
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
    parentBlock.initSvg();
    parentBlock.render();
    parentBlock.moveBy(20,20);

    reset();
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
    props.reset();

    // Abort execution
    workspaceInterpreterRef.current = null;
  }

  useEffect(() => {
    init();
  }, [props.task_properties]);

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
          robotListLeftRef,
        });

        interpreter.setProperty(globalObject, funName, interpreter.createNativeFunction((...args) => {
          console.log("Interpreter:", funName);
          const ret = fun(...args);
          if (typeof ret !== "undefined") {
            console.log("Interpreter:", funName, "=>", ret);
          }
          return ret;
        }));
      }
    };

    const Interpreter = window["Interpreter"];
    const myInterpreter = new Interpreter(code, initApi);
    console.log(code)
    reachedCodeEnd.current = false;
    workspaceInterpreterRef.current = myInterpreter;
  }

  // Note that you should pass all the state you need in the step function via
  // React refs in the function.
  function interpreterStep() {
    const workspaceInterpreter = workspaceInterpreterRef.current;
    const robot = robotListLeftRef.current[0];

    //console.log("interpreterStep()",
    //  "interpreter?", workspaceInterpreter !== null,
    //  "reachedCodeEnd?", reachedCodeEnd.current,
    //  "isActive?", robot.isActive);

    // Execution was stopped via the reset button (or never begun)
    if (workspaceInterpreter === null) return;

    // Execution of the current code is finished
    if (reachedCodeEnd.current === null || reachedCodeEnd.current) return;

    // If the robot is still moving (i.e. the robot is still executing the
    // last task), then don't begin the next task.
    if (robot.isActive) {
      return;
    }

    console.log("interpreterStep()");

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
  if (workspaceInterpreterRef.current !== null) {
    buttonText = "Reset!";
  } else {
    buttonText = "Code Ausführen!";
  }

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
                              <h3>{props.task_properties.task.heading}</h3>
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
                          <BlocklyComponent ref={workspaceRef}
                                            readOnly={false} trashcan={true}
                                            move={{
                                                scrollbars: true,
                                                drag: true,
                                                wheel: true
                                            }}>
                              { props.children }
                          </BlocklyComponent>
                      </Row>
                      <Row style={{marginTop: "20px"}}>
                          <Col xs={2}>
                              <Button onClick={() => {
                                if (workspaceInterpreterRef.current !== null) {
                                  reset();
                                  triggerRendering(curTriggerRendering + 1);
                                } else {
                                  instantiateInterpreter();
                                  triggerRendering(curTriggerRendering + 1);
                                }
                              }}>{buttonText}</Button>
                          </Col>
                          <Col xs={1}/>
                          <Col xs={5}>
                              <h4><b>Optimale Anzahl Blöcke: {props.task_properties.optimal_blocks}</b></h4>
                          </Col>
                      </Row>
                  </Col>
              </Row>
          </Col>
      </Row>
  )
}
