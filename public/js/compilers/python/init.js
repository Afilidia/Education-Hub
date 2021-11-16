// -*- coding: utf-8 -*-

/**
 * @file init.js
 * @decription  Initialize the compiler, 
 *              containing the compiler functions
 * @author Adriskk
 * @version 1.0.0
 */


const py_compiler = { 

    init: function () {
        // * Initialize the compiler
        console.log(Sk);
    },

    builtinRead: function (x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
                throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    },

    run: function (input, output) {
        Sk.pre = "output";
        
        Sk.configure({
            output: output, 
            read: this.builtinRead
        });

        // (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
        var myPromise = Sk.misceval.asyncToPromise(function() {
            return Sk.importMainWithBody("<stdin>", false, input, true);
        });

        myPromise.then(function(mod) {
            console.log('success');
        },
            function(err) {
            console.log(err.toString());
        });
    }
};


export { py_compiler as py_compiler };