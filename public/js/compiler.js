// -*- coding: utf-8 -*-

'use strict';

$(document).ready(async function () {
    var input = document.getElementById('input'),
        output = document.getElementById('output');

    var run = document.getElementById('run');
    var code = '// Type your code here...';

    var theme = true;

    const modes = {
        js: ace.require("ace/mode/javascript").Mode,
        py: null,
        cs: null
    };


    // * Plug input & output to the lib functions
    const editor = ace.edit("input");

    const ACE = {
        init: function() {
            editor.session.setMode(new modes.js());

            let cookieTheme = getThemeFromCookies();

            if (cookieTheme) {
                editor.setTheme(cookieTheme);
                if (cookieTheme.endsWith('dracula')) {
                    document.body.setAttribute('data-theme', theme);
                    theme = !theme;
                }

            }
            else {
                editor.setTheme('ace/theme/eclipse');
                setThemeInCookies('ace/theme/eclipse');
            }

            editor.setValue(code);
            document.querySelector('.ace_text-input').focus();
        },

        changeTheme: function (theme) {
            editor.setTheme(theme);
        }
    };

    ACE.init();

    var buttons = document.querySelectorAll('.editor-btn');

    if (buttons) buttons.forEach(button => {
        button.addEventListener('click', () => {
            let type = button.getAttribute('data-type');
            switch (type) {
                case 'download': {} break;

                case 'fullscreen': {
                    var editor = document.querySelector('.editor');
                    if (editor) editor.classList.toggle('fullscreen');
                } break;

                case 'theme': {
                    document.body.setAttribute('data-theme', theme);
                    theme = !theme;

                    ACE.changeTheme(getTheme());
                    setThemeInCookies(getTheme());
                } break;
            }
        });
    });

    if (run) run.addEventListener('click', () => {
        let code = editor.getValue();

        // * Send to server
    });

    function getTheme() {
        return (!theme) ? 'ace/theme/dracula' : 'ace/theme/eclipse';
    }

    // * Cookies functions
    function setThemeInCookies(theme) {
        $.cookie(_ACE_THEME, theme, {path: '/', expires: 365});
    }

    function getThemeFromCookies() {
        return $.cookie(_ACE_THEME);
    }
});