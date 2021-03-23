import React, {useRef} from "react";
import {useInterval} from "../helper/useInterval";
import {useDispatch, useSelector} from "react-redux";
import RobotActions from "./RobotActions";
import BallActions from "./BallActions";

/**
 * Handles drawing the background of the field as well as the robot(s)
 *
 * @param grid_properties
 * @returns {*}
 * @constructor
 */
export const RoboCupField = ({grid_properties}) => {

    const dispatch = useDispatch();

    const { robotList } = useSelector(state => {
        return state.RobotReducer;
    });

    const { ball_position, ball_target } = useSelector(state => {
        return state.BallReducer;
    });

    const canvasRef = useRef(null);

    const field_color = 'green';
    const field_x = grid_properties.x;
    const field_y = grid_properties.y;
    const width = grid_properties.width;
    const height = grid_properties.height;

    /**
     * This draws the RoboCup field.
     * TODO: Field dimensions are not set correctly.
     * TODO: draw the white field lines
     * @param canvas
     * @param ctx
     */
    const init_field = (canvas, ctx) => {
        let field = new Path2D();
        ctx.fillStyle = field_color;
        field.moveTo(field_x, field_y);
        field.lineTo(field_x + width, field_y);
        field.lineTo(field_x + width, field_y + height);
        field.lineTo(field_x, field_y + height);
        field.lineTo(field_x, field_y);
        ctx.fill(field)

    };

    /**
     * Draws all robots at their current position.
     * @param canvas
     * @param ctx
     */
    const draw_robots = (canvas, ctx) => {
        robotList.forEach(element => {
            var robot_img = new Image();
            robot_img.src = process.env.PUBLIC_URL + '/robot-top.png';
            ctx.drawImage(robot_img, element.position.x, element.position.y)
        })
    };

    /**
     * Draws all robots at their current position.
     * @param canvas
     * @param ctx
     */
    const draw_ball = (canvas, ctx) => {
        if(ball_position) {
            var ball_img = new Image();
            ball_img.src = process.env.PUBLIC_URL + '/ball.png';
            ctx.drawImage(ball_img, ball_position.x, ball_position.y, canvas.width/10, canvas.width/10)
        }

    };

    /**
     * TODO: This is just a demo and needs some proper work!
     * This is the method that is called for every timestep of our simulation.
     * The method checks whether the current position of a robot requires updating (since a target position is set
     * but not reached) and handles the update. That position updating needs some proper logic, also taking the
     * time that has passed into consideration.
     */
    const draw_all = () => {

        robotList.forEach((element, idx) => {
                if (element.target) {
                    const delta_x = element.target.x - element.position.x;
                    const delta_y = element.target.y - element.position.y;
                    if (Math.abs(delta_x) > 10 || Math.abs(delta_y) > 10) {
                        const new_x = element.position.x + delta_x / 10.0;
                        const new_y = element.position.y + delta_y / 10.0;
                        dispatch(RobotActions.updateRobot(new_x, new_y, idx))
                    } else {
                        dispatch(RobotActions.updateRobot(null, null, idx))
                    }
                }
            }
        );

        //TODO: This is a dummy-implementation
        if(ball_target) {
            dispatch(BallActions.updateBall(ball_target.x,ball_target.y))
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width + 20, canvas.height + 20)

        //Draw field, robots and ball
        init_field(canvas, context);
        draw_robots(canvas, context);
        draw_ball(canvas, context);
    };

    /**
     * This re-draws the elements on the canvas every 200 ms
     */
    useInterval(() => draw_all(), 200);


    return <canvas ref={canvasRef} width={width + 20} height={height + 20} key={"robocupfield"}/>
}
