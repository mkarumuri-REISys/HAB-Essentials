/// <reference path="../utilities/util.ts" />
/// <reference path="..\Model\BaseModel.ts" />
/// <reference path="..\Controller\BaseController.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            var BaseController = ReiSys.Platform.Controller.BaseController;
            //This is the base page controller which must be inherited by every page that 
            //has a controller behind it to process the data coming from the controls and 
            //capture the events related to the controls on the page (.aspx).
            var BasePageController = (function (_super) {
                __extends(BasePageController, _super);
                //The lone and only constructor that is used by this class.
                function BasePageController() {
                    _super.call(this);
                    this.ConsoleLog("BasePageController.constructor()");
                }
                //The handling of custom exceptions is done here and the deriver can 
                //override it to do whatever else they want to do.
                BasePageController.prototype.CustomHandleException = function (nameValuePair) {
                    var exParams = {
                        Message: nameValuePair.containsKey('Error') ? nameValuePair['Error'] : 'CustomException Error',
                        Filename: nameValuePair.containsKey('Filename') ? nameValuePair['Filename'] : 'BasePageController.js',
                        LineNo: nameValuePair.containsKey('LineNo') ? nameValuePair['LineNo'] : 28,
                        ColumnNo: nameValuePair.containsKey('ColumnNo') ? nameValuePair['ColumnNo'] : 101
                    };
                    BasePageController.LogError(exParams.Message, exParams.Filename, exParams.LineNo, exParams.ColumnNo);
                };
                //The basic handling of exception is done here and furthermore the exception
                //will be sent to the server asynchronously to record it.
                BasePageController.prototype.HandleException = function () {
                    //catch the exception first and then call
                    //CustomHandleException(...);
                    this.ConsoleLog("BaseController.HandleException()");
                };
                //This method allows the applications to catch any unhandled exception thrown and records the
                //information in on the server side. The can also be used to push module handled exceptions
                //that are processed by the controllers.
                BasePageController.LogError = function (msg, filename, lineNumber, columnNumber) {
                    var requestParams = {
                        ClientUrl: window.location.href,
                        Error: msg,
                        Filename: filename,
                        LineNo: lineNumber,
                        ColumnNo: columnNumber
                    };
                    var serviceUrl = REISys.Platform.WebsiteUrl + '/api/CustomException/LogError';
                    var requestJson = JSON.stringify(requestParams);
                    ReiSys.Utilities.Util.MakeAjaxRequest(serviceUrl, requestJson, 'POST').done(function (result) {
                        if (result) {
                            if (result === true) {
                                PlatformConsole.log('Succeesfully logged error.');
                            }
                            else {
                                PlatformConsole.log('Failed to log error.');
                            }
                            return;
                        }
                    }.bind(this)).fail(function (args) {
                        if (args.status != 401) {
                            PlatformConsole.log('Failed to log error due to service being unavailable: ' + args);
                        }
                    }.bind(this));
                    return false;
                };
                return BasePageController;
            })(BaseController);
            Controller.BasePageController = BasePageController;
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
window.onerror = ReiSys.Platform.Controller.BasePageController.LogError;
//# sourceMappingURL=basepagecontroller.js.map