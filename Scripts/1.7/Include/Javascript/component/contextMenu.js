/*************************************************************
* Functions that control javascript context menus
*************************************************************/
var ContextMenuOnClick = new GlobalPlatformEvent('ContextMenuClick');


var menuId;
$(document).mouseup(function (e) {
    if (menuId)
        $("[id$='" + menuId + "']").slideUp(200);
});


$(".showContext").live('click', function (e) {
    //Raising an event before proceeding.
    ContextMenuOnClick.raise($(this), null);

    //cross browser stuff
    var evt = window.event || e;
    if (!evt.target)
        evt.target = evt.srcElement;

    var target = $(evt.target);
    var orientationHoriz;
    var orientationVert;
    var animation;
    var close;
    var menu;
    menu = $("[id$='" + evt.target.id + "'].showContext");
    if (menu.length == 0)
        menu = $("[id$='" + evt.target.parentNode.id + "'].showContext");
    else
        target = $(evt.target).children(0);


    if (menu && menu.length > 0) {
        var newMenu = menu.attr('rel')

        menuId = newMenu;

        /*********************************************************
        *  Can easily be done more simply like this:
        *  $("[id$='" + newMenu + "']").slideDown(200);
        *  but needs to find its positioning to stay on screen.
        *  thats all the rest of this does, positioning
        **********************************************************/

        //var targetOffset = target.offset();
        // Vishal Soni -- Used position() because it will give relative position.
        // PFM-4004
        var yPos = $("[id$='" + evt.target.id + "']").position().top;
        var left = $("[id$='" + evt.target.id + "']").position().left - 125;
        //var yPos = targetOffset.top;
        var coordsOffset = { top: yPos, left: left };

        orientationHoriz = menu.attr('orientation-horizontal');
        orientationVert = menu.attr('orientation-vertical');

        //coordsOffset.left += $(evt.target).width();
        coordsOffset.left += target.width();

        if (orientationVert == "up")
            coordsOffset.top -= +7;
        else
            coordsOffset.top += +7;

        DisplayContextMenu(coordsOffset, newMenu, orientationVert, orientationHoriz, $(this).attr('id'), $(this));
        $('.tooltip').tipTip();
        return;
    }
});

// Displays the menu and makes sure it fits to the screen

function DisplayContextMenu(coords, control, orientationVert, orientationHoriz, buttonTriggeredid, originator) {

    var menu = $("[id$='" + control + "']");
    var scrollOffset = { top: document.body.scrollTop || document.documentElement.scrollTop, left: document.body.scrollLeft || document.documentElement.scrollLeft }
    var previousDisplay;
    if (coords != null) {
        previousDisplay = menu.css("display");
        menu.css("display", "inline");
        menu.css("left", coords.left);
        menu.css("top", coords.top);

        //orientation
        if (orientationVert == 'up' ||
		(orientationVert == "auto" && parseInt(menu.css("top")) + menu.outerHeight(true) > $(window).height()))
            menu.css("top", parseInt(menu.css("top")) - menu.height());

        if (orientationHoriz == "left" ||
		(orientationHoriz == "auto" && parseInt(menu.css("left")) + menu.outerWidth(true) > $(window).width()))
            menu.css("left", parseInt(menu.css("left")) - menu.width());

        //auto adjust window to fit on screen
        if (parseInt(menu.css("left")) + menu.width() - scrollOffset.left > $(window).width())
            menu.css("left", parseInt(menu.css("left")) - (parseInt(menu.css("left")) + menu.width() - scrollOffset.left - $(window).width() + 5));

        if (parseInt(menu.css("top")) + 35 + menu.outerHeight(true) - scrollOffset.top > $(window).height())
            menu.css("top", parseInt(menu.css("top")) - (parseInt(menu.css("top")) + menu.outerHeight(true) - scrollOffset.top + 35 - $(window).height()));
        menu.css("display", previousDisplay);

        $('ul.cmlevel2').hide();
        //   $('ul.cmlevel2').removeAttr("style");
        $('ul.cmlevel3').hide();
        //  $('ul.cmlevel3').removeAttr("style");
        $('ul.cmlevel4').hide();
        //  $('ul.cmlevel4').removeAttr("style");
        menu.slideDown(200).show();

        function GetLastNonDisabledItem(menu) {
            var lastElement;
            lastElement = $('*', menu).filter(':focusable:last'); // .each(function () {
            //			        if ($('.cmDisabled ', $(this)).length == 0) {
            //			            lastElement = $(this);
            //			        }
            //			    });

            return lastElement;
        }


        var firstItem = $('*', menu).filter(':focusable:first');
        firstItem.off('keydown');
        firstItem.off('keyup');
        $('[id="' + buttonTriggeredid + '"]').off('keydown');
        $('[id="' + buttonTriggeredid + '"]').on('keydown', function (e) {
            var key = GetCharCode(e);
            //                    
            switch (key) {
                case 27: //ESC
                    menu.slideUp(200);
                    break;
                case 40://DOWN
                    firstItem.focus();
                    return false;
                    break;
            }
        });
        $('li.cmItem > a', menu).each(function () {
            $(this).off('keydown');
        });

        $('*', menu).filter(':focusable').each(function () {
            $(this).on('keydown', function (e) {
                var key = GetCharCode(e);
                //                    
                switch (key) {

                    case 27: //ESC
                        menu.slideUp(200);
                        $('[id="' + buttonTriggeredid + '"]').focus();

                }
            })
        });
        var shiftKeyDown = false;
        var lastNonDisabledItem = GetLastNonDisabledItem(menu);
        $('li.cmItem > a', menu).each(function () {
            $(this).on('keydown', function (e) {
                var key = GetCharCode(e);
                switch (key) {

                    case 9: // tab to be used for shift tab
                        //  alert(shiftKeyHitGlobal);
                        if (shiftKeyDown) {
                            if (firstItem[0] == (this)) {
                                menu.slideUp(200);
                            }
                        }
                        break;
                    case 27: //ESC
                        menu.slideUp(200);
                        $('[id="' + buttonTriggeredid + '"]').focus();
                        break;
                    case 37:
                        //alert('Left arrow');
                        //Will add as an enhancement later
                        // return false;
                        break;
                    case 38:
                        //Up

                        //If First close menu
                        if (firstItem[0] == (this)) {
                            menu.slideUp(200);

                            $('[id="' + buttonTriggeredid + '"]').focus();
                        } else {

                            var parent = $(this).parent();
                            $('a:first', findPrev(parent)).focus();
                        }
                        PlatformConsole.log('Up pressed');
                        return false;
                        break;
                    case 39:
                        // alert('Right arrow');
                        //Will add as an enhancement later
                        // return false;
                        break;
                    case 40:
                        //Down
                        var parent = $(this).parent();
                        $('a:first', findNext(parent)).focus();

                        if (lastNonDisabledItem[0] == (this)) {
                            menu.slideUp(200);
                            $('[id="' + buttonTriggeredid + '"]').focus();

                        }
                        PlatformConsole.log('down pressed');
                        return false;
                        break;
                    case 16: // shift Key
                        shiftKeyDown = true;
                        break;
                }


            });

            $(this).on('keyup', function (e) {
                var key = GetCharCode(e);
                //                    
                switch (key) {
                    case 16: // shift Key
                        shiftKeyDown = false;
                        break;
                }

            });
        });

        firstItem.on('keydown', function (e) {
            var key = GetCharCode(e);

            switch (key) {
                case 9: //tab
                    if (shiftKeyDown) {
                        menu.slideUp(200);
                    }
                    break;
                case 16: // shift Key
                    shiftKeyDown = true;
                    break;
            }
        });

        firstItem.on('keyUp', function (e) {
            var key = GetCharCode(e);
            switch (key) {
                case 16: // shift Key
                    shiftKeyDown = false;
                    break;

            }
        });

        if (lastNonDisabledItem) {
            lastNonDisabledItem.bind('keydown.cmFocusLost', function (e) {
                var key = GetCharCode(e);

                switch (key) {
                    case 9: //tab

                        if (!shiftKeyDown) {
                            menu.slideUp(200);
                            //alert('this it');
                            $(this).unbind('keydown.cmFocusLost'); // once menu closed remove binding 

                        }
                        break;
                    case 40: //down arrow

                        menu.slideUp(200);
                        //alert('this it');
                        $(this).unbind('keydown.cmFocusLost'); // once menu closed remove binding 
                        return false;
                        break;

                    case 16: // shift Key
                        shiftKeyDown = true;
                        break;

                }
            });

            lastNonDisabledItem.on('keyup', function (e) {
                var key = GetCharCode(e);

                switch (key) {
                    case 16: // shift Key
                        shiftKeyDown = false;
                        break;

                }
            });
        }

    }

}



//Find the next element
function findNext(element) {
    //sub menu
    var item = $('li.cmItem:first', element);
    if (item.length === 0) {
        //in the sameGrouping
        item = element.next('li.cmItem').has('a');
        if (item.length === 0) {

            var elementNextAll = element.nextAll().not('div.cmSeperator,li.cmGroupHeader, li.cmHeader').has('a');
            elementNextAll.each(function (index) {
                var curentItem = $(this);
                if (curentItem.hasClass('cmItem')) {
                    item = curentItem;
                    return false;
                } else {
                    item = $('li.cmItem:has("a"):first', curentItem);
                    if (item.length !== 0) {
                        //exists out of loop
                        return false;
                    }
                }
            })
            if (item.length === 0) {
                var elementParentNext = element.parent().nextAll().not('div.cmSeperator,li.cmGroupHeader, li.cmHeader').has('a');
                elementParentNext.each(function (index) {
                    var curentItem = $(this);
                    if (curentItem.hasClass('cmItem')) {
                        item = curentItem;
                        return false;
                    } else {
                        item = $('li.cmItem:has("a"):first', curentItem);
                        if (item.length !== 0) {
                            //exists out of loop
                            return false;
                        }
                    }
                })

                if (item.length === 0) {
                    var parent = element.parent();
                    if (parent.hasClass('cmlevel4') || parent.hasClass('cmlevel3') || parent.hasClass('cmlevel2') || parent.hasClass('cmlevel1')) {
                        item = FindNextExcludeCurrent(parent, element);

                    } else {

                        //alert('unknown');
                    }
                }
            }
        }
    }

    return item;
}

function FindNextExcludeCurrent(parent, currentElemet) {

    var item;
    var elementNextAll = parent.nextAll().not('div.cmSeperator,li.cmGroupHeader, li.cmHeader').not(currentElemet).has('a');
    elementNextAll.each(function (index) {
        var curentItem = $(this);
        if (curentItem.hasClass('cmItem')) {
            item = curentItem;
            return false;
        } else {
            items = $('li.cmItem', curentItem).not(currentElemet).has('a');
            if (items.length !== 0) {
                item = items.first();
                return false;
            } else {

                return false;
            }
        }
    })
    if (item === undefined || item.length === 0) {
        if (!parent.hasClass('cmlevel1')) {
            item = FindNextExcludeCurrent(parent.parent(), currentElemet);
        }
    }

    return item;
}


//Find PreviousElement 

function findPrev(element) {

    //in the sameGrouping
    var item;
    item = element.prev('li.cmItem').has('a');
    if (item.length === 0) {

        var elementPrevAll = element.prevAll().not('div.cmSeperator,li.cmGroupHeader, li.cmHeader').has('a:visible');
        elementPrevAll.each(function (index) {
            var curentItem = $(this);
            if (curentItem.hasClass('cmItem')) {
                item = curentItem;
                PlatformConsole.log('First CM item');
                return false;
            } else {
                item = $('li.cmItem:has("a"):visible:last', curentItem).has('a');
                if (item.length !== 0) {
                    PlatformConsole.log('Prevall CM item');
                    //exists out of loop
                    return false;
                }
            }
        })
        if (item.length === 0) {

            var elementParentNext = element.parent().prevAll().not('div.cmSeperator,li.cmGroupHeader, li.cmHeader').has('a:visible');
            elementParentNext.each(function (index) {
                if (item.length === 0) {
                    var curentItem = $(this);
                    if (curentItem.hasClass('cmItem')) {
                        item = curentItem;
                        PlatformConsole.log('parent First CM item');
                        return false;
                    }
                    else {
                        //get currtent level and revmoce any item that is not under the current level
                        item = $('li.cmItem:visible', curentItem).has('a:visible').last();
                        PlatformConsole.log($('li.cmItem:visible', curentItem).has('a:visible').length);
                        if (item.length !== 0) {
                            PlatformConsole.log('Parent prev all CM item');
                            //exists out of loop
                            return false;
                        }
                    }
                }
            })

            if (item.length === 0) {
                var parent = element.parent();
                if (parent.hasClass('cmlevel4') || parent.hasClass('cmlevel3') || parent.hasClass('cmlevel2') || parent.hasClass('cmlevel1')) {
                    item = FindPrevExcludeCurrent(parent, element);
                }
            }
        }

    }

    return item;
}



function FindPrevExcludeCurrent(parent, currentElemet) {

    var item;
    var elementPrevAll = parent.prevAll().not('div.cmSeperator,li.cmGroupHeader, li.cmHeader').not(currentElemet).has('a:visible');
    elementPrevAll.each(function (index) {
        var curentItem = $(this);
        if (curentItem.hasClass('cmItem')) {
            item = curentItem;
            PlatformConsole.log('Parent Parent First prev all CM item');
            return false;
        } else {
            items = $('li.cmItem:visible', curentItem).not(currentElemet).has('a');
            if (items.length !== 0) {
                item = items.last();
                PlatformConsole.log('Parent parent prev all CM item');
                return false;
            } else {

                return false;
            }
        }
    })
    if (item === undefined || item.length === 0) {
        if (!parent.hasClass('cmlevel1')) {
            item = FindPrevExcludeCurrent(parent.parent(), currentElemet);
        }
    }

    return item;
}
