var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../ExternalTS/Platformlib.ts" />
/// <reference path="../externalts/telerik.d.ts" />
/// <reference path="../Utilities/Util.ts"/>
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            /**
             * Defines Grid Setting Model
             */
            var GridPersistModel = (function () {
                function GridPersistModel() {
                }
                return GridPersistModel;
            }());
            UI.GridPersistModel = GridPersistModel;
            /**
             *  Utility class for persisting grid state on client side
             */
            var RadGridPersistUtility = (function (_super) {
                __extends(RadGridPersistUtility, _super);
                /**
                 * Initializes RadGridPersistUtility
                 */
                function RadGridPersistUtility() {
                    _super.call(this);
                }
                /**
                 * load the persisted grid settings
                 * @param id
                 * @returns {}
                 */
                RadGridPersistUtility.loadState = function (id) {
                    var item = this.getItem("grid");
                    if (item === undefined || item === null)
                        return;
                    this.updateGridSettings($telerik.findGrid(id), item);
                };
                /**
                 * Saves the grid settings in cache
                 * @param grid
                 * @returns {}
                 */
                RadGridPersistUtility.saveState = function (grid) {
                    if (grid === undefined || grid === null)
                        return;
                    var settings = this.getGridSettings(grid);
                    this.saveItem("grid", settings);
                };
                /**
                 * Remove grid setting from cache
                 * @param grid
                 * @returns {}
                 */
                RadGridPersistUtility.clearState = function () {
                    this.removeItem("grid");
                };
                // Gets current grid settings
                RadGridPersistUtility.getGridSettings = function (grid) {
                    var tableView = grid.get_masterTableView();
                    var settings = new GridPersistModel();
                    settings.pageSize = tableView.get_pageSize();
                    settings.pageIndex = tableView.get_currentPageIndex();
                    settings.sortItems = tableView.get_sortExpressions().toList();
                    settings.filterItems = tableView.get_filterExpressions().toList();
                    return settings;
                };
                // Updates grid settings
                RadGridPersistUtility.updateGridSettings = function (grid, settings) {
                    var tableView = grid.get_masterTableView();
                    // set page size
                    if (settings.pageSize !== "" || settings.pageSize !== "0") {
                        tableView.set_pageSize(settings.pageSize);
                    }
                    // set page index
                    tableView.set_currentPageIndex(settings.pageIndex);
                    // clear and set sort expressions
                    var i;
                    if (settings.sortItems !== undefined) {
                        tableView.clearSort();
                        var sortList = settings.sortItems;
                        for (i = 0; i < sortList.length; i++) {
                            var sort = sortList[i];
                            Reisys.Platform.UI.RadGrid.AddSortExpression(grid, sort.FieldName, sort.SortOrder);
                        }
                    }
                    // clear and set filter expressions
                    if (settings.filterItems !== undefined) {
                        tableView.clearFilter();
                        var filterItems = settings.filterItems;
                        for (i = 0; i < filterItems.length; i++) {
                            // Set Value for Grid Filter Control
                            ReiSys.Utilities.Util.SetValueForFilterControl(grid.get_id(), filterItems[i].ColumnUniqueName, filterItems[i].FieldValue);
                            // apply filter to grid
                            Reisys.Platform.UI.RadGrid.ApplyFilter(grid, filterItems[i].ColumnUniqueName, filterItems[i].FieldName, filterItems[i].FilterFunction, "", filterItems[i].FieldValue, filterItems[i].DataTypeName);
                        }
                    }
                };
                return RadGridPersistUtility;
            }(ReiSys.Platform.UI.BasePersistenceUtility));
            UI.RadGridPersistUtility = RadGridPersistUtility;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=RadGridPersistence.js.map