var Reisys;
(function (Reisys) {
    var UI;
    (function (UI) {
        var Framework;
        (function (Framework) {
            var BaseSearchAndListModel = (function () {
                function BaseSearchAndListModel(gridClientId, searchPanelClientId, BindableControls) {
                    this.GridClientId = gridClientId;
                    this.SearchPanelClientId = searchPanelClientId;
                }
                return BaseSearchAndListModel;
            })();
            Framework.BaseSearchAndListModel = BaseSearchAndListModel;
        })(Framework = UI.Framework || (UI.Framework = {}));
    })(UI = Reisys.UI || (Reisys.UI = {}));
})(Reisys || (Reisys = {}));
//# sourceMappingURL=BaseSearchandListModel.js.map