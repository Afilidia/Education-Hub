// -*- coding: utf-8 -*-

'use strict';

$(document).ready(function (event) {
    var create = document.getElementById('create-file');

    const data = readFileListFromCookies() || []; 
    const state = readFileListState() || {
        latestID: 0,
        currentID: 0
    };

    if (data.length == 0) {
        saveFileListToCookies([]);
        document.querySelector('.no-files').classList.toggle('show');

    } else {
        document.querySelector('.no-files').classList.remove('show');

        data.forEach(file => {
            var wrapper = document.querySelector('.files-list');
            let element = wrapper.insertAdjacentHTML('beforeend', getFileHTML(file));
            file.element = wrapper.querySelector(`#file-${file.id}`);

            // * Add event listener to the button
            onFileClicked(file.element);
        });
    }

    if (!readFileListState()) {
        saveFileListState(state);
    }

    var files = document.querySelectorAll('.file');
    var options = document.querySelectorAll('.option');
    var workspace = document.getElementById('input-textarea-field');


    onFileClicked();
    onOptionClicked();

    // * Enable 'Tab'
    enableTab(document.querySelector('textarea'));

    $(document).keypress(function(event) {
        if (!(event.which == 115 && event.ctrlKey) && !(event.which == 19)) return true;
        event.preventDefault();
        save(state.currentID);
        alert("Ctrl-S pressed");
        return false;
    });

    // * New file creation clicked
    if (create) create.addEventListener('click', () => {
        create.classList.toggle('active');
        var filenameInput = document.getElementById('new-file-input');
        if (filenameInput) {
            filenameInput.classList.toggle('slide');
            filenameInput.focus();
        }

        document.addEventListener('keypress', (event) => {
            if (event.key == 'Enter') {
                if (filenameInput) filenameInput.classList.remove('slide');
                create.classList.remove('active');

                let filename = filenameInput.value;
                let extension = filename.split('.')[1];
                let name = filename.split('.')[0];

                let obj = {
                    filename: filename,
                    name: name.trim(),      //.replaceAll(' ', '')
                    ext: extension.trim()   //.replaceAll(' ', '')
                };

                // * Create
                if (/**(SUPPORTED_EXT.includes(extension)) && */ (checkNameAvailability(obj)) && (obj.ext !== undefined)) createFile(obj);
                filenameInput.value = '';
            }
        });
    });


    function onFileClicked(element) {
        var filename_e = document.getElementById('filename');

        var func = (file) => {
            removeClassFromElement(files, 'active');
            file.classList.toggle('active');

            let filename = file.querySelector('.file-name').textContent;
            let extension = file.querySelector('.ext').textContent;

            if (filename_e) filename_e.textContent = filename + extension;

            // * Change the workspace note
            state.currentID = Number(file.getAttribute('data-id'));
            changeWorkspaceContent(getFileByID(state.currentID).note);
            saveFileListState(state);
        };

        if (element !== undefined) {
            element.addEventListener('click', () => {
                let file = getFileByID(Number(element.getAttribute('data-id')));
                // console.log(element, file);
                func(file.element);
            });

        } else if (files && element === undefined) files.forEach(file => {
            file.addEventListener('click', () => {
                func(file);
            });
        });
    }


    function onOptionClicked() {
        if (options) options.forEach(option => {
            option.addEventListener('click', () => {
                let type = option.getAttribute('data-type');

                switch (type) {
                    case 'save':        {save(state.currentID);} break;

                    case 'change':      {change(state.currentID);} break;

                    case 'download':    {download(state.currentID);} break;

                    case 'delete':      {remove(state.currentID);} break;
                }
            });

        });
    }

    function createFile(file) {
        var wrapper = document.querySelector('.files-list');
        file.id = state.latestID + 1;
        let element = wrapper.insertAdjacentHTML('beforeend', getFileHTML(file));

        data.push({
            id: state.latestID + 1,
            name: file.name,
            ext: file.ext,
            filename: file.name + '.' + file.ext,
            note: `Hi! I'm your note!`,
            element: wrapper.querySelector(`#file-${file.id}`)
        });

        if (document.querySelector('.no-files').classList.contains('show'))
            document.querySelector('.no-files').classList.remove('show');

        state.latestID++;
        update();

        // * Update cookies
        saveFileListToCookies(data);
        saveFileListState(state);

        // * Add event listener to the button
        onFileClicked(element);
    }

    // * Check if name is unique
    function checkNameAvailability(file) {
        const illegal = ['#', '%', '&', '{', '}', "\ ", '<', '>', '*', '?', '/', ' ', '$', '!', "'", '"', ':', '@', '+', '`', '|', '='];

        // * Check for multi extensions
        if (file.filename.split('.') > 2) return false;

        // * Check file name correctivity
        if (illegal.includes(file.name)) return false;

        return true;
    }

    function update() {
        files = document.querySelectorAll('.file');
        options = document.querySelectorAll('.option');
    }

    function getFileHTML(file) {
        return `<span class="file" id="file-${file.id}" data-id="${file.id}"><span class="file-name">${file.name}</span> <span class="ext">.${file.ext}</span></span>`;
    }

    function getFileElementByID(ID) {
        let element = null;

        files.forEach(file => {
            if (Number(file.getAttribute('data-id')) == ID) element = file;
        });

        return element;
    }

    function getFileByID(ID) {
        let dataset = null;

        data.forEach(file => {
            if (file.id == ID) dataset = file;
        });

        return dataset;
    }

    function changeWorkspaceContent(content) {
        // console.log(content);
        if (workspace && content) workspace.value = content;
    }

    // * Option functions
    function save(id) {
        let file = getFileByID(id);
        let note = workspace.value;

        if (file) {
            data[data.indexOf(file)].note = note;
            saveFileListToCookies(data);

            let saved = document.getElementById('saved');

            if (saved) {
                saved.classList.toggle('show');
                setTimeout(() => {
                    saved.classList.remove('show');
                }, 1000);

            }

        } else {
            if (workspace.value != "") {
                create.classList.toggle('active');
                let filenameInput = document.getElementById('new-file-input');
                if (filenameInput) {
                    filenameInput.classList.toggle('slide');
                    filenameInput.focus();
                }

                document.addEventListener('keypress', (event) => {
                    if (event.key == 'Enter') {
                        if (filenameInput) filenameInput.classList.remove('slide');
                        create.classList.remove('active');
        
                        let filename = filenameInput.value;
                        let extension = filename.split('.')[1];
                        let name = filename.split('.')[0];
        
                        let obj = {
                            filename: filename,
                            name: name.trim(),      //.replaceAll(' ', '')
                            ext: extension.trim()   //.replaceAll(' ', '')
                        };
        
                        // * Create
                        if (/**(SUPPORTED_EXT.includes(extension)) && */ (checkNameAvailability(obj)) && (obj.ext !== undefined)) createFile(obj);
                        filenameInput.value = '';
                    }
                });
            }
        }
    }

    function remove(id) {
        let file = getFileByID(id);

        if (file) {
            showRemoveModal(file.filename, function () {

                file.element.remove();
                workspace.value = '';
                data.splice(data.indexOf(file), 1);
                saveFileListToCookies(data);

                if (data.length == 0) document.querySelector('.no-files').classList.toggle('show');
            });

            // console.log(result);
        } else console.warn('You have to choose a file first!');
    }

    function change(id) {
        let file = getFileByID(id);

        if (file) showChangeModal(file.filename, function (filename) {
            var filename_e = document.getElementById('filename');

            if (checkNameAvailability({
                filename: filename,
                name: (filename.split('.')[0]).trim(),  //.replaceAll(' ', '')
                ext: (filename.split('.')[1]).trim(),   //.replaceAll(' ', '')
            })) {
                if (filename_e) filename_e.textContent = filename;

                let name = filename.split('.')[0];
                let extension = filename.split('.')[1];

                data[data.indexOf(file)].name = name;
                data[data.indexOf(file)].ext = extension;
                data[data.indexOf(file)].filename = filename;

                var fileElement = getFileElementByID(file.id);
                if (fileElement) {
                    fileElement.querySelector('span.file-name').textContent = name;
                    fileElement.querySelector('span.ext').textContent = '.' + extension;
                }

                saveFileListToCookies(data);
            }

        });
    }

    function download(id) {
        if (id) {
            let file = getFileByID(id);

            if (file) {
                // * Download current file
                var blob = new Blob(['' + file.note], {type: 'text/plain;charset=utf-8'});
                var url = window.URL || window.webkitURL;
                var link = url.createObjectURL(blob);
                var a = document.createElement('a');

                a.download = file.filename;
                a.href = link;

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

        }

    }

    function showChangeModal(filename, callback) {
        var modal = document.getElementById('change-modal');

        if (modal) {
            modal.querySelector('#modal-change-file-name').innerHTML = filename;
            modal.classList.toggle('show');
            var btn = modal.querySelector('button[type="button"]');

            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                return false;
            });

            $("#change-modal-form").submit(function(event) {
                let new_filename = $("#change-modal-form").serializeArray();
                modal.classList.remove('show');

                event.preventDefault();
                callback(new_filename[0].value);
                return true;
            });
        }

        return false;
    }

    function showRemoveModal(filename, callback) {
        var modal = document.getElementById('remove-modal');

        if (modal) {
            modal.querySelector('#modal-delete-file-name').innerHTML = filename;
            modal.classList.toggle('show');
            var btn = modal.querySelector('button[type="button"]');

            btn.addEventListener('click', () => {
                modal.classList.remove('show');
                return false;
            });

            $("#remove-modal-form").submit(function(event) {
                setTimeout(() => {
                    modal.classList.remove('show');
                }, 2000);

                event.preventDefault();
                callback();
                return true;
            });
        }

        return false;
    }

    function enableTab(element) {
        element.onkeydown = function(e) {
            if (e.key == 'Tab') {

                var val = this.value,
                    start = this.selectionStart,
                    end = this.selectionEnd;

                this.value = val.substring(0, start) + '\t' + val.substring(end);
                this.selectionStart = this.selectionEnd = start + 1;
                return false;

            }
        };
    }


    // * Remove a given class from a element that contains it
    var removeClassFromElement = (elements, cls) => {
        elements.forEach(element => {if (element.classList.contains(cls)) element.classList.remove(cls)});
    };


    // * Cookies saving and reading system functions
    function readFileListFromCookies() {
        return ($.cookie(_FILE_LIST) != null) ? JSON.parse($.cookie(_FILE_LIST)) : null;
    }

    function saveFileListToCookies(data) {
        $.cookie(_FILE_LIST, JSON.stringify(data), {path: '/', expires: 365});
        // console.log(JSON.parse($.cookie(_FILE_LIST)));
    }

    function readFileListState() {
        return ($.cookie(_FILE_STATE) != null) ? JSON.parse($.cookie(_FILE_STATE)) : null;
    }

    function saveFileListState(state) {
        $.cookie(_FILE_STATE, JSON.stringify(state), {path: '/', expires: 365});
        // console.log(JSON.parse($.cookie(_FILE_STATE)));
    }

});