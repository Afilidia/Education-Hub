let fs = require('fs'),
hook = require('./framework/hook');
module.exports = {
    colors: require('./framework/colors'),
    config: ()=>{return require('./config.json')},
    addLogEntry: (text) => {
        fs.appendFile(`./main.log`, `\n${text}`, 'utf8', (err)=>{});
        hook(text);
    },
    readLog: (callback) => {
        callback(fs.readFileSync('./main.log', 'utf8').toString());
    }
};