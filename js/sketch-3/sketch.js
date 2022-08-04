let [marginX, marginY] = [0, 0];
const [boxW, boxH] = [90, 150];
const translation = [0, 170];
const maxReflections = 6;
let controller, ray;
const boundaries = [];
const targets = [];

function setup() {
  let myCanvas = createCanvas(windowWidth, 650);
  myCanvas.parent('sketch');

  // calculate margin based on box and canvas dimensions
  [marginX, marginY] = [(width - boxW) / 2, (height - boxH) / 2];

  // initialize objects
  initBoundaries();
  initTargets();
  ray = new MouseControlledRay(width / 2, height - marginY - 1, translation);
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
  } else ray.setDirection(translation[0], height - marginY + translation[1]);

  // process ray reflection
  // only if the ray origin is not being moved
  if (!ray.isClicked()) {
    // calculate reflected ray bounced by all boundaries
    ray.reflectAll(boundaries, 0, maxReflections);
    // check if the reflected ray trace hit any target
    ray.hitTargets(targets);
    // calculate the trace for the virtual image
    ray.calculateVirtualTrace();

    // update the lerp animated virtual trace
    ray.updateVirtualTraceLerped();
    // check if the lerped virtual trace hit any hidden target
    ray.hitVirtualTargets(targets);
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

  // ray control
  // ray.updateControl();
  ray.drawControl();
  // controller.updateControl();
  // controller.draw();

  // cursor
  // if (ray.isHovered()) cursor('pointer');
  if (ray.hasHitAnyTarget && ray.trace.length > 2) cursor('zoom-in');
  else cursor(ARROW);
  updateDOM();
}

function initBoundaries() {
  // randomly generate boundaries
  // for (let i = 0; i < 4; i++) {
  //   boundaries.push(
  //     new Boundary(random(width), random(height), random(width), random(height))
  //   );
  // }

  // add walls on four sides counting the margin
  // top wall
  boundaries.push(new Boundary(marginX, marginY, width - marginX, marginY));
  // bottom wall
  boundaries.push(
    new Boundary(width - marginX, height - marginY, marginX, height - marginY)
  );

  // left wall
  boundaries.push(
    new Boundary(width - marginX, marginY, width - marginX, height - marginY)
  );

  // right wall
  boundaries.push(new Boundary(marginX, height - marginY, marginX, marginY));
}

function initTargets() {
  // original targets
  targets.push(new Target(width / 2, marginY + 35, 8));

  // mirrored targets
  // x mirrored 10 times
  for (let i = 1; i < 7; i++) {
    targets.push(new Target(width / 2 + i * boxW, marginY + 35, 8, true));
    targets.push(new Target(width / 2 - i * boxW, marginY + 35, 8, true));
    targets[targets.length - 2].hidden = false;
    targets[targets.length - 1].hidden = false;
  }

  // y mirrored once
  targets.push(new Target(width / 2, marginY - 35, 8, true));
  for (let i = 1; i < 7; i++) {
    targets.push(new Target(width / 2 + i * boxW, marginY - 35, 8, true));
    targets.push(new Target(width / 2 - i * boxW, marginY - 35, 8, true));
  }

  // y mirrored twice
  targets.push(new Target(width / 2, marginY + 35 - 2 * boxH, 8, true));
  for (let i = 1; i < 7; i++) {
    targets.push(
      new Target(width / 2 + i * boxW, marginY + 35 - 2 * boxH, 8, true)
    );
    targets.push(
      new Target(width / 2 - i * boxW, marginY + 35 - 2 * boxH, 8, true)
    );
  }

  // y mirrored thrice
  targets.push(new Target(width / 2, marginY - 35 - 2 * boxH, 8, true));
  for (let i = 1; i < 7; i++) {
    targets.push(
      new Target(width / 2 + i * boxW, marginY - 35 - 2 * boxH, 8, true)
    );
    targets.push(
      new Target(width / 2 - i * boxW, marginY - 35 - 2 * boxH, 8, true)
    );
  }

  // // y downward mirrored once
  // targets.push(new Target(width / 2, marginY - 35 + 2 * boxH, 8, true));
  // for (let i = 1; i < 10; i++) {
  //   targets.push(
  //     new Target(width / 2 + i * boxW, marginY - 35 + 2 * boxH, 8, true)
  //   );
  //   targets.push(
  //     new Target(width / 2 - i * boxW, marginY - 35 + 2 * boxH, 8, true)
  //   );
  // }

  // // y downward mirrored twice
  // targets.push(new Target(width / 2, marginY + 35 + 2 * boxH, 8, true));
  // for (let i = 1; i < 10; i++) {
  //   targets.push(
  //     new Target(width / 2 + i * boxW, marginY + 35 + 2 * boxH, 8, true)
  //   );
  //   targets.push(
  //     new Target(width / 2 - i * boxW, marginY + 35 + 2 * boxH, 8, true)
  //   );
  // }
}

const getFoundTargets = () => {
  let foundTargets = [];
  for (let t of targets) {
    if (t.isFound()) foundTargets.push(t);
  }
  return foundTargets;
};
