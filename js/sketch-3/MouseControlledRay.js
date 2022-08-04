class MouseControlledRay extends Ray {
  constructor(x, y, translation = [0, 0]) {
    let angle = 0;
    super(x, y, angle);
    this.translation = translation;
  }

  reset() {
    super.reset();
  }

  setDirection(x, y) {
    let angle = atan2(
      y - (this.origin.y + this.translation[1]),
      x - (this.origin.x + this.translation[0])
    );

    // constrain angle to top 180 degrees
    // angle = constrain(angle, -PI, 0);

    this.angle = angle;
  }

  drawControl() {
    push();
    translate(this.fixedOrigin.x, this.fixedOrigin.y);
    scale(0.2, 0.2);
    stroke(0);
    strokeWeight(5);
    if (this.isHovered()) strokeWeight(3);
    // eye shape
    beginShape();
    vertex(-80, 0);
    bezierVertex(-30, -50, 30, -50, 80, 0);
    bezierVertex(30, 50, -30, 50, -80, 0);
    endShape();
    ellipse(0, 0, 50, 50);
    fill(0);
    if (this.isHovered()) noFill();
    ellipse(0, 0, 30, 30);
    pop();
  }

  isHovered() {
    return (
      dist(
        mouseX,
        mouseY,
        this.fixedOrigin.x + this.translation[0],
        this.fixedOrigin.y + this.translation[1]
      ) < 20
    );
  }

  isClicked() {
    return mouseIsPressed && this.isHovered();
  }

  updateControl() {
    if (this.isClicked()) {
      cursor('pointer');
      this.fixedOrigin.x = mouseX - this.translation[0];
      this.fixedOrigin.y = mouseY - this.translation[1];
    }
  }
}
