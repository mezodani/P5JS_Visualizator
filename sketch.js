let song;
let fft;
let angleCenter = 0;
let angleLeft = 0;
let angleRight = 0;
const numShapes = 3;
let blinkAlpha = 0;
const blinkThreshold = 190;

let hue = 0;
let saturation = 0;

function preload() {
  song = loadSound('music.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSL, 360, 100, 100, 1);
  angleMode(DEGREES);
  strokeWeight(2);
  fft = new p5.FFT(0.8, 64);
  song.loop();
}

function draw() {
  background(10, 0, 10, 0.15);

  let spectrum = fft.analyze();
  let bass = fft.getEnergy('bass');
  let mid = fft.getEnergy('mid');
  let treble = fft.getEnergy('treble');

  // Trigger blink alpha and new random color on mid threshold crossing if no blink active
  if (mid > blinkThreshold && blinkAlpha < 40) {
    blinkAlpha = 120;
    hue = Math.floor(Math.random() * 360);
    saturation = Math.floor(Math.random() * 100);
  }

  // Draw the translucent colored overlay if blinking
  if (blinkAlpha > 0) {
    fill(hue, saturation, 50, blinkAlpha / 255);
    noStroke();
    rect(0, 0, width, height);
    blinkAlpha -= 5;
  }

  push();
  translate(width / 2, height / 2);
  angleCenter += map(bass, 0, 255, 0.1, 1.5);
  rotate(angleCenter);
  let hueBase = (frameCount * 2) % 360;

  // Central color shapes
  for (let i = 0; i < numShapes; i++) {
    let shapeHue = (hueBase + i * 360 / numShapes) % 360;
    stroke(shapeHue, 80, 60, 0.8);
    fill(shapeHue, 60, 40, 0.33);
    push();
    rotate((360 / numShapes) * i);
    drawPsychedelicShape(map(bass, 0, 255, 150, 300), map(mid, 0, 255, 20, 80));
    pop();
  }
  pop();

  // // Left layered shape
  // push();
  // translate(width / 4, height / 2);
  // angleLeft += map(mid, 0, 255, 0.2, 2);
  // rotate(angleLeft);
  // // drawComplexPsyShape(mid);
  // pop();

  // // Right layered shape
  // push();
  // translate((width * 3) / 4, height / 2);
  // angleRight -= map(treble, 0, 255, 0.3, 2.5);
  // rotate(angleRight);
  // // drawComplexPsyShape(treble);
  // pop();
}

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

// function drawComplexPsyShape(freqEnergy) {
//   let baseRadius = map(freqEnergy, 0, 255, 80, 150);
//   let layers = 5;
//   let hueStart = (frameCount * 3) % 360;

//   for (let i = 0; i < layers; i++) {
//     let shapeHue = (hueStart + i * 40) % 360;
//     stroke(shapeHue, 90, 70, 0.7 / (i + 1));
//     fill(shapeHue, 60, 40, 0.23 + 0.07 * (layers - i));
//     let radius = baseRadius + i * 15;
//     beginShape();
//     for (let a = 0; a <= 360; a += 10) {
//       let wave = 15 * sin(a * 8 + frameCount * 10 + i * 30);
//       let r = radius + wave + map(freqEnergy, 0, 255, 0, 20);
//       let x = r * cos(a);
//       let y = r * sin(a);
//       vertex(x, y);
//     }
//     endShape(CLOSE);
//   }
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if (song.isPlaying()) song.pause();
  else song.play();
}
