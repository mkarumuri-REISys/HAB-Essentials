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
                var BaseSearchAndList = REISys.Platform.UI.BaseSearchAndList;
                var CAHGridController = (function (_super) {
                    __extends(CAHGridController, _super);
                    function CAHGridController(args) {
                        _super.call(this, args.GridClientId, args.NestedViewConfig);
                        this.RegisterController(args.GridClientId);
                        var grid = this.RadGrid.grid;
                        if (!this.nestedViewConfig) {
                            var nestedViewConfig = new BaseSearchAndList.NestedViewAsyncConfiguration();
                            nestedViewConfig.ConfigPath = "ComprehensiveActionHistory";
                            nestedViewConfig.StatementName = "GetComprehensiveActionHistoryDetail";
                            nestedViewConfig.EnableCustomBinding = true;
                            this.nestedViewConfig = nestedViewConfig;
                        }
                        //subscribing to the row databound event
                        grid.add_rowDataBound(this.Grid_RowDataBound.bind(this));
                        this.OnNestedViewDataBound.subscribe(function (elem, args) {
                            //clean up existing bindings if any
                            ko.cleanNode(elem);
                            //bind with the incoming data
                            ko.applyBindings(args.subItem, elem);
                        });
                        this.DefaultSortExpression = "ActionTakenOn desc";
                        this.InitializeGrid();
                    }
                    CAHGridController.prototype.FormatData = function (data) {
                        var itemList = jQuery.parseJSON(data.Data);
                        for (var i = 0, len = itemList.length; i < len; i++) {
                            var item = itemList[i];
                            item["ActionTakenOn"] = item["ActionTakenOnString"];
                        }
                        data.Data = JSON.stringify(itemList);
                    };
                    CAHGridController.prototype.Grid_RowDataBound = function (sender, args) {
                        var row = args.get_item().get_element();
                        var dataItems = args.get_dataItem();
                        $('#comments', $(row).next()).html(dataItems["Comments"]);
                    };
                    return CAHGridController;
                }(BaseSearchAndList.BaseSearchAndListController));
                ComprehensiveActionHistory.CAHGridController = CAHGridController;
            })(ComprehensiveActionHistory = UI.ComprehensiveActionHistory || (UI.ComprehensiveActionHistory = {}));
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
