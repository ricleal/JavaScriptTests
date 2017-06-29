/**
 * Generate Axis
 * 
 */

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
    };
    y_value = y_compiled.eval(scope);
    // Add some error on Y
    return y_value + Math.sqrt(y_value) * Math.random();
});
console.log('y =', y);

/**
 * Fitting
 * 
 */

// import library 
const LM = require('ml-levenberg-marquardt');
 
// function that receives the parameters and returns 
// a function with the independent variable as a parameter 
function poly (a, b, c) {
  return (x) => (a + b*x + c*x*x);
}
 
// array of initial parameter values 
var initialValues = [1,1,1];
 
const options = {
    damping: 1.5,
    initialValues: initialValues,
    gradientDifference: 10e-2,
    maxIterations: 100,
    errorTolerance: 10e-3
};

// array of points to fit 
var data = {
    x: x,
    y: y
};

var fitted_params = LM(data, poly, options);

var poly_func = poly.apply(this, fitted_params.parameterValues);

var y_fitted = x.map(function(el) {
    return poly_func(el);
});

/**
 * Plotting
 * 
 */

var plotly = require('plotly')("ricleal", "uHg9cPUbVrbMCG1C6eJU");

var trace1 = {
    x: x,
    y: y,
    type: "scatter",
    mode: 'markers',
    name: 'raw'
};

var trace2 = {
    x: x,
    y: y_fitted,
    type: "scatter",
    mode: 'lines',
    name: 'fitted'
};

var data_to_plot = [trace1, trace2];

var graphOptions = {filename: "plot", fileopt: "overwrite"};
plotly.plot(data_to_plot, graphOptions, function (err, msg) {
    console.log(msg);
});