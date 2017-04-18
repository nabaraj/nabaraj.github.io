"use strict";
var snapB, 
	myPathB, 
	movePoint,
	catText = "Theme"
	
//document ready start
$(document).ready(function(e) {	
	//box sizing start
	$(".bodyLayer").attr("page-stat","normal");
	/*$(".portfolioImage").find(".ibox").css({
		"width":(((getWh()*.45)/getWh())*100)+"%",
		"height":(((getWh()*.45)/getWh())*100)+"%"
	})*/
	$(".circleBox").css({
		/*"left":($(window).width()/2-1500),
		"top":($(window).height()/2-1500)*/
		}).animate({
		width:getWh(),
		height:getWh()/*,
		left:($(window).width()/2-getWh()/2),
		top:($(window).height()/2-getWh()/2)*/
		},function(){
			$(this).addClass("load");
			$(this).append('<div class="svgBox"><svg id="svgB" width="100%" height="100%" style="overflow: visible;"></svg></div>');
			portfolioResize();
			$(".numList li:first").addClass("active");
			/*$(".portFolioList li:first").css({
		"opacity":1	
	});*/
	hoverNumlist($(".numList li:first"));
	});
	
	//box sizing end
	arrangeList();
	var getFirstClass = $('.numList li:first-child').attr("class").split(" ");
	
	addRedClass(getFirstClass[0]);
	var asd = setInterval(function(){
		if($("#svgB").length>0){
			clearInterval(asd);
			createSvgData(getFirstClass[0]);
		}	
	},10)
	
	//bullet mouse hover start	
	$('.numList li').mouseenter(function(e){
		if(!$(this).hasClass("active")){
			hoverNumlist($(this));
		}
	});	
	//bullet mouse hover end
	//portfolio click start
	$(".portFolioList li img").click(function(){
			//alert($(this).attr("src"));
			var getStat= $(".bodyLayer").attr("page-stat");
			var $this = $(this);
			switch (getStat){
				case "sliderMode":
					
				break;
				case "normal":
					//changeWidth();	
					var getWidth = $(window).width();
					var getHeight = $(window).height();
					var getListIndex = $(this).parents("li").index();
					var currentElem = $(".portFolioList li.current img");
					var getContainer = $(".presentList").find(".container");
					var containerOffset = getContainer.offset();
					
					//alert(getWidth);
					//console.log(containerOffset.left, containerOffset.top);
					//console.log(currentElem.offset().top, currentElem.offset().left);
					$(".bodyLayer").attr("page-stat","sliderMode");
					$(".svgBox").css({
						opacity:0	
					});
					
					//showimage start
					var getImagesrc = $(".postList li:eq("+getListIndex+") img").attr("src");				
					
					
					$(".portfolioImage").css("height","100%");
					
					/*$(".ibox").css({
						"width":currentElem.parents("li").width(),
						"height":currentElem.parents("li").height()
						}).html('<img src="'+getImagesrc+'" class="img-responsive">');*/
					
					/*$(".ibox img").css({
						"width":(currentElem.width()),
						"height":(currentElem.height())	
					});*/
					$(".presentList img").css({
							"width":$this.width(),
							"height":$this.height()/*,
							"left":(getContainer.width()/2-$this.width()/2),
							"top":(getContainer.height()/2-$this.height()/2)*/
					});
					$(".postList").addClass("showDetails");
					/*.removeClass("landscape")
					.removeClass("portrait")
					.removeClass("square")*/
					//removeClass();
					//$(".ibox").addClass($(".portFolioList li.current").attr("image-type"));
					
					
					//console.log(currentElem.width(),$(".ibox").width());
					if($(".numList li:eq("+getListIndex+")").hasClass("pClass")){
						
						$(".presentList img").css({
							"width":$(this).width()*1.5,
							"height":$(this).height()*1.5,
							"left":(getContainer.width()-($(this).width()*1.5)),
							"top":"35px",
							"transform":"translate(0,0)" ,
							"-webkit-transform":"translate(0px,0px)"	
						})
					}else{
						$(".presentList img").css({
							width:$(this).width()*1.5,
							height:$(this).height()*1.5	
						})
						
					}
					$this.hide();
					console.log(getWh()*.16);
					//showimage start
					$(".circleBox").animate({
						"width":getWh()*1.6+"%",	
						"height":getWh()*1.6+"%"/*,
						"left":"50%",
						"top":"50%"*/
						},"slow",function(){
						$(".numList").css("opacity",0);
					});
					
				break;
				case "zoom":
					
				break;
			}
			
			
		})
	//portfolio click end
	//window resize start
	$(window).resize(function(e) {
		var getStat= $(".bodyLayer").attr("page-stat");
		switch (getStat){
			case "sliderMode":
				//ibox css start
				var getWidth = $(window).width();
				var getHeight = $(window).height();
				
				/*if($(".ibox").hasClass("landscape")){
						var topVal = ($(".ibox").find("img").height()/2-$(".ibox").height()/2+15);	
					}else{
						var topVal = "35px";
					}
					
				$(".ibox").css({
					"left":getWidth-($(".ibox").width()+300)						
				});*/
				//ibox css end
			break;
			case "normal":
				changeWidth();			
			break;
		}
		
		var winWidth = $(".circleBox").width(), winHeight = $(".circleBox").height();
		var approLen = (winWidth>winHeight) ? winWidth : winHeight;
		
		/*$(".portFolioList").css({
			width:"50%",
			height:"50%"
			,
			left:($(".circleBox").width()/2-(approLen*.5)/2)+"px",
			top:($(".circleBox").height()/2-(approLen*.5)/2)+"px",
		});*/
		//portfolio resize end
		var getThemeList =  $(".postList li.presentList").index();
		var getContainer = $(".presentList").find(".container");
		var containerOffset = getContainer.offset();
		if($(".numList li:eq("+getThemeList+")").hasClass("pClass")){
			$(".postList li.presentList img").css({
				"left":(getContainer.width()-($(this).width())),
				"top":"35px"
			});
		}
		if($(window).width()>768){
			setTimeout(function(){
				var getParClass = $(".pClass.red").attr("class").split(" ");
				createSvgData(getParClass[0]);
			},100)
		}
    });
	//window resize end
});
//document ready end
function hoverNumlist(elm){
	//console.log(e.type);
		//if(!elm.hasClass("active")){
		$('.numList li').removeClass("active");		
		elm.addClass("active");
		var getIndex = elm.index();
		$(".portFolioList li").removeAttr("style").removeClass("current");
		var gettarList = $(".portFolioList");
		var targetList = $(".portFolioList li:eq("+getIndex+")");
		changeHead(targetList);
		
		targetList.addClass("current").css({
			"width":(gettarList.width()*.8),
			"height":(gettarList.height()*.8),
			"opacity":1,
			"z-index":5
		}).animate({
			"width":"100%",
			"height":"100%",
		},100);
		//}
		$(".postList li").removeClass("presentList");
		$(".postList li:eq("+getIndex+")").addClass("presentList");
		
		if(!elm.hasClass("red")){
			if(elm.hasClass("childClass")){
				var className = elm.attr("class").split(" ");
				var parClass = className[0].replace("-child","");
				createSvgData(parClass);
				
			}else{
				var className = elm.attr("class").split(" ");
				var parClass = className[0];
				createSvgData(parClass);
			}
			addRedClass(parClass);
		//console.log(parClass);
		}	
}
//hoverNumlist end
function changeHead(elm){
	var getHead = elm.attr("data-head");
	var getElmIndex = elm.index();
	//if(elm).hasClass()
	if($('.numList li:eq('+getElmIndex+')').hasClass("pClass")){
		var getSub = catText;	
	}else{
		var getSub = elm.attr("data-smallhead");
	}
	$(".postMeta").html('<span class="sHead">'+getSub+'</span><h3>'+getHead+'</h3>')
	
}
//change head end
function portfolioResize(){
	//$(".portFolioList").width($(".circleBox").width()*.75);
	//$(".portFolioList").height($(".circleBox").height()*.75);
	var winWidth = $(".circleBox").width(), winHeight = $(".circleBox").height();
	var approLen = (winWidth>winHeight) ? winWidth : winHeight;
	$(".portFolioList li").each(function(index, element) {
		var imgObj = $(this).find("img");
				
		if(imgObj.width() > imgObj.height()){
			$(this).addClass("landscape").attr("image-type","landscape");			
		}else if(imgObj.width() < imgObj.height()){
			$(this).addClass("portrait").attr("image-type","portrait");
						
		}else{
			$(this).addClass("square").attr("image-type","square");
		}
    });
	$(".portFolioList").css({
		width:2,
		height:2/*,
		left:($(".circleBox").width()/2-1)+"px",
		top:($(".circleBox").height()/2-1)+"px",*/
	});
	
	$(".portFolioList").animate({
		width:"45%",
		height:"45%"/*,
		left:($(".circleBox").width()/2-(approLen*.5)/2)+"px",
		top:($(".circleBox").height()/2-(approLen*.5)/2)+"px",*/
	},100);
}
function changeWidth(){
	//alert(wwidth);
	
	$(".circleBox").css({			
		"width":getWh(),
		"height":getWh()/*,
		left:($(window).width()/2-getWh()/2),
		top:($(window).height()/2-getWh()/2)*/		
	});
}
function addRedClass(cname){
	$('.numList li').removeClass("red");
	$("."+cname).addClass("red");
	$("."+cname+"-child").addClass("red");
}
function arrangeList(){
	var fields = $('.numList li'), container = $('.circleBox'), width = container.width(), height = container.height(), parClass=['A','B','C','D','E','F'];
	
	var radius = (width/2-200);
	var angle = 4.71238898038469, step = (2*Math.PI) / fields.length;
	var rotateAngle = 0, rotateStep = 360/fields.length;
	
	//console.log(rotateAngle);
	fields.each(function(i) {
		
    	var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
   		var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
		if(window.console) {
			//console.log(i, angle, angle);
		}
		/*if(i==0||i%7==0){
			$(this).addClass("par"+parClass[Math.floor(i/7)]+ " pClass").html('<div class="smart-object">O<\/\div>');
		}else{
			var childClass = parClass[Math.floor(i/7)];
			$(this).addClass("par"+childClass+"-child childClass").html('<img class="cimage" src="images/round.jpg">');
		}*/
		
		
		$(this).css({
			/*"top":"auto",*/
			/*"-webkit-transform":"translate3d("+x+"px,"+y+"px,0px) rotate("+rotateAngle+"deg)",
			"transform":"translate3d("+x+"px,"+y+"px,0px) rotate("+rotateAngle+"deg)",*/
			"left":(x/width)*100+"%",
			"top":(y/width)*100+"%"
			
		});
		$(this).find(".smart-object, .cimage").css({
			"-webkit-transform":"rotate("+rotateAngle+"deg)",
			"transform":"rotate("+rotateAngle+"deg)"
		});
		
		angle += step;
		rotateAngle+= rotateStep;
	});
	}
function getWh(){	
	var wwidth = $(window).width();
	var wheight = $(window).height();
	var actLength;
	if(wwidth<wheight){
		actLength=wwidth
	}else{
		actLength=wheight;
	}
	return actLength;
}


function createSvgData(pClass){
	console.log($('*[class^="'+pClass+'"]').length);
	var parOffset = $("."+pClass).offset(), 
	getCLength = $("."+pClass+"-child").length, 
	lastC=$("."+pClass+"-child:eq("+(getCLength-1)+")"),
	lastOffset = lastC.offset(),
	cOffset = $(".circleBox").offset();
	var svgPath="";	
	
	$('*[class^="'+pClass+'"]').each(function(index, element) {
		var thisLeft = $(this).offset().left, thisTop = $(this).offset().top, thisWidth = $(this).width() ,thisHeight = $(this).height();
		
			if(index==0){
				svgPath = svgPath+"M"+((thisWidth/2)+thisLeft-cOffset.left)+",";
			}else if(index==1){
				svgPath = svgPath+"R"+((thisWidth/2)+thisLeft-cOffset.left)+",";
			}else{
				svgPath = svgPath+((thisWidth/2)+thisLeft-cOffset.left)+",";
			}
			svgPath = svgPath+((thisHeight/2)+thisTop-cOffset.top)+" ";	
		
    });	
	console.log(svgPath);
	drawPath(svgPath);
	
}

function drawPath(sPath){
	/*var svgHtml = "";
	svgHtml= svgHtml+'<svg x="-2" y="-2" width="100%" height="100%" style="overflow: visible;"><path ';
	svgHtml = svgHtml+'d="'+sPath+'" id="arc" fill="none" stroke="#d72229" stroke-width="2"></svg>';
	$(".svgBox").html(svgHtml);*/
	console.log($("#svgB").length);
	$("#svgB").html("");
  snapB = Snap("#svgB");

  // SVG B - "Squiggly" Path
  myPathB = snapB.path(sPath).attr({
    id: "squiggle",
    fill: "none",
    strokeWidth: "2",
    stroke: "#d72229",
    strokeMiterLimit: "10",
    strokeDasharray: "9 9",
    strokeDashOffset: "988.01"
  });

  // SVG B - Draw Path
  var lenB = myPathB.getTotalLength();

  // SVG B - Animate Path
  myPathB.attr({
	  stroke: '#d72229',
	  strokeWidth: 2,
    fill: 'none',
    // Draw Path
    "stroke-dasharray": lenB + " " + lenB,
    "stroke-dashoffset": lenB
  }).animate({"stroke-dashoffset": 1}, 100,mina.easeinout);

  
  

  setTimeout( function() {
    Snap.animate(0, lenB, function( value ) {
       movePoint = myPathB.getPointAtLength( value );
       //CircleB.attr({ cx: movePoint.x, cy: movePoint.y }); // move along path via cx & cy attributes
    }, 500,mina.easeinout);
  });	
}

function makeSVG(tag, attrs) {
	var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
	for (var k in attrs)
		el.setAttribute(k, attrs[k]);
	return el;
}
function removeClass(){
		$(".ibox")
					.removeClass("landscape")
					.removeClass("portrait")
					.removeClass("square");
}