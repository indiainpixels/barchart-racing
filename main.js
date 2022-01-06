p5.disableFriendlyErrors = true;
let data, timeline, randomColors, subscribe;
function preload() {
  data = loadJSON(dataSource);
  subscribe = loadImage('subscribex.png');
}

function setup() {
  smooth();
  frameRate(300);
  randomColors = randomColor({
    luminosity: 'dark',
    count: 50,
    format: 'rgbArray',
    hue: 'random',
  });
  const parent = document.getElementById('canvas');
  const canvas = createCanvas(innerWidth, innerHeight);
  canvas.parent(parent);
  timeline = new Timeline(data);
}
let start = false;
function draw() {
  background('white');
  if (start) {
    if (toShowWatermark) {
      const txt = 'India in Pixels';
      fill(246);
      textSize(18);
      for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 50; j++) {
          if (j % 2 == 0) {
            text(txt, i * textWidth(txt) * 1.2, j * 30);
          } else {
            text(txt, (i + 0.5) * textWidth(txt) * 1.2, j * 30);
          }
        }
      }
    }
    translate(130, 150);
    timeline.update();
    timeline.show();
  } else {
    textAlign(CENTER);
    textSize(30);
    fill(0);
    text('Press Enter to Start', width / 2, height / 2);
    textSize(14);
    fill(100);
    text(
      'To support, UPI: indiainpixels@paytm | patreon.com/indiainpixels',
      width / 2,
      height / 2 + 30
    );
  }
}
function keyPressed() {
  if (keyCode == ENTER) {
    start = true;
  }
}
