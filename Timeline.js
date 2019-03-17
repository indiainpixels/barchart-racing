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
const usd = {
	'2003': 46.58,
	'2004': 45.32,
	'2005': 44.1,
	'2006': 45.31,
	'2007': 41.35,
	'2008': 43.51,
	'2009': 48.41,
	'2010': 45.73,
	'2011': 46.67,
	'2012': 53.44,
	'2013': 56.57,
	'2014': 62.33,
	'2015': 62.97,
	'2016': 66.46,
	'2017': 67.79,
	'2018': 70.09,
};
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
		foreign.forEach(v => (seed[yr][v] = { runs: 0 }));
	}
	this.seed = seed;
	this.bars = {};
	this.swaps = [];

	allYears = Object.keys(seed).map(v => parseInt(v));
	yearIndex = 0;
	yearNow = allYears[yearIndex];

	numBars = Object.keys(seed[yearNow]).length;
	rectSpace = (height * 0.75) / numBarsToShow;
	rectHeight = 0.85 * rectSpace;
	yearEntries = Object.entries(seed[yearNow]).sort((a, b) => b[1].runs - a[1].runs);
	max = Math.max(...yearEntries.filter(v => !!v[1]).map(v => v[1].runs));

	yearEntries.forEach((entry, i) => {
		let wid = map(entry[1].runs, 0, max, 0, width * 0.8);
		this.bars[i] = new Bar(i, wid, entry[0], entry[1].runs);
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
				Number(
					map(yearNow, currYear, nextYear, this.seed[currYear][st[0]].runs || 0, this.seed[nextYear][st[0]].runs || 0),
				),
			];
		});
		//console.log(yearEntries);
		max = Math.max(...yearEntries.filter(v => !isNaN(v[1])).map(v => Number(v[1])));
		//console.log(this.swaps.length);
		// noLoop();
		// return;
		//this should happen only for like top 50 -- sort then forEach?
		yearEntries
			.sort((a, b) => b[1] - a[1])
			.forEach((entry, index) => {
				let cc = this.getBarByName(entry[0]);
				cc.sorted = index;

				let wid = map(entry[1], 0, max, width * 0.15, width * 0.8);
				cc.val = entry[1];
				cc.w = wid;
			});
		// console.log(frameCount);
		// if (frameCount == 300) {
		// 	console.log(this.bars);
		// 	noLoop();
		// 	return;
		// }
	}
	if (this.swaps.length > 0) {
		this.swaps.forEach((sw, ind) => {
			const movetoIndex = sw[1];
			const toMoveIndex = sw[2];
			const moveeName = sw[0];
			const movee = this.getBarByName(moveeName);

			movee.index -= 0.075;
			//console.log(toMoveIndex);
			const buddy = this.bars[toMoveIndex];
			buddy.index += 0.075;

			if (abs(buddy.index - toMoveIndex) > 1) {
				movee.index = toMoveIndex;
				buddy.index++;
				var temp = this.bars[toMoveIndex];
				this.bars[toMoveIndex] = this.bars[toMoveIndex + 1];
				this.bars[toMoveIndex + 1] = temp;

				const newtoMove = toMoveIndex - 1;
				if (newtoMove === -1 || newtoMove === movetoIndex - 1) {
					this.swaps.splice(ind, 1);
				} else {
					this.swaps[index][2] = newtoMove;
				}
			}
			//If these are visual bars, do the incremental thing, else just flip
			// if (this.bars[first].index > 20 && this.bars[second].index > 20) {
			// 	this.bars[first].index = second;
			// 	this.bars[second].index = first;
			// 	var temp = this.bars[second];
			// 	this.bars[second] = this.bars[first];
			// 	this.bars[first] = temp;
			// 	this.swaps.splice(ind, 1);
			// } else {

			// this.bars[second].index -= 0.075;
			// this.bars[first].index += 0.075;
			// if (abs(this.bars[first].index - first) > second - first) {
			// 	this.bars[first].index = second;
			// 	this.bars[second].index = first;
			// 	var temp = this.bars[second];
			// 	this.bars[second] = this.bars[first];
			// 	this.bars[first] = temp;
			// 	this.swaps.splice(ind, 1);
			// }
			//}
		});
	} else {
		var i = 0;
		while (i < numBars - 1) {
			let me = this.bars[i];

			//Find the element with lower index which is actually smaller than me
			let himindex = i - 1;
			while (himindex >= 0) {
				if (this.bars[himindex].w > me.w) {
					himindex = himindex + 1;
					break;
				}
				himindex--;
			}

			if (himindex != i && himindex != -1) {
				this.swaps.push([me.name, himindex, i - 1]);
			}
			i++;
			// const himindex = this.bars.findIndex((v, ii) => ii < i && v.w > me.w);

			// let him = this.bars[him];
			// if (him.w > me.w) {
			// 	this.swaps.push([i, i + 1]);
			// 	i += 2;
			// } else {
			// 	i += 1;
			// }
		}
		// Agar bar ka sorted value and index value are both above 25, set index as sorted,
	}
	// for (barindex in this.bars) {
	// 	bar = this.bars[barindex];
	// 	if (bar.index > 25 && bar.sorted > 25) {
	// 		bar.index = bar.sorted;

	// 		var temp = this.bars[bar.sorted];
	// 		this.bars[bar.sorted] = bar;
	// 		this.bars[barindex] = temp;
	// 	}
	// }
};
Timeline.prototype.show = function() {
	background('white');
	textAlign(CENTER);
	textSize(30);
	fill(0);
	text(projectTitle, width / 2 - 60, -0.08 * height);
	strokeWeight(1);
	stroke(210);
	fill(210);
	textSize(14);
	textAlign(LEFT);
	// lines.forEach(li => {
	// 	if (li.v / 100 > (0.2 * max) / 100) {
	// 		var fue = map(li.v / 100, 0, max, width * 0.15, width * 0.8);
	// 		line(fue, -40, fue, height);
	// 		text(`₹ ${li.v.toLocaleString('en-IN')} cr`, fue + 10, -30);
	// 		text(`GDP of ${li.l}`, fue + 10, -10);
	// 	}
	// });
	noStroke();

	for (var i = 0; i < numBars; i++) {
		let thisbar = this.bars[i];
		//if (i < 20) thisbar.show();
		thisbar.show();
	}
	// this.getBarByName('Bihar').update();
	textSize(120);
	fill(80);
	textAlign(CENTER);
	text(parseInt(yearNow), width * 0.73, height * 0.71);
	textSize(14);
	fill(180);
	text(sourceTitle, width * 0.73, height * 0.74);

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
	this.sorted = i;
};

Bar.prototype.show = function() {
	// if (this.index > numBarsToShow - 1) fill(`rgba(255, 0, 0, )`);
	// fill(
	// 	`rgba(${this.r},${this.g},${this.b},${constrain(map(this.index, numBarsToShow - 1, numBarsToShow, 1, 0), 0, 1)})`,
	// );
	if (this.index > 25) fill(255, 0, 0);
	else fill(0, 255, 0);
	textSize(16);
	rect(0, rectSpace * this.index, this.w, rectHeight);
	fill(255);

	if (this.index < numBarsToShow) {
		// textAlign(LEFT);
		// text(`${vern[this.name]}`, 20, rectSpace * this.index + rectHeight * 0.65);

		textAlign(RIGHT);
		fill(255);

		const name = this.name;
		text(name, this.w - rectHeight / 2, rectSpace * this.index + rectHeight * 0.65);
		textSize(12);
		textAlign(LEFT);

		textSize(16);

		fill(0);
		text(
			//changed here
			//TODO
			`${parseInt(this.index).toLocaleString('en-IN')}`,
			this.w + rectHeight / 2,
			rectSpace * this.index + rectHeight * 0.65,
		);
	}
};
