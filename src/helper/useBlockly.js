import BlocklyJS from "blockly/javascript";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import RobotActions from "../robocup/RobotActions";
import BallActions from "../robocup/BallActions";

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

    // TODO: gridsize hardcoded
    const cellSizeX = ( 600 / 11 );
    const cellSizeY = ( 400 / 8 );

    const dispatch = useDispatch();

    const { robotList } = useSelector(state => {
        return state.RobotReducer;
    });

    const ball = useSelector(state => {
        return state.BallReducer;
    });

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
     * Helper-function to translate the ballKick() function received from Blockly into dispatch
     */
     const ballKick = (block, ind) => {
        // dispatch(BallActions.ballKick(block));
        console.log(ball)
        if(robotList[ind].position.rotation == 90) {
            dispatch(BallActions.ballKick(ball.ball_position.x + (block * cellSizeX), ball.ball_position.y));
        }
        else if(robotList[ind].position.rotation == 270) {
            dispatch(BallActions.ballKick(ball.ball_position.x - (block * cellSizeX), ball.ball_position.y));
        }
        else if(robotList[ind].position.rotation == 180) {
            dispatch(BallActions.ballKick(ball.ball_position.x, ball.ball_position.y + (block * cellSizeY)));
        }
        else if(robotList[ind].position.rotation == 0) {
            dispatch(BallActions.ballKick(ball.ball_position.x, ball.ball_position.y - (block * cellSizeY)));
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
        if(robotList[ind].position.rotation == 90) {
            dispatch(RobotActions.moveRobot(robotList[ind].position.x + (block * cellSizeX), robotList[ind].position.y, ind));
        }
        else if(robotList[ind].position.rotation == 270) {
            dispatch(RobotActions.moveRobot(robotList[ind].position.x - (block * cellSizeX), robotList[ind].position.y, ind));
        }
        else if(robotList[ind].position.rotation == 180) {
            dispatch(RobotActions.moveRobot(robotList[ind].position.x, robotList[ind].position.y + (block * cellSizeY), ind));
        }
        else if(robotList[ind].position.rotation == 0) {
            dispatch(RobotActions.moveRobot(robotList[ind].position.x, robotList[ind].position.y - (block * cellSizeY), ind));
        }
    };

    return {simpleWorkspace, generateCode}
}