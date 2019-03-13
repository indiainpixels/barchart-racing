let numBars;
let vern = {
	Jharkhand: 'झारखण्ड',
	Karnataka: 'ಕರ್ನಾಟಕ',
	Kerala: 'കേരളം',
	'Madhya Pradesh': 'मध्य प्रदेश',
	Maharashtra: 'महाराष्ट्र',
	Odisha: 'ଓଡ଼ିଶା',
	Punjab: 'ਪੰਜਾਬ',
	Rajasthan: 'राजस्थान',
	'Tamil Nadu': 'தமிழ்நாடு',
	'Uttar Pradesh': 'उत्तर प्रदेश',
	'West Bengal': 'পশ্চিম বঙ্গল',
	Telangana: 'తెలంగాణ',
	Delhi: 'दिल्ली',
	Gujarat: 'ગુજરાત',
	Haryana: 'हरयाणा',
	'Andhra Pradesh': 'ఆంధ్రప్రదేశ్',
	Assam: 'আসাম',
	Bihar: 'बिहार',
	Chhattisgarh: '',
};
let rectSpace;
let rectHeight;
let initYear = 1980;
let speed = 1.0; // 1 year is 5 seconds |
let progress = 0; // in frameCount
let yearEntries = [];
let max = 0;
let lines = [10000, 20000, 50000, 100000, 200000, 500000, 1000000, 2000000];
var Timeline = function(seed) {
	this.seed = seed;
	this.bars = {};
	this.swaps = [];
};
Timeline.prototype.init = function() {
	numBars = Object.keys(timeline.seed['1980']).length;
	numBarsToShow = 15;
	rectSpace = (height * 0.75) / numBarsToShow;
	rectHeight = 0.85 * rectSpace;
	yearEntries = Object.entries(this.seed[initYear]).sort((a, b) => b[1] - a[1]);
	max = Math.max(...yearEntries.filter(v => !!v[1]).map(v => v[1]));
	yearEntries.forEach((entry, i) => {
		let wid = map(entry[1], 0, max, 0, width * 0.8);

		this.bars[i] = new Bar(i, wid, entry[0], entry[1]);
	});
};

Timeline.prototype.update = function() {
	if (initYear >= 2017) return;
	initYear += 0.005;
	const currYear = parseInt(initYear);
	const nextYear = currYear + 1;
	yearEntries = Object.entries(this.seed[currYear]).map(st => {
		return [st[0], map(initYear, currYear, nextYear, this.seed[currYear][st[0]], this.seed[nextYear][st[0]])];
	});
	max = Math.max(...yearEntries.filter(v => !!v[1]).map(v => v[1]));

	yearEntries.forEach(entry => {
		let wid = map(entry[1], 0, max, 0, width * 0.8);
		let cc = this.getBarByName(entry[0]);
		cc.val = entry[1];
		cc.w = wid;
	});

	if (this.swaps.length > 0) {
		this.swaps.forEach((sw, ind) => {
			const second = sw[1];
			const first = sw[0];
			this.bars[second].index -= 0.075;
			this.bars[first].index += 0.075;
			if (abs(this.bars[first].index - first) > 1) {
				this.bars[first].index = second;
				this.bars[second].index = first;

				var temp = this.bars[second];
				this.bars[second] = this.bars[first];
				this.bars[first] = temp;
				this.swaps.splice(ind, 1);
			}
		});
	} else {
		var i = 0;
		while (i < numBars - 1) {
			let me = this.bars[i];
			let him = this.bars[i + 1];

			if (him.w > me.w) {
				this.swaps.push([i, i + 1]);
				i += 2;
			} else {
				i += 1;
			}
		}
	}
};
Timeline.prototype.show = function() {
	background('white');
	textAlign(CENTER);
	textSize(30);
	fill(0);
	text("India's Top 15 States by GDP Timeline", width / 2 - 60, -0.08 * height);
	strokeWeight(1);
	stroke(210);
	fill(210);
	textSize(16);
	textAlign(LEFT);
	lines.forEach(li => {
		if (li > 0.2 * max) {
			var fue = map(li, 0, max, 0, width * 0.8);
			line(fue, -40, fue, height);
			text(`₹ ${li.toLocaleString('en-IN')} cr`, fue + 10, -20);
		}
	});
	noStroke();

	for (var i = 0; i < numBars; i++) {
		let thisbar = this.bars[i];
		thisbar.show();
	}
	// this.getBarByName('Bihar').update();
	textSize(120);
	fill(80);
	textAlign(CENTER);
	text(parseInt(initYear) + 1, width * 0.73, height * 0.71);
	textSize(14);
	fill(180);
	text('Source: NITI Aayog | Created by iashris.com', width * 0.73, height * 0.74);

	textSize(12);
};
Timeline.prototype.getBarByName = function(name) {
	return this.bars[Object.entries(this.bars).find(cmplx => cmplx[1].name == name)[0]];
};

var Bar = function(i, dna, name, val) {
	this.w = dna;
	this.name = name;
	this.index = i;
	this.r = colss[Number(i)][0];
	this.g = colss[Number(i)][1];
	this.b = colss[Number(i)][2];

	this.moveTrigger = false;
	this.moveTo = i;
	this.val = val;
};

Bar.prototype.show = function() {
	// if (this.index > numBarsToShow - 1) fill(`rgba(255, 0, 0, )`);
	fill(
		`rgba(${this.r},${this.g},${this.b},${constrain(map(this.index, numBarsToShow - 1, numBarsToShow, 1, 0), 0, 1)})`,
	);
	textSize(16);
	rect(0, rectSpace * this.index, this.w, rectHeight);
	fill(255);

	if (this.index < numBarsToShow) {
		textAlign(LEFT);
		text(`${vern[this.name]}`, 20, rectSpace * this.index + rectHeight * 0.65);
		textAlign(RIGHT);
		text(`${this.name}`, this.w - rectHeight / 2, rectSpace * this.index + rectHeight * 0.65);
		textAlign(LEFT);
		fill(0);
		text(
			`₹ ${parseInt(this.val).toLocaleString('en-IN')} cr`,
			this.w + rectHeight / 2,
			rectSpace * this.index + rectHeight * 0.65,
		);
	}
};
