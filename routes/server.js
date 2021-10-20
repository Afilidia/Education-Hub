let express = require('express'),
router = express.Router(),
framework = require('../framework'),
host = new framework.Host(router);

let cache = {styles: {buttons: require('../views/buttons')}, buttonmain: require('../views/buttonmain')};
let updateCache = async () => {
  cache.styles.buttons = require('../views/buttons');
  cache.buttonmain = require('../views/buttonmain');
}

host.script('/buttonmain.js', cache.buttonmain, ()=>{
  updateCache();
});
host.style('/buttons.css', cache.styles.buttons, ()=>{
  updateCache();
});

//		Landing page	 //
host.pager("", "landing/", ()=>{return true}, "/");

module.exports = router;
