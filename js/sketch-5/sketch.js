let b,
  boundaries = [];

let xoff = 0;
let roff = 0;

let pMirrorCount = 0;
// let r;
function setup() {
  let myCanvas = createCanvas(min(windowWidth - 50, 1200), 700);
  myCanvas.parent('sketch');
  initBoundaries();
  background(0);
}

function draw() {
  background(0, 255 - config.backgroundTransparency);
  if (pMirrorCount != config.mirrorCount) {
    initBoundaries();
  }
  // put drawing code here
  for (let i = 0; i < 4; i++) {
    for (let b of boundaries) b.resetHit();
    // ellipse(mouseX, mouseY, 10, 10);
    for (let i = 0; i < config.rayCount; i++) {
      let ang =
        ((Math.PI * 2) / config.rayCount) * i +
        roff +
        radians(config.rayRotationOffset);
      if (config.rayJitter) ang += (noise(xoff, i) - 0.5) * 0.1;
      let r = new Ray(mouseX, mouseY, ang);

      r.reflectAll(boundaries, 0, config.reflectionDepth);
    }
    for (let b of boundaries) b.draw();

    xoff += 0.01;
    if (config.rayRotation) roff += 0.001;
    pMirrorCount = config.mirrorCount;
  }
}

function initBoundaries(num = config.mirrorCount) {
  boundaries = [];
  for (let i = 0; i < num; i++) {
    boundaries.push(
      new Boundary(random(width), random(height), random(width), random(height))
    );
  }
  boundaries.push(new Boundary(0, 1, width, 1));
  boundaries.push(new Boundary(width - 1, 0, width - 1, height));
  boundaries.push(new Boundary(width, height - 1, 0, height - 1));
  boundaries.push(new Boundary(1, height, 1, 0));
}
