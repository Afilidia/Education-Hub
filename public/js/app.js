// -*- coding: utf-8 -*-

'use strict';

$(document).ready(async function () {
    var avatar = document.getElementById('avatar');

    if ($.cookie(_TOKEN_COOKIE) != null && avatar) {
        let nickname = await getNickname();
        avatar.innerHTML = `<img src="/resources/illustrations/avatar.svg" class="icon48"> <span class="nickname">${nickname}</span>`;
        avatar.setAttribute('href', '/app');
        avatar.classList.toggle('avatar-mode');
    }

    async function getNickname() {
        return JSON.parse($.cookie(_DATA_COOKIE)).login;
    }
});