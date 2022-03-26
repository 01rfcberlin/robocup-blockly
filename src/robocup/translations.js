import * as constants from "../constants.js";

// There are two coordinate systems:
//
// 1. Cell coordinates: The cells in the grid. Activate debugDrawCellCoords
//    to understand the cell coordinates.
//
// 2. Pixel coordinates: Pixel coordinates within the canvas. The canvas has a
//    fixed size.

// translate from pixels to cell
function pixelToCell(pos) {
  return {
    x: Math.floor(pos.x / constants.cell.width),
    // we need to add constants.cell.height/2 because the grid starts with a
    // half cell in y direction
    y: Math.floor((pos.y + constants.cell.height/2) / constants.cell.height),
  };
}

// translate from cell to pixels
function cellToPixel(pos) {
  return {
    x: pos.x * constants.cell.width,
    // we need to subtract constants.cell.height/2 because the grid starts with
    // a half cell in y direction
    y: pos.y * constants.cell.height - constants.cell.height/2,
  };
}

// translate from cell to pixels, so that the robot is centered within a cell
function cellToPixelWithCenteredRobot(pos) {
  const pixel = cellToPixel(pos)
  return {
    x: pixel.x + constants.cell.width/2,
    y: pixel.y + constants.cell.height/2,
  };
}

// Translate from cell to pixels, so that the ball is in the "east" of the
// cell, i.e. the ball is vertically centered but horizontally on the right, so
// that it leans to the goal of the opponent.
//
// The background of this is that if we centered the ball, the ball would be
// hidden by the robot.
function cellToPixelWithEastBall(pos) {
  const pixel = cellToPixel(pos)
  return {
    x: pixel.x + constants.cell.width * (5/6),
    y: pixel.y + constants.cell.height/2,
  };
}

export { pixelToCell, cellToPixel, cellToPixelWithCenteredRobot, cellToPixelWithEastBall }
