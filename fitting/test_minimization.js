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
    return y_value + Math.sqrt(y_value) * 2 * Math.random();
});
console.log('y =', y);

/**
 * Fitting
 * 
 */

const LM = require('ml-levenberg-marquardt');
 
// function that receives the parameters and returns 
// a function with the independent variable as a parameter 

// 2 options:
// either as simple function
function poly(a, b, c) {
    console.log(arguments);
    // Same as:
    //return function(x){ console.log(a,b,c,x); return (a + b*x + c*x*x) }
    return (x) => (a + b*x + c*x*x);
}
// or using mathjs
function poly_text(a,b,c){
    var f_text = "a + b*x + c*x*x";
    var f_parsed = math.parse(f_text);
    var f_compiled = f_parsed.compile();
    return function(x) {
        scope = {
            a:a,
            b:b,
            c:c,
            x:x
        }
        return f_compiled.eval(scope);
    }
};
 
// array of initial parameter values for: a,b,c
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

console.log('y_fitted =', y_fitted);

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