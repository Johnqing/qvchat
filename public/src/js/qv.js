(function(window, document){
	window.qv = {
		to: 'all',
		from: util.getCookie('user'),
		userInfo: {},
		// 连接到房间
		socket: io.connect(),
		op: new Operate()
	}

	var defTitle = document.title;	
	// 消息提醒
	window.onfocus = function(){
	    document.title = defTitle;
	}
	// 发送信息
	function privateMessage(message){
		var toArr = message.match(/(@[\u4e00-\u9fa5\w\-]+)/g);
		if(!toArr)
			return;
		for (var i = toArr.length - 1; i >= 0; i--) {
			toArr[i] = toArr[i].substr(1);
		};
		qv.to = toArr;
	}
	// 
	var _last_send_message = '';
	var sendMsg = qv.op.messageInput;
	sendMsg.keydown(function (e) {
		// 回车
		if (e.keyCode == 13) {
			_last_send_message = sendMsg.val();

			if(!_last_send_message.trim())
				return false;

			privateMessage(_last_send_message);
			qv.op.sendMessage();
			qv.op.renderMyself(_last_send_message);
			return false;
		}
		// 上方向键
		if (e.keyCode == 38) {
			sendMsg.val(_last_send_message);
		}
	});

	qv.op.historyBox.on('click', '.portrait', function(){
		var name = $(this).attr('alt');
		var val = sendMsg.val();
		sendMsg.val(val + '@' + name + ' ');
		sendMsg.focus();
	});

	// 消息容器
	var clientHeight = $(window).height();
	var msgInpWrapHeight = sendMsg.parents('.m-send').height();
	qv.op.wrapper.height(clientHeight - msgInpWrapHeight - 50);

	// 表情
	var emojiBox = $('.m-emo-box');
	var emojiBtn = $('.j-emo');
	var emojiTemplate = $('#emoji-template').html();
	var emojiFlag;
	emojiBtn.on('click', function(){
		!emojiFlag && emojiBox.html(emojiTemplate);
		emojiFlag = 1;
		if(emojiBox.hasClass('hide'))
			return emojiBox.removeClass('hide');
		emojiBox.addClass('hide');
	});

	emojiBox.on('click', 'img', function(){
		util.insertAtCaret(qv.op.messageInput, $(this).attr('alt'));
		emojiBox.addClass('hide');
	});

})(this, document);