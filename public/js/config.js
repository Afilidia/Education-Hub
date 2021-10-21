// -*- coding: utf-8 -*-

'use strict';


// * Keys * //
const _TOKEN_COOKIE = 'token';
const _DATA_COOKIE = 'data';

const _LOCAL_SUM_HISTORY = '_sum_history';

// * Endpoints * //
const ENDPOINTS = {
    todo: {
        create: '/api/todo/create',      // task
        read: '/api/todo/read',          //
        update: '/api/todo/update',      // done, task, id
        delete: '/api/todo/delete',      // id
    }
};