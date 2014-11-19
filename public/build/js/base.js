if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        if ( this === undefined || this === null ) {
            throw new TypeError( '"this" is null or not defined' );
        }

        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }

        for (;fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return fromIndex;
            }
        }

        return -1;
    };
};
(function(window){
    var urlRegx = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/gi;
    window.util = {
        /**
         * 插入到当前光标所在位置
         * @param  {Object} obj   Input
         * @param  {String} value 需要插入的值
         */
        insertAtCaret: function(obj, value){
            var node = obj[0];
            if(node.createTextRange && node.caretPos){
                var caretPos = node.caretPos;
                caretPos.text = caretPos.text.charAt(caretPos.text.length-1) == '' ? value + '' : value;
            } else if(node.setSelectionRange){
                var rangeStart = node.selectionStart;
                var rangeEnd = node.selectionEnd;
                var tempStr1 = node.value.substring(0, rangeStart);
                var tempStr2 = node.value.substring(rangeEnd);
                node.value = tempStr1 + value + tempStr2;
                node.focus();
                var len = value.length;
                node.setSelectionRange(rangeStart + len,rangeStart + len);
                node.blur();
            }else{
                node.value += value;
            }
            node.focus();
        },
        getCookie: function(name){
            var dck = document.cookie,
                cookieStart,cookieEnd;
            if (dck&& dck != '') {
                //通过indexOf()来检查这个cookie是否存在，不存在就为 -1　
                cookieStart = dck.indexOf(name + "=");
                if(cookieStart != -1){
                    cookieStart += name.length + 1;
                    cookieEnd = dck.indexOf(";", cookieStart);
                    if(cookieEnd == -1){
                        cookieEnd = dck.length;
                    }
                    return decodeURIComponent(dck.substring(cookieStart, cookieEnd));
                }
            }
            return '';
        },
        format: function(value, format) {
            var date = {
                "M+": value.getMonth() + 1,
                "d+": value.getDate(),
                "h+": value.getHours(),
                "m+": value.getMinutes(),
                "s+": value.getSeconds(),
                "q+": Math.floor((value.getMonth() + 3) / 3),
                "S+": value.getMilliseconds()
            };
            if (/(y+)/i.test(format)) {
                format = format.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            for (var k in date) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1
                        ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
                }
            }
            return format;
        },
        urlToAlink: function(str){
            return str.replace(urlRegx, '<a href="$1$2" target="_blank">$1$2</a>');
        },
        chatToHtml: function(str){
            str = util.urlToAlink(str);
            str = str.replace(/(\[\/)(\w+)(\])/g, '<img src="http://twemoji.maxcdn.com/36x36/$2.png">');
            return str;
        },
        /**
         * 简单的模板引擎
         * @param  {[type]} html [description]
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        template: function (html, data){
            return html.replace(/{{([^}}]+)?}}/g, function(a,b){
                return data[b] || '';
            });
        }
    }
})(this);