/// <reference path="../jquery-vsdoc.js" />

Sys.Application.add_load(function() {
    $('.widget-body').each(function() {
        if (!this.setup) {
            $('.hiddeninfo:empty', this).next().find('a.viewmore').addClass('disabled').removeAttr('href');
            $(".viewmore", this).not('.disabled').click(function(e) {
                e.preventDefault();
                var newMenu = $(this).parent().parent().prev('.hiddeninfo'); // $("[id$='" + $(e.target).attr('rel') + "']");
                if (this.className.indexOf('clicked') != -1) {
                    for (i = 0; i < newMenu.length; i++)
                        $(newMenu.get(i)).slideUp(500);

                    $(this).removeClass('clicked')
                    $(this).html("+ View More");
                }
                else {
                    $(this).addClass('clicked')
                    for (i = 0; i < newMenu.length; i++)
                        $(newMenu.get(i)).slideDown(500);
                    $(this).html("- View Less");
                }
            });
        }
        this.setup = true;
    });
});

$(function () {
    $('.widget-filter-icon').parent()
        .focus(function () {
            $(this).nextAll('.widget-filter-category-popup').toggle(function () {
                var tabindex = 0;
                $('.widget-filter-category-popup input').each(function () {
                    var $input = $(this);
                    $input.attr("tabindex", tabindex);
                });
            });
        });

    //        .blur(function () {
    //            $(this).nextAll('.widget-filter-category-popup').toggle();
    //        });
        $('.widget-filter-category-popup input:last')
            .blur(function () {
                 $('.widget-filter-category-popup').toggle();
            });
});
//