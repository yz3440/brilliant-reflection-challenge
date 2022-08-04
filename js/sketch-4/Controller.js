// target that blocks a ray of light
class Controller {
  constructor(
    x1,
    y1,
    x2,
    y2,
    radius = 10,
    translation = [0, 0],
    color = '#00ff00'
  ) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
    this.pos = createVector(x1, y1);
    this.radius = radius;
    this.color = color;
    this.translation = translation;
  }

  updateControl() {
    let mouseVector = createVector(
      mouseX - this.translation[0],
      mouseY - this.translation[1]
    );

    if (mouseIsPressed && mouseVector.dist(this.pos) < this.radius) {
      console.log('clicked');
      this.pos = orthogonalProjection(this.a, this.b, mouseVector, true);
    }
  }

  draw() {
    push();
    noStroke();
    fill(this.color);
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, this.radius * 2);
    // triangle(30, 75, 58, 20, 86, 75);
    pop();
  }
}
