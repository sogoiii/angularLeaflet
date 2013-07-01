
var dbFun = require('../DBfunctions'); //access to the DB and other functions


/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.login = function(req, res){
	console.log('login request made')
	// console.log(req.body)
	// console.log(req.session.passport.user)
	// res.json({Data: {authorized: true, redirectTO: ''}});//debug line, just for testing now
	res.json({authorized: true, redirectTO: '/user/' + req.session.passport.user , userId: req.session.passport.user });//debug line, just for testing now
}


exports.register = function(req, res){

	console.log(req.body)


	dbFun.registerUser(req.body, function(err, result){
		if(!err){
			console.log('routes:: register :: will return data')
			
			res.json({authorized: true, redirectTO: '/user/' + result._id , userId: result._id })
		} else {
			console.log('routes:: registerUser :: ERRR = ' + err);
			res.json({authorized: false, redirectTO: null , userId: null })
		};//end of !err tree
	});//endof registerUserDB call


	// res.json({authorized: true, redirectTO: '/user/' + req.session.passport.user , userId: req.session.passport.user })
};//end of register