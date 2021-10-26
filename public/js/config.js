// -*- coding: utf-8 -*-

'use strict';


// * Keys * //
const _TOKEN_COOKIE = 'token';
const _DATA_COOKIE = 'data';

const _FILE_LIST = '_file-list';
const _FILE_STATE = '_file-state';

const _LOCAL_SUM_HISTORY = '_sum_history';

const _ACE_THEME = '_ace-theme';
const _ACE_LANGUAGE_SELECTED = '_ace-selected-l';
const _USER_CODE = '_user-code';

const _COOKIES_ACCEPTED = '_cookies_accepted';

// * Endpoints * //
const ENDPOINTS = {
    todo: {
        create: '/api/todo/create',      // task
        read: '/api/todo/read',          //
        update: '/api/todo/update',      // done, task, id
        delete: '/api/todo/delete',      // id
    }
};

const USER_CODE = {
    js: ``,
    py: ``,
    cs: ``,
    java: ``,
    php: ``
};

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

const startingLanguageCode = {
    js: `// This is a automatically generated Javascript file\n// Click the 'Run' button on the right to see the output\n\n(function () {\n\tconsole.log('Hello world!');\n})();`,
    py: `# This is a automatically generated Python file\n# Click the 'Run' button on the right to see the output\n\nif __name__ == '__main__':\n\tprint("Hello world!")\n`,
    cs: `// This is a automatically generated C# file\n// Click the 'Run' button on the right to see the output\n\nusing System;\n\npublic class Class {\n\n\tpublic Class() {\n\t\t//\n\t}\n\n\tstatic void Main(string[] args) {\n\t\tSystem.Console.WriteLine("Hello World!");\n\t}\n}`,
    java: `// This is a automatically generated Java file\n// Click the 'Run' button on the right to see the output\n\npublic class Class {\n\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello world!");\n\t}\n}`,
    php: `<?php\n\t// This is a automatically generated PHP file\n// Click the 'Run' button on the right to see the output\n\necho('Hello world!');\n\t`,
};

// * FILE * //
const SUPPORTED_EXT = ['txt'];