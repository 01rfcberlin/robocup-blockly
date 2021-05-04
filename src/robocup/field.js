import React, {useRef} from "react";
import {useInterval} from "../helper/useInterval";
import {useDispatch, useSelector} from "react-redux";
import RobotActions from "./RobotActions";
import BallActions from "./BallActions";
import * as constants from "../constants.js";
import * as angles from "./angles";
import * as canvas from "./canvas";
import Alert from "react-bootstrap/Alert";
import InterfaceActions from "./InterfaceActions";

/**
 * Handles drawing the background of the field as well as the robot(s)
 *
 * @param grid_properties
 * @returns {*}
 * @constructor
 */
export const RoboCupField = ({grid_properties}) => {
    const dispatch = useDispatch();

    const { robotListLeft, robotListRight, ball, toggleGoalAlert, toggleOwnGoalAlert, toggleOutOfBoundsAlert } = useSelector(state => {
        return state.gameState;
    });

    const canvasRef = useRef(null);


    /**
     * This draws the RoboCup field.
     * Field dimensions depends on canvas size
     */
    const init_field = (ctx) => {
        // let field = new Path2D();
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, constants.canvas.width, constants.canvas.height);

        // draw grid
        for (let i = 1; i <= 7; i++) {
            for (let j = 1; j <= 9; j++) {
                ctx.beginPath();
                ctx.fillStyle = ["rgba(0,255,0,0.3)", "rgba(0,255,0,0.1)"][(i + j) % 2];
                // -(0.5*constants.cell.height) moves the field up along the y-axis
                ctx.fillRect(j * constants.cell.width, i * constants.cell.height-(0.5*constants.cell.height), constants.cell.width, constants.cell.height);
                ctx.closePath();
            }
        }

        // draw border
        for (let i = 1; i < 11; i++) { 
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.fillRect(i * constants.cell.width, 0, constants.cell.width, constants.cell.height);
            ctx.fillRect(i * constants.cell.width, 7*constants.cell.height, constants.cell.width, constants.cell.height);
            ctx.closePath();       
        }

        // outer lines (9m * 6m)
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.rect(1*constants.cell.width, 1*constants.cell.height, 9*constants.cell.width, 6*constants.cell.height);
        
        // mid line
        ctx.moveTo(constants.canvas.width/2, 1*constants.cell.height);
        ctx.lineTo(constants.canvas.width/2, 7*constants.cell.height);

        // goal area
        // 5m area (1m * 3m)
        ctx.rect(1*constants.cell.width, constants.canvas.height/2-1.5*constants.cell.height, 1*constants.cell.width, 3*constants.cell.height);
        ctx.rect(10*constants.cell.width-1*constants.cell.width, constants.canvas.height/2-1.5*constants.cell.height, 1*constants.cell.width, 3*constants.cell.height);
        // 16m area (2m * 5m)
        ctx.rect(1*constants.cell.width, constants.canvas.height/2-2.5*constants.cell.height, 2*constants.cell.width, 5*constants.cell.height);
        ctx.rect(10*constants.cell.width-2*constants.cell.width, constants.canvas.height/2-2.5*constants.cell.height, 2*constants.cell.width, 5*constants.cell.height);
        ctx.stroke();
        ctx.closePath();
        
        // penalty point
        // left side
        ctx.beginPath();
        ctx.arc(1*constants.cell.width+1.5*constants.cell.width, constants.canvas.height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        // right side
        ctx.beginPath();
        ctx.arc(10*constants.cell.width-1.5*constants.cell.width, constants.canvas.height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // ctx.moveTo
        // mid circle (dimension based on constants.cell.width)
        ctx.beginPath();
        ctx.arc(constants.canvas.width/2, constants.canvas.height/2, 0.75*constants.cell.width, 0, 2*Math.PI, false);
        ctx.stroke();
        ctx.closePath();
        // mid point
        ctx.beginPath();
        ctx.arc(constants.canvas.width/2, constants.canvas.height/2, 2, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // goals
        ctx.beginPath();
        ctx.rect(1*constants.cell.width-0.6*constants.cell.width, constants.canvas.height/2-1.3*constants.cell.height, 0.6*constants.cell.width, 2.6*constants.cell.height);
        ctx.rect(10*constants.cell.width, constants.canvas.height/2-1.3*constants.cell.height, 0.6*constants.cell.width, 2.6*constants.cell.height);
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.closePath();

    };

    const drawDebugCellCoords = (ctx) => {
        for (let x = 0; x <= 10; x++) {
            for (let y = 0; y <= 8; y++) {
                ctx.strokeStyle = 'black';
                ctx.strokeRect(x * constants.cell.width, y * constants.cell.height-(0.5*constants.cell.height), constants.cell.width, constants.cell.height);

                ctx.fillStyle = 'black';
                ctx.font = 'bold 17px serif';
                const margin = 2;
                ctx.fillText("(" + x + "," + y + ")", x * constants.cell.width + margin, y * constants.cell.height);
            }
        }
    };

    // Draws all robots at their current position.
    const draw_robots = (ctx) => {
        robotListLeft.forEach(element => {
            let robot_img = new Image();
            robot_img.src = process.env.PUBLIC_URL + '/robot-top.png';
            // the position of the Redux state is the center of the robot
            canvas.drawRotatedCenteredImage(ctx, robot_img,
              element.position.rotation,
              element.position,
              constants.robot)
        });
        robotListRight.forEach(element => {
            let robot_img = new Image();
            robot_img.src = process.env.PUBLIC_URL + '/wolfgang.png';
            canvas.drawRotatedCenteredImage(ctx, robot_img,
                element.position.rotation,
                element.position,
                constants.robot)
        })
    };

    // Draws all robots at their current position.
    const draw_ball = (ctx) => {
        if(ball.position) {
            let ball_img = new Image();
            ball_img.src = process.env.PUBLIC_URL + '/ball.png';
            // -(0.5*constants.cell.height) we need to move the ball up according to the field
            canvas.drawCenteredImage(ctx, ball_img,
              ball.position,
              constants.ball)
        }

    };

    /**
     * This is the method that is called for every timestep of our simulation.
     * The method checks whether the current position of a robot requires updating (since a target position is set
     * but not reached) and handles the update.
     */
    const draw_all = () => {
        // TODO This should have NEVER happened if we used React correctly :/
        if (canvasRef.current === null) return;

        robotListLeft.forEach((element, idx) => {
            // The following code is about reaching the target. But if there is
            // not target, this code should be skipped.
            if (!element.target) return;

            // If we reached the final state, there is no need to move the robot.
            if (!element.isActive) return;

            if (element.isActiveDueToMoving) {
                // Assumption: We either move left/right or top/bottom. We never move
                // in both directions at the same time. Or put differently,
                // element.target and element.position only differ in at most one
                // component.
                console.assert(element.target.x === element.position.x || element.target.y === element.position.y);

                const delta_x = element.target.x - element.position.x;
                const delta_y = element.target.y - element.position.y;

                const delta_vec_length = Math.sqrt(delta_x ** 2 + delta_y ** 2);
                const normalized_delta_vec_x = delta_x / delta_vec_length;
                const normalized_delta_vec_y = delta_y / delta_vec_length;

                const movement_vec_x = normalized_delta_vec_x * constants.robot_movement_per_draw_all;
                const movement_vec_y = normalized_delta_vec_y * constants.robot_movement_per_draw_all;

                let new_x = element.position.x + movement_vec_x;
                let new_y = element.position.y + movement_vec_y;

                // Avoid overshooting: Since we know that we only go along one
                // coordinate, we can just set the position to the target.
                const would_overshoot =
                    (element.target.x > element.position.x && new_x > element.target.x)
                    || (element.target.x < element.position.x && new_x < element.target.x)
                    || (element.target.y > element.position.y && new_y > element.target.y)
                    || (element.target.y < element.position.y && new_y < element.target.y);
                if (would_overshoot) {
                    new_x = element.target.x;
                    new_y = element.target.y;
                }

                dispatch(RobotActions.setPosition(new_x, new_y, element.position.rotation, idx));
            }

            if (element.isActiveDueToRotating) {
              const direction = Math.sign(angles.angle_signed_smallest_difference(element.position.rotation, element.target.rotation));
              const new_angle = element.position.rotation + direction * constants.robot_rotation_per_draw_all;
              const new_direction = Math.sign(angles.angle_signed_smallest_difference(new_angle, element.target.rotation));
              const would_overshoot = direction !== new_direction;

              if (would_overshoot) {
                dispatch(RobotActions.setPosition(element.position.x, element.position.y, element.target.rotation, idx));
              } else {
                dispatch(RobotActions.setPosition(element.position.x, element.position.y, new_angle, idx));
              }
            }
        });

        // Had to do a check if ball.position is already set
        if(ball.target && !Number.isNaN(ball.position.x) && !Number.isNaN(ball.position.y)) {

            // If the ball does not move, set the target to the same spot
            if (ball.target.x === ball.position.x && ball.target.y === ball.position.y) {
                dispatch(BallActions.setPosition(ball.target.x, ball.target.y))
            } else {

                // Assumption: We either kick left/right or top/bottom. We never kick
                // in both directions at the same time. Or put differently,
                // ball.target and ball.position only differ in at most one
                // component.
                console.assert(ball.target.x !== ball.position.x || ball.target.y !== ball.position.y);

                const delta_x = ball.target.x - ball.position.x;
                const delta_y = ball.target.y - ball.position.y;

                const delta_vec_length = Math.sqrt(delta_x ** 2 + delta_y ** 2);
                const normalized_delta_vec_x = delta_x / delta_vec_length;
                const normalized_delta_vec_y = delta_y / delta_vec_length;

                const movement_vec_x = normalized_delta_vec_x * constants.ball_movement_per_draw_all;
                const movement_vec_y = normalized_delta_vec_y * constants.ball_movement_per_draw_all;

                let new_ball_x = ball.position.x + movement_vec_x;
                let new_ball_y = ball.position.y + movement_vec_y;

                // Avoid overshooting: Since we know that we only go along one
                // coordinate, we can just set the position to the target.
                const ball_would_overshoot = 
                    (ball.target.x > ball.position.x && new_ball_x > ball.target.x)
                    || (ball.target.x < ball.position.x && new_ball_x < ball.target.x)
                    || (ball.target.y > ball.position.y && new_ball_y > ball.target.y)
                    || (ball.target.y < ball.position.y && new_ball_y < ball.target.y);
                if (ball_would_overshoot) {
                    new_ball_x = ball.target.x;
                    new_ball_y = ball.target.y;
                }

            dispatch(BallActions.setPosition(new_ball_x, new_ball_y))
            }

        }

        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, constants.canvas.width, constants.canvas.height)

        //Draw field, robots and ball
        init_field(context);
        draw_ball(context); //ball needs to be drawn first, otherwise the ball potentially covers the robot

        draw_robots(context);

        if (constants.debugDrawCellCoords) {
          drawDebugCellCoords(context);
        }
    };

    /**
     * This re-draws the elements on the canvas every 200 ms
     */
    // TODO: I think this should be a useEffect on the Redux state and not useInterval!
    useInterval(() => draw_all(), constants.draw_all_interval);

    return (
        <div>
            {toggleGoalAlert && !ball.isMoving &&
            <Alert variant={'success'} style={{position: "absolute", zIndex:10}} onClose={() => dispatch(InterfaceActions.toggleGoalAlert(false))} dismissible>
                <Alert.Heading>Toooooor!</Alert.Heading>
                <p>Sehr gut, du hast die Aufgabe gelöst. Jetzt kannst du weiter mit der nächsten Aufgabe machen.</p>
            </Alert>
            }
            {toggleOwnGoalAlert && !ball.isMoving &&
            <Alert variant={'warning'} style={{position: "absolute", zIndex:10}} onClose={() => dispatch(InterfaceActions.toggleOwnGoalAlert(false))} dismissible>
                <Alert.Heading>Eigentor!</Alert.Heading>
                <p>Um das Spiel zu gewinnen, solltest du lieber auf das andere Tor schießen :D</p>
            </Alert>
            }
            {toggleOutOfBoundsAlert &&
            <Alert variant={'warning'} style={{position: "absolute", zIndex:10}} >
                <Alert.Heading>Roboter hat das Spielfeld verlassen!</Alert.Heading>
                <p>Du soltest lieber mit deinem Roboter im Spielfeld bleiben :D</p>
            </Alert>
            }
            <canvas id="playingField" ref={canvasRef} width={constants.canvas.width} height={constants.canvas.height} key={"robocupfield"}/>
        </div>
    )
}
