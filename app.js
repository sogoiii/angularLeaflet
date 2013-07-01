
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var helmet = require('helmet');

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
  var mongooseSessionStore = new mongoStore({
    url: "mongodb://localhost/angular-uiTesting_sessions",
    interval: 3600000
  });


// var app = express();
var app = module.exports = express();

// all environments
app.set('port', process.env.PORT || 3000);
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(helmet.xframe());
app.use(helmet.iexss());
app.use(helmet.contentTypeOptions());



app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
// app.use(express.session()); //become stateless for lower memory and fastness (no remote calls to external servers like mongo or redis)//also set cookie httpOnly and secure only
  app.use(express.session({
    cookie: {
      maxAge: 3600000
    },
    store: mongooseSessionStore,
    secret: "Secret Client Class",
    key: 'connect.sid'
  }));
  app.use(passport.initialize());
  app.use(passport.session());  
// app.use(express.compress()); //have responses (from server to client) gzipped //slow
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/app/'));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



/**
 * ensureAuthenticated
 */
function ensureAuthenticated(req, res, next) {
  // console.log('i am inside ensureAuthenticated')
  if (req.isAuthenticated('myownauthenkeys')) {
    return next();
  }
  // res.header('WWW-Authenticate', 'Basic realm="Login with email/password"');
  console.log('user has not passed ensureAuthenticated')
  res.redirect(401,'/');
} //end of ensureAuthenticated





// app.get('/', routes.index);
 app.get("/", function(req, res) {//this default page will go for the angular site
  console.log('going to send index html')
  // res.redirect("/index.html");
  res.send("index.html")
});


app.get('/static/:name', function(req, res){
	console.log('will send out file at::: views/'+ req.params.name)
	res.sendfile("./app/views/"+req.params.name)
})

app.get('/static/:group/:name', function(req, res){
	console.log('this is the static group request:::: ' + './app/views/'+req.params.group + '/' + req.params.name)
	res.sendfile('./app/views/'+req.params.group + '/' + req.params.name)

})





app.get('/users', user.list);

app.post('/api/login', passport.authenticate('local'), routes.login)

app.get('/api/user/:userId', ensureAuthenticated, user.userIndex)

// app.post('/api/login/:data', routes.login)



app.get("*", function(req, res) {// I could chnage this to the 404 page which can load other things as well
  console.log('no route found, sending index.html file manually')
  // res.redirect("/");
  res.sendfile("./app/index.html")
  // res.send("index.html")
  // res.sendfile("./app/404.html");
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
