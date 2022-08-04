// target that blocks a ray of light
class Target {
  constructor(x, y, radius, hidden = false) {
    this.origin = createVector(x, y);
    this.radius = radius;
    this.hidden = hidden;
    this.wasHidden = hidden;
  }

  isFound() {
    return this.wasHidden && !this.hidden;
  }

  draw() {
    push();
    noStroke();
    fill(255, 0, 0);
    translate(this.origin.x, this.origin.y);
    if (this.isFound()) fill(255, 0, 0, 100);
    if (this.hidden) fill(255, 0, 0, 0);
    ellipse(0, 0, this.radius * 2);
    pop();
  }
}
