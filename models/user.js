var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, "email");
var Email = mongoose.SchemaTypes.Email;
var bcrypt = require('bcrypt');




var safe = { j: 1, wtimeout: 10000 };//writes to this will be on journal and have a timeout of 10 seconds

//Schema Definition
var user = new Schema({
    email: {type: Email, unique: true },
    firstName: {type: String, required: true},
    middleName: {type: String},
    lastName: {type: String, required: true},
    userType: {type: String, required: true, default: 'normal'},
    userCreated: {type: Date, default: Date.now},
    confirmed: {type: Boolean, default: false},
    betaPass: {type: Boolean, default: false},
    hash: {type: String, required: true},
    salt: {type: String, required: true},
  },
{safe: safe}
);




user.virtual('password')
      .get(function () {
        return this._password;
      })
      .set(function (password) {
        this._password = password;
        var salt = this.salt = bcrypt.genSaltSync(10);
        this.hash = bcrypt.hashSync(password, salt);
      });



user.method('verifyPassword', function(password, callback) {
  // console.log('going to authenticate user now veri 1');
   // console.log("password = " + password)
   // console.log("hash = " + this.hash);
  bcrypt.compare(password, this.hash, callback);
   // console.log('going to authenticate user now veri 2');
});






//authenticate the teacher user 
user.static('authenticateEmail', function(email, password, callback) {
   // console.log('going to authenticate user now 3');
  var messageresult = new String();
   // console.log('going to authenticate user now 4');
  this.findOne({ email: email}, function(err, user, messageresult ) {
      if (err) { 
         // console.log('going to authenticate user now 5');
        return callback(err); }
      if (!user) { 
         // console.log('going to authenticate user now 6');
        return callback(null, false, 'incorrect user'); 
      }
        // console.log('going to authenticate user now 7');
        user.verifyPassword(password, function(err, passwordCorrect) {
           // console.log('going to authenticate user now 8: passwordCorrect = ' +passwordCorrect );
          if (err) { 
             // console.log('going to authenticate user now 9');
            return callback(err); }
          if (!passwordCorrect) { 
             // console.log('going to authenticate user now 10');
          return callback(null, false, 'wrong password');
          } //this gets send to console when the unique error is passed
           // console.log('going to authenticate user now 11');
          return callback(null, user, 'user was found and authenticated');
        });
      //if(user.password != password){return callback(null, false, { message: 'Invalid password' });}
      //return callback(null,user);
      });
    });







module.exports = mongoose.model('user', user );


