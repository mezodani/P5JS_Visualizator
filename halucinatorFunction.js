function drawPsychedelicShape(radius, distortion) {
  beginShape();
  for (let a = 0; a <= 360; a += 15) {
    let r = radius + distortion * sin(a * 6 + frameCount * 3);
    let x = r * cos(a);
    let y = r * sin(a);
    vertex(x, y);
    endShape(CLOSE);
    beginShape();
    for (let a = 0; a <= 360; a += 15) {
      let r = radius + distortion * sin(a * 6 + frameCount * 3);
      let x = r / 1.5 * cos(a);
      let y = r / 1.5 * sin(a);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}