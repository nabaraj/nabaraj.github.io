$(function () {
    var n = 90;
    $(".mainBtn").draggable({
        "axis": "y",
        drag: function (event, ui) {
            $(".buttonBg").css({
                "left": -ui.offset.left,
                "top": -ui.offset.top
            });

            var offset = $(this).offset();
            var yPos = offset.top;
            var preTop = parseInt($(this).attr("toppos"));
            //console.log(ui.position.top, preTop)

            // if(yPos>=preTop+n && direction(ui.position.top, preTop)==="down"){
            //     $(".mainBtn").fadeOut("slow", function () {
            //         $(".cloud1, .cloud2").css({
            //             "left":0
            //         });
            //         setTimeout(function(){
            //             window.location.href = "table.html"
            //        },3000);
                    
            //     })                
            // }else if(yPos<=(preTop-n) && direction(ui.position.top, preTop)==="top"){       
            //     $(".mainBtn").fadeOut("slow", function () {  
            //         $(".cloud1, .cloud2").css({
            //             "left":0
            //         });
            //         setTimeout(function(){       
            //             window.location.href = "farm.html"
            //         },3000);
            //     })
            // }

        }
    });
    $(".showVrBtn").click(function(e){
        e.preventDefault();
        if($(this).hasClass("showVr")){
            $(".vrImage").addClass("vrVisible");
            $(this).text("Hide VR");
            $(this).toggleClass("showVr");
        }else{
            $(".vrImage").removeClass("vrVisible");
            $(this).text("Show VR");
            $(this).toggleClass("showVr");
        }
        
    });
    
});
$(window).load(function () {
    //$(".cloudImage").addClass("floatCloud"); //on page load cloud animation
    var scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        scene.style.opacity = 1;
    }
    maintainWidthHeight();
    intialPosition();
    $(".mainBtn").attr("toppos",$(".mainBtn").offset().top);

        $(".mainBg").fadeIn("slow",function(){
            setTimeout(function () {
                $(".overlay").fadeIn("slow")
            }, 1000)

    })

    setTimeout(function(){
        // Typed.new("#typed", {
        //     stringsElement: document.getElementById('typed-strings'),
        //     typeSpeed: 30,
        //     backDelay: 500,
        //     loop: false,
        //     contentType: 'html',
        //     loopCount: null,
        //     callback: function(){ foo(); }
        //     //resetCallback: function() { newTyped(); }
        // });
        $(".welcome-title").fadeIn("slow", function(){
            $(".welcome-desc").fadeIn();
        });
        $(".mainBtn").addClass("inview");
        
    },2000)
    
});

$(window).resize(function () {
    maintainWidthHeight();
});

document.querySelector('a-scene').addEventListener('enter-vr', function () {
   console.log("ENTERED VR");
});

function intialPosition() {
    $(".mainBtn").css({
        "left": ($(window).width() / 2) - ($(".mainBtn").width() / 2)
    });    
    $(".buttonBg").css({
        "left": -$(".mainBtn").offset().left,
        "top": -$(".mainBtn").offset().top
    })
}
function foo(){
    $(".welcome-title").addClass("hide-cursore");
    Typed.new("#typed-desc", {
            stringsElement: document.getElementById('typed-strings-desc'),
            typeSpeed: 30,
            backDelay: 500,
            loop: false,
            contentType: 'html',
            loopCount: null,
            callback: function(){ 
                $(".mainBtn").addClass("inview"); 
             },
            //resetCallback: function() { newTyped(); }
        });
}
function maintainWidthHeight() {
    $(".buttonBg").width($(".mainBg").width());
    $(".buttonBg").height($(".mainBg").height());

}
function direction(t, preTop){
    if(t<preTop){
        return "top";
    }else if(t>preTop){
        return "down";
    }
}


// else {
//     scene.addEventListener('loaded', run);
// }
// function run (elm) {
//     elm.style.opacity = 1;
// }