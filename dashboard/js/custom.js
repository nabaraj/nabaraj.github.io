jQuery(document).ready(function($) {
		// price range start
		$( "#slider-range" ).slider({
		      range: true,
		      min: 0,
		      max: 200,
		      create: function( event, ui ) {
		      	$('#slider-range .ui-slider-handle:first').addClass('first-handle glyphicon glyphicon-triangle-left');
		      	$('#slider-range .ui-slider-handle:last').addClass('second-handle glyphicon glyphicon-triangle-right');
		      },
		      values: [ 0, 100 ],
		      slide: function( event, ui ) {		        
		        $(".minVal").html("$"+ui.values[ 0 ]+"<span>/m</span>");
		    	$(".maxVal").html("$"+ui.values[ 1 ]+"<span>/m</span>");
		      }
		    });
		    
		    $(".minVal").html("$" + $( "#slider-range" ).slider( "values", 0 )+"<span>/m</span>");
		    $(".maxVal").html("$" + $( "#slider-range" ).slider( "values", 1 )+"<span>/m</span>");
		// price range end
		$('.dropdown-toggle').dropdown();
		//open project details on item click start
		$(".item.active").click(function(event) {
			
			closeDetails()
			if($(this).hasClass('selected')){
			    $(".item").removeClass('selected');
			    closeDetails();
		    }else{
		    	$(".item").removeClass('selected');
		    	$(this).addClass("selected");
		    	openDetails();

		    }
		});
		//open project details on item click end

		$("#sidebar").hover(function() {
			$(this).addClass("overflowAuto");
		}, function() {
			$(this).removeClass("overflowAuto");
		});

		// close project details start 
		$(".closeProject").click(function(){
			closeDetails();
			$(".item").removeClass('selected');
		});
		// close project details end
		$(".listView").click(function(event) {
			event.preventDefault();

			$("#main").addClass("fullList");
			$(this).parent("li").addClass("active");
			$(".gridView").parent("li").removeClass("active");
		});
		$(".gridView").click(function(event) {
			event.preventDefault();
			$("#main").removeClass("fullList");
			$(this).parent("li").addClass("active");
			$(".listView").parent("li").removeClass("active");
		});
		$(".showSide").click(function(e){
			if($(window).width()<768){
				e.preventDefault();
				$(this).toggleClass("hideSidebar");
				$("#sidebar").toggleClass('showSidebar');
				$(".proDetailsOverlay").toggleClass("overLayShow");
				$("#main").toggleClass('fullScreen');
			}
		});
		$(".proDetailsOverlay").click(function(event) {
			if($(window).width()<768){
				$(".showSide").toggleClass("hideSidebar");;
				$("#sidebar").toggleClass('showSidebar');
				$(this).toggleClass("overLayShow");
				$("#main").toggleClass('fullScreen');
			}
		});
		$(".closeBtn").click(function(){
			$(".proDetailsOverlay").trigger("click");
		})
	});
	function closeDetails(){
		var getWidth = $("#projectDetails").outerWidth();
		$("#projectDetails").animate({"right":"-135%"});
	}
	function openDetails(){
		var getWidth = $("#projectDetails").outerWidth();
		$("#projectDetails").animate({"right":0});
	}