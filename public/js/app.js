// -*- coding: utf-8 -*-

'use strict';

$(document).ready(async function () {
    var avatar = document.getElementById('avatar');
    var latestTask = document.getElementById('latest-task');

    if ($.cookie(_TOKEN_COOKIE) != null && avatar) {
        let nickname = await getNickname();
        avatar.innerHTML = `<img src="/resources/illustrations/avatar.svg" class="icon48"> <span class="nickname">${nickname}</span>`;
        avatar.setAttribute('href', '/app');
        avatar.classList.toggle('avatar-mode');
    }

    if (latestTask) {
        var tasks = await getTasks();
        let latest = getLatestTask(tasks);
        latestTask.textContent = latest.task;
    }

    async function getNickname() {
        return JSON.parse($.cookie(_DATA_COOKIE)).login;
    }

    function getLatestTask(tasks) {
        let min = 0;
        let data = null;

        if (tasks) tasks.forEach((task) => {
            if (Number(task.id) > min) {
                min = Number(task.id);
                data = task;
            }
        });

        return data;
    }

    async function getTasks() {
        return new Promise((resolve, reject) => {
            fetch(ENDPOINTS.todo.read)
                .then(res => {if (res.ok) return res.json();})
                    .then((res) => {
                        resolve(res);
                    });
        });
    }
});