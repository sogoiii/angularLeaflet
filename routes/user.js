
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};




exports.userIndex = function(req, res){


	console.log('user data was requested')

	res.json({firstName: "Samson", otherData: 'MORE DATA'})

};//end of userIndex