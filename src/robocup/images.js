function newImage(url) {
  let image = new Image();
  image.src = url;
  return image;
}

const rfcRobot = newImage(process.env.PUBLIC_URL + '/robot-top.png');
const bitbotsRobot = newImage(process.env.PUBLIC_URL + '/wolfgang.png');
const ball = newImage(process.env.PUBLIC_URL + '/ball.png');

export { rfcRobot, bitbotsRobot, ball };
