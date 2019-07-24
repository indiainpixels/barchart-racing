const toppers_of_this_year = function(year_obj) {
  let toRet = {};
  Object.entries(year_obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, numBarsToShow + 1)
    .forEach(topperEntry => {
      toRet[topperEntry[0]] = topperEntry[1];
    });
  return toRet;
};

const sanitize = function(seed) {
  //Given the initial data, it sees who are the top numToShow + 1 people each year and fills the years where the top people dont feature
  var toppers_of_each_year = {};
  for (let year in seed) {
    const result = toppers_of_this_year(seed[year]);
    toppers_of_each_year[year] = result;
  }
  let topper_names = [];
  for (year in toppers_of_each_year) {
    topper_names = [...new Set([...topper_names, ...Object.keys(toppers_of_each_year[year])])];
  }
  for (year in toppers_of_each_year) {
    const absenteeNames = topper_names.filter(name => !(name in toppers_of_each_year[year]));
    absenteeNames.forEach(absenteeName => {
      toppers_of_each_year[year][absenteeName] = seed[year][absenteeName];
    });
  }
  const toRet = {};
  for (year in toppers_of_each_year) {
    toRet[year] = {};
    for (topper in toppers_of_each_year[year]) {
      const toBeAdded = { val: toppers_of_each_year[year][topper] };
      if (shouldAssignIdentity) {
        // toBeAdded.team = aadhar[topper][keyInAadhaarObject];
        toBeAdded.team = "ABC";
      }
      toRet[year][topper] = toBeAdded;
    }
  }
  return toRet;
};
