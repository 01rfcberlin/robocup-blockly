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
 * Block that handles a kick.
 * @type {{init: Blockly.Blocks.robot_add.init}}
 */
 Blockly.Blocks['ball_kick'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Ball schießen',
      "colour": "#A400AC",
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Der Roboter schießt den Ball 3 Felder vorwärts",
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
      "colour": "#A400AC",
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
      "colour": "#A400AC",
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Der Roboter dreht sich nach rechts.",
    });
  }
};

/**
 * Block that handles turning the robot 90 degrees to the right
 * @type {{init: Blockly.Blocks.turn_left.init}}
 */
Blockly.Blocks['turn_left'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Drehe nach links',
      "colour": "#A400AC",
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Der Roboter dreht sich nach links.",
    });
  }
};

/**
 * Starting Block - does nothing
 * @type {{init: Blockly.Blocks.start_block.init}}
 */
 Blockly.Blocks['start_block'] = {
    init: function() {
      this.jsonInit({
        "message0": 'Start:',
        "colour": "#79B473",
        "nextStatement": null,
        "tooltip": "Start Block",
      });
      this.setDeletable(false);
      // this does not work?!?!?!?!
      this.setMovable(false);
    }
  };
  
/*
 * Custom block for repeat x times
 * @type {{init: Blockly.Blocks.turn_right.init}}
 */
Blockly.Blocks['repeat'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Wiederhole %1 Mal',
      "args0": [{
        "type": "field_number",
        "name": "times",
        "min": 0,
        "precision": 1
      }],
      "message1": "Aktion %1",
      "args1": [{
        "type": "input_statement",
        "name": "body"
      }],
      "colour": "#41658A",
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Mit diesem Block kannst du dafür sorgen, dass der Roboter eine Aktion genau so oft ausführt, wie du oben im Block einträgst",
    });
  }
};

/**
 * Custom block for repeat x times
 * @type {{init: Blockly.Blocks.turn_right.init}}
 */
Blockly.Blocks['repeat_until'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Wiederhole solange bis %1',
      "args0": [{
        "type": "input_value",
        "name": "sensor_in",
        "check": "Boolean"
      }],
      "message1": "Aktion: %1",
      "args1": [{
        "type": "input_statement",
        "name": "body"
      }],
      "colour": "#41658A",
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Mit diesem Block kannst du dafür sorgen, dass der Roboter eine Aktion genau so oft ausführt, bis eine bestimmte Bedingung erfüllt ist",
    });
  }
};

/**
 * Custom if block
 */
Blockly.Blocks['if'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Wenn %1',
      "args0": [{
        "type": "input_value",
        "name": "sensor_in",
        "check": "Boolean"
      }],
      "message1": "Aktion: %1",
      "args1": [{
        "type": "input_statement",
        "name": "body"
      }],
      "colour": "#41658A",
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Mit diesem Block kannst du dafür sorgen, dass der Roboter eine Aktion nur ausführt, wenn eine bestimmte Bedingung erfüllt ist",
    });
  }
};

/**
 * Custom block for robot not next to ball
 * @type {{init: Blockly.Blocks.turn_right.init}}
 */
Blockly.Blocks['next_to_ball'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Roboter am Ball',
      "output": null,
      "type": Boolean,
      "colour": "#93a832",
      "tooltip": "Dieser Block sagt euch, ob der Roboter den Ball bereits erreicht hat",
    });
  }
};

/**
 * Custom block for checking alignment of the robot with the opponent goal.
 *
 * We compare the y coordinate of the robot and the goal and check if the robot
 * is to the left or right of the goal - or if the goal is in front or behind
 * the robot.
 */
Blockly.Blocks['is_robot_above_goal'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Roboter ist über dem Tor',
      "output": null,
      "type": Boolean,
      "colour": "#93a832",
      "tooltip": "TODO",
    });
  }
};
Blockly.Blocks['is_robot_beneath_goal'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Roboter ist unter dem Tor',
      "output": null,
      "type": Boolean,
      "colour": "#93a832",
      "tooltip": "TODO",
    });
  }
};
Blockly.Blocks['is_robot_centered_to_goal'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Roboter ist mittig zum Tor',
      "output": null,
      "type": Boolean,
      "colour": "#93a832",
      "tooltip": "TODO",
    });
  }
};

/**
 * Block that handles turning the robot 90 degrees to the right
 * @type {{init: Blockly.Blocks.wait.init}}
 */
Blockly.Blocks['wait'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Warten',
      "colour": "#A400AC",
      "previousStatement": null,
      "nextStatement": null,
      "tooltip": "Der Roboter macht diesen Block nichts.",
    });
  }
};

