// Function to create namespaces.
function newnamespace(namespaceString) {
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

///////////////////////////////////////////////////////////////////////////////////////
// creates the name space for contributions
var contributionNS = newnamespace('REISys.Platform.Web.Contribution');

var ContributionUrlConstants = function () { }
ContributionUrlConstants.Service = 'Platform/WebServices/ContributionService.svc'
ContributionUrlConstants.BaseUrl = REISys.Platform.WebRoot;

var CQConstants = function () { }
CQConstants.ResourceType = 'ResourceTypeCode';
CQConstants.ResourceValue = 'ResourceValue';
CQConstants.InvitationId = 'InvitationId';
CQConstants.PRoleId = 'PRoleId';
CQConstants.RoleId = 'RoleId';
CQConstants.TaskTypeCode = 'TaskTypeCode';

///////////////////////////////////////////////////////////////////////////////////////
/// Redirect to a specific location
/// 
contributionNS.loadPage = function (url, args) {
    url = contributionNS.CreateUrl(url, args);
    window.location.replace(url);
    window.location.href = url;
    return false;
}

///////////////////////////////////////////////////////////////////////////////////////
/// Redirect to a specific location
/// 
contributionNS.loadPopupPage = function (url, args) {
    url = contributionNS.CreateUrl(url, args);
    window.open(url, '_blank', 'height=400,width=1200,resizable=1', true);

    return false;
}

///////////////////////////////////////////////////////////////////////////////////////
//This creates a url going to the widgetHostPage based ont the arguments passed
contributionNS.CreateUrl = function (url, args) {

    if (!url.contains('?')) {
        url += '?';
    } else {
        url += '&';
    }

    if (args[CQConstants.ResourceType] != undefined) {
        url += '' + CQConstants.ResourceType + '=' + args[CQConstants.ResourceType];
    }
    if (args[CQConstants.ResourceValue] != undefined) {
        url += '&' + CQConstants.ResourceValue + '=' + args[CQConstants.ResourceValue];
    }
    if (args[CQConstants.ParentResourceType] != undefined) {
        //url += '&' + CQConstants.ParentResourceType + '=' + args[CQConstants.ParentResourceType];
    }
    if (args[CQConstants.ParentResourceValue] != undefined) {
        //url += '&' + CQConstants.ParentResourceValue + '=' + args[CQConstants.ParentResourceValue];
    }
    if (args[CQConstants.InvitationId] != undefined) {
        url += '&' + CQConstants.InvitationId + '=' + args[CQConstants.InvitationId];
    }
    if (args[CQConstants.TaskTypeCode] != undefined) {
        url += '&' + CQConstants.TaskTypeCode + '=' + args[CQConstants.TaskTypeCode];
    }
    if (args[CQConstants.RoleId] != undefined) {
        url += '&' + CQConstants.RoleId + '=' + args[CQConstants.RoleId];
    }
    if (args[CQConstants.RoleId] != undefined) {
        url += '&' + CQConstants.PRoleId + '=' + args[CQConstants.RoleId];
    }
    return url;
}


contributionNS.ExpandAllGrid = function (control, link) {

    var Grid = $find($("[id$='" + control + "']").attr('id'));
    var Expand = $("[id$='" + link + "']");
    var state = $("[id$='ExpandedState']");
    var bool = false;
    if (Expand.text() == 'Detailed View') {
        bool = true;
        Expand.text('Summary View');
        state.val('Summary View');
    }
    else {
        Expand.text('Detailed View');
        state.val('Detailed View');
    }
    var MasterTable = Grid.get_masterTableView();
    for (var i = 0; i < MasterTable.get_dataItems().length; i++) {
        var row = MasterTable.get_dataItems()[i];
        if (bool) {
            MasterTable.expandItem(i);

        }
        else
            MasterTable.collapseItem(i);
    }
    return false;
}

contributionNS.ExpandAllGridAtPostBack = function(control, link) {

    var Grid = $find($("[id$='" + control + "']").attr('id'));
    var Expand = $("[id$='" + link + "']");
    var state = $("[id$='ExpandedState']");
    var bool = false;
    if (Expand.text() == 'Detailed View') {
        state.val('Detailed View');
    }
    else {
        bool = true;
        state.val('Summary View');
    }
    var MasterTable = Grid.get_masterTableView();
    for (var i = 0; i < MasterTable.get_dataItems().length; i++) {
        var row = MasterTable.get_dataItems()[i];
        if (bool) {
            MasterTable.expandItem(i);

        }
        else
            MasterTable.collapseItem(i);
    }
    return false;
}