const framework = require('../framework');

let log = require('./logger'),
data = require('../data'),
/**
 * ### CLI initializator
 * @param {object} commands Object with CLI commands
 */
init = (commands) => {
    commands = commands || {help: {exec: (args)=>{log(0, `$(fg-red)No commands config specified, please pass config by CLI init args`)}}};
    let rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
        completer: (line) => {
            if (line.length==0) return [Object.keys(commands), ""];
            let command = line.trim().match(/(?:[^\s"]+|"[^"]*")+/g);
            if(!command||command.length<1) return;
            command.forEach(commandArg => {
                commandArg = commandArg.replace(/^\"|\"$/g, '');
            });
            let i = 0;
            let commandFinder = (fullDefinition) => {
                i++;
                if(!fullDefinition||i>command.length-1) return false;
                else if(fullDefinition&&fullDefinition[command[i]]) return commandFinder(fullDefinition[command[i]]);
                else return [fullDefinition, i];
            }
            let definition = commandFinder(commands[command[i]] || false);
            let completions = [];
            let start = "";
            for (let argI = 0; argI < command.length - 1; argI++) start += command[argI]+" ";
            Object.keys(definition[0]||commands).forEach(command => {
                if(command!="exec"&&command!="desc") completions.push(command);
            });
            const hits = completions.filter((c) => c.startsWith(command[command.length-1]));
            if(hits.length==1) rl.write(hits[0].slice(command[command.length-1].length));
            return [hits.length ? hits : completions, hits.length==1?start+hits[0]:line];
        }
    });
    rl.setPrompt('');
    rl.on('line', (line) => {
        this.line(line);
    });
    /**
     * ### Command executor
     * @param {string} line Command line
     */
    this.line = (line) => {
        rl.pause();
        data.addLogEntry(`Console executing command: ${line}`)
        let command = line.trim().match(/(?:[^\s"]+|"[^"]*")+/g);//(/([^"]+)|("(?:[^"\\]|\\.)+")/g);
        log(8, command);
        if(!command||command.length<1) return rl.resume();
        for (let argI = 0; argI < command.length; argI++) {
            command[argI] = command[argI].replace(/(^\"|\"$)/g, '');
        }
        let i = 0;
        let commandFinder = (fullDefinition) => {
            i++;
            log(8, [command[i-1], command[i], fullDefinition, i])
            if(!fullDefinition||i>command.length) return false;
            else if(fullDefinition&&fullDefinition[command[i]]) return commandFinder(fullDefinition[command[i]]);
            else return [fullDefinition, i];
        }
        let definition = commandFinder(commands[command[i]] || false);
        if(!definition) {
            rl.resume();
            return log(0, "Oops! No such command");
        } else if(typeof definition[0].exec != "function") {
            rl.resume();
            log(3, definition)
            return log(0, "Oops! Error when executing command");
        };
        definition[0].exec(command.splice(definition[1]));
        rl.resume();
    }
    return this.line;
};
module.exports = init;