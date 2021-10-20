let data = require('./data'),
framework = {
    colors: data.colors,
    config: data.config,
    log: require('./framework/logger'),
    admin: require('./framework/admin'),
    logo: require('./framework/logo'),
    cli: require('./framework/cli'),
    languages: require('./framework/languages'),
    html: require('./framework/html'),
    css: require('./framework/css'),
    hook: require('./framework/hook'),
    Host: require('./framework/host')
};
module.exports = framework;