import BlocklyJS from "blockly/javascript";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import RobotActions from "../robocup/RobotActions";
import BallActions from "../robocup/BallActions";
import * as constants from "../constants.js";
import {useState} from "react";
import {useEffect} from "react";
import {useInterval} from "./useInterval";

/**
 * Custom Hook that allows us to access the blockly Workspace and evaluation method inside the individual tasks
 * TODO: It would be a more straight-forward implementation if eval() would be able to execute the dispatch right away
 *  However, since the dispatch relies on the imported RobotActions, which in turn rely on the ActionNames, the
 *  evaluation fails.
 *
 * @returns {{generateCode: generateCode, simpleWorkspace: React.RefObject<unknown>}}
 */
export function useBlockly() {

    const simpleWorkspace = React.createRef();

    const dispatch = useDispatch();

    const { robotList } = useSelector(state => {
        return state.RobotReducer;
    });

    const ball = useSelector(state => {
        return state.BallReducer;
    });

    let lastBlockType;

    const [workspaceCodeInterpreter, setWorkspaceCodeInterpreter] = useState();

    /**
     * Blockly-method to generate the code from the current workspace, print it to console (just for debugging)
     * and then executing the code.
     */
    const generateCode = () => {
        BlocklyJS.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
        BlocklyJS.addReservedWords('highlightBlock');

        var code = BlocklyJS.workspaceToCode(
            simpleWorkspace.current.workspace
        );

        // remove the highlight from all the last execution
        simpleWorkspace.current.workspace.highlightBlock(null);

        const initApi = ((workspace) => {
          return (interpreter, globalObject) => {
            interpreter.setProperty(globalObject, 'highlightBlock', interpreter.createNativeFunction((id) => highlightBlock(workspace, id)));
            interpreter.setProperty(globalObject, 'addRobot', interpreter.createNativeFunction(addRobot));
            interpreter.setProperty(globalObject, 'moveRobot', interpreter.createNativeFunction(moveRobot));
            interpreter.setProperty(globalObject, 'ballKick', interpreter.createNativeFunction(ballKick));
            interpreter.setProperty(globalObject, 'turnRobot', interpreter.createNativeFunction(turnRobot));
            interpreter.setProperty(globalObject, 'moveForward', interpreter.createNativeFunction(moveForward));
          }
        })(simpleWorkspace.current.workspace);

        const Interpreter = window["Interpreter"];
        console.log(code);
        const myInterpreter = new Interpreter(code, initApi);
        setWorkspaceCodeInterpreter(myInterpreter);

    };

    const interpret = () => {
        //console.log("I'm thinking. Hard.");
        if(workspaceCodeInterpreter) {
            const nextStep = (robotList) => {
                // TODO: hier können wir einfach den "type" vom *letzten* block uns
                // angucken, und wenn der zB ein moveForward block war, dann müssen
                // wir halt warten, bis der Roboter am Ziel angekommen ist. für die
                // meisten anderen blöcke, sollte es ausreichen, wenn wir paar ms
                // warten
                //console.log("lastBlockType", lastBlockType);
                const rob = robotList[0];
                //console.log(rob.isActive);
                if (rob.isActive) {
                    return;
                }
                workspaceCodeInterpreter.step();
                workspaceCodeInterpreter.step();
            };

            nextStep(robotList);
        }
    };

    useInterval(interpret, 100);

    function highlightBlock(workspace, id) {
        const blockType = workspace.getBlockById(id).type;
        workspace.highlightBlock(id);
        lastBlockType = blockType;
    }

    /**
     * Helper-function to translate the addRobot() function received from Blockly into dispatch
     * @param pos_x
     * @param pos_y
     */
    const addRobot = (pos_x, pos_y) => {
        dispatch(RobotActions.addRobot(pos_x,pos_y));
    };

    /**
     * Helper-function to translate the moveRobot() function received from Blockly into dispatch
     * @param pos_x
     * @param pos_y
     * @param ind
     */
    const moveRobot = (pos_x, pos_y, ind) => {
      //console.log("moveRobot helper")
        dispatch(RobotActions.moveRobot(pos_x,pos_y, ind));
    };

    /**
     * Helper-function to translate the ballKick() function received from Blockly into dispatch
     * @param block
     * @param ind
     */
    const ballKick = (block, ind) => {
        var robotCellX = Math.floor(robotList[ind].position.x/constants.cell_width);
        var robotCellY = Math.floor(robotList[ind].position.y/constants.cell_height);
        var ballCellX = Math.floor(ball.ball_position.x/constants.cell_width);
        var ballCellY = Math.floor(ball.ball_position.y/constants.cell_height);

        // console.log("Ball:", ballCellX, ballCellY)
        // console.log("Robot:", robotCellX, robotCellY)
        if(ballCellX == robotCellX && ballCellY == robotCellY) {
            if(robotList[ind].position.rotation == 90) {
                dispatch(BallActions.ballKick(ball.ball_position.x + (block * constants.cell_width), ball.ball_position.y));
            }
            else if(robotList[ind].position.rotation == 270) {
                dispatch(BallActions.ballKick(ball.ball_position.x - (block * constants.cell_width), ball.ball_position.y));
            }
            else if(robotList[ind].position.rotation == 180) {
                dispatch(BallActions.ballKick(ball.ball_position.x, ball.ball_position.y + (block * constants.cell_height)));
            }
            else if(robotList[ind].position.rotation == 0) {
                dispatch(BallActions.ballKick(ball.ball_position.x, ball.ball_position.y - (block * constants.cell_height)));
            }
        }
    };

    /**
     * Helper-function to translate the turnRobot() function received from Blockly into dispatch
     * @param deg
     * @param ind
     */
    const turnRobot = (deg, ind) => {
        dispatch(RobotActions.turnRobot(deg, ind));
    };

    /**
     * Helper-function to translate the moveForward() function received from Blockly into dispatch
     * @param deg
     * @param ind
     */
    const moveForward = (block, ind) => {
        var robotCellX = Math.floor(robotList[ind].position.x/constants.cell_width);
        var robotCellY = Math.floor(robotList[ind].position.y/constants.cell_height);
        var ballCellX = Math.floor(ball.ball_position.x/constants.cell_width);
        var ballCellY = Math.floor(ball.ball_position.y/constants.cell_height);

        // console.log("Ball:", ballCellX, ballCellY)
        // console.log("Robot:", robotCellX, robotCellY)

        dispatch(RobotActions.walkForward(block,ind));

        if(ballCellX == robotCellX && ballCellY == robotCellY) {
            ballKick(1, 0);
        }
    };

    return {simpleWorkspace, generateCode}
}
