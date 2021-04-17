import React, {useRef} from "react";
import {useInterval} from "../helper/useInterval";
import {useDispatch, useSelector} from "react-redux";
import RobotActions from "./RobotActions";
import BallActions from "./BallActions";
import * as constants from "../constants.js";

/**
 * Handles drawing the background of the field as well as the robot(s)
 *
 * @param grid_properties
 * @returns {*}
 * @constructor
 */
export const RoboCupField = ({grid_properties}) => {
    const dispatch = useDispatch();

    const { robotListLeft, ball } = useSelector(state => {
        return state.gameState;
    });

    const canvasRef = useRef(null);


    /**
     * This draws the RoboCup field.
     * Field dimensions depends on canvas size
     * @param canvas
     * @param ctx
     */
    const init_field = (canvas, ctx) => {
        // let field = new Path2D();
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, constants.canvas_width, constants.canvas_height);

        // draw grid
        for (var i = 1; i <= 7; i++) {
            for (var j = 1; j <= 9; j++) {
                ctx.beginPath();
                ctx.fillStyle = ["rgba(0,255,0,0.3)", "rgba(0,255,0,0.1)"][(i + j) % 2];
                // -(0.5*constants.cell_height) moves the field up along the y-axis
                ctx.fillRect(j * constants.cell_width, i * constants.cell_height-(0.5*constants.cell_height), constants.cell_width, constants.cell_height);
                ctx.closePath();
            }
        }

        // draw border
        for (var i = 1; i < 11; i++) { 
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.fillRect(i * constants.cell_width, 0, constants.cell_width, constants.cell_height);
            ctx.fillRect(i * constants.cell_width, 7*constants.cell_height, constants.cell_width, constants.cell_height);
            ctx.closePath();       
        }

        // outer lines (9m * 6m)
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.rect(1*constants.cell_width, 1*constants.cell_height, 9*constants.cell_width, 6*constants.cell_height);
        
        // mid line
        ctx.moveTo(constants.canvas_width/2, 1*constants.cell_height);
        ctx.lineTo(constants.canvas_width/2, 7*constants.cell_height);

        // goal area
        // 5m area (1m * 3m)
        ctx.rect(1*constants.cell_width, constants.canvas_height/2-1.5*constants.cell_height, 1*constants.cell_width, 3*constants.cell_height);
        ctx.rect(10*constants.cell_width-1*constants.cell_width, constants.canvas_height/2-1.5*constants.cell_height, 1*constants.cell_width, 3*constants.cell_height);
        // 16m area (2m * 5m)
        ctx.rect(1*constants.cell_width, constants.canvas_height/2-2.5*constants.cell_height, 2*constants.cell_width, 5*constants.cell_height);
        ctx.rect(10*constants.cell_width-2*constants.cell_width, constants.canvas_height/2-2.5*constants.cell_height, 2*constants.cell_width, 5*constants.cell_height);
        ctx.stroke();
        ctx.closePath();
        
        // penalty point
        // left side
        ctx.beginPath();
        ctx.arc(1*constants.cell_width+1.5*constants.cell_width, constants.canvas_height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // right side
        ctx.beginPath();
        ctx.arc(10*constants.cell_width-1.5*constants.cell_width, constants.canvas_height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // ctx.moveTo
        // mid circle (dimension based on constants.cell_width)
        ctx.beginPath();
        ctx.arc(constants.canvas_width/2, constants.canvas_height/2, 0.75*constants.cell_width, 0, 2*Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        // mid point
        ctx.beginPath();
        ctx.arc(constants.canvas_width/2, constants.canvas_height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // goals
        ctx.beginPath();
        ctx.rect(1*constants.cell_width-0.6*constants.cell_width, constants.canvas_height/2-1.3*constants.cell_height, 0.6*constants.cell_width, 2.6*constants.cell_height);
        ctx.rect(10*constants.cell_width, constants.canvas_height/2-1.3*constants.cell_height, 0.6*constants.cell_width, 2.6*constants.cell_height);
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.closePath();

    };

    // with angle == 0, this function is equivalent to:
    // ctx.drawImage(img, x, y, w, h);
    const drawRotatedImage = (ctx, img, angle, x, y, w, h) => {
      const center_x = x + w/2;
      const center_y = y + w/2;

      // move origin to center of image
      ctx.translate(center_x, center_y);

      ctx.rotate(angle);

      // draw image centered around (0,0)
      ctx.drawImage(img, -w/2, -h/2, w, h);

      ctx.rotate(-angle);

      // move back to original origin
      ctx.translate(-center_x, -center_y);
    };

    /**
     * Draws all robots at their current position.
     * @param canvas
     * @param ctx
     */
    const draw_robots = (canvas, ctx) => {
        robotListLeft.forEach(element => {
            var robot_img = new Image();
            robot_img.src = process.env.PUBLIC_URL + '/robot-top.png';
            drawRotatedImage(ctx,
              robot_img,
              2*Math.PI/360 * element.position.rotation,
              element.position.x+constants.robot_width/2,
              element.position.y-constants.robot_height/2,
              constants.robot_width,
              constants.robot_height)
        })
    };

    /**
     * Draws all robots at their current position.
     * @param canvas
     * @param ctx
     */
    const draw_ball = (canvas, ctx) => {
        if(ball.position) {
            var ball_img = new Image();
            ball_img.src = process.env.PUBLIC_URL + '/ball.png';
            // -(0.5*constants.cell_height) we need to move the ball up according to the field
            ctx.drawImage(ball_img, ball.position.x, ball.position.y-(0.5*constants.cell_height), constants.ball_width, constants.ball_height)
        }

    };

    /**
     * This is the method that is called for every timestep of our simulation.
     * The method checks whether the current position of a robot requires updating (since a target position is set
     * but not reached) and handles the update.
     */
    const draw_interval = 20;
    const draw_all = () => {
        if (canvasRef.current === null) return;

        robotListLeft.forEach((element, idx) => {
            if (!element.target) return;

            const reached_target_position = !element.target.x || (element.target.x == element.position.x && element.target.y == element.position.y);
            const reached_target_rotation = element.target.rotation == element.position.rotation;

            if (reached_target_position && reached_target_rotation) return;

            if(!reached_target_position) {
                // Assumption: We either move left/right or top/bottom. We never move
                // in both directions at the same time. Or put differently,
                // element.target and element.position only differ in at most one
                // component.
                console.assert(element.target.x == element.position.x || element.target.y == element.position.y);


                const delta_x = element.target.x - element.position.x;
                const delta_y = element.target.y - element.position.y;

                const delta_vec_length = Math.sqrt(delta_x ** 2 + delta_y ** 2);
                const normalized_delta_vec_x = delta_x / delta_vec_length;
                const normalized_delta_vec_y = delta_y / delta_vec_length;

                const movement_speed = draw_interval / 20;
                const movement_vec_x = normalized_delta_vec_x * movement_speed;
                const movement_vec_y = normalized_delta_vec_y * movement_speed;

                let new_x = element.position.x + movement_vec_x;
                let new_y = element.position.y + movement_vec_y;

                // Avoid overshooting: Since we know that we only go along one
                // coordinate, we can just set the position to the target.
                const would_overshoot =
                    element.target.x > element.position.x && new_x > element.target.x
                    || element.target.x < element.position.x && new_x < element.target.x
                    || element.target.y > element.position.y && new_y > element.target.y
                    || element.target.y < element.position.y && new_y < element.target.y;
                if (would_overshoot) {
                    new_x = element.target.x;
                    new_y = element.target.y;
                }

                dispatch(RobotActions.updateRobot(new_x, new_y, element.position.rotation, idx));
            }
            if(!reached_target_rotation) {
                if(element.target.rotation >= 0 ) {
                    dispatch(RobotActions.updateRobot(element.position.x, element.position.y, element.position.rotation + 5, idx));
                }
                else {
                    dispatch(RobotActions.updateRobot(element.position.x, element.position.y, element.position.rotation - 5, idx));
                }
            }
        });

        //TODO: This is a dummy-implementation
        if(ball.target) {
            dispatch(BallActions.updateBall(ball.target.x,ball.target.y))
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, constants.canvas_width, constants.canvas_height)

        //Draw field, robots and ball
        init_field(canvas, context);
        draw_ball(canvas, context); //ball needs to be drawn first, otherwise the ball potentially covers the robot

        draw_robots(canvas, context);
    };

    /**
     * This re-draws the elements on the canvas every 200 ms
     */
    useInterval(() => draw_all(), draw_interval);

    return <canvas ref={canvasRef} width={constants.canvas_width} height={constants.canvas_height} key={"robocupfield"}/>
}
