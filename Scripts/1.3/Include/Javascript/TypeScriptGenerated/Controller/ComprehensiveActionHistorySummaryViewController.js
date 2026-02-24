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
                var CAHSummaryView = (function (_super) {
                    __extends(CAHSummaryView, _super);
                    function CAHSummaryView(controlId) {
                        _super.call(this);
                        this.controlId = controlId;
                        this.RegisterController(controlId);
                        this.model = new ComprehensiveActionHistory.SummaryProcessModel();
                        Reisys.Platform.UI.OnBeforeServiceCalling.subscribe(this.PanelFilters.bind(this));
                    }
                    //Gets the processes
                    CAHSummaryView.prototype.LoadData = function (processId, resourceTypeCode, resourceValue, clickHandler, resourceConfig) {
                        var baseUrl = ReiSys.Utilities.Util.BaseUrl + '/api/ComprehensiveActionHistoryWebAPI/';
                        var processesUrl = baseUrl
                            + 'GetProcesses/' + processId
                            + '?resourceTypeCode=' + resourceTypeCode
                            + '&resourceValue=' + resourceValue;
                        var processTypesUrl = baseUrl + 'GetProcessTypes/' + processId;
                        var processClosure = function (data) {
                            this.loadProcesses(data, resourceConfig, clickHandler);
                        }.bind(this);
                        ReiSys.Utilities.Util.MakeAjaxRequest(processesUrl, '', 'GET').done(processClosure);
                        this.loadProcessTypes(resourceConfig);
                        this.bindClearButtons();
                    };
                    //Panel Filters
                    CAHSummaryView.prototype.PanelFilters = function (sender, args) {
                        var values = this.model.selectedProcessItems();
                        if (values.length > 0) {
                            args.push(new Reisys.Platform.UI.RadGridEventArgs("SummaryPanel_ProcessTypes", values.join(',')));
                        }
                    };
                    CAHSummaryView.prototype.loadProcesses = function (data, resourceConfig, clickHandler) {
                        this.model.loadProcesses(data, resourceConfig);
                        this.model.onClick.subscribe(clickHandler);
                        var processData = document.getElementById('SummaryViewId');
                        processData.style.display = '';
                        ko.applyBindings(this.model, processData);
                    };
                    CAHSummaryView.prototype.loadProcessTypes = function (resourceConfig) {
                        this.model.loadProcessTypes(resourceConfig);
                        var filterData = document.getElementById('SummaryTypeFilters');
                        ko.applyBindings(this.model, filterData);
                    };
                    CAHSummaryView.prototype.bindClearButtons = function () {
                        ko.applyBindings(this.model, document.getElementById('summaryPanelTopButton'));
                        ko.applyBindings(this.model, document.getElementById('summaryPanelBottomButton'));
                    };
                    return CAHSummaryView;
                }(ReiSys.Platform.Controller.BaseComponentController));
                ComprehensiveActionHistory.CAHSummaryView = CAHSummaryView;
            })(ComprehensiveActionHistory = UI.ComprehensiveActionHistory || (UI.ComprehensiveActionHistory = {}));
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
