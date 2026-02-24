/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute === void 0 && (jQuery.migrateMute = !0), function (e, t, n) { function r(n) { var r = t.console; i[n] || (i[n] = !0, e.migrateWarnings.push(n), r && r.warn && !e.migrateMute && (r.warn("JQMIGRATE: " + n), e.migrateTrace && r.trace && r.trace())) } function a(t, a, i, o) { if (Object.defineProperty) try { return Object.defineProperty(t, a, { configurable: !0, enumerable: !0, get: function () { return r(o), i }, set: function (e) { r(o), i = e } }), n } catch (s) { } e._definePropertyBroken = !0, t[a] = i } var i = {}; e.migrateWarnings = [], !e.migrateMute && t.console && t.console.log && t.console.log("JQMIGRATE: Logging is active"), e.migrateTrace === n && (e.migrateTrace = !0), e.migrateReset = function () { i = {}, e.migrateWarnings.length = 0 }, "BackCompat" === document.compatMode && r("jQuery is not compatible with Quirks Mode"); var o = e("<input/>", { size: 1 }).attr("size") && e.attrFn, s = e.attr, u = e.attrHooks.value && e.attrHooks.value.get || function () { return null }, c = e.attrHooks.value && e.attrHooks.value.set || function () { return n }, l = /^(?:input|button)$/i, d = /^[238]$/, p = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, f = /^(?:checked|selected)$/i; a(e, "attrFn", o || {}, "jQuery.attrFn is deprecated"), e.attr = function (t, a, i, u) { var c = a.toLowerCase(), g = t && t.nodeType; return u && (4 > s.length && r("jQuery.fn.attr( props, pass ) is deprecated"), t && !d.test(g) && (o ? a in o : e.isFunction(e.fn[a]))) ? e(t)[a](i) : ("type" === a && i !== n && l.test(t.nodeName) && t.parentNode && r("Can't change the 'type' of an input or button in IE 6/7/8"), !e.attrHooks[c] && p.test(c) && (e.attrHooks[c] = { get: function (t, r) { var a, i = e.prop(t, r); return i === !0 || "boolean" != typeof i && (a = t.getAttributeNode(r)) && a.nodeValue !== !1 ? r.toLowerCase() : n }, set: function (t, n, r) { var a; return n === !1 ? e.removeAttr(t, r) : (a = e.propFix[r] || r, a in t && (t[a] = !0), t.setAttribute(r, r.toLowerCase())), r } }, f.test(c) && r("jQuery.fn.attr('" + c + "') may use property instead of attribute")), s.call(e, t, a, i)) }, e.attrHooks.value = { get: function (e, t) { var n = (e.nodeName || "").toLowerCase(); return "button" === n ? u.apply(this, arguments) : ("input" !== n && "option" !== n && r("jQuery.fn.attr('value') no longer gets properties"), t in e ? e.value : null) }, set: function (e, t) { var a = (e.nodeName || "").toLowerCase(); return "button" === a ? c.apply(this, arguments) : ("input" !== a && "option" !== a && r("jQuery.fn.attr('value', val) no longer sets properties"), e.value = t, n) } }; var g, h, v = e.fn.init, m = e.parseJSON, y = /^([^<]*)(<[\w\W]+>)([^>]*)$/; e.fn.init = function (t, n, a) { var i; return t && "string" == typeof t && !e.isPlainObject(n) && (i = y.exec(e.trim(t))) && i[0] && ("<" !== t.charAt(0) && r("$(html) HTML strings must start with '<' character"), i[3] && r("$(html) HTML text after last tag is ignored"), "#" === i[0].charAt(0) && (r("HTML string cannot start with a '#' character"), e.error("JQMIGRATE: Invalid selector string (XSS)")), n && n.context && (n = n.context), e.parseHTML) ? v.call(this, e.parseHTML(i[2], n, !0), n, a) : v.apply(this, arguments) }, e.fn.init.prototype = e.fn, e.parseJSON = function (e) { return e || null === e ? m.apply(this, arguments) : (r("jQuery.parseJSON requires a valid JSON string"), null) }, e.uaMatch = function (e) { e = e.toLowerCase(); var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || 0 > e.indexOf("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || []; return { browser: t[1] || "", version: t[2] || "0" } }, e.browser || (g = e.uaMatch(navigator.userAgent), h = {}, g.browser && (h[g.browser] = !0, h.version = g.version), h.chrome ? h.webkit = !0 : h.webkit && (h.safari = !0), e.browser = h), a(e, "browser", e.browser, "jQuery.browser is deprecated"), e.sub = function () { function t(e, n) { return new t.fn.init(e, n) } e.extend(!0, t, this), t.superclass = this, t.fn = t.prototype = this(), t.fn.constructor = t, t.sub = this.sub, t.fn.init = function (r, a) { return a && a instanceof e && !(a instanceof t) && (a = t(a)), e.fn.init.call(this, r, a, n) }, t.fn.init.prototype = t.fn; var n = t(document); return r("jQuery.sub() is deprecated"), t }, e.ajaxSetup({ converters: { "text json": e.parseJSON } }); var b = e.fn.data; e.fn.data = function (t) { var a, i, o = this[0]; return !o || "events" !== t || 1 !== arguments.length || (a = e.data(o, t), i = e._data(o, t), a !== n && a !== i || i === n) ? b.apply(this, arguments) : (r("Use of jQuery.fn.data('events') is deprecated"), i) }; var j = /\/(java|ecma)script/i, w = e.fn.andSelf || e.fn.addBack; e.fn.andSelf = function () { return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"), w.apply(this, arguments) }, e.clean || (e.clean = function (t, a, i, o) { a = a || document, a = !a.nodeType && a[0] || a, a = a.ownerDocument || a, r("jQuery.clean() is deprecated"); var s, u, c, l, d = []; if (e.merge(d, e.buildFragment(t, a).childNodes), i) for (c = function (e) { return !e.type || j.test(e.type) ? o ? o.push(e.parentNode ? e.parentNode.removeChild(e) : e) : i.appendChild(e) : n }, s = 0; null != (u = d[s]) ; s++) e.nodeName(u, "script") && c(u) || (i.appendChild(u), u.getElementsByTagName !== n && (l = e.grep(e.merge([], u.getElementsByTagName("script")), c), d.splice.apply(d, [s + 1, 0].concat(l)), s += l.length)); return d }); var Q = e.event.add, x = e.event.remove, k = e.event.trigger, N = e.fn.toggle, T = e.fn.live, M = e.fn.die, S = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess", C = RegExp("\\b(?:" + S + ")\\b"), H = /(?:^|\s)hover(\.\S+|)\b/, A = function (t) { return "string" != typeof t || e.event.special.hover ? t : (H.test(t) && r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"), t && t.replace(H, "mouseenter$1 mouseleave$1")) }; e.event.props && "attrChange" !== e.event.props[0] && e.event.props.unshift("attrChange", "attrName", "relatedNode", "srcElement"), e.event.dispatch && a(e.event, "handle", e.event.dispatch, "jQuery.event.handle is undocumented and deprecated"), e.event.add = function (e, t, n, a, i) { e !== document && C.test(t) && r("AJAX events should be attached to document: " + t), Q.call(this, e, A(t || ""), n, a, i) }, e.event.remove = function (e, t, n, r, a) { x.call(this, e, A(t) || "", n, r, a) }, e.fn.error = function () { var e = Array.prototype.slice.call(arguments, 0); return r("jQuery.fn.error() is deprecated"), e.splice(0, 0, "error"), arguments.length ? this.bind.apply(this, e) : (this.triggerHandler.apply(this, e), this) }, e.fn.toggle = function (t, n) { if (!e.isFunction(t) || !e.isFunction(n)) return N.apply(this, arguments); r("jQuery.fn.toggle(handler, handler...) is deprecated"); var a = arguments, i = t.guid || e.guid++, o = 0, s = function (n) { var r = (e._data(this, "lastToggle" + t.guid) || 0) % o; return e._data(this, "lastToggle" + t.guid, r + 1), n.preventDefault(), a[r].apply(this, arguments) || !1 }; for (s.guid = i; a.length > o;) a[o++].guid = i; return this.click(s) }, e.fn.live = function (t, n, a) { return r("jQuery.fn.live() is deprecated"), T ? T.apply(this, arguments) : (e(this.context).on(t, this.selector, n, a), this) }, e.fn.die = function (t, n) { return r("jQuery.fn.die() is deprecated"), M ? M.apply(this, arguments) : (e(this.context).off(t, this.selector || "**", n), this) }, e.event.trigger = function (e, t, n, a) { return n || C.test(e) || r("Global events are undocumented and deprecated"), k.call(this, e, t, n || document, a) }, e.each(S.split("|"), function (t, n) { e.event.special[n] = { setup: function () { var t = this; return t !== document && (e.event.add(document, n + "." + e.guid, function () { e.event.trigger(n, null, t, !0) }), e._data(this, n, e.guid++)), !1 }, teardown: function () { return this !== document && e.event.remove(document, n + "." + e._data(this, n)), !1 } } }) }(jQuery, window);

var ReiSys;
(function (ReiSys) {
    (function (Utilities) {
        var PlatformConsole = (function () {
            function PlatformConsole() { }
            PlatformConsole.prototype.log = function (message) {
                if (typeof console != "undefined") {
                    var dbg = this.getURLParameter('dbg');
                    if (dbg != null) {
                        if (dbg == 1 || dbg == 2) {
                            console.log(message);
                        }
                    }
                }
            };
            PlatformConsole.prototype.getURLParameter = function (name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [
                    ,
                    ""
                ])[1].replace(/\+/g, '%20')) || null;
            };
            return PlatformConsole;
        })();
        Utilities.PlatformConsole = PlatformConsole;
    })(ReiSys.Utilities || (ReiSys.Utilities = {}));
    var Utilities = ReiSys.Utilities;

})(ReiSys || (ReiSys = {}));

var PlatformConsole = new ReiSys.Utilities.PlatformConsole();




/// <reference path="jquery.js" />
/// <reference path="plugins/tooltip.js" />
/// <reference path="plugins/truncate.js" />

var jQuery = window.jQuery = $telerik.$ = window.$;

var hideLeftPanel = false;
var hideTopPanel = true;
var layoutMenu = undefined;
var valTitleattributes = new Array();
var lastActivePicker;

//The two variables below are from jquery_plugins.js in the ToolTip (tiptip) function.
//Ordinarily we would not attempt such but were limited in choices to the solution to the memory leak
//issue identified in PFM-1722.
var tooltipTimeouts = [];
var tiptipHolders = [];

Sys.Application.add_load(PlatformLoad);
Sys.Application.add_load(scriptPageLoad);
Sys.Application.add_load(initFilter);
document.cookie = "javascript=true";

//PFM-3420
function GetCharCode(event) {

    var e;
    if (event.which != "") { e = event.which; }
    else if (event.charCode != "") { e = event.charCode; }
    else if (event.keyCode != "") { e = event.keyCode; }

    return e;
}

function REIRadListBox_Loaded(sender) {
    setTimeout(function () {

        //PLSUP-5035 REIRadListBox 'All' checkbox performs strangely on Firefox
        if ($telerik.isFirefox) {
            $(sender.get_element()).find('div.rlbGroup').attr('tabindex', -1);
        }

        if (!$(sender.get_element()).hasClass('csValuesApplied'))
            sender.clearSelection();

        var items = sender.get_items();
        var foundOne = false;

        for (var i = 0; i < items.get_count() ; i++) {
            var isGroup = $(items.getItem(i).get_element()).hasClass('gListGroup');

            if (!isGroup) {
                var noDisplay = $(items.getItem(i).get_element()).css('display') === 'none';

                if (!noDisplay && !foundOne) {
                    foundOne = true;
                    // We can enable this line to always select the first visible element.
                    // If we do this though, the feature to pre-select values will be broken.
                    //items.getItem(i).set_selected(true);
                }
            }
            else {
                var hasChildren = false;
                for (var j = i + 1; j < items.get_count() ; j++) {
                    if ($(items.getItem(j).get_element()).attr('isseperator'))
                        j = items.get_count(); //stop
                    else if ($(items.getItem(j).get_element()).css('display') != 'none')
                        hasChildren = true;
                }

                if (hasChildren) {
                    $(items.getItem(i).get_element()).css('display', 'block');
                }
            }
        }
    }, 10);
}

//commented this code out because it is not working properly

/* PFM-2666 Create Common Function to call both key up and paste for radtextbox*/
//function queryListBoxItems(e) {

//    var filterFox = jQuery(this);
//    if (this == window) {
//        filterFox = $(e.currentTarget);
//    }

//    this.timeOut = setTimeout(function () {

//        // Prevent non visible items from being selected.
//        var listBox = $(filterFox).parent().nextAll('.RadListBox');
//        $find($(listBox).attr('id')).clearSelection();

//        query = $(filterFox).val();
//        var allItems = $(filterFox).parent().nextAll('.RadListBox').find('.rlbItem');

//        for (var i = 0; i < allItems.length; i++) {
//            var item = $(allItems[i]);
//            var match = item.find('span').text().search(new RegExp(query, 'i')) != -1;
//            var isGroup = item.hasClass('gListGroup');

//            if (!isGroup) {
//                ConditionallyHide(item, match);
//            }
//        }

//        for (var i = 0; i < allItems.length; i++) {
//            var item = $(allItems[i]);
//            var isGroup = item.hasClass('gListGroup');

//            if (isGroup) {
//                var hasChildren = false;
//                for (var j = i + 1; j < allItems.length; j++) {
//                    var subItem = $(allItems[j]);
//                    if (subItem.attr('isseperator')) {
//                        j = allItems.length; //stop, we're at another group
//                        continue;
//                    }
//                    if (subItem.css('display') != "none")
//                        hasChildren = true;
//                }

//                ConditionallyHide(item, hasChildren);
//            }
//        }
//    }, 10);
//}

// Added for DateTimePicker/DateTimeColumn 508 compliance
function focusPicker(sender, eventArgs) {
    CheckDatePicker(sender, eventArgs);
    if (lastActivePicker) {
        //alert("World");
        lastActivePicker.get_dateInput().focus();
    }
}

function CheckDatePicker(sender, eventArgs) {
    Telerik.Web.UI.RadDatePicker.prototype.togglePopup = function () {
        if (this.isPopupVisible()) {
            lastActivePicker = null;
            this.hidePopup();
        }
        else {
            lastActivePicker = this;
            this.showPopup();
            var thiz = this;
            setTimeout(function () {
                $telerik.getElementByClassName(thiz.get_popupContainer(), "rcMainTable").focus();
            }, 10);
        }

        return false;
    }

}


// Added for DateTimePicker/DateTimeColumn 508 compliance

if (!Telerik.Web.UI.RadDatePicker == false) {
    Telerik.Web.UI.RadDatePicker.prototype.togglePopup = function () {

        if (this.isPopupVisible()) {
            lastActivePicker = null;
            this.hidePopup();
        }
        else {
            lastActivePicker = this;
            this.showPopup();
            var thiz = this;
            setTimeout(function () {
                $telerik.getElementByClassName(thiz.get_popupContainer(), "rcMainTable").focus();
            }, 10);
        }
        return false;
    }
}

//PFM-3442  [Mockups] 508 Compliancy: Radlist box form labels missing  
function ListBoxOnLoadFormLabel(sender) {

    $('li', $('#' + sender.get_id())).each(function (index) {// for 508 and checkbox focus tooltip 

        var item = $(this);
        var chkItem = $(sender.getItem(index).get_checkBoxElement());
        var spanItem = $(sender.getItem(index).get_textElement());

        if (chkItem.length > 0) {
            chkItem.attr('name', item.attr('id') + '_chk' + index);
            chkItem.attr('id', item.attr('id') + '_chk' + index);
            //PLSUP-5195
            //there was 508 issue that the label for each RadListBoxItem did not have any associated text.
            //this line fixes that.
            chkItem.text(item.text());
            var lbl = $('#' + item.attr('id') + '_chk_' + 'lbl');

            if (lbl.length > 0) {

                lbl.remove();
            }

            var lbl = $('<label>').append(chkItem);
            item.empty();
            item.append(lbl);
            item.append(spanItem);
        }
    });
}

function ConditionallyHide(element, condition) {
    if (condition)
        $(element).css('display', '');
    else
        $(element).css('display', 'none');
}

function SetExclusiveRadioSelection(groupName, selectedId) {
    $('input:radio[value*=' + groupName + ']').attr('checked', false);
    $('#' + selectedId).attr('checked', true);
}

function SetISDLabelOnBlur(combobox) {
    var currentCountry = $('#' + combobox.get_id()).val();
    var listItem;
    for (i = 0; i < combobox.get_items().get_count() ; i++) {
        if (combobox.get_items().getItem(i).get_text() == currentCountry) {
            listItem = $(combobox.get_items().getItem(i).get_element());
        }
    }
    var label = $('#' + listItem.attr('labelId'));
    if (listItem.attr('isdcode')) {
        label.text(' ' + listItem.attr('isdcode') + ' ');
    }
    else {
        label.text('');
    }
}

var REISys;
(function (REISys) {
    (function (Platform) {
        (function (Web) {
            (function (Layout) {
                (function (ToolBar) {
                    (function (PrintToolbarLinks) {
                        var PrintData = (function () {
                            function PrintData() { }
                            PrintData.DelayTime = 0;
                            return PrintData;
                        })();
                        PrintToolbarLinks.PrintData = PrintData;
                    })(ToolBar.PrintToolbarLinks || (ToolBar.PrintToolbarLinks = {}));
                    var PrintToolbarLinks = ToolBar.PrintToolbarLinks;

                })(Layout.ToolBar || (Layout.ToolBar = {}));
                var ToolBar = Layout.ToolBar;

            })(Web.Layout || (Web.Layout = {}));
            var Layout = Web.Layout;

        })(Platform.Web || (Platform.Web = {}));
        var Web = Platform.Web;

    })(REISys.Platform || (REISys.Platform = {}));
    var Platform = REISys.Platform;

})(REISys || (REISys = {}));

function PlatformLoad() {
    $('div.pseudoInlineBlock[id*=International] li').bind('click',
        function () {
            var currentItem = $(this);
            var label = $('#' + currentItem.attr('labelId'));
            if (currentItem.attr('isdcode')) {
                label.text(' ' + currentItem.attr('isdcode') + ' ');
            }
            else {
                label.text('');
            }
        });

    //commented this code out because the queryListBoxItems function is not working properly

    // pfm-2520 enable lisbox filtering
    //$('.filter-textbox').keyup(queryListBoxItems).bind('paste', function (e) { queryListBoxItems(e); });

    /* PFM-2167 Check for Enter Key Press on page, if so then find the search button on the Search Panel */
    $('#tblSearchPanel > div > div:not(.btnArea)').keypress(function (e) {
        if (e.keyCode == 13) {

            return false;
        }
    });


    //We will release those resources that would have been held if an ajax post was done before
    //deactive_tiptip function in jquery_plugins.js got called to clean up resources.
    while (tooltipTimeouts.length > 0) {
        clearTimeout(tooltipTimeouts.pop());
    }

    //We will release those resources that would have been held if an ajax post was done before
    //deactive_tiptip function in jquery_plugins.js got called to clean up resources.
    while (tiptipHolders.length > 0) {
        tiptipHolders.pop().remove();
    }

    // hide tooltip on ajax refresh
    $('#tiptip_holder').hide();

    /* Footer Bar Tooltips */
    // tooltips have to go in PlatformLoad because favorites uses an update panel.
    // after the update panel sends its request, the favorite control loses its tooltip.
    $('#footpanel li a').mouseenter(function () {
        $('#footpanel small, #footpanel big').hide();
        if (!$(this).is('.fg-menu-open, .menu-open'))
            $('small, big', this).show();
    });
    $('#footpanel li a + div').prev().click(function () {
        $('small, big', this).hide();
    });

    $('#footpanel a').mouseleave(function () {
        $('#footpanel small, #footpanel big').hide();

    });
    // get the title attributes before the toolip method call and save it for future.
    $(".valimg.tooltip").each(function () {
        valTitleattributes[$(this).parent().attr('id')] = $(this).attr('title');
    });

    $("img.rpImage").tipTip();
    $(".tooltip, .rgHeader>a, .rgPager input , input.rgFilter, input.rgSortAsc , input.rgSortDesc ").tipTip();
    //$("*[title]").tipTip();
    if (REISys.Platform.OptionalTooltip)
        $(".tooltipOptional").tipTip();
    else
        $(".tooltipOptional").removeAttr("title");

    $('input.rgExpand').bind('click', function () {
        if ($(this).hasClass("rgCollapse"))
            $(this).attr("title", "Collapse").tipTip();
        if ($(this).hasClass("rgExpand"))
            $(this).attr("title", "Expand").tipTip();
    });
    $('.rgHeader').removeAttr('title');
    $('.dynamic-tooltip').mouseover(function () {

    });

    $('.contextmenuarrow').tipTip({
        onactivate: function (t) { return !($("#" + $(t).attr('rel')).is(":visible")); }
    });

    //for print
    if ($.query.get('print') != '') {
        setTimeout(function () {
            window.print();
        }, REISys.Platform.Web.Layout.ToolBar.PrintToolbarLinks.PrintData.DelayTime);
    }


    $('.fg-button').hover
    (
		function () { $(this).removeClass('ui-state-default').addClass('ui-state-focus'); },
		function () { $(this).removeClass('ui-state-focus').addClass('ui-state-default'); }
    );

    $('#tickler, #portfolio, #fav, #recent, #print, #ngalinks, #Actions, #help, #collapse, #ViewLinks').each(function (menuElement) {
        $(this).fgmenu({ content: $(this).next().html(), flyOut: true });
    });

    if (!(typeof menuIds == 'undefined')) {
        $(menuIds).each(function (menuElement) {
            $(this).fgmenu({ content: $(this).next().html(), flyOut: true });
        });
    }

    $('.reiflyovermenu').each(function (menuElement) {
        if ($(this).next().length > 0) {
            $(this).fgmenu({ content: $(this).next().html(), flyOut: true, id: $(this).parent().attr('id') });
        }
    });

    var printMenu = allUIMenus.find('print-menu');

    if (printMenu) {
        // add a handler for the default link. the others will open a new tab and pass the print=t rue flag to BasePage
        printMenu.container.find('a:eq(0)').click(function (e) {
            // no need to open a tab for the current page unless javascript is disabled. we'll show the dialog immediately.
            //Hide entire tool bar before the print dialog window pops up. (PFM-4808)
            $('#footpanel').hide();
            window.print();
            //After the print dialog window pops up and the user takes an action, display the entire tool bar again. (PFM-4808)
            $('#footpanel').show();
        });

        printMenu.container.find('a:gt(0)').click(function (e) {
            // we had to use a custom attribute, because the page would post back otherwise. even if we used e.preventDefault();
            // something to do with fgmenu. fgmenu also prevents the target="_blank" attribute from opening a new tab. we
            // used "#" as the href attribute and stored the real href in a custom attribute server side (hrefII). see PrintMenu.ascx.cs.
            var url = $(this).attr("hrefII");
            window.open(url);
        });
    }

    var layoutSettings = getCookie(REISys.Platform.LayoutCookieName);
    layoutMenu = allUIMenus.find('layout-menu');

    if (layoutMenu)
        layoutMenu = layoutMenu.container;

    // if the user is logged in and the toolbar is on the page. check to see if layoutSettings is null, if it is null, get the visiblity of the top panel and left panel.
    if (layoutSettings == null && layoutMenu) {
        hideLeftPanel = $('#leftpanel').is(':visible') == true ? false : true;
        hideTopPanel = $('#toppanel').is(':visible');
        updateExpandAndCollapseOptions();
    }

    // if the user is logged in and the toolbar is on the page. Also see Default.master.cs with WebUtility.GetLayoutSettings for server side implementation.
    if (layoutSettings != null && layoutMenu) {
        // if the user has had their settings persisted (i.e. used the menu)
        if (layoutSettings != '') {
            var settings = layoutSettings.split(',');
            var leftSetting = settings[0] == 'true' ? true : false;
            var topSetting = settings[1] == 'true' ? true : false;

            hideLeftPanel = leftSetting /* client setting may have been overridden server side */ || $('#leftpanel').css('margin-left') == '-180px';
            hideTopPanel = topSetting /* client setting may have been overridden server side */ && !$('#toppanel').is(':hidden');
        }

        updateToggleBothOption();
        updateExpandAndCollapseOptions();
    }
    // Resource Pop Up Script
    $(".popUpClass").each(function () {
        //alert(this);
        var popUpheight = '600';
        var popUpWidth = '980';
        var popUpTitle = 'PopUp';
        if ($(this).attr('target') == "_blank") {
            if ($(this).attr('popUpheight') != undefined)
                popUpheight = $(this).attr('popUpheight');
            if ($(this).attr('popUpWidth') != undefined)
                popUpWidth = $(this).attr('popUpWidth');
            if ($(this).attr('popUpTitle') != undefined && $(this).attr('popUpTitle').length > 0)
                popUpTitle = $(this).attr('popUpTitle');

            var url = "javascript:OpenPopupWithMenuBar('" + $(this).attr('href') + "','" + popUpheight + "', '" + popUpWidth + "', '" + popUpTitle + "')";

            $(this).attr('href', url);
            $(this).removeAttr('target');
        }
    });
	
    $(document).ready(function () {
        //Collapse AddressViews
        var addressViewExpdLinkId;
        $('.AddressViewMainBody').each(function () {
            addressViewExpdLinkId = null;
            var localExpd = $('.AddressViewExpdLink', this.parentNode);
            if (localExpd) {
                localExpd.each(function () { addressViewExpdLinkId = this.id; });

                if (addressViewExpdLinkId) {
                    if (!localExpd.attr('LoadRun')) {
                        localExpd.attr('LoadRun', true);
                        DivToggleCloseAddress(this.id, addressViewExpdLinkId);
                    }

                }
            }

        });
		
		//implementation for logging recent urls for error reporting
		if (REISys.Platform.DisableErrorReporting_Last5Actions == "0"){
			try {
				var key = REISys.Platform.CurrentSessionID + "_ErrorReportingLog";
				if (key != null && key != "") {
					var url = $(location).attr("href");
					var pfmInUrl = url.toLowerCase().indexOf("platform") > -1;
					if (!(pfmInUrl && url.toLowerCase().indexOf("error.aspx") > -1) && !(pfmInUrl && url.toLowerCase().indexOf("staticerror.aspx") > -1) && url.toLowerCase().indexOf("erroroverlay.aspx") == -1) {
						var sm = ReiSys.Platform.LocalStorage.StoreManager;
						if (!sm.has(key)) {
							var obj = new ReiSys.Platform.LastActions.LastActionsModel();
							obj.addUrl(url);
							var jsonString = JSON.stringify(obj);
							sm.set(key, jsonString, true);
						}
						else {
							var jsonLog = sm.get(key);
							var log = new ReiSys.Platform.LastActions.LastActionsModel(jsonLog);
							log.addUrl(url);
							sm.set(key, JSON.stringify(log), true);
						}
					}
				}
			}
			catch (e) {
				throw "Error: Encountered an error logging the last user actions";
			}
		
			//click event to capture page actions for error logging
			$("[class*=LogAction]").click(function (e) {
				try {
					var key = REISys.Platform.CurrentSessionID + "_ErrorReportingLog";
					if (key != null && key != "") {
						var sm = ReiSys.Platform.LocalStorage.StoreManager;
						if (sm.has(key)) {
							if (e.target != null) {
								var json = sm.get(key);
								var log = new ReiSys.Platform.LastActions.LastActionsModel(json);
								if ($(e.target).is("input"))
									log.addPageAction(e.target.value, $(location).attr("href"));
								else {
									if (e.target.text != null && e.target.text != "")
										log.addPageAction(e.target.text, $(location).attr("href"));
									else {
										//handles toolbar page actions that are not under the 'other actions' list
										var copy = $(e.currentTarget);
										copy.find("big").remove();
										log.addPageAction(copy.text(), $(location).attr("href"));
									}
								}
                                
								sm.set(key, JSON.stringify(log), true);
							}
						}
					else
						throw "Error: The key for url error logging was not found in local storage";
					}
				}
				catch (e) {
					throw "Error: Encountered an error while logging the last user actions";
				}
    
			});
		
			//intercept information for ajax requests upon completion for error logging
			$(document).ajaxComplete(function (event, request, settings) {
				try {
					var key = REISys.Platform.CurrentSessionID + "_ErrorReportingLog";
					if (key != null && key != "") {
						var sm = ReiSys.Platform.LocalStorage.StoreManager;
						if (sm.has(key)) {
							var json = sm.get(key);
							var log = new ReiSys.Platform.LastActions.LastActionsModel(json);
							log.addAjaxRequestUrl(settings.url, event.delegateTarget.URL);
							sm.set(key, JSON.stringify(log), true);
						}
						else
						throw "Error: The key for url error logging was not found in local storage";
					}
				}
				catch (e) {
					throw "Error: Encountered an error while logging the last user actions";
				}
			});
		}
		
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //////  Truncate function based on attributes maxtextlength, collapsedText, and expandedText  /////
    //////////////////////////////////////////////////////////////////////////////////////////////////
    $(".truncateText").each(function () {
        if ($(this).attr('truncated') != 'true') {

            var tempControl = $(this);
            var threshold = parseFloat(tempControl.attr('threshold'));
            if (isNaN(threshold)) {
                threshold = 0;
            }

            var maxLength = parseFloat(tempControl.attr('maxtextlength'));
            if (isNaN(maxLength)) {
                maxLength = 125;
            }
            tempControl.truncate((maxLength + threshold), {
                chars: /\s/,
                trail: ["...&nbsp; (<a href='#' class='truncate_show'>" + (tempControl.attr('collapsedtext') || '+ View More') + "</a>)", "&nbsp;(<a href='#' class='truncate_hide'>" + (tempControl.attr('expandedtext') || '- View Less') + "</a>)"]
            });

        }
        $(this).attr('truncated', 'true');
    });

    // Displaying Messages Icon in toolbar
    if ($(".showmsgiconintoolbar").is(":visible")) {
        $(".msgtoolbarbtn").attr('href', "#" + $(".showmsgiconintoolbar").first().attr("id"));
        $(".msgtoolbarbtn").show();
    }
    else {
        $(".msgtoolbarbtn").hide();
        $(".msgtoolbarbtn").parent().hide(); // Hide parent LI // 508 Compliance
    }

    // Displaying Messages Icon in toolbar
    if ($(".showPrsnCmticonintoolbar").size() > 0) {
        $(".prsnCmticontoolbarbtn").attr('href', "#" + $(".showPrsnCmticonintoolbar").first().attr("id"));
        $(".prsnCmticontoolbarbtn").show();
        if (!$(".msgtoolbarbtn").is(":visible")) {
            $(".prsnCmticontoolbarbtn").addClass("ui-left")
        }
    }
    else {
        $(".prsnCmticontoolbarbtn").hide();
        $(".prsnCmticontoolbarbtn").parent().hide(); // Hide parent LI // 508 Compliance
    }
}

$(function () {
    $('.widget-filter-icon').parent().click(function () {
        $(this).nextAll('.widget-filter-category-popup').toggle();
        return false;
    });
    $(document).mouseup(function (e) {
        if (!$(e.target).is('.widget-filter-icon, .widget-filter-category-popup, .widget-filter-category-popup *'))
            $('.widget-filter-category-popup').hide();
    });
});

$(document).ready(function () {
    $(".scroll").click(function (event) {
        //prevent the default action for the click event

        try {
            event.preventDefault();

            //get the full url - like mysitecom/index.htm#home
            var full_url = this.href;

            //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
            var parts = full_url.split("#");
            var trgt = parts[1];

            //get the top offset of the target anchor
            var target_offset = $("#" + trgt).offset();
            var target_top = target_offset.top;

            //goto that anchor by setting the body scroll top to anchor top
            $('html, body').animate({ scrollTop: target_top }, 500);
        } catch (e) { }
    });
});


function SetUpLeftMenuEvents() {
    $("#hidePanel").click(function () {
        $('#colleft').attr('style', 'display:none');
        $("#showPanel").attr('style', 'display:block');
        HideLeftPanel(true);

        $("#colright").animate({ marginLeft: "26px" }, 500, function () { setTimeout("AdjustMainArea", 200) });
    });
    $("#showPanel").click(function () {
        $('#colleft').attr('style', 'display:block');
        $("#showPanel").attr('style', 'display:none');
        ShowLeftPanel(true);
        $("#colright").animate({ marginLeft: "180px" }, 200, function () {
            setTimeout("AdjustMainArea", 100);
        });
    });
}
$(document).ready(function () {

    funcFlyout(".fontflyout", "menu-open");
    funcFlyout(".btmflyout", "menu-open");
    funcFlyout(".savesearch", "menu-open");
    funcFlyout(".searchsaved", "menu-open");
    funcFlyout(".toolbar_note", "menu-open");

    $(".btn-slide").click(function () {
        ToggleTopNavigation();
        this.title = $(this).is('.pactive') ? 'Expand' : 'Collapse';
        $('#btnSlideHiddenOffScreen').html($(this).is('.pactive') ? 'Expand Top Navigation' : 'Collapse Top Navigation')
        $('.tooltip').tipTip();
    });


    $(".pagenote .pagenote_close").click(function () {
        $(this).parents(".pagenote").animate({ opacity: 'hide' }, "fast");
    });

    $(".winmodule_close").click(function () {
        ToggleVisibility('tblSearchTask'); return false;
    });

    SetUpLeftMenuEvents();
    //PLSUP-3802 [508] Set disabled Left Menu items as Not Tabbable and not included in Link List
    $('a.cmDisabled', 'div#leftpanel').attr('tabindex', '-1');
    $('a.cmDisabled', 'div#leftpanel').removeAttr('href');

    // hides the slick box as soon as the DOM is ready
    // (a little sooner than page load)
    $('#showhidebox').hide();
    $('a#show-toggle').toggle(
        function () { $('#showhidebox').show('slow'); },
        function () { $('#showhidebox').hide('fast'); }
    );

    $(".hidden1").hide();
    $(".show").html("+ Show More Options");

    $(".show").click(function () {
        if (this.className.indexOf('clicked') != -1) {
            $(this).next().slideUp(500);
            $(this).removeClass('clicked')
            $(this).html("+ Show More Options");
        }
        else {
            $(this).addClass('clicked')
            $(this).next().slideDown(500);
            $(this).html("- Show Less Options");
        }
    });

    $('.newsread a').click(function () {
        $(this).parent('li').remove();
        return false;
    })

    $(".instructions").truncate(170, {
        chars: /\s/,
        trail: [" (<a href='#' class='truncate_show'>+ View More</a>)", " (<a href='#' class='truncate_hide'>- View Less</a>)"]
    });

    $(".instructions1").truncate(170, {
        chars: /\s/,
        trail: [" (<a href='#' class='truncate_show'>+ View More</a>)", " (<a href='#' class='truncate_hide'>- View Less</a>)"]
    });
    $(".moreinfo").truncate(100, {
        chars: /\s/,
        trail: [" (<a href='#' class='truncate_show'>+ More</a>)", "(<a href='#' class='truncate_hide'>- Less</a>)"]
    });


});


function scriptPageLoad(sender, args) {

    $(".modalInput").each(function (index) {
        var $this = $(this);

        $this.overlay({
            // some expose tweaks suitable for modal dialogs
            expose: {
                color: '#000',
                loadSpeed: 200,
                opacity: 0.30,

            },

            onClose: function () {
                $this.focus();
            },
            onLoad: function () {
                var overlay = this.getOverlay();

                $("#exposeMask").css("z-index", "10000").click(function () {
                    overlay.find(":focusable").first().focus();
                });

                var close = overlay.find(".close");
                if (overlay.attr("showClose") === "false") {
                    close.hide();
                }
                close.attr('href', "javascript:void(0);");
                if ($(close).children('#imgClose').length == 0)
                    close.append("<img id='imgClose' src='" + REISys.Platform.WebRoot + "/platform/include/skins/" + ReiSys.Utilities.Util.ImagePath + "/images/close_1.png" + "' alt='Close Window'/>");

                overlay.find(":focusable").first().focus();

                var buttons = $(".modal input[type=button]").click(function (e) {
                    $(".modalInput").each(function () {
                        $(this).overlay().close();

                    });
                });

                //when the last button on overlay window loses focus then focus on close icon in the overlay window    
                if (overlay.hasClass('loopOnBlur')) {
                    overlay.find(":focusable:last").bind('blur', function (e) {
                        var overlayElements = overlay.find(":focusable");
                        if (!$.browser.mozilla || overlayElements.length > 1) {
                            //need setTimeout for IE11 - fix issue where focus goes outside overlay the first time
                            setTimeout(function () { overlayElements.first().focus(); }, 0);
                        } else {
                            var self = this;
                            setTimeout(function () { self.focus(); }, 10);
                        }
                    });
                }
            },

            closeOnClick: false,
            closeOnEsc: true
        });
    });

    $(".modalExternal").each(function (index) {
        var $this = $(this);

        $this.overlay({
            // some expose tweaks suitable for modal dialogs

            expose: {
                color: '#000',
                loadSpeed: 200,
                opacity: 0.80,
            },
            onBeforeLoad: function () {

                // grab wrapper element inside content
                var wrap = this.getOverlay().find(".contentWrap");

                // load the page specified in the trigger
                wrap.load(this.getTrigger().attr("href"));
            },
            onLoad: function () {
                var overlay = this.getOverlay();
                $("#exposeMask").css("z-index", "10000").click(function () {
                    overlay.find(":focusable").first().focus();
                });


                var close = overlay.find(".close");
                if (overlay.attr("showClose") === "false") {
                    close.hide();
                }
                close.attr('href', "javascript:void(0);");
                if ($(close).children('#imgClose').length == 0)
                    close.append("<img id='imgClose' src='" + REISys.Platform.WebRoot + "/platform/include/skins/" + ReiSys.Utilities.Util.ImagePath + "/images/close_1.png" + "' alt='Close Window'/>");

                overlay.find(":focusable").first().focus();

                var buttons = $(".modal input[type=button]").click(function (e) {
                    $(".modalExternal").each(function () {
                        $(this).overlay().close();
                    });
                });

                //when the last button on overlay window loses focus then focus on close icon in the overlay window    
                if (overlay.hasClass('loopOnBlur')) {
                    overlay.find(":focusable:last").bind('blur', function (e) {
                        var overlayElements = overlay.find(":focusable");
                        if (!$.browser.mozilla || overlayElements.length > 1) {
                            //need setTimeout for IE11 - fix issue where focus goes outside overlay the first time
                            setTimeout(function () { overlayElements.first().focus(); }, 0);
                        } else {
                            var self = this;
                            setTimeout(function () { self.focus(); }, 10);
                        }
                    });
                }
            },

            closeOnClick: false,
            closeOnEsc: true
        });
    });


    $(".modalIFrame").each(function (index) {
        var $this = $(this);

        $this.overlay({
            // some expose tweaks suitable for modal dialogs
            expose: {
                color: '#000',
                loadSpeed: 200,
                opacity: 0.30,

            },

            onClose: function () {
                $this.focus();
            },
            onLoad: function () {
                var overlay = this.getOverlay();

                $("#exposeMask").css("z-index", "10000").click(function () {
                    overlay.find(":focusable").first().focus();
                });

                var close = overlay.find(".close");
                if (overlay.attr("showClose") === "false") {
                    close.hide();
                }
                close.attr('href', "javascript:void(0);");
                if ($(close).children('#imgClose').length == 0)
                    close.append("<img id='imgClose' src='" + REISys.Platform.WebRoot + "/platform/include/skins/" + ReiSys.Utilities.Util.ImagePath + "/images/close_1.png" + "' alt='Close Window'/>");

                overlay.find(":focusable").first().focus();

                var buttons = $(".modal input[type=button]").click(function (e) {
                    $(".modalInput").each(function () {
                        $(this).overlay().close();

                    });
                });

            },

            closeOnClick: false,
            closeOnEsc: true
        });
    });



    if ($('#ConfigureNoAsso, #Configure').length > 0) {
        $('a[data-helplink=helplink]').each(function (index) {
            var $this = $(this);

            $('#ConfigureNoAsso, #Configure').appendTo('#mainarea');
            $this.overlay({
                // some expose tweaks suitable for modal dialogs
                expose: {
                    color: '#000',
                    loadSpeed: 200,
                    opacity: 0.30,
                    close: true
                },

                onClose: function () {
                    $this.focus();
                },
                onLoad: function () {
                    var overlay = this.getOverlay();

                    $("#exposeMask").css("z-index", "10000").click(function () {
                        overlay.find(":focusable").first().focus();
                    });

                    var close = overlay.find(".close");
                    if (overlay.attr("showClose") === "false") {
                        close.hide();
                    }
                    close.attr('href', "javascript:void(0);");
                    if ($(close).children('#imgClose').length == 0)
                        close.append("<img id='imgClose' src='" + REISys.Platform.WebRoot + "/platform/include/skins/" + ReiSys.Utilities.Util.ImagePath + "/images/close_1.png" + "' alt='Close Window'/>");

                    overlay.find(":focusable").first().focus();

                    var buttons = $(".modal input[type=button]").click(function (e) {
                        $(".modalInput").each(function () {
                            $(this).overlay().close();

                        });
                    });

                    //when the last button on overlay window loses focus then focus on close icon in the overlay window    
                    if (overlay.hasClass('loopOnBlur')) {
                        overlay.find(":focusable:last").bind('blur', function (e) {
                            var overlayElements = overlay.find(":focusable");
                            if (!$.browser.mozilla || overlayElements.length > 1) {
                                //need setTimeout for IE11 - fix issue where focus goes outside overlay the first time
                                setTimeout(function () { overlayElements.first().focus(); }, 0);
                            } else {
                                var self = this;
                                setTimeout(function () { self.focus(); }, 10);
                            }
                        });
                    }
                },

                closeOnClick: false,
                closeOnEsc: true
            });
        });
    }
}

function AutoTabById(cur_fieldId, char_max, next_fieldId) {
    var cur_field = document.getElementById(cur_fieldId);
    var next_field = document.getElementById(next_fieldId);
    if (cur_field.value.length == char_max) {
        next_field.focus();
    }
}

function AutoTabWithBackspaceById(event, prev_fieldId, cur_fieldId, char_max, next_fieldId) {
    var code = (event.keyCode ? event.keyCode : event.which);

    var prev_field = document.getElementById(prev_fieldId);
    var cur_field = document.getElementById(cur_fieldId);
    var next_field = document.getElementById(next_fieldId);

    var cur_field_length = cur_field.value.length;

    if (cur_field_length == char_max && next_field != null && code != 9 && code != 16 && code != 37 && code != 38 && code != 39 && code != 40) {
        next_field.focus();
    }
    else if (cur_field_length == 0 && prev_field != null && code == 8 && code != 46) {
        SetCaretAtEnd(prev_field);
    }
}

function SetCaretAtEnd(elem) {
    var elemLen = elem.value.length;
    // For IE Only 
    if (document.selection) {
        elem.focus();
        var oSel = document.selection.createRange();
        oSel.moveStart('character', -elemLen);
        oSel.moveStart('character', elemLen);
        oSel.moveEnd('character', 0);
        oSel.select();
    }
    else if (elem.selectionStart || elem.selectionStart == '0') {
        // Firefox/Chrome 
        elem.selectionStart = elemLen;
        elem.selectionEnd = elemLen;
        elem.focus();
    }
}

$(function () {
    var topMenu = $('#toppanel');
    // if it is collapsed but was not disabled, we need to slide the toggle
    if (topMenu.is(":hidden") && topMenu.html() != null) {
        $('.btn-slide').toggleClass('pactive');
        $('.btn-slide')[0].title = $('.btn-slide').is('.pactive') ? 'Expand' : 'Collapse';
        $('#btnSlideHiddenOffScreen').html($('.btn-slide').is('.pactive') ? 'Expand Top Navigation' : 'Collapse Top Navigation');
    }

    // callout popup on toolbar
    setTimeout(function () {
        $('.toolbar_callout')
        .fadeIn('slow')
        .find('.lnkfooter_callout')
        .click(function () {
            $.ajax({
                type: 'POST',
                data: JSON.stringify({ userId: REISys.Platform.CurrentUserId, name: 'ShowCallOut', value: false }),
                url: REISys.Platform.WebRoot + 'Platform/WebServices/PreferenceService.svc/UpdatePreference',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    $('.toolbar_callout').fadeOut('slow');
                }
            });
        });
    }, 1500);
});

/******************Carousel*************/
(function ($) { $.fn.jcarousel = function (o) { return this.each(function () { new r(this, o) }) }; var q = { vertical: false, start: 1, offset: 1, size: null, scroll: 3, visible: null, animation: 'normal', easing: 'swing', auto: 0, wrap: null, initCallback: null, reloadCallback: null, itemLoadCallback: null, itemFirstInCallback: null, itemFirstOutCallback: null, itemLastInCallback: null, itemLastOutCallback: null, itemVisibleInCallback: null, itemVisibleOutCallback: null, buttonNextHTML: '<div></div>', buttonPrevHTML: '<div></div>', buttonNextEvent: 'click', buttonPrevEvent: 'click', buttonNextCallback: null, buttonPrevCallback: null }; $.jcarousel = function (e, o) { this.options = $.extend({}, q, o || {}); this.locked = false; this.container = null; this.clip = null; this.list = null; this.buttonNext = null; this.buttonPrev = null; this.wh = !this.options.vertical ? 'width' : 'height'; this.lt = !this.options.vertical ? 'left' : 'top'; var a = '', split = e.className.split(' '); for (var i = 0; i < split.length; i++) { if (split[i].indexOf('jcarousel-skin') != -1) { $(e).removeClass(split[i]); var a = split[i]; break } } if (e.nodeName == 'UL' || e.nodeName == 'OL') { this.list = $(e); this.container = this.list.parent(); if (this.container.hasClass('jcarousel-clip')) { if (!this.container.parent().hasClass('jcarousel-container')) this.container = this.container.wrap('<div></div>'); this.container = this.container.parent() } else if (!this.container.hasClass('jcarousel-container')) this.container = this.list.wrap('<div></div>').parent() } else { this.container = $(e); this.list = $(e).find('>ul,>ol,div>ul,div>ol') } if (a != '' && this.container.parent()[0].className.indexOf('jcarousel-skin') == -1) this.container.wrap('<div class=" ' + a + '"></div>'); this.clip = this.list.parent(); if (!this.clip.length || !this.clip.hasClass('jcarousel-clip')) this.clip = this.list.wrap('<div></div>').parent(); this.buttonPrev = $('.jcarousel-prev', this.container); if (this.buttonPrev.size() == 0 && this.options.buttonPrevHTML != null) this.buttonPrev = this.clip.before(this.options.buttonPrevHTML).prev(); this.buttonPrev.addClass(this.className('jcarousel-prev')); this.buttonNext = $('.jcarousel-next', this.container); if (this.buttonNext.size() == 0 && this.options.buttonNextHTML != null) this.buttonNext = this.clip.before(this.options.buttonNextHTML).prev(); this.buttonNext.addClass(this.className('jcarousel-next')); this.clip.addClass(this.className('jcarousel-clip')); this.list.addClass(this.className('jcarousel-list')); this.container.addClass(this.className('jcarousel-container')); var b = this.options.visible != null ? Math.ceil(this.clipping() / this.options.visible) : null; var c = this.list.children('li'); var d = this; if (c.size() > 0) { var f = 0, i = this.options.offset; c.each(function () { d.format(this, i++); f += d.dimension(this, b) }); this.list.css(this.wh, f + 'px'); if (!o || o.size === undefined) this.options.size = c.size() } this.container.css('display', 'block'); this.buttonNext.css('display', 'block'); this.buttonPrev.css('display', 'block'); this.funcNext = function () { d.next() }; this.funcPrev = function () { d.prev() }; this.funcResize = function () { d.reload() }; if (this.options.initCallback != null) this.options.initCallback(this, 'init'); if ($.browser.safari) { this.buttons(false, false); $(window).bind('load', function () { d.setup() }) } else this.setup() }; var r = $.jcarousel; r.fn = r.prototype = { jcarousel: '0.2.3' }; r.fn.extend = r.extend = $.extend; r.fn.extend({ setup: function () { this.first = null; this.last = null; this.prevFirst = null; this.prevLast = null; this.animating = false; this.timer = null; this.tail = null; this.inTail = false; if (this.locked) return; this.list.css(this.lt, this.pos(this.options.offset) + 'px'); var p = this.pos(this.options.start); this.prevFirst = this.prevLast = null; this.animate(p, false); $(window).unbind('resize', this.funcResize).bind('resize', this.funcResize) }, reset: function () { this.list.empty(); this.list.css(this.lt, '0px'); this.list.css(this.wh, '10px'); if (this.options.initCallback != null) this.options.initCallback(this, 'reset'); this.setup() }, reload: function () { if (this.tail != null && this.inTail) this.list.css(this.lt, r.intval(this.list.css(this.lt)) + this.tail); this.tail = null; this.inTail = false; if (this.options.reloadCallback != null) this.options.reloadCallback(this); if (this.options.visible != null) { var a = this; var b = Math.ceil(this.clipping() / this.options.visible), wh = 0, lt = 0; $('li', this.list).each(function (i) { wh += a.dimension(this, b); if (i + 1 < a.first) lt = wh }); this.list.css(this.wh, wh + 'px'); this.list.css(this.lt, -lt + 'px') } this.scroll(this.first, false) }, lock: function () { this.locked = true; this.buttons() }, unlock: function () { this.locked = false; this.buttons() }, size: function (s) { if (s != undefined) { this.options.size = s; if (!this.locked) this.buttons() } return this.options.size }, has: function (i, a) { if (a == undefined || !a) a = i; if (this.options.size !== null && a > this.options.size) a = this.options.size; for (var j = i; j <= a; j++) { var e = this.get(j); if (!e.length || e.hasClass('jcarousel-item-placeholder')) return false } return true }, get: function (i) { return $('.jcarousel-item-' + i, this.list) }, add: function (i, s) { var e = this.get(i), old = 0, add = 0; if (e.length == 0) { var c, e = this.create(i), j = r.intval(i); while (c = this.get(--j)) { if (j <= 0 || c.length) { j <= 0 ? this.list.prepend(e) : c.after(e); break } } } else old = this.dimension(e); e.removeClass(this.className('jcarousel-item-placeholder')); typeof s == 'string' ? e.html(s) : e.empty().append(s); var a = this.options.visible != null ? Math.ceil(this.clipping() / this.options.visible) : null; var b = this.dimension(e, a) - old; if (i > 0 && i < this.first) this.list.css(this.lt, r.intval(this.list.css(this.lt)) - b + 'px'); this.list.css(this.wh, r.intval(this.list.css(this.wh)) + b + 'px'); return e }, remove: function (i) { var e = this.get(i); if (!e.length || (i >= this.first && i <= this.last)) return; var d = this.dimension(e); if (i < this.first) this.list.css(this.lt, r.intval(this.list.css(this.lt)) + d + 'px'); e.remove(); this.list.css(this.wh, r.intval(this.list.css(this.wh)) - d + 'px') }, next: function () { this.stopAuto(); if (this.tail != null && !this.inTail) this.scrollTail(false); else this.scroll(((this.options.wrap == 'both' || this.options.wrap == 'last') && this.options.size != null && this.last == this.options.size) ? 1 : this.first + this.options.scroll) }, prev: function () { this.stopAuto(); if (this.tail != null && this.inTail) this.scrollTail(true); else this.scroll(((this.options.wrap == 'both' || this.options.wrap == 'first') && this.options.size != null && this.first == 1) ? this.options.size : this.first - this.options.scroll) }, scrollTail: function (b) { if (this.locked || this.animating || !this.tail) return; var a = r.intval(this.list.css(this.lt)); !b ? a -= this.tail : a += this.tail; this.inTail = !b; this.prevFirst = this.first; this.prevLast = this.last; this.animate(a) }, scroll: function (i, a) { if (this.locked || this.animating) return; this.animate(this.pos(i), a) }, pos: function (i) { if (this.locked || this.animating) return; i = r.intval(i); if (this.options.wrap != 'circular') i = i < 1 ? 1 : (this.options.size && i > this.options.size ? this.options.size : i); var a = this.first > i; var b = r.intval(this.list.css(this.lt)); var f = this.options.wrap != 'circular' && this.first <= 1 ? 1 : this.first; var c = a ? this.get(f) : this.get(this.last); var j = a ? f : f - 1; var e = null, l = 0, p = false, d = 0; while (a ? --j >= i : ++j < i) { e = this.get(j); p = !e.length; if (e.length == 0) { e = this.create(j).addClass(this.className('jcarousel-item-placeholder')); c[a ? 'before' : 'after'](e) } c = e; d = this.dimension(e); if (p) l += d; if (this.first != null && (this.options.wrap == 'circular' || (j >= 1 && (this.options.size == null || j <= this.options.size)))) b = a ? b + d : b - d } var g = this.clipping(); var h = []; var k = 0, j = i, v = 0; var c = this.get(i - 1); while (++k) { e = this.get(j); p = !e.length; if (e.length == 0) { e = this.create(j).addClass(this.className('jcarousel-item-placeholder')); c.length == 0 ? this.list.prepend(e) : c[a ? 'before' : 'after'](e) } c = e; var d = this.dimension(e); if (d == 0) { alert('jCarousel: No width/height set for items. This will cause an infinite loop. Aborting...'); return 0 } if (this.options.wrap != 'circular' && this.options.size !== null && j > this.options.size) h.push(e); else if (p) l += d; v += d; if (v >= g) break; j++ } for (var x = 0; x < h.length; x++) h[x].remove(); if (l > 0) { this.list.css(this.wh, this.dimension(this.list) + l + 'px'); if (a) { b -= l; this.list.css(this.lt, r.intval(this.list.css(this.lt)) - l + 'px') } } var n = i + k - 1; if (this.options.wrap != 'circular' && this.options.size && n > this.options.size) n = this.options.size; if (j > n) { k = 0, j = n, v = 0; while (++k) { var e = this.get(j--); if (!e.length) break; v += this.dimension(e); if (v >= g) break } } var o = n - k + 1; if (this.options.wrap != 'circular' && o < 1) o = 1; if (this.inTail && a) { b += this.tail; this.inTail = false } this.tail = null; if (this.options.wrap != 'circular' && n == this.options.size && (n - k + 1) >= 1) { var m = r.margin(this.get(n), !this.options.vertical ? 'marginRight' : 'marginBottom'); if ((v - m) > g) this.tail = v - g - m } while (i-- > o) b += this.dimension(this.get(i)); this.prevFirst = this.first; this.prevLast = this.last; this.first = o; this.last = n; return b }, animate: function (p, a) { if (this.locked || this.animating) return; this.animating = true; var b = this; var c = function () { b.animating = false; if (p == 0) b.list.css(b.lt, 0); if (b.options.wrap == 'both' || b.options.wrap == 'last' || b.options.size == null || b.last < b.options.size) b.startAuto(); b.buttons(); b.notify('onAfterAnimation') }; this.notify('onBeforeAnimation'); if (!this.options.animation || a == false) { this.list.css(this.lt, p + 'px'); c() } else { var o = !this.options.vertical ? { 'left': p } : { 'top': p }; this.list.animate(o, this.options.animation, this.options.easing, c) } }, startAuto: function (s) { if (s != undefined) this.options.auto = s; if (this.options.auto == 0) return this.stopAuto(); if (this.timer != null) return; var a = this; this.timer = setTimeout(function () { a.next() }, this.options.auto * 1000) }, stopAuto: function () { if (this.timer == null) return; clearTimeout(this.timer); this.timer = null }, buttons: function (n, p) { if (n == undefined || n == null) { var n = !this.locked && this.options.size !== 0 && ((this.options.wrap && this.options.wrap != 'first') || this.options.size == null || this.last < this.options.size); if (!this.locked && (!this.options.wrap || this.options.wrap == 'first') && this.options.size != null && this.last >= this.options.size) n = this.tail != null && !this.inTail } if (p == undefined || p == null) { var p = !this.locked && this.options.size !== 0 && ((this.options.wrap && this.options.wrap != 'last') || this.first > 1); if (!this.locked && (!this.options.wrap || this.options.wrap == 'last') && this.options.size != null && this.first == 1) p = this.tail != null && this.inTail } var a = this; this.buttonNext[n ? 'bind' : 'unbind'](this.options.buttonNextEvent, this.funcNext)[n ? 'removeClass' : 'addClass'](this.className('jcarousel-next-disabled')).attr('disabled', n ? false : true); this.buttonPrev[p ? 'bind' : 'unbind'](this.options.buttonPrevEvent, this.funcPrev)[p ? 'removeClass' : 'addClass'](this.className('jcarousel-prev-disabled')).attr('disabled', p ? false : true); if (this.buttonNext.length > 0 && (this.buttonNext[0].jcarouselstate == undefined || this.buttonNext[0].jcarouselstate != n) && this.options.buttonNextCallback != null) { this.buttonNext.each(function () { a.options.buttonNextCallback(a, this, n) }); this.buttonNext[0].jcarouselstate = n } if (this.buttonPrev.length > 0 && (this.buttonPrev[0].jcarouselstate == undefined || this.buttonPrev[0].jcarouselstate != p) && this.options.buttonPrevCallback != null) { this.buttonPrev.each(function () { a.options.buttonPrevCallback(a, this, p) }); this.buttonPrev[0].jcarouselstate = p } }, notify: function (a) { var b = this.prevFirst == null ? 'init' : (this.prevFirst < this.first ? 'next' : 'prev'); this.callback('itemLoadCallback', a, b); if (this.prevFirst !== this.first) { this.callback('itemFirstInCallback', a, b, this.first); this.callback('itemFirstOutCallback', a, b, this.prevFirst) } if (this.prevLast !== this.last) { this.callback('itemLastInCallback', a, b, this.last); this.callback('itemLastOutCallback', a, b, this.prevLast) } this.callback('itemVisibleInCallback', a, b, this.first, this.last, this.prevFirst, this.prevLast); this.callback('itemVisibleOutCallback', a, b, this.prevFirst, this.prevLast, this.first, this.last) }, callback: function (a, b, c, d, e, f, g) { if (this.options[a] == undefined || (typeof this.options[a] != 'object' && b != 'onAfterAnimation')) return; var h = typeof this.options[a] == 'object' ? this.options[a][b] : this.options[a]; if (!$.isFunction(h)) return; var j = this; if (d === undefined) h(j, c, b); else if (e === undefined) this.get(d).each(function () { h(j, this, d, c, b) }); else { for (var i = d; i <= e; i++) if (i !== null && !(i >= f && i <= g)) this.get(i).each(function () { h(j, this, i, c, b) }) } }, create: function (i) { return this.format('<li></li>', i) }, format: function (e, i) { var a = $(e).addClass(this.className('jcarousel-item')).addClass(this.className('jcarousel-item-' + i)); a.attr('jcarouselindex', i); return a }, className: function (c) { return c + ' ' + c + (!this.options.vertical ? '-horizontal' : '-vertical') }, dimension: function (e, d) { var a = e.jquery != undefined ? e[0] : e; var b = !this.options.vertical ? a.offsetWidth + r.margin(a, 'marginLeft') + r.margin(a, 'marginRight') : a.offsetHeight + r.margin(a, 'marginTop') + r.margin(a, 'marginBottom'); if (d == undefined || b == d) return b; var w = !this.options.vertical ? d - r.margin(a, 'marginLeft') - r.margin(a, 'marginRight') : d - r.margin(a, 'marginTop') - r.margin(a, 'marginBottom'); $(a).css(this.wh, w + 'px'); return this.dimension(a) }, clipping: function () { return !this.options.vertical ? this.clip[0].offsetWidth - r.intval(this.clip.css('borderLeftWidth')) - r.intval(this.clip.css('borderRightWidth')) : this.clip[0].offsetHeight - r.intval(this.clip.css('borderTopWidth')) - r.intval(this.clip.css('borderBottomWidth')) }, index: function (i, s) { if (s == undefined) s = this.options.size; return Math.round((((i - 1) / s) - Math.floor((i - 1) / s)) * s) + 1 } }); r.extend({ defaults: function (d) { return $.extend(q, d || {}) }, margin: function (e, p) { if (!e) return 0; var a = e.jquery != undefined ? e[0] : e; if (p == 'marginRight' && $.browser.safari) { var b = { 'display': 'block', 'float': 'none', 'width': 'auto' }, oWidth, oWidth2; $.swap(a, b, function () { oWidth = a.offsetWidth }); b['marginRight'] = 0; $.swap(a, b, function () { oWidth2 = a.offsetWidth }); return oWidth2 - oWidth } return r.intval($.css(a, p)) }, intval: function (v) { v = parseInt(v); return isNaN(v) ? 0 : v } }) })(jQuery)
//////////////////////////////////////////////////////////////////////////////////////////////////
//
// PFM-3346 Filterable List box
//
//////////////////////////////////////////////////////////////////////////////////////////////////

function ListBoxOnLoad(sender) {
    $('li', $('#' + sender.get_id())).each(function (index) {// for 508 and checkbox focus tooltip
        var item = $(this);
        var chkItem = $(sender.getItem(index).get_checkBoxElement());
        var spanItem = $(sender.getItem(index).get_textElement());

        //Only for non-checkbox list , PFM-7562
        if (sender.getItem(index).get_checkBoxElement() === null) {
            $(spanItem).attr('tabindex', '0');
            $(spanItem).focus(function () {
                item.mouseover();
            });
            $(spanItem).keyup(function (e) {
                var keyCode = (e.keyCode || e.which);
                if (keyCode == 38 && sender.getItem(index - 1))// up arrow
                {
                    $(sender.getItem(index - 1).get_textElement()).focus();
                }
                else if (keyCode == 40 && sender.getItem(index + 1))// down arrow
                {
                    $(sender.getItem(index + 1).get_textElement()).focus();
                }
            });
        }

        chkItem.focus(function () {// on checkbox focus calls mouse over 
            item.mouseover();
        });

        // for (un)check all
        if (spanItem.text().toLowerCase() == "all") {
            item.click(function () {
                var checked = sender.getItem(index).get_checked();
                sender.getItem(index).set_checked(!checked);

                //PLSUP-4977
                //to fix issues with the background color, we need to properly assign the classes that determine the style when
                //handling the logic for 'all' selection
                if (checked)
                    sender.getItem(index)._element.className = sender.getItem(index)._element.className.replace("rlbSelected", "");
                else if (sender.getItem(index)._element.className.indexOf("rlbSelected") == -1)
                    sender.getItem(index)._element.className += " rlbSelected";

                sender.getItem(index)._element.className = sender.getItem(index)._element.className.replace("rlbActive", "");

                var ListItems = sender.get_items();

                for (var i = 1; i < ListItems.get_count() ; i++) {
                    ListItems.getItem(i).set_checked(!checked);
                    if (!checked) {
                        if (ListItems.getItem(i)._element.className.indexOf("rlbSelected") == -1)
                        ListItems.getItem(i)._element.className += " rlbSelected";
                    }
                    else
                        ListItems.getItem(i)._element.className = ListItems.getItem(i)._element.className.replace("rlbSelected", "");
                }
            });
        }
        else {
            item.click(function (args) {
                var isChecked = sender.getItem(index).get_checked();
                sender.getItem(index).set_checked(!isChecked);
                sender.getItem(index).set_selected(!isChecked);

                if (sender.getItem(0).get_text().toLowerCase() == "all") {
                    var ListItems = sender.get_items();
                    var hasUncheckedItems = false;
                    for (var i = 1; i < ListItems.get_count() ; i++) {
                        if (ListItems.getItem(i).get_checked() === false) {
                            hasUncheckedItems = true;
                            break;
                        }
                    }
                    sender.getItem(0).set_checked(!hasUncheckedItems);
                    if (!hasUncheckedItems) {
                        if (sender.getItem(0)._element.className.indexOf("rlbSelected") == -1)
                            sender.getItem(0)._element.className += " rlbSelected";
                    }
                    else
                        sender.getItem(0)._element.className = sender.getItem(0)._element.className.replace("rlbSelected", "");
                }
            });
        }
    });


    // need to verify the existence of the FilterBox before assigning its event handlers
    if (sender._attributes._data.FilterBoxID != null) {

        $('#' + sender._attributes._data.FilterBoxID.parent).keydown(function (event) {// for tab
            var e = getCharCode(event);
            var FilterBox = $(this);

            switch (e) {
                case 9:
                    var ListItems = sender.get_items();
                    var FilterBoxVal = FilterBox.val();

                    if (FilterBoxVal !== "" && FilterBoxVal !== 'Type Here to Filter') {
                        FilterBoxVal = FilterBoxVal.charAt(0).toLowerCase();
                        for (var i = 0; i < ListItems.get_count() ; i++) {
                            if (ListItems.getItem(i).get_text().toLowerCase().indexOf(FilterBoxVal) == 0) {
                                if (i == ListItems.get_count() - 1) {
                                    ListItems.getItem(i - 1).get_checkBoxElement().focus();
                                }
                                else {
                                    ListItems.getItem(i - 1).get_checkBoxElement().focus();
                                }

                                return;
                            }
                        }
                    }

                    sender.getItem(0).get_checkBoxElement().focus();
                    break;
            }

        });

        // To bind the specific control's Filter box (RadTextBox) keyup event we
        // MUST bind to the Filter box's _text element, not the Filter box
        $('#' + sender._attributes._data.FilterBoxID).bind
            (
                "keyup paste",
                {
                    radListBox: sender,
                    filterBox: $('#' + sender._attributes._data.FilterBoxID),
                    filterType: sender._attributes._data.FilterType,
                    filterClause: sender._attributes._data.FilterClause
                },
                ProcessListBoxItems
            );

    }

    // need to verify the existence of the FilterBox before assigning its event handlers
    if (sender._attributes._data.ClearAllID != null) {
        var clearAllLink = $('#' + sender._attributes._data.ClearAllID);
        clearAllLink.bind
            (
                "click",
                {
                    radListBox: sender,
                    filterBox: $('#' + sender._attributes._data.FilterBoxID),
                    filterType: sender._attributes._data.FilterType
                },
                ListBoxClearAll
            );

        clearAllLink.bind
    (
        "keypress",
        {
            radListBox: sender,
            filterBox: $('#' + sender._attributes._data.FilterBoxID),
            filterType: sender._attributes._data.FilterType
        },
        ListBoxClearAllkeypress
    );
    }

}

//Cancels the event and check/uncheck is handled in click.
function radListBoxOnClientItemChecked(sender, args) {
    args.get_item().set_checked(!args.get_item().get_checked());
    //PLSUP-4977
    //the Telerik event that gets triggered for clicking the 'all' checkbox is different than for other items.
    //other selections trigger 'indexChanged' and 'checked', however for 'all' only 'checked' is getting triggered.
    //because of this we need to check here if it is the 'all' selection and execute the the code that happens from the 'indexChanged' event.
    if (args.get_item().get_textElement().innerHTML.toLowerCase() == "all") {
        setRadListBoxClasses(args.get_item().get_listBox().get_items());
    }

    return false;
}

//PLSUP-4977
//we need to handle this event because if the user clicks on an item without clicking on the actual checkbox, it will still check the box without triggering
//the 'checked' event. To make sure we are always setting the classes properly, we need to handle the classes in this event because it is always hit,
//outside of one case for the 'all' selection, which is mentioned above and is handled.
function radListBoxOnClientSelectedIndexChanged(sender, args) {
    setRadListBoxClasses(args.get_item().get_listBox().get_items());
}

//PLSUP-4977
//we need to manually assign the classes that determine the styles (blue background color) for the radlistboxitems.
//this is because if a user clicks on an item without clicking on the checkbox, Telerik removes the 'rlbSelected' class
//from all other items, which will make it so that only the item just clicked on will be highlighted.
//we wanted the behavior to be that any checked item is highlighted blue and all unselected items are not.
//to have this behavior we have to manually set the classes.
//we have to keep calling this method to ensure this because the 'all' selection will change which items are selected without clicking on those other items.
function setRadListBoxClasses(items) {
    items.forEach(function (item) {
        if (item.get_checked()) {
            if(item._element.className.indexOf("rlbSelected") == -1)
                item._element.className += " rlbSelected";
        }
        else
            item._element.className = item._element.className.replace("rlbSelected", "");
        item._element.className = item._element.className.replace("rlbActive", "");
    });
}

function ProcessListBoxItems(event) {
    var targetItemString = '';
    //added this code to handle pasting text into the filter textbox for REIRadListBox control
    if (event.originalEvent.type == 'paste') {
        targetItemString = event.originalEvent.clipboardData.getData('Text').toLowerCase();
        event.data.filterBox.val(targetItemString);
    }
    else
        targetItemString = event.data.filterBox.val().toLowerCase();
    var items = event.data.radListBox.get_items();
    for (var i = 0; i < items.get_count() ; i++) {
        var item = items.getItem(i);
        if (event.data.filterType == "ScrollTo") {
            if (event.data.filterClause == "Contains") {
                if (item.get_text().toLowerCase().indexOf(targetItemString) >= 0) {
                    item.ensureVisible();
                    break;
                }
            } else {
                if (item.get_text().toLowerCase().indexOf(targetItemString) == 0) // "StartsWith"
                {
                    item.ensureVisible();
                    break;
                }
            }

        }
        else if (event.data.filterType == "Hide") {
            if (event.data.filterClause == "Contains") {
                item.set_visible(item.get_text().toLowerCase().indexOf(targetItemString) >= 0);
            } else  // "StartsWith"
            {
                item.set_visible(item.get_text().toLowerCase().indexOf(targetItemString) == 0);
            }
        }
    }
    return false; // the keyup event has been handled, so stop its bubbling
}

function ListBoxItemClicked(sender, eventArgs) {// clicked
    var item = eventArgs.get_item();

    item.set_checked(!item.get_checked());
    ListBoxItemChecked(sender, eventArgs);

}

function ListBoxItemChecked(sender, eventArgs) {// checked
    var item = eventArgs.get_item();
    if (item.get_checked()) {
        item.get_checkBoxElement().focus();
    }
}

function ListBoxClearAllkeypress(event) {
    if (event.keyCode === 13) {
        ListBoxClearAll(event);
    }
}

function ListBoxClearAll(event) {
    var filterBox = event.data.filterBox;
    var radListBox = event.data.radListBox;
    var items = radListBox.get_items();
    //commented out this implementation and wrote new implementation below.
    //the below code was causing radlistbox items to not have the correct syles

    //radListBox.clearSelection();
    //for (var i = 0; i < items.get_count() ; i++) {
    //    items.getItem(i).set_checked(false);
    //    if (event.data.filterType == "Hide") {
    //        items.getItem(i).set_visible(true);
    //    }
        
        
    //}
    items.forEach(function (item) {
        item.set_checked(false);
        item._element.className = item._element.className.replace("rlbSelected", "").replace("rlbActive", "");
        if (event.data.filterType == "Hide") {
            item.set_visible(true);
        }
    });

    filterBox.val('');
    items.getItem(0).ensureVisible();

    return false; // the click event has been handled, so stop its bubbling
}

function ListBoxCheckAll(item, RadListBox) {// check all items
    var ListItems = RadListBox.get_items();

    for (var i = 1; i < ListItems.get_count() ; i++) {
        ListItems.getItem(i).set_checked(!item.get_checked());
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//
// PFM-3346 Filterable Listbox (end of block)
//
//////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////
//
// PFM-3354 [Mockups] Telerik Grid Freeze Header
//
//////////////////////////////////////////////////////////////////////////////////////////////////

function GridHeaderFreezer(sender, args) {

    this.StaticHeaderHolder = $(document.createElement('div'));

    this.Grid = $('#' + sender.ClientID);
    this.MasterTable = $('#' + sender._masterClientID);
    this.SortLabel = $('.sort_exp');

    this.SetHolderProperty = function () {
        this.StaticHeaderHolder.prependTo(this.Grid)
                                    .attr('id', 'StaticHeaderHolder')
                                    .css('position', 'relative');

    };

    this.AppendSort = function () {
        if (this.SortLabel != null) {
            this.StaticHeaderHolder.append(this.SortLabel);
        }
    };

    this.AppendGroupPanel = function () {
        if (sender.ShowGroupPanel) {
            var GroupPanel = $(sender._groupPanel._element).parent();
            this.StaticHeaderHolder.append(GroupPanel);
        }
    };

    this.AppendPager = function () {
        var thead = this.MasterTable.children("thead");
        var className = this.MasterTable.attr('class');
        var style = this.MasterTable.attr('style');
        var cellSpacing = this.MasterTable[0].cellSpacing;
        var border = this.MasterTable.attr('border');

        if ($(".rgPager", thead)) {

            var TopPager = $(document.createElement('table')).append($(document.createElement('thead')).append($('.rgPager:first', thead)));

            TopPager.attr('id', sender._masterClientID + '_TopPager')
                    .attr('class', className)
                    .attr('style', style)
                    .attr('cellspacing', cellSpacing)
                    .attr('border', border);

            this.StaticHeaderHolder.append(TopPager);
        }
    };

    this.AppendHeader = function () {

        var Header = $(document.createElement('table'));

        var id = sender._masterClientID + '_Header';
        var className = this.MasterTable.attr('class');
        var style = this.MasterTable.attr('style');
        var cellSpacing = this.MasterTable[0].cellSpacing;
        var border = this.MasterTable.attr('border');
        var colGroup = this.MasterTable.children('colgroup').clone(true);
        var thead = this.MasterTable.children("thead");

        Header.attr('id', id)
                        .attr('class', className)
                        .attr('style', style)
                        .css('table-layout', 'fixed')
                        .attr('cellspacing', cellSpacing)
                        .attr('border', border)
                        .append(colGroup)
                        .append(thead)
                        .append($(document.createElement('tbody'))
                                    .attr('style', 'display:none')
                                    .append($(document.createElement('tr'))
                                            .append($(document.createElement('td'))
                                                        .attr('colspan', colGroup.children.length)
                    )));

        this.MasterTable.css('table-layout', 'fixed');
        this.StaticHeaderHolder.append(Header);
    };

    this.ApplyGridClientSettings = function () {
        sender.ClientSettings.Scrolling.AllowScroll = true;
        sender.ClientSettings.Scrolling.UseStaticHeaders = true;
    };

    this.AttachEventHandler = function (StaticHeaderHolder) {
        $(window).scroll(function () {
            if ((StaticHeaderHolder.parent().position().top - $(window).scrollTop()) <= 0) {
                if (StaticHeaderHolder.css('position') != 'fixed') {
                    StaticHeaderHolder.css('position', 'fixed')
                                      .width(StaticHeaderHolder.parent().width())
                                      .css('top', 0);
                }

                StaticHeaderHolder.position.left = (StaticHeaderHolder.parent().position().left - $(window).scrollLeft());
            }
            else {
                StaticHeaderHolder.css('top', '')
                                  .css('position', 'relative')
                                  .css('left', '')
                                  .css('width', '');
            }
        });
        $(window).resize(function () {
            setTimeout(function () {
                if (StaticHeaderHolder.css('position') == 'fixed') {
                    StaticHeaderHolder.width(StaticHeaderHolder.parent().width());
                }
            }, 100);
        });
    };

    this.SetHolderProperty();
    this.AppendSort();
    this.AppendGroupPanel();
    this.AppendPager();
    this.AppendHeader();
    this.ApplyGridClientSettings();
    this.AttachEventHandler(this.StaticHeaderHolder);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
//
// PFM-3354 [Mockups] Telerik Grid Freeze Header (end of block)
//
//////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Toolbar Search Handler
//
///////////////////////////////////////////////////////////////////////////////////////////////////

var mouseIn = false;
var SBox;
var vOri;

function addEvent(element, eventType, lamdaFunction, useCapture) {
    if (element.addEventListener) {
        element.addEventListener(eventType, lamdaFunction, useCapture);
        return true;
    } else if (element.attachEvent) {
        var r = element.attachEvent('on' + eventType, lamdaFunction);
        return r;
    } else {
        return false;
    }
}

function initFilter() {
    var formInputs = document.getElementsByTagName('input');
    for (var i = 0; i < formInputs.length; i++) {
        var theInput = formInputs[i];
        if (theInput.type == 'text' && (theInput.className.match(/\bsearchbox\b/) || theInput.className.match(/\bfilterbox\b/))) {
            /* Add event handlers */
            addEvent(theInput, 'focus', clearDefaultText, false);
            addEvent(theInput, 'blur', replaceDefaultText, false);

            /* Save the current value */
            if (theInput.value != '') {
                theInput.defaultText = theInput.value;
            }
        }
    }
}

function clearDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;

    if (target.value == target.defaultText) {
        target.value = '';
    }
}

function replaceDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;

    if (target.value == '' && target.defaultText) {
        target.value = target.defaultText;
    }
}

function OpenSearchOption(ele, id, dir) {
    var Icon = $('[id$="' + ele + '"]');
    var Div = $('#' + id);

    if (dir == 'down') {
        Div.css('top', Icon.position().top + Icon.height() + 15);
        Div.css('left', Icon.position().left - Div.width());

        $('body').bind('click.OpenSearchOptionDown', function (e) {
            if (e.target.parentNode.parentNode.id != id) {
                Div.css('display', 'none');
                $('body').unbind('click.OpenSearchOptionDown');
            }

        });
    }
    else if (dir == "up") {
        Div.css('top', Icon.position().top - 25);

        $('body').bind('click.OpenSearchOptionUp', function (e) {
            if (e.target.parentNode.parentNode.id == id || e.target.id == Icon.attr('id')) {
                Div.css('display', 'block');
            }
            else {
                Div.css('display', 'none');
                $('body').unbind('click.OpenSearchOptionUp');
            }

        });
    }
    else if (dir == "leftSide") {
        Div.css('left', Icon.offset().left + 18);
        Div.css('top', Icon.offset().top - 2);
        Div.css('position', 'absolute');

        $('body').bind('click.OpenSearchOptionLeftSide', function (e) {
            if (e.target.parentNode.parentNode.id != id) {
                Div.css('display', 'none');
                $('body').unbind('click.OpenSearchOptionLeftSide');
            }

        });
    }

    Div.css('display', 'block');
}

function OpenSearchHint(ele, divID) {
    var Icon = $('[id$="' + ele + '"]');
    var Div = $('#' + id);
}


////Global Search Functionalities//////////
function OpenFlout(ele, id, title, keywords) {
    var Icon = $('[id$="' + ele + '"]');
    var Div = $('#' + id);
    var scrollOffset = { top: document.body.scrollTop || document.documentElement.scrollTop, left: document.body.scrollLeft || document.documentElement.scrollLeft }

    Div.css('left', Icon.offset().left + Icon.outerWidth());
    Div.css('top', Icon.offset().top - 2);
    Div.css('z-index', '10000');


    if ((parseInt(Div.css('top')) + Div.height()) >= ($(window).height() + scrollOffset.top)) {
        Div.css('top', $(window).height() + scrollOffset.top - Div.height() - 20);
        $('.overlayarrow', Div).css('top', Icon.offset().top - parseInt(Div.css('top')) - (Icon.height() / 4));
        $('.overlayarrow', Div).css('position', 'relative');
    }
    else {
        $('.overlayarrow', Div).css('position', '');
    }


    Div.css('position', 'absolute');
    $('.left', Div).text(title);
    $('.right', Div).html('<a href="javascript:void(0);"><img alt="Close" class="closeout" id="resultESInfobar" src="' + REISys.Platform.WebRoot + esCloseOutImagePath + '"></a>');
    $('span.replicateH3Tag', $('.subtitle', Div)).text($('a', Icon.parent()).text());
    $('p', $('.subtitle', Div)).text($('p', Icon.parent()).text());

    $('.overlaytitlebar').html(' Key Word Search Match <span class="hidden-offscreen">(bolded)</span>');
    $('.searchoverlaycontainer.shadow').children('.content').html(keywords);
    $('body').bind('click.OpenSearchOptionLeftSide', function (e) {
        var tar = $(e.target);

        if (Div.has(tar).length == 0 || tar.attr('class') == 'closeout') {
            Div.css('display', 'none');
            $('body').unbind('click.OpenSearchOptionLeftSide');
        }

    });
    var exitButton = $('.closeout', Div).parent();
    exitButton.attr('href', 'javascript:void(0);');
    exitButton.off('click');
    exitButton.click(function (e) {
        Div.css('display', 'none');
        Icon.focus();
        $('.searchoverlaycontainer.shadow').children('.content').empty();
        $('span.replicateH3Tag', $('.subtitle', Div)).text('');
        $('.left', Div).text('');
        $('.overlaytitlebar').empty();
        exitButton.remove();
    });

    var shiftClicked = false;
    exitButton.keydown(function (event) {
        var keyCode = GetCharCode(event);
        switch (keyCode) {
            case 27: //escape

                Div.css('display', 'none');
                Icon.focus();
                $('.searchoverlaycontainer.shadow').children('.content').empty();
                $('span.replicateH3Tag', $('.subtitle', Div)).text('');
                $('.left', Div).text('');
                $('.overlaytitlebar').empty();
                exitButton.remove();
                return false;
                break;
            case 16:  //Shift
                shiftClicked = true;
                break;

            case 9: //tab
                if (shiftClicked) {
                    Div.css('display', 'none');
                    return false;

                } else {
                    Div.css('display', 'none');
                    Icon.focus();
                    $('.searchoverlaycontainer.shadow').children('.content').empty();
                    $('span.replicateH3Tag', $('.subtitle', Div)).text('');
                    $('.left', Div).text('');
                    $('.overlaytitlebar').empty();
                    exitButton.remove();

                }
                break;
        }


    });

    exitButton.keydown(function (event) {
        var keyCode = GetCharCode(event);
        switch (keyCode) {
            case 16:  //Shift
                shiftClicked = false;
                break;
        }
    });



    Div.css('display', 'block');
    exitButton.focus();
}

function AddSlimScroll() {
    $(document).ready(function () {
        $('.innerScroll1').slimScroll({
            height: '300px',
            railVisible: true,
            alwaysVisible: true,

            color: '#015D90',
            size: '10px',
            Opacity: .9,
            distance: '2px'
        });

    });
}

///////////////////////////////////////////////////////
//
//Filter Block Float Handler
//
//////////////////////////////////////////////////////
var searchTop;

$(document).ready(function () {

    if ($('#filterBlock').length) {
        searchTop = $('#filterBlock').offset().top;

        $(window).scroll(function (event) {
            // what the y position of the scroll is
            var y = $(this).scrollTop();
            // whether that's below the form
            if (y >= searchTop) {
                // if so, ad the fixed class
                $('#filterBlock').css('position', 'fixed');
                $('#filterBlock').css('top', '0');

                var cl = $('#filterBlock').css('position');

            } else {
                // otherwise remove it
                $('#filterBlock').css('position', 'relative');
                $('#filterBlock').css('top', '');
            }
        });
    }
});

function AdjustSearchPosition() {
    if ($('#filterBlock').length)
    { searchTop = $('#filterBlock').offset().top; }
}

function Assign(grp, caller) {
    var group = document.getElementById(grp);

    $(group).toggle();

    $('body').bind('click.test', function (e) {
        var tar = $(e.target);

        if (tar.parent().attr('id') != grp && tar.parent().attr('id') != caller && $('#' + grp).is(':visible')) {
            $('#' + grp).css('display', 'none');
        }
    });
}

function OnClientLoadRadPanelAddAltToolTip(sender) {
    var $ = jQuery;
    for (var i = 0; i < sender.get_allItems().length; i++) {
        var currentItem = sender.get_allItems()[i];
        $(".rpImage", currentItem.get_element()).attr("alt", currentItem.get_attributes().getAttribute("AltValue"));
        $(".rpImage", currentItem.get_element()).attr("title", currentItem.get_attributes().getAttribute("ToolTipText"));

    }
}


///////////////////////////////////////////////////////
//
//Suggestion Panel Control JQuery functions
//
//////////////////////////////////////////////////////

function EnterpriseSearchSortRefineByPanel(comboboxid, listid) {
    var comboBox = $('#' + comboboxid);
    var list = $('#' + listid);
    var listItems = list.children('li').get();
    var comboBoxValue = comboBox.val();

    if (comboBoxValue === "Alphabetically") {
        listItems.sort(function (a, b) {
            var compA = $(a).text().toUpperCase();
            var compB = $(b).text().toUpperCase();
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
    }
    else {
        listItems.sort(function (a, b) {
            var compA = parseInt($(a).attr('ResultCount'));
            var compB = parseInt($(b).attr('ResultCount'));
            return (compA > compB) ? -1 : (compA < compB) ? 1 : 0;
        });
    }

    $.each(listItems, function (idx, itm) { list.append(itm); });
}

function ToggleTopic(arg, e, textId, grpId, checkBoxGrp, sortByCount) {
    var text = document.getElementById(textId);
    text.innerHTML = arg.outerText + '<img class="menuicon" id="menu7" style="border-top-width: 0px; border-right-width: 0px; border-bottom-width: 0px; border-left-width: 0px;" alt="Sort By" src="' + REISys.Platform.WebRoot + 'Platform/Include/Skins/' + configPath + '/Images/arrow_context.png"/>';
    $('#' + grpId).toggle();

    var myList = $('#' + checkBoxGrp);
    var listItems = myList.children('li').get();

    if (sortByCount == 'false') {
        listItems.sort(function (a, b) {
            var compA = $(a).text().toUpperCase();
            var compB = $(b).text().toUpperCase();
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
    }
    else {
        listItems.sort(function (a, b) {
            var compA = parseInt($(a).attr('ResultCount'));
            var compB = parseInt($(b).attr('ResultCount'));
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
    }

    $.each(listItems, function (idx, itm) { myList.append(itm); });
}



//////////////////////////////////////////////////////
//
//  Layout adjuster if Content Overflows - Horizontal 
//
//////////////////////////////////////////////////////

var PadBR = 50;
var PadCR = 11;
var Locked = false;

$(window).load(function () {
    AdjustMainArea();
});

$(window).resize(function () {
    AdjustMainArea();
});

function GetWindowDocumentWidth() {
    var WindowWidth = $(window).width();
    var DocumentWidth;

    if (navigator.appName == "Netscape") {
        DocumentWidth = $(document).width();
    }
    else {
        DocumentWidth = document.body.scrollWidth;
    }
    return { 'WindowWidth': WindowWidth, 'DocumentWidth': DocumentWidth };
}
function GetLayoutObjects() {
    var MainAreaLoads = true;
    var TopPanelLoads = true;

    var ColRight = $('#colright');
    var BaseRight = $('#base_right');
    var TopPanel = $('#toppanel');
    var Body = $('body');
    var StaticGridHeader = $('.StaticGridHeader');
    var InsRight = $('#ins_right');

    var Win = $(window);
    var Doc = $(document);

    var MinHeaderWidth = parseInt($('body').css('min-width'));

    if (ColRight.length == 0) {
        ColRight = $('#maincol');
        if (ColRight.length == 0) {
            MainAreaLoads = false;
        }
    }

    if (TopPanel.length == 0) {
        TopPanelLoads = false;
    }

    return { 'InsRight': InsRight, 'StaticGridHeader': StaticGridHeader, 'MainAreaLoads': MainAreaLoads, 'TopPanelLoads': TopPanelLoads, 'Body': Body, 'ColRight': ColRight, 'BaseRight': BaseRight, 'TopPanel': TopPanel, 'Win': Win, 'Doc': Doc, 'MinHeaderWidth': MinHeaderWidth };
}


function AdjustMainArea() {
    var WD = GetWindowDocumentWidth();
    var Obj = GetLayoutObjects();

    if (Obj.MainAreaLoads && !Locked) {
        if ((WD.WindowWidth < WD.DocumentWidth) && (WD.DocumentWidth != Obj.MinHeaderWidth)) {
            if ((WD.DocumentWidth > Obj.TopPanel.width()) && (WD.DocumentWidth > (PadBR + PadCR + Obj.BaseRight.position().left + Obj.ColRight.width()))) {
                Obj.BaseRight.css('width', (WD.DocumentWidth - Obj.BaseRight.position().left) + PadBR);
                Obj.ColRight.css('width', Obj.BaseRight.width() + PadCR);
            }

            AdjustTopHeader();
            AdjustBody();
        }
        else {
            Locked = true;
            Reset();
            setTimeout(function () { Locked = false; }, 20);

        }
    }

}
function AdjustTopHeader() {
    var WD = GetWindowDocumentWidth();
    var Obj = GetLayoutObjects();

    if (Obj.TopPanelLoads) {
        if (Obj.TopPanel.width() != (Obj.BaseRight.position().left + Obj.ColRight.width())) {
            Obj.TopPanel.css('width', Obj.BaseRight.position().left + Obj.ColRight.width());
        }
    }
}

function AdjustBody() {
    var Obj = GetLayoutObjects();
    if (Obj.Body.width() != Obj.TopPanel.width()) {
        Obj.Body.css('width', Obj.TopPanel.width());
    }
}

function AdjustTopExpandBtn() {
    var WD = GetWindowDocumentWidth();
    var Obj = GetLayoutObjects();

    var TopExpandCollapseBtn = $('.btn-slide');
    var TimeText = $('.datetime');

    if (Obj.TopPanelLoads) {
        TopExpandCollapseBtn.css('position', 'absolute');
        TopExpandCollapseBtn.css('left', WD.WindowWidth - parseInt(TopExpandCollapseBtn.css('width')) + $(window).scrollLeft());

    }
}

function Reset() {
    var Obj = GetLayoutObjects();

    if (Obj.MainAreaLoads) {
        Obj.BaseRight.css('width', '100%');
        Obj.ColRight.css('width', '');
    }

    if (Obj.TopPanelLoads) {
        Obj.TopPanel.css('width', '100%');
    }

    Obj.Body.css('width', '');
}


// PFM-4553 Group Panel needs a disabled anchor tag, but FireFox follows the HTML specs and does not process the "disbaled" asttribute like IE does
// This function will give us a browser-independent way of showing a disabled anchor
function disableAnchor(obj, disable) {
    if (disable) {
        var onClick = obj.attr("OnClick");
        if (onClick && onClick != "" && onClick != null) {
            obj.attr('onClick_bak', onClick);
        }
        obj.removeAttr('OnClick');

        var href = obj.attr("href");
        if (href && href != "" && href != null) {
            obj.attr('href_bak', href);
        }
        obj.removeAttr('href');

        obj.css('color', 'gray');
    }
    else {
        obj.attr('href', obj.attr('href_bak'));

        var onClick_bak = obj.attr('onClick_bak');
        if (onClick_bak && onClick_bak != "" && onClick_bak != null) {
            obj.attr('onClick', onClick_bak);
        }

        obj.css('color', '');
    }
}
// end of PFM-4553

/// PFM-3783
function Namespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';
    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    return parent;
}

var groupPanel = Namespace('REISys.Platform.Web');
var grid = Namespace('REISys.Platform.Web.Grid');

////Group Panel object
groupPanel.GroupPanel = function (groupPanel) {
    this.control = groupPanel;
    if (!this.control) { throw ('Must give a GroupPanel'); }
    this.showAllSelectedButton = $("[id*= lnkbtnShowAllSelectedItems]", this.control);
    this.showViewButton = $("[id*= lnkViewSelected]", this.control);
    // This sets the count on group panel and if the count is greater than zero it enables 
    // the view and the number link and if it is less than or equal to zero it disables view and the number links
    this.SetSelectedCount = function (sender, amount) {
        this.showAllSelectedButton.text(amount);
        if (amount > 0) {
            this.showAllSelectedButton.removeAttr('disabled');
            this.showViewButton.removeAttr('disabled');
            disableAnchor(this.showAllSelectedButton, false); // don't disable if number selected > 0
            disableAnchor(this.showViewButton, false); // don't disable if number selected > 0
        } else {
            this.showAllSelectedButton.attr('disabled', '');
            this.showViewButton.attr('disabled', '');
            disableAnchor(this.showAllSelectedButton, true); // disable if number selected !> 0
            disableAnchor(this.showViewButton, true); // disable if number selected !> 0
        }
    };

    //Select All Items on a Page Group Panel Event 
    this.selectAllPageItems = new GlobalPlatformEvent('SelectAllPageItems');
    //Unselect All Items on a Page Group Panel Event 
    this.unselectAllPageItems = new GlobalPlatformEvent('UnselectAllPageItems');
}

//Selectable Column object
grid.SelectableColumn = function (selectableColumn) {
    this.control = selectableColumn;
    if (!this.control) { throw ('Must give a selectable column'); }
    this.modelSelectedItems = [];
    this.selectedCount = 0;
    this.objectListening = [];
    this.duplicateDataKeys = false;
    var allowDuplicateDataKeysHiddenField = $('#hdnAllowDuplicateDataKeys');

    if (allowDuplicateDataKeysHiddenField != null) {
        if (allowDuplicateDataKeysHiddenField.val() == undefined) {
            this.allowDuplicateDataKeys = false;
        }
        else {
            this.allowDuplicateDataKeys = allowDuplicateDataKeysHiddenField.val().toLowerCase() == 'true' ? true : false;
        }
    }
    else {
        this.allowDuplicateDataKeys = false;
    }

    //Select an item on a Page Group Panel Event 
    this.selectSingleItem = new GlobalPlatformEvent('SelectSingleItem');
    //Unselect an item on a Page Group Panel Event 
    this.unselectSingleItem = new GlobalPlatformEvent('UnselectSingleItem');

    //Removes all instances of a given  key  of the selected indices from Select Column
    this.RemoveAllWithKey = function (key) {
        var selectableCell = $("[uniqueIdentifier*=" + key + "]");
        selectableCell.attr('alt', 'Add item to group');
        selectableCell.attr("title", 'Add item to group');
        selectableCell.attr('class', selectableCell.attr('class').replace('group-selected', 'group-unselected'));
        selectableCell.attr('src', selectableCell.attr('src').replace('add', 'minus'));

        for (var ctr = this.modelSelectedItems.length - 1; ctr >= 0; ctr--) {
            if (this.modelSelectedItems[ctr].key.toLowerCase() === key.toLowerCase()) {
                this.modelSelectedItems.splice(ctr, 1);
                this.selectedCount--;
            }
        }
        this.RaiseEvent();
    };

    //This will decrease the processing for IE8 and will increase its speed (will not work with non unique keys)
    this.RemoveAllWithKeyEfficient = function (selectableCell, key) {

        selectableCell.attr('alt', 'Add item to group');
        selectableCell.attr("title", 'Add item to group');
        selectableCell.attr('class', selectableCell.attr('class').replace('group-selected', 'group-unselected'));
        selectableCell.attr('src', selectableCell.attr('src').replace('add', 'minus'));

        for (var ctr = this.modelSelectedItems.length - 1; ctr >= 0; ctr--) {
            if (this.modelSelectedItems[ctr].key.toLowerCase() === key.toLowerCase()) {
                this.modelSelectedItems.splice(ctr, 1);
                this.selectedCount--;
                break;
            }
        }
        this.RaiseEvent();
    };



    //Removes all indices from the selected indices from  the Select Column
    this.RemoveAll = function () {
        this.selectedCount = 0;
        this.modelSelectedItems = [];
        this.RaiseEvent();
    };

    this.RaiseEvent = function () {
        for (var ctr = this.objectListening.length - 1; ctr >= 0; ctr--) {
            this.objectListening[ctr].SetSelectedCount(this, this.selectedCount);
        }
        $('input[id$=SelectedItems]', this.control)[0].value = this.ToString();
    }

    //Adds a key value pair to  the selected indices of the selectable column 
    this.Add = function (key, value) {
        var selectableCell = $("[uniqueIdentifier*=" + key + "]");
        selectableCell.attr('class', selectableCell.attr('class').replace('group-unselected', 'group-selected'));
        selectableCell.attr("alt", 'Remove item from group');
        selectableCell.attr('title', 'Remove item from group');
        selectableCell.attr('src', selectableCell.attr('src').replace('minus', 'add'));

        var item = new Object();
        item.key = key;
        item.value = value;

        if (this.allowDuplicateDataKeys == true) {
            this.modelSelectedItems.push(item);
            var selectedItem = $("[uniqueIdentifier*=" + key + "]");
            selectedItem.attr('class', selectedItem.attr('class').replace('group-unselected', 'group-selected'));
            selectedItem.attr("alt", 'Remove item from group');
            selectedItem.attr('title', 'Remove item from group');
            selectedItem.attr('src', selectedItem.attr('src').replace('minus', 'add'));
            this.selectedCount++;
            this.RaiseEvent();
        }
        else {
            if (this.GetFirstMatchingItem(key) === null) {
                this.modelSelectedItems.push(item);
                this.selectedCount++;
                this.RaiseEvent();
            }
        }
    };


    this.AddEfficient = function (selectableCell, uniqueIdentifier) {
        selectableCell.attr('class', selectableCell.attr('class').replace('group-unselected', 'group-selected'));
        selectableCell.attr("alt", 'Remove item from group');
        selectableCell.attr('title', 'Remove item from group');
        selectableCell.attr('src', selectableCell.attr('src').replace('minus', 'add'));

        var item = new Object();
        item.key = uniqueIdentifier;
        item.value = uniqueIdentifier;

        if (this.GetFirstMatchingItem(uniqueIdentifier) === null) {
            this.modelSelectedItems.push(item);
            this.selectedCount++;
            this.RaiseEvent();
        }

    };

    //Removes a key value pair of the selected indices from Select Column
    this.Remove = function (key) {
        for (var ctr = this.modelSelectedItems.length - 1; ctr >= 0; ctr--) {
            if (this.allowDuplicateDataKeys) {
                if (this.modelSelectedItems[ctr].key.toLowerCase() === key.toLowerCase()) {
                    this.modelSelectedItems.splice(ctr, 1);
                    var selectedItem = $("[uniqueIdentifier*=" + key + "]");
                    selectedItem.attr('alt', 'Add item to group');
                    selectedItem.attr("title", 'Add item to group');
                    selectedItem.attr('class', selectedItem.attr('class').replace('group-selected', 'group-unselected'));
                    selectedItem.attr('src', selectedItem.attr('src').replace('add', 'minus'));
                    this.selectedCount--;
                    this.RaiseEvent();
                }
            }
            else {
                if (this.modelSelectedItems[ctr].key.toLowerCase() === key.toLowerCase()) {
                    this.modelSelectedItems.splice(ctr, 1);
                    this.selectedCount--;
                    this.RaiseEvent();
                    break;
                }
            }
        }
    };

    //adds a range of array
    this.AddRange = function (setUpArray) {
        Array.addRange(this.modelSelectedItems, setUpArray);
        this.selectedCount = setUpArray.length
        this.RaiseEvent();
    }
    //gets teh first 
    this.GetFirstMatchingItem = function (key) {
        var result = null;
        for (var ctr = 0; ctr < this.modelSelectedItems.length; ctr++) {
            if (this.modelSelectedItems[ctr].key.toLowerCase() === key.toLowerCase()) {
                result = this.modelSelectedItems[ctr];
                break;
            }
        }
        return result;
    };

    //selects all the items on page
    this.SelectAllSelectableItemsOnThePage = function () {
        var $Unselectedkids = $('.group-unselected', this.control);
        var numberOfEventsSubscribed = 0;

        for (var ctr = this.objectListening.length - 1; ctr >= 0; ctr--) {
            this.objectListening[ctr].selectAllPageItems.raise($Unselectedkids, this);

            if (this.objectListening[ctr].selectAllPageItems.NumberSubscribed() > 0) {
                numberOfEventsSubscribed++;
            }
        }

        if (numberOfEventsSubscribed == 0) {
            var unselectedLength = $Unselectedkids.length - 1
            for (var ctr = unselectedLength; ctr >= 0; ctr--) {
                var identifier = $($Unselectedkids[ctr]);
                this.ClickOnSelectableItemCell(identifier);
            }

        }
        return false;
    };

    //This unselects all of the selected items on the page
    this.UnselectAllSelectableItemsOnThePage = function () {
        var $Selectedkids = $('.group-selected', this.control);
        var numberOfEventsSubscribed = 0;

        //Raise an event to the calling page.

        for (var ctr = this.objectListening.length - 1; ctr >= 0; ctr--) {
            this.objectListening[ctr].unselectAllPageItems.raise($Selectedkids, this);

            if (this.objectListening[ctr].unselectAllPageItems.NumberSubscribed() > 0) {
                numberOfEventsSubscribed++;
            }
        }

        if (numberOfEventsSubscribed == 0) {
            var selectedLength = $Selectedkids.length - 1;
            for (var ctr = selectedLength; ctr >= 0; ctr--) {
                var identifier = $($Selectedkids[ctr]);
                this.ClickOnSelectableItemCell(identifier);
            }
        }

        return false;
    };

    //this function is getting injected on the RadGrid SelectableColumn
    this.ClickOnSelectableItemCellWrapper = function (uniqueIdentifier) {
        var selectableCellObject = $("[uniqueIdentifier*=" + uniqueIdentifier + "]");
        //raise event 
        if (this.GetFirstMatchingItem(uniqueIdentifier) != null) {
            //raise not selected event
            this.unselectSingleItem.raise(selectableCellObject, this);
        }
        else {
            //raise selected event
            this.selectSingleItem.raise(selectableCellObject, this);
        }

        if (this.unselectSingleItem.NumberSubscribed() == 0 && this.selectSingleItem.NumberSubscribed() == 0) {
            this.ClickOnSelectableItemCell(selectableCellObject);
        }
    };


    //this selects an item on the page with a given unique identifier
    this.ClickOnSelectableItemCell = function (selectableCell) {

        var uniqueIdentifier = selectableCell.attr("uniqueIdentifier");
        if (selectableCell.attr('src').contains('add')) {
            if (this.unselectSingleItem.NumberSubscribed() == 0) {
                if (this.allowDuplicateDataKeys) {
                    this.RemoveAllWithKey(uniqueIdentifier);
                } else {
                    this.RemoveAllWithKeyEfficient(selectableCell, uniqueIdentifier);
                }
            }
        }
        else {
            if (this.selectSingleItem.NumberSubscribed() == 0) {
                if (this.allowDuplicateDataKeys) {
                    this.Add(uniqueIdentifier);
                } else {
                    this.AddEfficient(selectableCell, uniqueIdentifier);
                }
            }
        }
        return false;
    }

    //this gets the 2 string of the values of the model
    this.ToString = function () {
        var toReturn = '';
        var itemNumber = this.modelSelectedItems.length - 1;
        for (var ctr = itemNumber; ctr >= 0; ctr--) {
            toReturn += this.modelSelectedItems[ctr].key + ' ,';
        }
        return toReturn;
    }
}


//Returns an instance of a Selectable Column object when an id of the object is given
function FindSelectableColumn(selectableColumnID) {
    var selectableColumn = $("[id*=" + selectableColumnID + "]");
    return new REISys.Platform.Web.Grid.SelectableColumn(selectableColumn);
}

//Returns an instance of a Group Panel object when an id of the object is given
function FindGroupPanel(groupPanelID) {
    var groupPanel = $("[id*=" + groupPanelID + "]");
    return new REISys.Platform.Web.GroupPanel(groupPanel);
}
/// end PFM-3783

String.prototype.contains = function (it) { return this.indexOf(it) != -1; };

$telerik.$(function () {
    TriggerSpaceBar();
});

function TriggerSpaceBar() {
    $telerik.$('.kbclick').keypress(function (event) {
        if (event.which != 0) {
            event.preventDefault();
        }
        if (event.which == 32 || event.which == 13) {
            $(this).click();
        }
    });
}

function funcFlyout(className, cssClass) {

    $(className).click(function (e) {
        e.preventDefault();
        var menu = $("div" + className + "_menu");
        menu.toggle();

        var toolbarButton = $(this);
        $(':focusable:first', menu).focus();
        var shiftTagHitPreviously = false;
        $(':focusable:last', menu).keydown(function (event) {


            var arg;
            if (event.which != "") { arg = event.which; }
            else if (event.charCode != "") { arg = event.charCode; }
            else if (event.keyCode != "") { arg = event.keyCode; }
            switch (arg) {
                case 9:
                case 16: // shift Key
                    if (!shiftTagHitPreviously) {
                        toolbarButton.focus();
                        menu.toggle();
                        $(this).off('keydown');
                        return false;
                    }
                    break;
            }
        });


        $(cssClass).toggleClass(cssClass);

    });

    $("div" + className + "_menu").mouseup(function () {
        return false
    });

    $(document).mouseup(function (e) {
        if ($(e.target).parent("a" + className).length == 0) {
            $(className).removeClass(cssClass);
            $("div" + className + "_menu").hide();
        }
    });
}



function divtoggle(showHideDiv, switchImgTag) {
    var ele = document.getElementById(showHideDiv);
    var imageEle = document.getElementById(switchImgTag);
    if (ele.style.display == "block") {
        ele.style.display = "none";
        imageEle.innerHTML = '<img src="' + REISys.Platform.WebRoot + 'Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_right.png" class="sectionarrow" alt="Expand">';
    }
    else {
        ele.style.display = "block";
        imageEle.innerHTML = '<img src="' + REISys.Platform.WebRoot + 'Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_down.gif" class="sectionarrow" alt="Collapse">';
    }
}

function DivToggleNoBlock(showHideDiv, switchImgTag) {
    var ele = document.getElementById(showHideDiv);
    var imageEle = document.getElementById(switchImgTag);
    if (ele.style.display == "") {
        ele.style.display = "none";
        imageEle.innerHTML = '<img src="' + REISys.Platform.WebRoot + 'Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_right.png" class="sectionarrow" alt="Expand">';
    }
    else {
        ele.style.display = "";
        imageEle.innerHTML = '<img src="' + REISys.Platform.WebRoot + 'Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_down.gif" class="sectionarrow" alt="Collapse">';
    }
}



function DivToggleCloseAddress(showHideDiv, switchImgTag) {
    var ele = document.getElementById(showHideDiv);
    var imageEle = document.getElementById(switchImgTag);
    if (ele.style.display == "") {
        ele.style.display = "none";
        imageEle.innerHTML = '<img src="' + REISys.Platform.WebRoot + 'Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_right.png" class="sectionarrow" alt="Expand">';
    }

}

function DivToggleWithRoot(showHideDiv, switchImgTag, root, alwaysShow, alwaysHide, addRowBodyID) {
    var ele = document.getElementById(showHideDiv);
    var imageEle = document.getElementById(switchImgTag);
    var addRowBody = document.getElementById(addRowBodyID);
    var visibleClass = "visible";
    if (((alwaysHide) || (ele.className == visibleClass)) && !alwaysShow) {
        //then hide
        //ele.style.display = "none";
        ele.className = "hidden";
        addRowBody.className = "hidden";
        if (stringIsNullOrEmpty(root)) {
            imageEle.innerHTML = '<img src="../../Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_right.png" class="sectionarrow" alt="Expand">';
        }
        else {
            imageEle.innerHTML = '<img src="' + root + '/Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_right.png" class="sectionarrow" alt="Expand">';
        }
    }
    else {
        //show
        ele.className = visibleClass;
        addRowBody.className = visibleClass;
        if (stringIsNullOrEmpty(root)) {
            imageEle.innerHTML = '<img src="../../Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_down.png" class="sectionarrow" alt="Collapse">';
        }
        else {
            imageEle.innerHTML = '<img src="' + root + '/Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/arrow_down.png" class="sectionarrow" alt="Collapse">';
        }
    }
}

function stringIsNullOrEmpty(string) {
    return ((!string) || ('' == string));
}

function ArrowDivToggle(divId, imgContainerId) {
    $('#' + divId).toggle();
    $('#' + imgContainerId).toggleClass('arrow_right').toggleClass('arrow_down');
}

/******Font cookies *****/
function setCookie(name, value, days, path, domain, secure) {
    var expires, date;
    if (typeof days == "number") {
        date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = date.toGMTString();
    }
    document.cookie = name + "=" + escape(value) +
    ((expires) ? "; expires=" + expires : "") +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    ((secure) ? "; secure" : "");
}

// Modified from Jesse Chisholm or Scott Andrew Lepera; (found at both www.dansteinman.com/dynapi/ and www.scottandrew.com/junkyard/js/)
function getCookie(name) {
    var nameq = name + "=";
    var c_ar = document.cookie.split(';');
    for (var i = 0; i < c_ar.length; i++) {
        var c = c_ar[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameq) == 0) return unescape(c.substring(nameq.length, c.length));
    }
    return null;
}

// from Bill Dortch's Cookie Functions (hidaho.com) 
function deleteCookie(name, path, domain) {
    if (getCookie(name)) {
        document.cookie = name + "=" +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

/*************************************************************
* Function that toggles visibility
*************************************************************/
function ToggleVisibility(control) {
    var target = $("*[id$='" + control + "']");
    var currentDisplay = target.css('display');
    if (currentDisplay != 'none')
        target.hide();
    else
        target.show();
}

function ToggleVisibilityWithWords(control, textControl, open, closed) {
    var expand = $("*[id$='" + control + "']");
    if (textControl.text == open)
        $(textControl).text(closed);
    else
        $(textControl).text(open);
    expand.slideToggle(500);
}

/*************************************************************
* Function that toggles Expanded/Collapsed Grid Rows
*************************************************************/
function ExpandAll(control, link) {
    var Grid = $find($("[id$='" + control + "']").attr('id'));
    var Expand = $("[id$='" + link + "']");
    var bool = false;
    if (Expand.text() == 'Show Detailed View') {
        bool = true;
        Expand.text("Show Summary View");
    }
    else
        Expand.text("Show Detailed View");
    var MasterTable = Grid.get_masterTableView();
    for (var i = 0; i < MasterTable.get_dataItems().length; i++) {
        var row = MasterTable.get_dataItems()[i];
        if (bool) {
            MasterTable.expandItem(i);
        }
        else
            MasterTable.collapseItem(i);
    }
}
function ExpandAllWithImage(control, link, img) {
    var Grid = $find($("[id$='" + control + "']").attr('id'));
    var Expand = $("[id$='" + link + "']");
    var Image = $("[id$='" + img + "']");
    var bool = false;
    if (Expand.text() == 'Show Detailed View') {
        bool = true;
        Expand.text("Show Summary View");
        Image.attr('src', '../../Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/showdetails.png');
    }
    else {
        Expand.text("Show Detailed View");
        Image.attr('src', '../../Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/detailview.png');
    }
    var MasterTable = Grid.get_masterTableView();
    for (var i = 0; i < MasterTable.get_dataItems().length; i++) {
        var row = MasterTable.get_dataItems()[i];
        if (bool) {
            row.set_expanded(true);
        }
        else
            row.set_expanded(false);
    }
}


/*****************Top Menu Dropdown *******************/
function dropdown(dropdownId, hoverClass, mouseOffDelay) {
    if (dropdown = document.getElementById(dropdownId)) {
        var listItems = dropdown.getElementsByTagName('li');
        for (var i = 0; i < listItems.length; i++) {
            listItems[i].onmouseover = function () { this.className = addClass(this); }
            listItems[i].onmouseout = function () {
                var that = this;
                setTimeout(function () { that.className = removeClass(that); }, mouseOffDelay);
                this.className = that.className;
            }

            var anchor = listItems[i].getElementsByTagName('a');
            anchor = anchor[0];
            anchor.onfocus = function () { tabOn(this.parentNode); }
            anchor.onblur = function () { tabOff(this.parentNode); }
        }
    }

    function tabOn(li) {
        if (li.nodeName == 'LI') {
            li.className = addClass(li);
            tabOn(li.parentNode.parentNode);
        }
    }

    function tabOff(li) {
        if (li.nodeName == 'LI') {
            li.className = removeClass(li);
            tabOff(li.parentNode.parentNode);
        }
    }

    function addClass(li) { return li.className + ' ' + hoverClass; }
    function removeClass(li) { return li.className.replace(hoverClass, ""); }
}
$(document).ready(function () {
    dropdown('topRnav', 'hover', 50);
});

function ToggleTopNavigation() {
    $("#toppanel").parent().slideToggle(500);
    $(".btn-slide").toggleClass("pactive");

    if (!layoutMenu)
        return;

    if (hideTopPanel) {
        $("li>a:contains('Top Navigation')").text('Expand Top Navigation')
        hideTopPanel = false;
    }
    else {
        $("li>a:contains('Top Navigation')").text('Collapse Top Navigation')
        hideTopPanel = true;
    }

    // if the left menu is disabled, no need to update the toggle both option since it's already disabled as well.
    var leftMenuDisabled = $('#leftpanel').html() == null;

    if (!leftMenuDisabled)
        updateToggleBothOption();

    persistLayoutSettings();
    AdjustSearchPosition();
}

function ToggleLeftNavigation(togglemenu) {
    if (hideLeftPanel)
        ShowLeftPanel(togglemenu);
    else
        HideLeftPanel(togglemenu);

    var topMenuDisabled = $('#toppanel').html() == null;

    // if the top menu is disabled, no need to update the toggle both option since it's already disabled as well.
    if (!topMenuDisabled)
        updateToggleBothOption();

    persistLayoutSettings();
}

function HideLeftPanel(togglemenu) {
    hideLeftPanel = true;
    setTimeout(function () { $('#anchorExpand').focus(); }, 200);

    if (layoutMenu)
        $("li>a:contains('Left Navigation')").text('Expand Left Navigation');

    if (togglemenu) {
        $("#leftpanel").animate({ marginLeft: "-180px" }, 500);
        $("#colleft").animate({ width: "0px" }, 400);
        $("#showPanel").show("fast").animate({ width: "20px" }, 200);
        $("#colright").animate({ marginLeft: "26px" }, 500);
    }

    updateToggleBothOption();
    persistLayoutSettings();
}

function ShowLeftPanel(togglemenu) {
    hideLeftPanel = false;
    $("#colleft").attr('style', 'width: 0px; display:block;');
    setTimeout(function () { $('#anchorCollapse').focus(); }, 200);

    if (layoutMenu)
        $("li>a:contains('Left Navigation')").text('Collapse Left Navigation');

    if (togglemenu) {
        $("#colright").animate({ marginLeft: "180px" }, 200);
        $("#leftpanel").animate({ marginLeft: "0px" }, 400);
        $("#colleft").animate({ width: "170px" }, 400);
        $("#showPanel").animate({ width: "0px" }, 600).hide("normal");
    }

    updateToggleBothOption();
    persistLayoutSettings();
}

function ToggleBothNavigations() {
    ToggleTopNavigation();
    ToggleLeftNavigation(true);
}

function updateToggleBothOption() {
    if (!layoutMenu)
        return;

    var both = layoutMenu.find("div[id$='Both']");
    var bothSub = layoutMenu.find("li>a:contains('Both')");

    var leftMenuDisabled = $('#leftpanel').html() == null;
    var topMenuDisabled = $('#toppanel').html() == null;

    //PFM-6996 -- control layout showing 'toggle both Navigation' though there is no left navigation 
    if (hideLeftPanel == hideTopPanel) {
        bothSub.removeClass('hidden');
        both.addClass('hidden');
    }
    else if (leftMenuDisabled || topMenuDisabled) { //Disable Toggle both navigations only if one of either Left or Top Menu is disabled. -- Naman
        both.removeClass('hidden');
        both.css('color', 'Gray');
        both.text('Toggle Both Navigations');
        bothSub.addClass('hidden');
    }
}

function updateExpandAndCollapseOptions() {
    // by default both options will say collapse (LayoutMenu.ascx).
    var leftMenuOption = $("li>a:contains('Left Navigation')");
    var leftMenuDisabled = $('#leftpanel').html() == null;

    if (hideLeftPanel)
        leftMenuOption.text('Expand Left Navigation');

    // the menu was disabled server side.
    if (leftMenuDisabled) {
        leftMenuOption.css({ 'color': 'gray', 'cursor': 'text' }).attr('title', 'The left navigation is disabled.');
        leftMenuOption.attr('onclick', null);
    }

    var topMenuOption = $("li>a:contains('Top Navigation')");
    var topMenuDisabled = $('#toppanel').html() == null;

    if (!hideTopPanel) {
        topMenuOption.text('Expand Top Navigation');
    }
    // the menu was disabled server side.
    if (topMenuDisabled) {
        topMenuOption.css({ 'color': 'gray', 'cursor': 'text' }).attr('title', 'The top navigation is disabled.');
        topMenuOption.attr('onclick', null);
    }

    //PFM-6996 -- control layout showing 'toggle both Navigation' though there is no left navigation 
    if (topMenuDisabled || leftMenuDisabled) { //If either Left or Top Menu is disabled, change the title of Toggle Both Navigations along with other settings.
        var both = layoutMenu.find("div[id$='Both']");
        var bothSub = layoutMenu.find("li>a:contains('Both')");
        both.removeClass('hidden');
        both.css({ 'color': 'gray', 'cursor': 'text' }).attr('onclick', null).attr('title', 'Either the top navigation or left navigation is disabled.');
        both.text('Toggle Both Navigations');
        bothSub.addClass('hidden');
    }
}

function ExpandLeftMenu(sender, args) {
    enumerateChildItems(args.get_item());
}

function enumerateChildItems(childitems) {
    for (var i = 0; i < childitems.get_items().get_count() ; i++) {
        childitems.get_items().getItem(i).expand();
        enumerateChildItems(childitems.get_items().getItem(i));
        if (childitems.get_cssClass().indexOf("disableDimension") > 0)
            childitems.disable();
    }
}

function persistLayoutSettings() {
    if (layoutMenu)
        setCookie(REISys.Platform.LayoutCookieName, '' + hideLeftPanel + ',' + hideTopPanel, 1, '/');
}

String.prototype.replaceAll = function (strTarget, strSubString) {
    var strText = this;
    var intIndexOfMatch = strText.indexOf(strTarget);
    while (intIndexOfMatch != -1) {
        strText = strText.replace(strTarget, strSubString)
        intIndexOfMatch = strText.indexOf(strTarget);
    }
    return (strText);
}

/*   These are common Utilities that Creates window pop-ups with the REIHyperlink and the REIASPHyperlink   */
function WindowFeatures(height, width, toolbar) {
    return "status=yes,resizable=yes,scrollbars=yes,toolbar=" + toolbar + ",menubar=" + toolbar + ",location=no,height=" + height + ",width=" + width;
}

function CleanWindowName(windowName) {
    if (windowName)
        return windowName.replaceAll(' ', '').replaceAll('-', '');
    return null;
}

function OpenPopup(strURL, lngHeight, lngWidth, strWindowName) {
    //get the current breadcrumb text
    var breadcrumbText = getCurrentPageBreadcrumb();
    if (strURL.contains("?")) {
        strURL += "&BreadCrumbROText=" + encodeURIComponent(breadcrumbText);
    }
    else {
        strURL += "?BreadCrumbROText=" + encodeURIComponent(breadcrumbText);
    }

    var objNewWindow = window.open(strURL, CleanWindowName(strWindowName), WindowFeatures(lngHeight, lngWidth, "no"));
    if (objNewWindow != null && objNewWindow != undefined) {
        objNewWindow.focus();
    }
}


function getCurrentPageBreadcrumb() {
    var text = '';
    $('#breadcrumb').find("span").each(function (index, elem) {
		//console.log('this.children: ', $(this).children());
		
		if(index != 0){ //skip index 0 contains You are here:
			$(this).find("a").each(function(index, elem){
				text += (elem.innerText != " " ? elem.innerText : "") + " ";
			});
			if($(this).children().length == 0){
				text += elem.innerText + " ";
			}
		}		
    });
	text = text.replace(/»/g, "%"); //replace the spcial character to avoid cross site scripting issue
    return text;
}

function OpenPopupWithMenuBar(strURL, lngHeight, lngWidth, strWindowName) {
    OpenPopup(strURL, lngHeight, lngWidth, strWindowName);
}

function OpenPopupWithToolBar(strURL, lngHeight, lngWidth, strWindowName) {
    var usrAgnt = navigator.userAgent;
    var winStr = "status=yes,resizable=yes,scrollbars=yes,toolbar=yes,height=" + window.screen.availHeight + ",width=" + window.screen.availWidth + ",fullscreen = yes,";
    if (usrAgnt.indexOf('Firefox') != -1)
        winStr += "menubar=no,location=false";
    else if (usrAgnt.indexOf('Chrome') != -1)
        winStr += "menubar=yes,location=no";
    else
        winStr += "menubar=no,location=yes";

    var objNewWindow = window.open(strURL, CleanWindowName(strWindowName), winStr);
    if (objNewWindow != null && objNewWindow != undefined) {
        objNewWindow.focus();
    }
}

///<Summary>
/// This JavaScript function opens a pop up window with no tool bar and will not be in full screen mode
///</Summary>
function OpenPopupWithToolBarNoFullScreen(strURL, lngHeight, lngWidth, strWindowName) {
    // Get the browser details
    var browserType = navigator.userAgent;
    // Get window properties string
    var windowPropertyString = "status=yes,resizable=yes,scrollbars=yes,toolbar=yes,height=" + lngHeight + ",width=" + lngWidth + ",";
    // Append window property based on browser type
    if (browserType.indexOf('Firefox') != -1) {
        windowPropertyString += "menubar=no,location=false";
    }
    else if (browserType.indexOf('Chrome') != -1) {
        windowPropertyString += "menubar=yes,location=no";
    }
    else {
        windowPropertyString += "menubar=no,location=yes";
    }
    // Open the pop up window
    var objNewWindow = window.open(strURL, CleanWindowName(strWindowName), windowPropertyString);
    // Set focus to the new window
    objNewWindow.focus();
}

// Update the label to display the remaining number of characters allowed.
function taCount(taObj, lblCharacterCount, maxL) {
    objCnt = createObject(lblCharacterCount);
    objVal = taObj.value;
    var diff;
    if (maxL < objVal.length) {
        diff = objVal.length - maxL;
        objCnt.innerHTML = "<span class='fielderr_info'> Warning! You have exceeded the maximum limit of " + maxL + " characters by " + diff + "</span>";
    }
    else {
        diff = maxL - objVal.length;
        objCnt.innerHTML = "You have " + diff + " characters remaining out of maximum limit of " + maxL;
    }

    return true;
}

function TextAreaPaste(editor, args) {
    //removes the name attribute on hidden controls that are pasted into the textbox so Telerik does not treat them as a control and try to serialize the ClientState values
    //PFM-6778 - see REIRadEditor.cs, LoadPostData()
    args.set_value(args.get_value().replace(/\s(name=")[^"]+["]/g, ''));
}

// Update the label to display the remaining number of characters allowed.
function TextAreaCount(taObjValue, lblCharacterCount, maxL, goodMessage, warningMessage, maxCountHandle, differenceCountHandle, isRichTextBox, countWithSpaces, source, textboxClientId) {
    objCnt = createObject(lblCharacterCount);
    objVal = taObjValue;

    var contentLength = 0;
    if (isRichTextBox && isRichTextBox.toLowerCase() === 'true' && countWithSpaces.toLowerCase() === 'false') {
        //Trimming spaces for RichTextBoxView character count consistent - RadEditor Bug - PFM-6207
        objVal = objVal.trim().replace(/\s+/g, '');
    }
    else {
        //PFM-6764 - trim newline, condense multiple spaces into one - matches server side logic in RegExpressionUtil.StripLineBreaks()
        //DO NOT remove the ( ) - that is not a normal space - IE8 does not count the non-breaking space ASCII 160/Unicode 00A0 as whitespace so this is needed until we finally drop IE8
        //objVal = objVal.replace(/\n /g, '').replace(/ \n\n/g, '').replace(/\r/g, '').replace(/\n/g, '').trim();
        /*PFM-7299 - Instead of using \s?(0 or 1 spaces), changed the Regex to check for \s*(0 or more spaces). This will consolidate all the spaces and get rid of any unnecessary spaces.-
          NOTE: DO NOT REMOVE THE SPECIAL SPACE IN THE REPLACE EXPRESSIONS BELOW. - that is not a normal space - 
          IE8 OR IE9 does not count the non-breaking space ASCII 160/Unicode 00A0 as whitespace so this is needed until we finally drop IE8 AND IE9 */
        if (source == 'onpaste') {
            objVal = objVal.replace(/\s*(\r\n|\n|\r)( )?/gm, ' ').replace(/\s+/g, ' ').trim();
        }
        else {
            objVal = objVal.replace(/(\r\n|\n|\r)( )?/gm, ' ').replace(/\s+/g, ' ').trim();
        }
    }
    contentLength = objVal.length;
    var diff;

    if (maxL < contentLength) {
        diff = contentLength - maxL;
        objCnt.innerHTML = warningMessage.replace(maxCountHandle, maxL).replace(differenceCountHandle, diff);
    }
    else {
        diff = maxL - contentLength;
        objCnt.innerHTML = goodMessage.replace(maxCountHandle, maxL).replace(differenceCountHandle, diff);
        $('.tooltip').tipTip();
    }

    return true;
}

function createObject(objId) {
    if (document.getElementById) return document.getElementById(objId);
    else if (document.layers) return eval("document." + objId);
    else if (document.all) return eval("document.all." + objId);
    else return eval("document." + objId);
}

// General Object that can be used to call REST WCF Using JSON
REISys.Platform.Util = {
    ServiceProxy: function (serviceUrl) {
        var _I = this;
        this.serviceUrl = serviceUrl;
        // *** Call a wrapped object
        this.invoke = function (method, data, callback, error, bare) {
            // *** Convert input data into JSON - REQUIRES Json2.js
            var json = JSON.stringify(data);

            // *** The service endpoint URL        
            var url = _I.serviceUrl + '/' + method;

            $.ajax({
                url: url,
                data: json,
                type: 'POST',
                processData: false,
                contentType: 'application/json',
                timeout: 1000000,
                dataType: 'text',  // not "JSON" we'll parse
                success:
                   function (res) {
                       if (!callback) return;

                       // *** Use JSON library so we can fix up MS AJAX dates
                       var result = JSON.parse(res);


                       // *** Bare message IS result
                       if (bare)
                       { callback(result); return; }

                       // *** Wrapped message contains top level object node
                       // *** strip it off
                       for (var property in result) {
                           callback(result[property]);
                           break;
                       }
                   },
                error: function (xhr) {
                    if (!error) return;
                    if (xhr.responseText) {
                        var err = null;
                        try {
                            err = JSON.parse(xhr.responseText);
                        }
                        catch (exception) {
                            error({ Message: xhr.responseText })
                            console.log(err);
                        }

                    }
                    return;
                }
            });
        }

    }
};
//
//This is a global Event object
function GlobalPlatformEvent(type, callback) {
    this.type = type;
    if (!this.type) { throw ('Must specify a CodeEvent type'); }
    this.fn = [];
    if (typeof (callback) == 'function') {
        this.fn[0] = callback;
    }

}
//this  raises a global event
//it has sender and arguments same as events in c #
GlobalPlatformEvent.prototype.raise = function (sender, args) {
    var i = 0;
    for (i = 0; i < this.fn.length; i++) {
        if (this.fn[i] != undefined) {
            this.fn[i](sender, args);
        } else {
            PlatformConsole.log('GlobalPlatformEvent:' + i)
        }
    }
};
//this subscribes to the event
GlobalPlatformEvent.prototype.subscribe = function (fn) {
    this.fn[this.fn.length] = fn;
};
//this unsubscribe to the event
GlobalPlatformEvent.prototype.unsubscribe = function (fn) {
    var i = 0;
    for (i = 0; i < this.fn.length; i++) {
        if (this.fn[i] == fn) {
            this.fn.splice(i, 1);
            break;
        }
    }
};

GlobalPlatformEvent.prototype.NumberSubscribed = function (fn) {
    return this.fn.length;
};

var leftMenuNameSpace = Namespace('Layout');
leftMenuNameSpace.LeftMenuModel = {
    LoadLeftMenu: function (data) {
        var leftSideMenu = REISys.Platform.Layout.LeftMenu;
        leftSideMenu.LoadMenu($.parseJSON(data));
        ko.applyBindings(leftSideMenu, $('.lmBase')[0]);
        SetupButtonClickEventsForLeftSideMenu();
    }
};

function SetupButtonClickEventsForLeftSideMenu() {
    $(".lmTitle").off('click');
    $(".lmTitle").click(function () {
        $(this).parent().next(".lmContent").slideToggle("fast");

        if ($(this).children(0).hasClass('Expanded')) {
            $(this).parent().next(".lmContent").css('display', 'none');
            $(this).children(0).removeClass('Expanded').addClass('Collapsed');
            $(this).find('span:last').removeClass('NavArrowUp').addClass('NavArrowDown');
        }
        else {
            $(this).parent().next(".lmContent").css('display', 'block');
            $(this).children(0).removeClass('Collapsed').addClass('Expanded');
            $(this).find('span:last').addClass('NavArrowUp').removeClass('NavArrowDown');
        }
        return false;

    });
    $(".cssclassforselectionchange").off('click');
    $(".cssclassforselectionchange").click(function () {
        $('.selected').each(function (i, obj) {
            $(obj).removeClass('selected');
        });
        if (!($(this).hasClass('selected'))) {
            $(this).addClass('selected');
        }
    });
}

//This function is to enable the sticky header. It takes a string parameter which is the CSS class name used for the sticky header.
//If the parameter is not passed or is not typeof string or is empty, the function will set the default class name as 'sticky_pagetitle'.
function EnableStickyHeader(obj) {
    if (typeof (obj) == 'undefined' || typeof (obj) != 'string' || stringIsNullOrEmpty(obj)) {
        obj = '.sticky_pagetitle';
    };

    var element = $(obj);

    if (element) {
        var stickyHeaderTop = $(obj).offset().top;
        $(window).scroll(function () {
            if ($(window).scrollTop() > stickyHeaderTop) {
                element.removeClass("sticky_nonscroll");
                element.addClass("sticky_scroll");
                element.css({ 'width': $('#ins_right').width() });
            } else {
                element.removeClass("sticky_scroll");
                element.addClass("sticky_nonscroll");
            };
        });
    }
}

$(document).ready(function () {
    //set the link
    $('#top-link').topLink({
        min: 400,
        fadeSpeed: 500
    });
    //smooth scroll
    $('#top-link').click(function (e) {
        e.preventDefault();
        //Preventing when radeditor is in full screen mode.
        if (ReiSys.Platform.UI.IsFullScreen) return false;
        window.scrollTo(0, 0);
    });
});

//list box - group heading checked
$('.gListGroup > input').on('click',
    function (event) {
        var listbox = $find($(this).closest("div.RadListBox")[0].id);
        var groupChecked = $(this).is(":checked");
        var group = $(this).closest("li.rlbItem.gListGroup").attr("DataGroupField");

        $(".rlbItem.gListItem[DataGroupField=" + group + "] > span").each(function (index) {
            var item = listbox.findItemByAttribute("groupSearchText", group + "_" + $(this).text());
            groupChecked ? item.check() : item.uncheck();
        });
    }
);
//list box - group items checked
$('.gListItem > input').on('click',
    function (event) {
        var listbox = $find($(this).closest("div.RadListBox")[0].id);
        var item = $(this).closest("li.rlbItem.gListItem");
        var groupItem = listbox.findItemByAttribute("groupSearchText", item.attr("DataGroupField"));

        //if sub-item was unchecked, uncheck the group header
        if (groupItem.get_checked() && $(this).is(":not(:checked)")) {
            groupItem.uncheck();
        }
            //PLSUP-4979
            //fixed the below to wrap 'DataGroupField' in single quotes, otherwise if the value for DataGroupField has any spaces in it then jquery will throw an error and this will not work
            //it sub-item was checked, check the group header if all other items in the same group are checked
        else if (!groupItem.get_checked() && item.siblings(".rlbItem.gListItem[DataGroupField='" + item.attr("DataGroupField") + "']").find("input:not(:checked)").length === 0) {
            groupItem.check();
        }
    }
);


// This code allows for keyboard navigation for the context menu
function AddContextMenuEvents() {
    /********************* Focus in cmItem to hide previous tier (Keyboard)***************************/
    $('ul.cmlevel1 >ul.cmTier > li.cmItem >  a').on('focusin', function (event) {
        $('ul.cmlevel2').hide();
        $('ul.cmlevel3').hide();
        $('ul.cmlevel4').hide();
        PlatformConsole.log('HIDE LEVEL 2 FLYOUT focusin item (Keyboard)');
    });

    $('ul.cmlevel1  > li.cmItem >  a').on('focusin', function (event) {
        $('ul.cmlevel2').hide();
        $('ul.cmlevel3').hide();
        $('ul.cmlevel4').hide();
        PlatformConsole.log('HIDE LEVEL 2 FLYOUT focusin item (Keyboard)');
    });

    $('ul.cmlevel2 >ul.cmTier > li.cmItem >  a').on('focusin', function (event) {

        $('ul.cmlevel3').hide();
        $('ul.cmlevel4').hide();
        PlatformConsole.log('HIDE LEVEL 2 FLYOUT focusin item (Keyboard)');
    });

    $('ul.cmlevel2  > li.cmItem >  a').on('focusin', function (event) {

        $('ul.cmlevel3').hide();
        $('ul.cmlevel4').hide();
        PlatformConsole.log('HIDE LEVEL 2 FLYOUT focusin item (Keyboard)');
    });


    $('ul.cmlevel3 >ul.cmTier > li.cmItem >  a').on('focusin', function (event) {
        $('ul.cmlevel4').hide();
        PlatformConsole.log('HIDE LEVEL 2 FLYOUT focusin item (Keyboard)');
    });

    $('ul.cmlevel3  > li.cmItem >  a').on('focusin', function (event) {
        $('ul.cmlevel4').hide();
        PlatformConsole.log('HIDE LEVEL 2 FLYOUT focusin item (Keyboard)');
    });


    /********************* Focus in cmFlyout show next tier (Keyboard)***************************/
    $('ul.cmlevel1 > ul.cmTier  > li.cmFlyout >  a').on('focusin', function (event) {
        ShowNextContextMenuLevel(this, 'ul.cmlevel2');
    });

    $('ul.cmlevel1 > li.cmFlyout >  a').on('focusin', function (event) {
        ShowNextContextMenuLevel(this, 'ul.cmlevel2');
    });

    $('ul.cmlevel2 > ul.cmTier  > li.cmFlyout >  a').on('focusin', function (event) {
        ShowNextContextMenuLevel(this, 'ul.cmlevel3');
    });

    $('ul.cmlevel2  > li.cmFlyout >  a').on('focusin', function (event) {
        ShowNextContextMenuLevel(this, 'ul.cmlevel3');
    });


    $('ul.cmlevel3 > ul.cmTier  > li.cmFlyout >  a').on('focusin', function (event) {
        ShowNextContextMenuLevel(this, 'ul.cmlevel4');
    });

    $('ul.cmlevel3  > li.cmFlyout >  a').on('focusin', function (event) {
        ShowNextContextMenuLevel(this, 'ul.cmlevel4');
    });



    /********************* Hover cm flyout item (mouse)***************************/
    $('ul.cmlevel1 > ul.cmTier  > li.cmFlyout').hover(function (event) {
        ShowNextContextMenuLevelHover(this, 'ul.cmlevel2');
    }, function (event) {
        $('.cmlevel2').hide();
    });

    $('ul.cmlevel1 > li.cmFlyout').hover(function (event) {
        ShowNextContextMenuLevelHover(this, 'ul.cmlevel2');
    }, function (event) {
        $('.cmlevel2').hide();
    });

    $('ul.cmlevel2 > ul.cmTier  > li.cmFlyout ').hover(function (event) {
        ShowNextContextMenuLevelHover(this, 'ul.cmlevel3');
    }, function (event) {
        $('.cmlevel3').hide();
    });

    $('ul.cmlevel2  > li.cmFlyout ').hover(function (event) {
        ShowNextContextMenuLevelHover(this, 'ul.cmlevel3');
    }, function (event) {
        $('.cmlevel3').hide();
    });


    $('ul.cmlevel3 > ul.cmTier  > li.cmFlyout ').hover(function (event) {
        ShowNextContextMenuLevelHover(this, 'ul.cmlevel4');
    }, function (event) {
        $('.cmlevel4').hide();
    });

    $('ul.cmlevel3  > li.cmFlyout ').hover(function (event) {
        ShowNextContextMenuLevelHover(this, 'ul.cmlevel4');
    }, function (event) {
        $('.cmlevel4').hide();
    });


}

function ShowNextContextMenuLevel(current, levelSelector) {
    var parentItem = $(current).parent();
    var nextLevel = $(levelSelector, parentItem);
    var position = parentItem.offset();
    nextLevel.css({ right: (parentItem.parent().width()) });
    nextLevel.show();
    PlatformConsole.log('SHOW ' + levelSelector + ' flyout focusin cmFlyout');
}


function ShowNextContextMenuLevelHover(current, levelSelector) {
    var currentItem = $(current);
    var nextLevel = $(levelSelector, currentItem);
    var position = currentItem.offset();
    nextLevel.css({ right: currentItem.parent().width() - 5 });
    nextLevel.show();
    PlatformConsole.log('SHOW ' + levelSelector + ' flyout focusin cmFlyout');
}
$(document).ready(function () {
    AddContextMenuEvents();
});

// Rad Grid 
$('.rgSortAsc').val('Sorted ascending');

$('.rgSortDesc').val('Sorted descending');

$('.rgHeader a').append($('<span class="hidden-offscreen">[Click here to sort]</span>'));

var rtlSortAscItems = $('.rtlSortAsc');
rtlSortAscItems.val('Sorted asc');

rtlSortAscItems.addClass('tooltip');

var rtlSortDesc = $('.rtlSortDesc');
rtlSortDesc.val('Sorted desc');

rtlSortDesc.addClass('tooltip');
var rtlHeader = $('.rtlHeader a');
rtlHeader.addClass('tooltip');
rtlHeader.append($('<span class="hidden-offscreen">[Click here to sort]</span>'));


//Set the hidden text of the tabs for either current or not
function RadTabStripSetHiddenText() {
    var tabs = $('.rtsLink');
    tabs.each(function () {
        var hiddenText = '';
        var item = $(this);
        if (item.hasClass('rtsSelected')) {
            hiddenText = ' - Current Tab';
        }
        else {
            hiddenText = ' - Tab';
        }
        var hiddenSpan = $('span.hidden-offscreen', item);
        if (hiddenSpan.length !== 0) {
            // PLSUP-5192 - Remove the suffixes before appending them again
            if (hiddenSpan.text().contains(' - Tab')) {
                hiddenSpan.text(hiddenSpan.text().replace(/ - Tab/ig, ''));
            }
            else if (hiddenSpan.text().contains(' - Current Tab')) {
                hiddenSpan.text(hiddenSpan.text().replace(/ - Current Tab/ig, ''));
            }

            hiddenSpan.append(hiddenText);
        } else {
            var span = '<span class="hidden-offscreen"> ' + hiddenText + '</span>';
            $('.rtsTxt', item).append(span);
        }
    });
}

//adds click event 
function AddClickForRadTabs() {
    var tabs = $('.rtsLink');
    tabs.each(function () {
        $(this).click(function () {
            setTimeout(function () { RadTabStripSetHiddenText(); }, 300);
        });
    });
}

//PLSUP-5033 - adds every tab's tooltip as an offscreen span for JAWS to read (508)
function RadTabStrip_AddHiddenTabTooltip(sender) {
    var tabs = sender.get_tabs();
    for (var i = 0; i < tabs.get_count() ; i++) {
        var tooltipText = tabs.getTab(i).get_attributes().getAttribute("tooltip");
        if (tooltipText) {
            var hiddenSpan = $('span.hidden-offscreen', tabs.getTab(i).get_element());
            if (hiddenSpan.length !== 0) {
                hiddenSpan.html(hiddenSpan.html() + " - " + tooltipText);
            } else {
                var span = '<span class="hidden-offscreen"> - ' + tooltipText + '</span>';
                $('.rtsTxt', tabs.getTab(i).get_element()).append(span);
            }
        }
    }
}

//loads the initial state of the tab
$(document).ready(function () {
    RadTabStripSetHiddenText();
    AddClickForRadTabs();
});


//Rei rad grid changes the grouping td to th 
function GroupsChangeTDtoTH() {

    $('.rgGroupHeader >  td').each(function () {
        var currentItem = $(this);
        //checks to see if arrow control
        if (!currentItem.hasClass('rgGroupCol')) {
            //get attributes from td
            var attribuesItems = currentItem[0].attributes;
            // add th around td
            currentItem.wrap("<th></th>");
            var parentItem = currentItem.parent();
            // add attributes form td to th
            for (var j = 0; j < attribuesItems.length; j++) {
                var attrib = attribuesItems[j];
                parentItem.attr(attrib.name, attrib.value);
            }
            parentItem.attr('scope', 'rowgroup');
            parentItem.attr('class', 'RadGridGroupTH');
        }
    });
    //Removes the original TD
    var par = $('.rgGroupHeader > th > td> p');
    par.attr('class', 'RadGridGroupP');
    par.unwrap();
}
//ready function to automatically change the grouped items tags
$(document).ready(function () {
    GroupsChangeTDtoTH();
});

//Removes empty title attributes 
$('[title=""]').removeAttr('title');

$('.fontsizer').attr('href', 'javascript:void(0);');
$('.fontreset').attr('href', 'javascript:void(0);');

//Adds off screen text for group panel new window items 
var groupPanelOpensNewWindowSpan = '<span class="hidden-offscreen">  - Opens in a new Window</span>';
$('[id$=lnkViewSelected]').append(groupPanelOpensNewWindowSpan);
$('[id$=lnkActionsMenu]').append(groupPanelOpensNewWindowSpan);

//Global way to determine if the shift key is hit to allow for shift tab
var shiftKeyHitGlobal = false;

$(document).keyup(function (event) {
    var e;
    if (event.which != "") { e = event.which; }
    else if (event.charCode != "") { e = event.charCode; }
    else if (event.keyCode != "") { e = event.keyCode; }
    switch (e) {
        case 16:
            shiftKeyHitGlobal = false;
    }
});
$(document).keydown(function (event) {
    var e;
    if (event.which != "") { e = event.which; }
    else if (event.charCode != "") { e = event.charCode; }
    else if (event.keyCode != "") { e = event.keyCode; }

    switch (e) {
        case 16: // shift Key
            shiftKeyHitGlobal = true;
            return false;
            break;
    }
});

function IsIE11() {
    return ((!(window.ActiveXObject) && "ActiveXObject" in window) && (!!navigator.userAgent.match(/Trident.*rv[ :]*11\./)));
}

function InitializeRadEditor(editor, args) {
    //toolbar buttons - 508
   //$('.reTool, .reDropdown').each(function (index) { //PLSUP-4897 for .reDropdown the title is being read twice
    $('#' + editor.get_id()).find('a.reTool').each(function (index) {
        var toolItem = $(this);
        var title = toolItem.attr('title');
        //cannot use append (PFM-6770) or prepend (PFM-7130)
        toolItem.find('span').first().after('<span class="hidden-offscreen">' + title + '</span>');
    });

    //PLSUP-4897 when an anchor tag has role="button" its href destination is being read by JAWS in Internet Explorer
    $('.reToolbarWrapper').find('.reDropdown').attr('role', 'listbox');

    //set title
    $('iframe[role=textbox]').attr('title', 'Rich text content area. To move from edit content area to the FIRST toolbar item button press F10');
    $('iframe[role=textbox]').next('iframe').attr('title', 'Text Editor HTML Mode');

    //PLSUP-4106
    //Info: Telerik RadEditor is doubling <br> everytime on load, this is because our telerik version doesn't support IE11, 
    //this is happening only in IE11, for all other browser and IE version Radeditor is working fine
    //if (IsIE11())		//PLSUP-5270- commented out as part of a fix for a script performance issue which led to idnetification of the root cause for adding the extra line breaks. Fix made at user control code behind
    //    editor.set_html(editor.get_html().replace(/<br>\n<br>/g, '<br>'));

    //allows user to tab out of rich textbox
    editor.attachEventHandler("onkeydown", function (e) {
        editor.removeShortCut("InsertTab");
        if (e.keyCode === 9 || e.which === 9) {
            if ($telerik.isSafari) {
                if (e.shiftKey) {
                    $('#' + editor.get_id()).find('.reTool:last').focus();
                } else {
                    $('.reMode_selected:first').focus();
                }
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
}

function IsValidHTML(code) {
    if (code == '') return true;

    var regex = /<.*?>/g;
    var matches = code.match(regex);
    if (matches == null || !matches.length) return true;

    var tags = {};

    $.each(matches, function (idx, itm) {

        //if the tag is, <..../>, it's self closing
        if (itm.substr(itm.length - 2, itm.length) != "/>") {

            //strip out any attributes
            var tag = itm.replace(/[<>]/g, "").split(" ")[0];
            //start or end tag?
            if (tag.charAt(0) != "/") {
                if (tags.hasOwnProperty(tag))
                    tags[tag]++;
                else
                    tags[tag] = 1;
            }
            else {
                var realTag = tag.substr(1, tag.length);
                if (tags.hasOwnProperty(realTag))
                    tags[realTag]--;
                else
                    tags[realTag] = -1;
            }
        }
    });
    var possibles = [];
    for (tag in tags) {
        if (tags[tag] != 0) possibles.push(tag);
    }
    if (possibles.length) {
        return false;
    }
    else
        return true;
}

//Set the attribute on any control of "needFocus" with the value of "needFocus"
//which will set the focus to the control
Sys.Application.add_load(function () {
    var itemsToFocused = $("*[needFocus='needFocus']");
    itemsToFocused.removeAttr('needFocus');
    itemsToFocused.focus();
    //For RadTextboxes 
    $('.fieldreq > :first-child').addClass('fieldreq').parent().removeClass('fieldreq');
});
//Init
(function () {
    if (Telerik.Web.UI.RadInputControl) {
        Telerik.Web.UI.RadInputControl.prototype.updateCssClass = function () { return; };

        //Counting new lines as two characters for browser consistency (IE, Firefox counts as 1 character, rest of browsers counts as two characters)
        //Replace new lines as "aa" instead spaces because trimming at end, trimming removes length.
        //Telerik.Web.UI.RadInputControl.prototype._escapeNewLineChars_org = Telerik.Web.UI.RadInputControl.prototype._escapeNewLineChars;
        //Telerik.Web.UI.RadInputControl.prototype._escapeNewLineChars = function (text, replaceWith) {
        //    return this._escapeNewLineChars_org(text, "");
        //}
    }
})();

function RadEditor_ScrollTopLink(editor, args) {
    ReiSys.Platform.UI.IsFullScreen = editor.isFullScreen();
    if (ReiSys.Platform.UI.IsFullScreen)
        $('#top-link').hide();
}

function RichTextBoxViewPlatformClientInit(editor, args) {
    var handlers = ['load', 'commandexecuting', 'commandexecuted', 'selectionchange', 'modechange', 'submit'];
    $.each(handlers, function (index, handlerName) {
        var handlerFunctionName = editor.get_element().getAttribute(handlerName);
        if (handlerFunctionName != null && handlerFunctionName != '') {
            var handlerValue = window[handlerFunctionName];
            if (handlerValue != null && typeof handlerValue === 'function') {
                if (handlerName === 'load' && handlerValue)
                    editor.add_load(handlerValue);

                if (handlerName === 'commandexecuting' && handlerValue)
                    editor.add_commandExecuting(handlerValue);

                if (handlerName === 'commandexecuted' && handlerValue)
                    editor.add_commandExecuted(handlerValue);

                if (handlerName === 'selectionchange' && handlerValue)
                    editor.add_selectionChange(handlerValue);

                if (handlerName === 'modechange' && handlerValue)
                    editor.add_modeChange(handlerValue);

                if (handlerName === 'submit' && handlerValue)
                    editor.add_submit(handlerValue);
            }
        }
    });
}

//REI RAD TREE LIST 508 compliance
Sys.Application.add_load(function () {
    $(function () {

        var collapseFunc = function (event) {

            event.preventDefault();
            var currentItem = $(this);
            //swap class
            currentItem.removeClass('rtlCollapse');
            currentItem.addClass('rtlExpand');
            //swap event
            currentItem.off('click', collapseFunc);
            currentItem.click(expandFunc);

            //hide children
            var currentRow = currentItem.parent().parent(); //Get the current Row
            var indexOfToggle = currentItem.prev().length;
            var nextRows = currentRow.nextAll();
            nextRows.each(function (key, value) {
                var rowInput = $('td:has(input)', value);
                if (rowInput.length !== 0) {
                    var indent = rowInput.prev().length;
                    if (indent > indexOfToggle) {
                        //At a lower level
                        $(value).hide();
                    } else {
                        //At same or higher level
                        return false;
                    }
                } else {
                    //Has no Expand Collapse
                    $(value).hide();
                }
            });
        };

        var expandFunc = function (event) {
            event.preventDefault();
            var currentItem = $(this);
            //swap class
            currentItem.removeClass('rtlExpand');
            currentItem.addClass('rtlCollapse');
            //swap event
            currentItem.off('click', expandFunc);
            currentItem.click(collapseFunc);

            //expand children
            var currentRow = currentItem.parent().parent(); //Get the current Row
            var indexOfToggle = currentItem.prev().length;
            var nextRows = currentRow.nextAll();
            nextRows.each(function (key, value) {

                var rowInput = $('td:has(input)', value);
                if (rowInput.length !== 0) {
                    var indent = rowInput.prev().length;
                    if (indent > indexOfToggle) {
                        //At a lower level
                        $(value).show();
                    } else {
                        //At same or higher level
                        return false;
                    }
                } else {
                    //Has no Expand Collapse
                    $(value).show();
                }
            });
        };

        $('.rtlCollapse').off('click');
        $('.rtlCollapse').click(collapseFunc);
        $('.rtlExpand').off('click');
        $('.rtlExpand').click(expandFunc);
    });


    $('td:has(input.rtlCollapse)~td.rtlCF').each(function (key, value) {
        var item = $(value);
        var currentColSpan = parseInt(item.attr('colspan'));
        var nextItems = item.nextAll();
        var nextItemAmount = nextItems.length;
        nextItems.remove();
        item.attr('colspan', currentColSpan + nextItemAmount);
        var attribuesItems = item[0].attributes;
        // add th around td
        item.wrap("<th></th>");
        var parentItem = item.parent();
        // add attributes form td to th
        for (var j = 0; j < attribuesItems.length; j++) {
            var attrib = attribuesItems[j];
            parentItem.attr(attrib.name, attrib.value);
        }
        parentItem.addClass('reiTreeListInnerTH');
        item.html('<span>' + item.html() + '</span>')
        $('span', item).unwrap();
    });

    $('.rtlTable').each(function (key, value) {
        var headerItems = $('.rtlHeader > th', value);

        headerItems.each(function (headerIndex, headerItem) {
            $(headerItem).attr('id', 'treeListHeader' + headerIndex);
        });
        var headersArray = [];
        var bodyRows = $('tbody > tr', value);
        bodyRows.each(function (bowRowIdx, bodyRow) {
            var innerHeader = $('th', bodyRow);
            if (innerHeader.length === 0) {
                //need to add the column header-id
                var headersValue = headersArray.join(" ");
                var firstTDItem = $('td.rtlCF', bodyRow);
                firstTDItem.attr('headers', headerItems.first().attr('id') + ' ' + headersValue);
                firstTDItem.nextAll().each(function (tdIDx, tdItem) {
                    $(tdItem).attr('headers', $(headerItems.get(tdIDx + 1)).attr('id') + ' ' + headersValue);
                });
            } else {
                var position = innerHeader.prevAll().length;
                innerHeader.attr('id', 'innerHeader' + bowRowIdx);
                headersArray.splice(position - 1, position, 'innerHeader' + bowRowIdx);
            }
        });
    });
});

Sys.Application.add_load(function () {
    //Adds Label for 'Check All' Check box for RAD check box
    $('.rcbCheckAllItemsCheckBox').each(function (idx, item) {
        var currentItem = $(item);
        var id = currentItem.attr('id');
        if (id === null || id === undefined) {
            id = 'checkAllItemRadComboBox' + idx;
            currentItem.attr('id', id);
        }
        currentItem.before(("<label class='hideItem' for='" + id + "'>Check All</label>"));
    });
    //Added to add label for rlbCheckbox
    $('.rlbCheck').each(function (idx, item) {
        var currentItem = $(item);
        if (!currentItem.parent().is('label')) {
            currentItem.wrap('<label></label>');
        }
    });
});

//PFM-7564 - Allow main tree view div to catch focus to enable keyboard navigation
function RadTreeView_MakeTreeFocusable(sender) {
    $(sender.get_element()).attr("tabindex", "0");
}

function setFeedbackOverlay() {
    var overlay = $('.modalIFrame[data-OverlayId]');
    if (overlay.length) {

        try {
            var head = '<head id="ctl00_headTag"></head>';
            if (window.parent && window.parent.document && window.parent.document.getElementsByTagName('head') && window.parent.document.getElementsByTagName('head').length > 0) {
                head = '<head id="ctl00_headTag">' + $(window.parent.document.getElementsByTagName('head')[0]).html() + '</head>';
            }
            $("input").each(function () {
                $(this).attr("value", $(this).val());
            });
            var body = "<body>" + $($(window.parent.document).get(0).body).html() + "</body>";

            screenhtml = '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" dir="ltr" lang="en">' + head + body + '</html>';
        }
        catch (err) {
        }
        var feedbackUrl = overlay.attr("data-epsFeedbackUrl");
        var feedbackDiv = $('#' + overlay.attr('data-OverlayId'));
        var iframe = $('#overlayFrame', feedbackDiv);
        feedbackUrl = window.location.protocol + feedbackUrl;
        if (iframe.length) {
            iframe.attr('src', feedbackUrl);
            iframe.load(function () {
                SetCrossDomain(feedbackUrl);
            });
        }
        overlay.trigger('click');
    }
    return false;
}

function createScreenshot(resourceValue, epsServiceUrl) {
    var requestData = {
        "requestParams": {
            "ScreenData": screenhtml
            , "BaseUrl": REISys.Platform.WebsiteUrl
            , "UserId": REISys.Platform.CurrentUserId
            , "ResourceValue": resourceValue
        }
    };
    var requestJson = JSON.stringify(requestData);
    $.ajax({
        type: "POST",
        url: epsServiceUrl,
        data: requestJson,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg)
                feedbackScreenShotAttachmentId = msg.d;
            else
                feedbackScreenShotAttachmentId = "";
        }
    });
}

function setFeedbackOverlayLoadPageUrl() {
    var overlay = $('.modalIFrame[data-OverlayId]');
    if (overlay.length) {
        var loadPageUrl = overlay.attr("data-loadPageUrl");
        var feedbackDiv = $('#' + overlay.attr('data-OverlayId'));
        var initTitle = $('#windowtitle', feedbackDiv).attr('data-title');
        if (initTitle)
            $('#windowtitle', feedbackDiv).text(initTitle);
        else
            $('#windowtitle', feedbackDiv).text('Feedback'); //Default
        var iframe = $('#overlayFrame', feedbackDiv);
        var lnkFeedback = overlay.attr('data-feedbackLink');
        if (iframe.length)
            iframe.attr('src', loadPageUrl);
        setTimeout(function () {
            $(':first-child', $('#' + lnkFeedback))[0].focus();
        }, 100);
    }
    return false;
}

Sys.Application.add_load(function () {
    var overlay = $('.modalIFrame[data-OverlayId]');
    setTimeout(function () {
        if (overlay.length) {
            overlay.overlay().onClose = setFeedbackOverlayLoadPageUrl;
        }
    }, 500);
    if (overlay.length) {
        overlay.hide();
    }
});
function getDomainOfURL(url) {
    url = $.trim(url);
    if (url.search(/^https?\:\/\//) != -1)
        url = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i, "");
    else
        url = url.match(/^([^\/?#]+)(?:[\/?#]|$)/i, "");
    return url[1];
}

function SetCrossDomain(theurl) {
    var domain = getDomainOfURL(theurl);
    if (document.domain.toLowerCase() === domain.toLowerCase()) {
        PlatformConsole.log('parent-iframe domain are same: ' + domain);
        //both are same domain - backward compatibility
    } else {
        //to allow cross sub-domain iframe access by JavaScript - set document.domain to root domain
        PlatformConsole.log('parent-iframe domain are different document.domain:' + document.domain + ' domain:' + domain);
        var parts = document.domain.split(".");
        if (parts.length > 2) {
            document.domain = parts[parts.length - 2] + "." + parts[parts.length - 1];
            PlatformConsole.log('document domain set to : ' + document.domain);
        }
    }

}
function setErrorReportOverlay() {
    var overlay = $('.modalIFrame[data-ErrorReportOverlayId]');
    if (overlay.length) {
        var ErrorReportUrl = overlay.attr("data-epsErrorReportUrl");
        var errorReportDiv = $('#' + overlay.attr('data-ErrorReportOverlayId'));
        var initTitle = $('#windowtitle', errorReportDiv).attr('data-title');
        if (initTitle)
            $('#windowtitle', errorReportDiv).text(initTitle);
        else
            $('#windowtitle', errorReportDiv).text('Error Reporting - Comments'); //Default text
        var iframe = $('#overlayFrame', errorReportDiv);
        ErrorReportUrl = window.location.protocol + ErrorReportUrl;
        if (iframe.length) {
            iframe.attr('src', ErrorReportUrl);
            iframe.load(function () {
                SetCrossDomain(ErrorReportUrl);
            });
        }

        overlay.trigger('click');
    }
    return false;
}

function setErrorReportOverlayLoadPageUrl() {
    var overlay = $('.modalIFrame[data-ErrorReportOverlayId]');

    if (overlay.length) {

        var loadPageUrl = overlay.attr("data-loadPageUrl");
        var errorReportDiv = $('#' + overlay.attr('data-ErrorReportOverlayId'));
        var iframe = $('#overlayFrame', errorReportDiv);
        var btnReportId = overlay.attr('data-epsReportButtonId');
        if (iframe.length)
            iframe.attr('src', loadPageUrl);
        $('#' + btnReportId).focus();
    }

    return false;
}

function closeOverlay(type, selector) {
    var cssSelector = '.modalIFrame[data-OverlayId]';
    if (selector)
        cssSelector = cssSelector.replace('data-OverlayId', selector);
    if (type && type === 'error')
        cssSelector = '.modalIFrame[data-ErrorReportOverlayId]';
    else if (type && type === 'feedback')
        cssSelector = '.modalIFrame[data-OverlayId]';
    var overlay = $(cssSelector);
    overlay.overlay().close();
}


function editOverlayFocus() {
    $(".modalIFrame").each(function (index) {
        var $this = $(this);
        var overlay = $this.overlay().getOverlay();
        if (overlay.attr('style').indexOf('display') > -1) {
            setTimeout(function () {
                $('.close', overlay).focus();
            }, 100);
        }
    });
}
var validationMessageVisible = false;
//adds a new JavaScript message 
function ShowErrorJavaScriptMessage(message) {
    PlatformConsole.log(message);
    var customErrorPlaceHolder = false;

    if (message != null && message != '') {
        validationMessageVisible = true;
        var valError = $(".valError");
        var jsValMessageCnt = $('#jsValMessageCnt');
        if (valError.length == 0) {
            var panel = $("[ID$='MessageUpdatePanel']");
            panel.append("<div id='jsValMessageCnt' data-bind=\"template: { name: 'errorMessageClient', data: model }\"></div>");
            var model = { model: { Icon: REISys.Platform.ImageRoot + "/val_msgheader.png", Messages: [{ Text: message }] } };
            ko.applyBindings(model, panel[0]);
            customErrorPlaceHolder = true;
            PlatformConsole.log('1st');
        }
        else {
            var existingItem = $(".jsValMessageItem").filter(function () { return $(this).text() === message; });
            if (existingItem.length == 0) {
                var li = "<li class='jsValMessageItem'>" + message + "</li>";
                $(".valError").append(li);
                PlatformConsole.log('2nd');
            }

        }
    }
}
//Removes client JavaScript added message by message text
function RemoveErrorJavaScriptMessage(message) {
    var existingItem = $(".jsValMessageItem").filter(function () { return $(this).text() === message; });
    existingItem.remove();
    var totalItems = $(".jsValMessageItem");
    if (totalItems.length == 0 && validationMessageVisible) {
        $('#jsValMessageCnt').remove();
    }
}
///Removes all client JavaScript added messages
function RemoveAllErrorJavaScriptMessage() {
    var totalItems = $(".jsValMessageItem");
    totalItems.remove();
    if (validationMessageVisible) {
        $('#jsValMessageCnt').remove();
    }
}

Sys.Application.add_load(function () {
    //DatePicker "open popup" button
    $('.rcCalPopup').keydown(function (e) {
        var keyPressed = e.keyCode || e.which;
        if (keyPressed === 13 || keyPressed === 32) {
            var datePicker = $find($(e.target).attr("id").replace("_popupButton", ""));
            if (datePicker !== null) {
                var popupButton = datePicker.get_popupButton();
                //Enter
                if (keyPressed === 13) {
                    popupButton.click();
                }
                    //Spacebar
                else if (keyPressed === 32) {
                    datePicker.hidePopup();
                    popupButton.focus();
                }
            }
            return false;
        }
        return true;
    });
    //TimePicker "open popup" button
    $('.rcTimePopup').keydown(function (e) {
        var keyPressed = e.keyCode || e.which;
        if (keyPressed === 13 || keyPressed === 32) {
            var timePicker = $find($(e.target).attr("id").replace("_timePopupLink", ""));
            if (timePicker !== null) {
                var popupButton = timePicker.get_timePopupButton();

                if (keyPressed === 13) {
                    //Enter
                    popupButton.click();

                    var timeView = timePicker.get_timeView();
                    var selectedTime = $('#' + timeView.get_element().id + " .rcSelected");
                    if (selectedTime.length > 0) {
                        //focus on selected time
                        selectedTime.children(0).focus();
                    } else {
                        //focus on first time
                        $('#' + timeView.get_element().id + " td:first").children(0).focus();
                    }
                }
                else if (keyPressed === 32) {
                    //Spacebar
                    timePicker.hideTimePopup();
                    popupButton.focus();
                }
            }
            return false;
        }
        return true;
    });
    ///When ESC is pressed inside the date picker popup it closes the popup and returns focus to the button
    $('.RadCalendar *').keydown(function (e) {
        var keyPressed = e.keyCode || e.which;
        if (keyPressed === 27) {
            var popupItem = $(e.target).attr("id");
            if (popupItem !== null && popupItem !== undefined) {
                var telerikDatePicker = $find(popupItem.replace("_calendar_Top", ""));
                if (telerikDatePicker !== null) {
                    var popupButton = telerikDatePicker.get_popupButton();
                    if (popupButton !== null && popupButton !== undefined) {
                        popupButton.click();
                        popupButton.focus();
                    }
                }
            }
            return false;
        }
        return true;
    });
    ///handle key presses inside time picker popup
    $('.RadCalendarTimeView').keydown(function (e) {
        var keyPressed = e.keyCode || e.which;
        if (keyPressed === 27 || keyPressed === 9 || keyPressed === 37 || keyPressed === 38 || keyPressed === 39 || keyPressed === 40) {
            var timeViewId = $(this).parent().attr("id").replace("_timeView", "");
            var timePicker = $find(timeViewId);

            if (timePicker !== null) {
                var timeViewBtn = timePicker.get_timePopupButton();
                if (e.keyCode === 27) {
                    //ESC - close popup
                    if (timeViewBtn !== null) {
                        timeViewBtn.click();
                        timeViewBtn.focus();
                    }
                } else if (keyPressed === 9) {
                    //Tab - close popup, focus "open popup" button, and return true - default browser behavior of Tab will focus on next focusable element
                    //handles Shift-Tab too, as keyPressed will also be 9 and browser will focus on previous focusable element
                    timePicker.hideTimePopup();
                    if (timeViewBtn !== null) {
                        timeViewBtn.focus();
                    }
                    return true;//handled but return control to browser
                } else if (keyPressed === 37) {
                    //Left arrow
                    var lCurrent = $(e.target.parentElement);
                    var lTarget = lCurrent.prev();
                    if (lTarget.length === 0) {
                        var lRowAbove = lCurrent.parent().prev();
                        if (lRowAbove.length > 0) {
                            lTarget = lRowAbove.children(":last");
                        }
                    }
                    if (lTarget.length > 0) {
                        lTarget.children(0).focus();
                    }
                } else if (keyPressed === 38) {
                    //Up arrow
                    var uCurrent = $(e.target.parentElement);
                    var uRowAbove = uCurrent.parent().prev();
                    if (uRowAbove.length > 0) {
                        var uCol = uCurrent.prevAll().length + 1;
                        var uTarget = uRowAbove.children(":nth-child(" + uCol + ")");
                        if (uTarget.length > 0) {
                            uTarget.children(0).focus();
                        }
                    }
                } else if (keyPressed === 39) {
                    //Right arrow
                    var rCurrent = $(e.target.parentElement);
                    var rTarget = rCurrent.next();
                    if (rTarget.length === 0) {
                        var rRowBelow = rCurrent.parent().next();
                        if (rRowBelow.length > 0) {
                            rTarget = rRowBelow.children(":first");
                        }
                    }
                    if (rTarget.length > 0) {
                        rTarget.children(0).focus();
                    }
                } else if (keyPressed === 40) {
                    //Down arrow
                    var dCurrent = $(e.target.parentElement);
                    var dRowAbove = dCurrent.parent().next();
                    if (dRowAbove.length > 0) {
                        var dCol = dCurrent.prevAll().length + 1;
                        var dTarget = dRowAbove.children(":nth-child(" + dCol + ")");
                        if (dTarget.length > 0) {
                            dTarget.children(0).focus();
                        }
                    }
                }
            }
            return false;//handled, done
        }
        return true;//not handled, return control to browser
    });

    //PLSUP-5050 remove blank items from bottom toolbar
    $('div#footpanel > ul#mainpanel > li').filter(function (idx, elm) {
        return !$.trim($(elm).html()); //return "true" for empty elements only
    }).remove();
});

function HandleKeyPressEventREIRadListBoxFilterTemplateColumn(sender, eventArgs) {
    var domElement = eventArgs.get_domEvent();
    switch (domElement.keyCode) {
        case 32:
            PlatformConsole.log(domElement.keyCode);
            var targetId = domElement.target.id.replace('_Input', '');
            var item = $find(targetId);
            var selectedItem = item.get_highlightedItem();
            selectedItem.set_checked(!selectedItem.get_checked());
            PlatformConsole.log(selectedItem.get_text() + ' : ' + selectedItem.get_checked());
            break;
    }
}

//////////////////////////////////////////////////////////
// Enter key press on info icon in IE will do post-back. Following code fix the issue.
// PFM-7250
//////////////////////////////////////////////////////////
function OnEnterKeyPressInfoIcon(e) {
    var isIE = false;
    if (e && navigator.appName == 'Microsoft Internet Explorer') {
        isIE = true;
    }
    else if (navigator.appName == 'Netscape')//IE 11
    {
        var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
        isIE = re.exec(navigator.userAgent) != null;
    }

    if (isIE === true && e.keyCode === 13) {
        (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
        return false;
    }
}
//Make toolbar items clickable when focused on the li
$('li[role="menuitem"]').keypress(function (e) {
    if (e.keyCode == 13) {
        $(this).click();
    }
});

function closeWindow() {
    var win = window.open('', '_self', '');
    win.close();
    if ($.browser.mozilla) {
        if (!window.closed) {
            var isIE11 = !!navigator.userAgent.match(/Trident.*rv\:11\./);
            if (!isIE11) {
                alert("Your browser doesn't support allowing websites to close the window. You must manually close the window yourself.");
            }
        }
    }
}

// PFM-7398 - Disabling "Report this Error" button. This function was accidentally deleted as part of PFM-6955
function DisableButton(selector) {
    $(selector).attr("disabled", "disabled").removeClass("hrsaSkinnedButton").addClass("hrsaSkinneddisbled");
}

function radNumericTextboxOnLoad(sender, args) {

    if (sender.SpinUpButton != null && sender.SpinUpButton != undefined) {
        sender.SpinUpButton.onkeydown = function (e) {

            var keyCode = (e.keyCode || e.which);

            if (keyCode == 13 || keyCode == 32)// Enter/Space key
            {
                sender.set_value(sender.get_value() + sender.get_incrementSettings().Step);
            }
        };
    }

    if (sender.SpinDownButton != null && sender.SpinDownButton != undefined) {
        sender.SpinDownButton.onkeydown = function(e) {

            var keyCode = (e.keyCode || e.which);

            if (keyCode == 13 || keyCode == 32) // Enter/Space key
            {
                sender.set_value(sender.get_value() - sender.get_incrementSettings().Step);
            }
        };
    }
}

//PFM-7557 - REIRadGrid - Allow the user to group by columns using the keyboard
//The sender here is the 'groupable' image element next to the column's header
function GroupByColumn(sender) {
    var gridElement = $(sender).closest('div.RadGrid');
    var colName = $(sender).attr("ColUniqueName");
    if (gridElement.length && gridElement[0].id && colName) {
        var grid = $find(gridElement[0].id);
        var gridTable = grid.get_masterTableView();
        gridTable.groupColumn(colName);
    }
}

//PLSUP-5095 Retain focus on the Date/Time input text box after a selection has been made
function RadTimePicker_RetainFocusOnDateSelected(sender, e) {
    if (sender && sender.get_dateInput) {
        sender.get_dateInput().focus();
    }
}

function RadGrid_OnCommand508(sender, e) {
    //PLSUP-4910
    if (e && e.get_commandName() === 'PageSize' && $(':focus').length) {
        var sourcePager = $(sender.get_element()).find('a.navigationGobtn:first').is(':focus') ? 'top' : 'bottom';
        var hiddenInputId = sender.get_clientStateFieldID() + '_sourcePager';
        $('<input>').attr({
            id: hiddenInputId,
            name: hiddenInputId,
            type: 'hidden',
            autocomplete: 'off'
        }).val(sourcePager).appendTo(sender.get_element());
    }
}