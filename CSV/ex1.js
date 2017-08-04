/*

npm install --save-dev babyparse

*/
fs = require('fs');
bp = require('babyparse');


config = {
	delimiter: "",	// auto-detect
	newline: "",	// auto-detect
    quoteChar: '"',
    //
	header: true,
	dynamicTyping: false,
	preview: 0,
	encoding: "",
	worker: false,
	comments: false,
	step: undefined,
	complete: undefined,
	error: undefined,
	download: false,
	skipEmptyLines: false,
	chunk: undefined,
	fastMode: undefined,
	beforeFirstChunk: undefined,
	withCredentials: undefined
}

fs.readFile('/home/rhf/git/sns-plot-fit/src/assets/datasets/b_data/CG2_exp158_scan0039_0001_Iq.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  var results = bp.parse(data);
  console.log(results);
});


fs.readFile('/home/rhf/git/sns-plot-fit/src/assets/datasets/b_data/Si_8m12A_abs_1.txt', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  var results = bp.parse(data, config);
  console.log(results);
});