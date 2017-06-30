f = new Function('name', 'return console.log("Hello, " + name + "!");');
f('Rick');

args = ["a1", "a2"];

var f2 = new Function(args, 'console.log(arguments.length); return (f(a1), f(a2));');
f2("Tic", "Tac");

