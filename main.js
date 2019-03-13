p5.disableFriendlyErrors = true;
let data, timeline, colss;
function preload() {
	data = loadJSON('data.json');
	colss = randomColor({
		luminosity: 'dark',
		count: 32,
		format: 'rgbArray',
		hue: 'random',
	});
}
function setup() {
	textFont('Roboto');
	smooth();
	const parent = document.getElementById('canvas');
	const canvas = createCanvas(innerWidth, innerHeight);
	canvas.parent(parent);
	timeline = new Timeline(data);
	timeline.init();
	fill('red');
}
let start = false;
function draw() {
	if (start) {
		translate(130, 150);
		timeline.update();
		timeline.show();
	}
}
function keyPressed() {
	if (keyCode === ENTER) start = true;
}
