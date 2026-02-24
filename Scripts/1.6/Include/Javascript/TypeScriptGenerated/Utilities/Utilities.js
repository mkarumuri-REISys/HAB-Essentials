/// <reference path="../ExternalTS/jquery.d.ts" />
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
