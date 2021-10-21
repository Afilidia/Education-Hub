// -*- coding: utf-8 -*-

'use strict';


// * Keys * //
const _TOKEN_COOKIE = 'token';
const _DATA_COOKIE = 'data';

// * Endpoints * //
const ENDPOINTS = {
    todo: {
        create: 'api/todo/create',      // task
        read: 'api/todo/read',          //
        update: 'api/todo/update',      // done, task, id
        delete: 'api/todo/delete',      // id
    }
};