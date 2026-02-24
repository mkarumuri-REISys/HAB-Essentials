/// <reference path="../utilities/util.ts" />
/// <reference path="..\Model\BaseModel.ts" />
/// <reference path="..\Controller\BaseController.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            //The component controller that must be used and inherited by the component controllers. The
            //idea is that each control (.ascx) file could potentially have a controller behind it
            //and therefore that component controller must be derived from this class so that some
            //of the functionality can be picked up by default.
            var BaseComponentController = (function (_super) {
                __extends(BaseComponentController, _super);
                function BaseComponentController() {
                    _super.call(this);
                }
                BaseComponentController.UniqueInstanceId = 1;
                return BaseComponentController;
            }(ReiSys.Platform.Controller.BaseController));
            Controller.BaseComponentController = BaseComponentController;
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
