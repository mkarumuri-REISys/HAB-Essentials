var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var SearchParametersModel = (function () {
                function SearchParametersModel() {
                    this.items = [];
                }
                return SearchParametersModel;
            })();
            UI.SearchParametersModel = SearchParametersModel;
            var SearchParameterModel = (function () {
                function SearchParameterModel(value, operation, modelFieldName) {
                    this.value = value;
                    this.operation = operation;
                    this.modelFieldName = modelFieldName;
                }
                return SearchParameterModel;
            })();
            UI.SearchParameterModel = SearchParameterModel;
            var SortParametersModel = (function () {
                function SortParametersModel() {
                    this.items = [];
                }
                return SortParametersModel;
            })();
            UI.SortParametersModel = SortParametersModel;
            var SortParameterModel = (function () {
                function SortParameterModel(operation, modelFieldName) {
                    this.operation = operation;
                    this.modelFieldName = modelFieldName;
                }
                return SortParameterModel;
            })();
            UI.SortParameterModel = SortParameterModel;
            var SearchModel = (function () {
                function SearchModel(SearchFields, SortFields) {
                    this.SearchFields = SearchFields;
                    this.SortFields = SortFields;
                }
                return SearchModel;
            })();
            UI.SearchModel = SearchModel;
            //Saved Search Parameters
            var SavedSearchModel = (function () {
                function SavedSearchModel(Value, UserId, Selected, SearchName, RuntimePageId, LastUpdateId, LastUpdateDate, Id, GroupName, DisplayText, CreatorId, CreatedDate) {
                    this.Value = Value;
                    this.UserId = UserId;
                    this.Selected = Selected;
                    this.SearchName = SearchName;
                    this.RuntimePageId = RuntimePageId;
                    this.LastUpdateId = LastUpdateId;
                    this.LastUpdateDate = LastUpdateDate;
                    this.Id = Id;
                    this.GroupName = GroupName;
                    this.DisplayText = DisplayText;
                    this.CreatorId = CreatorId;
                    this.CreatedDate = CreatedDate;
                }
                return SavedSearchModel;
            })();
            UI.SavedSearchModel = SavedSearchModel;
            var SavedSearchModelObservable = (function () {
                function SavedSearchModelObservable(savedSearch) {
                    this.updateModel(savedSearch);
                }
                //update the model with the search parameters.
                SavedSearchModelObservable.prototype.updateModel = function (savedSearch) {
                    if (savedSearch !== undefined && savedSearch !== null) {
                        this.Value = ko.observable(savedSearch.Value);
                        this.UserId = ko.observable(savedSearch.UserId);
                        this.Selected = ko.observable(savedSearch.Selected);
                        this.SearchName = ko.observable(savedSearch.SearchName);
                        this.RuntimePageId = ko.observable(savedSearch.RuntimePageId);
                        this.LastUpdateId = ko.observable(savedSearch.LastUpdateId);
                        this.LastUpdateDate = ko.observable(savedSearch.LastUpdateDate);
                        this.Id = ko.observable(savedSearch.Id);
                        this.GroupName = ko.observable(savedSearch.GroupName);
                        this.DisplayText = ko.observable(savedSearch.DisplayText);
                        this.CreatorId = ko.observable(savedSearch.CreatorId);
                        this.CreatedDate = ko.observable(savedSearch.CreatedDate);
                    }
                };
                return SavedSearchModelObservable;
            })();
            UI.SavedSearchModelObservable = SavedSearchModelObservable;
            //The default Search Model.
            var DefaultSearchModelObservable = (function (_super) {
                __extends(DefaultSearchModelObservable, _super);
                function DefaultSearchModelObservable(savedSearch) {
                    _super.call(this, savedSearch);
                }
                return DefaultSearchModelObservable;
            })(REISys.Platform.UI.SavedSearchModelObservable);
            UI.DefaultSearchModelObservable = DefaultSearchModelObservable;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
//# sourceMappingURL=searchpanelmodel.js.map