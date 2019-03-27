p5.disableFriendlyErrors = true;
let data, timeline, colss, subscribe;
function preload() {
	data = loadJSON('Final-Test-Bowling-data.json');
	aadhar = loadJSON('scrape_cricket/namesxi.json');
	subscribe = loadImage('subscribe.png');
	colss = randomColor({
		luminosity: 'dark',
		count: 600,
		format: 'rgbArray',
		hue: 'random',
	});
}
const btn = document.querySelector('button'),
	chunks = [];

function record() {
	chunks.length = 0;
	let stream = document.querySelector('canvas').captureStream(30),
		recorder = new MediaRecorder(stream);
	recorder.ondataavailable = e => {
		if (e.data.size) {
			chunks.push(e.data);
		}
	};
	recorder.onstop = exportVideo;
	btn.onclick = e => {
		recorder.stop();
		btn.textContent = 'start recording';
		btn.onclick = record;
	};
	recorder.start();
	btn.textContent = 'stop recording';
}

function exportVideo(e) {
	var blob = new Blob(chunks);
	var vid = document.createElement('video');
	vid.id = 'recorded';
	vid.controls = true;
	vid.src = URL.createObjectURL(blob);
	document.body.appendChild(vid);
	vid.play();
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
