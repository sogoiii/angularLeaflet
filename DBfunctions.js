/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ObjectId = require('mongoose').Types.ObjectId;
// var async = require('async');
var bcrypt = require('bcrypt');

/** 
 * Model files
 */

var user = require('./models/user.js')



/*
 * ******************************************** Connect to DB ***************************
 */

exports.startup = function(dbToUse) {
  mongoose.connect(dbToUse);
  mongoose.connection.on('open', function() {
    console.log('DB: startup: We have connected to mongodb');
  });
}; //end of startup



/*
 * ******************************************** Passport Authentication ***************************
 */


//Passport Local Strategy for email authentication
passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(email, password, done) {
  // asynchronous verification, for effect...
   // console.log('DB: passport: going to authenticate user now 1');
  process.nextTick(function() {
     // console.log('DB: passport: going to authenticate user now 2');
    var messageresult = null;
    user.authenticateEmail(email, password, function(err, user, messageresult) { //before: 'user' was 'email'
       // console.log('DB: passport: returning to user');
      // console.log(messageresult); //this does return the right thing to console
      if(messageresult == 'incorrect user') {
        return done(null, false, {
          message: 'Unkown user'
        });
      } //left side is the output of the teacher users function, the right side is what is sent to the login page
      if(messageresult == 'wrong password') {
        return done(null, false, {
          message: 'Invalid password'
        });
      }
      return done(err, user); //i use to return 'email' not 'user'
    }); //end authenticate
  });
} //end username password done
));

//serialize user login
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//deserialize user on logout
passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    done(err, user);
  });
});

/*
 * ******************************************** Functions to complete specific Tasks ***************************
 */






/*
 * ******************************************** ENTERING ALL DB calls!!!! ***************************
 */











