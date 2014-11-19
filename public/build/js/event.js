(function(window, document){
	// 上线
	qv.socket.emit('online', {from: qv.from});
	qv.socket.on('online', function(data){
	    qv.userInfo = data;
	});
	// 通知
	qv.socket.on('message', function(data){
		qv.op.renderPublic(data);
		document.title = '你有新到消息..';
	});
	qv.socket.on('private message', function(data){
		if(data.to.indexOf(qv.from) !== -1){
			qv.op.renderWhisper(data);
			document.title = '有条私信哦..';
		}

	});
	qv.socket.on('system message', function(data){
		qv.op.renderSystem(data);
		document.title = '系统消息..';
	});

})(this, document);