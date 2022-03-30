// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import * as Blockly from 'blockly/core';
import 'blockly/javascript';

/**
 * Calls the addRobot(pos_x, pos_y) function.
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['robot_add'] = function(block) {
    var value_pos_x = Blockly.JavaScript.valueToCode(block, 'init_x', Blockly.JavaScript.ORDER_ATOMIC);
    var value_pos_y = Blockly.JavaScript.valueToCode(block, 'init_y', Blockly.JavaScript.ORDER_ATOMIC);
    return 'addRobot(' + value_pos_x + ', ' + value_pos_y + ');';
};

/**
 * Calls the setRobotTargetPosition(pos_x, pos_y, ind) function
 * TODO: Robot index right now is hard-coded so it is always 0
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['robot_move'] = function(block) {
    var value_pos_x = Blockly.JavaScript.valueToCode(block, 'pos_x', Blockly.JavaScript.ORDER_ATOMIC);
    var value_pos_y = Blockly.JavaScript.valueToCode(block, 'pos_y', Blockly.JavaScript.ORDER_ATOMIC);
    return 'setRobotTargetPosition(' + value_pos_x + ', ' + value_pos_y + ', 0, "left");';
};

/**
 * Calls the ballKick function
 * @param block
 * @returns {string}
 */
 Blockly.JavaScript['ball_kick'] = function(block) {
    return 'ballKick(3, 0, "left");';
};

/**
 * Calls the addRobotTargetRotation(90, ind) function
 * TODO: Robot index right now is hard-coded so it is always 0
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['turn_right'] = function(block) {
    return 'addRobotTargetRotation(Math.PI/2, 0, "left");';
};

/**
 * Calls the addRobotTargetRotation(-90, ind) function
 * TODO: Robot index right now is hard-coded so it is always 0
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['turn_left'] = function(block) {
    return 'addRobotTargetRotation(-Math.PI/2, 0, "left");';
};

/**
 * Calls the moveForward(1, ind) function to move the robot one block forward
 * TODO: Robot index right now is hard-coded so it is always 0
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['move_one_block_ahead'] = function(block) {
    return 'moveForward(1, 0, "left");';
};

/**
 * Calls the moveForward(1, ind) function to move the robot one block forward
 * TODO: Robot index right now is hard-coded so it is always 0
 * @param block
 * @returns {string}
 */
 Blockly.JavaScript['start_block'] = function(block) {
     return 'startBlock();';
};

/**
 * Custom code that create a for-loop
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['repeat'] = function(block) {
    var number_in = block.getFieldValue('times');
    var body = Blockly.JavaScript.statementToCode(block, 'body');
    const variable_name = randomNameGenerator();
    return 'for(var ' + variable_name + ' = 0; ' + variable_name + ' < ' + number_in + '; ' + variable_name + '++){' + body + '}';
};

/**
 * Custom code for a repeat-until loop
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['repeat_until'] = function(block) {
    var boolean_in = Blockly.JavaScript.valueToCode(block, 'sensor_in', Blockly.JavaScript.ORDER_ATOMIC);
    var body = Blockly.JavaScript.statementToCode(block, 'body');

    const noConditionDefined = boolean_in === '';
    if (noConditionDefined) {
      // do nothing
      return '';
    }

    return 'while (!(' + boolean_in + ')) {' + body + '};';
};

/**
 * Custom code for an if statement
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['if'] = function(block) {
    var boolean_in = Blockly.JavaScript.valueToCode(block, 'sensor_in', Blockly.JavaScript.ORDER_ATOMIC);
    var body = Blockly.JavaScript.statementToCode(block, 'body');

    const noConditionDefined = boolean_in === '';
    if (noConditionDefined) {
      // do nothing
      return '';
    }

    return 'if (' + boolean_in + ') { '+ body + ' }';
};

/**
 * Custom code that checks whether the robot is next to the ball
 * @param block
 * @returns {string}
 */
Blockly.JavaScript['next_to_ball'] = function(block) {
    return ['nextToBall(0, "left")', Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['is_robot_above_goal'] = function(block) {
    return ['isRobotAboveGoal(0, "left")', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['is_robot_beneath_goal'] = function(block) {
    return ['isRobotBeneathGoal(0, "left")', Blockly.JavaScript.ORDER_ATOMIC];
};
Blockly.JavaScript['is_robot_centered_to_goal'] = function(block) {
    return ['isRobotCenteredToGoal(0, "left")', Blockly.JavaScript.ORDER_ATOMIC];
};

/**
 * Just do nothing
 * TODO: Robot index right now is hard-coded so it is always 0
 * @param block
 * @returns {string}
 */
 Blockly.JavaScript['wait'] = function(block) {
    return 'waitBlock("left");';
};

const randomNameGenerator = () => {
    let res = '';
    for(let i = 0; i < 5; i++){
        // important: here we only want to generate characters from a to z
        const random = Math.floor(Math.random() * 26);
        res += String.fromCharCode(97 + random);
    };
    return res;
};
