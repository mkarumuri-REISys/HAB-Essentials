/// <reference path="../jquery-vsdoc.js" />

$('.rei-toggler').live('click', {}, function (e) {

    if (($('input[id*=togglerStateField]', $(this))[0].value) != "readOnly") {
        if (($(this).attr('mextoggling') == 'true')) {
            MutuallyExclusiveToggler($(this));
        }
        ClickToggler($(this));
    }
});

$('.personal-comment-cancel').live('click', {}, function () {
    var togglerBody = $(this).parents('.toggler-body')[0];

    var toggler = $(togglerBody).prev('div');
    $('.left-arrow, .right-arrow', toggler).toggle();
    var comment = $('.personal-comment-text', togglerBody).text();

    $('.personal-comment-edit', togglerBody).val($.trim(comment));
    //$('#edit').showloading();
    $('.personal-comment-edit-mode', togglerBody).hide();
    $(togglerBody).find('.personal-comment-display-mode').show();
    $('.toggler-header-image', toggler).fadeIn();
});

$('.toggler-header-image').live('click', {}, function (e) {
    if ($(this).attr('clickable')) {
        return false;
    }
    var toggler = $(this).parents('.rei-toggler')[0];
    var togglerBody = $(toggler).next('div');
    var headerImage = $(this).find('#headerImage').context;
    var specificClass = toggler.className.split(' ')[1];

    $('.left-arrow', toggler).show();
    $('.right-arrow', toggler).hide();
    if (specificClass == 'personal-comment') {
        togglerBody.slideDown();

        if (headerImage.className.indexOf('disable') > -1) {
            headerImage.src = disableImage(true, headerImage.src);
            $(this).css("cursor", "default").attr('clickable', 'true');
        } else $(this).fadeOut();

        togglerBody.find('.personal-comment-display-mode').hide();
        togglerBody.find('.personal-comment-edit-mode').show();
        return false;
    }
});

$('.rei-toggler-initiallyCollapsed').hide();
$('.rei-togglerImages img[id$=togglerLeftArrow]').each(function () {
    if ($(this).attr('data') == 'collapse') {
        $(this).hide();
    }
});

$('.rei-togglerImages img[id$=togglerRightArrow]').each(function () {
    if ($(this).attr('data') == 'show') {
        $(this).show();
    }
});

//PFM-3348
Sys.Application.add_load(function () {
    $('.togglerKeyboardImageHandle').keydown(function (e) {
        if (e.keyCode == 13) {
            $('.toggler-header-image', $(this)).click();
            //  $(this).children("img:visible").trigger("mouseover");
            return false;
        }
    });
});

$('.togglerKeyboardHandle').keydown(function (e) {
    if (e.keyCode == 13) {
        if (($('input[id*=togglerStateField]', $(this.parentNode.parentNode))[0].value) != "readOnly") {
            if (($(this.parentNode.parentNode).attr('mextoggling') == 'true')) {
                MutuallyExclusiveToggler($(this.parentNode.parentNode));
            }
            ClickToggler($(this.parentNode.parentNode));
        }
        $(this).children("img:visible").trigger("mouseover");
        return false;
    }
});

$('.togglerKeyboardHandle').focus(function () {
    $(this).children("img:visible").trigger("mouseover");
});

$('.togglerKeyboardHandle').blur(function () {
    $(this).children("img:visible").trigger("mouseout");
});
//end PFM-3348

//Expands a selected Toggler
Toggler.prototype.ExpandToggler = function () {
    if ($('input[id*=togglerStateField]', this.jQueryObj)[0].value != 'show') {
        ClickToggler(this.jQueryObj);
    }
};
//Colapses a selected Toggler
Toggler.prototype.CollapseToggler = function () {
    if ($('input[id*=togglerStateField]', this.jQueryObj)[0].value != 'hide') {
        ClickToggler(this.jQueryObj);
    }
};
//gets the state of a selected Toggler(Either show, hide or readOnly)
Toggler.prototype.GetTogglerState = function () {
    return $('input[id*=togglerStateField]', this.jQueryObj)[0].value;
};
//Changes the selected Toggler to ReadOnly
Toggler.prototype.MakeTogglerReadOnly = function () {
    if ($('input[id*=togglerStateField]', this.jQueryObj)[0].value != 'readOnly') {
        ExpandTogglerEvent = new GlobalPlatformEvent('ExpandTogglerEvent');
        $('input[id*=togglerStateField]', this.jQueryObj)[0].value = 'readOnly';
        var image = $('img[id*="togglerArrow"]', this.jQueryObj);
        image.hide();
        image.parent().hide();
        this.ExpandToggler();
    }
};
//This is a toggler object
function Toggler(jQueryObj) {
    this.jQueryObj = jQueryObj;
    if (!this.jQueryObj) { throw ('Must give jQueryObj'); }
    if ($('input[id*=togglerStateField]', this.jQueryObj)[0] == null || $('input[id*=togglerStateField]', this.jQueryObj)[0] == undefined) {
        throw ('Must give valid Toggler Object');
    }
}
//Find a control by the id
function FindToggler(togglerId) {
    var tog = $("[id*=" + togglerId + "]");
    return new Toggler(tog);
}

//This will execute and click a toggler to open or close it
//The parameter is the toggler object
function ClickToggler(current) {
    var togglerState = $('input[id*=togglerStateField]', current);
    if ((togglerState[0].value) != "readOnly") {
        if ($(current.target).is('a, input[type=image]'))
            return;
        var data = true;
        var togglerBody = current.next('div');
        togglerState[0].value = togglerBody.is(':visible') ? 'hide' : 'show';
        togglerBody.slideToggle('fast');
        //raises the client side events

        var togglerArrow = $('img[id*=togglerArrow]', current);
        if (togglerState[0].value == 'show') {
            togglerArrow.attr('class', togglerArrow.attr('class').replace('right', 'left'));
            togglerArrow.attr('alt', 'Collapse');
            togglerArrow.attr('src', togglerArrow.attr('src').replace('right', 'down'));
            togglerArrow.attr('title', 'Collapse');
            togglerArrow.tipTip();  //Add the tooltip with the new title
            togglerArrow.removeAttr("title");  //Remove the title attribute so the default IE tooltip won't be rendered
            data = false;
            ExpandTogglerEvent.raise(current, null);
        }
        else if (togglerState[0].value == 'hide') {
            togglerArrow.attr('class', togglerArrow.attr('class').replace('left', 'right'));
            togglerArrow.attr('alt', 'Expand');
            togglerArrow.attr('src', togglerArrow.attr('src').replace('down', 'right'));
            togglerArrow.attr('title', 'Expand');
            togglerArrow.show();
            togglerArrow.tipTip(); //Add the tooltip with the new title
            togglerArrow.removeAttr("title"); //Remove the title attribute so the default IE tooltip won't be rendered
            
            CollapseTogglerEvent.raise(current, null);
        }

        var headerTitle = $('.linkheader', current);
        var collapsedTitle = headerTitle.attr('headercollapsedtitle')
        if (data.length && collapsedTitle)
            headerTitle.text(collapsedTitle);
        else
            headerTitle.text(headerTitle.attr('HeaderTitle'));
        headerTitle.truncate(($(this).attr('maxtextlength') || 125), {
            chars: /\s/,
            trail: [" <font size=1>(<a href='#' class='truncate_show'>" + ($(this).attr('collapsedtext') || '+ View More') + "</a>) </font>", "<font size=1>&nbsp;(<a href='#' class='truncate_hide'>" + ($(this).attr('expandedtext') || '- View Less') + "</a>) </font>"]
        });
    }
}
//Expanded toggler Event 
var ExpandTogglerEvent = new GlobalPlatformEvent('ExpandTogglerEvent');
//Collapsed toggler event object
var CollapseTogglerEvent = new GlobalPlatformEvent('CollapseTogglerEvent');

function disableImage(disable, src) {
    if (disable) {
        var ar = src.split('.');
        var l = ar.length;
        for (var i = 0; i < l; i++) {
            if (i == l - 2) ar[i] += 'disabled';
        }
        return ar.join('.');
    }
    var srcA = src.split('disabled');
    return srcA.join();
}
//PFM-3657
//this will handle the mution exclusive for togglers
//Ele is the 
function MutuallyExclusiveToggler(Ele) {
    var GroupName = Ele.attr('mexgroupname');
    $('[mexgroupname *= "' + GroupName + '"]').each(function () {
        if ($(this).attr('id') != Ele.attr('id')) {
            var togglerBody = $(this).next('div');

            if (togglerBody.is(':visible')) {
                $(this).attr('toggled', 'true');
                ClickToggler($(this));
            } else {
                Ele.removeAttr('toggled');
                ClickToggler($(this));
            }
        }
    })
}