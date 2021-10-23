// -*- coding: utf-8 -*-

'use strict';


// * Keys * //
const _TOKEN_COOKIE = 'token';
const _DATA_COOKIE = 'data';

const _FILE_LIST = '_file-list';
const _FILE_STATE = '_file-state';

const _LOCAL_SUM_HISTORY = '_sum_history';

const _ACE_THEME = '_ace-theme';

// * Endpoints * //
const ENDPOINTS = {
    todo: {
        create: '/api/todo/create',      // task
        read: '/api/todo/read',          //
        update: '/api/todo/update',      // done, task, id
        delete: '/api/todo/delete',      // id
    }
};

// * FILE * //
const SUPPORTED_EXT = ['txt'];