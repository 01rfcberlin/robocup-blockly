// the dimensions of the game field canvas in pixel
const canvas = {
  width: 600,
  height: 400,
};

// we divide the game field into a grid
const num_x_cells = 11;
const num_y_cells = 8;

function roundToMutipleOfTwo(float_) {
  const int_ = Math.floor(float_);

  if (float_ === int_) {
    return int_;
  }

  if (int_ % 2 === 0) {
    return int_;
  } else {
    return int_ + 1;
  }
}

// in pixel
//
// Important: cell.width and cell.height have to be an integer and has to be
// dividable by two, otherwise the translations.js will not yield correct
// result
const cell = {
  width: roundToMutipleOfTwo(canvas.width / num_x_cells),
  height: roundToMutipleOfTwo(canvas.height / num_y_cells),
};

// width of 0.5 meter
const robot_size_meters = 0.5;

// FIFA Size 1 (130mm) times 2.5
const ball_size_meters = 0.325;

// translate meters to pixels
function metersToPixel(pos) {
  // We think of each cell as a 1 meter times 1 meter square. This is what we
  // use to convert from meters to pixel.
  return {
    x: pos.x * cell.width,
    y: pos.y * cell.height,
  };
}

function posToDimension(pos) {
  return {
    width: pos.x,
    height: pos.y,
  };
}

const robot = posToDimension(metersToPixel({x: robot_size_meters, y: robot_size_meters}));

const ball = posToDimension(metersToPixel({x: ball_size_meters, y: ball_size_meters}));

// the interval between execution of the code blocks. in ms
const step_execution_interval = 100;

// in ms
const draw_all_interval = 20;

// how many pixels the robot should move per second
const robot_movement_per_second = 50;

// how many pixels the ball should move per second
const ball_movement_per_second = 50;

// how many radians the robot should rotate per second. an absolute value.
const robot_rotation_speed = Math.PI * 1.1;

const calls_to_draw_all_per_second = 1000 / draw_all_interval;

const robot_movement_per_draw_all = robot_movement_per_second / calls_to_draw_all_per_second;
const robot_rotation_per_draw_all = robot_rotation_speed / calls_to_draw_all_per_second;

const ball_movement_per_draw_all = ball_movement_per_second / calls_to_draw_all_per_second;

const debugDrawCellCoords = false;

export { canvas, num_x_cells, num_y_cells, cell, robot, ball, draw_all_interval, robot_movement_per_draw_all, robot_rotation_per_draw_all, ball_movement_per_draw_all, step_execution_interval, debugDrawCellCoords };
