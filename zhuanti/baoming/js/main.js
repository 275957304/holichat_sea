$(function(){
	var baseURL = "http://121.41.0.124:81/",
		wxappid = 'wxcc5c198d146a1779',
		uid = getItem('uid'),
		session = getItem('session'),
		device = getItem('device'),
		isClick = true,
		id ='',
		group_id = '',
		project_id = '',
		key = [],
		write = {};

	//判断登录
	$.get(baseURL +'login/api/check_session',{target_uid: uid, save_session:session, device:device},function(response){
        var redirect = 'http://m.holichat.com/ceshi/zhuanti/baoming/login.html';
		console.log(response)
        if(response.ret != 0){
        	window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + wxappid + "&redirect_uri=" + encodeURIComponent(redirect) + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
        }
    },'json');

	function setItem(a,b){
		if(window.localStorage){
			window.localStorage.setItem("hlq_"+a,b);
		}else{
			var c=new Date;
			c.setTime(c.getTime()+31536e6),
			document.cookie="hlq_"+a+"="+escape(b)+";expires="+c.toGMTString()
		}
	};
	function getItem(a){
		if(window.localStorage){
			return window.localStorage.getItem("hlq_"+a);
		}else{
			var b=document.cookie.match(new RegExp("(^| )hlq_"+a+"=([^;]*)(;|$)"));
			return null!=b?unescape(b[2]):null
		}
	};

	function getURLVar(a){
		var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i"),
			c = window.location.search.substr(1).match(b);
		return null != c ? unescape(c[2]) : null
	}

	function toUnicode(a){
		return escape(a).replace(/%/g,"\\").toLowerCase();
	}
	//活动介绍
	$('#aboutBtn').on('touchstart',function(event){
		$("#about").show();
		//var myScroll = new IScroll('#aboutText', {resizeScrollbars: false,hideScrollbar: false,scrollY: true, scrollbars: 'custom'});
	});
	$('.rwm_btn').on('touchstart',function(){


		$.ajax({
			type: 'get',
			url: baseURL + 'mine/user/user_no_pay_act_list',
			data: {
				page_size : 1000,
				page : 1,
				session:getItem('session'),
				uid:getItem('uid')
			},
			dataType: 'json',
			success: function(data){
				console.log(data)
				var userTempt = ""
				$.each(data.data.list,function(index,item){
					console.log(item.org_act_id)
					if(item.org_act_id == '100604' || item.org_act_id == '100447'){
						userTempt += '<li data-enroll="'+ item.enroll_id +'">'+ item.title +'</li>'
						console.log(item)
					}
				})
				$('#userList').empty().append(userTempt);
				if($('#userList li').length > 2){
					$('#userSroll').addClass('user_scroll')
					var myScroll = new IScroll('#userSroll', {resizeScrollbars: false,hideScrollbar: false,scrollY: true, scrollbars: 'custom'});
				}
			},
			error: function(res) {
				alert(res);
			}
		});
		$('#view').show();
	})
	$('#userList').delegate('li','touchstart',function(){
		var enroll_id = $(this).data('enroll');
		$(this).addClass('on').siblings().removeClass('on');
		getInfo(enroll_id);
		$('#view,.login').hide();
		$('#share').show();
	})

	// $('#viewBtn').on('touchstart',function(){
	// 	var enroll_id = $('#userList > .on').data('enroll');
	// 	getInfo(enroll_id);
	// 	$('#view,.login').hide();
	// 	$('#share').show();
	// });

	$('#snatchBtn').on('touchstart',function(){
		$("#snatch").show();
		$("#signTable").hide();
		var myScroll = new IScroll('#snatchScroll', {resizeScrollbars: false,hideScrollbar: false,scrollY: true, scrollbars: 'custom'});
	});
	$('.snatch_btn').on('touchstart',function(){$("#snatch").hide();$("#signTable").show();})
	$('.close,.pop_btn_close').on('touchstart',function(event){
		$(this).parents('.pop_min').hide();
		return false;
	})
	$('#lognBtn').on('touchstart',function(){
		$('.login').hide();
		$('#Notice').show();
		var myScroll = new IScroll('#noticeTxt', {resizeScrollbars: false,hideScrollbar: false,scrollY: true, scrollbars: 'custom'});
	});
	$('.participate').on('touchstart',function(){
		$('#seleEvent').show();
	});

	$('.sele_checkbox label').on('touchstart',function(){
		$(this).addClass('on').siblings().removeClass('on');
		$(this).children().prop('checked', true);
		$(this).siblings().prop('checked', false);
	});
	$('#nextBtn').on('touchstart',function(){
		console.log($('.sele_checkbox input[type="radio"][name="radio"]:checked').data('type'));
		id = $('.sele_checkbox input[type="radio"][name="radio"]:checked').val();
		console.log(id)

		$.get(baseURL + 'event/interface/check_is_enroll',{event_id:id,session:getItem('session')},function(data){
			console.log(data);
			var enroll = data.data.enroll;
			if(enroll){
				alert("您已报名了！");
				return false;
			}else{
				$.ajax({
			        type: 'get',
			        url: baseURL + 'event/view/get_enroll_info',
			        data: {
			            session:getItem('session'),
			            uid:getItem('uid'),
			            event_id:id
			        },
			        dataType: 'json',
			        success: function(data){
						var groupTemplet = ''
						$.each(data.data.project[0].group,function(index,item){
							console.log(item)
							groupTemplet += '<li data-project="' + item.event_project_id +'" data-id="'+ item.id +'"><div class="f_name name'+ (index + 1) +'">'+ item.title +'</div><div class="f_img tab'+ (index + 1) +'"></div></li>'
						})
						$('.formation_sele').empty();
						$('.formation_sele').append(groupTemplet);
			        },
			        error: function(res) {
			            alert(res);
			        }
			    });
				$('#seleEvent').hide();
				$("#formation").show();
			}
		},'json')
	});

	$('.formation_sele').delegate('li','touchstart',function(){
		group_id = $(this).data('id');
		project_id = $(this).data('project');
		$(this).addClass('active').siblings().removeClass('active');
	});
	//选择陈型
	$('#formationBtn').on('touchstart',function(){
		if(!$('.formation_sele li').hasClass('active')){
			alert("请选择比赛阵型");
			return false;
		}
		$.get(baseURL + 'event/view/get_brief',{'event_id': id},function(data){
			console.log(data)
			$('.sign_title').text(data.data.title);
			$('.sign_signline').text(data.data.signline);
			$('.sign_address').text(data.data.address);
		},'json')
		$.ajax({
			url: baseURL + 'event/view/get_enroll_info',
			type: 'get',
			data: {
				session:getItem("session"),
				uid:getItem("uid"),
				event_id:id
			},
			dataType: 'json',
			async: false,
			success: function(data){
				var templet = '';
				if(data.ret == '0'){
					$.each(data.data.project,function(index, item){
						if(id == item.event_id){
							$.each(item.group,function(i,val){
								if(group_id == val.id){
									var template = JSON.parse(val.enroll_template);
									$('#signForm').empty();
									$.each(template,function(i,val){
										key.push(val.key)
										templet += '<li><label class="label">'+ val.name +'：</label><div class="sign_input"><input data-title="'+ val.name +'" name="'+ val.key +'" type="text" placeholder=""></div></li>';
									})
									$('#signForm').append(templet);
								}
							})
						}
					})
				}
			},
			error: function(res) {
				alert("网络有点卡");
			}
		});

		$('#formation,#Notice').hide();
		$('#signTable').show();
		var myScroll = new IScroll('#signScroll', {resizeScrollbars: false,hideScrollbar: false,scrollY: true, scrollbars: 'custom'});
	})
	//提交表单
	$('#submit').on('touchstart',function(){
		var info = '';
		for(var i=0; i < key.length; i++){
			var k = key[i];
			var val = $(".sign_form input[name='"+ key[i] +"']").val();
			var field = $(".sign_form input[name='"+ key[i] +"']").data('title');
			if(val == ""){
				alert("请填参赛者的" + field);
				return false;
			}
			write[k] = toUnicode(val);
			info += '<li>'+ field +'：<b>'+ val +'</b></li>';
		}
		//console.log(write)
		console.log(write)
		$('.info').empty();
		$('.info').append(info);
		$('#signTable').hide();
		$('#infoShow').show();
	})

	$('#submitInfo').on('touchstart',function(){
		if(isClick){
			isClick = false;
			var data=[],merge = {};
			merge.project_id = parseInt(project_id,10);
			merge.group_id = parseInt(group_id,10);
			merge.enroll_params = write;
			data.push(merge);
			console.log(data);
			var jsonDate = eval("'" + JSON.stringify(data) + "'"),
	        	base64 = BASE64.encoder(jsonDate);
	        console.log("编码后" + base64);
	        //参数
	        parameter = {
	            event_id : id,
	            entrance_type: 'a',
	            entrance_community_cid : 0,
	            session: getItem('session'),
	            event_enroll_data: base64
	        }
			$.ajax({
	            type: 'POST',
	            url: baseURL + 'event/interface/event_enroll',
	            data: parameter,
	            dataType: 'json',
	            success: function(data){
					isClick = true;
	                if(data.ret == '0'){
						var enroll_id = data.data[0];
						getInfo(enroll_id);
						console.log('提交成功');
						$('#infoShow').hide();
						$('#share').show();
					}
	            },
	            error: function(xhr) {
					isClick = true;
					alert(xhr);
	            }
	        });
		}
	})

	function getInfo(enroll){
		$.get(baseURL + 'event/interface/event_order_info',{session:getItem('session'),uid:getItem('uid'),event_enroll_id:enroll},function(data){
			console.log(data);
			$('#rwm').attr('src','http://pan.baidu.com/share/qrcode?w=300&h=300&url='+ data.data.code);
		},'json')
	}




})
