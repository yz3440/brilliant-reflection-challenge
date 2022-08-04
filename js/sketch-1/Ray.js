const [hueOffset, hueStep] = [40, 0];
const colorFromIndex = (index) => {
  return hslToHex(hueOffset + index * hueStep, 100, 40);
};

// Ray class with methods that
// casts itself to find intersection with boundaries
// calculates reflections after hitting reflective boundaries
// detect collision with targets
class Ray {
  constructor(x, y, angle) {
    this.origin = createVector(x, y);
    this.fixedOrigin = createVector(x, y);

    this.angle = angle;
    // store the trace of the ray
    this.trace = [this.origin];

    this.hasHitAnyTarget = false;

    // store the virtual trace of the ray
    this.virtualTrace = [];
    // displayed virtual trace for lerping
    this.virtualTraceLerped = [];
  }

  reset() {
    this.origin = this.fixedOrigin;
    this.hasHitAnyTarget = false;
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

  drawTrace() {
    for (let i = 0; i < this.trace.length - 1; i++) {
      strokeWeight(2);
      stroke(0, 20);
      if (this.hasHitAnyTarget) stroke(colorFromIndex(i));

      line(
        this.trace[i].x,
        this.trace[i].y,
        this.trace[i + 1].x,
        this.trace[i + 1].y
      );
      // noStroke();
      // fill(stringToColour(this.trace[i].toString()));
      // ellipse(this.trace[i].x, this.trace[i].y, 10, 10);
    }
  }

  drawVirtualTrace() {
    push();
    // ellipse(mouseX, mouseY, 10, 10);
    if (!this.hasHitAnyTarget) return;
    for (let i = 0; i < this.virtualTrace.length - 1; i++) {
      strokeWeight(2);
      stroke(0, 20);
      line(
        this.virtualTrace[i].x,
        this.virtualTrace[i].y,
        this.virtualTrace[i + 1].x,
        this.virtualTrace[i + 1].y
      );
      // noStroke();
      // fill(stringToColour(this.trace[i].toString()));
      // ellipse(this.trace[i].x, this.trace[i].y, 10, 10);
    }
    pop();
  }

  drawVirtualTraceLerped() {
    push();
    // ellipse(mouseX, mouseY, 10, 10);
    if (!this.hasHitAnyTarget) return;
    for (let i = 0; i < this.virtualTrace.length - 1; i++) {
      strokeWeight(2);
      stroke(colorFromIndex(i));
      line(
        this.virtualTraceLerped[i].x,
        this.virtualTraceLerped[i].y,
        this.virtualTraceLerped[i + 1].x,
        this.virtualTraceLerped[i + 1].y
      );
      // noStroke();
      // fill(stringToColour(this.trace[i].toString()));
      // ellipse(this.trace[i].x, this.trace[i].y, 10, 10);
    }
    pop();
  }

  updateVirtualTraceLerped() {
    // if mouse is pressed, lerp to the virtual trace
    if (mouseIsPressed) {
      if (this.virtualTrace.length === this.virtualTraceLerped.length) {
        for (let i = 0; i < this.virtualTraceLerped.length; i++) {
          this.virtualTraceLerped[i] = p5.Vector.lerp(
            this.virtualTraceLerped[i],
            this.virtualTrace[i],
            0.03 * i
          );
        }
      }
    }

    // if mouse is not pressed, reset back to the real trace
    if (!mouseIsPressed) {
      // if has the same length as the real trace, lerp back
      if (this.virtualTraceLerped.length === this.trace.length)
        for (let i = 0; i < this.virtualTraceLerped.length; i++)
          this.virtualTraceLerped[i] = p5.Vector.lerp(
            this.virtualTraceLerped[i],
            this.trace[i],
            0.4
          );
      // else, hard reset to the real trace
      else this.virtualTraceLerped = this.trace;
    }
  }

  calculateVirtualTrace() {
    this.virtualTrace = [];
    if (!this.hasHitAnyTarget) return;
    let tempOrigin = this.trace[0].copy();
    this.virtualTrace.push(tempOrigin);
    let tempDirection = this.trace[1].copy().sub(this.trace[0]).normalize();
    for (let i = 0; i < this.trace.length - 1; i++) {
      let distance = this.trace[i].dist(this.trace[i + 1]);
      tempOrigin = tempOrigin.copy().add(tempDirection.copy().mult(distance));
      this.virtualTrace.push(tempOrigin);
    }
  }

  drawReflectionPoint() {
    if (!mouseIsPressed) return;
    for (let i = 0; i < this.trace.length; i++) {}
  }

  // cast the ray on boundaries and return the point of intersection and boundary
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

  // cast the ray on multiple boundaries
  // return the NEAREST POINT of intersection and BOUNDARY
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
    // if (nearestpt) {
    //   nearestBoundary.hit();
    // }

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
    // reset the trace, push the origin point
    if (count === 0) this.trace = [this.origin];

    strokeWeight(1);
    stroke(255);

    // get hit point and boundary
    let [hitPoint, hitBoundary] = this.castAll(boundaries, count);

    // if hit point exists
    if (hitPoint) {
      // push the hit point to the trace
      this.trace.push(createVector(hitPoint.x, hitPoint.y));

      // setting new origin and angle of the reflected ray for next reflection
      this.angle = this.getReflectedAngle(hitBoundary, hitPoint);
      this.origin = hitPoint;

      // cease if max reflections reached or boundary not reflective
      if (count > maxReflections || !hitBoundary.reflective) return;
      this.reflectAll(boundaries, count + 1, maxReflections);
    }
    // if not hit, draw a long ray
    else {
      this.trace.push(
        createVector(
          this.origin.x + 2000 * Math.cos(this.angle),
          this.origin.y + 2000 * Math.sin(this.angle)
        )
      );
    }
  }

  getReflectedAngle(boundary, hitPoint) {
    let v = createVector(
      hitPoint.x - this.origin.x,
      hitPoint.y - this.origin.y
    ).normalize();

    let n = createVector(
      boundary.b.x - boundary.a.x,
      boundary.b.y - boundary.a.y
    ).normalize();

    v.sub(n.copy().mult(2 * v.copy().dot(n)));
    return v.heading() + Math.PI;
  }

  checkHit(p1, p2, target) {
    let projectedPt = orthogonalProjection(p1, p2, target.origin, true);
    let dist = projectedPt.dist(target.origin);
    return [dist < target.radius, projectedPt];
  }

  checkHits(p1, p2, targets) {
    let [nearestHit, nearestTarget] = [null, null];
    for (let target of targets) {
      let [hit, hitPoint] = this.checkHit(p1, p2, target);
      if (hit) {
        if (!nearestHit || hitPoint.dist(p1) < nearestHit.dist(p1)) {
          nearestHit = hitPoint;
          nearestTarget = target;
        }
      }
    }
    return [nearestHit, nearestTarget];
  }

  hitTargets(targets) {
    for (let i = 0; i < this.trace.length - 1; i++) {
      let [hit, target] = this.checkHits(
        this.trace[i],
        this.trace[i + 1],
        targets
      );
      if (hit) {
        this.trace = this.trace.slice(0, i + 1);
        this.trace.push(hit);
        this.hasHitAnyTarget = true;
        break;
      }
    }
  }

  hitVirtualTargets(targets) {
    let [hit, target] = [null, null];
    // check if the virtual ray hits any virtual target
    for (let i = 0; i < this.virtualTrace.length - 1; i++) {
      [hit, target] = this.checkHits(
        this.virtualTrace[i],
        this.virtualTrace[i + 1],
        targets
      );
    }

    if (hit) {
      // if hit, check if the last segment of
      // the lerped virtual ray hits the same target
      let [hit, point] = this.checkHit(
        this.virtualTraceLerped[this.virtualTraceLerped.length - 2],
        this.virtualTraceLerped[this.virtualTraceLerped.length - 1],
        target
      );
      // if hit, show the virtual target
      if (hit) {
        target.hidden = false;
      }
    }
  }

  setOrigin(x, y) {
    this.origin = createVector(x, y);
  }
}
