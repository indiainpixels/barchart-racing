let numBars;
let rectSpace;
let rectHeight;
let allYears;
let yearNow;
let yearIndex;
let progress = 0; // in frameCount
let yearEntries = [];
let max = 0;

var Timeline = function(seed) {
	//Ensure all have the same keys
	let allPeeps = [];
	for (yr in seed) {
		allPeeps = [...new Set([...allPeeps, ...Object.keys(seed[yr])])];
	}
	for (yr in seed) {
		const foreign = allPeeps.filter(v => !(v in seed[yr]));
		foreign.forEach(v => {
			seed[yr][v] = 0;
		});
	}
	this.primeColor = null;
	this.seed = seed;
	this.bars = {};
	this.swaps = [];

	allYears = Object.keys(seed).map(v => parseInt(v));
	yearIndex = 0;
	yearNow = allYears[yearIndex];

	numBars = Object.keys(seed[yearNow]).length;
	rectSpace = (height * 0.75) / numBarsToShow;
	rectHeight = 0.85 * rectSpace;
	yearEntries = Object.entries(seed[yearNow]).sort((a, b) => b[1] - a[1]);
	max = Math.max(...yearEntries.filter(v => !!v[1]).map(v => v[1]));

	yearEntries.forEach((entry, i) => {
		let wid = map(entry[1], 0, max, 0, width * 0.8);
		this.bars[i] = new Bar(i, wid, entry[0], entry[1]);
	});
};

Timeline.prototype.update = function() {
	const currYearIndex = allYears.findIndex(v => v > yearNow) - 1;
	if (currYearIndex >= 0) {
		yearNow += speed;
		const currYear = allYears[currYearIndex];
		const nextYear = allYears[currYearIndex + 1];

		yearEntries = Object.entries(this.seed[currYear]).map(st => {
			return [
				st[0],
				Number(map(yearNow, currYear, nextYear, this.seed[currYear][st[0]] || 0, this.seed[nextYear][st[0]] || 0)),
			];
		});
		//console.log(yearEntries);
		max = Math.max(...yearEntries.filter(v => !isNaN(v[1])).map(v => Number(v[1])));
		yearEntries.forEach((entry, index) => {
			let cc = this.getBarByName(entry[0]);
			let wid = map(entry[1], 0, max, 0, width * 0.8);
			cc.val = entry[1];
			cc.w = wid;
			// if (index > numBarsToShow && cc.index > numBarsToShow) {
			// 	cc.index = index;
			// 	//this.bars[i] = v;
			// }
		});
		sortQual = {};
		for (var i = numBarsToShow; i < Object.keys(this.bars).length; i++) {
			sortQual[i] = this.bars[i];
			//console.log(i);
		}
		Object.values(sortQual)
			.sort((a, b) => b.val - a.val)
			.forEach((v, i) => {
				v.index = numBarsToShow + i;
				this.bars[numBarsToShow + i] = v;
			});
		// Object.values(this.bars)
		// 	.sort((a, b) => b.val - a.val)
		// 	.forEach((v, i) => {
		// 		if (i > numBarsToShow && v.index > numBarsToShow) {
		// 			v.index = i;
		// 			this.bars[i] = v;
		// 		}
		// 	});
	}
	if (this.swaps.length > 0) {
		this.swaps.forEach((sw, ind) => {
			const first = sw[0];
			const second = sw[1];

			//Just swap
			if (this.bars[first].index > numBarsToShow && this.bars[second].index > numBarsToShow) {
				this.bars[first].index = second;
				this.bars[second].index = first;
				var temp = this.bars[second];
				this.bars[second] = this.bars[first];
				this.bars[first] = temp;
				this.swaps.splice(ind, 1);
			} else {
				this.bars[second].index -= 0.075;
				this.bars[first].index += 0.075;
				if (abs(this.bars[first].index - first) > second - first) {
					this.bars[first].index = second;
					this.bars[second].index = first;
					var temp = this.bars[second];
					this.bars[second] = this.bars[first];
					this.bars[first] = temp;
					this.swaps.splice(ind, 1);
				}
			}
		});
	} else {
		var i = 0;
		while (i < numBarsToShow) {
			let me = this.bars[i];
			let him = this.bars[i + 1];
			if (him.w > me.w) {
				this.swaps.push([i, i + 1]);
				i += 2;
			} else {
				i += 1;
			}
		}
		// Agar bar ka sorted value and index value are both above 25, set index as sorted,
	}
};
Timeline.prototype.show = function() {
	textFont('Karma');
	background('white');
	textAlign(CENTER);
	textSize(38);
	fill(0);
	text(projectTitle, width / 2 - 60, -0.06 * height);
	textFont('Lato');
	strokeWeight(1);
	stroke(210);
	fill(210);
	textSize(15);
	textAlign(LEFT);
	lines.forEach(li => {
		if (li.v > 0.2 * max) {
			var fue = map(li.v, 0, max, 0, width * 0.8);
			line(fue, -30, fue, height);
			text(`₹ ${li.v.toLocaleString('en-IN')}`, fue + 10, -10);
			//text(`${li.l}`, fue + 10, -10);
		}
	});
	noStroke();
	for (var i = 0; i < numBars; i++) {
		let thisbar = this.bars[i];
		if (i < numBarsToShow) thisbar.show();
		//thisbar.show();
	}
	textSize(120);
	fill(this.primeColor);
	textAlign(CENTER);
	text(parseInt(yearNow), width * 0.73, height * 0.69);
	// rect(width * 0.7, height * 0.705, , 10));
	const maxw = textWidth('1993') * 1.15;
	const ww = map(yearNow - parseInt(yearNow), 0, 1, 0, maxw);
	fill(230);
	rect(width * 0.625, height * 0.705, maxw, 6);
	fill(this.primeColor);
	rect(width * 0.625, height * 0.705, ww, 6);
	textSize(14);
	fill(180);
	text(sourceTitle, width * 0.73, height * 0.74);

	textSize(12);
};
Timeline.prototype.getBarByName = function(name) {
	return this.bars[Object.entries(this.bars).find(cmplx => cmplx[1].name == name)[0]];
};

var Bar = function(i, dna, name, val, nation) {
	this.w = dna;
	this.name = name;
	this.index = i;

	this.r = colss[i][0];
	this.g = colss[i][1];
	this.b = colss[i][2];

	this.val = val;
	this.country = nation;
};

Bar.prototype.show = function() {
	fill(
		`rgba(${this.r},${this.g},${this.b},${constrain(map(this.index, numBarsToShow - 1, numBarsToShow, 1, 0), 0, 1)})`,
	);
	if (this.index === 0) timeline.primeColor = `rgb(${this.r},${this.g},${this.b})`;
	rect(0, rectSpace * this.index, this.w, rectHeight);
	fill(255);

	if (this.index < numBarsToShow) {
		textAlign(RIGHT);
		fill(255);

		textSize(21);
		const name = this.name;
		text(name, this.w - rectHeight / 2, rectSpace * this.index + rectHeight * 0.65);

		textAlign(LEFT);
		textSize(18);
		//if (textWidth(this.country) + textWidth(name) < 0.6 * this.w)
		// fill(
		// 	`rgba(255,255,255,${constrain(
		// 		map(textWidth(this.country) + textWidth(name), 0.5 * this.w, 0.8 * this.w, 1, 0),
		// 		0,
		// 		1,
		// 	)})`,
		// );
		//text(`${this.country}`, 20, rectSpace * this.index + rectHeight * 0.65);

		textSize(16);

		fill(0);
		text(
			//changed here
			//TODO
			`₹ ${parseInt(this.val).toLocaleString('en-IN')}`,
			this.w + rectHeight / 2,
			rectSpace * this.index + rectHeight * 0.65,
		);
	}
};
