import * as angles from "./angles";
import * as translations from "./translations";

function ballInVisionFieldImpl(robot, ball, offsetLength, offsetLateral) {
  const gaze_direction = angles.classify_gaze_direction(robot.rotation);

  const robotCell = translations.pixelToCell(robot);
  const ballCell = translations.pixelToCell(ball);

  if (gaze_direction === angles.gaze_directions.right) {
    return ballCell.y === robotCell.y + offsetLateral && ballCell.x >= robotCell.x - offsetLength && ballCell.x <= robotCell.x+3;
  } else if (gaze_direction === angles.gaze_directions.left) {
    return ballCell.y === robotCell.y + offsetLateral && ballCell.x <= robotCell.x + offsetLength && ballCell.x >= robotCell.x-3;
  } else if (gaze_direction === angles.gaze_directions.bottom) {
    return ballCell.x === robotCell.x + offsetLateral && ballCell.y >= robotCell.y - offsetLength && ballCell.y <= robotCell.y+3;
  } else if (gaze_direction === angles.gaze_directions.top) {
    return ballCell.x === robotCell.x + offsetLateral && ballCell.y <= robotCell.y + offsetLength && ballCell.y >= robotCell.y-3;
  } else {
    console.assert(false);
    return false;
  }
}

function ballInMidVisionField(robotPixel, ballPixel) {
  return ballInVisionFieldImpl(robotPixel, ballPixel, 0, 0)
}

function ballInLeftVisionField(robotPixel, ballPixel) {
  return ballInVisionFieldImpl(robotPixel, ballPixel, -1, -1)
}

function ballInRightVisionField(robotPixel, ballPixel) {
  return ballInVisionFieldImpl(robotPixel, ballPixel, -1, 1)
}

function ballInVisionField(robotPixel, ballPixel) {
  return ballInMidVisionField(robotPixel, ballPixel) || ballInLeftVisionField(robotPixel, ballPixel) || ballInRightVisionField(robotPixel, ballPixel)
}

// A ball is only "kickable" if the robot is not moving, i.e. if the ball and
// the robot are on the same cell.
function ballKickable(ballPos, robotPos) {
  const robotCell = translations.pixelToCell(robotPos);
  const ballCell = translations.pixelToCell(ballPos);
  return ballCell.x === robotCell.x && ballCell.y === robotCell.y;
}

export { ballInLeftVisionField, ballInMidVisionField, ballInRightVisionField, ballInVisionField, ballKickable }
