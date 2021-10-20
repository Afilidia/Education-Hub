let fs = require('fs'),
path = require('path'),
languages = {},
langFiles = fs.readdirSync(path.join(__dirname, '/languages'), {withFileTypes: "json"});
if(langFiles) langFiles.forEach((filedata)=>{
    let filename = filedata.name;
    languages[filename.slice(0, -5)] = require('./languages/' + filename);
});
module.exports = languages;