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
    translate(this.origin.x, this.origin.y);
    scale(0.2, 0.2);
    stroke(0);
    strokeWeight(5);
    // eye shape
    beginShape();
    vertex(-80, 0);
    bezierVertex(-30, -50, 30, -50, 80, 0);
    bezierVertex(30, 50, -30, 50, -80, 0);
    endShape();
    ellipse(0, 0, 50, 50);
    fill(0);
    ellipse(0, 0, 30, 30);
    pop();
  }
}
