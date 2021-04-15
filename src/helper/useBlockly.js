import BlocklyJS from "blockly/javascript";
import * as React from "react";
import {useDispatch, useSelector} from "react-redux";
import RobotActions from "../robocup/RobotActions";
import BallActions from "../robocup/BallActions";
import * as constants from "../constants.js";

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

    /**
     * Blockly-method to generate the code from the current workspace, print it to console (just for debugging)
     * and then executing the code.
     */
    const generateCode = () => {
        var code = BlocklyJS.workspaceToCode(
            simpleWorkspace.current.workspace
        );
        //console.log(code);
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
        dispatch(RobotActions.turnRobot(robotList[ind].position.rotation + deg, ind));
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

        if(robotList[ind].position.rotation == 90) {
            dispatch(RobotActions.moveRobot(robotList[ind].position.x + (block * constants.cell_width), robotList[ind].position.y, ind));
        }
        else if(robotList[ind].position.rotation == 270) {
            dispatch(RobotActions.moveRobot(robotList[ind].position.x - (block * constants.cell_width), robotList[ind].position.y, ind));
        }
        else if(robotList[ind].position.rotation == 180) {
            dispatch(RobotActions.moveRobot(robotList[ind].position.x, robotList[ind].position.y + (block * constants.cell_height), ind));
        }
        else if(robotList[ind].position.rotation == 0) {
            dispatch(RobotActions.moveRobot(robotList[ind].position.x, robotList[ind].position.y - (block * constants.cell_height), ind));
        }
        if(ballCellX == robotCellX && ballCellY == robotCellY) {
            ballKick(1, 0);       
        }
    };

    return {simpleWorkspace, generateCode}
}
