/*-------------------------------------------------------------------- 
Scripts for creating and manipulating custom menus based on standard <ul> markup
Version: 3.0, 03.31.2009

By: Maggie Costello Wachs (maggie@filamentgroup.com) and Scott Jehl (scott@filamentgroup.com)
http://www.filamentgroup.com
* reference articles: http://www.filamentgroup.com/lab/jquery_ipod_style_drilldown_menu/
		
Copyright (c) 2009 Filament Group
Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.

Thomas Tighe 2014
Modified this plugin to be 508 compliant to allow for focus being brought to the first item and to from the last to the opening item
Also added tab and shif tab ability 

--------------------------------------------------------------------*/

var allUIMenus = [];

allUIMenus.find = function (id) {
    return JSLINQ(this).First(function (menu) {
        return menu.container.attr('id') == id;
    });
};

$.fn.fgmenu = function (options) {
    var caller = this;
    var ulWidth = caller.next().find('ul')[0].style.width;
    options.width = ulWidth;
    var options = options;
    var m = new Menu(caller, options);
    allUIMenus.push(m);

    $(this)
	.mousedown(function () {
	    if (!m.menuOpen) { m.showLoading(); };
	})
	.click(function () {
	    if (m.menuOpen == false) { m.showMenu(); }
	    else { m.kill(); };
	    return false;
	});
};

function Menu(caller, options) {
    var menu = this;
    var caller = $(caller);
    var container = $('<div class="fg-menu-container ui-widget ui-widget-content ui-corner-all">' + options.content + '</div>');

    this.container = container;

    if (options.id)
        container.attr('id', options.id);

    this.menuOpen = false;
    this.menuExists = false;

    //// Add window resize event for fg Menu to set the Position when we resize the window.
    $(window).resize(function () {
        if (menu.menuOpen) {
            menu.setPosition(container, caller, options, true);
        }
        else {
            menu.create();
            menu.kill();
        }
    });

    var options = jQuery.extend({
        content: null,
        width: 0, //width of menu container, must be set or passed in to calculate widths of child menus
        maxHeight: 150, // max height of menu (if a drilldown: height does not include breadcrumb)
        positionOpts: {
            posX: 'left',
            posY: 'bottom',
            offsetX: 0,
            offsetY: 0,
            directionH: 'right',
            directionV: 'down',
            detectH: true, // do horizontal collision detection  
            detectV: true, // do vertical collision detection
            linkToFront: false
        },
        showSpeed: 100, // show/hide speed in milliseconds
        callerOnState: 'ui-state-active', // class to change the appearance of the link/button when the menu is showing
        loadingState: 'ui-state-loading', // class added to the link/button while the menu is created
        linkHover: 'ui-state-hover', // class for menu option hover state
        linkHoverSecondary: 'li-hover', // alternate class, may be used for multi-level menus		
        // ----- multi-level menu defaults -----
        crossSpeed: 100, // cross-fade speed for multi-level menus
        crumbDefaultText: 'Choose an option:',
        backLink: true, // in the ipod-style menu: instead of breadcrumbs, show only a 'back' link
        backLinkText: 'Back',
        flyOut: false, // multi-level menus are ipod-style by default; this parameter overrides to make a flyout instead
        flyOutOnState: 'ui-state-default',
        nextMenuLink: 'ui-icon-triangle-1-e', // class to style the link (specifically, a span within the link) used in the multi-level menu to show the next level
        topLinkText: 'All',
        nextCrumbLink: 'ui-icon-carat-1-e'
    }, options);

    var killAllMenus = function () {
        $.each(allUIMenus, function (i) {
            if (allUIMenus[i].menuOpen) { allUIMenus[i].kill(); };
        });
    };

    this.kill = function () {
        caller
			.removeClass(options.loadingState)
			.removeClass('fg-menu-open')
			.removeClass(options.callerOnState);
        container.find('li').removeClass(options.linkHoverSecondary).find('a').removeClass(options.linkHover);
        if (options.flyOutOnState) { container.find('li a').removeClass(options.flyOutOnState); };
        if (options.callerOnState) { caller.removeClass(options.callerOnState); };
        if (container.is('.fg-menu-ipod')) { menu.resetDrilldownMenu(); };
        if (container.is('.fg-menu-flyout')) { menu.resetFlyoutMenu(); };
        container.parent().hide();
        menu.menuOpen = false;
        $(document).unbind('click', killAllMenus);
        $(document).unbind('keydown');
    };

    this.showLoading = function () {
        caller.addClass(options.loadingState);
    };

    this.showMenu = function () {
        killAllMenus();
        if (!menu.menuExists) { menu.create() };
        caller
			.addClass('fg-menu-open')
			.addClass(options.callerOnState);
        var tempMenu = container.parent();
        tempMenu.show().click(function () { menu.kill(); return false; });
        container.hide().slideDown(options.showSpeed).find('.fg-menu:eq(0)');
        menu.menuOpen = true;
        caller.removeClass(options.loadingState);
        $(document).click(killAllMenus);
        var firstItem = $('a:focusable:first', tempMenu);
        firstItem.trigger('mouseover');
        firstItem.addClass('ui-state-hover');
        var lastItem = $('a:focusable', tempMenu).not('.cmDisabled').last();
        var shiftTagHitPreviously = false;
        // assign key events

        $(document).keyup(function (event) {
            var e;
            if (event.which != "") { e = event.which; }
            else if (event.charCode != "") { e = event.charCode; }
            else if (event.keyCode != "") { e = event.keyCode; }
            switch (e) {
                case 16:
                    shiftTagHitPreviously = false;
            }
        });
        $(document).keydown(function (event) {
            var e;
            if (event.which != "") { e = event.which; }
            else if (event.charCode != "") { e = event.charCode; }
            else if (event.keyCode != "") { e = event.keyCode; }

            var menuType = ($(event.target).parents('div').is('.fg-menu-flyout')) ? 'flyout' : 'ipod';

            switch (e) {
                case 16: // shift Key
                    shiftTagHitPreviously = true;
                    return false;
                    break;
                case 37: // left arrow 
                    if (menuType == 'flyout') {
                        $(event.target).trigger('mouseout');
                        if ($('.' + options.flyOutOnState).size() > 0) { $('.' + options.flyOutOnState).trigger('mouseover'); };
                    };

                    if (menuType == 'ipod') {
                        $(event.target).trigger('mouseout');
                        if ($('.fg-menu-footer').find('a').size() > 0) { $('.fg-menu-footer').find('a').trigger('click'); };
                        if ($('.fg-menu-header').find('a').size() > 0) { $('.fg-menu-current-crumb').prev().find('a').trigger('click'); };
                        if ($('.fg-menu-current').prev().is('.fg-menu-indicator')) {
                            $('.fg-menu-current').prev().trigger('mouseover');
                        };
                    };
                    return false;
                    break;

                case 38: // up arrow 
                    if ($(event.target).is('.' + options.linkHover)) {
                        var prevLink = $(event.target).parent().prevAll().has('div.hidden').first().find('a:eq(0)'); //$(event.target).parent().prev().find('a:eq(0)');
                        if (prevLink.size() == 0) {

                            prevLink = $(event.target).parent().prev().find('a:eq(0)');
                        }
                        if (prevLink.size() > 0) {
                            $(event.target).trigger('mouseout');
                            prevLink.trigger('mouseover');
                        } else {
                            var tempGrandParent = $(event.target).parent().parent();
                            if (!tempGrandParent.hasClass('fg-menu')) {
                                prevLink = tempGrandParent.parent().find('a:eq(0)');
                                if (prevLink.size() > 0) {
                                    $(event.target).trigger('mouseout');
                                    prevLink.trigger('mouseover');
                                }
                            }
                        };
                    }
                    else { container.find('a:eq(0)').trigger('mouseover'); }
                    return false;
                    break;

                case 39: // right arrow 
                    if ($(event.target).is('.fg-menu-indicator')) {
                        if (menuType == 'flyout') {
                            $(event.target).next().find('a:eq(0)').trigger('mouseover');
                        }
                        else if (menuType == 'ipod') {
                            $(event.target).trigger('click');
                            setTimeout(function () {
                                $(event.target).next().find('a:eq(0)').trigger('mouseover');
                            }, options.crossSpeed);
                        };
                    };
                    return false;
                    break;
                case 9: // tab
                    if (shiftTagHitPreviously) {
                        if ($(event.target).is('.' + options.linkHover)) {
                            var prevLink = $(event.target).parent().prevAll().has('div.hidden').first().find('a:eq(0)'); //$(event.target).parent().prev().find('a:eq(0)');
                            if (prevLink.size() == 0) {
                                prevLink = $(event.target).parent().prev().find('a:eq(0)');
                            }
                            if (prevLink.size() > 0) {
                                $(event.target).trigger('mouseout');
                                prevLink.trigger('mouseover');
                            } else {
                                var tempGrandParent = $(event.target).parent().parent();
                                if (!tempGrandParent.hasClass('fg-menu')) {
                                    prevLink = tempGrandParent.parent().find('a:eq(0)');
                                    if (prevLink.size() > 0) {
                                        $(event.target).trigger('mouseout');
                                        prevLink.trigger('mouseover');
                                    }
                                }
                            };
                        }
                        else { container.find('a:eq(0)').trigger('mouseover'); }
                        return false;
                        break;
                    }
                    else if ($(event.target).is('.fg-menu-indicator')) {
                        if (menuType == 'flyout') {
                            $(event.target).next().find('a:eq(0)').trigger('mouseover');
                        }
                        else if (menuType == 'ipod') {
                            $(event.target).trigger('click');
                            setTimeout(function () {
                                $(event.target).next().find('a:eq(0)').trigger('mouseover');
                            }, options.crossSpeed);
                        };
                        return false;
                        break;
                    }
                case 40: // down arrow 
                    if ($(event.target)[0] != lastItem[0]) {
                        if ($(event.target).is('.fg-menu-indicator')) {
                            if (menuType == 'flyout') {
                                $(event.target).next().find('a:eq(0)').trigger('mouseover');
                            }
                            else if (menuType == 'ipod') {
                                $(event.target).trigger('click');
                                setTimeout(function () {
                                    $(event.target).next().find('a:eq(0)').trigger('mouseover');
                                }, options.crossSpeed);
                            }
                        } else if ($(event.target).is('.' + options.linkHover)) {
                            var nextLink = $(event.target).parent().nextAll().has('div.hidden').first().find('a:eq(0)');

                            if (nextLink.size() === 0) {
                                nextLink = $(event.target).parent().next().find('a:eq(0)');
                            }
                            if (nextLink.size() > 0) {
                                $(event.target).trigger('mouseout');
                                nextLink.trigger('mouseover');
                            } else {
                                //check if ul
                                var tempGrandParent = $(event.target).parent().parent();
                                if (!tempGrandParent.hasClass('fg-menu')) {
                                    nextLink = tempGrandParent.parent().next().find('a:eq(0)');

                                    if (nextLink.size() > 0) {
                                        $(event.target).trigger('mouseout');
                                        nextLink.trigger('mouseover');
                                    } else {
                                        killAllMenus();
                                        caller.focus();
                                    }
                                }

                            }
                        }
                        else { container.find('a:eq(0)').trigger('mouseover'); }
                    } else {
                        killAllMenus();
                        caller.focus();
                    }
                    return false;
                    break;

                case 27: // escape
                    killAllMenus();
                    caller.focus();
                    break;
                case 13: // enter
                    if ($(event.target).is('.fg-menu-indicator') && menuType == 'ipod') {
                        $(event.target).trigger('click');
                        setTimeout(function () {
                            $(event.target).next().find('a:eq(0)').trigger('mouseover');
                        }, options.crossSpeed);
                    } else {
                        $(event.target).trigger('click');
                        caller.focus();
                    }
                    break;
            }
        });
    };

    this.create = function () {
        container.css({ width: options.width }).appendTo('body').find('ul:first').not('.fg-menu-breadcrumb').addClass('fg-menu');
        container.find('ul, li a').addClass('ui-corner-all');

        // aria roles & attributes
        container.find('ul').attr('role', 'menu').eq(0).attr('aria-activedescendant', 'active-menuitem').attr('aria-labelledby', caller.attr('id'));
        container.find('li').attr('role', 'menuitem');
        container.find('li:has(ul)').attr('aria-haspopup', 'true').find('ul').attr('aria-expanded', 'false');

        // when there are multiple levels of hierarchy, create flyout or drilldown menu
        if (container.find('ul').size() > 1) {
            if (options.flyOut) { menu.flyout(container, options); }
            else { menu.drilldown(container, options); }
        }
        else {
            container.find('a').click(function () {
                //If the link is already disabled, skip the menu.chooseItem method call.
                if (!$(this).hasClass('cmDisabled')) {
                    menu.chooseItem(this, true);
                }
                return false;
            });
        };

        if (options.linkHover) {
            var allLinks = container.find('.fg-menu li a');
            allLinks.hover(
				function () {
				    var menuitem = $(this);
				    $('.' + options.linkHover).removeClass(options.linkHover).blur().parent().removeAttr('id');
				    $(this).addClass(options.linkHover).focus().parent().attr('id', 'active-menuitem');
				},
				function () {
				    $(this).removeClass(options.linkHover).blur().parent().removeAttr('id');
				}
			);
        };

        if (options.linkHoverSecondary) {
            container.find('.fg-menu li').hover(
				function () {
				    $(this).siblings('li').removeClass(options.linkHoverSecondary);
				    if (options.flyOutOnState) { $(this).siblings('li').find('a').removeClass(options.flyOutOnState); }
				    $(this).addClass(options.linkHoverSecondary);
				},
				function () { $(this).removeClass(options.linkHoverSecondary); }
			);
        };

        menu.setPosition(container, caller, options);
        menu.menuExists = true;
    };

    //The second parameter (flag) is to differentiate if the page action flyout menu item is clicked.
    this.chooseItem = function (item, flag) {
        menu.kill();
        if (flag != 'undefined' && flag == true && item.attributes["id"] != null) {
            fnDisableControl(item.attributes["id"].value, null);
        }
        // edit this for your own custom function/callback:
        $('#menuSelection').text($(item).text());
        location.href = $(item).attr('href');
    };

    menu.create();
    menu.kill();
};

Menu.prototype.flyout = function (container, options) {
    var menu = this;

    this.resetFlyoutMenu = function () {
        var allLists = container.find('ul ul');
        allLists.removeClass('ui-widget-content').hide();
    };

    container.addClass('fg-menu-flyout').find('li:has(ul)').each(function () {
        var linkWidth = container.width();
        var showTimer, hideTimer;
        var allSubLists = $(this).find('ul');

        allSubLists.css({ left: linkWidth/*, width: linkWidth*/ }).hide();

        $(this).find('a:eq(0)').addClass('fg-menu-indicator').html('<span>' + $(this).find('a:eq(0)').text() + '</span><span class="ui-icon ' + options.nextMenuLink + '"></span>').hover(
			function () {
			    clearTimeout(hideTimer);
			    var subList = $(this).next();
			    if (!fitVertical(subList, $(this).offset().top)) { subList.css({ top: 'auto', bottom: 0 }); };
			    if (!fitHorizontal(subList, $(this).offset().left)) { subList.css({ left: 'auto', right: linkWidth, 'z-index': 999 }); };
			    showTimer = setTimeout(function () {
			        subList.addClass('ui-widget-content').show(options.showSpeed).attr('aria-expanded', 'true');
			    }, 300);
			},
			function () {
			    clearTimeout(showTimer);
			    var subList = $(this).next();
			    hideTimer = setTimeout(function () {
			        subList.removeClass('ui-widget-content').hide(options.showSpeed).attr('aria-expanded', 'false');
			    }, 400);
			}
		).click(function (e) {
		    e.stopImmediatePropagation(); e.preventDefault(); return false;
		});

        $(this).find('ul a').hover(
			function () {
			    clearTimeout(hideTimer);
			    if ($(this).parents('ul').prev().is('a.fg-menu-indicator')) {
			        $(this).parents('ul').prev().addClass(options.flyOutOnState);
			    }
			},
			function () {
			    hideTimer = setTimeout(function () {
			        allSubLists.hide(options.showSpeed);
			        container.find(options.flyOutOnState).removeClass(options.flyOutOnState);
			    }, 500);
			}
		);
    });

    container.find('a').click(function () {
        menu.chooseItem(this);
        return false;
    });
};


Menu.prototype.drilldown = function (container, options) {
    var menu = this;
    var topList = container.find('.fg-menu');
    var breadcrumb = $('<ul class="fg-menu-breadcrumb ui-widget-header ui-corner-all ui-helper-clearfix"></ul>');
    var crumbDefaultHeader = $('<li class="fg-menu-breadcrumb-text">' + options.crumbDefaultText + '</li>');
    var firstCrumbText = (options.backLink) ? options.backLinkText : options.topLinkText;
    var firstCrumbClass = (options.backLink) ? 'fg-menu-prev-list' : 'fg-menu-all-lists';
    var firstCrumbLinkClass = (options.backLink) ? 'ui-state-default ui-corner-all' : '';
    var firstCrumbIcon = (options.backLink) ? '<span class="ui-icon ui-icon-triangle-1-w"></span>' : '';
    var firstCrumb = $('<li class="' + firstCrumbClass + '"><a href="#" class="' + firstCrumbLinkClass + '">' + firstCrumbIcon + firstCrumbText + '</a></li>');

    container.addClass('fg-menu-ipod');

    if (options.backLink) { breadcrumb.addClass('fg-menu-footer').appendTo(container).hide(); }
    else { breadcrumb.addClass('fg-menu-header').prependTo(container); };
    breadcrumb.append(crumbDefaultHeader);

    var checkMenuHeight = function (el) {
        if (el.height() > options.maxHeight) { el.addClass('fg-menu-scroll') };
        el.css({ height: options.maxHeight });
    };

    var resetChildMenu = function (el) { el.removeClass('fg-menu-scroll').removeClass('fg-menu-current').height('auto'); };

    this.resetDrilldownMenu = function () {
        $('.fg-menu-current').removeClass('fg-menu-current');
        topList.animate({ left: 0 }, options.crossSpeed, function () {
            $(this).find('ul').each(function () {
                $(this).hide();
                resetChildMenu($(this));
            });
            topList.addClass('fg-menu-current');
        });
        $('.fg-menu-all-lists').find('span').remove();
        breadcrumb.empty().append(crumbDefaultHeader);
        $('.fg-menu-footer').empty().hide();
        checkMenuHeight(topList);
    };

    topList
		.addClass('fg-menu-content fg-menu-current ui-widget-content ui-helper-clearfix')
		.css({ width: container.width() })
		.find('ul')
			.css({ width: container.width(), left: container.width() })
			.addClass('ui-widget-content')
			.hide();
    checkMenuHeight(topList);

    topList.find('a').each(function () {
        // if the link opens a child menu:
        if ($(this).next().is('ul')) {
            $(this)
				.addClass('fg-menu-indicator')
				.each(function () { $(this).html('<span>' + $(this).text() + '</span><span class="ui-icon ' + options.nextMenuLink + '"></span>'); })
				.click(function () { // ----- show the next menu			
				    var nextList = $(this).next();
				    var parentUl = $(this).parents('ul:eq(0)');
				    var parentLeft = (parentUl.is('.fg-menu-content')) ? 0 : parseFloat(topList.css('left'));
				    var nextLeftVal = Math.round(parentLeft - parseFloat(container.width()));
				    var footer = $('.fg-menu-footer');

				    // show next menu   		
				    resetChildMenu(parentUl);
				    checkMenuHeight(nextList);
				    topList.animate({ left: nextLeftVal }, options.crossSpeed);
				    nextList.show().addClass('fg-menu-current').attr('aria-expanded', 'true');

				    var setPrevMenu = function (backlink) {
				        var b = backlink;
				        var c = $('.fg-menu-current');
				        var prevList = c.parents('ul:eq(0)');
				        c.hide().attr('aria-expanded', 'false');
				        resetChildMenu(c);
				        checkMenuHeight(prevList);
				        prevList.addClass('fg-menu-current').attr('aria-expanded', 'true');
				        if (prevList.hasClass('fg-menu-content')) { b.remove(); footer.hide(); };
				    };

				    // initialize "back" link
				    if (options.backLink) {
				        if (footer.find('a').size() == 0) {
				            footer.show();
				            $('<a href="#"><span class="ui-icon ui-icon-triangle-1-w"></span> <span>Back</span></a>')
								.appendTo(footer)
								.click(function () { // ----- show the previous menu
								    var b = $(this);
								    var prevLeftVal = parseFloat(topList.css('left')) + container.width();
								    topList.animate({ left: prevLeftVal }, options.crossSpeed, function () {
								        setPrevMenu(b);
								    });
								    return false;
								});
				        }
				    }
				    // or initialize top breadcrumb
				    else {
				        if (breadcrumb.find('li').size() == 1) {
				            breadcrumb.empty().append(firstCrumb);
				            firstCrumb.find('a').click(function () {
				                menu.resetDrilldownMenu();
				                return false;
				            });
				        }
				        $('.fg-menu-current-crumb').removeClass('fg-menu-current-crumb');
				        var crumbText = $(this).find('span:eq(0)').text();
				        var newCrumb = $('<li class="fg-menu-current-crumb"><a href="javascript://" class="fg-menu-crumb">' + crumbText + '</a></li>');
				        newCrumb
							.appendTo(breadcrumb)
							.find('a').click(function () {
							    if ($(this).parent().is('.fg-menu-current-crumb')) {
							        menu.chooseItem(this);
							    }
							    else {
							        var newLeftVal = -($('.fg-menu-current').parents('ul').size() - 1) * 180;
							        topList.animate({ left: newLeftVal }, options.crossSpeed, function () {
							            setPrevMenu();
							        });

							        // make this the current crumb, delete all breadcrumbs after this one, and navigate to the relevant menu
							        $(this).parent().addClass('fg-menu-current-crumb').find('span').remove();
							        $(this).parent().nextAll().remove();
							    };
							    return false;
							});
				        newCrumb.prev().append(' <span class="ui-icon ' + options.nextCrumbLink + '"></span>');
				    };
				    return false;
				});
        }
        // if the link is a leaf node (doesn't open a child menu)
        else {
            $(this).click(function () {
                menu.chooseItem(this);
                return false;
            });
        };
    });
};


/* Menu.prototype.setPosition parameters (defaults noted with *):
referrer = the link (or other element) used to show the overlaid object 
settings = can override the defaults:
- posX/Y: where the top left corner of the object should be positioned in relation to its referrer.
X: left*, center, right
Y: top, center, bottom*
- offsetX/Y: the number of pixels to be offset from the x or y position.  Can be a positive or negative number.
- directionH/V: where the entire menu should appear in relation to its referrer.
Horizontal: left*, right
Vertical: up, down*
- detectH/V: detect the viewport horizontally / vertically
- linkToFront: copy the menu link and place it on top of the menu (visual effect to make it look like it overlaps the object) */

Menu.prototype.setPosition = function (widget, caller, options) {
    var el = widget;
    var referrer = caller;
    var dims = {
        refX: referrer.offset().left,
        refY: referrer.offset().top,
        refW: referrer.getTotalWidth(),
        refH: referrer.getTotalHeight()
    };
    var options = options;
    var xVal, yVal;

    var helper = $('<div class="positionHelper"></div>');
    helper.css({ position: 'fixed', left: dims.refX, bottom: 0, width: dims.refW, height: dims.refH });

    //// Unwrap the el -- We need to do this because, it was creating Nested Divs.
    if (el.parent().is('div[class="positionHelper"]')) {
        el.unwrap();
    }

    el.wrap(helper);

    //// Remove the Empty Divs from the page because, those are created using unwrap().
    $('div[class="positionHelper"]:empty').remove();

    // get X pos
    switch (options.positionOpts.posX) {
        case 'left': xVal = 0;
            break;
        case 'center': xVal = dims.refW / 2;
            break;
        case 'right': xVal = dims.refW;
            break;
    };

    // get Y pos
    switch (options.positionOpts.posY) {
        case 'top': yVal = 0;
            break;
        case 'center': yVal = dims.refH / 2;
            break;
        case 'bottom': yVal = dims.refH;
            break;
    };

    // add the offsets (zero by default)
    xVal += options.positionOpts.offsetX;
    yVal += options.positionOpts.offsetY;

    // position the object vertically
    if (options.positionOpts.directionV == 'up') {
        el.css({ top: 'auto', bottom: yVal });
        if (options.positionOpts.detectV && !fitVertical(el)) {
            el.css({ bottom: 'auto', top: yVal });
        }
    }
    else {
        el.css({ bottom: 'auto', top: yVal });
        if (options.positionOpts.detectV && !fitVertical(el)) {
            el.css({ top: 'auto', bottom: yVal });
        }
    };

    // and horizontally
    if (options.positionOpts.directionH == 'left') {
        el.css({ left: 'auto', right: xVal });
        if (options.positionOpts.detectH && !fitHorizontal(el)) {
            el.css({ right: 'auto', left: xVal });
        }
    }
    else {
        el.css({ right: 'auto', left: xVal });
        if (options.positionOpts.detectH && !fitHorizontal(el)) {
            el.css({ left: 'auto', right: xVal });
        }
    };

    // if specified, clone the referring element and position it so that it appears on top of the menu
    if (options.positionOpts.linkToFront) {
        referrer.clone().addClass('linkClone').css({
            position: 'absolute',
            top: 0,
            right: 'auto',
            bottom: 'auto',
            left: 0,
            width: referrer.width(),
            height: referrer.height()
        }).insertAfter(el);
    };
};


/* Utilities to sort and find viewport dimensions */

function sortBigToSmall(a, b) { return b - a; };

jQuery.fn.getTotalWidth = function () {
    return $(this).width() + parseInt($(this).css('paddingRight')) + parseInt($(this).css('paddingLeft')) + parseInt($(this).css('borderRightWidth')) + parseInt($(this).css('borderLeftWidth'));
};

jQuery.fn.getTotalHeight = function () {
    return $(this).height() + parseInt($(this).css('paddingTop')) + parseInt($(this).css('paddingBottom')) + parseInt($(this).css('borderTopWidth')) + parseInt($(this).css('borderBottomWidth'));
};

function getScrollTop() {
    return self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
};

function getScrollLeft() {
    return self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
};

function getWindowHeight() {
    var de = document.documentElement;
    return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
};

function getWindowWidth() {
    var de = document.documentElement;
    return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
};

/* Utilities to test whether an element will fit in the viewport
Parameters:
el = element to position, required
leftOffset / topOffset = optional parameter if the offset cannot be calculated (i.e., if the object is in the DOM but is set to display: 'none') */

function fitHorizontal(el, leftOffset) {
    var leftVal = parseInt(leftOffset) || $(el).offset().left;
    return (leftVal + $(el).parent().width() + $(el).width() <= getWindowWidth() + getScrollLeft() && leftVal - getScrollLeft() >= 0);
};

function fitVertical(el, topOffset) {
    var topVal = parseInt(topOffset) || $(el).offset().top;
    return (topVal + $(el).height() <= getWindowHeight() + getScrollTop() && topVal - getScrollTop() >= 0);
};

/*-------------------------------------------------------------------- 
* javascript method: "pxToEm"
* by:
Scott Jehl (scott@filamentgroup.com) 
Maggie Wachs (maggie@filamentgroup.com)
http://www.filamentgroup.com
*
* Copyright (c) 2008 Filament Group
* Dual licensed under the MIT (filamentgroup.com/examples/mit-license.txt) and GPL (filamentgroup.com/examples/gpl-license.txt) licenses.
*
* Description: Extends the native Number and String objects with pxToEm method. pxToEm converts a pixel value to ems depending on inherited font size.  
* Article: http://www.filamentgroup.com/lab/retaining_scalable_interfaces_with_pixel_to_em_conversion/
* Demo: http://www.filamentgroup.com/examples/pxToEm/	 	
*							
* Options:  	 								
scope: string or jQuery selector for font-size scoping
reverse: Boolean, true reverses the conversion to em-px
* Dependencies: jQuery library						  
* Usage Example: myPixelValue.pxToEm(); or myPixelValue.pxToEm({'scope':'#navigation', reverse: true});
*
* Version: 2.0, 08.01.2008 
* Changelog:
*		08.02.2007 initial Version 1.0
*		08.01.2008 - fixed font-size calculation for IE
--------------------------------------------------------------------*/

Number.prototype.pxToEm = String.prototype.pxToEm = function (settings) {
    //set defaults
    settings = jQuery.extend({
        scope: 'body',
        reverse: false
    }, settings);

    var pxVal = (this == '') ? 0 : parseFloat(this);
    var scopeVal;
    var getWindowWidth = function () {
        var de = document.documentElement;
        return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    };

    /* When a percentage-based font-size is set on the body, IE returns that percent of the window width as the font-size. 
    For example, if the body font-size is 62.5% and the window width is 1000px, IE will return 625px as the font-size. 	
    When this happens, we calculate the correct body font-size (%) and multiply it by 16 (the standard browser font size) 
    to get an accurate em value. */

    if (settings.scope == 'body' && $.browser.msie && (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(1) > 0.0) {
        var calcFontSize = function () {
            return (parseFloat($('body').css('font-size')) / getWindowWidth()).toFixed(3) * 16;
        };
        scopeVal = calcFontSize();
    }
    else { scopeVal = parseFloat(jQuery(settings.scope).css("font-size")); };

    var result = (settings.reverse == true) ? (pxVal * scopeVal).toFixed(2) + 'px' : (pxVal / scopeVal).toFixed(2) + 'em';
    return result;
};

/*!
* jQuery Form Plugin
* version: 2.43 (12-MAR-2010)
* @requires jQuery v1.3.2 or later
*
* Examples and documentation at: http://malsup.com/jquery/form/
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/
; (function ($) {

    /*
    Usage Note:
    -----------
    Do not use both ajaxSubmit and ajaxForm on the same form.  These
    functions are intended to be exclusive.  Use ajaxSubmit if you want
    to bind your own submit handler to the form.  For example,

    $(document).ready(function() {
    $('#myForm').bind('submit', function() {
    $(this).ajaxSubmit({
    target: '#output'
    });
    return false; // <-- important!
    });
    });

    Use ajaxForm when you want the plugin to manage all the event binding
    for you.  For example,

    $(document).ready(function() {
    $('#myForm').ajaxForm({
    target: '#output'
    });
    });

    When using ajaxForm, the ajaxSubmit function will be invoked for you
    at the appropriate time.
    */

    /**
    * ajaxSubmit() provides a mechanism for immediately submitting
    * an HTML form using AJAX.
    */
    $.fn.ajaxSubmit = function (options) {
        // fast fail if nothing selected (http://dev.jquery.com/ticket/2752)
        if (!this.length) {
            log('ajaxSubmit: skipping submit process - no element selected');
            return this;
        }

        if (typeof options == 'function')
            options = { success: options };

        var url = $.trim(this.attr('action'));
        if (url) {
            // clean url (don't include hash vaue)
            url = (url.match(/^([^#]+)/) || [])[1];
        }
        url = url || window.location.href || '';

        options = $.extend({
            url: url,
            type: this.attr('method') || 'GET',
            iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'
        }, options || {});

        // hook for manipulating the form data before it is extracted;
        // convenient for use with rich editors like tinyMCE or FCKEditor
        var veto = {};
        this.trigger('form-pre-serialize', [this, options, veto]);
        if (veto.veto) {
            log('ajaxSubmit: submit vetoed via form-pre-serialize trigger');
            return this;
        }

        // provide opportunity to alter form data before it is serialized
        if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
            log('ajaxSubmit: submit aborted via beforeSerialize callback');
            return this;
        }

        var a = this.formToArray(options.semantic);
        if (options.data) {
            options.extraData = options.data;
            for (var n in options.data) {
                if (options.data[n] instanceof Array) {
                    for (var k in options.data[n])
                        a.push({ name: n, value: options.data[n][k] });
                }
                else
                    a.push({ name: n, value: options.data[n] });
            }
        }

        // give pre-submit callback an opportunity to abort the submit
        if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
            log('ajaxSubmit: submit aborted via beforeSubmit callback');
            return this;
        }

        // fire vetoable 'validate' event
        this.trigger('form-submit-validate', [a, this, options, veto]);
        if (veto.veto) {
            log('ajaxSubmit: submit vetoed via form-submit-validate trigger');
            return this;
        }

        var q = $.param(a);

        if (options.type.toUpperCase() == 'GET') {
            options.url += (options.url.indexOf('?') >= 0 ? '&' : '?') + q;
            options.data = null;  // data is null for 'get'
        }
        else
            options.data = q; // data is the query string for 'post'

        var $form = this, callbacks = [];
        if (options.resetForm) callbacks.push(function () { $form.resetForm(); });
        if (options.clearForm) callbacks.push(function () { $form.clearForm(); });

        // perform a load on the target only if dataType is not provided
        if (!options.dataType && options.target) {
            var oldSuccess = options.success || function () { };
            callbacks.push(function (data) {
                var fn = options.replaceTarget ? 'replaceWith' : 'html';
                $(options.target)[fn](data).each(oldSuccess, arguments);
            });
        }
        else if (options.success)
            callbacks.push(options.success);

        options.success = function (data, status, xhr) { // jQuery 1.4+ passes xhr as 3rd arg
            for (var i = 0, max = callbacks.length; i < max; i++)
                callbacks[i].apply(options, [data, status, xhr || $form, $form]);
        };

        // are there files to upload?
        var files = $('input:file', this).fieldValue();
        var found = false;
        for (var j = 0; j < files.length; j++)
            if (files[j])
                found = true;

        var multipart = false;
        //	var mp = 'multipart/form-data';
        //	multipart = ($form.attr('enctype') == mp || $form.attr('encoding') == mp);

        // options.iframe allows user to force iframe mode
        // 06-NOV-09: now defaulting to iframe mode if file input is detected
        if ((files.length && options.iframe !== false) || options.iframe || found || multipart) {
            // hack to fix Safari hang (thanks to Tim Molendijk for this)
            // see:  http://groups.google.com/group/jquery-dev/browse_thread/thread/36395b7ab510dd5d
            if (options.closeKeepAlive)
                $.get(options.closeKeepAlive, fileUpload);
            else
                fileUpload();
        }
        else
            $.ajax(options);

        // fire 'notify' event
        this.trigger('form-submit-notify', [this, options]);
        return this;


        // private function for handling file uploads (hat tip to YAHOO!)
        function fileUpload() {
            var form = $form[0];

            if ($(':input[name=submit]', form).length) {
                alert('Error: Form elements must not be named "submit".');
                return;
            }

            var opts = $.extend({}, $.ajaxSettings, options);
            var s = $.extend(true, {}, $.extend(true, {}, $.ajaxSettings), opts);

            var id = 'jqFormIO' + (new Date().getTime());
            var $io = $('<iframe id="' + id + '" name="' + id + '" src="' + opts.iframeSrc + '" onload="(jQuery(this).data(\'form-plugin-onload\'))()" />');
            var io = $io[0];

            $io.css({ position: 'absolute', top: '-1000px', left: '-1000px' });

            var xhr = { // mock object
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: 'n/a',
                getAllResponseHeaders: function () { },
                getResponseHeader: function () { },
                setRequestHeader: function () { },
                abort: function () {
                    this.aborted = 1;
                    $io.attr('src', opts.iframeSrc); // abort op in progress
                }
            };

            var g = opts.global;
            // trigger ajax global events so that activity/block indicators work like normal
            if (g && !$.active++) $.event.trigger("ajaxStart");
            if (g) $.event.trigger("ajaxSend", [xhr, opts]);

            if (s.beforeSend && s.beforeSend(xhr, s) === false) {
                s.global && $.active--;
                return;
            }
            if (xhr.aborted)
                return;

            var cbInvoked = false;
            var timedOut = 0;

            // add submitting element to data if we know it
            var sub = form.clk;
            if (sub) {
                var n = sub.name;
                if (n && !sub.disabled) {
                    opts.extraData = opts.extraData || {};
                    opts.extraData[n] = sub.value;
                    if (sub.type == "image") {
                        opts.extraData[n + '.x'] = form.clk_x;
                        opts.extraData[n + '.y'] = form.clk_y;
                    }
                }
            }

            // take a breath so that pending repaints get some cpu time before the upload starts
            function doSubmit() {
                // make sure form attrs are set
                var t = $form.attr('target'), a = $form.attr('action');

                // update form attrs in IE friendly way
                form.setAttribute('target', id);
                if (form.getAttribute('method') != 'POST')
                    form.setAttribute('method', 'POST');
                if (form.getAttribute('action') != opts.url)
                    form.setAttribute('action', opts.url);

                // ie borks in some cases when setting encoding
                if (!opts.skipEncodingOverride) {
                    $form.attr({
                        encoding: 'multipart/form-data',
                        enctype: 'multipart/form-data'
                    });
                }

                // support timout
                if (opts.timeout)
                    setTimeout(function () { timedOut = true; cb(); }, opts.timeout);

                // add "extra" data to form if provided in options
                var extraInputs = [];
                try {
                    if (opts.extraData)
                        for (var n in opts.extraData)
                            extraInputs.push(
                                $('<input type="hidden" name="' + n + '" value="' + opts.extraData[n] + '" />')
                                    .appendTo(form)[0]);

                    // add iframe to doc and submit the form
                    $io.appendTo('body');
                    $io.data('form-plugin-onload', cb);
                    form.submit();
                }
                finally {
                    // reset attrs and remove "extra" input elements
                    form.setAttribute('action', a);
                    t ? form.setAttribute('target', t) : $form.removeAttr('target');
                    $(extraInputs).remove();
                }
            };

            if (opts.forceSync)
                doSubmit();
            else
                setTimeout(doSubmit, 10); // this lets dom updates render

            var domCheckCount = 100;

            function cb() {
                if (cbInvoked)
                    return;

                var ok = true;
                try {
                    if (timedOut) throw 'timeout';
                    // extract the server response from the iframe
                    var data, doc;

                    doc = io.contentWindow ? io.contentWindow.document : io.contentDocument ? io.contentDocument : io.document;

                    var isXml = opts.dataType == 'xml' || doc.XMLDocument || $.isXMLDoc(doc);
                    log('isXml=' + isXml);
                    if (!isXml && (doc.body == null || doc.body.innerHTML == '')) {
                        if (--domCheckCount) {
                            // in some browsers (Opera) the iframe DOM is not always traversable when
                            // the onload callback fires, so we loop a bit to accommodate
                            log('requeing onLoad callback, DOM not available');
                            setTimeout(cb, 250);
                            return;
                        }
                        log('Could not access iframe DOM after 100 tries.');
                        return;
                    }

                    log('response detected');
                    cbInvoked = true;
                    xhr.responseText = doc.body ? doc.body.innerHTML : null;
                    xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                    xhr.getResponseHeader = function (header) {
                        var headers = { 'content-type': opts.dataType };
                        return headers[header];
                    };

                    if (opts.dataType == 'json' || opts.dataType == 'script') {
                        // see if user embedded response in textarea
                        var ta = doc.getElementsByTagName('textarea')[0];
                        if (ta)
                            xhr.responseText = ta.value;
                        else {
                            // account for browsers injecting pre around json response
                            var pre = doc.getElementsByTagName('pre')[0];
                            if (pre)
                                xhr.responseText = pre.innerHTML;
                        }
                    }
                    else if (opts.dataType == 'xml' && !xhr.responseXML && xhr.responseText != null) {
                        xhr.responseXML = toXml(xhr.responseText);
                    }
                    data = $.httpData(xhr, opts.dataType);
                }
                catch (e) {
                    log('error caught:', e);
                    ok = false;
                    xhr.error = e;
                    $.handleError(opts, xhr, 'error', e);
                }

                // ordering of these callbacks/triggers is odd, but that's how $.ajax does it
                if (ok) {
                    opts.success(data, 'success');
                    if (g) $.event.trigger("ajaxSuccess", [xhr, opts]);
                }
                if (g) $.event.trigger("ajaxComplete", [xhr, opts]);
                if (g && ! --$.active) $.event.trigger("ajaxStop");
                if (opts.complete) opts.complete(xhr, ok ? 'success' : 'error');

                // clean up
                setTimeout(function () {
                    $io.removeData('form-plugin-onload');
                    $io.remove();
                    xhr.responseXML = null;
                }, 100);
            };

            function toXml(s, doc) {
                if (window.ActiveXObject) {
                    doc = new ActiveXObject('Microsoft.XMLDOM');
                    doc.async = 'false';
                    doc.loadXML(s);
                }
                else
                    doc = (new DOMParser()).parseFromString(s, 'text/xml');
                return (doc && doc.documentElement && doc.documentElement.tagName != 'parsererror') ? doc : null;
            };
        };
    };

    /**
    * ajaxForm() provides a mechanism for fully automating form submission.
    *
    * The advantages of using this method instead of ajaxSubmit() are:
    *
    * 1: This method will include coordinates for <input type="image" /> elements (if the element
    *	is used to submit the form).
    * 2. This method will include the submit element's name/value data (for the element that was
    *	used to submit the form).
    * 3. This method binds the submit() method to the form for you.
    *
    * The options argument for ajaxForm works exactly as it does for ajaxSubmit.  ajaxForm merely
    * passes the options argument along after properly binding events for submit elements and
    * the form itself.
    */
    $.fn.ajaxForm = function (options) {
        return this.ajaxFormUnbind().bind('submit.form-plugin', function (e) {
            e.preventDefault();
            $(this).ajaxSubmit(options);
        }).bind('click.form-plugin', function (e) {
            var target = e.target;
            var $el = $(target);
            if (!($el.is(":submit,input:image"))) {
                // is this a child element of the submit el?  (ex: a span within a button)
                var t = $el.closest(':submit');
                if (t.length == 0)
                    return;
                target = t[0];
            }
            var form = this;
            form.clk = target;
            if (target.type == 'image') {
                if (e.offsetX != undefined) {
                    form.clk_x = e.offsetX;
                    form.clk_y = e.offsetY;
                } else if (typeof $.fn.offset == 'function') { // try to use dimensions plugin
                    var offset = $el.offset();
                    form.clk_x = e.pageX - offset.left;
                    form.clk_y = e.pageY - offset.top;
                } else {
                    form.clk_x = e.pageX - target.offsetLeft;
                    form.clk_y = e.pageY - target.offsetTop;
                }
            }
            // clear form vars
            setTimeout(function () { form.clk = form.clk_x = form.clk_y = null; }, 100);
        });
    };

    // ajaxFormUnbind unbinds the event handlers that were bound by ajaxForm
    $.fn.ajaxFormUnbind = function () {
        return this.unbind('submit.form-plugin click.form-plugin');
    };

    /**
    * formToArray() gathers form element data into an array of objects that can
    * be passed to any of the following ajax functions: $.get, $.post, or load.
    * Each object in the array has both a 'name' and 'value' property.  An example of
    * an array for a simple login form might be:
    *
    * [ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
    *
    * It is this array that is passed to pre-submit callback functions provided to the
    * ajaxSubmit() and ajaxForm() methods.
    */
    $.fn.formToArray = function (semantic) {
        var a = [];
        if (this.length == 0) return a;

        var form = this[0];
        var els = semantic ? form.getElementsByTagName('*') : form.elements;
        if (!els) return a;
        for (var i = 0, max = els.length; i < max; i++) {
            var el = els[i];
            var n = el.name;
            if (!n) continue;

            if (semantic && form.clk && el.type == "image") {
                // handle image inputs on the fly when semantic == true
                if (!el.disabled && form.clk == el) {
                    a.push({ name: n, value: $(el).val() });
                    a.push({ name: n + '.x', value: form.clk_x }, { name: n + '.y', value: form.clk_y });
                }
                continue;
            }

            var v = $.fieldValue(el, true);
            if (v && v.constructor == Array) {
                for (var j = 0, jmax = v.length; j < jmax; j++)
                    a.push({ name: n, value: v[j] });
            }
            else if (v !== null && typeof v != 'undefined')
                a.push({ name: n, value: v });
        }

        if (!semantic && form.clk) {
            // input type=='image' are not found in elements array! handle it here
            var $input = $(form.clk), input = $input[0], n = input.name;
            if (n && !input.disabled && input.type == 'image') {
                a.push({ name: n, value: $input.val() });
                a.push({ name: n + '.x', value: form.clk_x }, { name: n + '.y', value: form.clk_y });
            }
        }
        return a;
    };

    /**
    * Serializes form data into a 'submittable' string. This method will return a string
    * in the format: name1=value1&amp;name2=value2
    */
    $.fn.formSerialize = function (semantic) {
        //hand off to jQuery.param for proper encoding
        return $.param(this.formToArray(semantic));
    };

    /**
    * Serializes all field elements in the jQuery object into a query string.
    * This method will return a string in the format: name1=value1&amp;name2=value2
    */
    $.fn.fieldSerialize = function (successful) {
        var a = [];
        this.each(function () {
            var n = this.name;
            if (!n) return;
            var v = $.fieldValue(this, successful);
            if (v && v.constructor == Array) {
                for (var i = 0, max = v.length; i < max; i++)
                    a.push({ name: n, value: v[i] });
            }
            else if (v !== null && typeof v != 'undefined')
                a.push({ name: this.name, value: v });
        });
        //hand off to jQuery.param for proper encoding
        return $.param(a);
    };

    /**
    * Returns the value(s) of the element in the matched set.  For example, consider the following form:
    *
    *  <form><fieldset>
    *	  <input name="A" type="text" />
    *	  <input name="A" type="text" />
    *	  <input name="B" type="checkbox" value="B1" />
    *	  <input name="B" type="checkbox" value="B2"/>
    *	  <input name="C" type="radio" value="C1" />
    *	  <input name="C" type="radio" value="C2" />
    *  </fieldset></form>
    *
    *  var v = $(':text').fieldValue();
    *  // if no values are entered into the text inputs
    *  v == ['','']
    *  // if values entered into the text inputs are 'foo' and 'bar'
    *  v == ['foo','bar']
    *
    *  var v = $(':checkbox').fieldValue();
    *  // if neither checkbox is checked
    *  v === undefined
    *  // if both checkboxes are checked
    *  v == ['B1', 'B2']
    *
    *  var v = $(':radio').fieldValue();
    *  // if neither radio is checked
    *  v === undefined
    *  // if first radio is checked
    *  v == ['C1']
    *
    * The successful argument controls whether or not the field element must be 'successful'
    * (per http://www.w3.org/TR/html4/interact/forms.html#successful-controls).
    * The default value of the successful argument is true.  If this value is false the value(s)
    * for each element is returned.
    *
    * Note: This method *always* returns an array.  If no valid value can be determined the
    *	   array will be empty, otherwise it will contain one or more values.
    */
    $.fn.fieldValue = function (successful) {
        for (var val = [], i = 0, max = this.length; i < max; i++) {
            var el = this[i];
            var v = $.fieldValue(el, successful);
            if (v === null || typeof v == 'undefined' || (v.constructor == Array && !v.length))
                continue;
            v.constructor == Array ? $.merge(val, v) : val.push(v);
        }
        return val;
    };

    /**
    * Returns the value of the field element.
    */
    $.fieldValue = function (el, successful) {
        var n = el.name, t = el.type, tag = el.tagName.toLowerCase();
        if (typeof successful == 'undefined') successful = true;

        if (successful && (!n || el.disabled || t == 'reset' || t == 'button' ||
		(t == 'checkbox' || t == 'radio') && !el.checked ||
		(t == 'submit' || t == 'image') && el.form && el.form.clk != el ||
		tag == 'select' && el.selectedIndex == -1))
            return null;

        if (tag == 'select') {
            var index = el.selectedIndex;
            if (index < 0) return null;
            var a = [], ops = el.options;
            var one = (t == 'select-one');
            var max = (one ? index + 1 : ops.length);
            for (var i = (one ? index : 0); i < max; i++) {
                var op = ops[i];
                if (op.selected) {
                    var v = op.value;
                    if (!v) // extra pain for IE...
                        v = (op.attributes && op.attributes['value'] && !(op.attributes['value'].specified)) ? op.text : op.value;
                    if (one) return v;
                    a.push(v);
                }
            }
            return a;
        }
        return el.value;
    };

    /**
    * Clears the form data.  Takes the following actions on the form's input fields:
    *  - input text fields will have their 'value' property set to the empty string
    *  - select elements will have their 'selectedIndex' property set to -1
    *  - checkbox and radio inputs will have their 'checked' property set to false
    *  - inputs of type submit, button, reset, and hidden will *not* be effected
    *  - button elements will *not* be effected
    */
    $.fn.clearForm = function () {
        return this.each(function () {
            $('input,select,textarea', this).clearFields();
        });
    };

    /**
    * Clears the selected form elements.
    */
    $.fn.clearFields = $.fn.clearInputs = function () {
        return this.each(function () {
            var t = this.type, tag = this.tagName.toLowerCase();
            if (t == 'text' || t == 'password' || tag == 'textarea')
                this.value = '';
            else if (t == 'checkbox' || t == 'radio')
                this.checked = false;
            else if (tag == 'select')
                this.selectedIndex = -1;
        });
    };

    /**
    * Resets the form data.  Causes all form elements to be reset to their original value.
    */
    $.fn.resetForm = function () {
        return this.each(function () {
            // guard against an input with the name of 'reset'
            // note that IE reports the reset function as an 'object'
            if (typeof this.reset == 'function' || (typeof this.reset == 'object' && !this.reset.nodeType))
                this.reset();
        });
    };

    /**
    * Enables or disables any matching elements.
    */
    $.fn.enable = function (b) {
        if (b == undefined) b = true;
        return this.each(function () {
            this.disabled = !b;
        });
    };

    /**
    * Checks/unchecks any matching checkboxes or radio buttons and
    * selects/deselects and matching option elements.
    */
    $.fn.selected = function (select) {
        if (select == undefined) select = true;
        return this.each(function () {
            var t = this.type;
            if (t == 'checkbox' || t == 'radio')
                this.checked = select;
            else if (this.tagName.toLowerCase() == 'option') {
                var $sel = $(this).parent('select');
                if (select && $sel[0] && $sel[0].type == 'select-one') {
                    // deselect all other options
                    $sel.find('option').selected(false);
                }
                this.selected = select;
            }
        });
    };

    // helper fn for console logging
    // set $.fn.ajaxSubmit.debug to true to enable debug logging
    function log() {
        if ($.fn.ajaxSubmit.debug) {
            var msg = '[jquery.form] ' + Array.prototype.join.call(arguments, '');
            if (window.console && window.console.log)
                window.console.log(msg);
            else if (window.opera && window.opera.postError)
                window.opera.postError(msg);
        }
    };

})(jQuery);


/*
* jQuery history plugin
*
* Copyright (c) 2006 Taku Sano (Mikage Sawatari)
* Licensed under the MIT License:
*   http://www.opensource.org/licenses/mit-license.php
*
* Modified by Lincoln Cooper to add Safari support and only call the callback once during initialization
* for msie when no initial hash supplied.
* API rewrite by Lauris Buk�is-Haberkorns
*/

(function ($) {

    function History() {
        this._curHash = '';
        this._callback = function (hash) { };
    };

    $.extend(History.prototype, {

        init: function (callback) {
            this._callback = callback;
            this._curHash = location.hash;

            if ($.browser.msie) {
                // To stop the callback firing twice during initilization if no hash present
                if (this._curHash == '') {
                    this._curHash = '#';
                }

                // add hidden iframe for IE
                $("body").prepend('<iframe id="jQuery_history" style="display: none;"></iframe>');
                var iframe = $("#jQuery_history")[0].contentWindow.document;
                iframe.open();
                iframe.close();
                iframe.location.hash = this._curHash;
            }
            else if ($.browser.safari) {
                // etablish back/forward stacks
                this._historyBackStack = [];
                this._historyBackStack.length = history.length;
                this._historyForwardStack = [];
                this._isFirst = true;
                this._dontCheck = false;
            }
            this._callback(this._curHash.replace(/^#/, ''));
            setInterval(this._check, 100);
        },

        add: function (hash) {
            // This makes the looping function do something
            this._historyBackStack.push(hash);

            this._historyForwardStack.length = 0; // clear forwardStack (true click occured)
            this._isFirst = true;
        },

        _check: function () {
            if ($.browser.msie) {
                // On IE, check for location.hash of iframe
                var ihistory = $("#jQuery_history")[0];
                var iframe = ihistory.contentDocument || ihistory.contentWindow.document;
                var current_hash = iframe.location.hash;
                if (current_hash != $.history._curHash) {

                    location.hash = current_hash;
                    $.history._curHash = current_hash;
                    $.history._callback(current_hash.replace(/^#/, ''));

                }
            } else if ($.browser.safari) {
                if (!$.history._dontCheck) {
                    var historyDelta = history.length - $.history._historyBackStack.length;

                    if (historyDelta) { // back or forward button has been pushed
                        $.history._isFirst = false;
                        if (historyDelta < 0) { // back button has been pushed
                            // move items to forward stack
                            for (var i = 0; i < Math.abs(historyDelta); i++) $.history._historyForwardStack.unshift($.history._historyBackStack.pop());
                        } else { // forward button has been pushed
                            // move items to back stack
                            for (var i = 0; i < historyDelta; i++) $.history._historyBackStack.push($.history._historyForwardStack.shift());
                        }
                        var cachedHash = $.history._historyBackStack[$.history._historyBackStack.length - 1];
                        if (cachedHash != undefined) {
                            $.history._curHash = location.hash;
                            $.history._callback(cachedHash);
                        }
                    } else if ($.history._historyBackStack[$.history._historyBackStack.length - 1] == undefined && !$.history._isFirst) {
                        // back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
                        // document.URL doesn't change in Safari
                        if (document.URL.indexOf('#') >= 0) {
                            $.history._callback(document.URL.split('#')[1]);
                        } else {
                            $.history._callback('');
                        }
                        $.history._isFirst = true;
                    }
                }
            } else {
                // otherwise, check for location.hash
                var current_hash = location.hash;
                if (current_hash != $.history._curHash) {
                    $.history._curHash = current_hash;
                    $.history._callback(current_hash.replace(/^#/, ''));
                }
            }
        },

        load: function (hash) {
            var newhash;

            if ($.browser.safari) {
                newhash = hash;
            } else {
                newhash = '#' + hash;
                location.hash = newhash;
            }
            this._curHash = newhash;

            if ($.browser.msie) {
                var ihistory = $("#jQuery_history")[0]; // TODO: need contentDocument?
                var iframe = ihistory.contentWindow.document;
                iframe.open();
                iframe.close();
                iframe.location.hash = newhash;
                this._callback(hash);
            }
            else if ($.browser.safari) {
                this._dontCheck = true;
                // Manually keep track of the history values for Safari
                this.add(hash);

                // Wait a while before allowing checking so that Safari has time to update the "history" object
                // correctly (otherwise the check loop would detect a false change in hash).
                var fn = function () { $.history._dontCheck = false; };
                window.setTimeout(fn, 200);
                this._callback(hash);
                // N.B. "location.hash=" must be the last line of code for Safari as execution stops afterwards.
                //      By explicitly using the "location.hash" command (instead of using a variable set to "location.hash") the
                //      URL in the browser and the "history" object are both updated correctly.
                location.hash = newhash;
            }
            else {
                this._callback(hash);
            }
        }
    });

    $(document).ready(function () {
        $.history = new History(); // singleton instance
    });

})(jQuery);


/*
* jQuery jclock - Clock plugin - v 1.2.0
* http://plugins.jquery.com/project/jclock
*
* Copyright (c) 2007-2008 Doug Sparling <http://www.dougsparling.com>
* Licensed under the MIT License:
*   http://www.opensource.org/licenses/mit-license.php
*/
(function ($) {

    $.fn.jclock = function (options) {
        var version = '1.2.0';

        // options
        var opts = $.extend({}, $.fn.jclock.defaults, options);

        return this.each(function () {
            $this = $(this);
            $this.timerID = null;
            $this.running = false;
            $this.serverTime = REISys.Platform.ServerTime;
            $this.timeZonetoDisplay = "";
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
            $this.timeNotation = o.timeNotation;
            $this.am_pm = o.am_pm;
            $this.utc = o.utc;
            $this.utc_offset = o.utc_offset;
            $this.css({
                fontFamily: o.fontFamily,
                fontSize: o.fontSize,
                backgroundColor: o.background,
                color: o.foreground
            });

            $.fn.jclock.startClock($this);

        });
    };


    $.fn.jclock.startClock = function (el) {
        $.fn.jclock.getAbbTimeZone(el);
        $.fn.jclock.stopClock(el);
        $.fn.jclock.displayTime(el);
    }

    $.fn.jclock.getAbbTimeZone = function (el) {
        var standardTimeZoneWords = null;
        //     var standardTimeZone = $(REISys.Platform.ServerTime.toString().split('('));    
        //     if (standardTimeZone.length > 1)
        //standardTimeZoneWords = REISys.Platform.ServerTimeZone.split(' ');
        //    if (standardTimeZoneWords != null && standardTimeZoneWords.length > 0 )                   
        //el.timeZonetoDisplay = standardTimeZoneWords[0].substring(0, 1) + standardTimeZoneWords[standardTimeZoneWords.length - 1].substring(0, 1);

    }

    $.fn.jclock.stopClock = function (el) {
        if (el.running) {
            clearTimeout(el.timerID);
        }
        el.running = false;
    }
    $.fn.jclock.displayTime = function (el) {
        var time = $.fn.jclock.getDate(el) + " " + $.fn.jclock.getTime(el) + " " + el.timeZonetoDisplay
        el.html(time);
       // el.timerID = setTimeout(function () { $.fn.jclock.displayTime(el) }, 1000);
    }
    $.fn.jclock.getTime = function (el) {
        var now = new Date(el.serverTime);
        el.serverTime = now.setSeconds(now.getSeconds() + 1);
        var hours, minutes, seconds;
        hours = now.getHours();
        minutes = now.getMinutes();
        seconds = now.getSeconds();
        $.fn.jclock.setServerClock(el);
        var am_pm_text = '';
        (hours >= 12) ? am_pm_text = " P.M." : am_pm_text = " A.M.";

        if ((el.am_pm == true) && (hours == 0))
            hours = 12;

        if (el.timeNotation == '12h') {
            hours = ((hours > 12) ? hours - 12 : hours);
        } else if (el.timeNotation == '12hh') {
            hours = ((hours > 12) ? hours - 12 : hours);

            hours = ((hours < 10) ? "0" : "") + hours;

        } else {
            hours = ((hours < 10) ? "0" : "") + hours;
        }

        minutes = ((minutes < 10) ? "0" : "") + minutes;
        seconds = ((seconds < 10) ? "0" : "") + seconds;

        var timeNow = hours + ":" + minutes + ":" + seconds;
        if ((el.timeNotation == '12h' || el.timeNotation == '12hh') && (el.am_pm == true)) {
            timeNow += am_pm_text;
        }
        return timeNow;
    };
    $.fn.jclock.setServerClock = function (el) {
    }
    // plugin defaults
    $.fn.jclock.defaults = {
        timeNotation: '12hh',
        am_pm: true,
        utc: false,
        est: false,
        cst: true,
        fontFamily: '',
        fontSize: '',
        foreground: '',
        background: '',
        utc_offset: 0
    };

    // Below function is added in Jquery plugin to accmodate Date
    $.fn.jclock.getDate = function (el) {
        var d_names = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

        var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September",
"October", "November", "December");

        var d = new Date();
        var curr_day = d.getDay();
        var curr_date = d.getDate();
        var sup = "";
        if (curr_date == 1 || curr_date == 21 || curr_date == 31) {
            sup = "st";
        }
        else if (curr_date == 2 || curr_date == 22) {
            sup = "nd";
        }
        else if (curr_date == 3 || curr_date == 23) {
            sup = "rd";
        }
        else {
            sup = "th";
        }
        var curr_month = d.getMonth();
        var curr_year = d.getFullYear();
        return d_names[curr_day] + " " + curr_date + "<SUP>" + sup + "</SUP> " + m_names[curr_month] + " " + curr_year;
    }
})(jQuery);

/**
* jQuery.query - Query String Modification and Creation for jQuery
* Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
* Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
* Date: 2009/8/13
*
* @author Blair Mitchelmore
* @version 2.1.7
*
**/
new function (settings) {
    // Various Settings
    var $separator = settings.separator || '&';
    var $spaces = settings.spaces === false ? false : true;
    var $suffix = settings.suffix === false ? '' : '[]';
    var $prefix = settings.prefix === false ? false : true;
    var $hash = $prefix ? settings.hash === true ? "#" : "?" : "";
    var $numbers = settings.numbers === false ? false : true;

    jQuery.query = new function () {
        var is = function (o, t) {
            return o != undefined && o !== null && (!!t ? o.constructor == t : true);
        };
        var parse = function (path) {
            var m, rx = /\[([^[]*)\]/g, match = /^([^[]+)(\[.*\])?$/.exec(path), base = match[1], tokens = [];
            while (m = rx.exec(match[2])) tokens.push(m[1]);
            return [base, tokens];
        };
        var set = function (target, tokens, value) {
            var o, token = tokens.shift();
            if (typeof target != 'object') target = null;
            if (token === "") {
                if (!target) target = [];
                if (is(target, Array)) {
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                } else if (is(target, Object)) {
                    var i = 0;
                    while (target[i++] != null);
                    target[--i] = tokens.length == 0 ? value : set(target[i], tokens.slice(0), value);
                } else {
                    target = [];
                    target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
                }
            } else if (token && token.match(/^\s*[0-9]+\s*$/)) {
                var index = parseInt(token, 10);
                if (!target) target = [];
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else if (token) {
                var index = token.replace(/^\s*|\s*$/g, "");
                if (!target) target = {};
                if (is(target, Array)) {
                    var temp = {};
                    for (var i = 0; i < target.length; ++i) {
                        temp[i] = target[i];
                    }
                    target = temp;
                }
                target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
            } else {
                return value;
            }
            return target;
        };

        var queryObject = function (a) {
            var self = this;
            self.keys = {};

            if (a.queryObject) {
                jQuery.each(a.get(), function (key, val) {
                    self.SET(key, val);
                });
            } else {
                jQuery.each(arguments, function () {
                    var q = "" + this;
                    q = q.replace(/^[?#]/, ''); // remove any leading ? || #
                    q = q.replace(/[;&]$/, ''); // remove any trailing & || ;
                    if ($spaces) q = q.replace(/[+]/g, ' '); // replace +'s with spaces

                    jQuery.each(q.split(/[&;]/), function () {
                        var key = decodeURIComponent(this.split('=')[0] || "");
                        var val = decodeURIComponent(this.split('=')[1] || "");

                        if (!key) return;

                        if ($numbers) {
                            if (/^[+-]?[0-9]+\.[0-9]*$/.test(val)) // simple float regex
                                val = parseFloat(val);
                            else if (/^[+-]?[0-9]+$/.test(val)) // simple int regex
                                val = parseInt(val, 10);
                        }

                        val = (!val && val !== 0) ? true : val;

                        if (val !== false && val !== true && typeof val != 'number')
                            val = val;

                        self.SET(key, val);
                    });
                });
            }
            return self;
        };

        queryObject.prototype = {
            queryObject: true,
            has: function (key, type) {
                var value = this.get(key);
                return is(value, type);
            },
            GET: function (key) {
                if (!is(key)) return this.keys;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                while (target != null && tokens.length != 0) {
                    target = target[tokens.shift()];
                }
                return typeof target == 'number' ? target : target || "";
            },
            get: function (key) {
                var target = this.GET(key);
                if (is(target, Object))
                    return jQuery.extend(true, {}, target);
                else if (is(target, Array))
                    return target.slice(0);
                return target;
            },
            SET: function (key, val) {
                var value = !is(val) ? null : val;
                var parsed = parse(key), base = parsed[0], tokens = parsed[1];
                var target = this.keys[base];
                this.keys[base] = set(target, tokens.slice(0), value);
                return this;
            },
            set: function (key, val) {
                return this.copy().SET(key, val);
            },
            REMOVE: function (key) {
                return this.SET(key, null).COMPACT();
            },
            remove: function (key) {
                return this.copy().REMOVE(key);
            },
            EMPTY: function () {
                var self = this;
                jQuery.each(self.keys, function (key, value) {
                    delete self.keys[key];
                });
                return self;
            },
            load: function (url) {
                var hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
                var search = url.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
                return new queryObject(url.length == search.length ? '' : search, url.length == hash.length ? '' : hash);
            },
            empty: function () {
                return this.copy().EMPTY();
            },
            copy: function () {
                return new queryObject(this);
            },
            COMPACT: function () {
                function build(orig) {
                    var obj = typeof orig == "object" ? is(orig, Array) ? [] : {} : orig;
                    if (typeof orig == 'object') {
                        function add(o, key, value) {
                            if (is(o, Array))
                                o.push(value);
                            else
                                o[key] = value;
                        }
                        jQuery.each(orig, function (key, value) {
                            if (!is(value)) return true;
                            add(obj, key, build(value));
                        });
                    }
                    return obj;
                }
                this.keys = build(this.keys);
                return this;
            },
            compact: function () {
                return this.copy().COMPACT();
            },
            toString: function () {
                var i = 0, queryString = [], chunks = [], self = this;
                var encode = function (str) {
                    str = str + "";
                    if ($spaces) str = str.replace(/ /g, "+");
                    return encodeURIComponent(str);
                };
                var addFields = function (arr, key, value) {
                    if (!is(value) || value === false) return;
                    var o = [encode(key)];
                    if (value !== true) {
                        o.push("=");
                        o.push(encode(value));
                    }
                    arr.push(o.join(""));
                };
                var build = function (obj, base) {
                    var newKey = function (key) {
                        return !base || base == "" ? [key].join("") : [base, "[", key, "]"].join("");
                    };
                    jQuery.each(obj, function (key, value) {
                        if (typeof value == 'object')
                            build(value, newKey(key));
                        else
                            addFields(chunks, newKey(key), value);
                    });
                };

                build(this.keys);

                if (chunks.length > 0) queryString.push($hash);
                queryString.push(chunks.join($separator));

                return queryString.join("");
            }
        };

        return new queryObject(location.search, location.hash);
    };
} (jQuery.query || {}); // Pass in jQuery.query as settings object


/*
* jQuery showLoading plugin v1.0
* 
* Copyright (c) 2009 Jim Keller
* Context - http://www.contextllc.com
* 
* Dual licensed under the MIT and GPL licenses.
*
*/

jQuery.fn.showLoading = function (options) {

    var indicatorID;
    var settings = {
        'addClass': '',
        'beforeShow': '',
        'afterShow': '',
        'hPos': 'center',
        'vPos': 'center',
        'indicatorZIndex': 5001,
        'overlayZIndex': 5000,
        'parent': '',
        'marginTop': 0,
        'marginLeft': 0,
        'overlayWidth': null,
        'overlayHeight': null
    };

    jQuery.extend(settings, options);

    var loadingDiv = jQuery('<div></div>');
    var overlayDiv = jQuery('<div></div>');

    //
    // Set up ID and classes
    //
    if (settings.indicatorID) {
        indicatorID = settings.indicatorID;
    }
    else {
        indicatorID = jQuery(this).attr('id');
    }

    jQuery(loadingDiv).attr('id', 'loading-indicator-' + indicatorID);
    jQuery(loadingDiv).addClass('loading-indicator');

    if (settings.addClass) {
        jQuery(loadingDiv).addClass(settings.addClass);
    }



    //
    // Create the overlay
    //
    jQuery(overlayDiv).css('display', 'none');

    // Append to body, otherwise position() doesn't work on Webkit-based browsers
    jQuery(document.body).append(overlayDiv);

    //
    // Set overlay classes
    //
    jQuery(overlayDiv).attr('id', 'loading-indicator-' + indicatorID + '-overlay');

    jQuery(overlayDiv).addClass('loading-indicator-overlay');

    if (settings.addClass) {
        jQuery(overlayDiv).addClass(settings.addClass + '-overlay');
    }

    //
    // Set overlay position
    //

    var overlay_width;
    var overlay_height;

    var border_top_width = jQuery(this).css('border-top-width');
    var border_left_width = jQuery(this).css('border-left-width');

    //
    // IE will return values like 'medium' as the default border, 
    // but we need a number
    //
    border_top_width = isNaN(parseInt(border_top_width)) ? 0 : border_top_width;
    border_left_width = isNaN(parseInt(border_left_width)) ? 0 : border_left_width;
    alert(border_left_width);
    var overlay_left_pos = jQuery(this).offset().left + parseInt(border_left_width);
    alert(overlay_left_pos);
    var overlay_top_pos = jQuery(this).offset().top + parseInt(border_top_width);

    if (settings.overlayWidth !== null) {
        overlay_width = settings.overlayWidth;
    }
    else {
        overlay_width = parseInt(jQuery(this).width()) + parseInt(jQuery(this).css('padding-right')) + parseInt(jQuery(this).css('padding-left'));
    }

    if (settings.overlayHeight !== null) {
        overlay_height = settings.overlayWidth;
    }
    else {
        overlay_height = parseInt(jQuery(this).height()) + parseInt(jQuery(this).css('padding-top')) + parseInt(jQuery(this).css('padding-bottom'));
    }


    jQuery(overlayDiv).css('width', overlay_width.toString() + 'px');
    jQuery(overlayDiv).css('height', overlay_height.toString() + 'px');

    jQuery(overlayDiv).css('left', overlay_left_pos.toString() + 'px');
    jQuery(overlayDiv).css('position', 'absolute');

    jQuery(overlayDiv).css('top', overlay_top_pos.toString() + 'px');
    jQuery(overlayDiv).css('z-index', settings.overlayZIndex);

    //
    // Set any custom overlay CSS		
    //
    if (settings.overlayCSS) {
        jQuery(overlayDiv).css(settings.overlayCSS);
    }


    //
    // We have to append the element to the body first
    // or .width() won't work in Webkit-based browsers (e.g. Chrome, Safari)
    //
    jQuery(loadingDiv).css('display', 'none');
    jQuery(document.body).append(loadingDiv);

    jQuery(loadingDiv).css('position', 'absolute');
    jQuery(loadingDiv).css('z-index', settings.indicatorZIndex);

    //
    // Set top margin
    //

    var indicatorTop = overlay_top_pos;

    if (settings.marginTop) {
        indicatorTop += parseInt(settings.marginTop);
    }

    var indicatorLeft = overlay_left_pos;

    if (settings.marginLeft) {
        indicatorLeft += parseInt(settings.marginTop);
    }


    //
    // set horizontal position
    //
    if (settings.hPos.toString().toLowerCase() == 'center') {
        jQuery(loadingDiv).css('left', (indicatorLeft + ((jQuery(overlayDiv).width() - parseInt(jQuery(loadingDiv).width())) / 2)).toString() + 'px');
    }
    else if (settings.hPos.toString().toLowerCase() == 'left') {
        jQuery(loadingDiv).css('left', (indicatorLeft + parseInt(jQuery(overlayDiv).css('margin-left'))).toString() + 'px');
    }
    else if (settings.hPos.toString().toLowerCase() == 'right') {
        jQuery(loadingDiv).css('left', (indicatorLeft + (jQuery(overlayDiv).width() - parseInt(jQuery(loadingDiv).width()))).toString() + 'px');
    }
    else {
        jQuery(loadingDiv).css('left', (indicatorLeft + parseInt(settings.hPos)).toString() + 'px');
    }

    //
    // set vertical position
    //
    if (settings.vPos.toString().toLowerCase() == 'center') {
        jQuery(loadingDiv).css('top', (indicatorTop + ((jQuery(overlayDiv).height() - parseInt(jQuery(loadingDiv).height())) / 2)).toString() + 'px');
    }
    else if (settings.vPos.toString().toLowerCase() == 'top') {
        jQuery(loadingDiv).css('top', indicatorTop.toString() + 'px');
    }
    else if (settings.vPos.toString().toLowerCase() == 'bottom') {
        jQuery(loadingDiv).css('top', (indicatorTop + (jQuery(overlayDiv).height() - parseInt(jQuery(loadingDiv).height()))).toString() + 'px');
    }
    else {
        jQuery(loadingDiv).css('top', (indicatorTop + parseInt(settings.vPos)).toString() + 'px');
    }




    //
    // Set any custom css for loading indicator
    //
    if (settings.css) {
        jQuery(loadingDiv).css(settings.css);
    }


    //
    // Set up callback options
    //
    var callback_options =
			{
			    'overlay': overlayDiv,
			    'indicator': loadingDiv,
			    'element': this
			};

    //
    // beforeShow callback
    //
    if (typeof (settings.beforeShow) == 'function') {
        settings.beforeShow(callback_options);
    }

    //
    // Show the overlay
    //
    jQuery(overlayDiv).show();

    //
    // Show the loading indicator
    //
    jQuery(loadingDiv).show();

    //
    // afterShow callback
    //
    if (typeof (settings.afterShow) == 'function') {
        settings.afterShow(callback_options);
    }

    return this;
};


jQuery.fn.hideLoading = function (options) {


    var settings = {};

    jQuery.extend(settings, options);

    if (settings.indicatorID) {
        indicatorID = settings.indicatorID;
    }
    else {
        indicatorID = jQuery(this).attr('id');
    }

    jQuery(document.body).find('#loading-indicator-' + indicatorID).remove();
    jQuery(document.body).find('#loading-indicator-' + indicatorID + '-overlay').remove();

    return this;
};


/*
* jQuery Tools 1.2.3 - The missing UI library for the Web
* 
* [tabs, tabs.slideshow, tooltip, tooltip.slide, tooltip.dynamic, scrollable, scrollable.autoscroll, scrollable.navigator, overlay, overlay.apple, dateinput, rangeinput, validator, toolbox.flashembed, toolbox.history, toolbox.expose, toolbox.mousewheel]
* 
* NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
* 
* http://flowplayer.org/tools/
* 
* jquery.event.wheel.js - rev 1 
* Copyright (c) 2008, Three Dub Media (http://threedubmedia.com)
* Liscensed under the MIT License (MIT-LICENSE.txt)
* http://www.opensource.org/licenses/mit-license.php
* Created: 2008-07-01 | Updated: 2008-07-14
* 
* -----
* 
* File generated: Sat Jul 03 09:07:16 GMT 2010
*/
(function (c) {
    function p(e, b, a) {
        var d = this, l = e.add(this), h = e.find(a.tabs), i = b.jquery ? b : e.children(b), j; h.length || (h = e.children()); i.length || (i = e.parent().find(b)); i.length || (i = c(b)); c.extend(this, {
            click: function (f, g) {
                var k = h.eq(f); if (typeof f == "string" && f.replace("#", "")) { k = h.filter("[href*=" + f.replace("#", "") + "]"); f = Math.max(h.index(k), 0) } if (a.rotate) { var n = h.length - 1; if (f < 0) return d.click(n, g); if (f > n) return d.click(0, g) } if (!k.length) { if (j >= 0) return d; f = a.initialIndex; k = h.eq(f) } if (f === j) return d;
                g = g || c.Event(); g.type = "onBeforeClick"; l.trigger(g, [f]); if (!g.isDefaultPrevented()) { o[a.effect].call(d, f, function () { g.type = "onClick"; l.trigger(g, [f]) }); j = f; h.removeClass(a.current); k.addClass(a.current); return d }
            }, getConf: function () { return a }, getTabs: function () { return h }, getPanes: function () { return i }, getCurrentPane: function () { return i.eq(j) }, getCurrentTab: function () { return h.eq(j) }, getIndex: function () { return j }, next: function () { return d.click(j + 1) }, prev: function () { return d.click(j - 1) }, destroy: function () {
                h.unbind(a.event).removeClass(a.current);
                i.find("a[href^=#]").unbind("click.T"); return d
            }
        }); c.each("onBeforeClick,onClick".split(","), function (f, g) { c.isFunction(a[g]) && c(d).bind(g, a[g]); d[g] = function (k) { c(d).bind(g, k); return d } }); if (a.history && c.fn.history) { c.tools.history.init(h); a.event = "history" } h.each(function (f) { c(this).bind(a.event, function (g) { d.click(f, g); return g.preventDefault() }) }); i.find("a[href^=#]").bind("click.T", function (f) { d.click(c(this).attr("href"), f) }); if (location.hash) d.click(location.hash); else if (a.initialIndex ===
0 || a.initialIndex > 0) d.click(a.initialIndex)
    } c.tools = c.tools || { version: "1.2.3" }; c.tools.tabs = { conf: { tabs: "a", current: "current", onBeforeClick: null, onClick: null, effect: "default", initialIndex: 0, event: "click", rotate: false, history: false }, addEffect: function (e, b) { o[e] = b } }; var o = {
        "default": function (e, b) { this.getPanes().hide().eq(e).show(); b.call() }, fade: function (e, b) { var a = this.getConf(), d = a.fadeOutSpeed, l = this.getPanes(); d ? l.fadeOut(d) : l.hide(); l.eq(e).fadeIn(a.fadeInSpeed, b) }, slide: function (e, b) {
            this.getPanes().slideUp(200);
            this.getPanes().eq(e).slideDown(400, b)
        }, ajax: function (e, b) { this.getPanes().eq(0).load(this.getTabs().eq(e).attr("href"), b) }
    }, m; c.tools.tabs.addEffect("horizontal", function (e, b) { m || (m = this.getPanes().eq(0).width()); this.getCurrentPane().animate({ width: 0 }, function () { c(this).hide() }); this.getPanes().eq(e).animate({ width: m }, function () { c(this).show(); b.call() }) }); c.fn.tabs = function (e, b) {
        var a = this.data("tabs"); if (a) { a.destroy(); this.removeData("tabs") } if (c.isFunction(b)) b = { onBeforeClick: b }; b = c.extend({},
c.tools.tabs.conf, b); this.each(function () { a = new p(c(this), e, b); c(this).data("tabs", a) }); return b.api ? a : this
    }
})(jQuery);
(function (d) {
    function r(g, a) {
        function p(f) { var e = d(f); return e.length < 2 ? e : g.parent().find(f) } var c = this, j = g.add(this), b = g.data("tabs"), h, l, m, n = false, o = p(a.next).click(function () { b.next() }), k = p(a.prev).click(function () { b.prev() }); d.extend(c, {
            getTabs: function () { return b }, getConf: function () { return a }, play: function () { if (!h) { var f = d.Event("onBeforePlay"); j.trigger(f); if (f.isDefaultPrevented()) return c; n = false; h = setInterval(b.next, a.interval); j.trigger("onPlay"); b.next() } }, pause: function () {
                if (!h) return c;
                var f = d.Event("onBeforePause"); j.trigger(f); if (f.isDefaultPrevented()) return c; h = clearInterval(h); m = clearInterval(m); j.trigger("onPause")
            }, stop: function () { c.pause(); n = true }
        }); d.each("onBeforePlay,onPlay,onBeforePause,onPause".split(","), function (f, e) { d.isFunction(a[e]) && c.bind(e, a[e]); c[e] = function (s) { return c.bind(e, s) } }); if (a.autopause) { var t = b.getTabs().add(o).add(k).add(b.getPanes()); t.hover(function () { c.pause(); l = clearInterval(l) }, function () { n || (l = setTimeout(c.play, a.interval)) }) } if (a.autoplay) m =
setTimeout(c.play, a.interval); else c.stop(); a.clickable && b.getPanes().click(function () { b.next() }); if (!b.getConf().rotate) { var i = a.disabledClass; b.getIndex() || k.addClass(i); b.onBeforeClick(function (f, e) { if (e) { k.removeClass(i); e == b.getTabs().length - 1 ? o.addClass(i) : o.removeClass(i) } else k.addClass(i) }) }
    } var q; q = d.tools.tabs.slideshow = { conf: { next: ".forward", prev: ".backward", disabledClass: "disabled", autoplay: false, autopause: true, interval: 3E3, clickable: true, api: false} }; d.fn.slideshow = function (g) {
        var a =
this.data("slideshow"); if (a) return a; g = d.extend({}, q.conf, g); this.each(function () { a = new r(d(this), g); d(this).data("slideshow", a) }); return g.api ? a : this
    }
})(jQuery);
(function (f) {
    function p(a, b, c) { var h = c.relative ? a.position().top : a.offset().top, e = c.relative ? a.position().left : a.offset().left, i = c.position[0]; h -= b.outerHeight() - c.offset[0]; e += a.outerWidth() + c.offset[1]; var j = b.outerHeight() + a.outerHeight(); if (i == "center") h += j / 2; if (i == "bottom") h += j; i = c.position[1]; a = b.outerWidth() + a.outerWidth(); if (i == "center") e -= a / 2; if (i == "left") e -= a; return { top: h, left: e} } function t(a, b) {
        var c = this, h = a.add(c), e, i = 0, j = 0, m = a.attr("title"), q = n[b.effect], k, r = a.is(":input"), u = r && a.is(":checkbox, :radio, select, :button, :submit"),
s = a.attr("type"), l = b.events[s] || b.events[r ? u ? "widget" : "input" : "def"]; if (!q) throw 'Nonexistent effect "' + b.effect + '"'; l = l.split(/,\s*/); if (l.length != 2) throw "Tooltip: bad events configuration for " + s; a.bind(l[0], function (d) { clearTimeout(i); if (b.predelay) j = setTimeout(function () { c.show(d) }, b.predelay); else c.show(d) }).bind(l[1], function (d) { clearTimeout(j); if (b.delay) i = setTimeout(function () { c.hide(d) }, b.delay); else c.hide(d) }); if (m && b.cancelDefault) { a.removeAttr("title"); a.data("title", m) } f.extend(c, {
    show: function (d) {
        if (!e) {
            if (m) e =
    f(b.layout).addClass(b.tipClass).appendTo(document.body).hide().append(m); else if (b.tip) e = f(b.tip).eq(0); else { e = a.next(); e.length || (e = a.parent().next()) } if (!e.length) throw "Cannot find tooltip for " + a;
        } if (c.isShown()) return c; e.stop(true, true); var g = p(a, e, b); d = d || f.Event(); d.type = "onBeforeShow"; h.trigger(d, [g]); if (d.isDefaultPrevented()) return c; g = p(a, e, b); e.css({ position: "absolute", top: g.top, left: g.left }); k = true; q[0].call(c, function () { d.type = "onShow"; k = "full"; h.trigger(d) }); g = b.events.tooltip.split(/,\s*/);
        e.bind(g[0], function () { clearTimeout(i); clearTimeout(j) }); g[1] && !a.is("input:not(:checkbox, :radio), textarea") && e.bind(g[1], function (o) { o.relatedTarget != a[0] && a.trigger(l[1].split(" ")[0]) }); return c
    }, hide: function (d) { if (!e || !c.isShown()) return c; d = d || f.Event(); d.type = "onBeforeHide"; h.trigger(d); if (!d.isDefaultPrevented()) { k = false; n[b.effect][1].call(c, function () { d.type = "onHide"; k = false; h.trigger(d) }); return c } }, isShown: function (d) { return d ? k == "full" : k }, getConf: function () { return b }, getTip: function () { return e },
    getTrigger: function () { return a }
}); f.each("onHide,onBeforeShow,onShow,onBeforeHide".split(","), function (d, g) { f.isFunction(b[g]) && f(c).bind(g, b[g]); c[g] = function (o) { f(c).bind(g, o); return c } })
    } f.tools = f.tools || { version: "1.2.3" }; f.tools.tooltip = {
        conf: {
            effect: "toggle", fadeOutSpeed: "fast", predelay: 0, delay: 30, opacity: 1, tip: 0, position: ["top", "center"], offset: [0, 0], relative: false, cancelDefault: true, events: { def: "mouseenter,mouseleave", input: "focus,blur", widget: "focus mouseenter,blur mouseleave", tooltip: "mouseenter,mouseleave" },
            layout: "<div/>", tipClass: "tooltip"
        }, addEffect: function (a, b, c) { n[a] = [b, c] }
    }; var n = { toggle: [function (a) { var b = this.getConf(), c = this.getTip(); b = b.opacity; b < 1 && c.css({ opacity: b }); c.show(); a.call() }, function (a) { this.getTip().hide(); a.call() } ], fade: [function (a) { var b = this.getConf(); this.getTip().fadeTo(b.fadeInSpeed, b.opacity, a) }, function (a) { this.getTip().fadeOut(this.getConf().fadeOutSpeed, a) } ] }; f.fn.tooltip = function (a) {
        var b = this.data("tooltip"); if (b) return b; a = f.extend(true, {}, f.tools.tooltip.conf, a);
        if (typeof a.position == "string") a.position = a.position.split(/,?\s/); this.each(function () { b = new t(f(this), a); f(this).data("tooltip", b) }); return a.api ? b : this
    }
})(jQuery);
(function (d) {
    var i = d.tools.tooltip; d.extend(i.conf, { direction: "up", bounce: false, slideOffset: 10, slideInSpeed: 200, slideOutSpeed: 200, slideFade: !d.browser.msie }); var e = { up: ["-", "top"], down: ["+", "top"], left: ["-", "left"], right: ["+", "left"] }; i.addEffect("slide", function (g) { var a = this.getConf(), f = this.getTip(), b = a.slideFade ? { opacity: a.opacity} : {}, c = e[a.direction] || e.up; b[c[1]] = c[0] + "=" + a.slideOffset; a.slideFade && f.css({ opacity: 0 }); f.show().animate(b, a.slideInSpeed, g) }, function (g) {
        var a = this.getConf(), f = a.slideOffset,
b = a.slideFade ? { opacity: 0} : {}, c = e[a.direction] || e.up, h = "" + c[0]; if (a.bounce) h = h == "+" ? "-" : "+"; b[c[1]] = h + "=" + f; this.getTip().animate(b, a.slideOutSpeed, function () { d(this).hide(); g.call() })
    })
})(jQuery);
(function (g) {
    function j(a) { var c = g(window), d = c.width() + c.scrollLeft(), h = c.height() + c.scrollTop(); return [a.offset().top <= c.scrollTop(), d <= a.offset().left + a.width(), h <= a.offset().top + a.height(), c.scrollLeft() >= a.offset().left] } function k(a) { for (var c = a.length; c--; ) if (a[c]) return false; return true } var i = g.tools.tooltip; i.dynamic = { conf: { classNames: "top right bottom left"} }; g.fn.dynamic = function (a) {
        if (typeof a == "number") a = { speed: a }; a = g.extend({}, i.dynamic.conf, a); var c = a.classNames.split(/\s/), d; this.each(function () {
            var h =
g(this).tooltip().onBeforeShow(function (e, f) {
    e = this.getTip(); var b = this.getConf(); d || (d = [b.position[0], b.position[1], b.offset[0], b.offset[1], g.extend({}, b)]); g.extend(b, d[4]); b.position = [d[0], d[1]]; b.offset = [d[2], d[3]]; e.css({ visibility: "hidden", position: "absolute", top: f.top, left: f.left }).show(); f = j(e); if (!k(f)) {
        if (f[2]) { g.extend(b, a.top); b.position[0] = "top"; e.addClass(c[0]) } if (f[3]) { g.extend(b, a.right); b.position[1] = "right"; e.addClass(c[1]) } if (f[0]) { g.extend(b, a.bottom); b.position[0] = "bottom"; e.addClass(c[2]) } if (f[1]) {
            g.extend(b,
a.left); b.position[1] = "left"; e.addClass(c[3])
        } if (f[0] || f[2]) b.offset[0] *= -1; if (f[1] || f[3]) b.offset[1] *= -1
    } e.css({ visibility: "visible" }).hide()
}); h.onBeforeShow(function () { var e = this.getConf(); this.getTip(); setTimeout(function () { e.position = [d[0], d[1]]; e.offset = [d[2], d[3]] }, 0) }); h.onHide(function () { var e = this.getTip(); e.removeClass(a.classNames) }); ret = h
        }); return a.api ? ret : this
    }
})(jQuery);
(function (e) {
    function n(f, c) { var a = e(c); return a.length < 2 ? a : f.parent().find(c) } function t(f, c) {
        var a = this, l = f.add(a), g = f.children(), k = 0, m = c.vertical; j || (j = a); if (g.length > 1) g = e(c.items, f); e.extend(a, {
            getConf: function () { return c }, getIndex: function () { return k }, getSize: function () { return a.getItems().size() }, getNaviButtons: function () { return o.add(p) }, getRoot: function () { return f }, getItemWrap: function () { return g }, getItems: function () { return g.children(c.item).not("." + c.clonedClass) }, move: function (b, d) {
                return a.seekTo(k +
    b, d)
            }, next: function (b) { return a.move(1, b) }, prev: function (b) { return a.move(-1, b) }, begin: function (b) { return a.seekTo(0, b) }, end: function (b) { return a.seekTo(a.getSize() - 1, b) }, focus: function () { return j = a }, addItem: function (b) { b = e(b); if (c.circular) { e(".cloned:last").before(b); e(".cloned:first").replaceWith(b.clone().addClass(c.clonedClass)) } else g.append(b); l.trigger("onAddItem", [b]); return a }, seekTo: function (b, d, h) {
                if (c.circular && b === 0 && k == -1 && d !== 0) return a; if (!c.circular && b < 0 || b > a.getSize() || b < -1) return a;
                var i = b; if (b.jquery) b = a.getItems().index(b); else i = a.getItems().eq(b); var q = e.Event("onBeforeSeek"); if (!h) { l.trigger(q, [b, d]); if (q.isDefaultPrevented() || !i.length) return a } i = m ? { top: -i.position().top} : { left: -i.position().left }; k = b; j = a; if (d === undefined) d = c.speed; g.animate(i, d, c.easing, h || function () { l.trigger("onSeek", [b]) }); return a
            }
        }); e.each(["onBeforeSeek", "onSeek", "onAddItem"], function (b, d) { e.isFunction(c[d]) && e(a).bind(d, c[d]); a[d] = function (h) { e(a).bind(d, h); return a } }); if (c.circular) {
            var r = a.getItems().slice(-1).clone().prependTo(g),
s = a.getItems().eq(1).clone().appendTo(g); r.add(s).addClass(c.clonedClass); a.onBeforeSeek(function (b, d, h) { if (!b.isDefaultPrevented()) if (d == -1) { a.seekTo(r, h, function () { a.end(0) }); return b.preventDefault() } else d == a.getSize() && a.seekTo(s, h, function () { a.begin(0) }) }); a.seekTo(0, 0)
        } var o = n(f, c.prev).click(function () { a.prev() }), p = n(f, c.next).click(function () { a.next() }); !c.circular && a.getSize() > 1 && a.onBeforeSeek(function (b, d) {
            setTimeout(function () {
                if (!b.isDefaultPrevented()) {
                    o.toggleClass(c.disabledClass,
d <= 0); p.toggleClass(c.disabledClass, d >= a.getSize() - 1)
                }
            }, 1)
        }); c.mousewheel && e.fn.mousewheel && f.mousewheel(function (b, d) { if (c.mousewheel) { a.move(d < 0 ? 1 : -1, c.wheelSpeed || 50); return false } }); c.keyboard && e(document).bind("keydown.scrollable", function (b) { if (!(!c.keyboard || b.altKey || b.ctrlKey || e(b.target).is(":input"))) if (!(c.keyboard != "static" && j != a)) { var d = b.keyCode; if (m && (d == 38 || d == 40)) { a.move(d == 38 ? -1 : 1); return b.preventDefault() } if (!m && (d == 37 || d == 39)) { a.move(d == 37 ? -1 : 1); return b.preventDefault() } } });
        e(a).trigger("onBeforeSeek", [c.initialIndex])
    } e.tools = e.tools || { version: "1.2.3" }; e.tools.scrollable = { conf: { activeClass: "active", circular: false, clonedClass: "cloned", disabledClass: "disabled", easing: "swing", initialIndex: 0, item: null, items: ".items", keyboard: true, mousewheel: false, next: ".next", prev: ".prev", speed: 400, vertical: false, wheelSpeed: 0} }; var j; e.fn.scrollable = function (f) {
        var c = this.data("scrollable"); if (c) return c; f = e.extend({}, e.tools.scrollable.conf, f); this.each(function () {
            c = new t(e(this), f); e(this).data("scrollable",
c)
        }); return f.api ? c : this
    }
})(jQuery);
(function (c) {
    var g = c.tools.scrollable; g.autoscroll = { conf: { autoplay: true, interval: 3E3, autopause: true} }; c.fn.autoscroll = function (d) {
        if (typeof d == "number") d = { interval: d }; var b = c.extend({}, g.autoscroll.conf, d), h; this.each(function () {
            var a = c(this).data("scrollable"); if (a) h = a; var e, i, f = true; a.play = function () { if (!e) { f = false; e = setInterval(function () { a.next() }, b.interval); a.next() } }; a.pause = function () { e = clearInterval(e) }; a.stop = function () { a.pause(); f = true }; b.autopause && a.getRoot().add(a.getNaviButtons()).hover(function () {
                a.pause();
                clearInterval(i)
            }, function () { f || (i = setTimeout(a.play, b.interval)) }); b.autoplay && setTimeout(a.play, b.interval)
        }); return b.api ? h : this
    }
})(jQuery);
(function (d) {
    function p(c, g) { var h = d(g); return h.length < 2 ? h : c.parent().find(g) } var m = d.tools.scrollable; m.navigator = { conf: { navi: ".navi", naviItem: null, activeClass: "active", indexed: false, idPrefix: null, history: false} }; d.fn.navigator = function (c) {
        if (typeof c == "string") c = { navi: c }; c = d.extend({}, m.navigator.conf, c); var g; this.each(function () {
            function h(a, b, i) { e.seekTo(b); if (j) { if (location.hash) location.hash = a.attr("href").replace("#", "") } else return i.preventDefault() } function f() {
                return k.find(c.naviItem ||
"> *")
            } function n(a) { var b = d("<" + (c.naviItem || "a") + "/>").click(function (i) { h(d(this), a, i) }).attr("href", "#" + a); a === 0 && b.addClass(l); c.indexed && b.text(a + 1); c.idPrefix && b.attr("id", c.idPrefix + a); return b.appendTo(k) } function o(a, b) { a = f().eq(b.replace("#", "")); a.length || (a = f().filter("[href=" + b + "]")); a.click() } var e = d(this).data("scrollable"), k = p(e.getRoot(), c.navi), q = e.getNaviButtons(), l = c.activeClass, j = c.history && d.fn.history; if (e) g = e; e.getNaviButtons = function () { return q.add(k) }; f().length ? f().each(function (a) {
                d(this).click(function (b) {
                    h(d(this),
a, b)
                })
            }) : d.each(e.getItems(), function (a) { n(a) }); e.onBeforeSeek(function (a, b) { setTimeout(function () { if (!a.isDefaultPrevented()) { var i = f().eq(b); !a.isDefaultPrevented() && i.length && f().removeClass(l).eq(b).addClass(l) } }, 1) }); e.onAddItem(function (a, b) { b = n(e.getItems().index(b)); j && b.history(o) }); j && f().history(o)
        }); return c.api ? g : this
    }
})(jQuery);
(function (a) {
    function t(d, b) {
        var c = this, i = d.add(c), o = a(window), k, f, m, g = a.tools.expose && (b.mask || b.expose), n = Math.random().toString().slice(10); if (g) { if (typeof g == "string") g = { color: g }; g.closeOnClick = g.closeOnEsc = false } var p = b.target || d.attr("rel"); f = p ? a(p) : d; if (!f.length) throw "Could not find Overlay: " + p; d && d.index(f) == -1 && d.click(function (e) { c.load(e); return e.preventDefault() }); a.extend(c, {
            load: function (e) {
                if (c.isOpened()) return c; var h = q[b.effect]; if (!h) throw 'Overlay: cannot find effect : "' + b.effect +
    '"'; b.oneInstance && a.each(s, function () { this.close(e) }); e = e || a.Event(); e.type = "onBeforeLoad"; i.trigger(e); if (e.isDefaultPrevented()) return c; m = true; g && a(f).expose(g); var j = b.top, r = b.left, u = f.outerWidth(true), v = f.outerHeight(true); if (typeof j == "string") j = j == "center" ? Math.max((o.height() - v) / 2, 0) : parseInt(j, 10) / 100 * o.height(); if (r == "center") r = Math.max((o.width() - u) / 2, 0); h[0].call(c, { top: j, left: r }, function () { if (m) { e.type = "onLoad"; i.trigger(e) } }); g && b.closeOnClick && a.mask.getMask().one("click",
    c.close); b.closeOnClick && a(document).bind("click." + n, function (l) { a(l.target).parents(f).length || c.close(l) }); b.closeOnEsc && a(document).bind("keydown." + n, function (l) { l.keyCode == 27 && c.close(l) }); return c
            }, close: function (e) { if (!c.isOpened()) return c; e = e || a.Event(); e.type = "onBeforeClose"; i.trigger(e); if (!e.isDefaultPrevented()) { m = false; q[b.effect][1].call(c, function () { e.type = "onClose"; i.trigger(e) }); a(document).unbind("click." + n).unbind("keydown." + n); g && a.mask.close(); return c } }, getOverlay: function () { return f },
            getTrigger: function () { return d }, getClosers: function () { return k }, isOpened: function () { return m }, getConf: function () { return b }
        }); a.each("onBeforeLoad,onStart,onLoad,onBeforeClose,onClose".split(","), function (e, h) { a.isFunction(b[h]) && a(c).bind(h, b[h]); c[h] = function (j) { a(c).bind(h, j); return c } }); k = f.find(b.close || ".close"); if (!k.length && !b.close) { k = a('<a class="close"></a>'); f.prepend(k) } k.click(function (e) { c.close(e) }); b.load && c.load()
    } a.tools = a.tools || { version: "1.2.3" }; a.tools.overlay = {
        addEffect: function (d,
    b, c) { q[d] = [b, c] }, conf: { close: null, closeOnClick: true, closeOnEsc: true, closeSpeed: "fast", effect: "default", fixed: !a.browser.msie || a.browser.version > 6, left: "center", load: false, mask: null, oneInstance: true, speed: "normal", target: null, top: "10%" }
    }; var s = [], q = {}; a.tools.overlay.addEffect("default", function (d, b) { var c = this.getConf(), i = a(window); if (!c.fixed) { d.top += i.scrollTop(); d.left += i.scrollLeft() } d.position = c.fixed ? "fixed" : "absolute"; this.getOverlay().css(d).fadeIn(c.speed, b) }, function (d) {
        this.getOverlay().fadeOut(this.getConf().closeSpeed,
d)
    }); a.fn.overlay = function (d) { var b = this.data("overlay"); if (b) return b; if (a.isFunction(d)) d = { onBeforeLoad: d }; d = a.extend(true, {}, a.tools.overlay.conf, d); this.each(function () { b = new t(a(this), d); s.push(b); a(this).data("overlay", b) }); return d.api ? b : this }
})(jQuery);
(function (i) {
    function j(b) { var d = b.offset(); return { top: d.top + b.height() / 2, left: d.left + b.width() / 2} } var k = i.tools.overlay, f = i(window); i.extend(k.conf, { start: { top: null, left: null }, fadeInSpeed: "fast", zIndex: 9999 }); function n(b, d) {
        var a = this.getOverlay(), c = this.getConf(), g = this.getTrigger(), o = this, l = a.outerWidth(true), h = a.data("img"); if (!h) {
            var e = a.css("backgroundImage"); if (!e) throw "background-image CSS property not set for overlay"; e = e.slice(e.indexOf("(") + 1, e.indexOf(")")).replace(/\"/g, "");
            a.css("backgroundImage", "none"); h = i('<img src="' + e + '"/>'); h.css({ border: 0, display: "none" }).width(l); i("body").append(h); a.data("img", h)
        } e = c.start.top || Math.round(f.height() / 2); var m = c.start.left || Math.round(f.width() / 2); if (g) { g = j(g); e = g.top; m = g.left } h.css({ position: "absolute", top: e, left: m, width: 0, zIndex: c.zIndex }).show(); b.top += f.scrollTop(); b.left += f.scrollLeft(); b.position = "absolute"; a.css(b); h.animate({ top: a.css("top"), left: a.css("left"), width: l }, c.speed, function () {
            if (c.fixed) {
                b.top -= f.scrollTop();
                b.left -= f.scrollLeft(); b.position = "fixed"; h.add(a).css(b)
            } a.css("zIndex", c.zIndex + 1).fadeIn(c.fadeInSpeed, function () { o.isOpened() && !i(this).index(a) ? d.call() : a.hide() })
        })
    } function p(b) { var d = this.getOverlay().hide(), a = this.getConf(), c = this.getTrigger(); d = d.data("img"); var g = { top: a.start.top, left: a.start.left, width: 0 }; c && i.extend(g, j(c)); a.fixed && d.css({ position: "absolute" }).animate({ top: "+=" + f.scrollTop(), left: "+=" + f.scrollLeft() }, 0); d.animate(g, a.closeSpeed, b) } k.addEffect("apple", n, p)
})(jQuery);
(function (d) {
    function R(b, c) { return 32 - (new Date(b, c, 32)).getDate() } function S(b, c) { b = "" + b; for (c = c || 2; b.length < c; ) b = "0" + b; return b } function T(b, c, j) { var m = b.getDate(), h = b.getDay(), t = b.getMonth(); b = b.getFullYear(); var f = { d: m, dd: S(m), ddd: B[j].shortDays[h], dddd: B[j].days[h], m: t + 1, mm: S(t + 1), mmm: B[j].shortMonths[t], mmmm: B[j].months[t], yy: String(b).slice(2), yyyy: b }; c = c.replace(X, function (o) { return o in f ? f[o] : o.slice(1, o.length - 1) }); return Y.html(c).html() } function y(b) { return parseInt(b, 10) } function U(b,
c) { return b.getFullYear() === c.getFullYear() && b.getMonth() == c.getMonth() && b.getDate() == c.getDate() } function C(b) { if (b) { if (b.constructor == Date) return b; if (typeof b == "string") { var c = b.split("-"); if (c.length == 3) return new Date(y(c[0]), y(c[1]) - 1, y(c[2])); if (!/^-?\d+$/.test(b)) return; b = y(b) } c = new Date; c.setDate(c.getDate() + b); return c } } function Z(b, c) {
    function j(a, e, g) {
        l = a; D = a.getFullYear(); E = a.getMonth(); G = a.getDate(); g = g || d.Event("api"); g.type = "change"; H.trigger(g, [a]); if (!g.isDefaultPrevented()) {
            b.val(T(a,
e.format, e.lang)); b.data("date", a); h.hide(g)
        }
    } function m(a) {
        a.type = "onShow"; H.trigger(a); d(document).bind("keydown.d", function (e) {
            var g = e.keyCode; if (g == 8) { b.val(""); return h.hide(e) } if (g == 27) return h.hide(e); if (d(V).index(g) >= 0) {
                if (!u) { h.show(e); return e.preventDefault() } var i = d("#" + f.weeks + " a"), p = d("." + f.focus), q = i.index(p); p.removeClass(f.focus); if (g == 74 || g == 40) q += 7; else if (g == 75 || g == 38) q -= 7; else if (g == 76 || g == 39) q += 1; else if (g == 72 || g == 37) q -= 1; if (q == -1) { h.addMonth(-1); p = d("#" + f.weeks + " a:last") } else if (q ==
35) { h.addMonth(); p = d("#" + f.weeks + " a:first") } else p = i.eq(q); p.addClass(f.focus); return e.preventDefault()
            } if (g == 34) return h.addMonth(); if (g == 33) return h.addMonth(-1); if (g == 36) return h.today(); if (g == 13) d(e.target).is("select") || d("." + f.focus).click(); return d([16, 17, 18, 9]).index(g) >= 0
        }); d(document).bind("click.d", function (e) { var g = e.target; if (!d(g).parents("#" + f.root).length && g != b[0] && (!K || g != K[0])) h.hide(e) })
    } var h = this, t = new Date, f = c.css, o = B[c.lang], k = d("#" + f.root), L = k.find("#" + f.title), K, I, J, D,
E, G, l = b.attr("data-value") || c.value || b.val(), r = b.attr("min") || c.min, s = b.attr("max") || c.max, u; l = C(l) || t; r = C(r || c.yearRange[0] * 365); s = C(s || c.yearRange[1] * 365); if (!o) throw "Dateinput: invalid language: " + c.lang; if (b.attr("type") == "date") { var M = d("<input/>"); d.each("name,readonly,disabled,value,required".split(","), function (a, e) { M.attr(e, b.attr(e)) }); b.replaceWith(M); b = M } b.addClass(f.input); var H = b.add(h); if (!k.length) {
        k = d("<div><div><a/><div/><a/></div><div><div/><div/></div></div>").hide().css({ position: "absolute" }).attr("id",
f.root); k.children().eq(0).attr("id", f.head).end().eq(1).attr("id", f.body).children().eq(0).attr("id", f.days).end().eq(1).attr("id", f.weeks).end().end().end().find("a").eq(0).attr("id", f.prev).end().eq(1).attr("id", f.next); L = k.find("#" + f.head).find("div").attr("id", f.title); if (c.selectors) { var z = d("<select/>").attr("id", f.month), A = d("<select/>").attr("id", f.year); L.append(z.add(A)) } for (var $ = k.find("#" + f.days), N = 0; N < 7; N++) $.append(d("<span/>").text(o.shortDays[(N + c.firstDay) % 7])); b.after(k)
    } if (c.trigger) K =
d("<a/>").attr("href", "#").addClass(f.trigger).click(function (a) { h.show(); return a.preventDefault() }).insertAfter(b); var O = k.find("#" + f.weeks); A = k.find("#" + f.year); z = k.find("#" + f.month); d.extend(h, {
    show: function (a) {
        if (!(b.is("[readonly]") || u)) {
            a = a || d.Event(); a.type = "onBeforeShow"; H.trigger(a); if (!a.isDefaultPrevented()) {
                d.each(W, function () { this.hide() }); u = true; z.unbind("change").change(function () { h.setValue(A.val(), d(this).val()) }); A.unbind("change").change(function () { h.setValue(d(this).val(), z.val()) });
                I = k.find("#" + f.prev).unbind("click").click(function () { I.hasClass(f.disabled) || h.addMonth(-1); return false }); J = k.find("#" + f.next).unbind("click").click(function () { J.hasClass(f.disabled) || h.addMonth(); return false }); h.setValue(l); var e = b.position(); k.css({ top: e.top + b.outerHeight({ margins: true }) + c.offset[0], left: e.left + c.offset[1] }); if (c.speed) k.show(c.speed, function () { m(a) }); else { k.show(); m(a) } return h
            }
        }
    }, setValue: function (a, e, g) {
        var i; if (parseInt(e, 10) >= -1) { a = y(a); e = y(e); g = y(g); i = new Date(a, e, g) } else {
            i =
    a || l; a = i.getFullYear(); e = i.getMonth(); g = i.getDate()
        } if (e == -1) { e = 11; a-- } else if (e == 12) { e = 0; a++ } if (!u) { j(i, c); return h } E = e; D = a; i = new Date(a, e, 1 - c.firstDay); g = i.getDay(); var p = R(a, e), q = R(a, e - 1), P; if (c.selectors) { z.empty(); d.each(o.months, function (v, F) { r < new Date(a, v + 1, -1) && s > new Date(a, v, 0) && z.append(d("<option/>").html(F).attr("value", v)) }); A.empty(); for (i = a + c.yearRange[0]; i < a + c.yearRange[1]; i++) r < new Date(i + 1, -1, 0) && s > new Date(i, 0, 0) && A.append(d("<option/>").text(i)); z.val(e); A.val(a) } else L.html(o.months[e] +
    " " + a); O.empty(); I.add(J).removeClass(f.disabled); for (var w = 0, n, x; w < 42; w++) {
            n = d("<a/>"); if (w % 7 === 0) { P = d("<div/>").addClass(f.week); O.append(P) } if (w < g) { n.addClass(f.off); x = q - g + w + 1; i = new Date(a, e - 1, x) } else if (w >= g + p) { n.addClass(f.off); x = w - p - g + 1; i = new Date(a, e + 1, x) } else { x = w - g + 1; i = new Date(a, e, x); if (U(l, i)) n.attr("id", f.current).addClass(f.focus); else U(t, i) && n.attr("id", f.today) } r && i < r && n.add(I).addClass(f.disabled); s && i > s && n.add(J).addClass(f.disabled); n.attr("href", "#" + x).text(x).data("date", i); P.append(n);
            n.click(function (v) { var F = d(this); if (!F.hasClass(f.disabled)) { d("#" + f.current).removeAttr("id"); F.attr("id", f.current); j(F.data("date"), c, v) } return false })
        } f.sunday && O.find(f.week).each(function () { var v = c.firstDay ? 7 - c.firstDay : 0; d(this).children().slice(v, v + 1).addClass(f.sunday) }); return h
    }, setMin: function (a, e) { r = C(a); e && l < r && h.setValue(r); return h }, setMax: function (a, e) { s = C(a); e && l > s && h.setValue(s); return h }, today: function () { return h.setValue(t) }, addDay: function (a) {
        return this.setValue(D, E, G + (a ||
    1))
    }, addMonth: function (a) { return this.setValue(D, E + (a || 1), G) }, addYear: function (a) { return this.setValue(D + (a || 1), E, G) }, hide: function (a) { if (u) { a = a || d.Event(); a.type = "onHide"; H.trigger(a); d(document).unbind("click.d").unbind("keydown.d"); if (a.isDefaultPrevented()) return; k.hide(); u = false } return h }, getConf: function () { return c }, getInput: function () { return b }, getCalendar: function () { return k }, getValue: function (a) { return a ? T(l, a, c.lang) : l }, isOpen: function () { return u }
}); d.each(["onBeforeShow", "onShow", "change",
"onHide"], function (a, e) { d.isFunction(c[e]) && d(h).bind(e, c[e]); h[e] = function (g) { d(h).bind(e, g); return h } }); b.bind("focus click", h.show).keydown(function (a) { var e = a.keyCode; if (!u && d(V).index(e) >= 0) { h.show(a); return a.preventDefault() } return a.shiftKey || a.ctrlKey || a.altKey || e == 9 ? true : a.preventDefault() }); C(b.val()) && j(l, c)
} d.tools = d.tools || { version: "1.2.3" }; var W = [], Q, V = [75, 76, 38, 39, 74, 72, 40, 37], B = {}; Q = d.tools.dateinput = {
    conf: {
        format: "mm/dd/yy", selectors: false, yearRange: [-5, 5], lang: "en", offset: [0, 0],
        speed: 0, firstDay: 0, min: 0, max: 0, trigger: false, css: { prefix: "cal", input: "date", root: 0, head: 0, title: 0, prev: 0, next: 0, month: 0, year: 0, days: 0, body: 0, weeks: 0, today: 0, current: 0, week: 0, off: 0, sunday: 0, focus: 0, disabled: 0, trigger: 0 }
    }, localize: function (b, c) { d.each(c, function (j, m) { c[j] = m.split(",") }); B[b] = c }
}; Q.localize("en", {
    months: "January,February,March,April,May,June,July,August,September,October,November,December", shortMonths: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec", days: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
    shortDays: "Sun,Mon,Tue,Wed,Thu,Fri,Sat"
}); var X = /d{1,4}|m{1,4}|yy(?:yy)?|"[^"]*"|'[^']*'/g, Y = d("<a/>"); d.expr[":"].date = function (b) { var c = b.getAttribute("type"); return c && c == "date" || !!d(b).data("dateinput") }; d.fn.dateinput = function (b) {
    if (this.data("dateinput")) return this; b = d.extend(true, {}, Q.conf, b); d.each(b.css, function (j, m) { if (!m && j != "prefix") b.css[j] = (b.css.prefix || "") + (m || j) }); var c; this.each(function () { var j = new Z(d(this), b); W.push(j); j = j.getInput().data("dateinput", j); c = c ? c.add(j) : j }); return c ?
        c : this
}
})(jQuery);
(function (e) {
    function F(d, a) { a = Math.pow(10, a); return Math.round(d * a) / a } function p(d, a) { if (a = parseInt(d.css(a), 10)) return a; return (d = d[0].currentStyle) && d.width && parseInt(d.width, 10) } function C(d) { return (d = d.data("events")) && d.onSlide } function G(d, a) {
        function h(c, b, f, j) {
            if (f === undefined) f = b / k * z; else if (j) f -= a.min; if (r) f = Math.round(f / r) * r; if (b === undefined || r) b = f * k / z; if (isNaN(f)) return g; b = Math.max(0, Math.min(b, k)); f = b / k * z; if (j || !n) f += a.min; if (n) if (j) b = k - b; else f = a.max - f; f = F(f, t); var q = c.type == "click";
            if (D && l !== undefined && !q) { c.type = "onSlide"; A.trigger(c, [f, b]); if (c.isDefaultPrevented()) return g } j = q ? a.speed : 0; q = q ? function () { c.type = "change"; A.trigger(c, [f]) } : null; if (n) { m.animate({ top: b }, j, q); a.progress && B.animate({ height: k - b + m.width() / 2 }, j) } else { m.animate({ left: b }, j, q); a.progress && B.animate({ width: b + m.width() / 2 }, j) } l = f; H = b; d.val(f); return g
        } function s() { if (n = a.vertical || p(i, "height") > p(i, "width")) { k = p(i, "height") - p(m, "height"); u = i.offset().top + k } else { k = p(i, "width") - p(m, "width"); u = i.offset().left } }
        function v() { s(); g.setValue(a.value || a.min) } var g = this, o = a.css, i = e("<div><div/><a href='#'/></div>").data("rangeinput", g), n, l, u, k, H; d.before(i); var m = i.addClass(o.slider).find("a").addClass(o.handle), B = i.find("div").addClass(o.progress); e.each("min,max,step,value".split(","), function (c, b) { c = d.attr(b); if (parseFloat(c)) a[b] = parseFloat(c, 10) }); var z = a.max - a.min, r = a.step == "any" ? 0 : a.step, t = a.precision; if (t === undefined) try { t = r.toString().split(".")[1].length } catch (I) { t = 0 } if (d.attr("type") == "range") {
            var w =
e("<input/>"); e.each("name,readonly,disabled,required".split(","), function (c, b) { w.attr(b, d.attr(b)) }); w.val(a.value); d.replaceWith(w); d = w
        } d.addClass(o.input); var A = e(g).add(d), D = true; e.extend(g, {
            getValue: function () { return l }, setValue: function (c, b) { return h(b || e.Event("api"), undefined, c, true) }, getConf: function () { return a }, getProgress: function () { return B }, getHandle: function () { return m }, getInput: function () { return d }, step: function (c, b) {
                b = b || e.Event(); var f = a.step == "any" ? 1 : a.step; g.setValue(l + f * (c || 1),
    b)
            }, stepUp: function (c) { return g.step(c || 1) }, stepDown: function (c) { return g.step(-c || -1) }
        }); e.each("onSlide,change".split(","), function (c, b) { e.isFunction(a[b]) && e(g).bind(b, a[b]); g[b] = function (f) { e(g).bind(b, f); return g } }); m.drag({ drag: false }).bind("dragStart", function () { D = C(e(g)) || C(d) }).bind("drag", function (c, b, f) { if (d.is(":disabled")) return false; h(c, n ? b : f) }).bind("dragEnd", function (c) { if (!c.isDefaultPrevented()) { c.type = "change"; A.trigger(c, [l]) } }).click(function (c) { return c.preventDefault() }); i.click(function (c) {
            if (d.is(":disabled") ||
c.target == m[0]) return c.preventDefault(); s(); var b = m.width() / 2; h(c, n ? k - u - b + c.pageY : c.pageX - u - b)
        }); a.keyboard && d.keydown(function (c) { if (!d.attr("readonly")) { var b = c.keyCode, f = e([75, 76, 38, 33, 39]).index(b) != -1, j = e([74, 72, 40, 34, 37]).index(b) != -1; if ((f || j) && !(c.shiftKey || c.altKey || c.ctrlKey)) { if (f) g.step(b == 33 ? 10 : 1, c); else if (j) g.step(b == 34 ? -10 : -1, c); return c.preventDefault() } } }); d.blur(function (c) { var b = e(this).val(); b !== l && g.setValue(b, c) }); e.extend(d[0], { stepUp: g.stepUp, stepDown: g.stepDown }); v(); k ||
e(window).load(v)
    } e.tools = e.tools || { version: "1.2.3" }; var E; E = e.tools.rangeinput = { conf: { min: 0, max: 100, step: "any", steps: 0, value: 0, precision: undefined, vertical: 0, keyboard: true, progress: false, speed: 100, css: { input: "range", slider: "slider", progress: "progress", handle: "handle"}} }; var x, y; e.fn.drag = function (d) {
        document.ondragstart = function () { return false }; d = e.extend({ x: true, y: true, drag: true }, d); x = x || e(document).bind("mousedown mouseup", function (a) {
            var h = e(a.target); if (a.type == "mousedown" && h.data("drag")) {
                var s =
h.position(), v = a.pageX - s.left, g = a.pageY - s.top, o = true; x.bind("mousemove.drag", function (i) { var n = i.pageX - v; i = i.pageY - g; var l = {}; if (d.x) l.left = n; if (d.y) l.top = i; if (o) { h.trigger("dragStart"); o = false } d.drag && h.css(l); h.trigger("drag", [i, n]); y = h }); a.preventDefault()
            } else try { y && y.trigger("dragEnd") } finally { x.unbind("mousemove.drag"); y = null }
        }); return this.data("drag", true)
    }; e.expr[":"].range = function (d) { var a = d.getAttribute("type"); return a && a == "range" || !!e(d).filter("input").data("rangeinput") }; e.fn.rangeinput =
function (d) { if (this.data("rangeinput")) return this; d = e.extend(true, {}, E.conf, d); var a; this.each(function () { var h = new G(e(this), e.extend(true, {}, d)); h = h.getInput().data("rangeinput", h); a = a ? a.add(h) : h }); return a ? a : this }
})(jQuery);
(function (d) {
    function v(a, b, c) { var k = a.offset().top, f = a.offset().left, l = c.position.split(/,?\s+/), g = l[0]; l = l[1]; k -= b.outerHeight() - c.offset[0]; f += a.outerWidth() + c.offset[1]; c = b.outerHeight() + a.outerHeight(); if (g == "center") k += c / 2; if (g == "bottom") k += c; a = a.outerWidth(); if (l == "center") f -= (a + b.outerWidth()) / 2; if (l == "left") f -= a; return { top: k, left: f} } function w(a) { function b() { return this.getAttribute("type") == a } b.key = "[type=" + a + "]"; return b } function s(a, b, c) {
        function k(g, e, j) {
            if (!(!c.grouped && g.length)) {
                var h;
                if (j === false || d.isArray(j)) { h = i.messages[e.key || e] || i.messages["*"]; h = h[c.lang] || i.messages["*"].en; (e = h.match(/\$\d/g)) && d.isArray(j) && d.each(e, function (n) { h = h.replace(this, j[n]) }) } else h = j[c.lang] || j; g.push(h)
            }
        } var f = this, l = b.add(f); a = a.not(":button, :image, :reset, :submit"); d.extend(f, {
            getConf: function () { return c }, getForm: function () { return b }, getInputs: function () { return a }, invalidate: function (g, e) {
                if (!e) {
                    var j = []; d.each(g, function (h, n) {
                        h = a.filter("[name=" + h + "]"); if (h.length) {
                            h.trigger("OI", [n]);
                            j.push({ input: h, messages: [n] })
                        }
                    }); g = j; e = d.Event()
                } e.type = "onFail"; l.trigger(e, [g]); e.isDefaultPrevented() || q[c.effect][0].call(f, g, e); return f
            }, reset: function (g) { g = g || a; g.removeClass(c.errorClass).each(function () { var e = d(this).data("msg.el"); if (e) { e.remove(); d(this).data("msg.el", null) } }).unbind(c.errorInputEvent || ""); return f }, destroy: function () { b.unbind(c.formEvent).unbind("reset.V"); a.unbind(c.inputEvent || "").unbind("change.V"); return f.reset() }, checkValidity: function (g, e) {
                g = g || a; g = g.not(":disabled");
                if (!g.length) return true; e = e || d.Event(); e.type = "onBeforeValidate"; l.trigger(e, [g]); if (e.isDefaultPrevented()) return e.result; var j = [], h = c.errorInputEvent + ".v"; g.each(function () {
                    var p = [], m = d(this).unbind(h).data("messages", p); d.each(t, function () { var o = this, r = o[0]; if (m.filter(r).length) { o = o[1].call(f, m, m.val()); if (o !== true) { e.type = "onBeforeFail"; l.trigger(e, [m, r]); if (e.isDefaultPrevented()) return false; var u = m.attr(c.messageAttr); if (u) { p = [u]; return false } else k(p, r, o) } } }); if (p.length) {
                        j.push({
                            input: m,
                            messages: p
                        }); m.trigger("OI", [p]); c.errorInputEvent && m.bind(h, function (o) { f.checkValidity(m, o) })
                    } if (c.singleError && j.length) return false
                }); var n = q[c.effect]; if (!n) throw 'Validator: cannot find effect "' + c.effect + '"'; if (j.length) { f.invalidate(j, e); return false } else { n[1].call(f, g, e); e.type = "onSuccess"; l.trigger(e, [g]); g.unbind(h) } return true
            }
        }); d.each("onBeforeValidate,onBeforeFail,onFail,onSuccess".split(","), function (g, e) { d.isFunction(c[e]) && d(f).bind(e, c[e]); f[e] = function (j) { d(f).bind(e, j); return f } });
        c.formEvent && b.bind(c.formEvent, function (g) { if (!f.checkValidity(null, g)) return g.preventDefault() }); b.bind("reset.V", function () { f.reset() }); a[0] && a[0].validity && a.each(function () { this.oninvalid = function () { return false } }); if (b[0]) b[0].checkValidity = f.checkValidity; c.inputEvent && a.bind(c.inputEvent, function (g) { f.checkValidity(d(this), g) }); a.filter(":checkbox, select").filter("[required]").bind("change.V", function (g) {
            var e = d(this); if (this.checked || e.is("select") && d(this).val()) q[c.effect][1].call(f,
e, g)
        })
    } d.tools = d.tools || { version: "1.2.3" }; var x = /\[type=([a-z]+)\]/, y = /^-?[0-9]*(\.[0-9]+)?$/, z = /^([a-z0-9_\.\-\+]+)@([\da-z\.\-]+)\.([a-z\.]{2,6})$/i, A = /^(https?:\/\/)?([\da-z\.\-]+)\.([a-z\.]{2,6})([\/\w \.\-]*)*\/?$/i, i; i = d.tools.validator = {
        conf: { grouped: false, effect: "default", errorClass: "invalid", inputEvent: null, errorInputEvent: "keyup", formEvent: "submit", lang: "en", message: "<div/>", messageAttr: "data-message", messageClass: "error", offset: [0, 0], position: "center right", singleError: false, speed: "normal" },
        messages: { "*": { en: "Please correct this value"} }, localize: function (a, b) { d.each(b, function (c, k) { i.messages[c] = i.messages[c] || {}; i.messages[c][a] = k }) }, localizeFn: function (a, b) { i.messages[a] = i.messages[a] || {}; d.extend(i.messages[a], b) }, fn: function (a, b, c) { if (d.isFunction(b)) c = b; else { if (typeof b == "string") b = { en: b }; this.messages[a.key || a] = b } if (b = x.exec(a)) a = w(b[1]); t.push([a, c]) }, addEffect: function (a, b, c) { q[a] = [b, c] }
    }; var t = [], q = {
        "default": [function (a) {
            var b = this.getConf(); d.each(a, function (c, k) {
                c = k.input;
                c.addClass(b.errorClass); var f = c.data("msg.el"); if (!f) { f = d(b.message).addClass(b.messageClass).appendTo(document.body); c.data("msg.el", f) } f.css({ visibility: "hidden" }).find("span").remove(); d.each(k.messages, function (l, g) { d("<span/>").html(g).appendTo(f) }); f.outerWidth() == f.parent().width() && f.add(f.find("p")).css({ display: "inline" }); k = v(c, f, b); f.css({ visibility: "visible", position: "absolute", top: k.top, left: k.left }).fadeIn(b.speed)
            })
        }, function (a) {
            var b = this.getConf(); a.removeClass(b.errorClass).each(function () {
                var c =
    d(this).data("msg.el"); c && c.css({ visibility: "hidden" })
            })
        } ]
    }; d.each("email,url,number".split(","), function (a, b) { d.expr[":"][b] = function (c) { return c.getAttribute("type") === b } }); d.fn.oninvalid = function (a) { return this[a ? "bind" : "trigger"]("OI", a) }; i.fn(":email", "Please enter a valid email address", function (a, b) { return !b || z.test(b) }); i.fn(":url", "Please enter a valid URL", function (a, b) { return !b || A.test(b) }); i.fn(":number", "Please enter a numeric value.", function (a, b) { return y.test(b) }); i.fn("[max]", "Please enter a value smaller than $1",
function (a, b) { if (d.tools.dateinput && a.is(":date")) return true; a = a.attr("max"); return parseFloat(b) <= parseFloat(a) ? true : [a] }); i.fn("[min]", "Please enter a value larger than $1", function (a, b) { if (d.tools.dateinput && a.is(":date")) return true; a = a.attr("min"); return parseFloat(b) >= parseFloat(a) ? true : [a] }); i.fn("[required]", "Please complete this mandatory field.", function (a, b) { if (a.is(":checkbox")) return a.is(":checked"); return !!b }); i.fn("[pattern]", function (a) {
    var b = new RegExp("^" + a.attr("pattern") + "$");
    return b.test(a.val())
}); d.fn.validator = function (a) { var b = this.data("validator"); if (b) { b.destroy(); this.removeData("validator") } a = d.extend(true, {}, i.conf, a); if (this.is("form")) return this.each(function () { var c = d(this); b = new s(c.find(":input"), c, a); c.data("validator", b) }); else { b = new s(this, this.eq(0).closest("form"), a); return this.data("validator", b) } }
})(jQuery);
(function () {
    function f(a, b) { if (b) for (key in b) if (b.hasOwnProperty(key)) a[key] = b[key]; return a } function l(a, b) { var c = []; for (var d in a) if (a.hasOwnProperty(d)) c[d] = b(a[d]); return c } function m(a, b, c) {
        if (e.isSupported(b.version)) a.innerHTML = e.getHTML(b, c); else if (b.expressInstall && e.isSupported([6, 65])) a.innerHTML = e.getHTML(f(b, { src: b.expressInstall }), { MMredirectURL: location.href, MMplayerType: "PlugIn", MMdoctitle: document.title }); else {
            if (!a.innerHTML.replace(/\s/g, "")) {
                a.innerHTML = "<h2>Flash version " +
b.version + " or greater is required</h2><h3>" + (g[0] > 0 ? "Your version is " + g : "You have no flash plugin installed") + "</h3>" + (a.tagName == "A" ? "<p>Click here to download latest version</p>" : "<p>Download latest version from <a href='" + k + "'>here</a></p>"); if (a.tagName == "A") a.onclick = function () { location.href = k }
            } if (b.onFail) { var d = b.onFail.call(this); if (typeof d == "string") a.innerHTML = d }
        } if (h) window[b.id] = document.getElementById(b.id); f(this, {
            getRoot: function () { return a }, getOptions: function () { return b }, getConf: function () { return c },
            getApi: function () { return a.firstChild }
        })
    } var h = document.all, k = "http://www.adobe.com/go/getflashplayer", n = typeof jQuery == "function", o = /(\d+)[^\d]+(\d+)[^\d]*(\d*)/, i = { width: "100%", height: "100%", id: "_" + ("" + Math.random()).slice(9), allowfullscreen: true, allowscriptaccess: "always", quality: "high", version: [3, 0], onFail: null, expressInstall: null, w3c: false, cachebusting: false }; window.attachEvent && window.attachEvent("onbeforeunload", function () { __flash_unloadHandler = function () { }; __flash_savedUnloadHandler = function () { } });
    window.flashembed = function (a, b, c) { if (typeof a == "string") a = document.getElementById(a.replace("#", "")); if (a) { if (typeof b == "string") b = { src: b }; return new m(a, f(f({}, i), b), c) } }; var e = f(window.flashembed, {
        conf: i, getVersion: function () { var a; try { a = navigator.plugins["Shockwave Flash"].description.slice(16) } catch (b) { try { var c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"); a = c && c.GetVariable("$version") } catch (d) { } } return (a = o.exec(a)) ? [a[1], a[3]] : [0, 0] }, asString: function (a) {
            if (a === null || a === undefined) return null;
            var b = typeof a; if (b == "object" && a.push) b = "array"; switch (b) { case "string": a = a.replace(new RegExp('(["\\\\])', "g"), "\\$1"); a = a.replace(/^\s?(\d+\.?\d+)%/, "$1pct"); return '"' + a + '"'; case "array": return "[" + l(a, function (d) { return e.asString(d) }).join(",") + "]"; case "function": return '"function()"'; case "object": b = []; for (var c in a) a.hasOwnProperty(c) && b.push('"' + c + '":' + e.asString(a[c])); return "{" + b.join(",") + "}" } return String(a).replace(/\s/g, " ").replace(/\'/g, '"')
        }, getHTML: function (a, b) {
            a = f({}, a); var c = '<object width="' +
    a.width + '" height="' + a.height + '" id="' + a.id + '" name="' + a.id + '"'; if (a.cachebusting) a.src += (a.src.indexOf("?") != -1 ? "&" : "?") + Math.random(); c += a.w3c || !h ? ' data="' + a.src + '" type="application/x-shockwave-flash"' : ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'; c += ">"; if (a.w3c || h) c += '<param name="movie" value="' + a.src + '" />'; a.width = a.height = a.id = a.w3c = a.src = null; a.onFail = a.version = a.expressInstall = null; for (var d in a) if (a[d]) c += '<param name="' + d + '" value="' + a[d] + '" />'; a = ""; if (b) {
                for (var j in b) if (b[j]) {
                    d =
b[j]; a += j + "=" + (/function|object/.test(typeof d) ? e.asString(d) : d) + "&"
                } a = a.slice(0, -1); c += '<param name="flashvars" value=\'' + a + "' />"
            } c += "</object>"; return c
        }, isSupported: function (a) { return g[0] > a[0] || g[0] == a[0] && g[1] >= a[1] }
    }), g = e.getVersion(); if (n) { jQuery.tools = jQuery.tools || { version: "1.2.3" }; jQuery.tools.flashembed = { conf: i }; jQuery.fn.flashembed = function (a, b) { return this.each(function () { $(this).data("flashembed", flashembed(this, a, b)) }) } }
})();
(function (b) {
    function h(c) { if (c) { var a = d.contentWindow.document; a.open().close(); a.location.hash = c } } var g, d, f, i; b.tools = b.tools || { version: "1.2.3" }; b.tools.history = {
        init: function (c) {
            if (!i) {
                if (b.browser.msie && b.browser.version < "8") { if (!d) { d = b("<iframe/>").attr("src", "javascript:false;").hide().get(0); b("body").append(d); setInterval(function () { var a = d.contentWindow.document; a = a.location.hash; g !== a && b.event.trigger("hash", a) }, 100); h(location.hash || "#") } } else setInterval(function () {
                    var a = location.hash;
                    a !== g && b.event.trigger("hash", a)
                }, 100); f = !f ? c : f.add(c); c.click(function (a) { var e = b(this).attr("href"); d && h(e); if (e.slice(0, 1) != "#") { location.href = "#" + e; return a.preventDefault() } }); i = true
            }
        }
    }; b(window).bind("hash", function (c, a) { a ? f.filter(function () { var e = b(this).attr("href"); return e == a || e == a.replace("#", "") }).trigger("history", [a]) : f.eq(0).trigger("history", [a]); g = a; window.location.hash = g }); b.fn.history = function (c) { b.tools.history.init(this); return this.bind("history", c) }
})(jQuery);
(function (b) {
    function k() { if (b.browser.msie) { var a = b(document).height(), d = b(window).height(); return [window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, a - d < 20 ? d : a] } return [b(document).width(), b(document).height()] } function h(a) { if (a) return a.call(b.mask) } b.tools = b.tools || { version: "1.2.3" }; var l; l = b.tools.expose = {
        conf: {
            maskId: "exposeMask", loadSpeed: "slow", closeSpeed: "fast", closeOnClick: true, closeOnEsc: true, zIndex: 9998, opacity: 0.8, startOpacity: 0, color: "#fff", onLoad: null,
            onClose: null
        }
    }; var c, i, f, g, j; b.mask = {
        load: function (a, d) {
            if (f) return this; if (typeof a == "string") a = { color: a }; a = a || g; g = a = b.extend(b.extend({}, l.conf), a); c = b("#" + a.maskId); if (!c.length) { c = b("<div/>").attr("id", a.maskId); b("body").append(c) } var m = k(); c.css({ position: "absolute", top: 0, left: 0, width: m[0], height: m[1], display: "none", opacity: a.startOpacity, zIndex: a.zIndex }); a.color && c.css("backgroundColor", a.color); if (h(a.onBeforeLoad) === false) return this; a.closeOnEsc && b(document).bind("keydown.mask", function (e) {
                e.keyCode ==
    27 && b.mask.close(e)
            }); a.closeOnClick && c.bind("click.mask", function (e) { b.mask.close(e) }); b(window).bind("resize.mask", function () { b.mask.fit() }); if (d && d.length) { j = d.eq(0).css("zIndex"); b.each(d, function () { var e = b(this); /relative|absolute|fixed/i.test(e.css("position")) || e.css("position", "relative") }); i = d.css({ zIndex: Math.max(a.zIndex + 1, j == "auto" ? 0 : j) }) } c.css({ display: "block" }).fadeTo(a.loadSpeed, a.opacity, function () { b.mask.fit(); h(a.onLoad) }); f = true; return this
        }, close: function () {
            if (f) {
                if (h(g.onBeforeClose) ===
    false) return this; c.fadeOut(g.closeSpeed, function () { h(g.onClose); i && i.css({ zIndex: j }) }); b(document).unbind("keydown.mask"); c.unbind("click.mask"); b(window).unbind("resize.mask"); f = false
            } return this
        }, fit: function () { if (f) { var a = k(); c.css({ width: a[0], height: a[1] }) } }, getMask: function () { return c }, isLoaded: function () { return f }, getConf: function () { return g }, getExposed: function () { return i }
    }; b.fn.mask = function (a) { b.mask.load(a); return this }; b.fn.expose = function (a) { b.mask.load(a, this); return this }
})(jQuery);
(function (b) {
    function c(a) { switch (a.type) { case "mousemove": return b.extend(a.data, { clientX: a.clientX, clientY: a.clientY, pageX: a.pageX, pageY: a.pageY }); case "DOMMouseScroll": b.extend(a, a.data); a.delta = -a.detail / 3; break; case "mousewheel": a.delta = a.wheelDelta / 120; break } a.type = "wheel"; return b.event.handle.call(this, a, a.delta) } b.fn.mousewheel = function (a) { return this[a ? "bind" : "trigger"]("wheel", a) }; b.event.special.wheel = {
        setup: function () { b.event.add(this, d, c, {}) }, teardown: function () {
            b.event.remove(this,
    d, c)
        }
    }; var d = !b.browser.mozilla ? "mousewheel" : "DOMMouseScroll" + (b.browser.version < "1.9" ? " mousemove" : "")
})(jQuery);


/*	

jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)

Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.

Original is (c) Dojo Foundation 2004-2009. Released under either AFL or new BSD, see:
http://dojofoundation.org/license for more information.

*/

; (function (d) {

    // the topic/subscription hash
    var cache = {};

    d.publish = function (/* String */topic, /* Array? */args) {
        // summary: 
        //		Publish some data on a named topic.
        // topic: String
        //		The channel to publish on
        // args: Array?
        //		The data to publish. Each array item is converted into an ordered
        //		arguments on the subscribed functions. 
        //
        // example:
        //		Publish stuff on '/some/topic'. Anything subscribed will be called
        //		with a function signature like: function(a,b,c){ ... }
        //
        //	|		$.publish("/some/topic", ["a","b","c"]);
        d.each(cache[topic], function () {
            this.apply(d, args || []);
        });
    };

    d.subscribe = function (/* String */topic, /* Function */callback) {
        // summary:
        //		Register a callback on a named topic.
        // topic: String
        //		The channel to subscribe to
        // callback: Function
        //		The handler event. Anytime something is $.publish'ed on a 
        //		subscribed channel, the callback will be called with the
        //		published array as ordered arguments.
        //
        // returns: Array
        //		A handle which can be used to unsubscribe this particular subscription.
        //	
        // example:
        //	|	$.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
        //
        if (!cache[topic]) {
            cache[topic] = [];
        }
        cache[topic].push(callback);
        return [topic, callback]; // Array
    };

    d.unsubscribe = function (/* Array */handle) {
        // summary:
        //		Disconnect a subscribed function for a topic.
        // handle: Array
        //		The return value from a $.subscribe call.
        // example:
        //	|	var handle = $.subscribe("/something", function(){});
        //	|	$.unsubscribe(handle);

        var t = handle[0];
        cache[t] && d.each(cache[t], function (idx) {
            if (this == handle[1]) {
                cache[t].splice(idx, 1);
            }
        });
    };

})(jQuery);

//*******************************************************************
//
// Tooltip functions
//*******************************************************************

(function ($) {
    $.fn.tipTip = function (options) {
        var defaults = {
            activation: "focus&hover",
            keepAlive: false,
            maxWidth: "250px",
            edgeOffset: 7,
            defaultPosition: "bottom",
            delay: 1000,
            fadeIn: 0,
            fadeOut: 0,
            attribute: "title",
            content: false, // HTML or String to fill TipTIp with
            enter: function () { },
            exit: function () { },
            onactivate: function () { return true; }
        };
        var opts = $.extend(defaults, options);

        // Setup tip tip elements and render them to the DOM
        if ($("#tiptip_holder").length <= 0) {
            var tiptip_holder = $('<div id="tiptip_holder" style="max-width:' + opts.maxWidth + ';"></div>');
            var tiptip_content = $('<div id="tiptip_content"></div>');
            var tiptip_arrow = $('<div id="tiptip_arrow"></div>');
            $("body").append(tiptip_holder.html(tiptip_content).prepend(tiptip_arrow.html('<div id="tiptip_arrow_inner"></div>')));
        } else {
            var tiptip_holder = $("#tiptip_holder");
            var tiptip_content = $("#tiptip_content");
            var tiptip_arrow = $("#tiptip_arrow");
        }

        // declare the variables so there's no error the first time they're used
        var intooltip = false;
        npyTimeout = false;

        return this.each(function () {
            var org_elem = $(this);
            if (opts.content) {
                var org_title = opts.content;
            } else {
                var org_title = org_elem.attr(opts.attribute);
            }
            if (org_title != "" && org_title != undefined && org_title != null) {
                if (!opts.content) {
                    org_elem.removeAttr(opts.attribute); //remove original Attribute
                }
                var timeout = false;

                if (opts.activation == "hover") {
                    org_elem.hover(function () {
                        // so it doesn't fade out later (if we moused back over)
                        if (npyTimeout)
                            clearTimeout(npyTimeout);
                        active_tiptip();
                    }, function (e) {
                        var insideToolTip = $(e.relatedTarget).is('#tiptip_holder *');
                        if (!opts.keepAlive) {
                            deactive_tiptip();
                        } else {
                            // deactivate only after a timeout (to let them mouse into the tooltip
                            npyTimeout = setTimeout(function () {
                                if (!intooltip)
                                    deactive_tiptip();
                            }, 500);
                            //Used to keep track of the resources that may not be released before an
                            //ajax post is done. Solution to the memory leak issue in PFM-1722.
                            tooltipTimeouts.push(npyTimeout);
                            tiptipHolders.push(tiptip_holder);
                        }
                    });
                    if (opts.keepAlive) {
                        // keep track of whether we're in the tooltip
                        tiptip_holder.hover(function () { intooltip = true; }, function () {
                            intooltip = false;
                            deactive_tiptip();
                        });
                    }
                    tiptip_holder.mouseleave(function () { deactive_tiptip(); });
                } else if (opts.activation == "focus") {
                    org_elem.focus(function () {
                        active_tiptip();
                    }).blur(function () {
                        deactive_tiptip();
                    });
                } else if (opts.activation == "click") {
                    org_elem.click(function () {
                        active_tiptip();
                        return false;
                    }).hover(function () { }, function () {
                        if (!opts.keepAlive) {
                            deactive_tiptip();
                        }
                    });
                    if (opts.keepAlive) {
                        tiptip_holder.hover(function () { }, function () {
                            deactive_tiptip();
                        });
                    }
                } else if (opts.activation == "focus&hover") {
                    org_elem.focus(function () {
                        active_tiptip();
                    }).blur(function () {
                        deactive_tiptip();
                    });
                    org_elem.hover(function () {
                        // so it doesn't fade out later (if we moused back over)
                        if (npyTimeout)
                            clearTimeout(npyTimeout);
                        active_tiptip();
                    }, function (e) {
                        var insideToolTip = $(e.relatedTarget).is('#tiptip_holder *');
                        if (!opts.keepAlive) {
                            deactive_tiptip();
                        } else {
                            // deactivate only after a timeout (to let them mouse into the tooltip
                            npyTimeout = setTimeout(function () {
                                if (!intooltip)
                                    deactive_tiptip();
                            }, 500);
                            //Used to keep track of the resources that may not be released before an
                            //ajax post is done. Solution to the memory leak issue in PFM-1722.
                            tooltipTimeouts.push(npyTimeout);
                            tiptipHolders.push(tiptip_holder);
                        }
                    });
                    if (opts.keepAlive) {
                        // keep track of whether we're in the tooltip
                        tiptip_holder.hover(function () { intooltip = true; }, function () {
                            intooltip = false;
                            deactive_tiptip();
                        });
                    }
                    tiptip_holder.mouseleave(function () { deactive_tiptip(); });
                }

                function change_message(newMessage) {
                    deactive_tiptip();
                    org_elem.attr('title', newMessage);
                    org_elem.removeClass('dynamic');
                    active_tiptip();
                }

                function active_tiptip() {
                    opts.enter.call(this);
                    //alert(opts.onactivate);
                    if (!opts.onactivate(org_elem)) { return; };
                    if (org_elem.hasClass('dynamic')) {
                        org_elem.attr('title', 'loading...&nbsp;<img src="' + REISys.Platform.ImageRoot + '/loadingAnimation.gif" style="width:100px" />');
                        var dynamicTooltipUrl = org_elem.attr('dynamictooltipurl');
                        $.ajax({
                            url: dynamicTooltipUrl,
                            timeout: 2000,
                            success: function (result) { change_message(result); },
                            error: function (xhr, message) { change_message('<img src="' + REISys.Platform.ImageRoot + '/error-red.png" /> error getting tooltip'); }
                        });
                    }
                    //overridePos
                    var reiContent = org_elem.attr(opts.attribute) || org_title;
                    org_title = reiContent;
                    org_elem.removeAttr(opts.attribute);
                    tiptip_content.html(reiContent); //org_title);

                    tiptip_holder.hide().removeAttr("class").css("margin", "0");
                    tiptip_arrow.removeAttr("style");

                    var top = parseInt(org_elem.offset()['top']);
                    var left = parseInt(org_elem.offset()['left']);
                    var org_width = parseInt(org_elem.outerWidth());
                    var org_height = parseInt(org_elem.outerHeight());
                    var tip_w = tiptip_holder.outerWidth();
                    var tip_h = tiptip_holder.outerHeight();
                    var w_compare = Math.round((org_width - tip_w) / 2);
                    var h_compare = Math.round((org_height - tip_h) / 2);
                    var marg_left = Math.round(left + w_compare);
                    var marg_top = Math.round(top + org_height + opts.edgeOffset);
                    var t_class = "";
                    var arrow_top = "";
                    var arrow_left = Math.round(tip_w - 12) / 2;
                    //org_elem.attr('tooltip-pos') = 'none';
                    var overRidePos;
                    if (org_elem.attr('tooltip-pos') != undefined) {
                        overRidePos = org_elem.attr('tooltip-pos');
                    }
                    else
                        overRidePos = opts.defaultPosition

                    if (overRidePos == "bottom") {
                        t_class = "_bottom";
                    } else if (overRidePos == "top") {
                        t_class = "_top";
                    } else if (overRidePos == "left") {
                        t_class = "_left";
                    } else if (overRidePos == "right") {
                        t_class = "_right";
                    }


                    var right_compare = (w_compare + left) < parseInt($(window).scrollLeft());
                    var left_compare = (tip_w + left) > parseInt($(window).width());

                    if ((right_compare && w_compare < 0) || (t_class == "_right" && !left_compare) || (t_class == "_left" && left < (tip_w + opts.edgeOffset + 5))) {
                        t_class = "_right";
                        arrow_top = Math.round(tip_h - 13) / 2;
                        arrow_left = -12;
                        marg_left = Math.round(left + org_width + opts.edgeOffset);
                        marg_top = Math.round(top + h_compare);
                    } else if (overRidePos != 'top' && (left_compare && w_compare < 0) || (t_class == "_left" && !right_compare)) {
                        //} else if ((left_compare && w_compare < 0) || (t_class == "_left" && !right_compare)) {
                        t_class = "_left";
                        arrow_top = Math.round(tip_h - 13) / 2;
                        arrow_left = Math.round(tip_w);
                        marg_left = Math.round(left - (tip_w + opts.edgeOffset + 5));
                        marg_top = Math.round(top + h_compare);
                    }

                    var top_compare = (top + org_height + opts.edgeOffset + tip_h + 8) > parseInt($(window).height() + $(window).scrollTop());
                    var bottom_compare = ((top + org_height) - (opts.edgeOffset + tip_h + 8)) < 0;

                    if (top_compare || (t_class == "_bottom" && top_compare) || (t_class == "_top" && !bottom_compare)) {
                        if (t_class == "_top" || t_class == "_bottom") {
                            t_class = "_top";
                        } else {
                            t_class = t_class + "_top";
                        }
                        arrow_top = tip_h;
                        marg_top = Math.round(top - (tip_h + 5 + opts.edgeOffset));
                    } else if (bottom_compare | (t_class == "_top" && bottom_compare) || (t_class == "_bottom" && !top_compare)) {
                        if (t_class == "_top" || t_class == "_bottom") {
                            t_class = "_bottom";
                        } else {
                            t_class = t_class + "_bottom";
                        }
                        arrow_top = -12;
                        marg_top = Math.round(top + org_height + opts.edgeOffset);
                    }

                    if (t_class == "_right_top" || t_class == "_left_top") {
                        marg_top = marg_top + 5;
                    } else if (t_class == "_right_bottom" || t_class == "_left_bottom") {
                        marg_top = marg_top - 5;
                    }
                    if (t_class == "_left_top" || t_class == "_left_bottom") {
                        marg_left = marg_left + 5;
                    }
                    tiptip_arrow.css({ "margin-left": arrow_left + "px", "margin-top": arrow_top + "px" });
                    tiptip_holder.css({ "margin-left": marg_left + "px", "margin-top": marg_top + "px" }).attr("class", "tip" + t_class);

                    if (reiContent == undefined) {
                        reiContent = null;
                        tiptip_content.hide();
                        tiptip_arrow.hide();
                    }
                    else {
                        tiptip_arrow.show();
                        tiptip_content.show();
                    }


                    //                    switch (overRidePos) {
                    //                        case 'bottom':
                    //                            arrow_top = -12;
                    //                            marg_top = Math.round(top + org_height + opts.edgeOffset);
                    //                            marg_top = Math.round(top + org_height + opts.edgeOffset);
                    //                            tiptip_arrow.css({ "margin-left": arrow_left + "px", "margin-top": (arrow_top) + "px" });
                    //                            tiptip_holder.css({ "margin-left": marg_left + "px", "margin-top": (marg_top) + "px" }).attr("class", "tip" + "_bottom");
                    //                            break;
                    //                        case 'top':
                    //                            break;
                    //                        case 'left':
                    //                            break;
                    //                        case 'right':
                    //                            break;
                    //                        default:
                    //                            tiptip_arrow.css({ "margin-left": arrow_left + "px", "margin-top": arrow_top + "px" });
                    //                            tiptip_holder.css({ "margin-left": marg_left + "px", "margin-top": marg_top + "px" }).attr("class", "tip" + t_class);
                    //                            break;
                    //                    }
                    if (timeout) { clearTimeout(timeout); }
                    timeout = setTimeout(function () { tiptip_holder.stop(true, true).fadeIn(opts.fadeIn); }, opts.delay);
                }
                function deactive_tiptip() {
                    opts.exit.call(this);
                    if (timeout) { clearTimeout(timeout); }
                    tiptip_holder.fadeOut(opts.fadeOut);

                    //If this function is called to cleanup resources before the ajax request is made
                    //then we will remove all the elements from the tooltipTimeouts stack.
                    while (tooltipTimeouts.length > 0) {
                        clearTimeout(tooltipTimeouts.pop());
                    }
                    //If this function is called to cleanup resources before the ajax request is made
                    //then remove all except the last element on the tiptipholders stack.
                    while (tiptipHolders.length > 1) {
                        tiptipHolders.pop().fadeOut(opts.fadeOut);
                    }
                };
                $.fn.tipTip.external_deactive_tiptip = function () {
                    deactive_tiptip();
                };
            }
        });
    }
})(jQuery);

//********************************************************************
//
// Truncate functions
//
//********************************************************************
jQuery.fn.truncate = function (max, settings) {
    settings = jQuery.extend({
        chars: /\s/,
        trail: ["...", ""]
    }, settings);
    var myResults = {};
    var ie = $.browser.msie;
    function fixIE(o) {
        if (ie) {
            o.style.removeAttribute("filter");
        }
    }
    return this.each(function () {
        var $this = jQuery(this);
        var myStrOrig = $this.html().replace(/\r\n/gim, "");
        var myStr = myStrOrig;
        var myRegEx = /<\/?[^<>]*\/?>/gim;
        var myRegExArray;
        var myRegExHash = {};
        var myResultsKey = $("*").index(this);
        var orgMax = max;
        while ((myRegExArray = myRegEx.exec(myStr)) != null) {
            myRegExHash[myRegExArray.index] = myRegExArray[0];
        }
        myStr = jQuery.trim(myStr.split(myRegEx).join(""));
        if (myStr.length > max) {
            var c;
            while (max < myStr.length) {
                c = myStr.charAt(max);
                if (c.match(settings.chars)) {
                    myStr = myStr.substring(0, max);
                    break;
                }
                if (max == 0) {
                    myStr = myStrOrig.substring(0, orgMax); /*PFM-2316: Bug fix until a patch is made to fix this problem*/
                    break;
                }
                max--;
            }
            if (myStrOrig.search(myRegEx) != -1) {
                var endCap = 0;
                for (eachEl in myRegExHash) {
                    myStr = [myStr.substring(0, eachEl), myRegExHash[eachEl], myStr.substring(eachEl, myStr.length)].join("");
                    if (eachEl < myStr.length) {
                        endCap = myStr.length;
                    }
                }
                $this.html([myStr.substring(0, endCap), myStr.substring(endCap, myStr.length).replace(/<(\w+)[^>]*>.*<\/\1>/gim, "").replace(/<(br|hr|img|input)[^<>]*\/?>/gim, "")].join(""));
            } else {
                $this.html(myStr);
            }
            myResults[myResultsKey] = myStrOrig;
            $this.html(["<span class='truncate_less'>", $this.html(), settings.trail[0], "</span>"].join(""))
            .find(".truncate_show", this).click(function () {
                if ($this.find(".truncate_more").length == 0) {
                    $this.append(["<span class='truncate_more' style='display: none;'>", myResults[myResultsKey], settings.trail[1], "</span>"].join(""))
                    .find(".truncate_hide").click(function () {
                        $this.find(".truncate_more").css("background", "#fff").fadeOut("fast", function () {
                            $this.find(".truncate_less").css("background", "#fff").fadeIn("fast", function () {
                                fixIE(this);
                                $(this).css("background", "none");
                            });
                            fixIE(this);
                            $this.find('.truncate_less > a').focus();
                        });
                        return false;
                    });
                }
                $this.find(".truncate_less").fadeOut("normal", function () {
                    $this.find(".truncate_more").fadeIn("normal", function () {
                        fixIE(this);
                    });
                    fixIE(this);
                    $this.find('.truncate_more > a').focus();
                });
                jQuery(".truncate_show", $this).click(function () {
                    $this.find(".truncate_less").css("background", "#fff").fadeOut("normal", function () {
                        $this.find(".truncate_more").css("background", "#fff").fadeIn("normal", function () {
                            fixIE(this);
                            $(this).css("background", "none");
                        });
                        fixIE(this);
                        $this.find('.truncate_more > a').focus();
                    });
                    return false;
                });
                return false;
            });
        }
    });
};


/*
* jQuery validation plug-in 1.7
*
* http://bassistance.de/jquery-plugins/jquery-plugin-validation/
* http://docs.jquery.com/Plugins/Validation
*
* Copyright (c) 2006 - 2008 JÃ¶rn Zaefferer
*
* $Id: jquery.validate.js 6403 2009-06-17 14:27:16Z joern.zaefferer $
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/
(function ($) {
    $.extend($.fn, { validate: function (options) { if (!this.length) { options && options.debug && window.console && console.warn("nothing selected, can't validate, returning nothing"); return; } var validator = $.data(this[0], 'validator'); if (validator) { return validator; } validator = new $.validator(options, this[0]); $.data(this[0], 'validator', validator); if (validator.settings.onsubmit) { this.find("input, button").filter(".cancel").click(function () { validator.cancelSubmit = true; }); if (validator.settings.submitHandler) { this.find("input, button").filter(":submit").click(function () { validator.submitButton = this; }); } this.submit(function (event) { if (validator.settings.debug) event.preventDefault(); function handle() { if (validator.settings.submitHandler) { if (validator.submitButton) { var hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm); } validator.settings.submitHandler.call(validator, validator.currentForm); if (validator.submitButton) { hidden.remove(); } return false; } return true; } if (validator.cancelSubmit) { validator.cancelSubmit = false; return handle(); } if (validator.form()) { if (validator.pendingRequest) { validator.formSubmitted = true; return false; } return handle(); } else { validator.focusInvalid(); return false; } }); } return validator; }, valid: function () { if ($(this[0]).is('form')) { return this.validate().form(); } else { var valid = true; var validator = $(this[0].form).validate(); this.each(function () { valid &= validator.element(this); }); return valid; } }, removeAttrs: function (attributes) { var result = {}, $element = this; $.each(attributes.split(/\s/), function (index, value) { result[value] = $element.attr(value); $element.removeAttr(value); }); return result; }, rules: function (command, argument) { var element = this[0]; if (command) { var settings = $.data(element.form, 'validator').settings; var staticRules = settings.rules; var existingRules = $.validator.staticRules(element); switch (command) { case "add": $.extend(existingRules, $.validator.normalizeRule(argument)); staticRules[element.name] = existingRules; if (argument.messages) settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages); break; case "remove": if (!argument) { delete staticRules[element.name]; return existingRules; } var filtered = {}; $.each(argument.split(/\s/), function (index, method) { filtered[method] = existingRules[method]; delete existingRules[method]; }); return filtered; } } var data = $.validator.normalizeRules($.extend({}, $.validator.metadataRules(element), $.validator.classRules(element), $.validator.attributeRules(element), $.validator.staticRules(element)), element); if (data.required) { var param = data.required; delete data.required; data = $.extend({ required: param }, data); } return data; } }); $.extend($.expr[":"], { blank: function (a) { return !$.trim("" + a.value); }, filled: function (a) { return !!$.trim("" + a.value); }, unchecked: function (a) { return !a.checked; } }); $.validator = function (options, form) { this.settings = $.extend(true, {}, $.validator.defaults, options); this.currentForm = form; this.init(); }; $.validator.format = function (source, params) { if (arguments.length == 1) return function () { var args = $.makeArray(arguments); args.unshift(source); return $.validator.format.apply(this, args); }; if (arguments.length > 2 && params.constructor != Array) { params = $.makeArray(arguments).slice(1); } if (params.constructor != Array) { params = [params]; } $.each(params, function (i, n) { source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n); }); return source; }; $.extend($.validator, {
        defaults: { messages: {}, groups: {}, rules: {}, errorClass: "error", validClass: "valid", errorElement: "label", focusInvalid: true, errorContainer: $([]), errorLabelContainer: $([]), onsubmit: true, ignore: [], ignoreTitle: false, onfocusin: function (element) { this.lastActive = element; if (this.settings.focusCleanup && !this.blockFocusCleanup) { this.settings.unhighlight && this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass); this.errorsFor(element).hide(); } }, onfocusout: function (element) { if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) { this.element(element); } }, onkeyup: function (element) { if (element.name in this.submitted || element == this.lastElement) { this.element(element); } }, onclick: function (element) { if (element.name in this.submitted) this.element(element); else if (element.parentNode.name in this.submitted) this.element(element.parentNode); }, highlight: function (element, errorClass, validClass) { $(element).addClass(errorClass).removeClass(validClass); }, unhighlight: function (element, errorClass, validClass) { $(element).removeClass(errorClass).addClass(validClass); } }, setDefaults: function (settings) { $.extend($.validator.defaults, settings); }, messages: { required: "This field is required.", remote: "Please fix this field.", email: "Please enter a valid email address.", url: "Please enter a valid URL.", date: "Please enter a valid date.", dateISO: "Please enter a valid date (ISO).", number: "Please enter a valid number.", digits: "Please enter only digits.", creditcard: "Please enter a valid credit card number.", equalTo: "Please enter the same value again.", accept: "Please enter a value with a valid extension.", maxlength: $.validator.format("Please enter no more than {0} characters."), minlength: $.validator.format("Please enter at least {0} characters."), rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."), range: $.validator.format("Please enter a value between {0} and {1}."), max: $.validator.format("Please enter a value less than or equal to {0}."), min: $.validator.format("Please enter a value greater than or equal to {0}.") }, autoCreateRanges: false, prototype: {
            init: function () { this.labelContainer = $(this.settings.errorLabelContainer); this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm); this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer); this.submitted = {}; this.valueCache = {}; this.pendingRequest = 0; this.pending = {}; this.invalid = {}; this.reset(); var groups = (this.groups = {}); $.each(this.settings.groups, function (key, value) { $.each(value.split(/\s/), function (index, name) { groups[name] = key; }); }); var rules = this.settings.rules; $.each(rules, function (key, value) { rules[key] = $.validator.normalizeRule(value); }); function delegate(event) { var validator = $.data(this[0].form, "validator"), eventType = "on" + event.type.replace(/^validate/, ""); validator.settings[eventType] && validator.settings[eventType].call(validator, this[0]); } $(this.currentForm).validateDelegate(":text, :password, :file, select, textarea", "focusin focusout keyup", delegate).validateDelegate(":radio, :checkbox, select, option", "click", delegate); if (this.settings.invalidHandler) $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler); }, form: function () { this.checkForm(); $.extend(this.submitted, this.errorMap); this.invalid = $.extend({}, this.errorMap); if (!this.valid()) $(this.currentForm).triggerHandler("invalid-form", [this]); this.showErrors(); return this.valid(); }, checkForm: function () { this.prepareForm(); for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) { this.check(elements[i]); } return this.valid(); }, element: function (element) { element = this.clean(element); this.lastElement = element; this.prepareElement(element); this.currentElements = $(element); var result = this.check(element); if (result) { delete this.invalid[element.name]; } else { this.invalid[element.name] = true; } if (!this.numberOfInvalids()) { this.toHide = this.toHide.add(this.containers); } this.showErrors(); return result; }, showErrors: function (errors) { if (errors) { $.extend(this.errorMap, errors); this.errorList = []; for (var name in errors) { this.errorList.push({ message: errors[name], element: this.findByName(name)[0] }); } this.successList = $.grep(this.successList, function (element) { return !(element.name in errors); }); } this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors(); }, resetForm: function () { if ($.fn.resetForm) $(this.currentForm).resetForm(); this.submitted = {}; this.prepareForm(); this.hideErrors(); this.elements().removeClass(this.settings.errorClass); }, numberOfInvalids: function () { return this.objectLength(this.invalid); }, objectLength: function (obj) { var count = 0; for (var i in obj) count++; return count; }, hideErrors: function () { this.addWrapper(this.toHide).hide(); }, valid: function () { return this.size() == 0; }, size: function () { return this.errorList.length; }, focusInvalid: function () { if (this.settings.focusInvalid) { try { $(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin"); } catch (e) { } } }, findLastActive: function () { var lastActive = this.lastActive; return lastActive && $.grep(this.errorList, function (n) { return n.element.name == lastActive.name; }).length == 1 && lastActive; }, elements: function () { var validator = this, rulesCache = {}; return $([]).add(this.currentForm.elements).filter(":input").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () { !this.name && validator.settings.debug && window.console && console.error("%o has no name assigned", this); if (this.name in rulesCache || !validator.objectLength($(this).rules())) return false; rulesCache[this.name] = true; return true; }); }, clean: function (selector) { return $(selector)[0]; }, errors: function () { return $(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext); }, reset: function () { this.successList = []; this.errorList = []; this.errorMap = {}; this.toShow = $([]); this.toHide = $([]); this.currentElements = $([]); }, prepareForm: function () { this.reset(); this.toHide = this.errors().add(this.containers); }, prepareElement: function (element) { this.reset(); this.toHide = this.errorsFor(element); }, check: function (element) {
                element = this.clean(element); if (this.checkable(element)) { element = this.findByName(element.name)[0]; } var rules = $(element).rules(); var dependencyMismatch = false; for (method in rules) {
                    var rule = { method: method, parameters: rules[method] }; try { var result = $.validator.methods[method].call(this, element.value.replace(/\r/g, ""), element, rule.parameters); if (result == "dependency-mismatch") { dependencyMismatch = true; continue; } dependencyMismatch = false; if (result == "pending") { this.toHide = this.toHide.not(this.errorsFor(element)); return; } if (!result) { this.formatAndAdd(element, rule); return false; } } catch (e) {
                        this.settings.debug && window.console && console.log("exception occured when checking element " + element.id
        + ", check the '" + rule.method + "' method", e); throw e;
                    }
                } if (dependencyMismatch) return; if (this.objectLength(rules)) this.successList.push(element); return true;
            }, customMetaMessage: function (element, method) { if (!$.metadata) return; var meta = this.settings.meta ? $(element).metadata()[this.settings.meta] : $(element).metadata(); return meta && meta.messages && meta.messages[method]; }, customMessage: function (name, method) { var m = this.settings.messages[name]; return m && (m.constructor == String ? m : m[method]); }, findDefined: function () { for (var i = 0; i < arguments.length; i++) { if (arguments[i] !== undefined) return arguments[i]; } return undefined; }, defaultMessage: function (element, method) { return this.findDefined(this.customMessage(element.name, method), this.customMetaMessage(element, method), !this.settings.ignoreTitle && element.title || undefined, $.validator.messages[method], "<strong>Warning: No message defined for " + element.name + "</strong>"); }, formatAndAdd: function (element, rule) { var message = this.defaultMessage(element, rule.method), theregex = /\$?\{(\d+)\}/g; if (typeof message == "function") { message = message.call(this, rule.parameters, element); } else if (theregex.test(message)) { message = jQuery.format(message.replace(theregex, '{$1}'), rule.parameters); } this.errorList.push({ message: message, element: element }); this.errorMap[element.name] = message; this.submitted[element.name] = message; }, addWrapper: function (toToggle) { if (this.settings.wrapper) toToggle = toToggle.add(toToggle.parent(this.settings.wrapper)); return toToggle; }, defaultShowErrors: function () { for (var i = 0; this.errorList[i]; i++) { var error = this.errorList[i]; this.settings.highlight && this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass); this.showLabel(error.element, error.message); } if (this.errorList.length) { this.toShow = this.toShow.add(this.containers); } if (this.settings.success) { for (var i = 0; this.successList[i]; i++) { this.showLabel(this.successList[i]); } } if (this.settings.unhighlight) { for (var i = 0, elements = this.validElements(); elements[i]; i++) { this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass); } } this.toHide = this.toHide.not(this.toShow); this.hideErrors(); this.addWrapper(this.toShow).show(); }, validElements: function () { return this.currentElements.not(this.invalidElements()); }, invalidElements: function () { return $(this.errorList).map(function () { return this.element; }); }, showLabel: function (element, message) { var label = this.errorsFor(element); if (label.length) { label.removeClass().addClass(this.settings.errorClass); label.attr("generated") && label.html(message); } else { label = $("<" + this.settings.errorElement + "/>").attr({ "for": this.idOrName(element), generated: true }).addClass(this.settings.errorClass).html(message || ""); if (this.settings.wrapper) { label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent(); } if (!this.labelContainer.append(label).length) this.settings.errorPlacement ? this.settings.errorPlacement(label, $(element)) : label.insertAfter(element); } if (!message && this.settings.success) { label.text(""); typeof this.settings.success == "string" ? label.addClass(this.settings.success) : this.settings.success(label); } this.toShow = this.toShow.add(label); }, errorsFor: function (element) { var name = this.idOrName(element); return this.errors().filter(function () { return $(this).attr('for') == name; }); }, idOrName: function (element) { return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name); }, checkable: function (element) { return /radio|checkbox/i.test(element.type); }, findByName: function (name) { var form = this.currentForm; return $(document.getElementsByName(name)).map(function (index, element) { return element.form == form && element.name == name && element || null; }); }, getLength: function (value, element) { switch (element.nodeName.toLowerCase()) { case 'select': return $("option:selected", element).length; case 'input': if (this.checkable(element)) return this.findByName(element.name).filter(':checked').length; } return value.length; }, depend: function (param, element) { return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true; }, dependTypes: { "boolean": function (param, element) { return param; }, "string": function (param, element) { return !!$(param, element.form).length; }, "function": function (param, element) { return param(element); } }, optional: function (element) { return !$.validator.methods.required.call(this, $.trim(element.value), element) && "dependency-mismatch"; }, startRequest: function (element) { if (!this.pending[element.name]) { this.pendingRequest++; this.pending[element.name] = true; } }, stopRequest: function (element, valid) { this.pendingRequest--; if (this.pendingRequest < 0) this.pendingRequest = 0; delete this.pending[element.name]; if (valid && this.pendingRequest == 0 && this.formSubmitted && this.form()) { $(this.currentForm).submit(); this.formSubmitted = false; } else if (!valid && this.pendingRequest == 0 && this.formSubmitted) { $(this.currentForm).triggerHandler("invalid-form", [this]); this.formSubmitted = false; } }, previousValue: function (element) { return $.data(element, "previousValue") || $.data(element, "previousValue", { old: null, valid: true, message: this.defaultMessage(element, "remote") }); }
        }, classRuleSettings: { required: { required: true }, email: { email: true }, url: { url: true }, date: { date: true }, dateISO: { dateISO: true }, dateDE: { dateDE: true }, number: { number: true }, numberDE: { numberDE: true }, digits: { digits: true }, creditcard: { creditcard: true} }, addClassRules: function (className, rules) { className.constructor == String ? this.classRuleSettings[className] = rules : $.extend(this.classRuleSettings, className); }, classRules: function (element) { var rules = {}; var classes = $(element).attr('class'); classes && $.each(classes.split(' '), function () { if (this in $.validator.classRuleSettings) { $.extend(rules, $.validator.classRuleSettings[this]); } }); return rules; }, attributeRules: function (element) { var rules = {}; var $element = $(element); for (method in $.validator.methods) { var value = $element.attr(method); if (value) { rules[method] = value; } } if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) { delete rules.maxlength; } return rules; }, metadataRules: function (element) { if (!$.metadata) return {}; var meta = $.data(element.form, 'validator').settings.meta; return meta ? $(element).metadata()[meta] : $(element).metadata(); }, staticRules: function (element) { var rules = {}; var validator = $.data(element.form, 'validator'); if (validator.settings.rules) { rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {}; } return rules; }, normalizeRules: function (rules, element) { $.each(rules, function (prop, val) { if (val === false) { delete rules[prop]; return; } if (val.param || val.depends) { var keepRule = true; switch (typeof val.depends) { case "string": keepRule = !!$(val.depends, element.form).length; break; case "function": keepRule = val.depends.call(element, element); break; } if (keepRule) { rules[prop] = val.param !== undefined ? val.param : true; } else { delete rules[prop]; } } }); $.each(rules, function (rule, parameter) { rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter; }); $.each(['minlength', 'maxlength', 'min', 'max'], function () { if (rules[this]) { rules[this] = Number(rules[this]); } }); $.each(['rangelength', 'range'], function () { if (rules[this]) { rules[this] = [Number(rules[this][0]), Number(rules[this][1])]; } }); if ($.validator.autoCreateRanges) { if (rules.min && rules.max) { rules.range = [rules.min, rules.max]; delete rules.min; delete rules.max; } if (rules.minlength && rules.maxlength) { rules.rangelength = [rules.minlength, rules.maxlength]; delete rules.minlength; delete rules.maxlength; } } if (rules.messages) { delete rules.messages; } return rules; }, normalizeRule: function (data) { if (typeof data == "string") { var transformed = {}; $.each(data.split(/\s/), function () { transformed[this] = true; }); data = transformed; } return data; }, addMethod: function (name, method, message) { $.validator.methods[name] = method; $.validator.messages[name] = message != undefined ? message : $.validator.messages[name]; if (method.length < 3) { $.validator.addClassRules(name, $.validator.normalizeRule(name)); } }, methods: { required: function (value, element, param) { if (!this.depend(param, element)) return "dependency-mismatch"; switch (element.nodeName.toLowerCase()) { case 'select': var val = $(element).val(); return val && val.length > 0; case 'input': if (this.checkable(element)) return this.getLength(value, element) > 0; default: return $.trim(value).length > 0; } }, remote: function (value, element, param) { if (this.optional(element)) return "dependency-mismatch"; var previous = this.previousValue(element); if (!this.settings.messages[element.name]) this.settings.messages[element.name] = {}; previous.originalMessage = this.settings.messages[element.name].remote; this.settings.messages[element.name].remote = previous.message; param = typeof param == "string" && { url: param} || param; if (previous.old !== value) { previous.old = value; var validator = this; this.startRequest(element); var data = {}; data[element.name] = value; $.ajax($.extend(true, { url: param, mode: "abort", port: "validate" + element.name, dataType: "json", data: data, success: function (response) { validator.settings.messages[element.name].remote = previous.originalMessage; var valid = response === true; if (valid) { var submitted = validator.formSubmitted; validator.prepareElement(element); validator.formSubmitted = submitted; validator.successList.push(element); validator.showErrors(); } else { var errors = {}; var message = (previous.message = response || validator.defaultMessage(element, "remote")); errors[element.name] = $.isFunction(message) ? message(value) : message; validator.showErrors(errors); } previous.valid = valid; validator.stopRequest(element, valid); } }, param)); return "pending"; } else if (this.pending[element.name]) { return "pending"; } return previous.valid; }, minlength: function (value, element, param) { return this.optional(element) || this.getLength($.trim(value), element) >= param; }, maxlength: function (value, element, param) { return this.optional(element) || this.getLength($.trim(value), element) <= param; }, rangelength: function (value, element, param) { var length = this.getLength($.trim(value), element); return this.optional(element) || (length >= param[0] && length <= param[1]); }, min: function (value, element, param) { return this.optional(element) || value >= param; }, max: function (value, element, param) { return this.optional(element) || value <= param; }, range: function (value, element, param) { return this.optional(element) || (value >= param[0] && value <= param[1]); }, email: function (value, element) { return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value); }, url: function (value, element) { return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value); }, date: function (value, element) { return this.optional(element) || !/Invalid|NaN/.test(new Date(value)); }, dateISO: function (value, element) { return this.optional(element) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value); }, number: function (value, element) { return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value); }, digits: function (value, element) { return this.optional(element) || /^\d+$/.test(value); }, creditcard: function (value, element) { if (this.optional(element)) return "dependency-mismatch"; if (/[^0-9-]+/.test(value)) return false; var nCheck = 0, nDigit = 0, bEven = false; value = value.replace(/\D/g, ""); for (var n = value.length - 1; n >= 0; n--) { var cDigit = value.charAt(n); var nDigit = parseInt(cDigit, 10); if (bEven) { if ((nDigit *= 2) > 9) nDigit -= 9; } nCheck += nDigit; bEven = !bEven; } return (nCheck % 10) == 0; }, accept: function (value, element, param) { param = typeof param == "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif"; return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i")); }, equalTo: function (value, element, param) { var target = $(param).unbind(".validate-equalTo").bind("blur.validate-equalTo", function () { $(element).valid(); }); return value == target.val(); } }
    }); $.format = $.validator.format;
})(jQuery); ; (function ($) { var ajax = $.ajax; var pendingRequests = {}; $.ajax = function (settings) { settings = $.extend(settings, $.extend({}, $.ajaxSettings, settings)); var port = settings.port; if (settings.mode == "abort") { if (pendingRequests[port]) { pendingRequests[port].abort(); } return (pendingRequests[port] = ajax.apply(this, arguments)); } return ajax.apply(this, arguments); }; })(jQuery); ; (function ($) { if (!jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener) { $.each({ focus: 'focusin', blur: 'focusout' }, function (original, fix) { $.event.special[fix] = { setup: function () { this.addEventListener(original, handler, true); }, teardown: function () { this.removeEventListener(original, handler, true); }, handler: function (e) { arguments[0] = $.event.fix(e); arguments[0].type = fix; return $.event.handle.apply(this, arguments); } }; function handler(e) { e = $.event.fix(e); e.type = fix; return $.event.handle.call(this, e); } }); }; $.extend($.fn, { validateDelegate: function (delegate, type, handler) { return this.bind(type, function (event) { var target = $(event.target); if (target.is(delegate)) { return handler.apply(target, arguments); } }); } }); })(jQuery);

/*
* QUnit - A JavaScript Unit Testing Framework
* 
* http://docs.jquery.com/QUnit
*
* Copyright (c) 2011 John Resig, Jörn Zaefferer
* Dual licensed under the MIT (MIT-LICENSE.txt)
* or GPL (GPL-LICENSE.txt) licenses.
*/

(function (window) {

    var defined = {
        setTimeout: typeof window.setTimeout !== "undefined",
        sessionStorage: (function () {
            try {
                return !!sessionStorage.getItem;
            } catch (e) {
                return false;
            }
        })()
    }

    var testId = 0;

    var Test = function (name, testName, expected, testEnvironmentArg, async, callback) {
        this.name = name;
        this.testName = testName;
        this.expected = expected;
        this.testEnvironmentArg = testEnvironmentArg;
        this.async = async;
        this.callback = callback;
        this.assertions = [];
    };
    Test.prototype = {
        init: function () {
            var tests = id("qunit-tests");
            if (tests) {
                var b = document.createElement("strong");
                b.innerHTML = "Running " + this.name;
                var li = document.createElement("li");
                li.appendChild(b);
                li.id = this.id = "test-output" + testId++;
                tests.appendChild(li);
            }
        },
        setup: function () {
            if (this.module != config.previousModule) {
                if (config.previousModule) {
                    QUnit.moduleDone({
                        name: config.previousModule,
                        failed: config.moduleStats.bad,
                        passed: config.moduleStats.all - config.moduleStats.bad,
                        total: config.moduleStats.all
                    });
                }
                config.previousModule = this.module;
                config.moduleStats = { all: 0, bad: 0 };
                QUnit.moduleStart({
                    name: this.module
                });
            }

            config.current = this;
            this.testEnvironment = extend({
                setup: function () { },
                teardown: function () { }
            }, this.moduleTestEnvironment);
            if (this.testEnvironmentArg) {
                extend(this.testEnvironment, this.testEnvironmentArg);
            }

            QUnit.testStart({
                name: this.testName
            });

            // allow utility functions to access the current test environment
            // TODO why??
            QUnit.current_testEnvironment = this.testEnvironment;

            try {
                if (!config.pollution) {
                    saveGlobal();
                }

                this.testEnvironment.setup.call(this.testEnvironment);
            } catch (e) {
                QUnit.ok(false, "Setup failed on " + this.testName + ": " + e.message);
            }
        },
        run: function () {
            if (this.async) {
                QUnit.stop();
            }

            if (config.notrycatch) {
                this.callback.call(this.testEnvironment);
                return;
            }
            try {
                this.callback.call(this.testEnvironment);
            } catch (e) {
                fail("Test " + this.testName + " died, exception and test follows", e, this.callback);
                QUnit.ok(false, "Died on test #" + (this.assertions.length + 1) + ": " + e.message + " - " + QUnit.jsDump.parse(e));
                // else next test will carry the responsibility
                saveGlobal();

                // Restart the tests if they're blocking
                if (config.blocking) {
                    start();
                }
            }
        },
        teardown: function () {
            try {
                checkPollution();
                this.testEnvironment.teardown.call(this.testEnvironment);
            } catch (e) {
                QUnit.ok(false, "Teardown failed on " + this.testName + ": " + e.message);
            }
        },
        finish: function () {
            if (this.expected && this.expected != this.assertions.length) {
                QUnit.ok(false, "Expected " + this.expected + " assertions, but " + this.assertions.length + " were run");
            }

            var good = 0, bad = 0,
			tests = id("qunit-tests");

            config.stats.all += this.assertions.length;
            config.moduleStats.all += this.assertions.length;

            if (tests) {
                var ol = document.createElement("ol");

                for (var i = 0; i < this.assertions.length; i++) {
                    var assertion = this.assertions[i];

                    var li = document.createElement("li");
                    li.className = assertion.result ? "pass" : "fail";
                    li.innerHTML = assertion.message || (assertion.result ? "okay" : "failed");
                    ol.appendChild(li);

                    if (assertion.result) {
                        good++;
                    } else {
                        bad++;
                        config.stats.bad++;
                        config.moduleStats.bad++;
                    }
                }

                // store result when possible
                defined.sessionStorage && sessionStorage.setItem("qunit-" + this.testName, bad);

                if (bad == 0) {
                    ol.style.display = "none";
                }

                var b = document.createElement("strong");
                b.innerHTML = this.name + " <b class='counts'>(<b class='failed'>" + bad + "</b>, <b class='passed'>" + good + "</b>, " + this.assertions.length + ")</b>";

                addEvent(b, "click", function () {
                    var next = b.nextSibling, display = next.style.display;
                    next.style.display = display === "none" ? "block" : "none";
                });

                addEvent(b, "dblclick", function (e) {
                    var target = e && e.target ? e.target : window.event.srcElement;
                    if (target.nodeName.toLowerCase() == "span" || target.nodeName.toLowerCase() == "b") {
                        target = target.parentNode;
                    }
                    if (window.location && target.nodeName.toLowerCase() === "strong") {
                        window.location.search = "?" + encodeURIComponent(getText([target]).replace(/\(.+\)$/, "").replace(/(^\s*|\s*$)/g, ""));
                    }
                });

                var li = id(this.id);
                li.className = bad ? "fail" : "pass";
                li.style.display = resultDisplayStyle(!bad);
                li.removeChild(li.firstChild);
                li.appendChild(b);
                li.appendChild(ol);

            } else {
                for (var i = 0; i < this.assertions.length; i++) {
                    if (!this.assertions[i].result) {
                        bad++;
                        config.stats.bad++;
                        config.moduleStats.bad++;
                    }
                }
            }

            try {
                QUnit.reset();
            } catch (e) {
                fail("reset() failed, following Test " + this.testName + ", exception and reset fn follows", e, QUnit.reset);
            }

            QUnit.testDone({
                name: this.testName,
                failed: bad,
                passed: this.assertions.length - bad,
                total: this.assertions.length
            });
        },

        queue: function () {
            var test = this;
            synchronize(function () {
                test.init();
            });
            function run() {
                // each of these can by async
                synchronize(function () {
                    test.setup();
                });
                synchronize(function () {
                    test.run();
                });
                synchronize(function () {
                    test.teardown();
                });
                synchronize(function () {
                    test.finish();
                });
            }
            // defer when previous test run passed, if storage is available
            var bad = defined.sessionStorage && +sessionStorage.getItem("qunit-" + this.testName);
            if (bad) {
                run();
            } else {
                synchronize(run);
            };
        }

    }

    var QUnit = {

        // call on start of module test to prepend name to all tests
        module: function (name, testEnvironment) {
            config.currentModule = name;
            config.currentModuleTestEnviroment = testEnvironment;
        },

        asyncTest: function (testName, expected, callback) {
            if (arguments.length === 2) {
                callback = expected;
                expected = 0;
            }

            QUnit.test(testName, expected, callback, true);
        },

        test: function (testName, expected, callback, async) {
            var name = '<span class="test-name">' + testName + '</span>', testEnvironmentArg;

            if (arguments.length === 2) {
                callback = expected;
                expected = null;
            }
            // is 2nd argument a testEnvironment?
            if (expected && typeof expected === 'object') {
                testEnvironmentArg = expected;
                expected = null;
            }

            if (config.currentModule) {
                name = '<span class="module-name">' + config.currentModule + "</span>: " + name;
            }

            if (!validTest(config.currentModule + ": " + testName)) {
                return;
            }

            var test = new Test(name, testName, expected, testEnvironmentArg, async, callback);
            test.module = config.currentModule;
            test.moduleTestEnvironment = config.currentModuleTestEnviroment;
            test.queue();
        },

        /**
        * Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
        */
        expect: function (asserts) {
            config.current.expected = asserts;
        },

        /**
        * Asserts true.
        * @example ok( "asdfasdf".length > 5, "There must be at least 5 chars" );
        */
        ok: function (a, msg) {
            a = !!a;
            var details = {
                result: a,
                message: msg
            };
            msg = escapeHtml(msg);
            QUnit.log(details);
            config.current.assertions.push({
                result: a,
                message: msg
            });
        },

        /**
        * Checks that the first two arguments are equal, with an optional message.
        * Prints out both actual and expected values.
        *
        * Prefered to ok( actual == expected, message )
        *
        * @example equal( format("Received {0} bytes.", 2), "Received 2 bytes." );
        *
        * @param Object actual
        * @param Object expected
        * @param String message (optional)
        */
        equal: function (actual, expected, message) {
            QUnit.push(expected == actual, actual, expected, message);
        },

        notEqual: function (actual, expected, message) {
            QUnit.push(expected != actual, actual, expected, message);
        },

        deepEqual: function (actual, expected, message) {
            QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
        },

        notDeepEqual: function (actual, expected, message) {
            QUnit.push(!QUnit.equiv(actual, expected), actual, expected, message);
        },

        strictEqual: function (actual, expected, message) {
            QUnit.push(expected === actual, actual, expected, message);
        },

        notStrictEqual: function (actual, expected, message) {
            QUnit.push(expected !== actual, actual, expected, message);
        },

        raises: function (block, expected, message) {
            var actual, ok = false;

            if (typeof expected === 'string') {
                message = expected;
                expected = null;
            }

            try {
                block();
            } catch (e) {
                actual = e;
            }

            if (actual) {
                // we don't want to validate thrown error
                if (!expected) {
                    ok = true;
                    // expected is a regexp	
                } else if (QUnit.objectType(expected) === "regexp") {
                    ok = expected.test(actual);
                    // expected is a constructor	
                } else if (actual instanceof expected) {
                    ok = true;
                    // expected is a validation function which returns true is validation passed	
                } else if (expected.call({}, actual) === true) {
                    ok = true;
                }
            }

            QUnit.ok(ok, message);
        },

        start: function () {
            config.semaphore--;
            if (config.semaphore > 0) {
                // don't start until equal number of stop-calls
                return;
            }
            if (config.semaphore < 0) {
                // ignore if start is called more often then stop
                config.semaphore = 0;
            }
            // A slight delay, to avoid any current callbacks
            if (defined.setTimeout) {
                window.setTimeout(function () {
                    if (config.timeout) {
                        clearTimeout(config.timeout);
                    }

                    config.blocking = false;
                    process();
                }, 13);
            } else {
                config.blocking = false;
                process();
            }
        },

        stop: function (timeout) {
            config.semaphore++;
            config.blocking = true;

            if (timeout && defined.setTimeout) {
                clearTimeout(config.timeout);
                config.timeout = window.setTimeout(function () {
                    QUnit.ok(false, "Test timed out");
                    QUnit.start();
                }, timeout);
            }
        }

    };

    // Backwards compatibility, deprecated
    QUnit.equals = QUnit.equal;
    QUnit.same = QUnit.deepEqual;

    // Maintain internal state
    var config = {
        // The queue of tests to run
        queue: [],

        // block until document ready
        blocking: true
    };

    // Load paramaters
    (function () {
        var location = window.location || { search: "", protocol: "file:" },
		GETParams = location.search.slice(1).split('&');

        for (var i = 0; i < GETParams.length; i++) {
            GETParams[i] = decodeURIComponent(GETParams[i]);
            if (GETParams[i] === "noglobals") {
                GETParams.splice(i, 1);
                i--;
                config.noglobals = true;
            } else if (GETParams[i] === "notrycatch") {
                GETParams.splice(i, 1);
                i--;
                config.notrycatch = true;
            } else if (GETParams[i].search('=') > -1) {
                GETParams.splice(i, 1);
                i--;
            }
        }

        // restrict modules/tests by get parameters
        config.filters = GETParams;

        // Figure out if we're running the tests from a server or not
        QUnit.isLocal = !!(location.protocol === 'file:');
    })();

    // Expose the API as global variables, unless an 'exports'
    // object exists, in that case we assume we're in CommonJS
    if (typeof exports === "undefined" || typeof require === "undefined") {
        extend(window, QUnit);
        window.QUnit = QUnit;
    } else {
        extend(exports, QUnit);
        exports.QUnit = QUnit;
    }

    // define these after exposing globals to keep them in these QUnit namespace only
    extend(QUnit, {
        config: config,

        // Initialize the configuration options
        init: function () {
            extend(config, {
                stats: { all: 0, bad: 0 },
                moduleStats: { all: 0, bad: 0 },
                started: +new Date,
                updateRate: 1000,
                blocking: false,
                autostart: true,
                autorun: false,
                filters: [],
                queue: [],
                semaphore: 0
            });

            var tests = id("qunit-tests"),
			banner = id("qunit-banner"),
			result = id("qunit-testresult");

            if (tests) {
                tests.innerHTML = "";
            }

            if (banner) {
                banner.className = "";
            }

            if (result) {
                result.parentNode.removeChild(result);
            }
        },

        /**
        * Resets the test setup. Useful for tests that modify the DOM.
        * 
        * If jQuery is available, uses jQuery's html(), otherwise just innerHTML.
        */
        reset: function () {
            if (window.jQuery) {
                jQuery("#main, #qunit-fixture").html(config.fixture);
            } else {
                var main = id('main') || id('qunit-fixture');
                if (main) {
                    main.innerHTML = config.fixture;
                }
            }
        },

        /**
        * Trigger an event on an element.
        *
        * @example triggerEvent( document.body, "click" );
        *
        * @param DOMElement elem
        * @param String type
        */
        triggerEvent: function (elem, type, event) {
            if (document.createEvent) {
                event = document.createEvent("MouseEvents");
                event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
				0, 0, 0, 0, 0, false, false, false, false, 0, null);
                elem.dispatchEvent(event);

            } else if (elem.fireEvent) {
                elem.fireEvent("on" + type);
            }
        },

        // Safe object type checking
        is: function (type, obj) {
            return QUnit.objectType(obj) == type;
        },

        objectType: function (obj) {
            if (typeof obj === "undefined") {
                return "undefined";

                // consider: typeof null === object
            }
            if (obj === null) {
                return "null";
            }

            var type = Object.prototype.toString.call(obj)
			.match(/^\[object\s(.*)\]$/)[1] || '';

            switch (type) {
                case 'Number':
                    if (isNaN(obj)) {
                        return "nan";
                    } else {
                        return "number";
                    }
                case 'String':
                case 'Boolean':
                case 'Array':
                case 'Date':
                case 'RegExp':
                case 'Function':
                    return type.toLowerCase();
            }
            if (typeof obj === "object") {
                return "object";
            }
            return undefined;
        },

        push: function (result, actual, expected, message) {
            var details = {
                result: result,
                message: message,
                actual: actual,
                expected: expected
            };

            message = escapeHtml(message) || (result ? "okay" : "failed");
            message = '<span class="test-message">' + message + "</span>";
            expected = escapeHtml(QUnit.jsDump.parse(expected));
            actual = escapeHtml(QUnit.jsDump.parse(actual));
            var output = message + '<table><tr class="test-expected"><th>Expected: </th><td><pre>' + expected + '</pre></td></tr>';
            if (actual != expected) {
                output += '<tr class="test-actual"><th>Result: </th><td><pre>' + actual + '</pre></td></tr>';
                output += '<tr class="test-diff"><th>Diff: </th><td><pre>' + QUnit.diff(expected, actual) + '</pre></td></tr>';
            }
            if (!result) {
                var source = sourceFromStacktrace();
                if (source) {
                    details.source = source;
                    output += '<tr class="test-source"><th>Source: </th><td><pre>' + source + '</pre></td></tr>';
                }
            }
            output += "</table>";

            QUnit.log(details);

            config.current.assertions.push({
                result: !!result,
                message: output
            });
        },

        // Logging callbacks; all receive a single argument with the listed properties
        // run test/logs.html for any related changes
        begin: function () { },
        // done: { failed, passed, total, runtime }
        done: function () { },
        // log: { result, actual, expected, message }
        log: function () { },
        // testStart: { name }
        testStart: function () { },
        // testDone: { name, failed, passed, total }
        testDone: function () { },
        // moduleStart: { name }
        moduleStart: function () { },
        // moduleDone: { name, failed, passed, total }
        moduleDone: function () { }
    });

    if (typeof document === "undefined" || document.readyState === "complete") {
        config.autorun = true;
    }

    addEvent(window, "load", function () {
        QUnit.begin({});

        // Initialize the config, saving the execution queue
        var oldconfig = extend({}, config);
        QUnit.init();
        extend(config, oldconfig);

        config.blocking = false;

        var userAgent = id("qunit-userAgent");
        if (userAgent) {
            userAgent.innerHTML = navigator.userAgent;
        }
        var banner = id("qunit-header");
        if (banner) {
            var paramsIndex = location.href.lastIndexOf(location.search);
            if (paramsIndex > -1) {
                var mainPageLocation = location.href.slice(0, paramsIndex);
                if (mainPageLocation == location.href) {
                    banner.innerHTML = '<a href=""> ' + banner.innerHTML + '</a> ';
                } else {
                    var testName = decodeURIComponent(location.search.slice(1));
                    banner.innerHTML = '<a href="' + mainPageLocation + '">' + banner.innerHTML + '</a> &#8250; <a href="">' + testName + '</a>';
                }
            }
        }

        var toolbar = id("qunit-testrunner-toolbar");
        if (toolbar) {
            var filter = document.createElement("input");
            filter.type = "checkbox";
            filter.id = "qunit-filter-pass";
            addEvent(filter, "click", function () {
                var li = document.getElementsByTagName("li");
                for (var i = 0; i < li.length; i++) {
                    if (li[i].className.indexOf("pass") > -1) {
                        li[i].style.display = filter.checked ? "none" : "";
                    }
                }
                if (defined.sessionStorage) {
                    sessionStorage.setItem("qunit-filter-passed-tests", filter.checked ? "true" : "");
                }
            });
            if (defined.sessionStorage && sessionStorage.getItem("qunit-filter-passed-tests")) {
                filter.checked = true;
            }
            toolbar.appendChild(filter);

            var label = document.createElement("label");
            label.setAttribute("for", "qunit-filter-pass");
            label.innerHTML = "Hide passed tests";
            toolbar.appendChild(label);
        }

        var main = id('main') || id('qunit-fixture');
        if (main) {
            config.fixture = main.innerHTML;
        }

        if (config.autostart) {
            QUnit.start();
        }
    });

    function done() {
        config.autorun = true;

        // Log the last module results
        if (config.currentModule) {
            QUnit.moduleDone({
                name: config.currentModule,
                failed: config.moduleStats.bad,
                passed: config.moduleStats.all - config.moduleStats.bad,
                total: config.moduleStats.all
            });
        }

        var banner = id("qunit-banner"),
		tests = id("qunit-tests"),
		runtime = +new Date - config.started,
		passed = config.stats.all - config.stats.bad,
		html = [
			'Tests completed in ',
			runtime,
			' milliseconds.<br/>',
			'<span class="passed">',
			passed,
			'</span> tests of <span class="total">',
			config.stats.all,
			'</span> passed, <span class="failed">',
			config.stats.bad,
			'</span> failed.'
		].join('');

        if (banner) {
            banner.className = (config.stats.bad ? "qunit-fail" : "qunit-pass");
        }

        if (tests) {
            var result = id("qunit-testresult");

            if (!result) {
                result = document.createElement("p");
                result.id = "qunit-testresult";
                result.className = "result";
                tests.parentNode.insertBefore(result, tests.nextSibling);
            }

            result.innerHTML = html;
        }

        QUnit.done({
            failed: config.stats.bad,
            passed: passed,
            total: config.stats.all,
            runtime: runtime
        });
    }

    function validTest(name) {
        var i = config.filters.length,
		run = false;

        if (!i) {
            return true;
        }

        while (i--) {
            var filter = config.filters[i],
			not = filter.charAt(0) == '!';

            if (not) {
                filter = filter.slice(1);
            }

            if (name.indexOf(filter) !== -1) {
                return !not;
            }

            if (not) {
                run = true;
            }
        }

        return run;
    }

    // so far supports only Firefox, Chrome and Opera (buggy)
    // could be extended in the future to use something like https://github.com/csnover/TraceKit
    function sourceFromStacktrace() {
        try {
            throw new Error();
        } catch (e) {
            if (e.stacktrace) {
                // Opera
                return e.stacktrace.split("\n")[6];
            } else if (e.stack) {
                // Firefox, Chrome
                return e.stack.split("\n")[4];
            }
        }
    }

    function resultDisplayStyle(passed) {
        return passed && id("qunit-filter-pass") && id("qunit-filter-pass").checked ? 'none' : '';
    }

    function escapeHtml(s) {
        if (!s) {
            return "";
        }
        s = s + "";
        return s.replace(/[\&"<>\\]/g, function (s) {
            switch (s) {
                case "&": return "&amp;";
                case "\\": return "\\\\";
                case '"': return '\"';
                case "<": return "&lt;";
                case ">": return "&gt;";
                default: return s;
            }
        });
    }

    function synchronize(callback) {
        config.queue.push(callback);

        if (config.autorun && !config.blocking) {
            process();
        }
    }

    function process() {
        var start = (new Date()).getTime();

        while (config.queue.length && !config.blocking) {
            if (config.updateRate <= 0 || (((new Date()).getTime() - start) < config.updateRate)) {
                config.queue.shift()();
            } else {
                window.setTimeout(process, 13);
                break;
            }
        }
        if (!config.blocking && !config.queue.length) {
            done();
        }
    }

    function saveGlobal() {
        config.pollution = [];

        if (config.noglobals) {
            for (var key in window) {
                config.pollution.push(key);
            }
        }
    }

    function checkPollution(name) {
        var old = config.pollution;
        saveGlobal();

        var newGlobals = diff(old, config.pollution);
        if (newGlobals.length > 0) {
            ok(false, "Introduced global variable(s): " + newGlobals.join(", "));
            config.current.expected++;
        }

        var deletedGlobals = diff(config.pollution, old);
        if (deletedGlobals.length > 0) {
            ok(false, "Deleted global variable(s): " + deletedGlobals.join(", "));
            config.current.expected++;
        }
    }

    // returns a new Array with the elements that are in a but not in b
    function diff(a, b) {
        var result = a.slice();
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < b.length; j++) {
                if (result[i] === b[j]) {
                    result.splice(i, 1);
                    i--;
                    break;
                }
            }
        }
        return result;
    }

    function fail(message, exception, callback) {
        if (typeof console !== "undefined" && console.error && console.warn) {
            console.error(message);
            console.error(exception);
            console.warn(callback.toString());

        } else if (window.opera && opera.postError) {
            opera.postError(message, exception, callback.toString);
        }
    }

    function extend(a, b) {
        for (var prop in b) {
            a[prop] = b[prop];
        }

        return a;
    }

    function addEvent(elem, type, fn) {
        if (elem.addEventListener) {
            elem.addEventListener(type, fn, false);
        } else if (elem.attachEvent) {
            elem.attachEvent("on" + type, fn);
        } else {
            fn();
        }
    }

    function id(name) {
        return !!(typeof document !== "undefined" && document && document.getElementById) &&
		document.getElementById(name);
    }

    // Test for equality any JavaScript type.
    // Discussions and reference: http://philrathe.com/articles/equiv
    // Test suites: http://philrathe.com/tests/equiv
    // Author: Philippe Rathé <prathe@gmail.com>
    QUnit.equiv = function () {

        var innerEquiv; // the real equiv function
        var callers = []; // stack to decide between skip/abort functions
        var parents = []; // stack to avoiding loops from circular referencing

        // Call the o related callback with the given arguments.
        function bindCallbacks(o, callbacks, args) {
            var prop = QUnit.objectType(o);
            if (prop) {
                if (QUnit.objectType(callbacks[prop]) === "function") {
                    return callbacks[prop].apply(callbacks, args);
                } else {
                    return callbacks[prop]; // or undefined
                }
            }
        }

        var callbacks = function () {

            // for string, boolean, number and null
            function useStrictEquality(b, a) {
                if (b instanceof a.constructor || a instanceof b.constructor) {
                    // to catch short annotaion VS 'new' annotation of a declaration
                    // e.g. var i = 1;
                    //      var j = new Number(1);
                    return a == b;
                } else {
                    return a === b;
                }
            }

            return {
                "string": useStrictEquality,
                "boolean": useStrictEquality,
                "number": useStrictEquality,
                "null": useStrictEquality,
                "undefined": useStrictEquality,

                "nan": function (b) {
                    return isNaN(b);
                },

                "date": function (b, a) {
                    return QUnit.objectType(b) === "date" && a.valueOf() === b.valueOf();
                },

                "regexp": function (b, a) {
                    return QUnit.objectType(b) === "regexp" &&
                    a.source === b.source && // the regex itself
                    a.global === b.global && // and its modifers (gmi) ...
                    a.ignoreCase === b.ignoreCase &&
                    a.multiline === b.multiline;
                },

                // - skip when the property is a method of an instance (OOP)
                // - abort otherwise,
                //   initial === would have catch identical references anyway
                "function": function () {
                    var caller = callers[callers.length - 1];
                    return caller !== Object &&
                        typeof caller !== "undefined";
                },

                "array": function (b, a) {
                    var i, j, loop;
                    var len;

                    // b could be an object literal here
                    if (!(QUnit.objectType(b) === "array")) {
                        return false;
                    }

                    len = a.length;
                    if (len !== b.length) { // safe and faster
                        return false;
                    }

                    //track reference to avoid circular references
                    parents.push(a);
                    for (i = 0; i < len; i++) {
                        loop = false;
                        for (j = 0; j < parents.length; j++) {
                            if (parents[j] === a[i]) {
                                loop = true; //dont rewalk array
                            }
                        }
                        if (!loop && !innerEquiv(a[i], b[i])) {
                            parents.pop();
                            return false;
                        }
                    }
                    parents.pop();
                    return true;
                },

                "object": function (b, a) {
                    var i, j, loop;
                    var eq = true; // unless we can proove it
                    var aProperties = [], bProperties = []; // collection of strings

                    // comparing constructors is more strict than using instanceof
                    if (a.constructor !== b.constructor) {
                        return false;
                    }

                    // stack constructor before traversing properties
                    callers.push(a.constructor);
                    //track reference to avoid circular references
                    parents.push(a);

                    for (i in a) { // be strict: don't ensures hasOwnProperty and go deep
                        loop = false;
                        for (j = 0; j < parents.length; j++) {
                            if (parents[j] === a[i])
                                loop = true; //don't go down the same path twice
                        }
                        aProperties.push(i); // collect a's properties

                        if (!loop && !innerEquiv(a[i], b[i])) {
                            eq = false;
                            break;
                        }
                    }

                    callers.pop(); // unstack, we are done
                    parents.pop();

                    for (i in b) {
                        bProperties.push(i); // collect b's properties
                    }

                    // Ensures identical properties name
                    return eq && innerEquiv(aProperties.sort(), bProperties.sort());
                }
            };
        } ();

        innerEquiv = function () { // can take multiple arguments
            var args = Array.prototype.slice.apply(arguments);
            if (args.length < 2) {
                return true; // end transition
            }

            return (function (a, b) {
                if (a === b) {
                    return true; // catch the most you can
                } else if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined" || QUnit.objectType(a) !== QUnit.objectType(b)) {
                    return false; // don't lose time with error prone cases
                } else {
                    return bindCallbacks(a, callbacks, [b, a]);
                }

                // apply transition with (1..n) arguments
            })(args[0], args[1]) && arguments.callee.apply(this, args.splice(1, args.length - 1));
        };

        return innerEquiv;

    } ();

    /**
    * jsDump
    * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
    * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
    * Date: 5/15/2008
    * @projectDescription Advanced and extensible data dumping for Javascript.
    * @version 1.0.0
    * @author Ariel Flesler
    * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
    */
    QUnit.jsDump = (function () {
        function quote(str) {
            return '"' + str.toString().replace(/"/g, '\\"') + '"';
        };
        function literal(o) {
            return o + '';
        };
        function join(pre, arr, post) {
            var s = jsDump.separator(),
			base = jsDump.indent(),
			inner = jsDump.indent(1);
            if (arr.join)
                arr = arr.join(',' + s + inner);
            if (!arr)
                return pre + post;
            return [pre, inner + arr, base + post].join(s);
        };
        function array(arr) {
            var i = arr.length, ret = Array(i);
            this.up();
            while (i--)
                ret[i] = this.parse(arr[i]);
            this.down();
            return join('[', ret, ']');
        };

        var reName = /^function (\w+)/;

        var jsDump = {
            parse: function (obj, type) { //type is used mostly internally, you can fix a (custom)type in advance
                var parser = this.parsers[type || this.typeOf(obj)];
                type = typeof parser;

                return type == 'function' ? parser.call(this, obj) :
				   type == 'string' ? parser :
				   this.parsers.error;
            },
            typeOf: function (obj) {
                var type;
                if (obj === null) {
                    type = "null";
                } else if (typeof obj === "undefined") {
                    type = "undefined";
                } else if (QUnit.is("RegExp", obj)) {
                    type = "regexp";
                } else if (QUnit.is("Date", obj)) {
                    type = "date";
                } else if (QUnit.is("Function", obj)) {
                    type = "function";
                } else if (typeof obj.setInterval !== undefined && typeof obj.document !== "undefined" && typeof obj.nodeType === "undefined") {
                    type = "window";
                } else if (obj.nodeType === 9) {
                    type = "document";
                } else if (obj.nodeType) {
                    type = "node";
                } else if (typeof obj === "object" && typeof obj.length === "number" && obj.length >= 0) {
                    type = "array";
                } else {
                    type = typeof obj;
                }
                return type;
            },
            separator: function () {
                return this.multiline ? this.HTML ? '<br />' : '\n' : this.HTML ? '&nbsp;' : ' ';
            },
            indent: function (extra) {// extra can be a number, shortcut for increasing-calling-decreasing
                if (!this.multiline)
                    return '';
                var chr = this.indentChar;
                if (this.HTML)
                    chr = chr.replace(/\t/g, '   ').replace(/ /g, '&nbsp;');
                return Array(this._depth_ + (extra || 0)).join(chr);
            },
            up: function (a) {
                this._depth_ += a || 1;
            },
            down: function (a) {
                this._depth_ -= a || 1;
            },
            setParser: function (name, parser) {
                this.parsers[name] = parser;
            },
            // The next 3 are exposed so you can use them
            quote: quote,
            literal: literal,
            join: join,
            //
            _depth_: 1,
            // This is the list of parsers, to modify them, use jsDump.setParser
            parsers: {
                window: '[Window]',
                document: '[Document]',
                error: '[ERROR]', //when no parser is found, shouldn't happen
                unknown: '[Unknown]',
                'null': 'null',
                undefined: 'undefined',
                'function': function (fn) {
                    var ret = 'function',
					name = 'name' in fn ? fn.name : (reName.exec(fn) || [])[1]; //functions never have name in IE
                    if (name)
                        ret += ' ' + name;
                    ret += '(';

                    ret = [ret, QUnit.jsDump.parse(fn, 'functionArgs'), '){'].join('');
                    return join(ret, QUnit.jsDump.parse(fn, 'functionCode'), '}');
                },
                array: array,
                nodelist: array,
                arguments: array,
                object: function (map) {
                    var ret = [];
                    QUnit.jsDump.up();
                    for (var key in map)
                        ret.push(QUnit.jsDump.parse(key, 'key') + ': ' + QUnit.jsDump.parse(map[key]));
                    QUnit.jsDump.down();
                    return join('{', ret, '}');
                },
                node: function (node) {
                    var open = QUnit.jsDump.HTML ? '&lt;' : '<',
					close = QUnit.jsDump.HTML ? '&gt;' : '>';

                    var tag = node.nodeName.toLowerCase(),
					ret = open + tag;

                    for (var a in QUnit.jsDump.DOMAttrs) {
                        var val = node[QUnit.jsDump.DOMAttrs[a]];
                        if (val)
                            ret += ' ' + a + '=' + QUnit.jsDump.parse(val, 'attribute');
                    }
                    return ret + close + open + '/' + tag + close;
                },
                functionArgs: function (fn) {//function calls it internally, it's the arguments part of the function
                    var l = fn.length;
                    if (!l) return '';

                    var args = Array(l);
                    while (l--)
                        args[l] = String.fromCharCode(97 + l); //97 is 'a'
                    return ' ' + args.join(', ') + ' ';
                },
                key: quote, //object calls it internally, the key part of an item in a map
                functionCode: '[code]', //function calls it internally, it's the content of the function
                attribute: quote, //node calls it internally, it's an html attribute value
                string: quote,
                date: quote,
                regexp: literal, //regex
                number: literal,
                'boolean': literal
            },
            DOMAttrs: {//attributes to dump from nodes, name=>realName
                id: 'id',
                name: 'name',
                'class': 'className'
            },
            HTML: false, //if true, entities are escaped ( <, >, \t, space and \n )
            indentChar: '  ', //indentation unit
            multiline: true //if true, items in a collection, are separated by a \n, else just a space.
        };

        return jsDump;
    })();

    // from Sizzle.js
    function getText(elems) {
        var ret = "", elem;

        for (var i = 0; elems[i]; i++) {
            elem = elems[i];

            // Get the text from text nodes and CDATA nodes
            if (elem.nodeType === 3 || elem.nodeType === 4) {
                ret += elem.nodeValue;

                // Traverse everything else, except comment nodes
            } else if (elem.nodeType !== 8) {
                ret += getText(elem.childNodes);
            }
        }

        return ret;
    };

    /*
    * Javascript Diff Algorithm
    *  By John Resig (http://ejohn.org/)
    *  Modified by Chu Alan "sprite"
    *
    * Released under the MIT license.
    *
    * More Info:
    *  http://ejohn.org/projects/javascript-diff-algorithm/
    *  
    * Usage: QUnit.diff(expected, actual)
    * 
    * QUnit.diff("the quick brown fox jumped over", "the quick fox jumps over") == "the  quick <del>brown </del> fox <del>jumped </del><ins>jumps </ins> over"
    */
    QUnit.diff = (function () {
        function diff(o, n) {
            var ns = new Object();
            var os = new Object();

            for (var i = 0; i < n.length; i++) {
                if (ns[n[i]] == null)
                    ns[n[i]] = {
                        rows: new Array(),
                        o: null
                    };
                ns[n[i]].rows.push(i);
            }

            for (var i = 0; i < o.length; i++) {
                if (os[o[i]] == null)
                    os[o[i]] = {
                        rows: new Array(),
                        n: null
                    };
                os[o[i]].rows.push(i);
            }

            for (var i in ns) {
                if (ns[i].rows.length == 1 && typeof (os[i]) != "undefined" && os[i].rows.length == 1) {
                    n[ns[i].rows[0]] = {
                        text: n[ns[i].rows[0]],
                        row: os[i].rows[0]
                    };
                    o[os[i].rows[0]] = {
                        text: o[os[i].rows[0]],
                        row: ns[i].rows[0]
                    };
                }
            }

            for (var i = 0; i < n.length - 1; i++) {
                if (n[i].text != null && n[i + 1].text == null && n[i].row + 1 < o.length && o[n[i].row + 1].text == null &&
			n[i + 1] == o[n[i].row + 1]) {
                    n[i + 1] = {
                        text: n[i + 1],
                        row: n[i].row + 1
                    };
                    o[n[i].row + 1] = {
                        text: o[n[i].row + 1],
                        row: i + 1
                    };
                }
            }

            for (var i = n.length - 1; i > 0; i--) {
                if (n[i].text != null && n[i - 1].text == null && n[i].row > 0 && o[n[i].row - 1].text == null &&
			n[i - 1] == o[n[i].row - 1]) {
                    n[i - 1] = {
                        text: n[i - 1],
                        row: n[i].row - 1
                    };
                    o[n[i].row - 1] = {
                        text: o[n[i].row - 1],
                        row: i - 1
                    };
                }
            }

            return {
                o: o,
                n: n
            };
        }

        return function (o, n) {
            o = o.replace(/\s+$/, '');
            n = n.replace(/\s+$/, '');
            var out = diff(o == "" ? [] : o.split(/\s+/), n == "" ? [] : n.split(/\s+/));

            var str = "";

            var oSpace = o.match(/\s+/g);
            if (oSpace == null) {
                oSpace = [" "];
            }
            else {
                oSpace.push(" ");
            }
            var nSpace = n.match(/\s+/g);
            if (nSpace == null) {
                nSpace = [" "];
            }
            else {
                nSpace.push(" ");
            }

            if (out.n.length == 0) {
                for (var i = 0; i < out.o.length; i++) {
                    str += '<del>' + out.o[i] + oSpace[i] + "</del>";
                }
            }
            else {
                if (out.n[0].text == null) {
                    for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
                        str += '<del>' + out.o[n] + oSpace[n] + "</del>";
                    }
                }

                for (var i = 0; i < out.n.length; i++) {
                    if (out.n[i].text == null) {
                        str += '<ins>' + out.n[i] + nSpace[i] + "</ins>";
                    }
                    else {
                        var pre = "";

                        for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
                            pre += '<del>' + out.o[n] + oSpace[n] + "</del>";
                        }
                        str += " " + out.n[i].text + nSpace[i] + pre;
                    }
                }
            }

            return str;
        };
    })();

})(this);

/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*
* Version: 0.5.0
* 
*/
(function ($) {

    jQuery.fn.extend({
        slimScroll: function (options) {

            var defaults = {
                wheelStep: 20,
                width: 'auto',
                height: '250px',
                size: '7px',
                color: '#000',
                position: 'right',
                distance: '1px',
                start: 'top',
                opacity: .4,
                alwaysVisible: false,
                railVisible: false,
                railColor: '#333',
                railOpacity: '0.2',
                railClass: 'slimScrollRail',
                barClass: 'slimScrollBar',
                wrapperClass: 'slimScrollDiv',
                allowPageScroll: false,
                scroll: 0
            };

            var o = ops = $.extend(defaults, options);

            // do it for every element that matches selector
            this.each(function () {

                var isOverPanel, isOverBar, isDragg, queueHide, barHeight, percentScroll,
        divS = '<div></div>',
        minBarHeight = 30,
        releaseScroll = false,
        wheelStep = parseInt(o.wheelStep),
        cwidth = o.width,
        cheight = o.height,
        size = o.size,
        color = o.color,
        position = o.position,
        distance = o.distance,
        start = o.start,
        opacity = o.opacity,
        alwaysVisible = o.alwaysVisible,
        railVisible = o.railVisible,
        railColor = o.railColor,
        railOpacity = o.railOpacity,
        allowPageScroll = o.allowPageScroll,
        scroll = o.scroll;

                // used in event handlers and for better minification
                var me = $(this);

                //ensure we are not binding it again
                if (me.parent().hasClass('slimScrollDiv')) {
                    //check if we should scroll existing instance
                    if (scroll) {
                        //find bar and rail
                        bar = me.parent().find('.slimScrollBar');
                        rail = me.parent().find('.slimScrollRail');

                        //scroll by given amount of pixels
                        scrollContent(me.scrollTop() + parseInt(scroll), false, true);
                    }

                    return;
                }

                // wrap content
                var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
              position: 'relative',
              overflow: 'hidden',
              width: cwidth,
              height: cheight
          });

                // update style for the div
                me.css({
                    overflow: 'hidden',
                    width: cwidth,
                    height: cheight
                });

                // create scrollbar rail
                var rail = $(divS)
          .addClass(o.railClass)
          .css({
              width: size,
              height: '100%',
              position: 'absolute',
              top: 0,
              display: (alwaysVisible && railVisible) ? 'block' : 'none',
              'border-radius': size,
              background: railColor,
              opacity: railOpacity,
              zIndex: 90
          });

                // create scrollbar
                var bar = $(divS)
          .addClass(o.barClass)
          .css({
              background: color,
              width: size,
              position: 'absolute',
              top: 0,
              opacity: opacity,
              display: alwaysVisible ? 'block' : 'none',
              'border-radius': size,
              BorderRadius: size,
              MozBorderRadius: size,
              WebkitBorderRadius: size,
              zIndex: 99
          });

                // set position
                var posCss = (position == 'right') ? { right: distance} : { left: distance };
                rail.css(posCss);
                bar.css(posCss);

                // wrap it
                me.wrap(wrapper);

                // append to parent div
                me.parent().append(bar);
                me.parent().append(rail);

                // make it draggable
                bar.draggable({
                    axis: 'y',
                    containment: 'parent',
                    start: function () { isDragg = true; },
                    stop: function () { isDragg = false; hideBar(); },
                    drag: function (e) {
                        // scroll content
                        scrollContent(0, $(this).position().top, false);
                    }
                });

                // on rail over
                rail.hover(function () {
                    showBar();
                }, function () {
                    hideBar();
                });

                // on bar over
                bar.hover(function () {
                    isOverBar = true;
                }, function () {
                    isOverBar = false;
                });

                // show on parent mouseover
                me.hover(function () {
                    isOverPanel = true;
                    showBar();
                    hideBar();
                }, function () {
                    isOverPanel = false;
                    hideBar();
                });

                var _onWheel = function (e) {
                    // use mouse wheel only when mouse is over
                    if (!isOverPanel) { return; }

                    var e = e || window.event;

                    var delta = 0;
                    if (e.wheelDelta) { delta = -e.wheelDelta / 120; }
                    if (e.detail) { delta = e.detail / 3; }

                    // scroll content
                    scrollContent(delta, true);

                    // stop window scroll
                    if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
                    if (!releaseScroll) { e.returnValue = false; }
                }

                function scrollContent(y, isWheel, isJump) {
                    var delta = y;

                    if (isWheel) {
                        // move bar with mouse wheel
                        delta = parseInt(bar.css('top')) + y * wheelStep / 100 * bar.outerHeight();

                        // move bar, make sure it doesn't go out
                        var maxTop = me.outerHeight() - bar.outerHeight();
                        delta = Math.min(Math.max(delta, 0), maxTop);

                        // scroll the scrollbar
                        bar.css({ top: delta + 'px' });
                    }

                    // calculate actual scroll amount
                    percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
                    delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

                    if (isJump) {
                        delta = y;
                        var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
                        bar.css({ top: offsetTop + 'px' });
                    }

                    // scroll content
                    me.scrollTop(delta);

                    // ensure bar is visible
                    showBar();

                    // trigger hide when scroll is stopped
                    hideBar();
                }

                var attachWheel = function () {
                    if (window.addEventListener) {
                        this.addEventListener('DOMMouseScroll', _onWheel, false);
                        this.addEventListener('mousewheel', _onWheel, false);
                    }
                    else {
                        document.attachEvent("onmousewheel", _onWheel)
                    }
                }

                // attach scroll events
                attachWheel();

                function getBarHeight() {
                    // calculate scrollbar height and make sure it is not too small
                    barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
                    bar.css({ height: barHeight + 'px' });
                }

                // set up initial height
                getBarHeight();

                function showBar() {
                    // recalculate bar height
                    getBarHeight();
                    clearTimeout(queueHide);

                    // release wheel when bar reached top or bottom
                    releaseScroll = allowPageScroll && percentScroll == ~ ~percentScroll;

                    // show only when required
                    if (barHeight >= me.outerHeight()) {
                        //allow window scroll
                        releaseScroll = true;
                        return;
                    }
                    bar.stop(true, true).fadeIn('fast');
                    if (railVisible) { rail.stop(true, true).fadeIn('fast'); }
                }

                function hideBar() {
                    // only hide when options allow it
                    if (!alwaysVisible) {
                        queueHide = setTimeout(function () {
                            if (!isOverBar && !isDragg) {
                                bar.fadeOut('slow');
                                rail.fadeOut('slow');
                            }
                        }, 1000);
                    }
                }

                // check start position
                if (start == 'bottom') {
                    // scroll content to bottom
                    bar.css({ top: me.outerHeight() - bar.outerHeight() });
                    scrollContent(0, true);
                }
                else if (typeof start == 'object') {
                    // scroll content
                    scrollContent($(start).position().top, null, true);

                    // make sure bar stays hidden
                    if (!alwaysVisible) { bar.hide(); }
                }
            });

            // maintain chainability
            return this;
        }
    });

    jQuery.fn.extend({
        slimscroll: jQuery.fn.slimScroll
    });

})(jQuery);