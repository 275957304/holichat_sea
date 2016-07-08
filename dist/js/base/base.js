define(function(require, exports, module) {
	//var baseURL = "http://121.41.0.124:81/";
	var baseURL = "http://192.168.1.234/server4.0/index.php/";
	var H = {
		loginURL : "http://m.holichat.com/ceshi/login/login.html", //微信登录回调地址
        imgURL : "http://holichat-res-inside.img-cn-hangzhou.aliyuncs.com/uploads/",
        login : baseURL + 'login/api/login',    // 登录
        eventList : baseURL + 'event/view/event_list',     // 赛事列表
        eventSearch: baseURL + 'event/view/event_search',  // 赛事搜索
        getBrief : baseURL + 'event/view/get_brief',       // 赛事简介信息
        getInfo : baseURL + 'event/view/get_info',         // 赛事详细信息
        getEnrollInfo : baseURL + 'event/view/get_enroll_info', // 赛事报名表信息
        eventEnroll : baseURL + 'event/interface/event_enroll', // 赛事报名
        eventOrderInfo : baseURL + 'event/interface/event_order_info',  //获取赛事订单详细
        eventProGroupInfo : baseURL + 'event/view/event_pro_group_info',   //赛事项目和组别
		enrollCheck : baseURL + 'event/interface/event_enroll_check', //赛事报名检测
        getGeocoding : baseURL + 'other/api/get_geocoding',   //逆地理编码
        wxSign : baseURL +'other/api/wx_js_sign',  //微信JS签名
        checkSession : baseURL +'login/api/check_session', //会话检查
        eventEnrollSelect : baseURL + "event/interface/event_enroll_select", //选择赛事支付
        weixinUnifiedorder : baseURL + 'pay/api/weixin_unifiedorder', //微信支付接口
        eventSignCheck : baseURL + 'event/interface/event_sign_check', //赛事入场验证检测
        eventTeamInfo : baseURL + 'event/team/event_team_info',  //赛事队伍信息
		otherLogin : baseURL + 'login/sdk/other_login', //第三方登录
		wxAccessToken : baseURL + 'login/sdk/wx_access_token', // 获取微信令牌
        wxSubscribe : baseURL + 'other/api/wx_subscribe', //微信订阅检查
        newsPfInfo : baseURL + 'news/pf/info', //活力圈资讯内容
		recommend : baseURL + 'ad/home/recommend',  //主页推荐广告

		//userEvent : baseURL + 'event/user/user_event',   //我的报名赛事
		userActList : baseURL + 'mine/user/user_act_list', //我的已报名列表
		userNoPayList : baseURL + 'mine/user/user_no_pay_act_list', //我的未支付列表

		activityList : baseURL + 'activity/view/activity_list',  //活动列表
		activitySearch : baseURL + 'activity/view/activity_search', //活动搜索
		activityBrief : baseURL + 'activity/view/get_brief',  //活动简介
		activityGetEnrollInfo : baseURL + 'activity/view/get_enroll_info', // 活动报名表信息
		activityEnroll : baseURL + 'activity/interface/activity_enroll', // 赛事报名
		activityOrderInfo : baseURL + 'activity/interface/activity_order_info',  //获取活动订单详细
		activityTeamInfo : baseURL + 'activity/team/activity_team_info',  //活动队伍信息
		activityProGroupInfo : baseURL + 'activity/view/activity_pro_group_info', //活动项目和组别
		activityGetEnrollICheck : baseURL + 'activity/interface/activity_enroll_check', //活动报名检测
		activitySignCheck : baseURL + 'activity/interface/activity_sign_check', //活动入场证检测
		activityEnrollSelect : baseURL + "activity/interface/activity_enroll_select", //选择活动支付

		trainingList : baseURL + 'training/view/training_list',     // 培训列表
		trainingSearch: baseURL + 'training/view/training_search',     // 培训搜索
		trainingBrief : baseURL + 'training/view/get_brief',     // 培训简介信息
		trainingInfo : baseURL + 'training/view/get_info',     // 培训详细信息
		trainingGetEnrollInfo : baseURL + 'training/view/get_enroll_info',     // 培训报名表信息
		trainingEnrollCheck : baseURL + 'training/interface/training_enroll_check',  // 培训报名检测
		trainingEnroll : baseURL + 'training/interface/training_enroll',  // 培训报名
		trainingOrderInfo : baseURL + 'training/interface/training_order_info',  // 获取培训订单详细
		trainingTeamInfo : baseURL + 'training/team/training_team_info', //培训队伍信息
		trainingProGroupInfo : baseURL + 'training/view/training_pro_group_info', //培训项目和组别
		trainingSignCheck : baseURL + 'training/interface/training_sign_check', //培训入场证检测
		trainingEnrollSelect : baseURL + "training/interface/training_enroll_select", //选择培训支付

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
				return '<span class="red yr">预热中</span>';
			}else if(today < Date.parse(deadlineDate)){
				return '<span class="green bm">报名中</span>';
			}else if(today < Date.parse(beginDate)){
				return '<span class="green ks">即将开始</span>';
			}else if(today < Date.parse(endDate)){
				return '<span class="warning jx">进行中</span>';
			}else{
				return '<span class="gary js">已结束</span>';
			}
		},
		setCurrentState : function(signline,deadline,begin_date,end_date,id){
			var signlineDate = signline.substring(0,10).split('-');
			var deadlineDate = deadline.substring(0,10).split('-');
			var beginDate = begin_date.substring(0,10).split('-');
			var endDate = end_date.substring(0,10).split('-');
			signlineDate = signlineDate[1] + '/' + signlineDate[2] + '/' + signlineDate[0] + ' ' + signline.substring(10, 19);
			deadlineDate = deadlineDate[1] + '/' + deadlineDate[2] + '/' + deadlineDate[0] + ' ' + deadline.substring(10, 19);
			beginDate = beginDate[1] + '/' + beginDate[2] + '/' + beginDate[0] + ' ' + begin_date.substring(10, 19);
			endDate = endDate[1] + '/' + endDate[2] + '/' + endDate[0] + ' ' + deadlineDate.substring(10, 19);
			var today = new Date().getTime();
			if(today < Date.parse(signlineDate)){
				$('.footer').append('<a class="weui_btn weui_btn_disabled weui_btn_default" onclick="alert(\'预热中\')" href="javascript:void(0)">预热中</a>');
			}else if(today < Date.parse(deadlineDate)){
				$('.footer').append('<a class="weui_btn weui_btn_warn" href="get_enroll_info_notes.html?id=' + id +' ">我要报名</a>');
			}else if(today < Date.parse(beginDate)){
				$('.footer').append('<a class="weui_btn weui_btn_disabled weui_btn_default" onclick="alert(\'即将开始\')" href="javascript:void(0)">即将开始</a>');
			}else if(today < Date.parse(endDate)){
				$('.footer').append('<a class="weui_btn weui_btn_disabled weui_btn_default" onclick="alert(\'报名已结束\')" href="javascript:void(0)">报名已结束</a>');
			}else{
				$('.footer').append('<a class="weui_btn weui_btn_disabled weui_btn_default" onclick="alert(\'报名已结束\')" href="javascript:void(0)">报名已结束</a>');
			}
		},
		proGroupInfo: function(id,project,group){ //活动/赛事/培训 项目和组别  id为类型分为：event/training/activity
			var result;
				switch(id){
					case 'a': var url = this.activityProGroupInfo,data={activity_project_id: project, activity_group_id: group}; break;  //活动
					case 'e': var url = this.eventProGroupInfo,data={event_project_id: project, event_group_id: group}; break;  //赛事
					case 't': var url = this.trainingProGroupInfo,data={training_project_id: project, training_group_id: group}; break;  //培训
				};
				$.ajax({
					url: url,
					async: false,//改为同步方式
					type: "GET",
					data: data,
					dataType: 'json',
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
		},
		toUnicode : function(str){
			return escape(str).replace(/%/g,"\\").toLowerCase();
		},
		getSource : function(){
			return location.pathname.substring(1,location.pathname.substr(1).indexOf('/')+1)
		},
		amapRoute : function(startMap,endMap,address){
			//startMap 当前坐标  endMap目标坐标  address地址
			var location = startMap || ''+ this.getItem('longitude') + ',' + this.getItem('latitude');
			var isEndMap = endMap.split(",");
			if(isEndMap[0] == ''|| isEndMap[1] == ''|| isEndMap[0] == '0'){
				this.tips("暂无地址定位数据");
			}else{
				window.location.href = "http://m.amap.com/navi/?start="+ location + "&dest=" + endMap +"&destName="+ address +"&key=faaddee69a0a4d1dca3576d2ae9c2ff6"
			}
		},
		payState : function(status){
			switch (status) {
				case 'C': return '<span style="font-size:12px;">支付中</span>'; break;
				case 'S': return '<span style="font-size:12px;">支付成功</span>'; break;
				case 'N': return '<span style="font-size:12px;">未支付</span>'; break;
			}
		},
		getItemInfo : function(type,id){
			var info = {};
			var that = this;
			switch (type) {
				case 'event': var url = this.getBrief + '?event_id='+ id; break;
				case 'activity': var url = this.activityBrief + '?activity_id='+ id; break;
				case 'training': var url = this.trainingBrief + '?training_id='+ id; break;
			};
			$.ajax({type:'GET',url: url,dataType:'json',async:false,success:requireData,error:errorData});
			function requireData(data){
				if(data.ret == 0){
					//console.log(data);
					info = {
						type : 'event',
						href : type + '/info.html?id=' + id,
						price : data.data.cost,
						category_id : data.data.sports_category_id,
						status : that.getCurrentStatus(data.data.signline,data.data.deadline,data.data.begin_date,data.data.end_date)
					}
				}
			}
			function errorData(xhr){
				console.log(xhr);
			}
			//console.log(info);
			return info
		}
	};
	module.exports = H;

})

// $(function(){
// 	//解决输入框input获取焦点时，虚拟键盘会把fixed元素顶上去
// 	$('input[name = text]').on('focus',function(){
// 		$('.footer,.header').css('position','static');
// 	}).on('blur',function(){
// 		$('.footer,.header').css({'position':'fixed','bottom':'0'})
// 	})
//
// })




//计算字符串长度
String.prototype.strLen = function() {
    var len = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2; else len ++;
    }
    return len;
}

//将字符串拆成字符，并存到数组中
String.prototype.strToChars = function(){
    var chars = new Array();
    for (var i = 0; i < this.length; i++){
        chars[i] = [this.substr(i, 1), this.isCHS(i)];
    }
    String.prototype.charsArray = chars;
    return chars;
}

//判断某个字符是否是汉字
String.prototype.isCHS = function(i){
    if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0)
        return true;
    else
        return false;
}

//截取字符串（从start字节到end字节）
String.prototype.subCHString = function(start, end){
    var len = 0;
    var str = "";
    this.strToChars();
    for (var i = 0; i < this.length; i++) {
        if(this.charsArray[i][1])
            len += 2;
        else
            len++;
        if (end < len)
            return str;
        else if (start < len)
            str += this.charsArray[i][0];
    }
    return str;
}

//截取字符串（从start字节截取length个字节）
String.prototype.subCHStr = function(start, length){
    return this.subCHString(start, start + length);
}
