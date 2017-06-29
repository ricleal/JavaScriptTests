// http://mathjs.org/
var math = require('mathjs');

// generate x: 10 positions from 0 to 9
var x = Array.apply(null, Array(10)).map(function (x, i) { return i; });
console.log('x =', x);

var y_text = "x^2";
console.log('Using function =', y_text);
var y_parsed = math.parse(y_text);
var y_compiled = y_parsed.compile();

var y = x.map(function(el) {
    var scope = {
        x: el
    }
    return y_compiled.eval(scope);
});
console.log('y =', y);

/*
Plot
*/

var plotly = require('plotly')("ricleal", "uHg9cPUbVrbMCG1C6eJU");


var data = [
  {
    x: x,
    y: y,
    type: "scatter"
  }
];
var graphOptions = {filename: "plot", fileopt: "overwrite"};
plotly.plot(data, graphOptions, function (err, msg) {
    console.log(msg);
});