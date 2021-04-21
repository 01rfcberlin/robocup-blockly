// the dimensions of the game field canvas in pixel
const canvas_width = 600;
const canvas_height = 400;

// we divide the game field into a grid
const num_x_cells = 11;
const num_y_cells = 8;

// in pixel
const cell_width = canvas_width / num_x_cells;
const cell_height = canvas_height / num_y_cells;

// width of 0.5 meter
const robot_size_meters = 0.5;

// FIFA Size 1 (130mm) times 2.5
const ball_size_meters = 0.325;

// We think of each cell as a 1 meter times 1 meter square. This is what we use
// to convert from meters to pixel.
const robot_width = robot_size_meters * cell_width;
const robot_height = robot_size_meters * cell_height;
const ball_width = ball_size_meters * cell_width;
const ball_height = ball_size_meters * cell_height;

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

export { canvas_width, canvas_height, num_x_cells, num_y_cells, cell_width, cell_height, robot_width, robot_height, ball_width, ball_height, draw_all_interval, robot_movement_per_draw_all, robot_rotation_per_draw_all, ball_movement_per_draw_all,step_execution_interval, debugDrawCellCoords };
