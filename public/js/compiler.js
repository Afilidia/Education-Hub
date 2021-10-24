// -*- coding: utf-8 -*-

'use strict';

$(document).ready(async function () {
    var input = document.getElementById('input'),
        output = document.getElementById('output');

    var currentLanguage = 'js';
    var run = document.getElementById('run');
    var code = getStartingCode(currentLanguage);
    var filename = document.getElementById('filename');

    var options = document.getElementById('app-cover').querySelectorAll('.option');
    var buttons = document.querySelectorAll('.editor-btn');

    var theme = true;

    const modes = {
        js: "ace/mode/javascript",
        py: "ace/mode/python",
        cs: "ace/mode/csharp",
        java: "ace/mode/java",
        php: "ace/mode/php",
    };

    const files = {
        js: 'app.js',
        py: 'main.py',
        cs: 'main.cs',
        java: 'main.jar',
        php: 'index.php'
    }


    // * Plug input & output to the lib functions
    const editor = ace.edit("input");

    const ACE = {
        init: function() {
            editor.session.setMode(getMode());

            let cookieTheme = getThemeFromCookies();

            if (cookieTheme) {
                editor.setTheme(cookieTheme);

                if (cookieTheme.endsWith('dracula')) {
                    document.body.setAttribute('data-theme', theme);
                    theme = !theme;
                }

            } else {
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

    // * Select saved language
    if (getLanguageFromCookies()) {
        var lang = getLanguageFromCookies();

        var option = (() => {
            let o = null;
            if (options) options.forEach(opt => {
                if (opt.getAttribute('data-language') == lang) o = opt;
            });

            return o;
        })();

        let radios = option.querySelectorAll('input[type="radio"]');

        if (radios) radios.forEach(radio => {
            radio.checked = true;
        });

        prepareEditorForLanguage(lang);
    }

    if (buttons) buttons.forEach(button => {
        button.addEventListener('click', () => {
            let type = button.getAttribute('data-type');
            switch (type) {
                case 'download': {
                    // * Download current file
                    var blob = new Blob(['' + getCode()], {type: 'text/plain;charset=utf-8'});
                    var url = window.URL || window.webkitURL;
                    var link = url.createObjectURL(blob);
                    var a = document.createElement('a');

                    a.download = files[currentLanguage];
                    a.href = link;

                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                } break;

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

    if (options) options.forEach(option => {
        option.addEventListener('click', () => {
            // * Save the latest code in cookies
            // saveCodeToCookies(currentLanguage);

            // * Switch to clicked
            let lang = option.getAttribute('data-language');
            let input = document.getElementById('options-view-button');
            currentLanguage = lang;

            setLanguageInCookies(lang);
            prepareEditorForLanguage(lang);
            input.checked = false;
        });
    });

    if (run) run.addEventListener('click', () => {
        let code = editor.getValue();

        // * Send to server
    });



    function getTheme() {
        return (!theme) ? 'ace/theme/dracula' : 'ace/theme/eclipse';
    }

    function getMode(lang) {
        return modes[lang] || modes['js'];
    }

    function getStartingCode(lang) {
        return startingLanguageCode[lang];
    }

    function prepareEditorForLanguage(lang) {
        currentLanguage = lang;
        editor.session.setMode(getMode(currentLanguage));
        if (filename) filename.textContent = files[currentLanguage];

        // ! Temporary set the starting code when switched to
        // ! The other language
        // ! -> Later save the code before switching and load it
        // ! -> when switched back
        editor.setValue(getStartingCode(currentLanguage));
    }

    // * Gets value from editor
    function getCode() {
        return editor.getValue();
    }

    function saveCodeToCookies(lang) {
        code[lang] = getCode();
        $.cookies(_USER_CODE, JSON.stringify(code), {path: '/', expires: 365});
    }

    function getCodeFromCookies() {
        return JSON.parse($.cookies(_USER_CODE)) || '';
    }

    // * Cookies functions
    function setThemeInCookies(theme) {
        $.cookie(_ACE_THEME, theme, {path: '/', expires: 365});
    }

    function getThemeFromCookies() {
        return $.cookie(_ACE_THEME);
    }

    function setLanguageInCookies(lang) {
        $.cookie(_ACE_LANGUAGE_SELECTED, lang, {path: '/', expires: 1});
    }

    function getLanguageFromCookies() {
        return $.cookie(_ACE_LANGUAGE_SELECTED);
    }
});