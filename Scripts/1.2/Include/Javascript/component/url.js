/// <reference path="../jquery.js" />
/// <reference path="../script.js" />
/// <reference path="../plugins/tipsy.js" />
/// <reference path="../plugins/truncate.js" />
/// <reference path="../lib/PlatformLib.js" />

// Function to create namespaces.
function newurlnamespace(namespaceString) {
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
var urlNS = newurlnamespace('REISys.Platform.Web.url');

var urlService = function () { }
urlService.Type = "POST";
urlService.Url = "";
urlService.Data;
urlService.ContentType = "application/json";
urlService.DataType = "JSON";
urlService.ProcessData;
urlService.getUrlMethod = "Platform/WebServices/UrlJWebService.svc/GetUrl";
urlService.getGuidMethod = "Platform/WebServices/UrlJWebService.svc/GetGuid";

///////////////////////////////////////////////////////////////////////////////////////
/// Test the Url Service calls.
/// 
urlNS.testUrlSvc = function () {

    var url = urlNS.GetUrl('815A84F5-726A-455A-8682-F9C0ABEEE9E6');
    console.log(url);
    return false;
}


///////////////////////////////////////////////////////////////////////////////////////
/// Return a url based on a corepredefinedpageid
/// 
urlNS.GetUrl = function (urlId) {
    if (!urlNS.IsSSL()) {
        PlatformConsole.log('urlNS.GetUrl. Enable SSL');
    }
        urlService.Url = REISys.Platform.WebsiteUrl + urlService.getUrlMethod;
        var urlData = { 'urlId': urlId };
        var data = JSON.stringify(urlData);
        var url = "";
        $.ajax({
            type: urlService.Type,
            dataType: 'JSON',
            url: urlService.Url,
            processData: false,
            contentType: urlService.ContentType,
            data: data,
            async: false,
            success: function (msg) {
                url = msg.Url;
            },
            error: function (xhr, textStatus, errorThrown) {
                PlatformConsole.log("urlNS.GetUrl error: " + urlService.Url + " " + textStatus + " - " + errorThrown + " - " + data);
            }
        });

    return url;
}

urlNS.GetGuid = function () {
    if (!urlNS.IsSSL()) {
        PlatformConsole.log('urlNS.GetGuid. Enable SSL');
    }
    urlService.Url = REISys.Platform.WebsiteUrl + urlService.getGuidMethod;
    var userData = { 'userId': REISys.Platform.CurrentUserId };
    var data = JSON.stringify(userData);
    var guid = "";
    $.ajax({
        type: urlService.Type,
        dataType: 'JSON',
        url: urlService.Url,
        processData: false,
        contentType: urlService.ContentType,
        data: data,
        async: false,
        success: function (msg) {
            guid = msg;
        },
        error: function (xhr, textStatus, errorThrown) {
            PlatformConsole.log("urlNS.GetGuid error: " + textStatus + " - " + errorThrown + " - " + data);
        }
    });

    return guid;
}

urlNS.IsSSL = function () {
    var isSSL = true;
    if ("https:" == document.location.protocol) {
        /* secure */
    } else {
        isSSL = false;
    }
    return isSSL;
}





