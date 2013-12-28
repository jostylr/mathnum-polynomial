# Polynomials



## Interface

This is an object with various methods that allow polynomials to be evaluated as a polynomial or generate new polynomials or to give rise to new forms of this polynomial. 


    

### binomial coefficients

Need to put this in a better place. Need a global object that everything accesses.

    var binc =[[int(1)], [int(1), int(1)]];
    return function (n, k) {
        var max = 100;
        var nlev, i, times = 0, curbin, temp;
        while (binc.length <= n) {
            nlev = binc.length;
            curbin = binc[nlev-1];
            temp = [];
            for (i = 0; i<curbin.length+1; i += 1) {
                temp.push( (curbin[i] || int(0)).add(curbin[i-1] || int(0)) );
                console.log(temp[temp.length-1].str());
            }
            binc.push(temp);
            times += 1;
            if (times > max) {
                break;
            }
        }
        if (binc.hasOwnProperty(n)) {
            return binc[n][k] || int(0);
        } else {
            return int(0);
        }
    };



### poly 

A method form of the constructor

    function (arr, options) {
        return new Poly(arr, options); 
    }

###  Str

Making a string out of a polynomial.

    function (type, v) {
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
    }

###  Eval

This is how we evaluate a polynomial. We use Horner's method. The input and coeficients need to support add, mul. If the poly is of large degree and sparse, this is probably not the best way. But no need to worry about that right now. 

    function (a) {
        var p = this.coef, i, n = p.length, cur = a.zero(), mid, coef;
        for (i = n-1; i > -1; i -= 1) {
            coef = p[i];
            mid = cur.mul(a);
            cur = coef.add(mid);
        }
        return cur;         
    }

###  Table

If we intend to view a bunch of values either in table or graphically, we need to generate a bunch of points and return them as an array of 2-arrays.

We want to produce n points starting with the firstx and ending with the lastx. 

    function (firstx, lastx, n) {
        var p = this;
        curx = firstx;
        var inter = lastx.sub(firstx).div(n);
        var points = [[curx, p.evl(curx)]];
        while (curx.lt(lastx)) {
            curx = curx.add(inter);
            points.push([curx, p.evl(curx)]);
        }
        return points;
    }

###  As function

We might need to have polynomial as a standalone function. This creates such a function. 

    function () {
        var p = this;
        var f = function (input) {
            p.evl(input); 
        };
        f.poly = p;
        return f;
    }

###  Add

How do we add polynomials? We add the coefficients.

    function (right) {
        var ret = [].concat(this.coef);
        var rc = right.coef;
        var zero = rc[0].zero();
        var i, n = rc.length;
        for (i = 0; i <n; i += 1) {
            ret[i] =  (ret[i] || zero).add(rc[i]);
        }
        return poly(ret);
    }

###  Shift

This shifts the polynomial as if multiplying by x^n. If n is negative, then it truncates those terms. 


    function (n) {
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
    }

###  Negate

Negates all the coefficients. 

    function () {
        return poly(this.coef.map(function (el) {
            return el.neg();
        }  )  );
    }

###  Flip odd signs

Negates the odd terms, i.e., p(x) --> p(-x)

    function () {
        var i, p = this.coef, n = p.length, ret = [];
        for ( i = 0 ; i < n ; i += 2 ) {
            ret[i] = p[i];
        }
        for ( i = 1 ; i < n ; i += 2 ) {
            ret[i] = p[i].neg();
        }
        return poly(ret);
    }

###  Subtract

    function (r) {
        return this.add(r.neg());
    }

###  Multiply

Multiplies coefficients. Same algorithm as integer multiplication.

    function (r) {
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
    } 

###  Invert

Returns the rational function whose denominator is the polynomial.

###  Long division

This will do long division of polynomials, reporting back the intermediate steps, the quotient, and the remainder.


###   Quotient

Returns the quotient polynomial of long division.

###  Remainder

Returns the remainder polynomial of long division.



###  Synthetic division

This will do synthetic division given `a` the constant (appropriately signed).

    function (a) {
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
    }

###  Count the signs

For Descartes' Rule of signs. 

    function () {
        var p = this.coef, sign, i, n = p.length, count = 0;
        sign = p[0].sign();
        for (i = 1; i < n; i += 1) {
            if (p[i].sign() != sign) {
                count += 1;
                sign = p[i].sign();
            }
        }
        return count;
    }


###  Descartes

    function () {
        return [this.count(), this.flip().count()];
    }

###  Translate

We want to produce a new polynomial that is the result of replacing  x with u = x+a. 

We could expand, but a faster(?) method is to do repeated synthetic division. 


    function (a) {
        var p = this, i, n = p.coef.length, res, ret = [];
        for (i = 0; i < n; i += 1) {
            res = p.syndiv(a);
            ret.push(res.r);
            p = poly(res.q);
        }
        return poly(ret); 
    }

###  Translate coefficients

For a few reasons, we have an interest in graphing and exploring the coefficients of the polynomials as we translate the polynomial left and right. 

These coefficient functions can be computed out explicitly, using a binomial coefficeint function. 

This is for small degree polynomials (100 or so) -- the binomial coefficeints are probably a limiting factor.

    function () {
        var pc = this.coef, i, n = pc.length, ii, nn, cofuns = [], f, pcloc;
        for (i = 0; i < n; i += 1) {
            nn = n-i;
            f = [];
            for (ii = 0; ii < nn; ii += 1) {
                pcloc =  i + ii;
                f.push(bin(pcloc, ii).mul(pc[pcloc]));
//                console.log(i, n, nn, ii, f.length-1, pc[pcloc].str(), bin(pcloc, ii).str());
            }
            cofuns.push(poly(f, {v: "a"}));
        }
        return cofuns;
    }

###  Rational roots

If the coefficients are integers or rationals, then it will compute the possible rational roots and test them. It reports back all of the values. 

Need to have some factorization algorithms on integers. 

    function () {

    }

###  root bounds

This is really to just help with finding zeros. It is based on [Wiki](http://en.wikipedia.org/wiki/Properties_of_polynomial_roots#Based_on_the_Rouch.C3.A9_theorem). For the upper bound, I will use for now `1 + max (|a_i|  i < n-1) /|a_n|  `  and for the lower bound, use  |a_0|/( |a_0| + max (|a_i| i > 0 ))`


    function () {
        var pc = this.coef;
        var lead = pc[pc.length -1].abs();
        var con = pc[0].abs();
        var pmax = pc.slice(1,-1).reduce(function (pv, cv) {
            pv.max(cv);
        }) || int(0);
        var up = int(1).add(pmax.max(con).abs().div(lead) );
        var low = con.div(con.add(pmax.max(lead) ) );
        return [low, up];
    }


###  Zeros

Find the zeros of the polynomial. 

    function () {

    }

###  Derivative

Just implement the algebraic lowering rule. 

    function () {

    }

###  Integrate

Indefinite integration creates a family of functions. This is implemented  in such a way that the constant can be put in later to determine the function. Further integration, introduces more constants and integrates up the polynomial form. This should also be supported. 

    function () {

    }

### Test poly

Here we assemble a bit of the old testing of the polynomial functions. No doubt this will get moved. Ahem.

FILE "test poly" polytest.js |jshint

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
//console.log(p.bounds(), q.bounds());
    /*
    var i, n = 10, q;
    for (i = -5; i < n; i += 1) {
        q = p.translate(int(-i));
        console.log("x="+i, q.descartes(), q.str());
    }
    */