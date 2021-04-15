/**
 * @license
 * 
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks


import * as Blockly from 'blockly/core';

/**
 * Block that handles adding a robot.
 * Requires two numeric input for x and y position
 * @type {{init: Blockly.Blocks.robot_add.init}}
 */
Blockly.Blocks['robot_add'] = {
  init: function() {
    this.jsonInit({
      "message0": 'add robot x = %1 y = %2',
      "colour": 160,
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Adds a new robot to the field",
      "args0": [
        {
          "type": "input_value",
          "name": "init_x",
          "check": "Number",
          "align": "RIGHT"
        },
        {
          "type": "input_value",
          "name": "init_y",
          "check": "Number",
          "align": "RIGHT"
        }
      ],
    });
  }
};

/**
 * Block that handles moving a robot.
 * Requires two numeric input for x and y target position
 * @type {{init: Blockly.Blocks.robot_move.init}}
 */
Blockly.Blocks['robot_move'] = {
  init: function() {
    this.jsonInit({
      "message0": 'move robot x = %1 y = %2',
      "colour": 160,
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Moves a robot on the field",
      "args0": [
        {
          "type": "input_value",
          "name": "pos_x",
          "check": "Number",
          "align": "RIGHT"
        },
        {
          "type": "input_value",
          "name": "pos_y",
          "check": "Number",
          "align": "RIGHT"
        }
      ],
    });
  }
};


/**
 * Block that handles moving a robot exactly one block straight ahead
 * @type {{init: Blockly.Blocks.move_one_block_ahead.init}}
 */
Blockly.Blocks['move_one_block_ahead'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Gehe einen Schritt vor',
      "colour": 160,
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Der Roboter läuft einen Schritt geradeaus (also in die Richtung, in die er schaut).",
    });
  }
};

/**
 * Block that handles turning the robot 90 degrees to the right
 * @type {{init: Blockly.Blocks.turn_right.init}}
 */
Blockly.Blocks['turn_right'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Drehe nach rechts',
      "colour": 160,
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Der Roboter dreht sich nach rechts.",
    });
  }
};

/**
 * Block that handles turning the robot 90 degrees to the right
 * @type {{init: Blockly.Blocks.turn_right.init}}
 */
Blockly.Blocks['turn_left'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Drehe nach links',
      "colour": 160,
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Der Roboter dreht sich nach links.",
    });
  }
};

