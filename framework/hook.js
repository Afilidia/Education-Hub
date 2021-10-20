let hookcord = require('hookcord'),
os = require('os'),
colors = require('./colors');

/**
 * ### Webhook sender
 * @param {string} message message to send to webhook
 * @returns 
 */
module.exports = (message) => {
    let config = require('../config.json');
    if(!config.discord.enabled||!config.discord.webhook) return;
    for (let colorID of Object.keys(colors)) {
        let color = colors[colorID];
        if(typeof color == "string") for(let i = 0; i < message.length; i++) message = message.replace(`${color}`, '');
    };
    for (let colorID of Object.keys(colors.fg)) {
        let color = colors.fg[colorID];
        for(let i = 0; i < message.length; i++) message = message.replace(`${color}`, '');
    };
    for (let colorID of Object.keys(colors.bg)) {
        let color = colors.bg[colorID];
        for(let i = 0; i < message.length; i++) message = message.replace(`${color}`, '');
    };
    new hookcord.Hook()
    .setLink(config.discord.webhook)
    .setPayload({'embeds': [{
        'title': config.framework.title,
        'description': message,
        /* 'fields': [{
            'name': '­',
            'value': `**Version**`,
            'inline': true
        },{
            'name': '­',
            'value': `${require('../package.json').version}`,
            'inline': true
        },{
            'name': '­',
            'value': `­`,
            'inline': true
        },{
            'name': '­',
            'value': `**Platform**`,
            'inline': true
        },{
            'name': '­',
            'value': `${os.platform()}`,
            'inline': true
        },{
            'name': '­',
            'value': `­`,
            'inline': true
        },{
            'name': '­',
            'value': `**RAM**`,
            'inline': true
        },{
            'name': '­',
            'value': `${Math.round(process.memoryUsage().heapUsed/10000)/100}MB`,
            'inline': true
        },{
            'name': '­',
            'value': `­`,
            'inline': true
        }], */
        'timestamp': new Date()
    }]})
    .fire()
    .then(function(response) {
        
    })
    .catch(function(e) {
        throw new Error(e);
    });
}