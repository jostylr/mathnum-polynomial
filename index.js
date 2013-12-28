/*global require, process, module*/

var Num = require('math-numbers');

var Poly = function (arr, options) {
        var prop;
        this.coef = [].concat(arr);
        if (options) {
            for (prop in options) {
                this[prop] = options[prop];
            }
        }
        return this;
    };

var pp = Poly.prototype;

var int = Num.int;
var bin = _"binomial coefficients |ife()";

var poly = pp.poly = (function ( Poly ) {
     return function (arr, options) {
        return new Poly(arr, options); 
    };
    } ( Poly ) );
pp.str = function (type, v) {
        var a;
        var p = this.coef, i, n= p.length, terms, start, end;
        type = type || "txt";
        v = v || this.v || "x";  // (typeof v === "undefined") ? "x" : v;
        switch (type) {
            case "asciimath" :
                start = "^";
                end = "";
            break;
            case "tex" : 
                start = "^{";
                end = "}";
            break;
            case "html": 
                start = "<sup>";
                end = "</sup>";
            break;
            default :  //includes txt case
                start = "^";
                end = "";
            break;
        }
        if ( n === 0) {
            return '';
        }
        if ( n === 1) {
            return  p[0].str(type);
        }
        if (n === 2) {
            terms = [p[1].str(type)+ v];
            a = p[0];
            if (! a.eq(a.zero()) ) {
                terms.push( (a.sign() ? '' : ' + ') + a.str(type));
            }
            return terms.join('');
        } 
        a = p[n-1];
        terms = [a.str(type) + v + start+(n-1)+end];
        for (i = n-1; i-- > 2; ) { // starts at index n-2, second to last entry
            a = p[i]; 
            if (! a.eq(a.zero()) ) {
                terms.push( (a.sign() ? '' : ' + ') + a.str(type) + v+ start+i+end);
            } 
        }
        a = p[1]; 
        if ((! a.eq(a.zero()) ) ) {
            terms.push( (a.sign() ? '' : ' + ') + a.str(type) + v);
        } 
        a = p[0]; 
        if (! a.eq(a.zero()) ) {
            terms.push( (a.sign() ? '' : ' + ') + a.str(type));
        } 
        return terms.join('');
    };
pp.evl = function (a) {
        var p = this.coef, i, n = p.length, cur = a.zero(), mid, coef;
        for (i = n-1; i > -1; i -= 1) {
            coef = p[i];
            mid = cur.mul(a);
            cur = coef.add(mid);
        }
        return cur;         
    };
pp.fun = function () {
        var p = this;
        var f = function (input) {
            p.evl(input); 
        };
        f.poly = p;
        return f;
    };
pp.add = function (right) {
        var ret = [].concat(this.coef);
        var rc = right.coef;
        var zero = rc[0].zero();
        var i, n = rc.length;
        for (i = 0; i <n; i += 1) {
            ret[i] =  (ret[i] || zero).add(rc[i]);
        }
        return poly(ret);
    };
pp.shift = function (n) {
        var coef = this.coef, i;
        var zero = coef[0].zero();
        var ret;
        if (n > 0) {
            ret = [];
            for (i = 0; i < n; i += 1) {
                ret.push(zero);
            }
            ret = ret.concat(coef);
        } else {
            ret = coef.slice(Math.abs(n));
        }
        return poly(ret);
    };
pp.neg = function () {
        return poly(this.coef.map(function (el) {
            return el.neg();
        }  )  );
    };
pp.flip = function () {
        var i, p = this.coef, n = p.length, ret = [];
        for ( i = 0 ; i < n ; i += 2 ) {
            ret[i] = p[i];
        }
        for ( i = 1 ; i < n ; i += 2 ) {
            ret[i] = p[i].neg();
        }
        return poly(ret);
    };
pp.sub = function (r) {
        return this.add(r.neg());
    };
pp.mul = function (r) {
        var a = this.coef;
        var b = r.coef;
        var zero = a[a.length-1].zero();
        var ret = [];
        var lm, ii, nn, i, n=a.length + b.length - 1;
        for (i = 0; i <n; i +=1) {
            ret[i] = zero;
        }
        n = a.length;
        nn = b.length;
        for (i = 0; i< n; i +=1) {
            lm = a[i];
            for (ii = 0; ii < nn; ii += 1) {
                ret[i+ii] = lm.mul(b[ii]).add(ret[i+ii]);
            }
        }
        return poly(ret); 
    } ;
pp.syndiv = function (a) {
        var p = this.coef;
        var q=[], r, s=[], i, n = p.length, coef, cur=a.zero(), mid;
        for (i = n-1; i > -1; i -= 1) {
            coef = p[i];
            s[i] = mid = cur.mul(a);
            cur = q[i] = coef.add(mid);
            //console.log(cur.str(), coef.str(), mid.str());
        }
        r = q.shift();
        return {a: a, p: p, q : q, r : r, s : s}; // s is intermed
    };
pp.count = function () {
        var p = this.coef, sign, i, n = p.length, count = 0;
        sign = p[0].sign();
        for (i = 1; i < n; i += 1) {
            if (p[i].sign() != sign) {
                count += 1;
                sign = p[i].sign();
            }
        }
        return count;
    };
pp.descartes = function () {
        return [this.count(), this.flip().count()];
    };
pp.translate  = function (a) {
        var p = this, i, n = p.coef.length, res, ret = [];
        for (i = 0; i < n; i += 1) {
            res = p.syndiv(a);
            ret.push(res.r);
            p = poly(res.q);
        }
        return poly(ret); 
    };
pp.tcf = function () {
        var pc = this.coef, i, n = pc.length, ii, nn, cofuns = [], f, pcloc;
        for (i = 0; i < n; i += 1) {
            nn = n-i;
            f = [];
            for (ii = 0; ii < nn; ii += 1) {
                pcloc =  i + ii;
                f.push(bin(pcloc, ii).mul(pc[pcloc]));
            }
            cofuns.push(poly(f, {v: "a"}));
        }
        return cofuns;
    };
pp.bounds = function () {
        var pc = this.coef;
        var lead = pc[pc.length -1].abs();
        var con = pc[0].abs();
        var pmax = pc.slice(1,-1).reduce(function (pv, cv) {
            pv.max(cv);
        }) || int(0);
        var up = int(1).add(pmax.max(con).abs().div(lead) );
        var low = con.div(con.add(pmax.max(lead) ) );
        return [low, up];
    };
pp.table = function (firstx, lastx, n) {
        var p = this;
        curx = firstx;
        var inter = lastx.sub(firstx).div(n);
        var points = [[curx, p.evl(curx)]];
        while (curx.lt(lastx)) {
            curx = curx.add(inter);
            points.push([curx, p.evl(curx)]);
        }
        return points;
    };

module.exports = Poly;