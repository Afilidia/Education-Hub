// -*- coding: utf-8 -*-

'use strict';

$(document).ready(function () {

    AOS.init();

    // * Menu animations
    var menu = document.querySelector('.menu');
    var hamburger = document.querySelector('.hamburger');

    var navbar = document.getElementById('navigation');

    if (menu && hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            menu.classList.toggle('slide');
        });
    }

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('sticky', window.scrollY > 0);
    });
});