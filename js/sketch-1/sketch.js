let [marginX, marginY] = [0, 0];
const [boxW, boxH] = [500, 150];
const translation = [0, 50];
const maxReflections = 6;
let controller, ray;
const boundaries = [];
const targets = [];

let hasHitEyeOnce = false;

function setup() {
  pixelDensity(2);
  let myCanvas = createCanvas(windowWidth, 300);
  myCanvas.parent('sketch');

  // calculate margin based on box and canvas dimensions
  [marginX, marginY] = [(width - boxW) / 2, (height - boxH) / 2];

  // initialize objects
  boundaries.push(
    new Boundary(width - marginX, height - marginY, marginX, height - marginY)
  );
  targets.push(new Target(width / 2 + 120, marginY, 8));

  ray = new MouseControlledRay(width / 2 - 120, marginY + 70, translation);
  // controller = new Controller(
  //   width - marginX,
  //   height - marginY,
  //   width - marginX,
  //   marginY,
  //   10,
  //   translation
  // );
}

function draw() {
  translate(translation[0], translation[1]);
  background(255);

  // reset ray origin to the fixed origin
  ray.reset();
  if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
    ray.setDirection(mouseX, mouseY);
  }

  // process ray reflection
  // only if the ray origin is not being moved
  if (!ray.isClicked()) {
    // calculate reflected ray bounced by all boundaries
    ray.reflectAll(boundaries, 0, maxReflections);
    // check if the reflected ray trace hit any target
    ray.hitTargets(targets);
  }

  // draw boundaries
  for (let b of boundaries) b.draw();

  // draw lines to found virtual targets
  for (let t of targets) {
    if (t.isFound()) {
      stroke(0, 20);
      strokeWeight(2);
      line(t.origin.x, t.origin.y, ray.fixedOrigin.x, ray.fixedOrigin.y);
    }
  }

  // draw rays only if the ray origin is not being moved
  if (!ray.isClicked()) {
    ray.drawTrace();
    ray.drawVirtualTrace();
    ray.drawVirtualTraceLerped();
  }

  // draw targets
  for (let t of targets) t.draw();

  // draw equal angle indicator
  if (ray.trace.length > 2) {
    push();
    noFill();
    let pt = ray.trace[1];
    let angle = ray.angle > 1.5 * PI ? ray.angle : PI - ray.angle;
    // if ray has hit eye in sketch-1
    if (ray.hasHitAnyTarget) {
      hasHitEyeOnce = true;
      stroke(0, 100, 0);
    }

    if (hasHitEyeOnce) {
      textSize(20);
      textAlign(CENTER, CENTER);
      text(degrees(2 * PI - angle).toFixed(1) + '°', pt.x + 75, pt.y - 15);
      text(degrees(2 * PI - angle).toFixed(1) + '°', pt.x - 75, pt.y - 15);
    }
    arc(pt.x, pt.y, 60, 60, angle, 2 * PI);
    arc(pt.x, pt.y, 50, 50, angle, 2 * PI);
    arc(pt.x, pt.y, 60, 60, PI, PI - angle);
    arc(pt.x, pt.y, 50, 50, PI, PI - angle);

    pop();
  }

  // ray control
  // ray.updateControl();
  ray.drawControl();
  // controller.updateControl();
  // controller.draw();

  // cursor
  // if (ray.isHovered()) cursor('pointer');
  // if (ray.hasHitAnyTarget) cursor('zoom-in');
  // else cursor(ARROW);
  updateDOM();
}

const getFoundTargets = () => {
  let foundTargets = [];
  for (let t of targets) {
    if (t.isFound()) foundTargets.push(t);
  }
  return foundTargets;
};
