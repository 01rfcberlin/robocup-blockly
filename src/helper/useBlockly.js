import BlocklyJS from "blockly/javascript";
import * as React from "react";
import {useDispatch} from "react-redux";
import RobotActions from "../robocup/RobotActions";

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

    /**
     * Blockly-method to generate the code from the current workspace, print it to console (just for debugging)
     * and then executing the code.
     */
    const generateCode = () => {
        var code = BlocklyJS.workspaceToCode(
            simpleWorkspace.current.workspace
        );
        console.log(code);
        try {
            eval(code);
        } catch (e) {
            alert(e);
        }
    };

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
        dispatch(RobotActions.moveRobot(pos_x,pos_y, ind));
    };


    /**
     * Helper-function to translate the turnRobot() function received from Blockly into dispatch
     * @param deg
     * @param ind
     */
    const turnRobot = (deg, ind) => {
        dispatch(RobotActions.turnRobot(0, ind));
    };

    return {simpleWorkspace, generateCode}
}