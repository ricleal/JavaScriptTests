/**
 * Generate Axis
 * 
 */

// generate x: 10 positions from 0 to 9
var x = Array.apply(null, Array(10)).map(function (x, i) { return i; });
console.log('x =', x);

// Generate y = x^2 + error
var y = x.map(function (i) {
    y_value = i*i;
    return y_value + Math.sqrt(y_value) * 2 * Math.random();
});
console.log('y =', y);

/**
 * Fitting
 * 
 */

var math = require('mathjs');
const LM = require('ml-levenberg-marquardt');

equation_to_fit_string = "a + b*x + c*x^2"

var n_parsed = math.parse(equation_to_fit_string);

var nodes_to_fit = n_parsed.filter(function(node) {
  return node.isSymbolNode && node.name != 'x';
});

var parameter_names_to_fit = nodes_to_fit.map(function(node) {
   return node.name;
});

console.log("parameter_names_to_fit:", parameter_names_to_fit);

var n_compiled = n_parsed.compile();

// TODO:
// Needs arguments here! Otherwise doesn't work!!!!

// fit function with arbitrary number of parameters
function fit_function(){
    console.log(arguments);
    if (arguments.length != parameter_names_to_fit.length){
        throw "arguments.length != parameter_names_to_fit.length";
    }
    var scope = {}
    for (i = 0; i < arguments.length; i++) {
        scope[parameter_names_to_fit[i]] = arguments[i];
    }

    return function(x) {
        scope['x']=x;
        //console.log(scope);
        return n_compiled.eval(scope);
    }
};

 
// array of initial parameter values for initial paramters to fit: all at 1
var initialValues = parameter_names_to_fit.map(function (x, i) { return 1.1; });
 
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

var fitted_params = LM(data, fit_function, options);

var fit_function_fitted = fit_function.apply(this, fitted_params.parameterValues);

var y_fitted = x.map(function(el) {
    return fit_function_fitted(el);
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