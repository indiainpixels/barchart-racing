// @ts-nocheck
var Timeline = function (seedx) {
  //seedx is a year wise hash: {1951:{A:2,B:3,C:8}, 1962:{A:8,B:11, C:43}}
  const seed = sanitize(seedx);
  this.primeColor = null;
  this.seed = seed;
  this.emoji = null;
  this.bars = {};
  this.swaps = [];
  this.init();
};

Timeline.prototype.init = function () {
  yearIndex = 0;
  allYears = Object.keys(this.seed).map((yearString) => parseInt(yearString));
  yearNow = allYears[yearIndex];
  numBars = Object.keys(this.seed[yearNow]).length;
  rectSpace = (height * 0.75) / numBarsToShow;
  rectHeight = 0.85 * rectSpace;
  yearEntries = Object.entries(this.seed[yearNow]).sort(
    (a, b) => b[1].val - a[1].val
  );
  max = Math.max(...yearEntries.filter((v) => !!v[1].val).map((v) => v[1].val));
  yearEntries.forEach((entry, index) => {
    let wid = map(
      entry[1].val,
      0,
      max,
      width * zeroBarOffset,
      width * fullMaxVal
    );
    this.bars[index] = new Bar(index, wid, entry[0], entry[1]);
  });
};

Timeline.prototype.update = function () {
  const currYearIndex = allYears.findIndex((v) => v > yearNow) - 1;
  if (currYearIndex >= 0) {
    yearNow += speed;
    const currYear = allYears[currYearIndex];
    const nextYear = allYears[currYearIndex + 1];

    yearEntries = Object.entries(this.seed[currYear]).map((st) => {
      return [
        st[0],
        Number(
          map(
            yearNow,
            currYear,
            nextYear,
            this.seed[currYear][st[0]].val || 0,
            this.seed[nextYear][st[0]].val || 0
          )
        ),
      ];
    });
    //console.log(yearEntries);
    max = Math.max(
      ...yearEntries.filter((v) => !isNaN(v[1])).map((v) => Number(v[1]))
    );
    yearEntries.forEach((entry, index) => {
      let cc = this.getBarByName(entry[0]);
      let wid = map(
        entry[1],
        0,
        max,
        width * zeroBarOffset,
        width * fullMaxVal
      );
      cc.val = entry[1];
      cc.w = wid;
    });
    sortQual = {};
    for (var i = numBarsToShow; i < Object.keys(this.bars).length; i++) {
      sortQual[i] = this.bars[i];
    }
    Object.values(sortQual)
      .sort((a, b) => b.val - a.val)
      .forEach((v, i) => {
        v.index = numBarsToShow + i;
        this.bars[numBarsToShow + i] = v;
      });
  }
  if (this.swaps.length > 0) {
    this.swaps.forEach((sw, ind) => {
      const first = sw[0];
      const second = sw[1];

      if (
        this.bars[first].index > numBarsToShow &&
        this.bars[second].index > numBarsToShow
      ) {
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
  }
};
Timeline.prototype.show = function () {
  textFont('GraphikBold');
  textAlign(CENTER);
  textSize(38);
  fill(0);
  text(projectTitle, width / 2 - 60, -0.06 * height);
  textFont('Graphik');
  strokeWeight(1);
  stroke(210);
  fill(170);
  textSize(15);
  textAlign(LEFT);
  lines.forEach((li) => {
    if (li.v > 0.2 * max) {
      var fue = map(li.v, 0, max, width * zeroBarOffset, width * fullMaxVal);
      line(fue, -30, fue, height);
      text(`${li.v.toLocaleString('en-IN')}`, fue + 10, -10);
    }
  });
  noStroke();
  for (var i = 0; i < numBars; i++) {
    let thisbar = this.bars[i];
    if (i < numBarsToShow) thisbar.show();
  }
  fill(this.primeColor);
  textAlign(CENTER);
  textSize(200);
  text(this.emoji, width * 0.73, height * 0.53);
  textSize(120);
  textFont('GraphikBold');
  text(parseInt(yearNow), width * 0.73, height * 0.63);
  const maxw = textWidth('1993   ') * 1.15;
  const ww = map(yearNow - parseInt(yearNow), 0, 1, 0, maxw);
  fill(230);
  rect(width * 0.625, height * 0.64, maxw, 6);
  fill(this.primeColor);
  rect(width * 0.625, height * 0.64, ww, 6);
  image(
    subscribe,
    -38,
    height * -0.1,
    subscribe.width * 0.7,
    subscribe.height * 0.7
  );
  textSize(18);
  fill(150);

  text(sourceTitle, width * 0.73, height * 0.68);
  textSize(12);
};
Timeline.prototype.getBarByName = function (name) {
  return this.bars[
    Object.entries(this.bars).find((cmplx) => cmplx[1].name == name)[0]
  ];
};

var Bar = function (i, assigned_width, name, entity) {
  //entity is {val: 43, team:'XYZ'}
  this.val = entity.val;
  this.team = entity.team;

  this.index = i;
  this.w = assigned_width;
  this.name = name;

  // Assign 😏😍🇮🇳 if present in mapping
  console.log(this.team);
  //this.emoji = mapping[this.team].emoji;

  let pickedCol;
  if (shouldAssignIdentity) {
    pickedCol = mapping[this.team].color;
  } else {
    pickedCol = randomColors?.[i] || [0, 0, 0];
  }
  this.r = pickedCol[0];
  this.g = pickedCol[1];
  this.b = pickedCol[2];
};

Bar.prototype.show = function () {
  fill(
    `rgba(${this.r},${this.g},${this.b},${constrain(
      map(this.index, numBarsToShow - 1, numBarsToShow, 1, 0),
      0,
      1
    )})`
  );
  if (this.index === 0) {
    timeline.primeColor = `rgb(${this.r},${this.g},${this.b})`;
    timeline.emoji = this.emoji;
  }
  rect(0, rectSpace * this.index, this.w, rectHeight);
  fill(255);

  if (this.index < numBarsToShow) {
    textAlign(RIGHT);
    fill(255);
    textSize(18);
    const name = this.name;
    text(
      name,
      this.w - rectHeight / 2,
      rectSpace * this.index + rectHeight * 0.7
    );

    textAlign(LEFT);
    if (shouldAssignIdentity && shouldShowIdentity) {
      textSize(14);
      // Opacity depends on the width of bar. If it is short, the teamName wont be shown.
      const opacity = constrain(
        map(
          textWidth(this.team) + textWidth(name),
          0.5 * this.w,
          0.8 * this.w,
          1,
          0
        ),
        0,
        1
      );
      fill(`rgba(255,255,255,${opacity})`);
      text(`${this.team}`, 20, rectSpace * this.index + rectHeight * 0.65);
    }
    textSize(16);
    const barValueToShow = `${parseInt(this.val).toLocaleString('en-IN')}`;
    fill(0);
    text(
      barValueToShow,
      this.w + rectHeight / 2,
      rectSpace * this.index + rectHeight * 0.65
    );
  }
};
