/// <reference path="../jquery.js" />

$(function() {
    $('img.tooltip').live('mouseover', function() {
        var img = $(this);
        var alt = img.attr('alt');
        if (alt && alt != '') {
            img.attr('altTemp', alt);
            img.attr('alt', '');
        }
    });
    $('img.tooltip').live('mouseout', function () {
        var img = $(this);
        var temp = img.attr('altTemp');
        if (temp && temp != '')
            img.attr('alt', temp);
    });

    $('a.tooltip').live('focus', function () {
        var anc = $(this);
        var alt = anc.attr('alt');
        if (alt && alt != '') {
            anc.attr('altTemp', alt);
            anc.attr('alt', '');
        }
    });
});