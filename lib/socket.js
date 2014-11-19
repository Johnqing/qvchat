var xss = require('xss');
var util = require('./util.js');
var config = require('../config.js');
// 数据对象
global.users = {};

var errorList = {
	'kick': {
		msg: '账户已被冻结！'
	}
}

var blackList = {};
function isBackin(username){
	if(blackList[username])
		return true;
	return false;
}

function kick(user){
	var us = user.split(',');
	us.forEach(function(u){
		blackList[u] = true;
	});
}


module.exports = function(server){
	var io = require('socket.io')(server);
	io.on('connection', function(socket){

	    function formatData(data){
		    var _users = global.users[data.from];
		    // 重启服务后，重写user
		    if(!_users){
			    online(data);
		    }
		    // 数据过滤
		    data.msg = util.escapeHtml(xss(data.msg));
		    data.time = util.format(new Date(), 'h:m:ss');
		    data.random = _users.random;
		    return data;
	    }

        function online(data){
			console.log('online', data, global.users);
	        if(isBackin(data.from)){
		        data.msg = errorList['kick'].msg;
		        return socket.emit('system message', data);
	        }

            if(!global.users[data.from]){
                var rd = util.rd();
                global.users[data.from] = {
                    random: rd
                };
                socket.username = data.from;
            }
            socket.emit('online', global.users[data.from]);
        }


        socket.on('online', online);


		function message(data){
			if (isBackin(data.from)) {
				data.msg = errorList['kick'].msg;
				return socket.emit('system message', data);
			}
			// 格式化
			data = formatData(data);
			if(!global.users[data.from]){
				online(data);
			}
			// 群聊
			if (data.to == 'all') {
				socket.broadcast.emit('message', data);
				return;
			}
			// 私聊
			var clients = io.sockets.sockets;
			clients.forEach(function (client) {
				console.log(client.username, data.to);
				if (data.to.indexOf(client.username) !== -1) {
					client.emit('private message', data);
				}
			});
		}

		socket.on('message', message);
		socket.on('private message', message);
		/**
		 * 踢人
		 * $Kick|pwd|user1,user2
		 */
	    socket.on('system message', function(data){
		    if(isBackin(data.from)){
			    data.msg = errorList['kick'].msg;
			    return socket.emit('system message', data);
		    }

		    data = formatData(data);
		    var arr = data.msg.split('|');
		    var command = arr[0];
		    /**
		     * 踢出该用户
		     */
		    if(command == '$Kick' && arr[1] == config.admin.pwd){
			    kick(arr[2]);
			    data.msg = '用户' + arr[2] + '已被踢出！'
		    }
		    // 设置系统默认头像
		    data.random = '00';
		    io.sockets.emit('system message', data);
	    });

        //断开连接的事件
        socket.on('disconnect', function() {
            //将断开连接的用户从users中删除
            if (users[socket.nickName]) {
                delete users[socket.nickName];
            }
        });
    });
}