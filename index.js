let framework = require('./framework'),
spawn = () => {
    framework.log(0, "Loading worker...");
    let app = require("child_process").spawn('node', ['loader.js', '--stacksize=10000'], {
        cwd: process.cwd(),
        detached : false,
        stdio: "inherit"
    });
    app.on("exit", function (code) {
        framework.log(0, "Worker exited with code " + code);
        if(code==2) process.exit(0);
        spawn();
    });
};
spawn();