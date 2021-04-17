import BlocklyJS from "blockly/javascript";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import RobotActions from "../robocup/RobotActions";
import BallActions from "../robocup/BallActions";
import * as constants from "../constants.js";
import {useState} from "react";
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

    const { robotListLeft } = useSelector(state => {
        return state.gameState;
    });


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
            interpreter.setProperty(globalObject, 'setRobotTargetPosition', interpreter.createNativeFunction(setRobotTargetPosition));
            interpreter.setProperty(globalObject, 'ballKick', interpreter.createNativeFunction(ballKick));
            interpreter.setProperty(globalObject, 'addRobotTargetRotation', interpreter.createNativeFunction(addRobotTargetRotation));
            interpreter.setProperty(globalObject, 'moveForward', interpreter.createNativeFunction(moveForward));
          }
        })(simpleWorkspace.current.workspace);

        const Interpreter = window["Interpreter"];
        console.log(code);
        const myInterpreter = new Interpreter(code, initApi);
        setWorkspaceCodeInterpreter(myInterpreter);

    };

    const interpret = () => {
        if(workspaceCodeInterpreter) {
            const nextStep = (robotListLeft) => {
                const rob = robotListLeft[0];
                if (rob.isActive) {
                    return;
                }
                workspaceCodeInterpreter.step();
            };

            nextStep(robotListLeft);
        }
    };

    useInterval(interpret, 100);

    function highlightBlock(workspace, id) {
        workspace.highlightBlock(id);
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
     * Helper-function to translate the setRobotTargetPosition() function received from Blockly into dispatch
     * @param pos_x
     * @param pos_y
     * @param ind
     */
    const setRobotTargetPosition = (pos_x, pos_y, ind) => {
        dispatch(RobotActions.setTargetPosition(pos_x,pos_y, ind));
    };

    /**
     * Helper-function to translate the ballKick() function received from Blockly into dispatch
     * @param block
     * @param ind Index of the robot performing the kick
     */
    const ballKick = (block, ind) => {
        dispatch(BallActions.ballKick(block,ind));
    };

    /**
     * Helper-function to translate the addRobotTargetRotation() function received from Blockly into dispatch
     * @param deg
     * @param ind
     */
    const addRobotTargetRotation = (deg, ind) => {
        dispatch(RobotActions.addTargetRotation(deg, ind));
    };

    /**
     * Helper-function to translate the moveForward() function received from Blockly into dispatch
     * @param deg
     * @param ind
     */
    const moveForward = (block, ind) => {
        dispatch(RobotActions.walkForward(block,ind));
        ballKick(1, 0);

    };

    return {simpleWorkspace, generateCode}
}
