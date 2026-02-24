$(function () {
    // the carousel control is not in use
    if (typeof CarouselConfig == 'undefined')
        return;

    // remove the default buttons so they don't conflict with auto generated ones.
    $('#default-carousel-buttons').remove();
    // remove default padding
    $('.carousel li').css({ 'padding-bottom': '0px' });
    $('#carousel-wrapper').css({ 'padding-right': '0px' });
    // remove the additional padding or the scroll won't work
    //$('.jcarousel-skin-tango .jcarousel-clip-horizontal').css({	'padding-left:' : '0px' });

    // now let the plugin regenerate them
    //API for carousel
    //http://sorgalla.com/projects/jcarousel/
    $('.carousel').jcarousel({
        itemLoadCallback: itemLoadCallback,
        scroll: 1,
        size: CarouselConfig.TotalItems,
        visible: CarouselConfig.ScrollSize,
        buttonNextEvent: 'click keypress keydown',
        buttonPrevEvent: 'click keypress keydown'
    }).css({ 'overflow': 'hidden' });
    $('.cornerBox .featuredheader')
    .prepend(
        $("<a id=\"carousel-toggle-button\" style=\"padding-left: 12px; margin-left: 0px;\" href=\"javascript:divtoggle('carousel-wrapper', 'carousel-toggle-button')\" />")
        .append(
            $('<img class="sectionarrow" alt="expand" />').attr('src', REISys.Platform.WebRoot + 'platform/include/images/arrow_down.gif')
        )
    );
  //  $('.jcarousel-next').attr('tabindex', 0);

  //  $('.jcarousel-prev').attr('tabindex', 0);
    function itemLoadCallback(carousel, state) {
        if (carousel.has(carousel.first, carousel.last))
            return;

        // Lock carousel until request has been made
        carousel.lock();

        getItems(carousel);
    }
    function getItems(carousel) {
        // Unlock the carousel
        carousel.unlock();

        $.ajax({
            type: 'GET',
            data: { serviceTypeName: CarouselConfig.ServiceTypeName, scrollIndex: ++CarouselConfig.ScrollIndex, scrollSize: CarouselConfig.ScrollSize, additionalInputs: CarouselConfig.AdditionalInputs },
            url: REISys.Platform.WebRoot + 'Platform/WebServices/CarouselService.svc/GetCarouselItems',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (data) {
                var first = 0;

                for (var i = carousel.first; i <= carousel.last; i++) {
                    if (carousel.has(i))
                        continue;
                    first = i - 1;
                    break;
                }

                $(data.items).each(function (i) {
                    var imageUrl = this.imageUrl.startsWith("http") ? this.imageUrl : REISys.Platform.WebRoot + this.imageUrl.substr(2); // remove ~/ from url
                    var viewUrl = this.viewLinkUrl.startsWith("http") ? this.viewLinkUrl : REISys.Platform.WebRoot + this.viewLinkUrl.substr(2); // remove ~/ from url
                    var image = $('<div class="ft_component_img" />').
                        append(
                            $('<img />').attr('src', imageUrl).attr('alt', '')
                        );
                    var text = $('<div class="ft_component_text" />')
                        .append(
                    //  $('<a href="#" class="tooltip trheader" />').attr('title', this.toolTip).text(this.toolTipTitle)
                            $('<a href="#" class="tooltip trheader" />').attr('title', this.toolTip).text(this.toolTipTitle)
                         )
                        .append(
                            $('<p />').html(this.additionalInfo)
                        )
                        .append(
                            $('<a target="_blank" />')
                            .attr('href', viewUrl)
                            .append(
                                $('<img alt="View" />').attr('src', REISys.Platform.WebRoot + 'Platform/Include/Images/view.png')
                            )
                        )
                        .css({ 'float': 'none' });
                    var item = $('<li />').append(image).append(text);

                    // append all items after the last visible item
                    carousel.add(i + first + 1, item.html());
                });
            }
        });
    }
});