let
framework = require('./framework'),
fs = require('fs'),
Table = require('easy-table'),
line = ()=>{},
list = {
    log: {
        search: {exec: (args)=>{framework.admin.searchLogs(args.join(" "))}, desc: "Search entries in log with text"},
        calculate: {exec: (args)=>{framework.admin.searchLogs(args.join(" "), true)}, desc: "Calculate entries in log with text"},
        exec: (args)=>{list.help.exec(["log"])}, desc: "Log managment command"
    },
    config: {
        update: {exec: (args)=>{
            try {
                let newData = JSON.parse(args[0]);
                framework.log(0, `Config before update: ${JSON.stringify(framework.config())}`);
                framework.admin.updateConfig(newData);
                framework.log(0, `Config after update: ${JSON.stringify(framework.config())}`);
            } catch (e) {framework.log(0, "Error when parsing data: $(fg-red)" + e + "$(gb-reset) | Aborting config update.")};
        }, desc: "Update config with JSON data"},
        get: {exec: (args)=>{
            let now = framework.config();
            let getProperty = (i) => {i=parseInt(i)==i?i+1:0; if(i<args.length) {now = now[args[i]]||{}; return getProperty(i);} else return now;};
            now = getProperty();
            framework.log(0, JSON.stringify(now)=="{}"?"Property not exist or is empty":now);
        }, desc: "Get config property"},
        exec: (args)=>{list.help.exec(["config"])}, desc: "Config managment command"
    },
    echo: {exec: (args)=>{framework.log(0,args.join(" "))}, desc: "Print text to CLI"},
    help: {exec: (args)=>{
        if(args[0]&&list[args[0]]) {
            let fullCommand = list[args[0]];
            for (let i = 1; i < args.length; i++) fullCommand = fullCommand[args[i]] || false;
            if(!fullCommand||(!fullCommand.desc&&Object.keys(fullCommand).length<2)) return framework.log(0, "This command is not available to show");
            let table = new Table();
            if(Object.keys(fullCommand).length>1) {
                Object.keys(fullCommand).forEach(commandKey => {
                    let commandValue = fullCommand[commandKey];
                    if(commandKey != "exec" && commandKey != "desc") {
                        table.cell('Argument', `${commandKey}`);
                        table.cell('Description', `$(gb-reset)${commandValue.desc||""}$(fg-cyan)`);
                        table.newRow();
                    }
                });
            }
            framework.log(0, `$(fg-cyan)${args.join(" ")}$(gb-reset)${fullCommand.desc ? `\t-\t${fullCommand.desc}`:""}\n$(fg-cyan)${table.toString()}`);
        } else {
            let table = new Table();
            Object.keys(list).forEach(commandKey => {
                let commandValue = list[commandKey];
                table.cell('Command', `${commandKey}`);
                table.cell('Description', `$(gb-reset)${commandValue.desc||""}$(fg-cyan)`);
                table.newRow();
            });
            framework.log(0, `$(fg-cyan)Hello Admin! $(fg-cyan)Here is your abilities list:$(gb-reset)\n$(fg-cyan)${table.toString()}`);
        }
    }, desc: "Commands list"},
    run: {exec: (args=>{
        fs.readFile(args[0],(err, script)=>{
            if(err) return framework.log(0,`$(fg-red)No such file`)
            script = script.toString();
            let i = 0;
            let lines = script.split('\n');
            let runnextline = () => {
                line(lines[i]);
                i++;
                if(i<lines.length) runnextline();
            };
            runnextline();
        });
    }), desc: "Executes Raptor script (file.rs)"},
    uptime: {exec: (args)=>{
        framework.log(0, "$(uptime)");
    }, desc: "Shows you an uptime"},
    clear: {exec: (args)=>{
        console.clear();
    }, desc: "Clears terminal"},
    diagnostic: {exec: (args)=>{
        process.report.writeReport(args.length?args.join(" "):"diag.json");
    }, desc: "Creates file with diagnostic data"},
    restart: {exec: (args)=>{
        process.exit();
    }, desc: "Restarts worker"},
    stop: {exec: (args)=>{
        process.exit(2);
    }, desc: "Sends exit signal to manager"},
    eval: {exec: (args)=>{
        try {
            framework.log(0, eval(args.join(" ")));
        } catch(err) {
            framework.log(0, `Error in evaluate execution: $(fg-red)${err}$(fg-white)\n${err.stack}`);
        }
    }, desc: "Evaluates JS code"}
},
update = (linef) => {
    line = linef;
};
module.exports = {update, list};