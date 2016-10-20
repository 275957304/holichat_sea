define(function(require, exports, module){
	require('http://webapi.amap.com/maps?v=1.3&key=faaddee69a0a4d1dca3576d2ae9c2ff6&plugin=AMap.Geocoder');
	var base = require('base'),
		city_id = base.getItem('city_id'),
		longitude = base.getItem('longitude'), //经度
		latitude = base.getItem('latitude');  //纬度
	exports.getLocation = function(){
		if(!longitude || !city_id){
			//高德获取经纬度
			var map = new AMap.Map("container",{
				resizeEnable: true
			});

			map.plugin('AMap.Geolocation', function() {
				geolocation = new AMap.Geolocation({
					enableHighAccuracy: true,//是否使用高精度定位，默认:true
					timeout: 10000,          //超过10秒后停止定位，默认：无穷大
					buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
					zoomToAccuracy: true,     //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					buttonPosition:'RB'
				});
				map.addControl(geolocation);
				geolocation.getCurrentPosition();
				AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
				AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
			});
			function onComplete(data){
				longitude = data.position.getLng();
				latitude = data.position.getLat();
				base.setItem("longitude", longitude);
				base.setItem("latitude", latitude);
				// var str=['定位成功'];
				// str.push('经度：' + data.position.getLng());
				// str.push('纬度：' + data.position.getLat());
				// str.push('精度：' + data.accuracy + ' 米');
				// str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
				// console.log(str);
				regeocoder(longitude,latitude);
			}
			function onError(data) {
				base.setItem("city_id", '000000');
				base.setItem("city_name", '全国');
				console.log('定位失败');
			};

			//高德逆编辑获取城市与城市ID
			function regeocoder(longitude,latitude){
				var lnglatXY = (longitude + ',' + latitude).split(','); //[116.396574, 39.992706]
				var geocoder = new AMap.Geocoder({
					radius: 1000,
					extensions: "all"
				});
				geocoder.getAddress(lnglatXY, function(status, result){
					if (status === 'complete' && result.info === 'OK') {
						console.log(result);
						var city = result.regeocode.addressComponent.adcode.substring(0,4) + '00';
						base.setItem("city_id", city);
						base.setItem("city_name", result.regeocode.addressComponent.city);
						$('.btn_city').text(result.regeocode.addressComponent.city);
						console.log(city);
						console.log(result.regeocode.addressComponent.city);
					}
				});
			}
		};
	}
});
