_"num :: num"
_"polynomials"

var int= Num.int;

var p = new Poly([int(1), int(5), int(7), int(3)]);

console.log(p.str());
console.log(p.evl(int(3)).str());
console.log(p.mul(p).str());
console.log(p.translate(int(3)).str());
console.log(p.descartes());

var p = new Poly([int(8), int(7), int(5), int(2)]);

console.log(p.table(int(-2), int(2), 10));
console.log(p.str('txt', '(x+a)'), p.tcf().map(function (el) {return el.str('txt', 'x');}));
var q = p.translate(Num.rat('-5/6'));
console.log(q.str());
console.log(p.descartes(), q.descartes(), p.translate(int(-2)).descartes() );
/*
var i, n = 10, q;
for (i = -5; i < n; i += 1) {
    q = p.translate(int(-i));
    console.log("x="+i, q.descartes(), q.str());
}
*/