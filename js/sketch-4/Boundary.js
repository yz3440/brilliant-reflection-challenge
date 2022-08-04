// boundary that reflects or block a ray of light
class Boundary {
  constructor(x1, y1, x2, y2, reflective = true) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
    this.angle = this.b.copy().sub(this.a).heading();
    this.hitCount = 0;
    this.reflective = reflective;
  }

  hit() {
    this.hitCount++;
  }

  resetHit() {
    this.hitCount = 0;
  }

  draw() {
    push();
    stroke(100, 100, 100);
    if (this.reflective) stroke(150, 150, 255);
    strokeWeight(4);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
    pop();
  }
}
