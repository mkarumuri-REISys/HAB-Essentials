/// <reference path="../utilities/util.ts" />
/// <reference path="..\Model\BaseModel.ts" />
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            var Dictionary = ReiSys.Platform.Utils.Dictionary;
            //The class definition that is used by all the component and page controllers.
            //All of the components and page controllers need to indirectly derive from this class.
            var BaseController = (function () {
                //The only default constructor class for this BaseController.
                function BaseController() {
                    this._clientIds = new Dictionary();
                    this.ConsoleLogFlag = false;
                }
                BaseController.RedirectToLoginPage = function () {
                    window.location.href = window.location.href;
                };
                //The logging of whatever messages you need can be called here.
                BaseController.prototype.ConsoleLog = function (message) {
                    PlatformConsole.log('using default binding');
                };
                //This is the registeration of the controller behind a control (.ascx) or .aspx file.
                BaseController.prototype.RegisterController = function (controllerInstanceId) {
                    if (!BaseController._controllers.containsKey(controllerInstanceId)) {
                        BaseController._controllers.add(controllerInstanceId, this);
                    }
                    this.ConsoleLog("BaseController.RegisterControllers(" + controllerInstanceId + ")");
                };
                //UnRegisterController here so that you're no longer interested processing to controller code.
                BaseController.prototype.UnRegisterController = function (controllerInstanceId) {
                    if (BaseController._controllers.containsKey(controllerInstanceId)) {
                        BaseController._controllers.remove(controllerInstanceId);
                    }
                    this.ConsoleLog("BaseController.UnRegisterController()");
                };
                BaseController.prototype.IsControllerRegistered = function (controllerInstanceId) {
                    return BaseController.FindController(controllerInstanceId) != null ? true : false;
                };
                BaseController.FindController = function (controllerInstanceId) {
                    var controller = null;
                    for (var i = 0; i < BaseController._controllers.length(); i++) {
                        if (BaseController._controllers._keys[i] === controllerInstanceId) {
                            controller = BaseController._controllers._values[i];
                            break;
                        }
                    }
                    return controller;
                };
                //Register Client Control Ids with this controller from the .aspx page.
                BaseController.prototype.RegisterClientIds = function (clientIds) {
                    for (var i = 0; i < clientIds.length(); i++) {
                        this._clientIds.add(clientIds._keys[i], clientIds._values[i]);
                    }
                    this.ConsoleLog("BaseController.RegisterClientIds()");
                };
                BaseController.prototype.GetAllClientIds = function () {
                    var clientInfo;
                    for (var i = 0; i < this._clientIds.length(); i++) {
                        if (i == 0) {
                            clientInfo = "Key: " + this._clientIds._keys[i];
                        }
                        else {
                            clientInfo += "Key: " + this._clientIds._keys[i];
                        }
                        clientInfo += ", Value: " + this._clientIds._values[i] + "\n";
                    }
                    return clientInfo;
                };
                //Register individual Client Id that comes from the page (.aspx) or control (.ascx)
                BaseController.prototype.RegisterClientId = function (clientIdKey, clientIdValue) {
                    if (clientIdKey != null && clientIdValue != null) {
                        this._clientIds.add(clientIdKey, clientIdValue);
                    }
                    this.ConsoleLog("BaseController.RegisterClientIds()");
                };
                //UnRegister all Client Control Ids from this controller that the .aspx page already registered.
                BaseController.prototype.UnRegisterClientIds = function () {
                    this._clientIds = null;
                    var tmpKeys = this._clientIds.keys();
                    for (var i = 0; i < tmpKeys.length; i++) {
                        this._clientIds.remove(tmpKeys[i]);
                    }
                    this.ConsoleLog("BaseController.UnRegisterClientIds()");
                };
                //UnRegister individual client Ids from the controller.
                BaseController.prototype.UnRegisterClientId = function (clientIdKey) {
                    if (this._clientIds.containsKey(clientIdKey)) {
                        this._clientIds.remove(clientIdKey);
                    }
                    this.ConsoleLog("BaseController.UnRegisterClientIds()");
                };
                //Check to see if the client Id is registered with this controller
                //before accessing it or whatever else you want to do...
                BaseController.prototype.IsClientIdRegistered = function (clientIdKey) {
                    return this.FindClientId(clientIdKey) == null ? false : true;
                };
                BaseController.prototype.FindClientId = function (clientIdKey) {
                    var clientValue = null;
                    for (var i = 0; i < this._clientIds.length(); i++) {
                        if (this._clientIds._keys[i] === clientIdKey) {
                            clientValue = this._clientIds._values[i];
                            break;
                        }
                    }
                    return clientValue;
                };
                BaseController._controllers = new Dictionary();
                return BaseController;
            }());
            Controller.BaseController = BaseController;
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
