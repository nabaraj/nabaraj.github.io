$(function () {
    var o = new $.BigVideo({
        useFlashForFirefox: !0,
        forceAutoplay: !1,
        controls: !1,
        doLoop: !1,
        container: $("body"),
        shrinkable: !1
    });
    //var player = o.getPlayer();
    
    o.init(), o.show($("body").attr("videourl"), {ambient: !1});
    o.getPlayer();
    o.getPlayer().on('loadedmetadata', function(){
        $('#big-video-wrap').show();
    });
    o.getPlayer().on("ended", function () {
        $("body").fadeOut("slow", function () {
            window.location.href = "pages/welcome.html"
        })
    })
});