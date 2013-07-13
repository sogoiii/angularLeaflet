var dbFun = require('../DBfunctions'); //access to the DB and other functions




exports.userIndex = function(req, res){


	console.log('user data was requested')
	

	dbFun.userIndex(req.params.userId, function(err,result){
		if(!err) {
			console.log('userIndex request was successfull')
			res.json({firstName: result.firstName, lastName: result.lastName, userId: result._id})
		} else {
			console.log('userIndex requeset failed')
			res.json({firstName: null, lastName: null, userId: null})
		};//end of !err tree
	});//end of userIndex
};//end of userIndex