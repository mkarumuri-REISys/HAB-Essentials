var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../ui/layout.ts" />
/// <reference path="../externalts/telerik.d.ts" />
/// <reference path="../utilities/util.ts" />
/// <reference path="../model/searchpanelmodel.ts" />
/// <reference path="basepagecontroller.ts" />
/// <reference path="../ui/radgrid.ts" />
/// <reference path="searchpanelcontroller.ts" />
/// <reference path="basecontroller.ts" />
/// <reference path="../externalts/platformlib.ts" />
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var BaseSearchAndList;
            (function (BaseSearchAndList) {
                /*Async NestedView Configuration*/
                var NestedViewAsyncConfiguration = (function () {
                    function NestedViewAsyncConfiguration() {
                        this.EnableCustomBinding = false;
                    }
                    return NestedViewAsyncConfiguration;
                })();
                BaseSearchAndList.NestedViewAsyncConfiguration = NestedViewAsyncConfiguration;
                //Controller class for client side search and list page
                // Inorder to use client side binding ,We need to add "BindingType" in the current SearchListBasepage.
                // the base page intern can set the search panel and grid to work client side (with no postback)
                //  pages(views) using this controller shall instantiate the control within a script tag by passing the required BaseSearchAndListModel
                // model     
                var BaseSearchAndListController = (function (_super) {
                    __extends(BaseSearchAndListController, _super);
                    /**
                     * Initializes BaseSearchAndListController
                     * @param GridClientId
                     * @param nestedViewConfig
                     * @returns {}
                     */
                    function BaseSearchAndListController(GridClientId, nestedViewConfig, persistenceClientId) {
                        if (nestedViewConfig === void 0) { nestedViewConfig = null; }
                        _super.call(this);
                        this.GridClientId = GridClientId;
                        this.nestedViewConfig = nestedViewConfig;
                        this.persistenceClientId = persistenceClientId;
                        //Register  
                        this.searchPanelController = REISys.Platform.UI.searchPanel;
                        this.DefaultSortExpression = '';
                        this.OnNestedViewDataBound = new ReiSys.Utilities.PlatformEvent();
                        this.firstTimeLoad = true;
                        this.PageController = this;
                        this.fixedSearchArguments = [];
                        this.IsCustomSearch = false;
                        this.GridSearchParams = [];
                        Reisys.Platform.UI.OnNeedDataSource.subscribe(this.NeedDatSource.bind(this));
                        // OnBeforeServiceCalling raised by the rad grid before datafetch   
                        //  we need to subscribe to OnBeforeServiceCalling inorder to prepare search and filter arguments                           
                        Reisys.Platform.UI.OnBeforeServiceCalling.subscribe(this.BeforeServiceCalling.bind(this));
                        if (REISys.Platform.UI.searchPanel) {
                            //subscribe to the search panel searchclicked event            
                            REISys.Platform.UI.searchPanel.collectItemEvent.subscribe(this.SearchPanelClickHandler.bind(this));
                        }
                        this.RadGrid = new Reisys.Platform.UI.RadGrid(this.GridClientId);
                        // Set default key for client side persistence
                        BaseSearchAndListController._persistenceKey = location.href.split("/").slice(-1).toString() + this.GridClientId;
                        ReiSys.Platform.UI.BasePersistenceUtility.key = BaseSearchAndListController._persistenceKey;
                        if (REISys.Platform.UI.SearchPeristancePanelController)
                            REISys.Platform.UI.SearchPeristancePanelController.radGridClientId = this.GridClientId;
                    }
                    /**
                     * Sets custom key for client side persistence
                     * This will override the default key set in the BSL constructor
                     * @param key
                     */
                    BaseSearchAndListController.setPersistenceKey = function (key) {
                        BaseSearchAndListController._persistenceKey = key;
                        ReiSys.Platform.UI.BasePersistenceUtility.key = key;
                    };
                    /**
                     * Initializes the grid during initial page load
                     * @returns {}
                     */
                    BaseSearchAndListController.prototype.InitializeGrid = function () {
                        this.RadGrid.Update();
                    };
                    /**
                     * Collect  Search panel parameters
                     * @param sender
                     * @param args
                     * @returns {}
                     */
                    BaseSearchAndListController.prototype.BeforeServiceCalling = function (sender, args) {
                        if (args == undefined || args == null)
                            args = new Array();
                        var customSortExpression = "";
                        var tableView, grid;
                        if (REISys.Platform.UI.searchPanel) {
                            var searchPanelController = REISys.Platform.UI.searchPanel;
                            //TFS-7495 : If not triggered by search event, refresh the custom sort items in search panel control
                            if (!Reisys.Platform.UI.RadGrid.IsCustomSorted.get()) {
                                searchPanelController.refreshCustomSortSelection();
                            }
                            var searchParams = searchPanelController.collectSearch();
                            //Processes search fields
                            if (!this.IsCustomSearch) {
                                for (var x = 0; x < searchParams.SearchFields.items.length; x++) {
                                    var currentItem = searchParams.SearchFields.items[x];
                                    if (currentItem.value != "") {
                                        var value = currentItem.value;
                                        if (currentItem.operation.toUpperCase() == "LIKE") {
                                            value = "%" + value.replace(/[%|\[]/g, "[$&]") + "%";
                                        }
                                        //if (currentItem.operation.toUpperCase() == "IN") {
                                        //    value = ReiSys.Utilities.Util.AddQuotes(value); //"'" + value + "'";
                                        //}
                                        if (currentItem.value != "") {
                                            args.push(new Reisys.Platform.UI.RadGridEventArgs(currentItem.modelFieldName, value));
                                        }
                                    }
                                }
                            }
                            if (this.IsCustomSearch) {
                                args.push(new Reisys.Platform.UI.RadGridEventArgs('SearchExpressions', JSON.stringify(searchParams.SearchFields.items)));
                            }
                            //Processes sort fields 
                            for (var x = 0; x < searchParams.SortFields.items.length; x++) {
                                if (customSortExpression.length > 0) {
                                    customSortExpression = customSortExpression + ",";
                                }
                                customSortExpression = customSortExpression + searchParams.SortFields.items[x].modelFieldName + " " + searchParams.SortFields.items[x].operation;
                            }
                            //TFS-7495 : Display Sort Expression
                            if (customSortExpression !== "") {
                                searchPanelController.displayCustomSortExpression();
                            }
                        }
                        if (this.fixedSearchArguments.length > 0) {
                            Array.prototype.push.apply(args, this.fixedSearchArguments);
                        }
                        if (customSortExpression !== "")
                            args.push(new Reisys.Platform.UI.RadGridEventArgs("CustomSortExpression", customSortExpression));
                        else if (this.DefaultSortExpression !== '') {
                            grid = $telerik.findGrid(this.GridClientId);
                            tableView = grid.get_masterTableView();
                            var sortExpressions = tableView.get_sortExpressions();
                            if (sortExpressions === undefined || sortExpressions === "") {
                                args.push(new Reisys.Platform.UI.RadGridEventArgs("CustomSortExpression", this.DefaultSortExpression));
                            }
                        }
                        //TFS-7495 : Fix custom sort expression within group column
                        args = Reisys.Platform.UI.RadGrid.GetGroupBySortExpression(sender, args);
                    };
                    BaseSearchAndListController.prototype.NeedDataSourceSuccess = function (data) {
                    };
                    ///Event handler for grid Need data source event
                    // step 1. Get the search panel parameters
                    // step 2. Request the grid api for grid parameters
                    // step 3. Fetch data via web service call and pass it along to the grid api
                    BaseSearchAndListController.prototype.NeedDatSource = function (sender, args) {
                        if (args === undefined || args == null)
                            args = new Array();
                        var grid = $telerik.findGrid(this.GridClientId), serviceUrl = Reisys.Platform.UI.RadGrid.GetServiceUrl(sender), requestJson = Reisys.Platform.UI.RadGrid.GetRequestData(sender, args), loadingPanelId = Reisys.Platform.UI.RadGrid.GetLoadingPanelId(grid), promise = $.Deferred();
                        this.GridSearchParams = requestJson;
                        if (!this.firstTimeLoad) {
                            REISys.Platform.Layout.ErrorMessages.removeAllMessages();
                            REISys.Platform.Layout.ErrorMessages.setVisible(false);
                        }
                        args["promise"] = promise;
                        args["pagedData"] = true;
                        //using self for intellisense
                        var self = this;
                        ReiSys.Utilities.Util.MakeAjaxRequest(serviceUrl, requestJson, 'POST')
                            .done(function (data) {
                            self.firstTimeLoad = false;
                            if (data.StatusCode == '401') {
                                ReiSys.Platform.Controller.BaseController.RedirectToLoginPage();
                                promise.resolve(null);
                                return;
                            }
                            if (data.Message !== 'OK') {
                                promise.reject(data.Message);
                                //using timeout because the Layout library is not setup properly the first time around
                                setTimeout(function () {
                                    REISys.Platform.Layout.ErrorMessages.addMessages('There was an unexpected error while processing your request. Please try again by refreshing the page or if the problem persists, please contact Call Center.');
                                    REISys.Platform.Layout.ErrorMessages.setVisible(true);
                                }, 10);
                                return;
                            }
                            if (data != null && data != undefined) {
                                //format data first
                                self.FormatData(data);
                                //resolve promise
                                promise.resolve(data);
                                var keys = sender.get_masterTableView().get_clientDataKeyNames();
                                var itemList = jQuery.parseJSON(data.Data);
                                //todo: come up with a scheme to manage multiple client keys
                                //only get the detail view if:
                                //1) It is configured, 
                                //2) Some data was returned
                                //3) Data is paged (as apposed to when all data is requested (group panel))
                                if (itemList.length > 0 && keys.length == 1 && self.nestedViewConfig !== null
                                    && (args["IgnorePageSize"] === undefined || args["IgnorePageSize"] === false)) {
                                    var i, keyParam = [], dataKey = keys[0];
                                    for (i = 0; i < itemList.length; i++) {
                                        keyParam.push("'" + itemList[i][dataKey] + "'");
                                    }
                                    var qParam = {
                                        requestParams: {
                                            StatementName: self.nestedViewConfig.StatementName,
                                            ConfigPath: self.nestedViewConfig.ConfigPath
                                        },
                                        additionalParams: [{ Key: dataKey, Value: keyParam.join(',') }]
                                    };
                                    ReiSys.Utilities.Util.MakeAjaxRequest(serviceUrl, JSON.stringify(qParam), 'POST')
                                        .done(function (result) {
                                        var i, j, item, nestedItem, matchingItem = null, elem;
                                        var nestedData = jQuery.parseJSON(result.Data);
                                        var rowList = sender.get_masterTableView().get_dataItems();
                                        for (i = 0; i < rowList.length; i++) {
                                            item = rowList[i].get_dataItem();
                                            for (j = 0; j < nestedData.length; j++) {
                                                nestedItem = nestedData[j];
                                                if (nestedItem[dataKey] === item[dataKey]) {
                                                    matchingItem = nestedItem;
                                                    break;
                                                }
                                            }
                                            if (matchingItem !== null) {
                                                elem = rowList[i].get_element().nextSibling;
                                                if (elem == null)
                                                    continue;
                                                if (self.nestedViewConfig.EnableCustomBinding) {
                                                    self.OnNestedViewDataBound.raise(elem, { item: item, subItem: matchingItem });
                                                }
                                                else {
                                                    PlatformConsole.log('using default binding');
                                                    //bind with the incoming data
                                                    ko.applyBindings(matchingItem, elem);
                                                }
                                            }
                                            matchingItem = null;
                                        }
                                    });
                                }
                            }
                            else {
                                promise.resolve(null);
                            }
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            promise.reject(errorThrown);
                            PlatformConsole.log('error happened in basesearch and list controller ' + errorThrown);
                        });
                    };
                    //Grid's Item Data Bound Event. It binds lookup data to filter columns automatically.
                    BaseSearchAndListController.prototype.Grid_ItemDataBound = function (sender, args) {
                        //bind grid filter drop downs 
                        // raise GridIitemDataBound event so that solution controller will handle context menu adding
                    };
                    //Call this method to bind the grid with data
                    BaseSearchAndListController.prototype.BindData = function () {
                        var radGrid = new Reisys.Platform.UI.RadGrid(this.GridClientId, true);
                        radGrid.Update(); //Grid will raise beforeservicecalling and onNeedDataSourceEvent. We fetch data during OnNeedDataSource
                    };
                    BaseSearchAndListController.prototype.Refresh = function () {
                        var radGrid = new Reisys.Platform.UI.RadGrid(this.GridClientId, true);
                        radGrid.Refresh(); //Grid will raise beforeservicecalling and onNeedDataSourceEvent. We fetch data during OnNeedDataSource
                    };
                    //Called anytime a search happens in the search persistnace panel
                    BaseSearchAndListController.prototype.SearchPanelClickHandler = function (sender, args) {
                        var gridController = Reisys.Platform.UI.RadGrid.GetControllerInstance(this.GridClientId);
                        gridController.ResetGrid();
                        gridController.Update(); //Grid will raise beforeservicecalling and onNeedDataSourceEvent. We fetch data during OnNeedDataSource
                    };
                    BaseSearchAndListController.prototype.FormatData = function (data) {
                    };
                    BaseSearchAndListController.prototype.clearAllDefaultSearchParameters = function () {
                        this.searchPanelController.clearAllDefaultSearchParameters();
                    };
                    BaseSearchAndListController.prototype.addDefaultSearchParameters = function (modelFieldName, operation, fieldValue) {
                        this.searchPanelController.addDefaultSearchParameters(modelFieldName, operation, fieldValue);
                    };
                    BaseSearchAndListController.prototype.GetGridSearchParams = function () {
                        return this.GridSearchParams;
                    };
                    /**
                     * loads the persisted state to search and grid controls
                     * @param gridId - grid client Id
                     * @returns {}
                     */
                    BaseSearchAndListController.prototype.LoadPersistedState = function () {
                        ReiSys.Platform.UI.SearchPersistUtility.loadState();
                        ReiSys.Platform.UI.RadGridPersistUtility.loadState(this.GridClientId);
                    };
                    /**
                     * enables client side persistence for search and list controls
                     */
                    BaseSearchAndListController.prototype.EnablePersistedState = function () {
                        ReiSys.Platform.UI.BasePersistenceUtility.key = BaseSearchAndListController._persistenceKey;
                        if (this.searchPanelController) {
                            this.searchPanelController.enablePersistence = true;
                        }
                        Reisys.Platform.UI.RadGrid.PersistState = true;
                        this.LoadPersistedState();
                    };
                    return BaseSearchAndListController;
                }(ReiSys.Platform.Controller.BasePageController));
                BaseSearchAndList.BaseSearchAndListController = BaseSearchAndListController;
            })(BaseSearchAndList = UI.BaseSearchAndList || (UI.BaseSearchAndList = {}));
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
//# sourceMappingURL=BaseSearchAndListController.js.map