var baseURL = "http://121.41.0.124:81/";
var imgURL = "http://holichat-res-inside.img-cn-hangzhou.aliyuncs.com/uploads/";
var H = {
	token : false,
	session : "",
	openid : "",
	uid : "",
	cityid : "",
	loginURL: "../login.html",
	eventListURL : baseURL + 'event/view/event_list',     // 赛事列表
	eventSearchURL: baseURL + 'event/view/event_search',  // 赛事搜索
	getBriefURL : baseURL + 'event/view/get_brief',       // 赛事简介信息
	getInfoURL : baseURL + 'event/view/get_info',         // 赛事详细信息
	getEnrollInfoURL : baseURL + 'event/view/get_enroll_info', // 赛事报名表信息
	eventEnrollURL : baseURL + 'event/interface/event_enroll', // 赛事报名
	eventOrderInfoURL : baseURL + 'event/interface/event_order_info',  //获取赛事订单详细
	userEventURL : baseURL + 'event/user/user_event',   //我的报名赛事
	eventProGroupInfoURL : baseURL + 'event/view/event_pro_group_info',   //赛事项目和组别
	getGeocodingURL : baseURL + 'other/api/get_geocoding',   //逆地理编码
	wxSignURL : baseURL +'other/api/wx_js_sign',
	init : function(){
		this.session = this.getItem("session");
		this.uid = this.getItem("uid");
		this.openid = this.getItem("openid");
		this.cityid = this.getItem("city_id");
		H.goTop();
		//地理位置
		if(H.getItem('longitude')){
			var locations = [H.getItem('longitude'),H.getItem('latitude')].join(",");
			$.post(H.getGeocodingURL,{'location':locations},function(response){
				var res = JSON.parse(response);
				var city = res.data.addressComponent.adcode.substring(0,4) + '00';
				this.cityid = res.data.addressComponent.adcode;
				H.setItem("city_id", city);
				H.setItem("city_name", res.data.addressComponent.city);
			})
		}
	},
	wh : function(){
		return $(document).height()-100;
	},
	login : function(data){
		/*
		switch(data.ret){
			case 6023: return this.tips("手机号码不正确");break;
			case 6024: return this.tips("密码不正确");break;
		}
		*/
		H.setItem("session", data.data.session);
		H.setItem("uid", data.data.uid);
		H.setItem("device", data.data.device);
		H.setItem("platform", data.data.platform);		
	},
	haslogin : function(a){		
		if(this.uid == null || a.ret == '6050'){
			setTimeout(function(){H.tips("请登录")},100);
			setTimeout(function(){window.location.href = "http://m.holichat.com/wx_login.html"},2000);
		}		
	},
	loginout : function(){
		H.removeItem("session");
		H.removeItem("uid");
		window.location.reload();
	},
	setItem:function(a,b){
		if(window.localStorage){
			window.localStorage.setItem("hlq_"+a,b);
		}else{
			var c=new Date;
			c.setTime(c.getTime()+31536e6),
			document.cookie="hlq_"+a+"="+escape(b)+";expires="+c.toGMTString()
		}
	},
	getItem:function(a){
		if(window.localStorage){
			return window.localStorage.getItem("hlq_"+a);
		}else{
			var b=document.cookie.match(new RegExp("(^| )hlq_"+a+"=([^;]*)(;|$)"));
			return null!=b?unescape(b[2]):null
		}
	},
	removeItem: function(a) {
		var b, c;
		window.localStorage ? window.localStorage.removeItem("hlq_" + a) : (b = new Date, b.setTime(b.getTime() - 1), c = H.getItem(a), null != c && (document.cookie = "hlq_" + a + "=" + c + ";expires=" + b.toGMTString()))
	},
	getURLVarByURL: function(a, b) {
		var d, e, c = b.split("?")[1];
		return c ? (d = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i"), e = c.match(d), null != e ? unescape(e[2]) : null) : null
	},
	getURLVar: function(a) {
		var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i"),
			c = window.location.search.substr(1).match(b);
		return null != c ? unescape(c[2]) : null
	},
	getCurrentStatus : function(signline,deadline,begin_date,end_date){
		var signlineDate = signline.substring(0,10).split('-'); //报名开始时间 
		var deadlineDate = deadline.substring(0,10).split('-'); //报名截止
		var beginDate = begin_date.substring(0,10).split('-'); //赛事开始时间 
		var endDate = end_date.substring(0,10).split('-'); //赛事结束
		signlineDate = signlineDate[1] + '/' + signlineDate[2] + '/' + signlineDate[0] + ' ' + signline.substring(10, 19);
		deadlineDate = deadlineDate[1] + '/' + deadlineDate[2] + '/' + deadlineDate[0] + ' ' + deadline.substring(10, 19);
		beginDate = beginDate[1] + '/' + beginDate[2] + '/' + beginDate[0] + ' ' + begin_date.substring(10, 19);
		endDate = endDate[1] + '/' + endDate[2] + '/' + endDate[0] + ' ' + end_date.substring(10, 19); 
		var today = new Date().getTime();
		if(today < Date.parse(signlineDate)){
			return '<span class="red">预热中</span>';
		}else if(today < Date.parse(deadlineDate)){
			return '<span class="green">报名中</span>';
		}else if(today < Date.parse(beginDate)){
			return '<span class="green">即将开始</span>';
		}else if(today < Date.parse(endDate)){
			return '<span class="warning">进行中</span>';
		}else{
			return '<span class="gary">已结束</span>';
		}		
	},
	getGroup : function(project,group){
		var result;
		$.ajax({
			url: this.eventProGroupInfoURL,
			async: false,//改为同步方式
			type: "GET",
			data: {event_project_id : project,event_group_id : group},
			success: function (data) {
				result = data;
			}
		});
		return result;
	},
	getAddress : function(region){	
		var address = [];
		$.each(province_data, function(index,item){
			if((region.substring(0,2) + '0000') == index){
				address.push(item.name)
			}
		});
		$.each(city_data, function(index,item){
			if( (region.substring(0,4) + '00') == index){
				address.push(item.name)
			}
		});		
		$.each(region_data, function(index,item){
			if( region == index){
				address.push(item.name)
			}
		});
		return address.join('');
	},
	search : function(){
		var content =$.trim( $('#keyword').val());
        if(content ==''){
         	H.tips("内容不能为空");
         	return false;
        };
        window.location.href = 'search.html?content='+ encodeURI(encodeURI(content));
	},
	tips : function(msg,type){
		var html  ='<div class="tips">';
			html +='<div class="tips-message"> ' +  (type ? '<i class="loading-bright"></i>' + msg : msg)  + ' </div>';
			html +='</div>';
			$('body').append(html);
			setTimeout('$(".tips").remove();',1500);
	},
	goTop : function(){
		$(window).scroll(function(){
		    if($(window).scrollTop() > $(window).height()/2){
		        $("#back_top").addClass('active');
		    }else{
		        $("#back_top").removeClass("active");
		    }
		});
		$(function(){
			$('#back_top').on("tap",function(){
		        window.scrollTo(0,0);
		        return false;
		    })	
		})
		
	},
	isPhone : function(s){
		return /^1[3|4|5|7|8]\d{9}$/.test(s);
	},
	textEnter : function(txt){		
		return txt.replace("\r\n","<br>");
	},
	isWeixin: function() {
		return "micromessenger" == navigator.userAgent.toLowerCase().match(/MicroMessenger/i)
	},
	WXversion : function(){
		var version = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
		return version[1] < "5.0" ;
	}
};
H.init();
window.H=H;
 
function httpGet(url, callback) {
    $.get(url, function(data, status, xhr) {
        if (data["ret"] == 6050) {
           location.href = "login.html";
        } else {
            callback(data);
        }
    }, "json");
};


$(function(){
	$('.main').on('click', '#showActionSheet', function (){
		var mask = $('#mask');
		var weuiActionsheet = $('#weui_actionsheet');
		weuiActionsheet.addClass('weui_actionsheet_toggle');
		mask.show()
			.focus()//加focus是为了触发一次页面的重排(reflow or layout thrashing),使mask的transition动画得以正常触发
			.addClass('weui_fade_toggle').one('click', function () {
			hideActionSheet(weuiActionsheet, mask);
		});
		$('#actionsheet_cancel').one('click', function () {
			hideActionSheet(weuiActionsheet, mask);
		});
		mask.unbind('transitionend').unbind('webkitTransitionEnd');

		function hideActionSheet(weuiActionsheet, mask) {
			weuiActionsheet.removeClass('weui_actionsheet_toggle');
			mask.removeClass('weui_fade_toggle');
			mask.on('transitionend', function () {
				mask.hide();
			}).on('webkitTransitionEnd', function () {
				mask.hide();
			})
		}
	});
});

		
/**
 * animate
 */

;(function($, undefined) {
    var prefix = '',
      eventPrefix,
      vendors = {
        Webkit: 'webkit',
        Moz: '',
        O: 'o'
      },
      testEl = document.createElement('div'),
      supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
      transform,
      transitionProperty, transitionDuration, transitionTiming, transitionDelay,
      animationName, animationDuration, animationTiming, animationDelay,
      cssReset = {}

    function dasherize(str) {
      return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase()
    }

    function normalizeEvent(name) {
      return eventPrefix ? eventPrefix + name : name.toLowerCase()
    }

    $.each(vendors, function(vendor, event) {
      if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
        prefix = '-' + vendor.toLowerCase() + '-'
        eventPrefix = event
        return false
      }
    })

    transform = prefix + 'transform'
    cssReset[transitionProperty = prefix + 'transition-property'] =
      cssReset[transitionDuration = prefix + 'transition-duration'] =
      cssReset[transitionDelay = prefix + 'transition-delay'] =
      cssReset[transitionTiming = prefix + 'transition-timing-function'] =
      cssReset[animationName = prefix + 'animation-name'] =
      cssReset[animationDuration = prefix + 'animation-duration'] =
      cssReset[animationDelay = prefix + 'animation-delay'] =
      cssReset[animationTiming = prefix + 'animation-timing-function'] = ''

    $.fx = {
      off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
      speeds: {
        _default: 400,
        fast: 200,
        slow: 600
      },
      cssPrefix: prefix,
      transitionEnd: normalizeEvent('TransitionEnd'),
      animationEnd: normalizeEvent('AnimationEnd')
    }

    $.fn.animate = function(properties, duration, ease, callback, delay) {
      if ($.isFunction(duration))
        callback = duration, ease = undefined, duration = undefined
      if ($.isFunction(ease))
        callback = ease, ease = undefined
      if ($.isPlainObject(duration))
        ease = duration.easing, callback = duration.complete, delay = duration.delay, duration = duration.duration
      if (duration) duration = (typeof duration == 'number' ? duration :
        ($.fx.speeds[duration] || $.fx.speeds._default)) / 1000
      if (delay) delay = parseFloat(delay) / 1000
      return this.anim(properties, duration, ease, callback, delay)
    }

    $.fn.anim = function(properties, duration, ease, callback, delay) {
      var key, cssValues = {},
        cssProperties, transforms = '',
        that = this,
        wrappedCallback, endEvent = $.fx.transitionEnd,
        fired = false

      if (duration === undefined) duration = $.fx.speeds._default / 1000
      if (delay === undefined) delay = 0
      if ($.fx.off) duration = 0

      if (typeof properties == 'string') {
        // keyframe animation
        cssValues[animationName] = properties
        cssValues[animationDuration] = duration + 's'
        cssValues[animationDelay] = delay + 's'
        cssValues[animationTiming] = (ease || 'linear')
        endEvent = $.fx.animationEnd
      } else {
        cssProperties = []
        // CSS transitions
        for (key in properties)
          if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
          else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

        if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
        if (duration > 0 && typeof properties === 'object') {
          cssValues[transitionProperty] = cssProperties.join(', ')
          cssValues[transitionDuration] = duration + 's'
          cssValues[transitionDelay] = delay + 's'
          cssValues[transitionTiming] = (ease || 'linear')
        }
      }

      wrappedCallback = function(event) {
        if (typeof event !== 'undefined') {
          if (event.target !== event.currentTarget) return // makes sure the event didn't bubble from "below"
          $(event.target).unbind(endEvent, wrappedCallback)
        } else
          $(this).unbind(endEvent, wrappedCallback) // triggered by setTimeout

        fired = true
        $(this).css(cssReset)
        callback && callback.call(this)
      }
      if (duration > 0) {
        this.bind(endEvent, wrappedCallback)
        // transitionEnd is not always firing on older Android phones
        // so make sure it gets fired
        setTimeout(function() {
          if (fired) return
          wrappedCallback.call(that)
        }, ((duration + delay) * 1000) + 25)
      }

      // trigger page reflow so new elements can animate
      this.size() && this.get(0).clientLeft

      this.css(cssValues)

      if (duration <= 0) setTimeout(function() {
        that.each(function() {
          wrappedCallback.call(this)
        })
      }, 0)

      return this
    }

    testEl = null
  })(Zepto)

