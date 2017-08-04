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

const math = require('mathjs');
const LM = require('ml-levenberg-marquardt');

// This is typed by the user in any valid format
equation_to_fit_string = "10 + a + b*x + c*x^2"

// Mathjs works like this:
//math.parse("x^2").compile().eval({x:2})
// returns: 4

// Parse the string. We might need some validation here
var n_parsed = math.parse(equation_to_fit_string);

// Coefficients as nodes
// here I'm getting all variables to fit and remove x!
// May be the validation goes here
var nodes_to_fit = n_parsed.filter(function(node) {
  return node.isSymbolNode && node.name != 'x';
});

// Coefficients as strings
// Let's transform the nodes into an array of string
// If those are defined as 'var', node scope gets nuts
parameter_names_to_fit = nodes_to_fit.map(function(node) {
   return node.name;
});

console.log("parameter_names_to_fit:", parameter_names_to_fit);

// need to compile before evaluating
n_compiled = n_parsed.compile();

// fitting function
// Needs to be written like this because we have no idea
// What are the arguments that we getting
// Note that it returns a function that allows to vary x!
var fit_function = new Function(parameter_names_to_fit,
    'var scope = {};\
    for (i = 0; i < arguments.length; i++) {\
        scope[parameter_names_to_fit[i]] = arguments[i];\
    }\
    return function(x) {\
        scope.x=x;\
        return n_compiled.eval(scope);\
    }'
);

 
// array of initial parameter values for initial paramters to fit: all at 1
var initialValues = parameter_names_to_fit.map(function (x, i) { return 1.0; });

// LM options. We might need to adapt some of these values
const options = {
    damping: 1.5,
    initialValues: initialValues,
    gradientDifference: 10e-2,
    maxIterations: 200,
    errorTolerance: 10e-3
};

// array of points to fit 
// Those are the points that we whant to fit!
var data = {
    x: x,
    y: y
};

// Fitting
var fitted_params = LM(data, fit_function, options);
console.log("---- Fitted Parameters ---")
for (i = 0; i < parameter_names_to_fit.length; i++) {
    console.log(parameter_names_to_fit[i], "=", fitted_params.parameterValues[i])
}
console.log("Error =", fitted_params.parameterError)
console.log("Iterations =", fitted_params.iterations)
console.log("--------------------------")
// Get's the fitted function from the fitted parameters
// only coefficients are set! Remember it returns a function!)
var fit_function_fitted = fit_function.apply(this, fitted_params.parameterValues);

var y_fitted = x.map(function(el) {
    return fit_function_fitted(el);
});

console.log('y_fitted =', y_fitted);

/**
 * Plotting
 * Plotly in node sucks. it sends the plot to a remote location.
 * Need to find something for debugging....
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