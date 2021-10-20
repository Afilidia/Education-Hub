let
framework = require('./framework'),
config = framework.config();
framework.log(0, framework.logo, false, false, false);
let line = ()=>{}
let commands = require('./commands');
commands.update(framework.cli(commands.list));
require('./bin/www')(config.server.port);