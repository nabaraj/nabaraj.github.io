jQuery(document).ready(function($) {
			$(".menuToggle").click(function(event) {
				$(".mainNav").toggleClass("openMenu");
				$("body").toggleClass("slideMenu")
			});
			var windowH = $(window).height()-$(".mainNav").height();
			$("#banner").height(windowH);
			$('#slides').superslides({
        		hashchange: false,
        		animation: 'fade',
	            play: 5000
      		});

      		$('#slides').on('animated.slides', function () {
      			
      			var gi = $(this).superslides('current');
      			$('#slides .slides-container li:eq('+gi+')').addClass("current");
      		        
      		});

      		    // before slide animation begins
      		$('#slides').on('animating.slides', function () {
      		    var gi = $(this).superslides('current');
      			$('#slides .slides-container li:eq('+gi+')').removeClass("current");
      		});


			$(window).scroll(function(e) {
		        if($(window).scrollTop()>15){
					$("body").addClass("fixedNav");
				}else{
					$("body").removeClass("fixedNav");
				}
		    });
		    $(window).resize(function(event) {
		    	var windowH = $(window).height()-$(".mainNav").height();
		    	$("#banner").height(windowH);
		    });
		 	  $('.clientList').owlCarousel({
		        autoPlay: 3000,
		        items : 4,
		        itemsDesktop : [1199,3],
		        itemsDesktopSmall : [979,3]
		      });

			$('.form input, .form1 input').attr('data-value', $(this).val()).on('keyup', function() {
				var getVal = $(this).val();
				if(getVal == ""){
					$(this).prev('label').removeClass("showLab");
				}else{
				    $(this).prev('label').addClass("showLab");	
				}		
			
			});	
			$(".resgisterMenu a, .scrollBotton a").click(function(event) {
				event.preventDefault();
				var getTarget = $(this).attr("href");
				$("html, body").animate({scrollTop:($(getTarget).offset().top - $(".mainNav").height())}, "slow");
				//$("body,html").scrollTop()
			});		
		 }); 

		//document ready end
		$(window).load(function() {
			//alert("window load")
		  $('.flexslider').flexslider({
		    animation: "fade",
		    slideshow:true,
		    controlNav:false,
		    directionNav:false
		  });
		});
		new WOW().init();
	// google map start


		function initMap() {
		  var center = {lat: 12.9566192, lng: 77.7004064}
		  var map = new google.maps.Map(document.getElementById('mapSection'), {
		    zoom: 15,		    
		    center: center,
		    scrollwheel: false
		  });
			var styles = [
		    {
		      stylers: [       
		        { saturation: -100 }
		      ]
		    }
		  ];
		  var goldStar = {
		    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
		    fillColor: 'yellow',
		    fillOpacity: 0.8,
		    scale: 1,
		    strokeColor: 'gold',
		    strokeWeight: 14
		  };
		  map.setOptions({styles: styles});

		  $(window).resize(function() {
		     map.setCenter(center);
		  });

			var image = "images/mapMarker.png";
		  	var marker = new google.maps.Marker({
			    position: map.getCenter(),
			    icon: image,
			    map: map,
			    animation: google.maps.Animation.BOUNCE
			 });

		}