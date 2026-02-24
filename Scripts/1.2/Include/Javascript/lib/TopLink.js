//Plugin for Top of Page link

//Original Plugin website
//http://davidwalsh.name/jquery-top-link
//has been modified

function topLink(settings, obj) {

    settings = jQuery.extend({
        min: 1,
        fadeSpeed: 200,
        ieOffset: 50
    }, settings);
    obj.each(function() {
        //listen for scroll
        var el = $(obj);
        el.css('display', 'none'); //in case the user forgot
        $(window).scroll(function() {
            //IE hack
//            if (!jQuery.support.hrefNormalized) {
//                el.css({
//                    'position': 'absolute',
//                    'top': $(window).scrollTop() + $(window).height() - settings.ieOffset
//                });
//            }
            if ($(window).scrollTop() >= settings.min) {
                el.fadeIn(settings.fadeSpeed);
            }
            else {
                el.fadeOut(settings.fadeSpeed);
            }
        });
        return true;
    });
    
};

jQuery.fn.topLink = function(settings) {
    settings = jQuery.extend({
        min: 1,
        fadeSpeed: 200,
        ieOffset: 50
    }, settings);
    this.each(function() {
        //listen for scroll
        var el = $(this);
        el.css('display', 'none'); //in case the user forgot
        $(window).scroll(function () {
        
            //IE hack
//            if (!jQuery.support.hrefNormalized) {
//                el.css({
//                    'position': 'absolute',
//                    'top': $(window).scrollTop() + $(window).height() - settings.ieOffset
//                });
//            }
            if ($(window).scrollTop() >= settings.min) {
                if (!(el.is(":visible"))) {
                    //Checking RadEditor in FullScreen Mode
                    if (!ReiSys.Platform.UI.IsFullScreen)
                        el.fadeIn(settings.fadeSpeed);
                }
            }
            else {
                if((el.is(":visible"))){
                    el.fadeOut(settings.fadeSpeed, function () { });
                }
            }
        });
        return true;
    });

};


