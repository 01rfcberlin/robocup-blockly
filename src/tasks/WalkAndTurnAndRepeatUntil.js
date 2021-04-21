import {Block, Field, Shadow, Value} from "../Blockly";
import RobotActions from "../robocup/RobotActions";
import {useDispatch} from "react-redux";
import BallActions from "../robocup/BallActions";
import Task from "./Task";

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
const Walk = ({task_properties}) => {
    const dispatch = useDispatch();

    // Resets the robot position on the field to the original position
    const reset = () => {
        dispatch(RobotActions.addRobot(
          task_properties.own_robot.position.x,
          task_properties.own_robot.position.y,
          task_properties.own_robot.position.rotation * 2*Math.PI/360,
            "left"
        ));
        dispatch(RobotActions.addRobot(
            task_properties.opponent_robot.position.x,
            task_properties.opponent_robot.position.y,
            task_properties.opponent_robot.position.rotation * 2*Math.PI/360,
            "right"
        ));
        dispatch(BallActions.setPosition(task_properties.ball.position.x,task_properties.ball.position.y));
    };

    return (
      <Task task_properties={task_properties} reset={reset}>
        <Block type="ball_kick"/>
        <Block type="move_one_block_ahead"/>
        <Block type="turn_right"/>
        <Block type="turn_left"/>
        <Block type="repeat"/>
        <Block type="repeat_until"/>
        <Block type="next_to_ball"/>
      </Task>
    );
};

export default Walk
