const canvasSize = 2000;
const maxFitImageSize = canvasSize / 2;

function setup(ctx) {
  ctx.lineCap = "round";
  clear(ctx);
}

function colourToRGB(colour) {
  return `rgb(${(colour & 0xff0000) >> 16},${(colour & 0x00ff00) >>
    8},${colour & 0x0000ff})`;
}

function handleDrawEvent(ctx, e) {
  ctx.lineWidth = e.thickness;
  ctx.strokeStyle = e.colour === -1 ? "#ffffff" : colourToRGB(e.colour);
  ctx.beginPath();
  ctx.moveTo(e.x1, e.y1);
  ctx.lineTo(e.x2, e.y2);
  ctx.stroke();
}

function drawImage(ctx, img, fit = false) {
  if (fit) {
    let width = img.width;
    let height = img.height;
    const aspectRatio = width / height;
    if (width > height) {
      height = maxFitImageSize / aspectRatio;
      width = maxFitImageSize;
    } else {
      width = maxFitImageSize * aspectRatio;
      height = maxFitImageSize;
    }
    const startX = (canvasSize - width) / 2;
    const startY = (canvasSize - height) / 2;
    ctx.drawImage(img, startX, startY, width, height);
  } else {
    ctx.drawImage(img, 0, 0);
  }
}

function clear(ctx) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasSize, canvasSize);
}

module.exports = {
  canvasSize,
  setup,
  colourToRGB,
  handleDrawEvent,
  drawImage,
  clear
};
