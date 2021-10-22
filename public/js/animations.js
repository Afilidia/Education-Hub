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

    var cancel_btns = document.querySelectorAll('.cancel-btn');

    if (cancel_btns) cancel_btns.forEach(btn => {
        btn.addEventListener('click', () => {

            setTimeout(() => {
                btn.querySelector('span').innerText = "Canceled";
                btn.classList.toggle('clicked');

                setTimeout(() => {
                    (btn.querySelector('.cross')).style.display = "none";
                }, 3000);
            }, 300);
        });
    });

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