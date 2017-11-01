$(function(){
	var mySpan=new Array();  //span数组用来给每个题目后加提示信息
	var myType=new Array();  //用来存储每个题目的类型
	var myTypeValue=new Array();   //用来存储选择后的值
	var mySelect=new Array();   //二维数组，用来获得每个选项并用来判断选项长度
	var necessity=new Array();   //用来存储每个题目的必要性
	var flag="";
	//获取标题
	$.getJSON('title.json',function(response,status,xhr){
		$headline=$("<h2></h2>");
		$headline.html(response[0].headline);
		$headline.appendTo($("form"));
	});
	$.getJSON('xuanze.json',function(response,status,xhr){
		for(i=0;i<response.length;i++){
			necessity[i]=response[i].necessity;
			mySelect[i]=new Array();
			//添加题目
			$myTitle=$("<p></p>");
			$myTitle.html(response[i].title);
			$myTitle.attr("id","mytitle"+response[i].id);
			$myTitle.appendTo($("form"));
			//在题目后添加span元素用来进行提示信息
			mySpan[i]=$("<span></span>");
			mySpan[i].attr("id","mySpan"+response[i].id);
			mySpan[i].appendTo($("#mytitle"+response[i].id));
			
			myType[i]=response[i].type;
			if(myType[i]=="single"){
				for(j=0;j<response[i].choice.length;j++){
					$button=$("<input />");
					$button.attr("type","radio");
					$button.attr("name","mychoice"+response[i].id);
					$button.attr("value",Math.pow(2,j));
					$button.appendTo($("form"));
					$single_choice=$("<label></label>");
					$single_choice.html(response[i].choice[j].content);
					$single_choice.appendTo($("form"));
					$newline=$("<br />");
					$newline.appendTo($("form"));
					mySelect[i]=document.getElementsByName("mychoice"+response[i].id);
				}
			}else if(myType[i]=="multiple"){
				for(j=0;j<response[i].choice.length;j++){
					$button=$("<input />");
					$button.attr("type","checkbox");
					$button.attr("name","mychoice"+response[i].id);
					$button.attr("value",Math.pow(2,j));
					$button.appendTo($("form"));
					$single_choice=$("<label></label>");
					$single_choice.html(response[i].choice[j].content);
					$single_choice.appendTo($("form"));
					$newline=$("<br />");
					$newline.appendTo($("form"));
					mySelect[i]=document.getElementsByName("mychoice"+response[i].id);
				}
			}else if(myType[i]=="single_line"){
				$single_line=$("<input />");
				$single_line.attr("type","text");
				$single_line.attr("id","mytext"+response[i].id);
				$single_line.appendTo($("form"));
				mySelect[i]=document.getElementById("mytext"+response[i].id);
			}else if(myType[i]=="multiple_line"){
				$multiple_line=$("<textarea></textarea>");
				$multiple_line.attr("id","mytext"+response[i].id);
				$multiple_line.attr("cols","20");
				$multiple_line.attr("rows","5");
				$multiple_line.appendTo($("form"));
				mySelect[i]=document.getElementById("mytext"+response[i].id);
			}
		}
	});

	$('#test').click(function (){
		//当为选择题时循环得到选项的值
		for(var k=0;k<mySelect.length;k++){
			if((myType[k]=="multiple")||(myType[k]=="single")){
				myTypeValue[k]=0;
				for(var p=0;p<mySelect[k].length;p++){
					if(mySelect[k][p].checked){
						myTypeValue[k]+=parseInt(mySelect[k][p].value);
					}
				}
			}else{
			//当为文本框时输出文本框的值
				myTypeValue[k]=mySelect[k].value;
			}
		}
		//判断必选项是否为空
		for(var i=0;i<mySelect.length;i++){
			if(necessity[i]=="required"){
				if((myTypeValue[i]==undefined)||(myTypeValue[i]=="null")||(myTypeValue[i]=="")){
					if((myType[i]=="single")||(myType[i]=="multiple")){
						mySpan[i].text("(请选择你的选项)");
					}else{
						mySpan[i].text("(此项为必填项)");
					}
					flag=0;
				}else{
					mySpan[i].text("");
					flag=1;
				}
			}
		}
		//若必填项都已填好，则提交
		if(flag==1){
			$.ajax({
				url: "tijiao.html",
				type: "POST",
				data: {
					"myTypeValue": myTypeValue,
					"time": new Date().getTime()
				},
				success: function(data) {
					alert("提交成功");
					window.location.href="tijiao.html";
				}
			});
		}else{
			alert("提交失败，请您填入必填项");
		}
	});

});