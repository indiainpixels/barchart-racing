p5.disableFriendlyErrors = true;
let data, timeline, colss, subscribe;
function preload() {
	data = loadJSON('Final-ODI-Bowling-data.json');
	aadhar = loadJSON('scrape_cricket/namesx.json');
	subscribe = loadImage('subscribe.png');
	colss = randomColor({
		luminosity: 'dark',
		count: 600,
		format: 'rgbArray',
		hue: 'random',
	});
}
function setup() {
	textFont('Roboto');
	smooth();
	frameRate(300);
	const parent = document.getElementById('canvas');
	const canvas = createCanvas(innerWidth, innerHeight);
	canvas.parent(parent);
	timeline = new Timeline(data);
	fill('red');
}
let start = false;
function draw() {
	if (!rec || start) {
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
