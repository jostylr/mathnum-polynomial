# [mathnum-polynomial](# "version: 0.0.1 | jostylr")

Implementing polynomials for math-numbers

## Files


Saving: 

* [install.js](#install "save: | jshint")
* [ghpages/index.html](#homepage "save:")
* [index.js](#main "save: | jshint")
* [README.md](#readme "save:") The standard README.
* [package.json](#npm-package "save: json  | jshint") The requisite package file for a npm project. 
* [TODO.md](#todo "save: | clean raw") A list of growing and shrinking items todo.
* [LICENSE](#license-mit "save: | clean raw") The MIT license.
* [.travis.yml](#travis "save:") A .travis.yml file for [Travis CI](https://travis-ci.org/)
* [.gitignore](#gitignore "Save:") A .gitignore file
* [.npmignore](#npmignore "Save:") A .npmignore file


## Main



## homepage

This is the main welcome page for math pebbles

    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Math Pebbles -- Solver</title>
            <link rel="stylesheet" href="bootstrap.css">
        </head>
        <body>
        _":body | marked"

        </body>
    </html>

[body]()

    

## README

    mathnum-polynomial
    ==================

    Polynomial object creation for math numbers


## TODO

Lots.

## Install

This is a little node script to run after the install command is used. Currently it copies math-numbers index.js to ghpages/mathnum.js

    /*global require*/
    var spawn = require('child_process').spawn;

    spawn('cp', ["node_modules/math-numbers/index.js", "ghpages/mathnum.js"]);

## NPM package

The requisite npm package file. Use `npm run-script compile` to compile the literate program.

[](# "json") 

    {
      "name": "DOCNAME",
      "description": "Another mathnum package",
      "version": "DOCVERSION",
      "homepage": "https://github.com/GHUSER/DOCNAME",
      "author": {
        "name": "James Taylor",
        "email": "GHUSER@gmail.com"
      },
      "repository": {
        "type": "git",
        "url": "git://github.com/GHUSER/DOCNAME.git"
      },
      "bugs": {
        "url": "https://github.com/GHUSER/DOCNAME/issues"
      },
      "licenses": [
        {
          "type": "MIT",
          "url": "https://github.com/GHUSER/DOCNAME/blob/master/LICENSE-MIT"
        }
      ],
      "main": "index.js",
      "engines": {
        "node": ">10.0"
      },
      "devDependencies" : {
        "literate-programming" : "~0.7.5",
        "tape" : "=2.3.0",
        "browserify" : "=2.35.4",
        "math-numbers" : ">=0.0.9"
      },
      "peerDependencies":{  
        "math-numbers" : ">=0.0.9"
      },
      "dependencies" : {
      },
      "scripts" : { 
        "test" : "node ./test/testrunner.js | grep -v -e ^ok",
        "install": "node install.js"
      },
      "private" : true, 
      "testling": {
            "files": "test/*.js",
            "browsers": {
              "ie": [ 9, 10 ],
              "firefox": [ 25, "nightly" ],
              "chrome": [ 31, "canary" ],
              "safari": [ 5.1]
            }
        }
    }

## gitignore

We should ignore node_modules (particularly the dev ones) and ghpages which is just a directory where I have the gh-pages branch repo. 

    node_modules
    ghpages

## npmignore

We should ignore test, examples, and .md files

    test
    examples
    ghpages
    *.md

## Travis

A travis.yml file for continuous test integration!

    language: node_js
    node_js:
      - "0.10"

## LICENSE MIT


The MIT License (MIT)
Copyright (c) 2013 James Taylor

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
