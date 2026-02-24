/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../ExternalTS/Platformlib.ts" />
/// <reference path="../externalts/telerik.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            /**
             * Search Persist Model
             */
            var SearchPersistModel = (function () {
                function SearchPersistModel() {
                    this.searchFields = [];
                    this.searchDisplay = new SearchPersistDisplayModel();
                }
                return SearchPersistModel;
            })();
            UI.SearchPersistModel = SearchPersistModel;
            /**
             * Search Persist Display Model
             */
            var SearchPersistDisplayModel = (function () {
                function SearchPersistDisplayModel() {
                    this.sortFields = [];
                    this.sortOption = SortOption.Grid;
                }
                return SearchPersistDisplayModel;
            })();
            UI.SearchPersistDisplayModel = SearchPersistDisplayModel;
            /**
             * Search Persist Field Model
             */
            var SearchPersistFieldModel = (function () {
                function SearchPersistFieldModel(id, value) {
                    this.id = id;
                    this.value = value;
                }
                return SearchPersistFieldModel;
            })();
            UI.SearchPersistFieldModel = SearchPersistFieldModel;
            /**
             * Search Persist Save Search Model
             */
            var SearchPersistSaveSearchModel = (function () {
                function SearchPersistSaveSearchModel() {
                }
                return SearchPersistSaveSearchModel;
            })();
            UI.SearchPersistSaveSearchModel = SearchPersistSaveSearchModel;
            /**
             * Search Option
             */
            (function (SortOption) {
                SortOption[SortOption["Grid"] = 0] = "Grid";
                SortOption[SortOption["Custom"] = 1] = "Custom";
            })(UI.SortOption || (UI.SortOption = {}));
            var SortOption = UI.SortOption;
            /**
             * Utility class for persisting selected search items on client side
             */
            var SearchPersistUtility = (function (_super) {
                __extends(SearchPersistUtility, _super);
                function SearchPersistUtility() {
                    _super.call(this);
                }
                /**
                 * Loads the persisted search filter settings
                 */
                SearchPersistUtility.loadState = function () {
                    var searchModel = this.getItem("searchFilters");
                    if (searchModel === undefined || searchModel === null)
                        return false;
                    // need to verify if we need to use parse object to JSON
                    this.updateSearch(searchModel);
                    return true;
                };
                /**
                 * Saves the search filter settings in cache
                 */
                SearchPersistUtility.saveState = function (searchFields, sortFields, saveSearch, sortContainerId) {
                    var searchModel = new SearchPersistModel();
                    searchModel.searchFields = this.getSearchFields(searchFields);
                    searchModel.searchDisplay = this.getDisplayFields(sortFields, sortContainerId);
                    searchModel.savedSearch = this.getSaveSearch(saveSearch);
                    this.saveItem("searchFilters", searchModel);
                };
                /**
                 * Remove search filter settings from cache
                 */
                SearchPersistUtility.clearState = function () {
                    this.removeItem("searchFilters");
                };
                // Updates search filters
                SearchPersistUtility.updateSearch = function (searchModel) {
                    if (searchModel === undefined || searchModel === null)
                        return;
                    //update search fields value
                    var items = searchModel.searchFields;
                    var i, value;
                    if (items !== undefined && items !== null && items.length > 0) {
                        for (i = 0; i < items.length; i++) {
                            //clear search param value
                            ReiSys.Utilities.Util.SetValueForControl(items[i].id, '');
                            //assign search param value
                            value = items[i].value;
                            if (value !== undefined && value !== null) {
                                value = value.replace(/'/g, "").split("|").join(",");
                                ReiSys.Utilities.Util.SetValueForControl(items[i].id, value);
                            }
                        }
                    }
                    // update display option
                    var display = searchModel.searchDisplay;
                    if (display !== undefined && display !== null) {
                        if (display.sortOption === SortOption.Custom) {
                            $('[id$=btnSearch]').attr('CustomSortSelected', 'true');
                            if (typeof display.sortContainderId === "string")
                                REISys.Platform.UI.searchPanel.sortControlContainerId = display.sortContainderId;
                        }
                        items = display.sortFields;
                        if (items !== undefined && items !== null && items.length > 0) {
                            for (i = 0; i < items.length; i++) {
                                //clear search param value
                                ReiSys.Utilities.Util.SetValueForControl(items[i].id, '');
                                //assign search param value
                                value = items[i].value;
                                if (value !== undefined && value !== null) {
                                    value = value.replace(/'/g, "").split("|").join(",");
                                    ReiSys.Utilities.Util.SetValueForControl(items[i].id, value);
                                }
                            }
                        }
                    }
                    if (searchModel.savedSearch === undefined || searchModel.savedSearch === null)
                        return;
                    // update save search
                    var savedSearch = searchModel.savedSearch;
                    ReiSys.Utilities.Util.SetValueForControl(savedSearch.id, savedSearch.value);
                };
                // maps search fields to search persist field model
                SearchPersistUtility.getSearchFields = function (searchFields) {
                    var items = [];
                    var i;
                    // this will handle CSLF
                    for (i = 0; i < searchFields.length; i++) {
                        var item1 = searchFields[i];
                        // If controlType is text, push InputText
                        if (item1.InputControlType === 'REITextBox') {
                            items.push(new SearchPersistFieldModel(item1.InputClientID, item1.InputText));
                        }
                        else {
                            // Default - For any other control type, push InputValue
                            items.push(new SearchPersistFieldModel(item1.InputClientID, item1.InputValue));
                        }
                        if (item1.Input2ClientID)
                            items.push(new SearchPersistFieldModel(item1.Input2ClientID, item1.Input2Value));
                    }
                    return items;
                };
                // maps display fields to search persist display model
                SearchPersistUtility.getDisplayFields = function (sortFields, sortContainerId) {
                    var searchDisplay = new SearchPersistDisplayModel();
                    var i;
                    searchDisplay.sortContainderId = sortContainerId;
                    if ($('[id$=btnSearch]').attr('CustomSortSelected').toLowerCase() === "true")
                        searchDisplay.sortOption = SortOption.Custom;
                    if (sortFields !== undefined && sortFields !== null) {
                        for (i = 0; i < sortFields.length; i++) {
                            var item1 = sortFields[i];
                            //get sort field name
                            searchDisplay.sortFields.push(new SearchPersistFieldModel(item1.InputClientID, item1.InputValue));
                            // get sort order
                            searchDisplay.sortFields.push(new SearchPersistFieldModel(item1.SortDirectionClientID, item1.SortDirectionInputValue));
                        }
                    }
                    return searchDisplay;
                };
                // maps save search to search persist save search model
                SearchPersistUtility.getSaveSearch = function (saveSearch) {
                    if (saveSearch === undefined || saveSearch === null)
                        return null;
                    return new SearchPersistFieldModel(saveSearch.InputClientID, saveSearch.InputValue);
                };
                return SearchPersistUtility;
            })(ReiSys.Platform.UI.BasePersistenceUtility);
            UI.SearchPersistUtility = SearchPersistUtility;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=SearchPersistence.js.map