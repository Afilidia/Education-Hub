// -*- coding: utf-8 -*-

'use strict';

$(document).ready(function () {
    function getParam(param){
        return new URLSearchParams(window.location.search).get(param);
    }

    let error = getParam('error');
    let err_element = document.getElementById('error-msg');
    if (error != null && err_element) err_element.classList.toggle('show');
});
