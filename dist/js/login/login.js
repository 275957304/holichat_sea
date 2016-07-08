define(function(require, exports, module){
    //require('./login.css');
    var H = require('base');
    var uid = H.getItem('uid'),
        session = H.getItem('session'),
        device = H.getItem("device") || "",
        wxappid = 'wxcc5c198d146a1779',
        setval ='',
        id = H.getURLVar("id") || "",
        type = H.getURLVar("type") || "";

    $.get(H.checkSession,{target_uid: uid, save_session:session, device:device},function(response){
        var redirect = H.loginURL + '?type='+ type ;
        if(id){
            redirect += '&id=' + id
        }
        if(response.ret != 0){
            if(H.isWeixin()){
				//alert(redirect);
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + wxappid + "&redirect_uri=" + encodeURIComponent(redirect) + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
            }else{
                if(type){
                    if(id){
                        window.location.href = 'login/web_login.html?&type=' + type + '&id' + id;
                    }else{
                        window.location.href = 'login/web_login.html?&type=' + type;
                    }
                }
                window.location.href = 'login/web_login.html';
            };
        }
    },'json');
});
