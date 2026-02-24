var REISys;
(function (REISys) {
    (function (Platform) {
        (function (UI) {
            var SearchPeristancePanel = (function () {
                function SearchPeristancePanel() {
                }
                SearchPeristancePanel.prototype.collectSearchParamItems = function () {
                    var searchParamControls = $('[ModelFieldName]');
                    var searchParamControlsLength = searchParamControls.length;
                    for (var i = 0; i < searchParamControlsLength; i++) {
                        var item = $(searchParamControls.get(i));
                        var operation = item.attr('Operation');
                        var modelFieldName = item.attr('modelFieldName');
                        var id = item.attr('id');
                        var value = PlatformUtil.GetControlValue(id);
                        PlatformConsole.log('op: ' + operation + ' fieldName:  ' + modelFieldName);
                        PlatformConsole.log('value: ' + value);
                    }
                };

                SearchPeristancePanel.prototype.getSearchName = function () {
                    var searchNameControl = $();
                    return searchNameControl.val();
                };
                return SearchPeristancePanel;
            })();
            UI.SearchPeristancePanel = SearchPeristancePanel;
            var SearchParamItem = (function () {
                function SearchParamItem() {
                }
                return SearchParamItem;
            })();
            UI.SearchParamItem = SearchParamItem;

            UI.searchPanel = new REISys.Platform.UI.SearchPeristancePanel();
        })(Platform.UI || (Platform.UI = {}));
        var UI = Platform.UI;
    })(REISys.Platform || (REISys.Platform = {}));
    var Platform = REISys.Platform;
})(REISys || (REISys = {}));
//# sourceMappingURL=SearchPanel.js.map
