let log = require('./logger'),
data = require('../data'),
fs = require('fs'),
admin = {
    /**
     * ### Search log for string
     * @param {string} searchString String to search for
     * @param {boolean} onlyCalc If true, only total result count is shown
     */
    searchLogs: (searchString, onlyCalc) => {
        data.readLog((logFile)=>{
            let results = [];
            let line = 0;
            let entries = logFile.split(`­\n${data.colors.reset}`);
            entries.forEach(entry => {
                entry.split("\n").forEach(_ => {line++});
                if(entry.includes(searchString)) results.push([line,entry]);
            });
            let resStr = "";
            if(!onlyCalc) results.forEach(result => {
                resStr += `$(fg-cyan)Line: ${result[0]}\n$(fg-white)${result[1]}\n`;
            });
            resStr += `$(fg-cyan)Total results: ${(logFile.match(new RegExp(searchString, 'g')) || []).length}`;
            log(0, resStr, false, false, false)
        });
    },
    /**
     * ### Update config properties
     * @param {object} properties Object with properties and values to update in main config
     */
    updateConfig: (properties) => {
        let before = require('../config.json');
        let update = (o, o2) => { 
            let replacedStrings = Object.keys(o) 
                .filter(key => typeof o[key] != "object") 
                .reduce((accu, key) => ({ ...accu, [key]: o2[key]!=null?o[key]=o2[key]:o[key] }), {}); 
            let updatedChildren = Object.keys(o) 
                .filter(key => typeof o[key] === "object") 
                .reduce((accu, key) => ({ ...accu, [key]: o2[key]!=null?update(o[key], o2[key]):o[key] }), {}); 
            return o; 
        }
        let after = update(before, properties);
        fs.writeFileSync('../config.json', JSON.stringify(after));
        log(0, `Updated config with:\n${properties}\nfrom:$(stack)`);
    }
}
module.exports = admin;