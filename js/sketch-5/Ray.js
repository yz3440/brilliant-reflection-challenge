class Ray {
  constructor(x, y, angle) {
    this.origin = createVector(x, y);
    this.angle = angle;
  }

  draw(b) {
    stroke(255);

    let pt = this.cast(b);

    ellipse(mouseX, mouseY, 10, 10);

    push();
    translate(this.origin.x, this.origin.y);
    line(0, 0, cos(this.angle) * 1000, sin(this.angle) * 1000);
    pop();
  }

  cast(boundary) {
    const x1 = boundary.a.x;
    const y1 = boundary.a.y;
    const x2 = boundary.b.x;
    const y2 = boundary.b.y;
    const x3 = this.origin.x;
    const y3 = this.origin.y;
    const x4 = this.origin.x + 100 * Math.cos(this.angle);
    const y4 = this.origin.y + 100 * Math.sin(this.angle);
    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den == 0) {
      return null;
    }
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (t > 0 && t < 1 && u > 0) {
      return createVector(x1 + t * (x2 - x1), y1 + t * (y2 - y1));
    }
    return null;
  }

  castAll(boundaries, count = 0) {
    let nearestpt = null;
    let nearestBoundary = null;
    for (let i = 0; i < boundaries.length; i++) {
      let pt = this.cast(boundaries[i]);
      if (pt && pt.dist(this.origin) > 0.0000001) {
        if (!nearestpt || pt.dist(this.origin) < nearestpt.dist(this.origin)) {
          nearestpt = pt;
          nearestBoundary = boundaries[i];
        }
      }
    }
    if (nearestpt) {
      nearestBoundary.hit();
    }

    return [nearestpt, nearestBoundary];
  }

  reflect(boundary) {
    let pt = this.cast(boundary);
    if (pt) {
      line(this.origin.x, this.origin.y, pt.x, pt.y);
      let v = createVector(pt.x - this.origin.x, pt.y - this.origin.y);

      let n = createVector(
        boundary.b.x - boundary.a.x,
        boundary.b.y - boundary.a.y
      );
      n.normalize();
      let nAngle = n.heading();
      let newV = nAngle * 2 - v.heading();
      this.angle = newV;
      this.origin = pt;
      this.reflect(boundary);
    } else {
      line(
        this.origin.x,
        this.origin.y,
        this.origin.x + 1000 * Math.cos(this.angle),
        this.origin.y + 1000 * Math.sin(this.angle)
      );
    }
  }

  reflectAll(boundaries, count = 0, maxReflections = 10) {
    strokeWeight(1);
    // stroke(255, 100);
    stroke(200, 200, 0, map(count, 0, maxReflections, 255, 20));

    let [pt, boundary] = this.castAll(boundaries, count);
    if (pt) {
      line(this.origin.x, this.origin.y, pt.x, pt.y);
      let v = createVector(
        pt.x - this.origin.x,
        pt.y - this.origin.y
      ).normalize();

      let n = createVector(
        boundary.b.x - boundary.a.x,
        boundary.b.y - boundary.a.y
      ).normalize();

      v.sub(n.copy().mult(2 * v.copy().dot(n)));

      this.angle = v.heading() + Math.PI;

      this.origin = pt;
      if (count < maxReflections) {
        this.reflectAll(boundaries, count + 1, maxReflections);
      }
    } else {
      stroke(200, 200, 0, map(count, 0, maxReflections, 255, 20));
      line(
        this.origin.x,
        this.origin.y,
        this.origin.x + 1000 * Math.cos(this.angle),
        this.origin.y + 1000 * Math.sin(this.angle)
      );
    }
  }
}
