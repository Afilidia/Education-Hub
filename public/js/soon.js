// -*- coding: utf-8 -*-

'use strict';

$( document ).ready(function (event) {

    AOS.init();

    console.log(window.sessionStorage.getItem('theme'));

    let params = new URLSearchParams(window.location.search);
    let fromParams = null;

    if (params.has('theme')) fromParams = params.get('theme');
    console.log(fromParams);

    // * Set dark theme
    if ((window.sessionStorage.getItem('theme') == 'true') || (fromParams)) {
        document.body.setAttribute('data-theme', 'dark');
    }
});