class MouseControlledRay extends Ray {
  constructor(x, y, translation = [0, 0]) {
    let angle = 0.09 * PI;
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
    noStroke();
    fill(255, 200, 0);
    translate(this.fixedOrigin.x, this.fixedOrigin.y);
    ellipse(0, 0, 18, 20);
    fill(100, 100, 100);
    rect(-5, -18, 10, 10);
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
