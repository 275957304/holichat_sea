;(function($,window){

	var tpl = '<div class="preview"><span class="preview-close">x</span><div id="imgPreview"><img src="loading.gif"/></div></div>',
		img;
	function photoPreview(el){
		this.wrapper = typeof el == 'string' ? $(el)[0] : el;
		var currenimg = $(this.wrapper).find('img');
		console.log(currenimg.length);
		currenimg.on('click',function(){
			var src = $(this).attr('src');
			initEvent(src);	
		});
		$('body').on('click','.preview-close',function(){
			$('.preview').remove();
		})
	}
	
	var initEvent = function(event){
		$('body').append(tpl);
		$('.preview').addClass('zoomIn');
		var img = new Image();
		img.src = event;
		console.log(img.height)	
		if (img.complete) {
			$('#imgPreview').find('img').attr('src',img.src);
		}
	};

	
	
	/*
	var big = new Image();
	big.onload = function() {
	if ( this.offsetWidth > 500 ) {
	//set width
	} else {
	//not set width
	}
	};
	big.src = 'xx.com/1.jpg';

	*/
	window.photoPreview = $.photoPreview = photoPreview;
})(Zepto,window);