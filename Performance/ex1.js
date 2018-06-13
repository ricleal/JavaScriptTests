const {
    performance
  } = require('perf_hooks');
  
let N = 5000000;
let x = [...Array(N).keys()];
let y = x^2;

// object with arrays
let obj = {
    x: x,
    y: y,
    res: []
};

let arrayOfobjects = [];

x.forEach(function(elem, index) {
    let yElem = y[index];
    arrayOfobjects.push({
        x: elem,
        y: yElem,
        res: null
    });
});


// performance functions
function funcOjectWithArrays(){
    obj.x.forEach(function(elem, index) {
        let yElem = obj.y[index];
        obj.res.push(elem*yElem);
    });
}

function funcArrayWithObjects(){
    arrayOfobjects.forEach(function(elem) {
        elem.res = elem.x * elem.y;
    });
}

let t0 = performance.now();
funcOjectWithArrays();
let t1 = performance.now();
console.log("Call to funcOjectWithArrays took " + (t1 - t0) + " milliseconds.")

t0 = performance.now();
funcArrayWithObjects();
t1 = performance.now();
console.log("Call to funcArrayWithObjects took " + (t1 - t0) + " milliseconds.")
