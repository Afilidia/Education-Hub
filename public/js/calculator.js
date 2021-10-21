// -*- coding: utf-8 -*-

'use strict';

const SEPARATOR = '&';

let number = false
, mathac = false
, mathed = false;

function clear() {
    var wrapper = document.querySelector('.results-wrapper');
    if (wrapper) wrapper.innerHTML = '';
    window.localStorage.removeItem(_LOCAL_SUM_HISTORY);
}

function action(el) {
    if(+el.innerText == el.innerText || (el.innerText == "." && !number.includes("."))) {
        number = (!mathed?number||"":"") + el.innerText;

        if (mathed) document.querySelector(".calculator > .screen").children[0].value = "";
        mathed = false;

    } else if (el.innerText == "=" && mathac) {
        document.querySelector(".calculator > .screen").children[0].value += mathac + number;

        mathac = false;
        number = Math.round(eval(""+document.querySelector(".calculator > .screen").children[0].value)*100000000)/100000000;
        save_n_displaySum(document.querySelector(".calculator > .screen").children[0].value+" = "+number);
        mathed = true;

    } else if(number && el.innerText != "=" && el.innerText != "."  && el.innerText != "C" && el.innerText != "-+"
    // && !(document.querySelector(".calculator > .screen").children[0].value.endsWith("/")||document.querySelector(".calculator > .screen").children[0].value.endsWith("*")||document.querySelector(".calculator > .screen").children[0].value.endsWith("-")||document.querySelector(".calculator > .screen").children[0].value.endsWith("+"))
    ) {
    if((number&&mathac)||document.querySelector(".calculator > .screen").children[0].value.length==0) document.querySelector(".calculator > .screen").children[0].value += document.querySelector(".calculator > .screen").children[0].value.length > 0 ? `${mathac||""}${number||""}` : number;
    if(mathed) document.querySelector(".calculator > .screen").children[0].value = number;
    mathac = el.innerText;
    number = false;
    mathed = false;
    } else if (el.innerText == "-+") number = -number;
    else if (el.innerText == "C") {
        document.querySelector(".calculator > .screen").children[0].value = "";
        mathac = false;
        number = false;
        mathed = false;
    }
    document.querySelector(".calculator > .screen").children[2].value = `${number || ""}${document.querySelector(".calculator > .screen").children[0].value.length > 0 ? mathac || "" : ""}`
}

function save_n_displaySum(sum) {

    let history = [], chain = '';
    let local = window.localStorage.getItem(_LOCAL_SUM_HISTORY);

    var wrapper = document.querySelector('.results-wrapper');
    var HTML = `<div class="result">
                <span class="text">${sum}</span>
            </div>`;

    if (local) {
        history = local.split(SEPARATOR);
        if (history[0] == '') history.shift();
        history.push(sum);
        chain = history.join(SEPARATOR);

    } else {
        chain = SEPARATOR + sum;
    }

    window.localStorage.setItem(_LOCAL_SUM_HISTORY, chain);
    if (wrapper) wrapper.insertAdjacentHTML('afterbegin', HTML);
}



$(document).ready(function (event) {
    const SEPARATOR = '&';

    // * Generate history tiles
    generateHistory();

    document.getElementById('clear').addEventListener('click', () => {
        clear();
    });

    function generateHistory() {

        var wrapper = document.querySelector('.results-wrapper');

        let local = window.localStorage.getItem(_LOCAL_SUM_HISTORY);

        if (local && wrapper) {
            let history = local.split(SEPARATOR);
            if (history[0] == '') history.shift();

            for (let i=0; i<history.length; i++) {
                var HTML = `<div class="result">
                            <span class="text">${history[i]}</span>
                        </div>`;

                wrapper.insertAdjacentHTML('afterbegin', HTML);
            }
        }
    }
});
