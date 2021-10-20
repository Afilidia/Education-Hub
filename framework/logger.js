let frameworkData = require('../data'),
os = require('os');
/**
 * Console logger
 * @param {Number} level Level of log (lower = more important)
 * @param {String} message Message to show
 * @param {String} foreground Foreground color from colors.js
 * @param {String} background Background color from colors.js
 * @param {Boolean} addEntry Defines to add or not add entry to log file
 * @returns response data
 */
let log = (level, message, foreground, background, addEntry) => {
    message = message || "";
    level = parseInt(level)==level ? level : 3;
    let loggerLevel = frameworkData.config().framework.logger.level||1,
    response = {
        loggerLevel,
        level,
        message,
        foreground,
        background,
        addEntry: addEntry==null ? true : addEntry,
        date: new Date().toUTCString()
    },
    reject = (reason, logException) => {
        response.rejected = reason;
        if(logException) log(6, `Logger error: ${reason} \n$(fg-white)${getStackTrace()}`);
        return response;
    };
    // if (!message || !level) return reject("Incorrect data"); else
    if (loggerLevel < 1)
        return reject("Level can't be lower than 1 (config.json)", false);
    else if (level < 0)
        return reject("Level can't be lower than 0 (log)", true);
    else if (loggerLevel < level)
        return reject("Lower debug level (config.json)", false);
    response.colors = {
        fg: frameworkData.colors.fg[foreground] || frameworkData.colors.fg.green,
        bg: frameworkData.colors.bg[background] || false
    };
    message = typeof message == "string" ? message : 
    `$(gb-reset)` + JSON.stringify(message, (key, value)=>{
        if(typeof value == "function") return "$(fg-red)$(gb-bright)()=>{}$(gb-reset)";
        else if(typeof value == "string") return `$(fg-green)${value}$(gb-reset)`;
        else if(typeof value == "number") return `$(fg-cyan)${value}$(gb-reset)`;
        else return value;
    }).replace(/"/g, '').replace(/(?<!\\)\\(?!\\)/g, '"').replace(/(\\\\)/g, '"');//.replace(`"$(fg-red)$(gb-bright)()=>{}$(gb-reset)"`, `$(fg-red)$(gb-bright)()=>{}$(gb-reset)`);
    for (let colorID of Object.keys(frameworkData.colors)) {
        let color = frameworkData.colors[colorID];
        if(typeof color == "string") for(let i = 0; i < message.length; i++) message = message.replace(`$(gb-${colorID})`, color);
    }
    for (let colorID of Object.keys(frameworkData.colors.fg)) {
        let color = frameworkData.colors.fg[colorID];
        for(let i = 0; i < message.length; i++) message = message.replace(`$(fg-${colorID})`, color);
    }
    for (let colorID of Object.keys(frameworkData.colors.bg)) {
        let color = frameworkData.colors.bg[colorID];
        for(let i = 0; i < message.length; i++) message = message.replace(`$(bg-${colorID})`, color);
    }
    message = message.replace(/\$\(stack\)/g, getStackTrace())
    .replace(/\$\(uptime\)/g, secondsToTimeString(process.uptime()))
    .replace(/\$\(platform\)/g, os.platform())
    .replace(/\$\(ram\)/g, `${Math.round(process.memoryUsage().heapUsed/10000)/100}MB / ${Math.round(process.memoryUsage().heapTotal/10000)/100}MB ( ${Math.round(process.memoryUsage().heapUsed/process.memoryUsage().heapTotal*10000)/100}% ) (+${Math.round(process.memoryUsage().external/10000)/100}MB)`);
    response.output = `${frameworkData.colors.reset}${response.date} | ${response.level} | ${frameworkData.colors.bright}${frameworkData.colors.fg.cyan}${frameworkData.config().framework.title}${frameworkData.colors.reset}> ${response.colors.fg}${response.colors.bg||""}${message}${frameworkData.colors.reset}­`;
    
    console.log(response.output.replace('­', ''));
    if(response.addEntry) frameworkData.addLogEntry(response.output);

    return response;
};
let getStackTrace = () => {
    try {
        // Error must be thrown to get stack in IE
        throw new Error();
    } catch (err) {
        return "\n"+(err.stack.split('\n').slice(3).join('\n'));
    }
};
let secondsToTimeString = (seconds) => {
    function pad(s){
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + 'h ' + pad(minutes) + 'm ' + pad(seconds) + 's';
}
module.exports = log;