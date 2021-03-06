import React, {useEffect, useRef} from "react";
import {useInterval} from "../helper/useInterval";

export const RoboCupField = ({grid_properties, gameState, dispatch}) => {

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
        gameState.robotList.forEach(element => {
            var robot_img = new Image();
            robot_img.src = process.env.PUBLIC_URL + '/robot-top.png';
            ctx.drawImage(robot_img, element.x, element.y)
        })
    };

    /**
     * TODO: This is just a demo and needs some proper work!
     * This is the method that is called for every timestep of our simulation.
     * The method checks whether the current position of a robot requires updating (since a target position is set
     * but not reached) and handles the update. That position updating needs some proper logic, also taking the
     * time that has passed into consideration.
     */
    const draw_all = () => {

        gameState.robotList.forEach((element, idx) => {
                if (element.tx) {
                    const delta_x = element.tx - element.x;
                    const delta_y = element.ty - element.y;
                    if (Math.abs(delta_x) > 10 || Math.abs(delta_y) > 10) {
                        const new_x = element.x + delta_x / 10.0;
                        dispatch({
                            type: "updateRobotPosition",
                            index: idx,
                            position: {
                                x: new_x,
                                y: element.y + delta_y / 10.0
                            }
                        })
                    } else {
                        dispatch({
                            type: "setRobotTarget",
                            index: idx,
                            target: {
                                x: null,
                                y: null
                            }
                        })
                    }
                }
            }
        );


        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width + 20, canvas.height + 20)

        //Draw field and robots
        init_field(canvas, context);
        draw_robots(canvas, context);
    };

    /**
     * This re-draws the elements on the canvas every 200 ms
     */
    useInterval(() => draw_all(), 200);


    return <canvas ref={canvasRef} width={width + 20} height={height + 20} key={"robocupfield"}/>
}
