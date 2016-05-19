var city_list =""
var city_id = H.getItem('city_id') || 0;
$.ajax({
    url: baseURL + "event/view/region",
    data: {
        city_id:city_id
    },
    type: 'get',
    dataType: 'json',
    success : function(data){
        $.each(data.data, function(index, item){
            if(item.id == city_id){
                city_list = '<li data-city="'+ item.id +'" class="list-group-item city-sele">'+ item.name +'</li>';
            }else{
                city_list = '<li data-city="'+ item.id +'" class="list-group-item">'+ item.name +'</li>';
            }
            $("#cityList").append(city_list);
        })        
    },
    error : function(res){
        H.tips("网络有点卡");
    }
});

//浏览器定位
if (navigator.geolocation){
    var getOptions = {
        //是否使用高精度设备，如GPS。默认是true
        enableHighAccuracy:false,
        //超时时间，单位毫秒，默认为0
        timeout:6000,
        //使用设置时间内的缓存数据，单位毫秒
        //默认为0，即始终请求新数据
        //如设为Infinity，则始终使用缓存数据
        maximumAge:0
    };
    navigator.geolocation.getCurrentPosition(function(position) {  
    
          
    }); 
}else{
    //不支持，
}

//切换城市
$(document).on('click', '#cityList li', function(e){
    H.setItem("city_id",$(this).data('city'));
    H.setItem("city_name",$(this).text());
    location.href = '../list/index.html';
})


