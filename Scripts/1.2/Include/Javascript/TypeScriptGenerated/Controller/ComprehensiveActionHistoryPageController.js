var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var ComprehensiveActionHistory;
            (function (ComprehensiveActionHistory) {
                var CAHPageController = (function (_super) {
                    __extends(CAHPageController, _super);
                    function CAHPageController(controlId, processId, resourceTypeCode, resourceValue) {
                        _super.call(this);
                        this.controlId = controlId;
                        this.processId = processId;
                        this.resourceTypeCode = resourceTypeCode;
                        this.resourceValue = resourceValue;
                        this.RegisterController(controlId);
                    }
                    CAHPageController.prototype.loadControllers = function (panelId, gridId, resourceConfig) {
                        this.summaryController = ComprehensiveActionHistory.CAHSummaryView.FindController(panelId);
                        this.gridController = ComprehensiveActionHistory.CAHGridController.FindController(gridId);
                        var clickEvent = function () { this.gridController.Refresh(); }.bind(this);
                        this.summaryController.LoadData(this.processId, this.resourceTypeCode, this.resourceValue, clickEvent, resourceConfig);
                    };
                    return CAHPageController;
                }(ReiSys.Platform.Controller.BasePageController));
                ComprehensiveActionHistory.CAHPageController = CAHPageController;
            })(ComprehensiveActionHistory = UI.ComprehensiveActionHistory || (UI.ComprehensiveActionHistory = {}));
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
