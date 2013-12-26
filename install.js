/*global require*/
var spawn = require('child_process').spawn;

spawn('cp', ["node_modules/math-numbers/index.js", "ghpages/mathnum.js"]);