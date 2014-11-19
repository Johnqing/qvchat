(function(window){
    window.Operate = function(){
        this.historyBox = $('#message');
        this.wrapper = $(".m-bd");
        this.messageInput = $("#sendText");
    };

    Operate.prototype.sendMessage = function(){
        var msg = this.messageInput.val().trim();
        var op = msg.substr(0, 1);

        var data = {
            from: qv.from,
            to: qv.to,
            msg: msg
        };

        if(op =='$'){
            qv.socket.emit('system message', data);
            return;
        }

        if(qv.to == 'all'){
            qv.socket.emit('message', data);
            return;
        }

        qv.socket.emit('private message', data);

    };

    Operate.prototype.renderMyself = function(msg){
        var data = {
            from: qv.from,
            to: qv.to,
            msg: msg,
            time: util.format(new Date(), 'h:m:ss'),
            random: qv.userInfo.random,
            cls: 'me'
        };
        this.render(data);
        qv.to = 'all';
        this.messageInput.val('');
    };

    Operate.prototype.writePrivateMessage = function(user){
        var node = this.messageInput;
        if(user.substr(0, 1) !== '@')
            user = '@' + user;
        node.val(user + ' ' + node.val());
    };


    Operate.prototype.renderPublic = function(data){
        data.cls = 'other';
        this.render(data);
    };

	Operate.prototype.renderSystem = function(data){
	    data.cls = 'system';
		var msg = data.msg;
		if(msg.substr(0, 1) == '$'){
			data.msg = msg.substr(1, msg.length + 1);
		}
	    this.render(data);
	};

    Operate.prototype.renderWhisper = function(data){
        data.cls = 'whisper';
        data.msg = data.msg.replace(/(@[\u4e00-\u9fa5\w\-]+)/g, '');
        this.render(data);
    };

    Operate.prototype.template ='<li class="new {{cls}}">' +
        '<div class="fl">' +
			'<img src="/img/av/av_{{random}}.jpg" alt="{{from}}" title="{{from}}" class="portrait">' +
			'<div class="u-username">{{text}}</div>' +
        '</div>' +
        '<div class="fl">' +
		    '<p>{{msg}}</p>' +
		    '<div class="u-time">{{time}}</div>' +
	    '</div>' +
        '</li>';

    Operate.prototype.render = function(data){
        var _self = this;
        data.msg = util.chatToHtml(data.msg);
        data.text = '<span class="username">'+ data.from +'：</span>';

	    switch (data.cls){
		    case 'me':
			    data.text = '我：';
			    break;
		    case 'whisper':
			    data.text = '<span class="username">'+ data.from +'悄悄对你说：</span>';
			    break;
		    case 'system':
			    data.text = '<span class="username">系统消息：</span>';
			    break;
	    }
        // 生成模板
        var list = util.template(this.template, data);
        _self.historyBox.append(list);
        _self.wrapper.scrollTop(_self.historyBox.height())
    }

})(this);