define(function(require, exports, module) {
    var template  = '<div class="prompt-app">';
        template += '<div class="weui_cell">';
        template += '<div style="width: 35px;text-align:center" class="prompt-close"><i class="weui_icon_cancel"></i></div>';
        template += '<div class="weui_cell_bd weui_cell_primary"><img style="width:38px;margin-right:5px;border-radius:4px;float:left;" src="http://m.holichat.com/dist/img/icon_152.png"><p>活力圈<br/><span style="color:#b5b5b5;">更多精彩请下载</span></p></div>';
        template += '<div class="weui_cell_ft"><a id="downApp" href="javascript:void(0);" style="font-size: 16px;" class="weui_btn weui_btn_default">立即下载</a></div>';
        template += '</div>';
        template += '</div>';
    function addApp(){
        //页面插件下载app
        $('body').append(template).addClass('app');
        //提示用户安装app区 的关闭按钮
        $('body').on('click','.prompt-close',function(){
            $(this).parents('.prompt-app').remove();
            $('body').removeClass('app')
        });
        //检测系统是否安装app，如果安装就打开，没有安装就下载app
        $('body').on('click','#downApp',function(){
            if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                window.location.href = "holichat://";
                setTimeout(function () {
                    window.location.href = "http://www.holichat.com/down";
                }, 1000);
            } else {
                window.location.href = "http://www.holichat.com/down";
            }
        });
    };
    module.exports =  addApp();
})
