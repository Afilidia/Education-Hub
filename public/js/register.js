// -*- coding: utf-8 -*-

'use strict';

$(document).ready(function () {
    function getParam(param){
        return new URLSearchParams(window.location.search).get(param);
    }

    function checkData(data) {
        return ((data.login.length < 3) && (data.password.length < 8));
    }

    let error = getParam('error');
    let err_element = document.getElementById('error-msg');
    if (error != null && err_element) err_element.classList.toggle('show');

    $('#register-form').submit(async function (event) {        
        var data = $("#register-form").serializeArray();
        var error = document.getElementById('error-msg');
        
        // * The same passwords
        if (data[1].value === data[2].value) {

            let password = data[1].value,
                login = data[0].value;

            if (error.classList.contains('show')) error.classList.toggle('show');
            else if (checkData({
                login: login,
                password: password
            })) {
                error.innerText = "";
                error.classList.toggle('show');
            }


            await fetch('/api/register', {
                method: 'POST',
                body: {
                    login,
                    password
                },

                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }

            }).then(function (response) {
                if (response.ok) return response.json();
                return Promise.reject(response);

            }).then(function (data) {
                console.log(data);
                window.location = "/app";
            }).catch(function (error) {
                console.warn('Something went wrong.', error);
            });
        } else {
            error.innerText = "Passwords are not the same!";
            error.classList.toggle('show');
        }
        event.preventDefault();
    });
});
