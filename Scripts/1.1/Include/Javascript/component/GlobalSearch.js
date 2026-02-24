
function pageLoad() {
    AttachSearchEventHandler();
    CategoryAttachEvent();
    DisableEnterKey(); //PFM-7545

    if (globalSearchIsAdvancedSearch == 'True') {
        $('.search_btn').bind('click', function () {
            var searchTypeClientId = $('#hdnSearchTypeClientId').val();
            var searchTypeOptionsClientId = $('#hdnSearchTypeOptionsClientId').val();
            var selectedValue = $('#' + searchTypeOptionsClientId + ' input:checked').val();
            $('input#' + searchTypeClientId).val(selectedValue);
        });

        var selectedKey = globalSearchSelectedIndexKey;
        if (selectedKey != null) {
            GetSelectedIndexKey(selectedKey);
        }
    }
}

var searchKeyupEvent;
var globalSearchInputBox;
var searchInputBox;
var configPath = globalSearchSkinConfigPath;
var suggestions;

//PFM-7545 - This function disables any actions taken when "Enter" key is pressed in the global search text box.
function DisableEnterKey() {
    searchInputBox.keydown(function (e) {
        if (e.keyCode === 13) { //Enter key
            (e.preventDefault) ? e.preventDefault() : e.returnValue = false;
        }
    });
}

// function to bind the keyup event to the search textbox.
// Set delay timer for the keyup event.
function AttachSearchEventHandler() {
    globalSearchInputBox = globalSearchInputBoxClientId;
    searchInputBox = $('#' + globalSearchInputBox);
    suggestions = $('#suggestions');
    var autoSuggestion = globalSearchUseAutoSuggestion.toString().toLowerCase() == 'true' ? true : false;

    if (autoSuggestion) {
        BindKeyUpEvent(searchInputBox);
    }

    HideLoaderImage();
}

$("#" + globalSearchCategoryClientID).keydown(function (event) {
    var keyCode = GetCharCode(event);
    switch (keyCode) {
        case 27: //escape
            $('#SearchCategoryFlyout').hide();
            return false;
            break;
        case 40: //Down
            var dropDown = $('#SearchCategoryFlyout');
            if (dropDown.is(":visible")) {
                $('li', dropDown).first().focus();
            } else {
                SearchCategory(globalSearchCategoryClientID, 'SearchCategoryFlyout', 'down');
            }
            return false;
            break;
        case 32: // space
        case 13: // enter
            SearchCategory(globalSearchCategoryClientID, 'SearchCategoryFlyout', 'down');
            return false;
            break;


    }

});

//Bind the keyup event to the search box and set up the execution delay timer to avoid server call on every keystroke
function BindKeyUpEvent(searchTextBox) {
    var delayTime = globalSearchDelayTime;
    var shiftClicked = false;
    searchTextBox.keyup(function (e) {
        var $this = $(this);
        var timerId = $this.data("timerId");
        if (timerId) {
            window.clearTimeout(timerId);
        }

        searchKeyupEvent = e;
        var keycode = searchKeyupEvent.keyCode;

        //esc , tab , shift  , up and down should not trigger the search       
        if (keycode !== 27 && keycode !== 9 && keycode !== 16 && keycode !== 40 && keycode !== 38) {
            if (searchInputBox.val() != '') {
                $this.data("timerId", window.setTimeout(OnKeyUpEvent, delayTime));
            }
            else {
                HideLoaderImage();
                EnterpriseSearchHide();
            }
        }
        if (keycode === 16) {
            shiftClicked = false;
        }


    });
    searchTextBox.keydown(function (e) {
        var keycode = e.keyCode;
        if (keycode === 27) {
            EnterpriseSearchHide();
        }
        if ((keycode === 40 && !shiftClicked) || keycode === 9) {
            if ($('#suggestions').is(":visible")) {
                $('#suggestions li > a').first().focus();
                return false;
            }
        }
        if (keycode === 16) {
            shiftClicked = true;
        }
    });

}

// call lookup function when keyup event is triggered.
function OnKeyUpEvent() {
    var indexRecordCount = globalSearchIndexRecordCount;
    ShowLoaderImage();
    lookup($('#' + globalSearchInputBox), searchInputBox.val(), searchKeyupEvent, $('#hdnRoles').val(), indexRecordCount);
    HideLoaderImage();
}

//Hide loader image in the search textbox
function HideLoaderImage() {
    searchInputBox.removeClass('searchboxLoader');
}

//Show the loader image in the search textbox
function ShowLoaderImage() {
    searchInputBox.addClass('searchboxLoader');
}

function GetSelectedIndexKey(indexKey) {
    var anchorId = $(".SearchCategory").children('a').attr('id');
    var categoryAnchor = $('#' + anchorId);
    var listItems = $("#selectable li");
    listItems.each(function (idx, li) {
        var item = $(li);
        var itemSpan = item.children(".ui-selectee").attr('SelectedValue');
        if (itemSpan == indexKey) {
            categoryAnchor.text(item.children(".ui-selectee").text());
            categoryAnchor.attr('IsGroup', item.children(".ui-selectee").attr('IsGroup'));
            categoryAnchor.attr('SelectedValue', item.children(".ui-selectee").attr('SelectedValue'));
            $('#' + $('#hdnIsGroupClientId').val()).val(item.children(".ui-selectee").attr('IsGroup'));
            $('#' + $('#hdnSelectedValueClientId').val()).val(item.children(".ui-selectee").attr('SelectedValue'));
            item.append('<span class="ESIndexSelection hidden-offscreen" > - Selected</span>');
        }
    });
}

function CategoryAttachEvent() {
    var Flyout = $('#SearchCategoryFlyout');
    var lis = $('li', Flyout);
    var focusedIndex = null;
    var shiftClicked = false;
    $('li', Flyout).each(function (index) {
        $(this).mouseenter(function () {
            $(this).focus();
        });

        $(this).focus(function () {
            $(this).css('background', '#E5F0FC');
        });

        $(this).blur(function () {
            $(this).removeAttr('style');
        });

        $(this).keyup(function (event) {
            var keyCode = GetCharCode(event);
            switch (keyCode) {
                case 16:  //Shift
                    shiftClicked = false;
                    break;
            }
        });

        $(this).keydown(function (event) {
            var e = GetCharCode(event);
            var focusedItem = null;
            switch (e) {
                case 9: //tab
                    if (!shiftClicked) {
                        if ($(this).next().length === 0) {
                            shiftClicked = false;
                            Flyout.hide();
                        }
                    } else {
                        if ($(this).prev().length === 0) {
                            shiftClicked = false;
                            $('.globalSearchCategoryLink').focus();
                            Flyout.hide();
                            return false;
                        }
                    }
                    break;
                case 13:
                    CategorySelection($(this).attr('spanClientID'), $(this).attr('searchCategoryClientID'), 'SearchCategoryFlyout', $(this).attr('topSearchBoxFieldClientID'), $(this).attr('indexDiv'));
                    return false;
                    break;
                case 27:
                    shiftClicked = false;
                    Flyout.hide();
                    $('.globalSearchCategoryLink').focus();
                    return false;
                    break;
                case 38:
                    if (index != 0) {
                        $(lis[index - 1]).focus();
                    }
                    else if (index == 0 && Flyout.is(':visible')) {
                        Flyout.hide();
                        shiftClicked = false;
                        $('.globalSearchCategoryLink').focus();
                    }
                    return false;
                    break;
                case 40:

                    if (index != lis.length - 1) {
                        $(lis[index + 1]).focus();
                    }
                    return false;
                    break;
                case 16:  //Shift
                    shiftClicked = true;
                    break;
            }
        });
    });
}

//Moved from Platformlib.js

// This function is an onclick event of the global search index drop down menu.
function SearchCategory(eleID, flyoutID, vOrientation) {

    Category = $('#' + eleID);
    Flyout = $('#' + flyoutID);
    switch (vOrientation) {
        case "down":
            Flyout.css('top', Category.position().top + Category.height() + 5);
            var left = Category.position().left - Flyout.width() + Category.width() + 28;
            if (left < 0) {
                left = 0;
            }
            Flyout.css('left', left);
            break;
        case "downLeft":
            Flyout.css('top', Category.position().top + Category.height() + 11);
            Flyout.css('left', Category.position().left);
            break;
        case "up":
            Flyout.css('top', Category.position().top - Flyout.height() - 7, scroll);
            Flyout.css('left', Category.position().left);
            break;
    }

    if (Flyout.css('display') == 'none') {
        Flyout.css('display', 'block');

        $("body").click
        (
          function (e) {
              if ((e.target.className == '') || (e.target.className != Flyout.attr('class') && e.target.className != Category.attr('class'))) {
                  Flyout.css('display', 'none');
              }
          }
        );
    }
}

//function SearchCategoryBlur(ele, flyoutID, vOrientation, event) {
//    SearchCategory(ele, flyoutID, vOrientation, event);
//}

// This function is to display the suggestion panel for global search.
// It is called when users start typing keywords in the search textbox.
function lookup(Ele, inputString, event, roles, recordCount) {
    var XY = findPos(Ele);
    var SearchBox = $(Ele);
    SBox = Ele;
    var ContainerParent = SearchBox.parent().parent();
    //var suggestions = $('#suggestions');
    var SugWidth = suggestions.width();
    var WinWidth = $(window).width();

    if (parseInt(XY[1]) + suggestions.height() > $(window).height()) {
        suggestions.css('top', parseInt(XY[1]) - suggestions.outerHeight(true) - 18);
    }
    else {
        suggestions.css("top", SearchBox.offset().top + SearchBox.outerHeight() + 4);
    }

    if ((SearchBox.position().left - parseInt(SugWidth)) < 0) {
        if (parseInt(XY[1]) + suggestions.height() < $(window).height()) {
            suggestions.css("left", SearchBox.position().left);
        }
        else {

            suggestions.css('left', 0); // $('.btmflyout_menu').offset().left);
        }
    }
    else {
        suggestions.css('left', $('.search_btn').offset().left + $('.search_btn', ContainerParent).outerWidth(false) - suggestions.innerWidth());
    }

    if (inputString.length == 0) {
        suggestions.fadeOut();
        HideLoaderImage();
        $('.btmflyout_menu').css('min-width', 110);
    }
    else {
        var selectedIndexKey = $('#' + $('#hdnSelectedValueClientId').val()).val();
        var isGroupSelected = ($('#' + $('#hdnIsGroupClientId').val()).val().toLowerCase() == 'true');
        var roleArray = roles.split(',');
        var ent = GetCharCode(event);
        if (ent != 9 && ent != 37 && ent != 38 && ent != 39 && ent != 40) {
            CallGlobalSearchWCFService(inputString, roleArray, selectedIndexKey, isGroupSelected, Ele, event, recordCount);
        }
        else {
            RenderSuggestionPanel(Ele, event);
        }
    }
}

// This function is called when users change the global search index selection from the drop down menu.
function CategorySelection(selectedID, displayID, flyoutID, searchBoxID, FlyoutLeftID) {

    Display = $('#' + displayID);
    SelectedEle = $('#' + selectedID);
    Flyout = $('#' + flyoutID);
    SearchBox = $('#' + searchBoxID);

    var ContainerParent = Display.parent();

    FlyoutLeft = $('.flyoutleft');
    if (SelectedEle.text() == 'Turn Off Suggestions') {
        SelectedEle.text('Turn On Suggestions');
        $('.searchbox').unbind('keyup');
        SetUserPreference(false);
        $('.searchbox').focus();

    }
    else if (SelectedEle.text() == 'Turn On Suggestions') {
        SelectedEle.text('Turn Off Suggestions');
        BindKeyUpEvent(SearchBox);
        SetUserPreference(true);
        $('.searchbox').focus();
    }
    else {
        $('.ESIndexSelection').remove();
        Display.text(SelectedEle.text());

        SelectedEle.append('<span class="ESIndexSelection hidden-offscreen" > - Selected</span>');
        Display.attr('IsGroup', SelectedEle.attr('IsGroup'));
        Display.attr('SelectedValue', SelectedEle.attr('SelectedValue'));
        $('#' + $('#hdnIsGroupClientId').val()).val(SelectedEle.attr('IsGroup'));
        $('#' + $('#hdnSelectedValueClientId').val()).val(SelectedEle.attr('SelectedValue'));
    }

    if (FlyoutLeftID != 'None') {
        var FlyoutLeftContent = $('#' + FlyoutLeftID);
        FlyoutLeft.children(0).css('display', 'none');
        ContainerParent.append(FlyoutLeft.children(0));

        $('li.SearchSelected', FlyoutLeftContent).each(function () {
            $(this).removeClass('SearchSelected');
        });


        var FlyoutRight = $('.flyoutright');
        var FluoutRightFirstEle = $('li:first', FlyoutLeftContent);
        FluoutRightFirstEle.addClass('SearchSelected');
        FlyoutRight.children(0).css('display', 'none');
        ContainerParent.append(FlyoutRight.children(0));
        FlyoutRight.append($('#' + FluoutRightFirstEle.attr('innerContentID')));
        FlyoutRight.children(0).css('display', 'block');

        FlyoutLeft.append(FlyoutLeftContent);
        FlyoutLeft.children(0).css('display', 'block');

        SuggestionAttachEvent();
    }

    Flyout.css('display', 'none');
    SearchBox.focus();
}

function EnterpriseSearchHide() {
    $('#suggestions').fadeOut();
    $('#enterpriseSearchContentContent *').remove();
    $('#enterpriseSearchBannerTitle').html('');
}

function MouseIn() {
    mouseIn = true;
}

function MouseOut() {
    mouseIn = false;
}

function findPos(obj) {

    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    }
    return [curleft, curtop];
}

// This function is making a WCF call to get data from global search service.
function CallGlobalSearchWCFService(searchCriteria, roles, indexKey, isGroupSelected, element, event, recordCount) {
    if (globalSearchIsAdvancedSearch != 'True' ) {
        if (searchCriteria.trim().length > 0) {
            var serviceMethod;
            var data;
            var CurrentSessionID;
            var CurrentSessionID=REISys.Platform.CurrentSessionID;  //PFM-7707 Get currentSessionid;
            var CurrentUserName=REISys.Platform.CurrentUserName;
                //= REISys.Platform.CurrentUserName;//PFM-7707 Get CurrentSessionid;
            // If the group is selected, parse the index key (GroupCode) to integer.
            if (isGroupSelected) {
                serviceMethod = 'ExecuteSearchOnGroup'; 
                data = { groupCode: parseInt(indexKey), searchCriteria: searchCriteria, roles: roles, userId: REISys.Platform.CurrentUserId, UserName: CurrentUserName, SessionID: CurrentSessionID, recordCount: recordCount }; //pfm7707 Added sessionid, username to the argument list
            }
            else {
                // If any index is selected, pass the index key as a string parameter to the service method.
                serviceMethod = 'ExecuteSearchOnIndex';
                data = { searchCriteria: searchCriteria, roles: roles, indexKey: indexKey, userId: REISys.Platform.CurrentUserId, UserName: CurrentUserName, SessionID: CurrentSessionID, recordCount: recordCount }; //pfm7707 Added sessionid, username to the argument list
            }

            var json = JSON.stringify(data)

            $.ajax({
                type: "POST",
                url: globalSearchRootUrl + "GlobalSearchService.svc/" + serviceMethod,
                data: json,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.d != null && data.d.NumberOfResults > 0) {
                        CreateIndexGroupModel(data.d, searchCriteria, indexKey, isGroupSelected);
                        RenderSuggestionPanel(element, event);
                        $('#enterpriseSearchContentContent .tooltip').tipTip();
                    }
                    else {
                        EnterpriseSearchHide();
                    }
                    ServiceSucceeded();
                },
                error: ServiceFailed
            });
        }
    }
}

// function to render suggestion panel
function RenderSuggestionPanel(Ele, event) {
    if (globalSearchIsAdvancedSearch != 'True') {
        var XY = findPos(Ele);
        var SearchBox = $(Ele);
        SBox = Ele;
        var ContainerParent = SearchBox.parent().parent();
        var SugWidth = suggestions.width();
        var WinWidth = $(window).width();

        if (suggestions.css('display') == 'none') {
            $('#enterpriseSearchBannerTitle').html('Search Results');
            suggestions.fadeIn();
            $('.btmflyout_menu').css('min-width', 468);

            $("body").bind('click.SuggestionFlyout', function (e) {
                if (($(e.target).attr('id') != SearchBox.attr('id')) && !mouseIn) {
                    EnterpriseSearchHide();
                    $('.btmflyout_menu').css('min-width', 110);
                    $('body').unbind('click.SuggestionFlyout');
                }
            }
        );
        }
        else {
            var e = GetCharCode(event);
            var SugFlyoutLeft = $('.flyoutleft', suggestions);
            var VisibleLeftDiv = SugFlyoutLeft.children("div:visible");
            var lis = $('li', VisibleLeftDiv);
            var index = lis.index($('li.SearchSelected', VisibleLeftDiv));

            if (e == 40 && lis.length > 0 && index != -1) {
                if ($('.searchbox').is(":focus")) {
                    $(lis[0]).focus();
                }
                else {
                    if (index != lis.length - 1) {
                        $(lis[index + 1]).focus();
                    }
                    else if (lis.length > 1) {
                        $(lis[0]).focus();
                    }
                }
            }
        }
    }
}

$(document).ready(function () {
    $("#selectable").selectable({
        selected: function (event, ui) {
            var anchorId = $(".SearchCategory").children('a').attr('id');
            var categoryAnchor = $('#' + anchorId);
            categoryAnchor.attr('SelectedValue', ui.selected.getAttribute("SelectedValue"));
            categoryAnchor.attr('IsGroup', ui.selected.getAttribute("IsGroup"));
        }
    })
});

function SetUserPreference(useAutoSuggestion) {
    if (globalSearchIsAdvancedSearch != 'True') {
        $.ajax({
            type: 'POST',
            data: JSON.stringify({ userId: REISys.Platform.CurrentUserId, name: 'UseGlobalSearchAutoSuggestion', value: useAutoSuggestion }),
            url: globalSearchRootUrl + 'PreferenceService.svc/UpdatePreference',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                ServiceSucceeded();
                return true;
            },
            error: ServiceFailed
        });
    }
}

//SuggestionAttachEvent();
function SuggestionAttachEvent() {

    var LeftFOut = $('.flyoutleft');
    var FlyoutRight = $('.flyoutright');

    var shiftClicked = false;
    var indexHeaderNodes = $('.searchlinkwrapper');
    var documentNodes = $('.enterpriseSearchRight li');
    var indexHeaderNodesAnchors = $('.searchlinkwrapper > a');
    var documentNodesAnchors = $('.enterpriseSearchRight li > a');
    indexHeaderNodesAnchors.each(function (index) {

        $(this).keyup(function (event) {
            var keyCode = GetCharCode(event);
            switch (keyCode) {
                case 16:  //Shift 
                    shiftClicked = false;
                    break;
            }
        });
        // esc, up, down, right, provided keyboard navigation for the index layer
        $(this).keydown(function (event) {
            var keyCode = GetCharCode(event);
            switch (keyCode) {
                case 27: //escape
                    $('.searchbox').focus();
                    EnterpriseSearchHide();
                    break;
                //                    case 37: //Left                
                //                    break;                
                case 38: //Up
                    var previous = $('a', $(this).parent().prev()).first();
                    if (previous.length !== 0) {
                        FocusOnIndexHeaderEnterpriseSearchPanel(previous.parent());
                        previous.focus();
                    } else {
                        $('.searchbox').focus();
                        EnterpriseSearchHide();
                    }
                    return false;
                    break;
                case 39: //Right
                    $('li > a', $(this).parent()).first().focus();
                    return false;
                    break;
                case 40: //Down
                    var next = $('a', $(this).parent().next()).first();
                    if (next.length !== 0) {
                        FocusOnIndexHeaderEnterpriseSearchPanel(next.parent());
                        next.focus();
                    } else {
                        $('#EntSrchMoreResults').focus();
                    }
                    return false;
                    break;
                case 9: //Tab
                    var previous = $('a', $(this).parent().prev()).first();
                    if (shiftClicked) {
                        if (previous.length === 0) {
                            suggestions.fadeOut();
                            EnterpriseSearchHide();
                            $('input[id*="search_btn_top"]').focus();
                            return false;
                        }

                    }
                    break;
                case 16:  //Shift
                    shiftClicked = true;
                    break;
            }
        });
        $(this).focus(function (event) {
            FocusOnIndexHeaderEnterpriseSearchPanel($(this).parent());
        });

    });
    // Adds events for more More Results.. button KEY DOWN
    $('#EntSrchMoreResults').keydown(function (event) {
        var keyCode = GetCharCode(event);
        switch (keyCode) {
            case 27: //escape
                $('.searchbox').focus();
                EnterpriseSearchHide();
                break;
            case 38: //Up
                $('ul.listassistcontainer > li > a').last().focus();
                return false;
                break;
            case 40: //Down
                $('.searchbox').focus();
                EnterpriseSearchHide();
                return false;
                break;

            case 9: //Tab
                if (!shiftClicked) {
                    EnterpriseSearchHide();
                    $('.searchbox').focus();
                    return false;

                }
                break;

            case 16:  //Shift
                shiftClicked = true;
                break;
        }
    });
    // Adds events for more More Results.. button KEY UP
    $('#EntSrchMoreResults').keyup(function (event) {
        var keyCode = GetCharCode(event);
        switch (keyCode) {
            case 16:  //Shift
                shiftClicked = false;
                break;
        }
    });

    //Document Nodes Anchor Tags 
    documentNodesAnchors.each(function (index) {
        //Key down events adds left up, down , and esc
        $(this).keydown(function (event) {
            var keyCode = GetCharCode(event);
            switch (keyCode) {
                case 27: //escape
                    $('.searchbox').focus();
                    EnterpriseSearchHide();
                    break;
                case 37: //Left
                    $('a', $(this).parents('ul.enterpriseSearchRight').parent()).first().focus();
                    break;
                case 38: //Up
                    var previous = $('a', $(this).parent().prev()).first();
                    if (previous.length !== 0) {
                        previous.focus();
                    }
                    return false;
                    break;
                //             case 39: //Right                
                //                  return false;                
                //                   break;                
                case 40: //Down
                    var next = $('a', $(this).parent().next()).first();
                    if (next.length !== 0) {
                        next.focus();
                    } else {
                        $('#intMoreBtn', $(this).parents('ul.enterpriseSearchRight')).focus();
                    }
                    return false;
                    break;
            }
        });
        //focus for the elemnt adds a class and removes that class from other elements
        $(this).focus(function () {
            $('.documentHightlight').removeClass('documentHightlight');
            $(this).parent().addClass('documentHightlight');
        });
    });

    //Adds class for heightling
    indexHeaderNodes.each(function (index) {
        //mouse enter adds a hover event
        $(this).mouseenter(function () {
            FocusOnIndexHeaderEnterpriseSearchPanel($(this));
        });
    });

    //removes focus class  
    documentNodes.each(function (index) {
        $(this).mouseenter(function () {
            $('.documentHightlight').removeClass('documentHightlight');
        });


    });

    // Adds for the + More buttons keyboard accesability 
    $('.ESDocMoreBTN').keydown(function (event) {
        var keyCode = GetCharCode(event);
        switch (keyCode) {
            case 27: //escape
                $('.searchbox').focus();
                EnterpriseSearchHide();
                break;
            case 37: //Left
                $('a', $(this).parents('ul.enterpriseSearchRight').parent()).first().focus();
                break;
            case 38: //Up
                $('li > a', $(this).parents('ul.enterpriseSearchRight')).last().focus();
                return false;
                break;

            case 40: //Down
                return false;
                break;
        }
    });
}

//Build a new object from the JSON search object.
function CreateIndexGroupModel(groupIndexes, searchCriteria, indexKey, isGroupSelected) {
    var dataArray = [];
    var RTDS;
    //debugger;
    // If group is selected, flatten the group data and index data to build a new object.
    if (isGroupSelected) {
        RTDS = new Object();
        RTDS.GroupName = groupIndexes.GroupName;
        RTDS.IndexName = groupIndexes.GroupName;
        RTDS.IndexKey = groupIndexes.IndexKey;
        RTDS.IsGroup = true;
        RTDS.ResultCount = 0;
        RTDS.IndexModel = groupIndexes.Indexes;
        dataArray.push(RTDS);

        $.each(groupIndexes.Indexes, function (index, element) {
            RTDS = new Object();
            RTDS.GroupName = groupIndexes.GroupName;
            RTDS.IndexName = element.IndexName;
            RTDS.IndexKey = element.IndexKey;
            RTDS.IsGroup = false;
            RTDS.ResultCount = element.NumberOfResults;
            RTDS.IndexModel = $.makeArray(element);
            if (element.NumberOfResults > 0) {
                dataArray.push(RTDS);
            }
        });
    }
    else {
        // If index is selected, build the new object directly from the JSON object.
        RTDS = new Object();
        RTDS.GroupName = "";
        RTDS.IndexName = groupIndexes.IndexName;
        RTDS.IndexKey = groupIndexes.IndexKey;
        RTDS.IsGroup = false;
        RTDS.ResultCount = groupIndexes.NumberOfResults;
        RTDS.IndexModel = $.makeArray(groupIndexes);
        if (groupIndexes.NumberOfResults > 0) {
            dataArray.push(RTDS);
        }
    }

    CreateSuggestionPanelView(dataArray, searchCriteria, indexKey);

    SuggestionAttachEvent();
    AddEnterpriseSearchSlimScroll();
}

//nodeFocused is the LI of the instance not the anchor tag
function FocusOnIndexHeaderEnterpriseSearchPanel(nodeFocused) {
    $('.enterpriseSearchRight > div').hide();
    $('.SearchSelected').removeClass('SearchSelected');
    $('.enterpriseSearchRight > div', nodeFocused).show();
    nodeFocused.addClass('SearchSelected');
    AdjustFlyoutPosition();
}

function AdjustFlyoutPosition() {
    var XY = findPos(SBox);
    var SearchBox = $(SBox);
    var ContainerParent = SearchBox.parent().parent();
    //var suggestions = $('#suggestions');
    var SugWidth = suggestions.width();
    var WinWidth = $(window).width();


    if (parseInt(XY[1]) + suggestions.height() > $(window).height()) {
        //suggestions.css('top', parseInt(XY[1]) - suggestions.outerHeight(true) - 18);
        suggestions.css("top", SearchBox.offset().top + SearchBox.outerHeight() + 4);
    }
    else {
        suggestions.css("top", SearchBox.offset().top + SearchBox.outerHeight() + 4);
    }

    if ((SearchBox.position().left - parseInt(SugWidth)) < 0) {
        if (parseInt(XY[1]) + suggestions.height() < $(window).height()) {
            suggestions.css("left", SearchBox.position().left);
        }
        else {

            suggestions.css('left', 0);
        }

    }
    else {
        suggestions.css('left', $('.search_btn', ContainerParent).offset().left + $('.search_btn', ContainerParent).outerWidth(false) - suggestions.innerWidth());
    }
}

//Create search suggestion panel client view
function CreateSuggestionPanelView(objArray, searchCriteria, indexKey) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var leftPanelView = '';
    var rightPanelView = '';
    var counter = 0;


    leftPanelView += CreateLeftPaneView(array[0].GroupName, array[0].IndexName, array[0].IsGroup, array[0].IndexModel, searchCriteria, indexKey, 0);
    $('div.flyoutleft').html(leftPanelView);
    for (var i = 0; i < array.length; i++) {
        //Create Left Pane for Suggestion Panel
        //Create Right Pane for Suggestion Panel
        if (array[i].IsGroup == false) {

            var tempPanel = CreateRightPaneView(array[i].IndexName, array[i].IndexKey, array[i].IsGroup, array[i].IndexModel[0].Documents, array[i].ResultCount, searchCriteria, counter);
            $('#' + array[i].IndexName.replace(/\s/g, "") + 'ULELEM').html(tempPanel);
            counter++;
        }
    }


    //   $('div.flyoutright').html(rightPanelView);
}

//Create the left pane of the suggestion panel
function CreateLeftPaneView(groupName, indexName, isGroup, indexModel, searchCriteria, indexKey, counter) {
    var leftPanelView = '<div id=\'';
    if (counter > 0) {
        if (isGroup == true) {
            leftPanelView += groupName.replace(/\s/g, "") + 'Left\' style=\'display:none;\'>';
        }
        else {
            leftPanelView += indexName.replace(/\s/g, "") + 'Left\' style=\'display:none;\'>';
        }
    }
    else {
        leftPanelView += groupName.replace(/\s/g, "") + 'Left\' style=\'display:block;\'>';
    }

    leftPanelView += '<div class="leftcontent" id="callupon"><div class="clearfix">&nbsp;</div><div>';

    if (isGroup == true) {
        leftPanelView += '<span class="titles">' + groupName + '</span>';
    }

    leftPanelView += '<ul class="listassistcontainer" id="LeftSelectionList">';

    var params = "?SelectedValue=" + indexKey + "&IsGroup=" + isGroup + "&Keywords=" + searchCriteria;

    var items = CreateLeftPanelItemView(indexModel, searchCriteria);
    leftPanelView += items;
    leftPanelView += '</ul></div></div><br /><br />';
    leftPanelView += '<div class="moreinf"><a id="EntSrchMoreResults" class="searchicon" href="' + searchResultRedirectUrl + params + '">More Results..</a></div>';
    leftPanelView += '</div>';

    return leftPanelView;
}

//Create the right pane of the suggestion panel
function CreateRightPaneView(indexName, indexKey, isGroup, Documents, numberOfResults, searchCriteria, counter) {
    var rightPanelView = '';

    if (isGroup == false) {
        rightPanelView += '<div id=\'';
        if (counter > 0) {
            rightPanelView += indexName.replace(/\s/g, "") + '\' style=\'display:none;\'>';
        }
        else {
            rightPanelView += indexName.replace(/\s/g, "") + '\' style=\'display:block;\'>';
        }

        rightPanelView += '<div class="innerScroll1"><div class="innerHeight"><span class="righttitles Popup">Top Results</span><br /><ul class="listedright">';
        var items = CreateRightPaneItemView(indexKey, Documents);
        rightPanelView += items;
        rightPanelView += '</ul>';
        if (numberOfResults > 10) {
            var params = "?SelectedValue=" + indexKey + "&IsGroup=" + isGroup + "&Keywords=" + searchCriteria;
            rightPanelView += '<div class="moreinf innerMore" ><a id="intMoreBtn" class="ESDocMoreBTN" href="' + searchResultRedirectUrl + params + '">+ More&nbsp;&nbsp;</a></div>';
        }
        rightPanelView += '</div></div></div>';
    }

    return rightPanelView;
}

function ServiceSucceeded(error) {
    RemoveErrorJavaScriptMessage('An error occurred while performing the search.');
}

// This function is called when the global search WCF call fails.
function ServiceFailed(error) {
    $("#loader").hide();
    PlatformConsole.log("Error: " + error.status)
    ShowErrorJavaScriptMessage('An error occurred while performing the search.');
}

//Create each item of the left pane view for suggestion panel
function CreateLeftPanelItemView(indexModel, searchCriteria) {
    var item = '';
    var counter = 0;

    $.each(indexModel, function (index, element) {
        if (element.NumberOfResults > 0) {
            var params = "?SelectedValue=" + element.IndexKey + "&IsGroup=false" + "&Keywords=" + searchCriteria;
            item += CreateIndexItem(element.IndexName, element.NumberOfResults, params, counter);
            counter++;
        }
    });

    return item;
}

//Create each item of the right pane view for suggestion panel
function CreateRightPaneItemView(indexKey, objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var item = '';

    $.each(array, function (index, element) {
        var formatter = eval(indexKey + 'Formatter');
        item += formatter(element.Values, configPath);
    });


    return item;
}

//Create each index item for left pane of the suggestion panel
function CreateIndexItem(indexName, numberOfResults, params, counter) {
    var item = '<li class="';
    var tempIndexName = indexName.replace(/\s/g, "");
    if (counter > 0) {
        item += 'searchlinkwrapper flyoutentry" innerContentID="' + tempIndexName + '">';
    }
    else {
        item += 'searchlinkwrapper flyoutentry SearchSelected" innerContentID="' + tempIndexName + '">';
    }

    item += '<a class="searchlinks" href="' + searchResultRedirectUrl + params + '">' + indexName + ' (' + NumberFormatterWithComma(numberOfResults) + ')</a><ul class="enterpriseSearchRight" id="' + tempIndexName + 'ULELEM" class="EnterpriseSearchResultRight"> </ul></li>';

    return item;
}


function NumberFormatterWithComma(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


function AddEnterpriseSearchSlimScroll() {
    $('.innerScroll1').slimScroll({
        height: '300px',
        railVisible: true,
        alwaysVisible: true,

        color: '#015D90',
        size: '10px',
        Opacity: .9,
        distance: '2px'
    });
}