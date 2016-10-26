define(function(require, exports, module) {
	//require('http://gosspublic.alicdn.com/aliyun-oss-sdk-4.4.4.min.js');
	//console.log($("input[type='radio']:checked").val());
	var base = require('base/base.js');
	var stsAuthData = null;

	var jsform ={
		getStsAuth : function(){
			return stsAuthData;
		},
		toast: function(tips){
			var html  ='<div id="loadingToast" class="weui_loading_toast">';
				html +='<div class="weui_mask_transparent"></div>';
				html +='<div class="weui_toast">';
				html +='<div class="weui_loading"><div class="weui_loading_leaf weui_loading_leaf_0"></div><div class="weui_loading_leaf weui_loading_leaf_1"></div><div class="weui_loading_leaf weui_loading_leaf_2"></div><div class="weui_loading_leaf weui_loading_leaf_3"></div><div class="weui_loading_leaf weui_loading_leaf_4"></div><div class="weui_loading_leaf weui_loading_leaf_5"></div><div class="weui_loading_leaf weui_loading_leaf_6"></div><div class="weui_loading_leaf weui_loading_leaf_7"></div><div class="weui_loading_leaf weui_loading_leaf_8"></div><div class="weui_loading_leaf weui_loading_leaf_9"></div><div class="weui_loading_leaf weui_loading_leaf_10"></div><div class="weui_loading_leaf weui_loading_leaf_11"></div></div>';
				html +='<p class="weui_toast_content">'+ tips +'</p>';
				html +='</div></div>';
				$('body').append(html);
				//setTimeout('$(".tips").remove();',1500);
		},
		toastClose: function(){
			$("#loadingToast").remove()
		},
		setTemplateHTML : function(personal,suffix){
			var template="";
			$(personal).each(function(index,item){
				var required = item.required,
					mark = required ? '<span class="mark">*</span>' : "";
				switch (item.type) {
					case 'dropdown':
						//console.log(item.options)
						var options = "";
						$(item.options).each(function(i,val){
							options += '<option value="'+ val.label +'">'+ val.label +'</option>'
						})
						template += '<div class="weui_cells"><div class="weui_cell weui_cell_select weui_select_after"><div class="weui_cell_hd"><label for="'+ (item.name + suffix) +'" class="weui_label">'+ mark +  item.label +'</label></div><div class="weui_cell_bd weui_cell_primary"><select class="weui_select" data-label="'+ item.label +'" data-type="dropdown" id="'+ (item.name + suffix) +'" name="'+ item.name +'">'+ options +'</select></div></div></div>'
						break;
					case 'radio':  //单选框
						var check ="";
						$(item.options).each(function(i,val){
							var isChecked = val.checked ? 'checked="true"' : 'checked=""',
								isCheckedClass = val.checked ? '' : 'radio_active';
							check += '<label class="weui_cell weui_check_label radio_sele '+ isCheckedClass +'" for="'+ (item.name + suffix + i) +'"><div class="weui_cell_bd weui_cell_primary"><p>'+ val.label +'</p></div><div class="weui_cell_ft"><input type="radio" '+ isChecked +' class="weui_check" data-label="'+ item.label +'" data-type="radio" data-required="'+ required +'" name="'+ item.name +'"  value="'+ val.label +'" id="'+ (item.name + suffix + i) +'"><span class="weui_icon_checked"></span></div></label>'
						})
						template += '<div class="weui_cells"><div class="weui_cells_title weui_cells_tit">'+ mark +  item.label +'</div><div class="weui_cells weui_cells_checkbox">'+ check +'</div></div>'
						break;
					case 'checkbox':
						var checkbox = "";
						$(item.options).each(function(i,val){
							var isChecked = val.check ? 'checked="checked"' : '';
							checkbox += '<label class="weui_cell weui_check_label" for="'+ (item.name + suffix + i) +'"><div class="weui_cell_bd weui_cell_primary"><p>'+ val.label +'</p></div><div class="weui_cell_hd checkbox_icon"><input type="checkbox" '+ isChecked +' class="weui_check" data-required="'+ required +'" data-type="checkbox" data-label="'+ item.label +'" name="'+ item.name +'" id="'+ (item.name + suffix + i) +'" value="'+ val.label +'"><i class="weui_icon_checked"></i></div></label>'
						})
						template += '<div class="weui_cells"><div class="weui_cells_title weui_cells_tit">'+ mark +  item.label +'</div><div class="weui_cells weui_cells_radio">'+ checkbox +'</div></div>'
						break;
					case 'image_file':
						template += '<div class="weui_cells"><div class="weui_cell"><div style="padding-left:0;color:#333;" class="weui_cells_tips">'+ mark + item.label +'</div><div class="weui_cell_bd weui_cell_primary"><div class="weui_uploader_input_wrp"><input class="weui_uploader_input" data-required="'+ required +'" data-url="" data-type="image_file" data-check="'+ item.check_format +'" id="'+ (item.name + suffix) +'" name="'+ item.name +'" type="file" ><div class="weui_uploader_file"></div></div></div></div></div>'
						break;
					case 'label':
						template += '<div class="weui_cells"><div class="weui_cells_label">'+ item.label +'</div></div>'
						break;
					case 'certificate': //证件
						var options = '';
						$(item.options).each(function(i,val){
							options += val.visible ? '<option value="'+ val.value +'">'+ val.label +'</option>' : "";
						})
						template += '<div class="weui_cells"><div class="weui_cell weui_cell_select weui_select_before"><div class="weui_cell_hd">'+ mark +'<select data-type="certificate" class="weui_select" data-required="'+ required +'"  data-label="'+ item.label +'" id="'+ (item.name + suffix) +'" name="'+ item.name +'">'+ options +'</select></div><div class="weui_cell_bd weui_cell_primary"><input class="weui_input" data-type="certificate" data-check="'+ item.check_format +'" data-required="'+ required +'" name="'+ item.name +'" type="text" placeholder="请输入证件号码"></div></div></div>'
						break;
					case 'number':
						template += '<div class="weui_cells"><div class="weui_cell"><div class="weui_cell_hd"><label class="weui_label">'+ mark +  item.label +'</label></div><div class="weui_cell_bd weui_cell_primary"><input data-required="'+ required +'" data-type="number" data-label="'+ item.label +'" name="'+ item.name +'" type="number" pattern="[0-9]*" placeholder="请输入'+ item.label +'" class="weui_input"></div></div></div>';
						break;
					case 'tel':
							template += '<div class="weui_cells"><div class="weui_cell"><div class="weui_cell_hd"><label class="weui_label">'+ mark +  item.label +'</label></div><div class="weui_cell_bd weui_cell_primary"><input data-required="'+ required +'"  data-check="'+ item.check_format +'" data-type="tel" data-label="'+ item.label +'" name="'+ item.name +'" type="tel" pattern="[0-9]*" placeholder="请输入'+ item.label +'" class="weui_input"></div></div></div>';
							break;
					default:
						template += '<div class="weui_cells"><div class="weui_cell"><div class="weui_cell_hd"><label class="weui_label">'+ mark +  item.label +'</label></div><div class="weui_cell_bd weui_cell_primary"><input data-required="'+ required +'" data-type="texts" data-label="'+ item.label +'" name="'+ item.name +'" type="text" placeholder="请输入'+ item.label +'" class="weui_input"></div></div></div>';
				}
			});
			return template
		},
		setTemplate : function(min,personal,predpare){
			var template="",
	            predpare = predpare ? '<span class="predpare">预</span>' : ' ';
	        for(var i=1; i <= min; i++){
	            template += '<form id="form'+ i +'" class="weui_cells_form"><div class="weui_cells_title">'+ predpare + '参赛者'+ i +'</div>';
				template += this.setTemplateHTML(personal,i);
	            template += '</form>';
	        };
	        return template
		},
		fsubmit : function(len,formList){
			var other_fields = [],
				key = [],
				fulfill = false;
			if($("#form1").length == 0){
				base.tips("没有表单信息");
				return false;
			}
			//获取表单里的name
			for(var i=0; i < formList.length; i++){
				var keyAttr = [],
					type = formList.elements[i];
					keyAttr.push(type.getAttribute('data-type'));
					keyAttr.push(type.name);
				key.push(keyAttr);
				base.unique(key)
			}

			$(len).each(function(index,item){
				var indexNum = index + 1,
					subItem = {};
				$(key).each(function(order,v){
					var isAttr = v.split(','),
						isType = isAttr[0],
						isName = isAttr[1];
					if(isType == 'texts' || isType == 'tel' || isType == 'number'){
						var elemeItem = $("#form"+ indexNum +" input[name='"+ isName +"']"),
							required = elemeItem.data('required'),
							check = elemeItem.data('check');
							if(required && elemeItem.val() == ''){
								base.tips("请输入参赛者"+ indexNum +"的" + elemeItem.data('label'));
								fulfill = true;
								return false;
							}
							if(isType == 'tel' && required && check && !base.isPhone(elemeItem.val())){
								base.tips("参赛者"+ indexNum +"的电话错误");
								fulfill = true;
								return false;
							}
							if(isType == 'tel' && elemeItem.val() !="" && !base.isPhone(elemeItem.val())){
								base.tips("参赛者"+ indexNum +"的电话错误");
								fulfill = true;
								return false;
							}

							subItem[isName] = elemeItem.val();
					}

					if(isType == 'dropdown'){
						var num = isName + 1,
							seleVal =  $("#" + num).val();
							subItem[isName] = seleVal
					}

					if(isType == 'radio'){
						var radioVal = $("#form"+ indexNum +" input[name='"+ isName +"']:checked").val(),
							required = $("#form"+ indexNum +" input[name='"+ isName +"']").data('required'),
							radioLabel = $("#form"+ indexNum +" input[name='"+ isName +"']").data('label');
							if(required && radioVal == undefined || radioVal == ''){
								base.tips("请输入参赛者"+ indexNum +"的" + radioLabel);
								fulfill = true;
								return false;
							}
							subItem[isName] = radioVal
					}

					if(isType == 'checkbox'){
						var elemeItem = $("#form"+ indexNum +" input[name='"+ isName +"']:checked"),
							required = $("#form"+ indexNum +" input[name='"+ isName +"']").data('required'),
							checkLabel = $("#form"+ indexNum +" input[name='"+ isName +"']").data('label'),
							checkVal = [];
						$(elemeItem).each(function(){
							if(this.checked){
								checkVal.push($(this).val());
							}
						})
						if(required && checkVal.length == '0'){
							base.tips("请输入参赛者"+ indexNum +"的" + checkLabel);
							fulfill = true;
							return false;
						}
						subItem[isName] = checkVal.join(",");
					}

					if(isType == 'certificate'){
						var elemeItem = $("#form"+ indexNum +" input[name='"+ isName +"']"),
							num = isName + 1,
							card_type = $("#" + num).val();
							required = elemeItem.data('required'),
							check = elemeItem.data('check');
							if(required && elemeItem.val() == ''){
								base.tips("请输入参赛者"+ indexNum +"的证件号码");
								fulfill = true;
								return false;
							}
							if(card_type == 'cn_id' && required && check && !checkCard(elemeItem.val())){
								base.tips("参赛者"+ indexNum +"的证件号码不正确");
								fulfill = true;
								return false;
							}

							if(elemeItem.val() !=""  && !checkCard(elemeItem.val())){
								base.tips("参赛者"+ indexNum +"的证件号码不正确");
								fulfill = true;
								return false;
							}

						subItem[isName] = {"card_type":card_type,"card_value":elemeItem.val()};
					}

					if(isType == 'image_file'){
						var elementId = document.getElementById(isName + 1),
							uploadFile = elementId.value,
							required = elementId.getAttribute('data-required'),
							radioLabel = $("#form"+ indexNum +" input[name='"+ isName +"']").data('label');
							check = elementId.data('check'),
							url = elementId.getAttribute('data-url');

							if(required && check){
								base.tips("请上传参赛者"+ indexNum + "的" + radioLabel);
								fulfill = true;
								return false;
							}

						subItem[isName] = url
					}

				})
				other_fields.push(subItem)
			});
			if(fulfill) return false;
			return other_fields;
		},
		commonForm: function(name){
			var keys = [],
				formID = document.getElementById(name),
				common_data = {};
				for(var i=0; i < formID.length; i++){
					var keyAttr = [],
						type = formID.elements[i];
						keyAttr.push(type.getAttribute('data-type'));
						keyAttr.push(type.name);
					keys.push(keyAttr);
					base.unique(keys)
				}
				$(keys).each(function(index,item){
					var isAttr = item.split(','),
						isType = isAttr[0],
						isName = isAttr[1];
						console.log(isName)
					if(isType == 'texts' || isType == 'tel' || isType == 'number'){
						var elemeItem = $("#commonForm input[name='"+ isName +"']"),
							required = elemeItem.data('required');
							if(required && elemeItem.val() == ''){
								base.tips("共公区的" + elemeItem.data('label'));
								return false;
							}
							if(isType == 'tel' && !base.isPhone(elemeItem.val())){
								base.tips("共公区的的电话错误");
								return false;
							}
							common_data[isName] = elemeItem.val();
					};
					//下拉框值
					if(isType == 'dropdown'){
						var num = isName + 1,
							seleVal =  $("#" + num).val();
							common_data[isName] = seleVal
					}
					//公共区的单选
					if(isType == 'radio'){
						var radioVal = $("#commonForm input[name='"+ isName +"']:checked").val(),
							required = $("#commonForm input[name='"+ isName +"']").data('required'),
							radioLabel = $("#commonForm input[name='"+ isName +"']").data('label');
							if(required && radioVal == undefined || radioVal == ''){
								base.tips("请输入公共区的" + radioLabel);
								return false;
							}
							common_data[isName] = radioVal
					}
					// 公共区复选
					if(isType == 'checkbox'){
						var elemeItem = $("#commonForm input[name='"+ isName +"']:checked"),
							required = $("#commonForm input[name='"+ isName +"']").data('required'),
							checkLabel = $("#commonForm input[name='"+ isName +"']").data('label'),
							checkVal = [];
						$(elemeItem).each(function(){
							if(this.checked){
								checkVal.push($(this).val());
							}
						})
						if(required && checkVal.length == '0'){
							base.tips("请输入公共区的" + checkLabel);
							fulfill = true;
							return false;
						}
						common_data[isName] = checkVal.join(",");
					}
					//公共区
					if(isType == 'certificate'){
						var elemeItem = $("#commonForm input[name='"+ isName +"']"),
							num = isName + 1,
							card_type = $("#" + num).val();
							required = elemeItem.data('required');
							if(required && elemeItem.val() == ''){
								base.tips("请输入公共区的证件号码");
								fulfill = true;
								return false;
							}
							if(card_type == 'cn_id' && !checkCard(elemeItem.val())){
								base.tips("请输入公共区的证件号码不正确");
								fulfill = true;
								return false;
							}
						common_data[isName] = {"card_type":card_type,"card_value":elemeItem.val()};
					}
					//公共区的图片上传
					if(isType == 'image_file'){
						var elementId = document.getElementById(isName + 1),
							uploadFile = elementId.value,
							required = elementId.getAttribute('data-required'),
							url = elementId.getAttribute('data-url');
							if(required && uploadFile ==''){
								base.tips("请上传公共区的图片");
							}
						common_data[isName] = url
					}
				})
				console.log(common_data)
				return common_data;
		}
	}
	module.exports = jsform
});
