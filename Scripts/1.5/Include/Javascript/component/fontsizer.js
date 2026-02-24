/// <reference path="../jquery-vsdoc.js" />


var currentIncrement = 0;

function SetFontSize(increment) {
    if (isNaN(increment)) {
        increment = 0;
    }
    document.body.style.fontSize = (12 + increment + 'px');
    jQuery('.fontselected').removeClass('fontselected');
    jQuery('[title=' + increment + ']').parent().addClass('fontselected');
    setCookie("fontSizeAdjustment", increment, 180, "/");
}

jQuery(function() {
    var fontSizeRestrictions =
    {
        '.fontflyout_menu': [, 12]
    };

    var GLOBAL_MAX_FONT_SIZE = 32;
    var GLOBAL_MIN_FONT_SIZE = 6;
    for (var selector in fontSizeRestrictions) {
        var min_max = fontSizeRestrictions[selector];
        min_max.length == 2 || alert('ERROR: setting font size restrictions');
        var min = min_max[0] || GLOBAL_MIN_FONT_SIZE;
        var max = min_max[1] || GLOBAL_MAX_FONT_SIZE;
        jQuery(selector).each(function() { this.minFontSize = min; this.maxFontSize = max; });
    }

    var fontSizeAdjustment = getCookie('fontSizeAdjustment');
    
    if (fontSizeAdjustment != null) {
        SetFontSize(parseInt(fontSizeAdjustment));
        
        jQuery("small[title=" + fontSizeAdjustment + "]").parent('.fontsizer').addClass('fontselected');
    }
    else {
        jQuery('.fontsizer').filter('[title="defaultFont"]').addClass('fontselected');
    }



    jQuery('.fontsizer').click(function() {
        var increment = parseInt(jQuery('small', this).attr('title'));
        SetFontSize(increment);
    });

    jQuery('.fontreset').click(function() {
        var defaultFontLink = jQuery('[title="defaultFont"]');
        var defaultIncrement = parseInt(defaultFontLink.children('small').attr('title'));
        SetFontSize(defaultIncrement);
        setCookie("fontSizeAdjustment", defaultIncrement, 180, "/");
    });
});