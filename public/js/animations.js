// -*- coding: utf-8 -*-

'use strict';

$(document).ready(function () {

    AOS.init();

    // * Menu animations
    var menu = document.querySelector('.menu');
    var hamburger = document.querySelector('.hamburger');

    var navbar = document.getElementById('navigation');

    var panelSwitcher = document.querySelector('.switcher');
    var panel = document.querySelector('.panel');

    if (menu && hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('slide');
        });
    }

    if (panelSwitcher && panel) panelSwitcher.addEventListener('click', () => {
        panel.classList.toggle('move');
    });

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('sticky', window.scrollY > 0);
    });
});