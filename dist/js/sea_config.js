seajs.config({
	// 激活 shim 插件

	//seajs.cache
	//会相对 base 路径来解析。
	//base: "dist/js",
	//设置别名，方便调用
	alias:{
		//"css" : "../dist/css/hlq.min.css",
		"zepto": "zepto/zepto.min.js",
		"base" : "base/base.js",
		"tab" : "tab/scroll.js", //tab_nav
		"login" : "login/login.js", //判断用户是否登录
		"jweixin" : "weixin/jweixin",
		"address" : "address/address.js",  //地址相关
		"dropload" : "dropload/dropload.min.js", //下拉加载
		"jsform" : "jsform/jsform.js", //下拉加载
		"idcard" : "idcard.js",
		"base64" : "Base64.js",
	},

	map:[
		//可配置版本号
		['.css', '.css?v=' + 1.1],
		['.js', '.js?v=' + 1.1]
	],


	// 预加载项
	preload: ['zepto', 'base'],

	// 调试模式    值为true时，加载器不会删除动态插入的 script 标签。插件也可以根据debug配置，来决策 log 等信息的输出。
	debug: true,

	// 文件编码
	charset: 'utf-8'
});

//require.resolve，会利用模块系统的内部机制对传入的字符串参数进行路径解析。
