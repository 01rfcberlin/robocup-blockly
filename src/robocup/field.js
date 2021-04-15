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

    const lineMetersX = ( width / 11 );
    const lineMetersY = ( height / 8 );

    // robotSize: width 0.5 meter
    const robotSize = 0.5;

    // ballsize: FIFA Size 1 (130mm) times 2.5
    const ballSize = 0.325;

    /**
     * This draws the RoboCup field.
     * Field dimensions depends on canvas size
     * @param canvas
     * @param ctx
     */
    const init_field = (canvas, ctx) => {
        // let field = new Path2D();
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, width, height);

        // draw grid
        for (var i = 1; i <= 7; i++) {
            for (var j = 1; j <= 9; j++) {
                ctx.beginPath();
                ctx.fillStyle = ["rgba(0,255,0,0.3)", "rgba(0,255,0,0.1)"][(i + j) % 2];
                // -(0.5*lineMetersY) moves the field up along the y-axis
                ctx.fillRect(j * lineMetersX, i * lineMetersY-(0.5*lineMetersY), lineMetersX, lineMetersY);
                ctx.closePath();
            }
        }

        // draw border
        for (var i = 1; i < 11; i++) { 
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.fillRect(i * lineMetersX, 0, lineMetersX, lineMetersY);
            ctx.fillRect(i * lineMetersX, 7*lineMetersY, lineMetersX, lineMetersY);
            ctx.closePath();       
        }

        // outer lines (9m * 6m)
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.rect(1*lineMetersX, 1*lineMetersY, 9*lineMetersX, 6*lineMetersY);
        
        // mid line
        ctx.moveTo(width/2, 1*lineMetersY);
        ctx.lineTo(width/2, 7*lineMetersY);

        // goal area
        // 5m area (1m * 3m)
        ctx.rect(1*lineMetersX, height/2-1.5*lineMetersY, 1*lineMetersX, 3*lineMetersY);
        ctx.rect(10*lineMetersX-1*lineMetersX, height/2-1.5*lineMetersY, 1*lineMetersX, 3*lineMetersY);
        // 16m area (2m * 5m)
        ctx.rect(1*lineMetersX, height/2-2.5*lineMetersY, 2*lineMetersX, 5*lineMetersY);
        ctx.rect(10*lineMetersX-2*lineMetersX, height/2-2.5*lineMetersY, 2*lineMetersX, 5*lineMetersY);
        ctx.stroke();
        ctx.closePath();
        
        // penalty point
        // left side
        ctx.beginPath();
        ctx.arc(1*lineMetersX+1.5*lineMetersX, height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // right side
        ctx.beginPath();
        ctx.arc(10*lineMetersX-1.5*lineMetersX, height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // ctx.moveTo
        // mid circle (dimension based on lineMetersX)
        ctx.beginPath();
        ctx.arc(width/2, height/2, 0.75*lineMetersX, 0, 2*Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        // mid point
        ctx.beginPath();
        ctx.arc(width/2, height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // goals
        ctx.beginPath();
        ctx.rect(1*lineMetersX-0.6*lineMetersX, height/2-1.3*lineMetersY, 0.6*lineMetersX, 2.6*lineMetersY);
        ctx.rect(10*lineMetersX, height/2-1.3*lineMetersY, 0.6*lineMetersX, 2.6*lineMetersY);
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
        robotList.forEach(element => {
            var robot_img = new Image();
            robot_img.src = process.env.PUBLIC_URL + '/robot-top.png';
            var cellX = Math.floor(element.position.x/lineMetersX);
            var cellY = Math.floor(element.position.y/lineMetersY);
            console.log(cellX, cellY);
            drawRotatedImage(ctx, robot_img, 2*Math.PI/360 * element.position.rotation, cellX*lineMetersX+robotSize/2*lineMetersX, cellY*lineMetersY-robotSize/2*lineMetersY, robotSize*lineMetersX, robotSize*lineMetersY)
            // ctx.drawImage(robot_img, element.position.x, element.position.y, 0.5*lineMetersX, 0.5*lineMetersY)
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
            // -(0.5*lineMetersY) we need to move the ball up according to the field
            ctx.drawImage(ball_img, ball_position.x, ball_position.y-(0.5*lineMetersY), ballSize*lineMetersX, ballSize*lineMetersY)
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
        if (canvasRef.current === null) return;

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
        draw_ball(canvas, context); //ball needs to be drawn first, otherwise the ball potentially covers the robot

        draw_robots(canvas, context);
    };

    /**
     * This re-draws the elements on the canvas every 200 ms
     */
    useInterval(() => draw_all(), 200);


    return <canvas ref={canvasRef} width={width + 20} height={height + 20} key={"robocupfield"}/>
}
