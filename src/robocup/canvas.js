// Generic canvas draw functions

// with angle == 0, this function is equivalent to:
// ctx.drawImage(img, x, y, w, h);
function drawRotatedImage(ctx, img, angle, x, y, w, h) {
  const center_x = x + w/2;
  const center_y = y + w/2;

  // move origin to center of image
  ctx.translate(center_x, center_y);

  ctx.rotate(angle);

  // draw image centered around (0,0)
  ctx.drawImage(img, -w/2, -h/2, w, h);

  ctx.rotate(-angle);

  // move back to original origin
  ctx.translate(-center_x, -center_y);
}

// draw an image given the center of the image
function drawCenteredImage(ctx, img, centerX, centerY, w, h) {
  ctx.drawImage(img,
    centerX-w/2,
    centerY-h/2,
    w,
    h);
}

// draw an image given the center of the image
function drawRotatedCenteredImage(ctx, img, angle, centerX, centerY, w, h) {
  drawRotatedImage(ctx,
    img,
    angle,
    centerX-w/2,
    centerY-h/2,
    w,
    h);
}

export { drawRotatedImage, drawCenteredImage, drawRotatedCenteredImage };
