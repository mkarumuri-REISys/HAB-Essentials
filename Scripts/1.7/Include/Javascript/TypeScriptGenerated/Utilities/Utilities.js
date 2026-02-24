/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../Utilities/Util.ts"/>
/// <reference path="../ExternalTS/Platformlib.ts" />
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Utilities;
        (function (Utilities) {
            //class contains mapping functions to copy values to an object
            var Mapping = (function () {
                function Mapping() {
                }
                Mapping.map = function (json, environment, clazz) {
                    if (clazz) {
                        var instance = new clazz();
                        if (json != undefined) {
                            for (var prop in json) {
                                //make sure property doesn't come from prototype chain and has a value
                                if (!json.hasOwnProperty(prop) || !json[prop]) {
                                    continue;
                                }
                                //recursive - maps only properties with exactly matching names 
                                //nested objects only mapped if under the same "namespace"
                                if (json[prop] instanceof Array) {
                                    instance[prop] = Mapping.mapArray(json[prop], environment, clazz);
                                }
                                else if (typeof json[prop] === 'object') {
                                    instance[prop] = Mapping.map(json[prop], environment, environment[prop]);
                                }
                                else {
                                    instance[prop] = json[prop];
                                }
                            }
                        }
                        return instance;
                    }
                    return null;
                };
                Mapping.mapArray = function (jsonArray, environment, clazz) {
                    var items = new Array();
                    if (jsonArray != undefined) {
                        var len = jsonArray.length;
                        for (var i = 0; i < len; i++) {
                            var jsonItem = jsonArray[i];
                            if (jsonItem !== undefined && jsonItem !== null) {
                                var item = Mapping.map(jsonItem, environment, clazz);
                                items.push(item);
                            }
                        }
                    }
                    return items;
                };
                Mapping.mapToKnockout = function (inputData, instance) {
                    var items = [];
                    for (var i = 0; i < inputData.length; i++) {
                        var item = new instance();
                        for (var property in inputData[i]) {
                            var value = (inputData[i][property] == null || inputData[i][property] == 'undefined') ? "" : inputData[i][property];
                            //set the observable properties
                            if (ko.isObservable(item[property]))
                                item[property](value);
                            else
                                item[property] = value;
                        }
                        items[i] = item;
                    }
                    return items;
                };
                return Mapping;
            }());
            Utilities.Mapping = Mapping;
            //Class for common utility methods.
            var CommonUtils = (function () {
                function CommonUtils() {
                }
                CommonUtils.NewGuid = function () {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                };
                //Checks if the user web-browser is Microsoft Internet Explorere or Edege.
                CommonUtils.IsInternetExplorerOrEdge = function () {
                    return (window.navigator.userAgent.indexOf('MSIE ') > 0 || window.navigator.userAgent.indexOf('Trident/') > 0 || window.navigator.userAgent.indexOf('Edge/') > 0);
                };
                CommonUtils.formatCurrency = function (num) {
                    var sign;
                    var cents;
                    num = num.toString().replace(/\$|\,/g, '');
                    if (isNaN(num))
                        num = "0";
                    sign = (num == (num = Math.abs(num)));
                    num = Math.floor(num * 100 + 0.50000000001);
                    cents = num % 100;
                    num = Math.floor(num / 100).toString();
                    if (cents < 10)
                        cents = "0" + cents;
                    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                            num.substring(num.length - (4 * i + 3));
                    return (((sign) ? '' : '(') + '$' + num + '.' + cents + ((sign) ? '' : ')'));
                };
                CommonUtils.unformatCurrency = function (num) {
                    var noJunk = "";
                    var withDollar = "";
                    var foundDecimal = 0;
                    var foundAlphaChar = 0;
                    var foundBraces = "";
                    var sign = "";
                    var i;
                    num += "";
                    if (num == "") {
                        return (0);
                    }
                    if (num.substring(0, 1) == '(' && num.substring(num.length - 1, num.length) == ')')
                        foundBraces = '-';
                    else if (num.substring(0, 1) == '-')
                        sign = '-';
                    for (i = 0; i <= num.length; i++) {
                        var thisChar = num.substring(i, i + 1);
                        if (thisChar == ".") {
                            foundDecimal = 1;
                            noJunk = noJunk + thisChar;
                        }
                        if ((thisChar < "0") || (thisChar > "9")) {
                            if ((thisChar != "$") && (thisChar != ".") && (thisChar != ",") && (thisChar != " ") && (thisChar != ""))
                                foundAlphaChar = 1;
                        }
                        else {
                            withDollar = withDollar + thisChar;
                            noJunk = noJunk + thisChar;
                        }
                        if ((thisChar == "$") || (thisChar == ".") || (thisChar == ",")) {
                            withDollar = withDollar + thisChar;
                        }
                    }
                    if (foundDecimal) {
                        return parseFloat(foundBraces + sign + noJunk);
                    }
                    else if (noJunk.length > 0) {
                        return parseFloat(foundBraces + sign + noJunk);
                    }
                    else
                        return 0;
                };
                return CommonUtils;
            }());
            Utilities.CommonUtils = CommonUtils;
            var WebServiceUtils = (function () {
                function WebServiceUtils() {
                }
                WebServiceUtils.GetJsonFromServiceAsync = function (serviceUrl, successCallback, errorCallback) {
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: serviceUrl,
                        async: true,
                        contentType: 'application/json; charset=utf-8',
                        headers: {
                            "SetAnon": "true"
                        },
                        success: function (data) {
                            if (successCallback) {
                                successCallback(data);
                            }
                        },
                        error: function (xhr, status, error) {
                            if (errorCallback) {
                                errorCallback(xhr, status, error);
                            }
                        }
                    });
                };
                WebServiceUtils.SendXmlHttpRequest = function (url, successCallback, parameters, errorCallback, method, async, parseJSON) {
                    if (method === void 0) { method = "POST"; }
                    if (async === void 0) { async = true; }
                    if (parseJSON === void 0) { parseJSON = true; }
                    // Compatibility: IE7+, Firefox, Chrome, Opera, Safari
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState === (XMLHttpRequest.DONE || 4)) {
                            if (xmlhttp.status === 200) {
                                if (successCallback && typeof successCallback === "function")
                                    successCallback((parseJSON ? JSON.parse(xmlhttp.responseText) : xmlhttp.responseText));
                            }
                            else if (xmlhttp.status === 400) {
                                if (errorCallback && typeof errorCallback === "function")
                                    errorCallback((parseJSON ? JSON.parse(xmlhttp.responseText) : xmlhttp.responseText));
                            }
                        }
                    };
                    xmlhttp.open(method, url, async);
                    xmlhttp.setRequestHeader('Content-type', "application/json");
                    xmlhttp.setRequestHeader('Accept', '*/*');
                    xmlhttp.send((parameters ? JSON.stringify(parameters) : null));
                };
                return WebServiceUtils;
            }());
            Utilities.WebServiceUtils = WebServiceUtils;
        })(Utilities = Platform.Utilities || (Platform.Utilities = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var Browseback = (function () {
                function Browseback() {
                    this.CancelButtonId = 'BrowserBackOverlayCancelButton';
                    this.HomeButtonId = 'BrowserBackOverlayHomeButton';
                    this.TasksButtonId = 'BrowserBackOverlayPendingTaskButton';
                    this.CreateBrowseBackOverlayContent = function () {
                        var warningWindow = '';
                        warningWindow += '<div class ="reimodal loopOnBlu " id="SessionWarningDiv" style="width: 600px; height: auto;" role="dialog" aria-labelledby="windowtitleWarning" aria-describedby="overLaybodyWarning">';
                        warningWindow += '    <div role="document">';
                        warningWindow += '        <div class ="mtitle" id="windowtitleWarning">';
                        warningWindow += '            Browse Back Warning';
                        warningWindow += '        </div>';
                        warningWindow += '<a class="close" onclick="browseback.CancelBrowseBack();">';
                        warningWindow += "<img id='imgClose' src='" + REISys.Platform.WebRoot + "/platform/include/skins/" + ReiSys.Utilities.Util.ImagePath + "/images/close_1.png" + "' alt='Close Window'/></a>";
                        warningWindow += '        <div id="overLaybodyWarning">';
                        warningWindow += '            <div class ="hidden-offscreen">Beginning of dialog window.</div>';
                        warningWindow += '            <div class ="modalwindow clearfix">';
                        warningWindow += '                <div class ="confirm_left">';
                        warningWindow += '                    <div class ="confirm_warn">';
                        warningWindow += ' <span class="hidden-offscreen">Warning</span> ';
                        warningWindow += '                    </div>';
                        warningWindow += '                </div>';
                        warningWindow += '                <div class ="confirm_right">';
                        warningWindow += '                    You are trying to navigate to the previous page using browser back button.';
                        warningWindow += '                    <br />';
                        warningWindow += '                    <br />';
                        warningWindow += '                    This is a confirmation result page and it does not support going back to the previous page to make any further modifications.  You were provided with an option "Cancel" to remain on the same page or you can choose to navigate to different locations.';
                        warningWindow += '                    <br />';
                        warningWindow += '                    <br />';
                        warningWindow += '                    Please click on one of the options below to continue.';
                        warningWindow += '                </div>';
                        warningWindow += '            </div>';
                        warningWindow += '            <div class ="greyline">';
                        warningWindow += '                &nbsp;';
                        warningWindow += '            </div>';
                        warningWindow += '            <br />';
                        warningWindow += '            <p class ="button btnRight" style="float:left;">';
                        warningWindow += '<input type="button" class="hrsaSkinnedgobtn" id="' + this.CancelButtonId + '" onclick="browseback.CancelBrowseBack();" value="Cancel" >';
                        warningWindow += '            </p>';
                        warningWindow += '            <p class ="button btnRight">';
                        warningWindow += '<input type="button" class="hrsaSkinnedgobtn" id="' + this.HomeButtonId + '" onclick="browseback.NavigateToHome();" value="Go To Home" >';
                        if (BrowseBackJSON[1] != "#")
                            warningWindow += '<input type="button" class="hrsaSkinnedgobtn" id="' + this.TasksButtonId + '" onclick="browseback.NavigateToPendingTasks();" value="Go To Pending Tasks" >';
                        warningWindow += '            </p>';
                        warningWindow += '        </div>';
                        warningWindow += '    </div>';
                        warningWindow += '</div>';
                        $('#SessionWarningDivShadowbox').append(warningWindow);
                    };
                    //Removes the warning overlay window
                    this.RemoveBrowseBackOverlayContent = function () {
                        $('#SessionWarningDiv').remove();
                    };
                    //Displays the Time out overlay
                    this.ShowBrowseBackOverlay = function () {
                        this.CreateBrowseBackOverlayContent();
                        $('#SessionWarningDiv').overlay({
                            expose: {
                                color: '#000',
                                loadSpeed: 200,
                                opacity: 0.30
                            },
                            closeOnClick: false,
                            closeOnEsc: false,
                            load: true,
                            onLoad: function () {
                                $('#exposeMask').show();
                                //bring focus to the continue button 
                                //add continue button lost focus to put focus to logout button
                            },
                            onClose: function () {
                                //remove lost  focus from continue button
                            }
                        }).load();
                        $('#SessionWarningDivShadowbox').show();
                        if (!$('#exposeMask').is(":visible")) {
                            //add continue button lost focus to put focus to logout button
                            $('#SessionWarningDiv .close').remove();
                        }
                    };
                    this.CancelBrowseBack = function () {
                        $('#SessionWarningDiv').overlay().close();
                        $('#SessionWarningDivShadowbox').hide();
                        this.RemoveBrowseBackOverlayContent();
                    };
                    this.NavigateToHome = function () {
                        window.location.href = BrowseBackJSON[0];
                    };
                    this.NavigateToPendingTasks = function () {
                        window.location.href = BrowseBackJSON[1];
                    };
                }
                return Browseback;
            }());
            UI.Browseback = Browseback;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
var browseback = new ReiSys.Platform.UI.Browseback();
var history_api = typeof history.pushState !== 'undefined';
$(document).ready(function () {
    var BrowseBack = document.getElementById('cbBrowseBackDisable').checked;
    if (BrowseBack == true)
        window.location.hash = "#bb1";
    if (location.hash == '#bb1') {
        if (history_api)
            history.pushState(null, '', '#bb');
        else
            location.hash = '#bb';
    }
});
window.onhashchange = function () {
    if (location.hash == '#bb1') {
        browseback.ShowBrowseBackOverlay();
        if (history_api)
            history.pushState(null, '', '#bb');
        else
            location.hash = '#bb';
    }
};
