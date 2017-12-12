/*

This is a prototype for SANS Stitching.
- It interpolates the non base from the X values in base
- Finds a constant that brings down the non base to base.

npm install --save-dev everpolate

Plot is here:
https://plot.ly/~ricleal/18/base-non-base-non-base-interpolated-non-base-scaled-final/

*/

var selection = {
  "brush-0" : {
    "D2O_m_Iq" : [
      {
        "x" : 0.0352623,
        "y" : 0.0678196,
        "e" : 0.00198224,
        "dx" : 0.00205003,
        "name" : "D2O_m_Iq"
      },
      {
        "x" : 0.0370254,
        "y" : 0.0674108,
        "e" : 0.00236517,
        "dx" : 0.00213886,
        "name" : "D2O_m_Iq"
      },
      {
        "x" : 0.0388766,
        "y" : 0.0677655,
        "e" : 0.00271668,
        "dx" : 0.00223271,
        "name" : "D2O_m_Iq"
      },
      {
        "x" : 0.0408205,
        "y" : 0.0671316,
        "e" : 0.00310426,
        "dx" : 0.0023318,
        "name" : "D2O_m_Iq"
      },
      {
        "x" : 0.0428615,
        "y" : 0.0670401,
        "e" : 0.00349956,
        "dx" : 0.00243638,
        "name" : "D2O_m_Iq"
      },
      {
        "x" : 0.0444534,
        "y" : 0.0675862,
        "e" : 0.00439751,
        "dx" : 0.00251828,
        "name" : "D2O_m_Iq"
      }
    ],
    "D2O_w_Iq" : [
      {
        "x" : 0.035875,
        "y" : 0.0774615,
        "e" : 0.00312078,
        "dx" : 0.00208084,
        "name" : "D2O_w_Iq"
      },
      {
        "x" : 0.0376688,
        "y" : 0.0710388,
        "e" : 0.00307189,
        "dx" : 0.00217142,
        "name" : "D2O_w_Iq"
      },
      {
        "x" : 0.0395522,
        "y" : 0.0735697,
        "e" : 0.00436064,
        "dx" : 0.00226708,
        "name" : "D2O_w_Iq"
      },
      {
        "x" : 0.0415298,
        "y" : 0.077966,
        "e" : 0.00267184,
        "dx" : 0.00236808,
        "name" : "D2O_w_Iq"
      },
      {
        "x" : 0.0436063,
        "y" : 0.0697489,
        "e" : 0.00346237,
        "dx" : 0.00247466,
        "name" : "D2O_w_Iq"
      },
      {
        "x" : 0.0446063,
        "y" : 0.0737489,
        "e" : 0.00346237,
        "dx" : 0.00247466,
        "name" : "D2O_w_Iq"
      },
      {
        "x" : 0.0457866,
        "y" : 0.0777815,
        "e" : 0.00218677,
        "dx" : 0.00258708,
        "name" : "D2O_w_Iq"
      }
    ]
  }
};

var base = selection['brush-0'].D2O_m_Iq;
var nonBase = selection['brush-0'].D2O_w_Iq;

var xBase = base.map(function(el) {
    return el.x;
});
var yBase = base.map(function(el) {
    return el.y;
});
var eBase = base.map(function(el) {
    return el.e;
});

var xNonBase = nonBase.map(function(el) {
    return el.x;
});
var yNonBase = nonBase.map(function(el) {
    return el.y;
});
var eNonBase = nonBase.map(function(el) {
    return el.e;
});

// Interpolation
var linear = require('everpolate').linear
var yNonBaseInterpolated = linear(xBase, xNonBase, yNonBase)

console.log("** Original Non base x,y values:")
console.log("x = ", xNonBase);
console.log("y = ", yNonBase);

console.log("** Interpolates Non base y values using base x values:")
console.log("x = ", xBase);
console.log("y = ", yNonBaseInterpolated)


// Now let's minimize the difference between: YBase and yNonBaseInterpolated

const LM = require('ml-levenberg-marquardt');

// Fitting/minimization function
function func(k) {
   return (y) => (y + k);
}

// array of initial parameter values for: a
var initialValues = [1];

const options = {
   damping: 0.001,
   initialValues: initialValues,
   gradientDifference: 0.1,
   maxIterations: 100,
   errorTolerance: 0.001
};

// Data to fit in the func above
var data = {
   x: yNonBaseInterpolated,
   y: yBase
};

var fitted_params = LM(data, func, options);
var k = fitted_params.parameterValues[0];

console.log("** Scaling value: K =", k)

var yNonBaseScaled = yNonBase.map(function(el) {
   return (el + k);
});

console.log('yNonBaseScaled =', yNonBaseScaled);

////
// Final curve:
// Concatenate and sort the arrays
xFinal = xBase.concat(xNonBase);
yFinal = yBase.concat(yNonBaseScaled);
eFinal = eBase.concat(eNonBase);

//1) combine the arrays:
var list = [];
for (var j = 0; j < xFinal.length; j++) 
    list.push({'x': xFinal[j], 'y': yFinal[j], 'e': eFinal[j]});

//2) sort:
list.sort(function(a, b) {
    return ((a.x < b.x) ? -1 : ((a.x == b.x) ? 0 : 1));
});

//3) separate them back out:
for (var k = 0; k < list.length; k++) {
    xFinal[k] = list[k].x;
    yFinal[k] = list[k].y;
    eFinal[k] = list[k].e;
}


/**
* Plotting
* 
*/

var plotly = require('plotly')("ricleal", "uHg9cPUbVrbMCG1C6eJU");

var trace1 = {
   x: xBase,
   y: yBase,
   type: "scatter",
   mode: 'lines+markers',
   name: 'base',
};

var trace2 = {
   x: xNonBase,
   y: yNonBase,
   type: "scatter",
   mode: 'lines+markers',
   name: 'non-base'
};

var trace3 = {
    x: xBase,
    y: yNonBaseInterpolated,
    type: "scatter",
    mode: 'markers',
    name: 'non-base-interpolated',
    marker: {symbol: "square"}
 };

 var trace4 = {
    x: xNonBase,
    y: yNonBaseScaled,
    type: "scatter",
    mode: 'lines+markers',
    name: 'non-base-scaled',
    marker: {symbol: "cross"}
 };

 var trace5 = {
    x: xFinal,
    y: yFinal,
    error_y: {
        type: 'data',
        array: eFinal,
        visible: true
    },
    type: "scatter",
    mode: 'lines+markers',
    name: 'final',
    line: {
        width: 4,
        dash:'dot'
    },
    marker: {
        symbol: "circle-open",
        size: 7
    }
 };

var data_to_plot = [trace1, trace2, trace3, trace4, trace5];

var graphOptions = {filename: "plot", fileopt: "overwrite"};
plotly.plot(data_to_plot, graphOptions, function (err, msg) {
   console.log(msg);
});