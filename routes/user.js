
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};




exports.userIndex = function(req, res){


	console.log('user data was requested')
	

	res.json({firstName: "Tammy", lastName: "Gradling" , otherData: 'MORE DATA'})

};//end of userIndex