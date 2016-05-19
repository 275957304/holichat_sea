$(function(){   
	var lock = true;
	var order ='';
	var body_txt ='';
	var event_enroll_id = H.getURLVar('event_enroll_id');
	var event_id = H.getURLVar('event_id');
	var project_id = H.getURLVar('project_id');
	var group_id = H.getURLVar('group_id');
	var session = H.session || H.getItem('session');
	var uid = H.uid || H.getItem('uid');
    var _html ="";	
	var href = window.location.href;
	var url = href.split('#')[0];
	
    $.ajax({
        url: baseURL + "event/interface/event_order_info",
        data: {
            session : session,
            uid : uid,
            event_enroll_id: event_enroll_id
        },
        type: 'get',
        dataType: 'json',
        beforeSend : function(){
            H.tips("加载中...",1);
        },
        success : function(data){
			console.log(data)
			$('.tips-message').hide();
			switch(data.ret){
				case 6111: return H.tips("赛事订单错误");break;
				case 6115: return H.tips("订单错误");break;
			};
			order = data.data.order_no;
			body_txt = data.data.title;
            $('#amount').text(data.data.amount);
            $('.weui_list_text').append('<h4 class="weui_media_title">'+ body_txt +'</h4><p>订单编号：'+ order +'</p><p>报名时间：'+ data.data.enroll_time +'</p>');
            $.each(data.data.enroll_infos,function(index,item){
				item.phone ? _html += '<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary">'+ item.truename +'</div><div class="weui_cell_ft">'+ item.phone +'</div></div>' : _html += '<div class="weui_cell"><div class="weui_cell_bd weui_cell_primary">'+ item.truename +'</div></div>' ;				
            })
            $('#enrollInfos').append(_html);
        },
        error : function(res){
            H.tips("网络有点卡");
        }
    }); 
	
	$("#toPay").on('click',function(){
		
		if(!H.isWeixin){
			H.tips("请使用微信浏览器操作！~");
            return false;  
		}
		/*
		if(H.WXversion) {
			H.tips("本活动仅支持微信5.0以上版本");
			return false; 
		}
		*/
		var postData = {
			openid: H.openid,
			order : order,
			body  : body_txt,
			appid : 'wxcc5c198d146a1779'
		};
		
		$.post(baseURL + 'pay/api/weixin_unifiedorder',postData,function(response){
			var res = JSON.parse(response);
			console.log(res);
			
			var nonce_str = res.data.nonce_str,
				prepay_id = res.data.prepay_id,
				sign = res.data.sign,
				numTime = res.data.time;
			var time = numTime.toString();	
			
			//微信JS签名
			$.get(baseURL + 'other/api/wx_js_sign',{'appid':'wxcc5c198d146a1779','url':url},function(response){
				console.log(response);
				
				wx.config({
					debug     : false,
					appId     : 'wxcc5c198d146a1779',
					timestamp : response.data.timestamp,
					nonceStr  : response.data.noncestr,
					signature : response.data.signature,
					jsApiList : ['checkJsApi','chooseWXPay']
				});
				
				wx.ready(function(){
					
					wx.chooseWXPay({
						timestamp: time, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
						nonceStr: nonce_str, // 支付签名随机串，不长于 32 位
						package:'prepay_id=' + prepay_id , // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
						signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
						paySign: sign, // 支付签名
						success: function (res){
							// 支付成功后的回调函数
							window.location.href = 'pay_info.html?event_enroll_id=' + event_enroll_id + "&event_id=" + event_id + "&project_id=" + project_id +'&group_id=' +group_id;
						}
					});	
					
				});
				
					
			},'json');	
			
		})		
		
	});

});



