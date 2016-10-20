define(function(require, exports, module){
	"user strict";
	var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');
	var base = require('../base/base'),
		longitude = base.getItem('longitude'),
		url =window.location.href.split('#')[0];
	$.ajax({
		type: 'get',
		url: base.wxSign,
		data: {
			appid:'wxcc5c198d146a1779',
			url:url
		},
		dataType: 'json',
		success: function(data){
			//通过config接口注入权限验证配置
			wx.config({
				debug     : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId     : "wxcc5c198d146a1779", // 必填，公众号的唯一标识
				timestamp : data.data.timestamp, // 必填，生成签名的时间戳
				nonceStr  : data.data.noncestr, // 必填，生成签名的随机串
				signature : data.data.signature,// 必填，签名，见附录1
				jsApiList : ["onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo","openLocation", "getLocation"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		},
		error:function(){
			alert("数据有误！")
		}
	});
	wx.ready(function(){
		if(longitude == '' || longitude == 'null'){
			wx.getLocation({
				type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function (res) {
					base.setItem("longitude", res.longitude); //经度
					base.setItem("latitude", res.latitude);
				}
			});
		}
	});
	wx.error(function(e){
		alert(e.errMsg)
	});
	module.exports = wx;
});
