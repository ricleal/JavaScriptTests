var levenbergMarquardt = require('ml-levenberg-marquardt');
var RegressionBase = require('ml-regression-base');


function linearFit(m, b) { return (t) => (m * t + b); }

var data = {
  x : [
    0.005, 0.01,  0.015, 0.02,  0.025, 0.03,  0.035, 0.04,  0.045,
    0.05,  0.055, 0.06,  0.065, 0.07,  0.075, 0.08,  0.085, 0.09,
    0.095, 0.1,   0.105, 0.11,  0.115, 0.12,  0.125, 0.13,  0.135,
    0.14,  0.145, 0.15,  0.155, 0.16,  0.165, 0.17,  0.175
  ],
  y : [
    1.059053, 0.820483, 0.889606, 0.695512, 0.578699, 0.527058, 0.541055,
    0.585198, 0.484689, 0.513663, 0.412635, 0.380731, 0.351293, 0.324131,
    0.29907,  0.271001, 0.25461,  0.234924, 0.21676,  0.216298, 0.184536,
    0.177404, 0.145856, 0.124078, 0.121299, 0.123407, 0.126478, 0.110142,
    0.096938, 0.091407, 0.086616, 0.076146, 0.072392, 0.071292, 0.060748
  ]
};

const options = {
  damping : 0.01,
  initialValues : [ 1, 3 ],
  gradientDifference: 10e-2,
  maxIterations: 100,
  errorTolerance: 10e-3
};

var ans = levenbergMarquardt(data, linearFit, options);

class MyRegression extends RegressionBase.default {
  constructor(m, b) {
      super();
      this.m = m;
      this.b = b;
      console.log()
  }
  _predict(x) {
      return linearFit(this.m, this.b)(x);
  }
  toString() {
      return `f(x) = x * ${this.m} + ${this.b}`;
  }
}

m = new MyRegression(ans.parameterValues[0], ans.parameterValues[1])
m.predict(data.x)
console.log(m.score(data.x, data.y))