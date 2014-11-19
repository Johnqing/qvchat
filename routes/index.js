var config = require('../config.js');
var room =
module.exports = function(app){

	app.get('/', function(req, res){
		if(req.cookies.user == null){
			return res.redirect('/signin');
		}
		res.render('index', {
			title: '聊天室',
			emoji: config.emoji,
			rooms: config.rooms
		});
	});

	app.get('/signin', function(req, res){
		res.render('signin', {
			title: '登录'
		});
	});
	app.post('/signin', function(req, res){
		if (global.users[req.body.name]) {
			return res.redirect('/signin');
		}
		res.cookie("user", req.body.name, {
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
		res.redirect('/');
	});
};