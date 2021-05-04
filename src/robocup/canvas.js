// Generic canvas draw functions

// with angle == 0, this function is equivalent to:
// ctx.drawImage(img, x, y, w, h);
function drawRotatedImage(ctx, img, angle, pos, dimension) {
  const center = {
    x: pos.x + dimension.width/2,
    y: pos.y + dimension.height/2,
  };

  // move origin to center of image
  ctx.translate(center.x, center.y);

  ctx.rotate(angle);

  // draw image centered around (0,0)
  ctx.drawImage(img, -dimension.width/2, -dimension.height/2, dimension.width, dimension.height);

  ctx.rotate(-angle);

  // move back to original origin
  ctx.translate(-center.x, -center.y);
}

// draw an image given the center of the image
function drawCenteredImage(ctx, img, center, dimension) {
  ctx.drawImage(img,
    center.x-dimension.width/2,
    center.y-dimension.height/2,
    dimension.width,
    dimension.height);
}

// draw an image given the center of the image
function drawRotatedCenteredImage(ctx, img, angle, center, dimension) {
  const topLeft = {
    x: center.x-dimension.width/2,
    y: center.y-dimension.height/2,
  };
  drawRotatedImage(ctx,
    img,
    angle,
    topLeft,
    dimension);
}

export { drawRotatedImage, drawCenteredImage, drawRotatedCenteredImage };
