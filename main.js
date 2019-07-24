p5.disableFriendlyErrors = true;
let data, timeline, randomColors, subscribe;
function preload() {
  data = loadJSON(dataSource);
  subscribe = loadImage("subscribex.png");
}

function setup() {
  smooth();
  frameRate(300);
  const parent = document.getElementById("canvas");
  const canvas = createCanvas(innerWidth, innerHeight);
  canvas.parent(parent);
  timeline = new Timeline(data);
  randomColors = randomColor({
    luminosity: "dark",
    count: timeline.bars.length,
    format: "rgbArray",
    hue: "random"
  });
}
let start = false;
function draw() {
  background("white");
  if (!rec || start) {
    if (toShowWatermark) {
      const txt = "India in Pixels";
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
  }
}
function keyPressed() {
  if (keyCode == ENTER) {
    start = true;
  }
}
