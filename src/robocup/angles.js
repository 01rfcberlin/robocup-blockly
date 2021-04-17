function degree_to_radians(degree) {
  return normalize_angle(degree / 360 * (2 * Math.PI))
}

// normalize angle in radians to [-pi, pi]
function normalize_angle(radians) {
  return Math.atan2(Math.sin(radians), Math.cos(radians));
}

const gaze_directions = {
  left: "left",
  right: "right",
  top: "top",
  bottom: "bottom",
  // the robot is probably still rotating if the gaze can't be classified
  unknown: "unknown",
}

// Angles are floats and thus you can't directly compare for equality and have
// to use this function instead.
function angle_almost_equals(source, target, delta = 0.001) {
  target = normalize_angle(target);
  source = normalize_angle(source);

  const diff = Math.abs(angle_signed_smallest_difference(source, target));
  return diff <= delta;
}

function classify_gaze_direction(rotation_radians) {
  if (angle_almost_equals(rotation_radians, 0)) {
    return gaze_directions.top;
  } else if (angle_almost_equals(rotation_radians, -Math.PI/2)) {
    return gaze_directions.left;
  } else if (angle_almost_equals(rotation_radians, Math.PI/2)) {
    return gaze_directions.right;
  } else if (angle_almost_equals(rotation_radians, -Math.PI)) {
    return gaze_directions.bottom;
  } else {
    return gaze_directions.unknown;
  }
}

function angle_signed_smallest_difference(source_angle, target_angle) {
  return Math.atan2(Math.sin(target_angle-source_angle), Math.cos(target_angle-source_angle));
}

export { degree_to_radians, normalize_angle, gaze_directions, classify_gaze_direction, angle_almost_equals, angle_signed_smallest_difference };
