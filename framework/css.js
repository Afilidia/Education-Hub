let log = require('./logger');
let css = {
    /**
     * ### CSS parser
     * @param {string} stringifiedCSS Stringified CSS
     * @returns Objected CSS
     */
    parse: (stringifiedCSS) => {
        if (typeof stringifiedCSS !== 'string') return false;
        else if(!stringifiedCSS.includes("{")&&!stringifiedCSS.includes("}")) stringifiedCSS = `{${stringifiedCSS}}`;
        else if((!stringifiedCSS.includes("{")&&stringifiedCSS.includes("}"))||stringifiedCSS.includes("{")&&!stringifiedCSS.includes("}")) return false;
        let objectedCSS = {};
        let groups = stringifiedCSS.split('}');
        groups.forEach(group => {
            if(group=="") return;
            group = group.split('{');
            if(group[1]==undefined) group[1] = group[0];
            let selector = group[0].trim();
            objectedCSS[selector] = {};
            group[1].split(';').forEach(property=>{
                property = property.split(':');
                if(property[1]==undefined) return;
                objectedCSS[selector][property[0].trim().replace(/-(\w|$)/g, (dash, next) => next.toUpperCase())] = property[1].trim();
            })
        });
        return objectedCSS[""]?objectedCSS[""]:objectedCSS;
    },
    /**
     * ### CSS stringifier
     * @param {object} objectedCSS Objected CSS
     * @returns {string} Stringified CSS
     */
    stringify: (objectedCSS) => {
        if (typeof objectedCSS !== 'object') return false;
        let stringifiedCSS = "";
        Object.keys(objectedCSS).forEach(selector=>{
            stringifiedCSS += `${selector} { `;
            Object.keys(objectedCSS[selector]).forEach(property=>{
                stringifiedCSS += `${property.replace(/([A-Z])/g, char => `-${char[0].toLowerCase()}`)}: ${objectedCSS[selector][property]}; `
            });
            stringifiedCSS += `} `;
        });
        return stringifiedCSS.slice(0, -1);
    }
}
module.exports = css;