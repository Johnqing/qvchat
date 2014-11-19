var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var socket = require('./lib/socket.js');
var routes = require('./routes/index');

var app = express();
// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

var partials = require('express-partials');
app.use(partials());

app.use(compression());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var cacheTime = 7*24*60*60*1000;
app.use(express.static(path.join(__dirname, 'public/build'), {
    maxAge: cacheTime
}));

app.use(logger('dev'));

routes(app);

// 页面日志处理
app.use(function(req, res, next){
    var err = req.flash('error')
    , success = req.flash('success');

    res.locals.user = req.session.user;
    res.locals.error = err.length ? err : null;
    res.locals.success = success.length ? success : null;
    next();
});


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
var io = require('socket.io');
socket(server);