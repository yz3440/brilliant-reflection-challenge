class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
    this.angle = this.b.copy().sub(this.a).heading();
    this.hitCount = 0;
  }

  hit() {
    this.hitCount++;
  }

  resetHit() {
    this.hitCount = 0;
  }

  draw() {
    push();
    stroke(150, 150, 255);
    if (config.visualizeHit)
      stroke(
        100 + this.hitCount * (150 / config.rayCount),
        100 + this.hitCount * (150 / config.rayCount),
        100 + this.hitCount * (300 / config.rayCount)
      );
    strokeWeight(2);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
    pop();
  }
}
