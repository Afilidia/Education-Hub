// -*- coding: utf-8 -*-

/**
 * @file init.js
 * @decription  Initialize the compiler,
 *              containing the compiler functions
 * @author Adriskk
 * @version 1.0.0
 */


var defaultTimeLimit = Sk.execLimit;
var StopExecution = false;

const py_compiler = {
    error: false,
    error_msg: '',
    error_callback: null,

    init: function () {
        // * Initialize the compiler

        Sk.externalLibraries = {
            numpy : {
                path: '/static/primeronoo/skulpt/external/numpy/__init__.js'
            },
            matplotlib : {
                path: '/static/primeronoo/skulpt/external/matplotlib/__init__.js'
            },
            "matplotlib.pyplot" : {
                path: '/static/primeronoo/skulpt/external/matplotlib/pyplot/__init__.js'
            },
            "arduino": {
                path: '/static/primeronoo/skulpt/external/arduino/__init__.js'
            }
        };
    },

    builtinRead: function (x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    },

    stop: function () {
        Sk.execLimit = 0;
    },

    run: function (input, output, callback) {
        StopExecution = false;
        Sk.execLimit = 0;
        Sk.pre = "output";
        Sk.execLimit = defaultTimeLimit;

        Sk.configure({
            output: output,
            read: this.builtinRead,
            python3: true,
            execLimit: Number.POSITIVE_INFINITY,
            timeoutMsg: 'Your program has timed out!',
            killableWhile: true,
        });

        (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'ui-canvas';
        var myPromise = Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, input, true);
        });

        myPromise.then(function(mod) {
            console.log('Success');
            if (callback) callback();

        }, function(err) {
            py_compiler.error_callback(err, true);
        });
    },

    stop: function() {
        Sk.execLimit = 1;

        Sk.timeoutMsg = function() {
            StopExecution = true;
            Sk.execLimit = defaultTimeLimit;
            return "Program execution has been stopped or program has timed out";
        }
    }
};


export { py_compiler as py_compiler, StopExecution };