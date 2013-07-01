
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