let
framework = require('./framework'),
config = framework.config(),
fs = require('fs'),

stats = {
    view: (req, res, next) => {
        stats.storage[req.url] = stats.storage[req.url] || {
            views: 0,
            ips: {}
        };
        stats.storage[req.url].views++;
        stats.storage[req.url].ips[req.headers['x-forwarded-for'] || req.socket.remoteAddress] = (stats.storage[req.url].ips[req.headers['x-forwarded-for'] || req.socket.remoteAddress]||0)+1;
    },
    storage: {},
    save: () => {
        fs.writeFile('./stats.json', JSON.stringify(stats.storage), (err)=>{return err;});
        return true;
    },
    load: () => {
        stats.storage = require('./stats.json') || {};
        return stats.storage || {};
    }
},

createError = require('http-errors'),
express = require('express'),
path = require('path'),
cookieParser = require('cookie-parser'),
lessMiddleware = require('less-middleware'),
logger = require('morgan'),

apiRouter = require('./routes/api'),
serverRouter = require('./routes/server'),

app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(logger('combined', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


let basicAuth = require('basic-auth');
let auth = function(req, res, next){
    let user = basicAuth(req);
    if(user && user.name == framework.config().docs.user && user.pass == framework.config().docs.pass)
        return next();
    else{
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    }
}

app.use(function(req, res, next){
    res.setHeader("X-Powered-By", "Afilidia");
    stats.view(req, res, next);
    stats.save();
    
    if(req.url.indexOf('docs') != -1){
        return auth(req, res, next);
    } else next();
});
app.use('/docs', express.static(path.join(__dirname, 'docs')));


app.use(config.server.api.path, apiRouter);
app.use('/', serverRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    framework.log(0, `404 from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress} to ${req.url}`)
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

stats.load();
framework.log(0, 'Loaded');

module.exports = app;