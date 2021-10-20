let framework = require('../framework'),
script = function(){
    // -*- coding: utf-8 -*-
    
    /**
     * @description     The button animations script
     * @author          Affilidia - Adriskk
     * @file            main.js
     * @version         0.1
     * @link            https://github.com/Afilidia/framework/tree/dev
    **/
    
    "use strict";
    
    $('document').ready(function() {
    
        // * Button variables
        var toggleButton = document.querySelectorAll('.toggle-btn');
    
        // * Multi-choice button variables
        var multichoiceButtons = document.querySelectorAll('.option');
    
    
        // * Toggle buttons
    
        /**
         * The toggle button
         *
         * @description
         * When clicked toggles the class 'toggle'
         * Initial toggle value: false
         *
         * @returns boolean: true if toggled
        */
        var toggle_btn = function (callback) {
            if (toggleButton) toggleButton.forEach(button => {
                button.addEventListener('click', () => {
                    button.classList.toggle("toggle");
                    callback(checkIfContainsClass(button, 'toggle'));
                });
            });
        }((state) => {console.log(state);});  // <- this call need to be deleted when converting
    
    
        /**
         * The multi-choice buttons
         *
         * @description
         * Switches the toggle of a class to the clicked button
         *
         * @returns HTML Element
        */
        var multichoice_btns = function(callback) {
            if (multichoiceButtons) multichoiceButtons.forEach(option => {
                option.addEventListener('click', () => {
    
                    // * Remove all already toggled buttons
                    removeOtherActiveElements(multichoiceButtons, 'active');
    
                    option.classList.toggle('active');
                    callback(option);
                });
            });
        }((element) => {console.log(element);});  // <- this call need to be deleted when converting
    
    });
    
    function removeOtherActiveElements(all, cls) {
        if (all) all.forEach(element => {
            if (element.classList.contains(cls)) element.classList.toggle(cls);
        });
    };
    
    function checkIfContainsClass(element, cls) {
        if (element.classList.contains(cls)) return true;
    
        return false;
    }
}
module.exports = framework.html.jsCode(script)