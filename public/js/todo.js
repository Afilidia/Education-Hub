// -*- coding: utf-8 -*-

'use strict';

$(document).ready(async function () {
    var list = document.querySelector('.list');

    var tasks = await getTasks();
    generateTiles(tasks);

    const filter_settings = {
        done: false,
        pending: false,
    };

    var filters = document.querySelectorAll('input[type="checkbox"]');
    if (filters && tasks) filters.forEach(filter => {
        filter.addEventListener('click', (e) => {
            filter_settings[(filter.getAttribute('name').split('-'))[1]] = filter.checked;

            // console.log(filter_settings);

            if (filter_settings.done && filter_settings.pending)        generateTiles(tasks);
            else if (filter_settings.done && !filter_settings.pending)  generateTiles(filtered(tasks, 'done'));
            else if (!filter_settings.done && filter_settings.pending)  generateTiles(filtered(tasks, 'pending'));
            else                                                        list.innerHTML = '';
        });
    });


    // * Task button clicked
    var taskTiles = document.querySelectorAll('.task');
    if (taskTiles) taskTiles.forEach(task => {

        let buttons = task.querySelectorAll('.task-btn');
        let dot = task.querySelector('.dot');

        let ID = Number(task.getAttribute('data-id') || -1);

        if (buttons) buttons.forEach(button => {
            button.addEventListener('click', async () => {
                let type = button.getAttribute('data-type');


                switch (type) {
                    case 'done': {
                        let taskText = task.querySelector('p.text').textContent;

                        if (ID && taskText) await fetch(ENDPOINTS.todo.update, {
                            method: 'POST',
                            mode: 'cors',
                            cache: 'no-cache',
                            credentials: 'same-origin',
                            body: JSON.stringify({
                                done: true,
                                id: ID,
                                task: taskText
                            }),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8'
                            }

                        }).then(function (response) {
                            if (response.ok) return response.json();
                            return Promise.reject(response);

                        }).then(function (data) {
                            console.log('SUCCESS');

                        }).catch(function (error) {
                            console.warn('Something went wrong.', error);
                        });

                    } break;

                    case 'update': {
                        await getNewText(async function (text) { // Callback

                            if (ID && text) await fetch(ENDPOINTS.todo.update, {
                                method: 'POST',
                                body: JSON.stringify({
                                    done: false,
                                    id: ID,
                                    task: text
                                }),

                                headers: {
                                    'Content-type': 'application/json; charset=UTF-8'
                                }

                            }).then(function (response) {
                                if (response.ok) return response.json();
                                return Promise.reject(response);

                            }).then(function (data) {
                                console.log('SUCCESS');

                            }).catch(function (error) {
                                console.warn('Something went wrong.', error);
                            });


                            task.querySelector('p.text').textContent = text;
                        });

                    } break;

                    case 'delete': {
                        if (ID) await fetch(ENDPOINTS.todo.delete, {
                            method: 'POST',
                            body: JSON.stringify({
                                id: ID,
                            }),

                            headers: {
                                'Content-type': 'application/json; charset=UTF-8'
                            }

                        }).then(function (response) {
                            if (response.ok) return response.json();
                            return Promise.reject(response);

                        }).then(function (data) {

                            // * Pop out task from tasks
                            tasks.splice(tasks.indexOf(task), 1);

                        }).catch(function (error) {
                            console.warn('Something went wrong.', error);
                        });

                        let width = task.querySelector('p.text').getBoundingClientRect().width;
                        document.styleSheets[2].insertRule(`.task.pop .text-content::before {width: ${width}px;}`);
                        task.classList.toggle('pop');

                        setTimeout(() => {
                            task.remove();
                        }, 1500);

                    } break;
                }

                dot.classList.toggle(type);
            });
        });
    });

    async function getTasks() {
        return new Promise((resolve, reject) => {
            fetch(ENDPOINTS.todo.read)
                .then(res => {if (res.ok) return res.json();})
                    .then((res) => {
                        resolve(res);
                    });
        });
    }

    async function getNewText(callback) {
        var modal = document.getElementById('modal');
        if (modal) modal.classList.toggle('show');

        modal.querySelector('#cancel').addEventListener('click', () => {
            modal.classList.remove('show');
        });

        var text = '';

        $('#update-form').submit(function (event) {
            text = ($("#update-form").serializeArray())[0].value;
            callback(text);
            modal.classList.remove('show');

            event.preventDefault();
        });
    }

    function generateTiles(tasks) {
        list.innerHTML = '';

        if (tasks) tasks.forEach(task => {
            var tile = getTile(task);
            list.insertAdjacentHTML('afterbegin', tile);
        });
    }

    function filtered(tasks, filter) {
        var data = [];

        tasks.forEach(task => {

            if (filter == 'done') {
                if (task.done == 1) {
                    data.push(task);
                }

            } else {
                if (task.done != 1) {
                    data.push(task);
                }
            }
        });

        return data;
    }

    function getTile(data) {
        return `<div class="task" data-id="${data.id}">
                    <div class="wrapper">
                        <div class="dot ${(data.done == 1) ? 'done' : ''}"></div>
                    </div>

                    <div class="text-content">
                        <p class="text">${data.task}</p>
                    </div>

                    <div class="buttons">
                        <button class="task-btn done" data-type="done">
                            <img src="/resources/icons/buttons/done.png" alt="Done" class="icon16">
                        </button>

                        <button class="task-btn delete" data-type="delete">
                            <img src="/resources/icons/buttons/close.png" alt="Delete" class="icon16">
                        </button>

                        <button class="task-btn update" data-type="update">
                            <img src="/resources/icons/buttons/edit.png" alt="Edit" class="icon16">
                        </button>
                    </div>
                </div>`;
    }
});