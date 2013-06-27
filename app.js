
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var mongoStore = require('session-mongoose');



/** 
 * External dependencices
 */
var routes = require('./routes')
var user = require('./routes/user')




/**
 * Application Setup
 */

var dbFun = require('./DBfunctions');
var dbloc = 'mongodb://localhost/angular-uiTesting'; //Change the name of the mongoDB, db
var db = new dbFun.startup(dbloc);



// var app = express();
var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/app'));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}










// app.get('/', routes.index);
 app.get("/", function(req, res) {//this default page will go for the angular site
  console.log('going to send html')
  res.redirect("/index.html");
});




app.get('/users', user.list);

app.post('/api/login', routes.login)

// app.post('/api/login/:data', routes.login)


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
