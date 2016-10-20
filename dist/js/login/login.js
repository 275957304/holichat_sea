define(function(require, exports, module){
    //require('./login.css');
    var H = require('base');
    var uid = H.getItem('uid'),
        session = H.getItem('session'),
        device = H.getItem("device") || "",
        wxappid = 'wxcc5c198d146a1779';
        //type = H.getURLVar("type"); // || location.pathname.substring(1,location.pathname.substr(1).indexOf('/') + 1);
        //"http://m.holichat.com/ceshi/login/login.html?back=http://m.holichat.com/ceshi/event/info.html?id=100633&type=event"

    $.get(H.checkSession,{target_uid: uid, save_session:session, device:device},function(response){
        var redirect = H.loginURL + 'login.html#' + location.href;
        if(response.ret != 0){
            if(H.isWeixin()){
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + wxappid + "&redirect_uri=" + encodeURIComponent(redirect) + "&response_type=code&scope=snsapi_userinfo#wechat_redirect";
            }else{
                window.location.href = H.loginURL + 'web_login.html#' + location.href;
            };
        }
    },'json');
});
