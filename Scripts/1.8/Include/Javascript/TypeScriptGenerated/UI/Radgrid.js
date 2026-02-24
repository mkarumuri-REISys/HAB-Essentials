/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../ExternalTS/Platformlib.ts" />
/// <reference path="../externalts/telerik.d.ts" />
/// <reference path="../Utilities/Util.ts"/>
/// <reference path="RadGridPersistence.ts"/>
var Reisys;
(function (Reisys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            //This event will be raised before Service is called
            //parameters 
            //Sender : telerik grid Note: not grid id.
            //args : args will be array of RadGridEventArgs object (Key and Value) 
            UI.OnBeforeServiceCalling = new GlobalPlatformEvent('OnBeforeServiceCalling');
            //This event will be raised after service is called
            //Parameters
            //Sender : telerik grid.
            //args : 
            UI.OnAfterServiceCalled = new GlobalPlatformEvent('OnAfterServiceCalled');
            //This event will be raised before Service is called
            //parameters 
            //Sender : telerik grid Note: not grid id.
            //args : args will be array of RadGridEventArgs object (Key and Value) 
            UI.OnAfterDataBind = new GlobalPlatformEvent('OnAfterDataBind');
            //This event will be for prior to CSLF row data binding
            UI.CSLFEventOnBeforeGridRowDataBound = new GlobalPlatformEvent('CSLFEventOnBeforeGridRowDataBound');
            //This event will be raised before Service is called
            //parameters
            //Sender : telerik grid Note: not grid id.
            //args : args will be array of RadGridEventArgs object (Key and Value)
            UI.OnNeedDataSource = new GlobalPlatformEvent('OnNeedDataSource');
            //Event raised just before databind to make any changes to the data if needed (OnAfterServiceCalled cannot be used since
            //the data is still in string format
            UI.OnBeforeDataBind = new GlobalPlatformEvent('OnBeforeDataBind');
            var RadGrid = (function () {
                function RadGrid(gridId, enablePersistence) {
                    this.gridId = gridId;
                    this.ItemSelectedEvent = new GlobalPlatformEvent('ItemSelected');
                    this.ItemUnselectedEvent = new GlobalPlatformEvent('ItemUnselected');
                    this.ClearSelectionEvent = new GlobalPlatformEvent('ClearSelection');
                    this.SelectedItemsArgs = null;
                    this._selectedItemProperty = Reisys.Platform.UI.RadGrid._selectedItemProperty;
                    this.grid = $telerik.findGrid(gridId);
                    if (this.grid !== null && this.grid !== undefined && this.grid.get_masterTableView() !== null) {
                        this.gridDataKeyNames = this.grid.get_masterTableView().get_clientDataKeyNames();
                    }
                    this.Add508Compliance();
                    if (enablePersistence !== undefined && enablePersistence)
                        Reisys.Platform.UI.RadGrid.PersistState = enablePersistence;
                }
                RadGrid.prototype.Update = function () {
                    var tableView = this.grid.get_masterTableView();
                    //PLSUP-5170
                    //had to override telerik's method for GridTableView object, because there is an issue that when the virtualitemcount is set to 0, which it is
                    //when a search returns zero results, the PageCount is set to 0, which causes the page index to not be displayed. The only thing changed for telerik's method
                    //is that it checks if the PageCount is going to be set to 0, and instead sets it to 1, because there should never be 0 pages.
                    tableView._updatePager = function () {
                        var a = Math.ceil(this.get_virtualItemCount() / this.get_pageSize());
                        if (a == 0)
                            a = 1;
                        this.PageCount = a;
                        var b = this.get_id() + "PCN";
                        var c = this.get_id() + "FIP";
                        var e = this.get_id() + "DSC";
                        var d = this.get_id() + "LIP";
                        var f = this._data.pageOfLabelClientID;
                        this._populatePagerStatsElements(b, c, d, e, f);
                        b = this.get_id() + "PCNTop";
                        c = this.get_id() + "FIPTop";
                        e = this.get_id() + "DSCTop";
                        d = this.get_id() + "LIPTop";
                        f = this._data.pageOfLabelTopClientID;
                        this._populatePagerStatsElements(b, c, d, e, f);
                        this._refreshPagerSlider();
                        this._refreshAdvancedPageTextBoxes();
                        this._refreshDropDownPager();
                        this._generateNumericPager();
                        this._setPagerVisibility(a > 1 || this._data.PagerAlwaysVisible);
                    };
                    var clientPageSize = Reisys.Platform.UI.RadGrid.GetClientPageSize(this.grid);
                    if (!Reisys.Platform.UI.RadGrid.PersistState && clientPageSize) {
                        tableView.set_pageSize(clientPageSize);
                    }
                    else if (tableView.get_pageSize() === "" || tableView.get_pageSize() === "0") {
                        tableView.set_pageSize(15);
                    }
                    Reisys.Platform.UI.RadGrid.RefreshGrid(this.grid, null);
                };
                RadGrid.prototype.Refresh = function () {
                    Reisys.Platform.UI.RadGrid.RefreshGrid(this.grid, null);
                };
                RadGrid.prototype.Add508Compliance = function () {
                    //Adds text for buttons
                    $('.rgPageFirst').val('First Page');
                    $('.rgPagePrev').val('Previous Page');
                    $('.rgPageNext').val('Next Page');
                    $('.rgPageLast').val('Last Page');
                };
                RadGrid.prototype.Rebind = function () {
                    alert('rebind');
                    this.grid.get_masterTableView().rebind();
                    alert('rebind done');
                };
                RadGrid.prototype.GetCurrentPageKeysSelect = function () {
                    var toReturn = [];
                    var items = this.grid.get_masterTableView().get_dataItems();
                    var len = items.length;
                    //build collection
                    for (var i = 0; i < len; i++) {
                        var item = items[i].get_dataItem();
                        // This change is made to check if the check-box is selectable
                        // If it is not selectable then do not add/count the data/row in the list of selectables
                        var isSelectChkBxItem = item["IsSelectable_ClientFM"];
                        if (isSelectChkBxItem) {
                            if (isSelectChkBxItem === "Yes") {
                                if (item[this._selectedItemProperty] === false) {
                                    item[this._selectedItemProperty] = true;
                                    toReturn.push(this.createKeyItem(item));
                                }
                            }
                        }
                        else {
                            if (item[this._selectedItemProperty] === false) {
                                item[this._selectedItemProperty] = true;
                                toReturn.push(this.createKeyItem(item));
                            }
                        }
                    }
                    $('.tooltip').tipTip();
                    return toReturn;
                };
                RadGrid.prototype.GetAllItemDataKeysForPage = function () {
                    var toReturn = [];
                    var items = this.grid.get_masterTableView().get_dataItems();
                    var len = items.length;
                    //build collection
                    for (var i = 0; i < len; i++) {
                        var item = items[i].get_dataItem();
                        toReturn.push(this.createKeyItem(item));
                    }
                    return toReturn;
                };
                RadGrid.prototype.GetCurrentPageKeysUnselect = function () {
                    var toReturn = [];
                    var items = this.grid.get_masterTableView().get_dataItems();
                    var len = items.length;
                    //build collection
                    for (var i = 0; i < len; i++) {
                        var item = items[i].get_dataItem();
                        if (item[this._selectedItemProperty] === true) {
                            item[this._selectedItemProperty] = false;
                            toReturn.push(this.createKeyItem(item));
                        }
                    }
                    return toReturn;
                };
                RadGrid.prototype.GeAllKeysSelect = function () {
                    var args = new Array();
                    args["IgnorePageSize"] = true;
                    // Select all items across pages - In order to select all the items across pages, we need to only get the keys of each row instead of getting all the data. Therefore, pass
                    // the following arguments to the Data service
                    args.push(new Reisys.Platform.UI.RadGridEventArgs('GroupAction_Enabled', 'true'));
                    args.push(new Reisys.Platform.UI.RadGridEventArgs('GroupAction_GetOnlyKeys', 'true'));
                    args.push(new Reisys.Platform.UI.RadGridEventArgs('GroupAction_KeyFieldName', this.gridDataKeyNames.toString()));
                    var gridDataKeyNamesLen = this.gridDataKeyNames.length;
                    var promise = $.Deferred();
                    var self = this;
                    this.GetData(args).done(function (result) {
                        // If code is running in CSLF, BeforeServiceCall event will get raised and add the following key. Therefore, when the result is converted to keyList, CSLF custom handling will
                        // get executed below under GetData done function
                        /*var fromCslf = false;
                        for (var c = 0; c < args.length; c++) {
                            if (args[c].Key === "GroupAction_FromCslf" && args[c].Value === "true") {
                                fromCslf = true;
                            }
                        }
                        
                        if (fromCslf === true) {
                            // Data returned by the DynamicDataService will return a comma separated list of values, convert to array and use the data.
                            var data = result.Data.toString().split(","), keyList = [], i;
                            for (i = 0; i < data.length; i++) {
                                keyList.push(self.createSelectAllKeysItem(data[i]));
                            }
                        }
                        else {
                        */
                        var data = jQuery.parseJSON(result.Data), keyList = [], i;
                        for (i = 0; i < data.length; i++) {
                            keyList.push(self.createKeyItem(data[i]));
                        }
                        //}
                        promise.resolve(keyList);
                    }).fail(function (error) {
                        PlatformConsole.log('GetData Failed: ' + error);
                    });
                    return promise;
                };
                RadGrid.prototype.ResetGrid = function () {
                    this.ClearSelectionEvent.raise();
                    this.SelectedItemsArgs = null;
                    var tableView = this.grid.get_masterTableView();
                    tableView.set_currentPageIndex(0);
                    tableView.clearFilter();
                    tableView.clearSort();
                    tableView.dataBind();
                    tableView.rebind();
                    // clear cache
                    if (Reisys.Platform.UI.RadGrid.PersistState)
                        ReiSys.Platform.UI.RadGridPersistUtility.clearState();
                };
                RadGrid.prototype.ViewAll = function () {
                    this.SelectedItemsArgs = null;
                    // On ViewAll, adding an argument that indicates this action. This is done in order to avoid invoking the OnBeforeServiceCall event in CSLF.
                    var args = new Array();
                    args.push(new Reisys.Platform.UI.RadGridEventArgs("GroupAction_ViewAll", "true"));
                    this.SelectedItemsArgs = args;
                    RadGrid.RefreshGrid(this.grid, null);
                };
                RadGrid.prototype.ViewSelected = function (items) {
                    var args = new Array(), keyList = [], itemList = [], i;
                    var selectedItems = items.values();
                    if (selectedItems.length > 0) {
                        var value = selectedItems[0];
                        for (var property in value) {
                            if (value.hasOwnProperty(property)) {
                                keyList.push(property);
                            }
                        }
                        if (keyList.length > 1) {
                            throw Error('Multiple client keys not supported at the moment');
                        }
                        for (i = 0; i < selectedItems.length; i++) {
                            itemList.push(ReiSys.Utilities.Util.AddQuotes(selectedItems[i][keyList[0]]));
                        }
                        args.push(new Reisys.Platform.UI.RadGridEventArgs("GroupAction_ViewSelected", "true"));
                        args.push(new Reisys.Platform.UI.RadGridEventArgs(keyList[0], itemList.join(',')));
                    }
                    this.SelectedItemsArgs = args;
                    this.grid.get_masterTableView().set_currentPageIndex(0);
                    // Refresh grid only if the current page index is 0. If the page index is anything else, telerik automatically triggers refresh grid method.
                    // Calling refresh grid twice causes issues when user clicks on "Count" link in the group panel.
                    if (this.grid.get_masterTableView().get_currentPageIndex() == 0)
                        RadGrid.RefreshGrid(this.grid, null);
                };
                RadGrid.prototype.SelectAllItemsOnPage = function () {
                    var tableView = this.grid.get_masterTableView(), items = tableView.get_dataItems(), dataItem, i;
                    for (i = 0; i < items.length; i++) {
                        // This change is made to check if the check-box is selectable
                        // If it is not selectable then do not add/count the data/row in the list of selectables
                        var isSelectChkBxItem = items[i].get_dataItem()["IsSelectable_ClientFM"];
                        if (isSelectChkBxItem) {
                            if (isSelectChkBxItem === "Yes") {
                                dataItem = items[i].get_dataItem();
                                dataItem[RadGrid._selectedItemProperty] = true;
                            }
                        }
                        else {
                            dataItem = items[i].get_dataItem();
                            dataItem[RadGrid._selectedItemProperty] = true;
                        }
                    }
                    //tableView.dataBind();
                    var gridContainer = $(this.grid.get_element());
                    gridContainer.find('.group-unselected').each(function (i, img) {
                        img.src = img.src.replace('group_minus', 'group_add');
                        img.className = img.className.replace(/\bgroup-unselected\b/, "group-selected");
                        img.alt = 'Remove item from group';
                        img.title = 'Remove item from group';
                    });
                    $('.tooltip').tipTip();
                };
                RadGrid.prototype.UnselectAllItemsOnPage = function () {
                    var tableView = this.grid.get_masterTableView(), items = tableView.get_dataItems(), dataItem, i;
                    for (i = 0; i < items.length; i++) {
                        dataItem = items[i].get_dataItem();
                        dataItem[RadGrid._selectedItemProperty] = false;
                    }
                    //tableView.dataBind();
                    var gridContainer = $(this.grid.get_element());
                    gridContainer.find('.group-selected').each(function (i, img) {
                        img.src = img.src.replace('group_add', 'group_minus');
                        img.className = img.className.replace(/\bgroup-selected\b/, "group-unselected");
                        img.alt = 'Add item to group';
                        img.title = 'Add item to group';
                    });
                    $('.tooltip').tipTip();
                };
                RadGrid.prototype.GetData = function (parameterArgs) {
                    var args = parameterArgs !== undefined && parameterArgs !== null ? parameterArgs : new Array(), promise = $.Deferred(), setPaging = false;
                    //Raise the OnBeforeServiceCalling event
                    Reisys.Platform.UI.OnBeforeServiceCalling.raise(this.grid, args);
                    if (!args.every(function (e) { return e != "NO_GET"; }))
                        return promise;
                    //Check if any of the subscribers want to provide the data
                    Reisys.Platform.UI.OnNeedDataSource.raise(this.grid, args);
                    //if data provided, use it
                    if (args["dataSource"] !== undefined
                        && args["dataSource"] !== null) {
                        setPaging = (args["pagedData"] !== true);
                        promise.resolve(args["dataSource"], setPaging);
                    }
                    else if (args["promise"] !== undefined
                        && args["promise"] !== null) {
                        //todo - combine it with the first check
                        setPaging = (args["pagedData"] !== true);
                        args["promise"].done(function (data) {
                            promise.resolve(data, setPaging);
                        }).fail(function () {
                            promise.reject.apply(promise, arguments);
                        });
                    }
                    else {
                        var serviceUrl = Reisys.Platform.UI.RadGrid.GetServiceUrl(this.grid);
                        var requestJson = Reisys.Platform.UI.RadGrid.GetRequestData(this.grid, args);
                        $.ajax({
                            type: "POST",
                            url: serviceUrl,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            data: requestJson
                        }).done(function (data) {
                            try {
                                promise.resolve(data, setPaging);
                            }
                            catch (e) {
                                RadGrid.PublishError(e);
                            }
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            RadGrid.PublishError(errorThrown);
                            PlatformConsole.log('RefreshGrid: Error occurred while making request' + errorThrown);
                            promise.reject(errorThrown);
                        });
                    }
                    return promise;
                };
                RadGrid.PublishError = function (e) {
                    //Publish error only if client exception manager is enabled for solution.
                    if (ReiSys && ReiSys.Platform && ReiSys.Platform.ExceptionManagement && ReiSys.Platform.ExceptionManagement.ExceptionManager)
                        ReiSys.Platform.ExceptionManagement.ExceptionManager.PublishException(e, true);
                };
                //Event when the data is bound to the row. Its used to create groups on the fly
                RadGrid.prototype.ToggleParentGroup = function (item, expanded) {
                    var elem = item.get_element(), tableView = this.grid.get_masterTableView(), group = $(elem).prevAll('.rgGroupHeader:first');
                    //no groups defined
                    if (group.length === 0)
                        return;
                    if (expanded) {
                        if (group[0].getElementsByClassName('rgExpand').length > 0) {
                            tableView._getGroupExpandButton(group[0]).click();
                        }
                    }
                    else {
                        if (group[0].getElementsByClassName('rgCollapse').length > 0) {
                            tableView._getGroupExpandButton(group[0]).click();
                        }
                    }
                };
                RadGrid.GetControllerInstance = function (gridId) {
                    var grid = $telerik.findGrid(gridId);
                    if (grid.REIRadGridController) {
                        return grid.REIRadGridController;
                    }
                    else {
                        var controller = new Reisys.Platform.UI.RadGrid(gridId);
                        grid.REIRadGridController = controller;
                        return controller;
                    }
                };
                RadGrid.GetSelectionStatusImage = function (isSelected) {
                    if (isSelected)
                        return 'group_add.png';
                    return 'group_minus.png';
                };
                RadGrid.GetSelectionStatusCssClass = function (isSelected) {
                    if (isSelected)
                        return 'group-selected';
                    return 'group-unselected';
                };
                RadGrid.GetComplianceText = function (isSelected) {
                    if (isSelected)
                        return 'Remove item from group';
                    return 'Add item to group';
                };
                RadGrid.OnToggleSelection = function (sender, gridId, selectedItemkey) {
                    var grid = $telerik.findGrid(gridId), tableView = grid.get_masterTableView(), items = tableView.get_dataItems(), item, dataItem, selectedDataItem, i, j, prop;
                    if (sender.src.indexOf('group_add') !== -1) {
                        sender.src = sender.src.replace('group_add', 'group_minus');
                        sender.className = sender.className.replace(/\bgroup-selected\b/, "group-unselected");
                        sender.alt = 'Add item to group';
                        sender.title = 'Add item to group';
                    }
                    else {
                        sender.src = sender.src.replace('group_minus', 'group_add');
                        sender.className = sender.className.replace(/\bgroup-unselected\b/, "group-selected");
                        sender.alt = 'Remove item from group';
                        sender.title = 'Remove item from group';
                    }
                    $('.tooltip').tipTip();
                    var keyList = [];
                    for (var property in selectedItemkey) {
                        if (selectedItemkey.hasOwnProperty(property)) {
                            keyList.push(property);
                        }
                    }
                    var len = items.length;
                    var keyListLen = keyList.length;
                    for (i = 0; i < len; i++) {
                        dataItem = items[i].get_dataItem();
                        var passed = true;
                        for (j = 0; j < keyListLen; j++) {
                            prop = keyList[j];
                            if (dataItem[prop] !== selectedItemkey[prop]) {
                                passed = false;
                                break;
                            }
                        }
                        if (passed) {
                            selectedDataItem = dataItem;
                            break;
                        }
                    }
                    if (selectedDataItem !== null) {
                        var selected = !selectedDataItem[RadGrid._selectedItemProperty];
                        selectedDataItem[RadGrid._selectedItemProperty] = selected;
                        var gridController = RadGrid.GetControllerInstance(gridId);
                        if (selected) {
                            gridController.SelectSingleItem(selectedItemkey);
                        }
                        else {
                            gridController.UnselectSingleItem(selectedItemkey);
                        }
                    }
                };
                RadGrid.prototype.SelectSingleItem = function (key) {
                    this.ItemSelectedEvent.raise(key);
                };
                RadGrid.prototype.UnselectSingleItem = function (key) {
                    this.ItemUnselectedEvent.raise(key);
                };
                RadGrid.prototype.createKeyItem = function (item) {
                    var gridDataKeyNamesLen = this.gridDataKeyNames.length;
                    var toReturn = {};
                    for (var j = 0; j < gridDataKeyNamesLen; j++) {
                        toReturn[this.gridDataKeyNames[j]] = item[this.gridDataKeyNames[j]];
                    }
                    return toReturn;
                };
                //private createSelectAllKeysItem(item: any): any {
                //    var gridDataKeyNamesLen = this.gridDataKeyNames.length;
                //    var toReturn = {};
                //    for (var j = 0; j < gridDataKeyNamesLen; j++) {
                //        toReturn[this.gridDataKeyNames[j]] = item;
                //    }
                //    return toReturn;
                //}
                RadGrid.Repaint = function (grid, result, setPagging) {
                    var i, len, data = null, tableView = grid.get_masterTableView();
                    if (result !== null && result !== undefined
                        && result.Data !== null && result.Data !== undefined) {
                        data = jQuery.parseJSON(result.Data);
                    }
                    //reset groups/aggregate if any before binding to new data
                    RadGrid.ResetGroup(grid, data === null || data.length === 0);
                    if (data !== null) {
                        Reisys.Platform.UI.OnBeforeDataBind.raise(grid, data);
                        try {
                            if (setPagging) {
                                var clientPageSize = tableView.get_pageSize(); //Reisys.Platform.UI.RadGrid.GetClientPageSize(grid);
                                var currentPageIndex = tableView.get_currentPageIndex();
                                if (result.TotalRecords > clientPageSize) {
                                    if ((result.TotalRecords - ((currentPageIndex + 1) * clientPageSize)) < 0)
                                        data = data.slice(currentPageIndex * clientPageSize);
                                    else
                                        data = data.slice((currentPageIndex * clientPageSize), clientPageSize);
                                }
                            }
                        }
                        catch (err) {
                            PlatformConsole.log('could not able to set page size' + err.message);
                        }
                        //Add selection property on the data if absent(client templating fails
                        //if the property you refer to is absent from the datasource
                        for (i = 0; i < data.length; i++) {
                            if (data[i][RadGrid._selectedItemProperty] === undefined) {
                                data[i][RadGrid._selectedItemProperty] = false;
                            }
                        }
                        tableView.set_dataSource(data);
                        tableView.set_virtualItemCount(result.TotalRecords);
                        tableView.dataBind();
                        $('.tooltip').tipTip();
                    }
                    else {
                        var tableView = grid.get_masterTableView();
                        var dataItems = tableView.get_dataItems().slice(0);
                        tableView.set_dataSource(new Array());
                        tableView.dataBind();
                        for (i = 0, len = dataItems.length; i < len; i++) {
                            var row = dataItems[i];
                            row.set_expanded(false);
                        }
                        PlatformConsole.log('either server error occurred or no data found');
                    }
                    $('.selectableItemGridCol').off('keypress');
                    $('.selectableItemGridCol').keypress(function (e) { if (e.keyCode == 13) {
                        $(this).click();
                    } });
                };
                RadGrid.ResetGroup = function (grid, hideGroups) {
                    var groupNodes = null, aggregateNodes = null, tableView = grid.get_masterTableView(), i, len, groupingFields = $(grid.get_element()).data("groupingfields"), grouppingCount;
                    var aggregateFooterNodes = Array.prototype.slice.call(grid.get_element().getElementsByClassName('rgFooter'));
                    // Hide footer if we don't have any data
                    if (aggregateFooterNodes !== undefined && aggregateFooterNodes.length > 0) {
                        if (hideGroups) {
                            aggregateFooterNodes[aggregateFooterNodes.length - 1].style.display = 'none';
                        }
                        else {
                            aggregateFooterNodes[aggregateFooterNodes.length - 1].style.display = '';
                        }
                    }
                    // if we don't find any group then don't do futher action.
                    if (groupingFields === undefined || groupingFields === null || groupingFields.length === 0)
                        return;
                    //get all existing groups
                    groupNodes = Array.prototype.slice.call(grid.get_element().getElementsByClassName('rgGroupHeader'));
                    aggregateNodes = Array.prototype.slice.call(grid.get_element().getElementsByClassName('rgFooter'));
                    grouppingCount = $(grid.get_element()).data("groupingfields").length;
                    for (i = 0; i < grouppingCount; i++) {
                        //delete the grouping key against the first element
                        delete groupNodes[i].__REIGroupKey;
                        delete groupNodes[i].__REIDataItem;
                        //todo - reset group (toggle it open and hide if no data)
                        if (groupNodes[0].getElementsByClassName('rgExpand').length > 0) {
                            tableView._getGroupExpandButton(groupNodes[0]).click();
                        }
                        if (hideGroups) {
                            groupNodes[i].style.display = 'none';
                        }
                        else {
                            groupNodes[i].style.display = '';
                        }
                    }
                    //delete all groups/aggregate
                    if (groupNodes.length > grouppingCount) {
                        for (i = grouppingCount, len = groupNodes.length; i < len; i++) {
                            var gNode = groupNodes[i]; // delete all groups except the first one that is retained as a template for future groups
                            gNode.parentNode.removeChild(gNode);
                        }
                        for (i = 0; i < aggregateNodes.length - 1; i++) {
                            var aNode = aggregateNodes[i]; // delete all aggreate except Footer
                            aNode.parentNode.removeChild(aNode);
                        }
                    }
                    if (aggregateNodes[aggregateNodes.length - 1] !== undefined) {
                        $(aggregateNodes[aggregateNodes.length - 1]).children().each(function () {
                            $(this).html("&nbsp;");
                        });
                    }
                };
                /**
                 * Add sort expression to grid
                 * @param grid
                 * @param fieldName
                 * @param sortOrder
                 * @returns {}
                 */
                RadGrid.AddSortExpression = function (grid, fieldName, sortOrder) {
                    var sortExpression = new Telerik.Web.UI.GridSortExpression();
                    sortExpression.set_fieldName(fieldName);
                    sortExpression.set_sortOrder(sortOrder);
                    grid.get_masterTableView()._sortExpressions.add(sortExpression);
                    grid.get_masterTableView()._showSortIconForField(fieldName, sortOrder);
                };
                RadGrid.RefreshGridById = function (gridId, parameterArgs) {
                    var grid = $telerik.findGrid(gridId);
                    grid.get_masterTableView().set_currentPageIndex(0);
                    this.RefreshGrid(grid, parameterArgs);
                };
                RadGrid.GetRequestData = function (grid, args) {
                    var controller = RadGrid.GetControllerInstance(grid.get_id());
                    var tableView = grid.get_masterTableView();
                    var pageSize = tableView.get_pageSize(), currentPageIndex = tableView.get_currentPageIndex() + 1 //Page index starts with 1 but telerik grid page number starts with 0.
                    , sortExpressions = tableView.get_sortExpressions().toList(), filterExpressions = tableView.get_filterExpressions().toList(), serviceUrl = grid.get_element().getAttribute("serviceUrl"), loadingPanelId = grid.get_element().getAttribute("loadingPanelId"), statementName = grid.get_element().getAttribute("statementName"), configPath = grid.get_element().getAttribute("configPath");
                    if (controller.SelectedItemsArgs !== null) {
                        for (var i = 0; i < controller.SelectedItemsArgs.length; i++) {
                            args.push(controller.SelectedItemsArgs[i]);
                        }
                    }
                    if (args["IgnorePageSize"] !== undefined && args["IgnorePageSize"] === true) {
                        currentPageIndex = 0;
                        pageSize = '0';
                    }
                    //Trim whitespace from the front and end of the text that the user passes for the filters
                    if (filterExpressions.length > 0) {
                        filterExpressions.forEach(function (e) { e.set_fieldValue(e.get_fieldValue().trim()); });
                    }
                    var requestData = {
                        "requestParams": {
                            "PageIndex": currentPageIndex,
                            "PageSize": pageSize,
                            "Token": "asdf",
                            "StatementName": statementName,
                            "ConfigPath": configPath,
                            "FilterItems": filterExpressions,
                            "SortItems": sortExpressions
                        },
                        "additionalParams": args
                    };
                    var requestJson = JSON.stringify(requestData);
                    return requestJson;
                };
                RadGrid.GetLoadingPanelId = function (grid) {
                    var loadingPanelId = grid.get_element().getAttribute("loadingPanelId");
                    return loadingPanelId;
                };
                RadGrid.GetClientPageSize = function (grid) {
                    var clientpagesize = grid.get_element().getAttribute("clientPageSize");
                    return clientpagesize;
                };
                RadGrid.GetServiceUrl = function (grid) {
                    var serviceUrl = grid.get_element().getAttribute("serviceUrl");
                    return serviceUrl;
                };
                RadGrid.IsDetailViewExpanded = function () {
                    var cookieValue = ReiSys.Utilities.CookieHandler.GetCookie(REISys.Platform.RadGridCookieName);
                    var seperater = ',';
                    var expanded = false;
                    if (cookieValue == null) {
                        cookieValue = '';
                    }
                    var localURL = '';
                    var url = window.location.href;
                    var qPos = url.indexOf('?');
                    if (qPos !== -1) {
                        url = url.substr(0, qPos);
                    }
                    var rootPos = url.indexOf(REISys.Platform.WebRoot);
                    localURL = url.substr(rootPos, url.length);
                    //Remove '/' character because having '//' in url does not match cookie value. 
                    cookieValue = cookieValue.toString().replace(/\//g, '');
                    localURL = localURL.toString().replace(/\//g, '');
                    var containsUrl = cookieValue.indexOf(localURL);
                    if (containsUrl !== -1) {
                        var positionOfValue = containsUrl + localURL.length;
                        var value = cookieValue.substring(positionOfValue + 1, positionOfValue + 2);
                        if (value === 't') {
                            expanded = true;
                        }
                    }
                    return expanded;
                };
                RadGrid.BindGrid = function (grid, data, setPagging) {
                    if (data != null && data != undefined) {
                        //get the list before refresh because the total count may reduce after setting data
                        var dataItems = grid.get_masterTableView().get_dataItems().slice(0);
                        Reisys.Platform.UI.OnAfterServiceCalled.raise(grid, data);
                        Reisys.Platform.UI.RadGrid.Repaint(grid, data, setPagging);
                        Reisys.Platform.UI.OnAfterDataBind.raise(grid, data);
                        //compare against the new list. Get the bigger list and collapse it
                        var newDataItems = grid.get_masterTableView().get_dataItems();
                        if (newDataItems.length > dataItems.length) {
                            dataItems = newDataItems;
                        }
                        //colapse all datatimes that have been left expanded(otherwise expanded details views of hidden rows
                        //are left visible[telerik bug?])
                        var dateItemLen = dataItems.length;
                        var isExpanded = Reisys.Platform.UI.RadGrid.IsDetailViewExpanded();
                        var newDataItemsLen = newDataItems.length;
                        for (var i = 0; i < dateItemLen; i++) {
                            var row = dataItems[i];
                            if (i < newDataItemsLen) {
                                row.set_expanded(isExpanded);
                            }
                            else {
                                row.set_expanded(false);
                            }
                        }
                    }
                    //Update sort and filter expression of databind
                    Reisys.Platform.UI.RadGrid.UpdateSortAndFilterExpressionDisplay(grid);
                };
                /**
                 *Show sort and filter expression on top of the grid
                 * @param grid
                 * @returns {}
                 */
                RadGrid.UpdateSortAndFilterExpressionDisplay = function (grid) {
                    var tableView = grid.get_masterTableView(), sortList, i, len, sortItem, sortModel, gridId, viewModel;
                    gridId = grid.get_element().id;
                    //if the element is missing, the display sort is not enabled
                    var sortFilterExpressionElem = document.getElementById(gridId + '_sortexpression_area');
                    if (sortFilterExpressionElem === null)
                        return;
                    var first = false;
                    //if the model is associated with the element, then get it, otherwise create a new one and associate it
                    //with the container element
                    if (sortFilterExpressionElem.ViewModel) {
                        viewModel = sortFilterExpressionElem.ViewModel;
                        viewModel.gridSortModelList([]);
                        viewModel.filterApplier(false);
                        first = false;
                    }
                    else {
                        first = true;
                        //view model for the sort\filter expression section
                        viewModel = {
                            gridSortModelList: ko.observableArray([]),
                            filterApplier: ko.observable(false),
                            //Remove specific sort item
                            removeSort: function (sortModel) {
                                var tableView = grid.get_masterTableView(), sort = tableView.get_sortExpressions().toList(), len = sort.length, i, item;
                                for (i = 0; i < len; i++) {
                                    item = sort[i];
                                    if (sortModel.fieldName === item.FieldName) {
                                        tableView._showSortIconForField(item.FieldName, Telerik.Web.UI.GridSortOrder.None);
                                        sort.splice(i, 1);
                                        break;
                                    }
                                }
                                //update grid settings stored in cache
                                if (Reisys.Platform.UI.RadGrid.PersistState) {
                                    ReiSys.Platform.UI.RadGridPersistUtility.saveState(grid);
                                }
                                //TFS-7495 : Set Custom Sort to false to refresh custom sort display
                                RadGrid.IsCustomSorted.set(false);
                                //refresh grid
                                Reisys.Platform.UI.RadGrid.RefreshGrid(grid, null);
                                return false;
                            },
                            //Remove all sort
                            removeAll: function () {
                                var tableView = grid.get_masterTableView();
                                var sort = tableView.get_sortExpressions().toList();
                                var len = sort.length;
                                for (var i = 0; i < len; i++) {
                                    var item = sort[i];
                                    tableView._showSortIconForField(item.FieldName, Telerik.Web.UI.GridSortOrder.None);
                                }
                                tableView.get_sortExpressions().clear();
                                //update grid settings stored in cache
                                if (Reisys.Platform.UI.RadGrid.PersistState) {
                                    ReiSys.Platform.UI.RadGridPersistUtility.saveState(grid);
                                }
                                //TFS-7495 : Set Custom Sort to false to refresh custom sort display
                                RadGrid.IsCustomSorted.set(false);
                                //refresh grid
                                Reisys.Platform.UI.RadGrid.RefreshGrid(grid, null);
                                return false;
                            },
                            //clear Filters
                            clearFilter: function () {
                                var filters = tableView.get_filterExpressions().toList().slice(0), i, filterCell, filterInput;
                                tableView.clearFilter();
                                //For combos clearing is not an option, the first option must be selected
                                for (i = 0; i < filters.length; i++) {
                                    ReiSys.Utilities.Util.SetValueForFilterControl(gridId, filters[i].ColumnUniqueName, "");
                                }
                                //update grid settings stored in cache
                                if (Reisys.Platform.UI.RadGrid.PersistState) {
                                    ReiSys.Platform.UI.RadGridPersistUtility.saveState(grid);
                                }
                                //refresh grid
                                Reisys.Platform.UI.RadGrid.RefreshGrid(grid, null);
                            }
                        };
                        viewModel.isVisible = ko.computed(function () {
                            //PLSUP-5124
                            //expanded the boolean expression to account for showing the custom sort expression (as opposed to the
                            //sort expression coming from the grid)
                            var sortExpArea = $("#" + grid.get_element().id + '_sortexpression_area');
                            return this.filterApplier() || this.gridSortModelList().length > 0 || sortExpArea.children().length > 1;
                        }.bind(viewModel));
                        sortFilterExpressionElem.ViewModel = viewModel;
                    }
                    //get current sort list
                    sortList = tableView.get_sortExpressions().toList();
                    //get column definition from the grid element (set on server side)
                    var columnDefinitionModel = $(grid.get_element()).data("columncollection");
                    //cannot show Sort expression if the titles have not been emitted in the markup
                    if (columnDefinitionModel === undefined)
                        return;
                    //Build sort list
                    for (i = 0, len = sortList.length; i < len; i++) {
                        //PLSUP-5124
                        //Added this code to clear the sort expression that comes from the custom sort if it exists and a
                        //sort from the grid is being applied
                        if ($("#clearAllExp") != null && $("#clearAllExp").children() != null && $("#clearAllExp").children().length > 0)
                            $("#clearAllExp").click();
                        sortItem = sortList[i];
                        var title = Reisys.Platform.UI.RadGrid.GetColumnTitleBySortExpression(grid, sortItem.FieldName, columnDefinitionModel);
                        if (title === null)
                            title = Reisys.Platform.UI.RadGrid.GetTitleByFieldName(grid, sortItem.FieldName, columnDefinitionModel);
                        if (title === null)
                            title = '[...]';
                        sortModel = new GridSortModel(sortItem.FieldName, title, sortItem.SortOrder);
                        viewModel.gridSortModelList.push(sortModel);
                    }
                    //Check for filters
                    var filterCount = tableView.get_filterExpressions().get_count();
                    viewModel.filterApplier(filterCount > 0);
                    //Apply ko binding only once
                    if (first) {
                        ko.applyBindings(viewModel, sortFilterExpressionElem);
                    }
                };
                //Get title of a column by FieldName
                RadGrid.GetColumnTitleBySortExpression = function (grid, fieldName, columnModel) {
                    var title = null;
                    if (columnModel === undefined
                        || columnModel === null)
                        return null;
                    for (var property in columnModel) {
                        if (columnModel.hasOwnProperty(property)
                            && columnModel[property].SortExpression === fieldName) {
                            title = columnModel[property].Title;
                            break;
                        }
                    }
                    return title;
                };
                //Get title of a column by FieldName
                RadGrid.GetTitleByFieldName = function (grid, fieldName, columnModel) {
                    if (columnModel === undefined
                        || columnModel === null)
                        return null;
                    var column = Reisys.Platform.UI.RadGrid.GetColumnByFieldName(grid, fieldName);
                    if (column === null)
                        return null;
                    var uniqueName = column.get_uniqueName();
                    if (columnModel[uniqueName]) {
                        return columnModel[uniqueName].Title;
                    }
                    else {
                        return null;
                    }
                };
                //Get column by FieldName
                RadGrid.GetColumnByFieldName = function (grid, fieldName) {
                    var tableView = grid.get_masterTableView(), columnArr = tableView.get_columns(), i, len, col;
                    for (i = 0, len = columnArr.length; i < len; i++) {
                        col = columnArr[i];
                        if (col.get_dataField() === fieldName) {
                            return col;
                        }
                    }
                    return null;
                };
                /**
                 * Refreshes the data grid
                 * @param grid
                 * @param parameterArgs
                 * @returns {}
                 */
                RadGrid.RefreshGrid = function (grid, parameterArgs) {
                    var args = parameterArgs !== undefined && parameterArgs !== null ? parameterArgs : new Array(), gridController = RadGrid.GetControllerInstance(grid.get_id());
                    var loadingPanelId = Reisys.Platform.UI.RadGrid.GetLoadingPanelId(grid);
                    Reisys.Platform.UI.RadGrid.ShowHideLoadingPanel(loadingPanelId, grid.ClientID, true);
                    //get the promise for data
                    gridController.GetData(args).then(function (data, setPaging) {
                        RadGrid.BindGrid(gridController.grid, data, setPaging);
                    }).fail(function (error) {
                        PlatformConsole.log('GetData Failed: ' + error);
                        RadGrid.Repaint(gridController.grid, null, false);
                    }).always(function () {
                        Reisys.Platform.UI.RadGrid.ShowHideLoadingPanel(loadingPanelId, grid.ClientID, false);
                    });
                };
                RadGrid.ShowHideLoadingPanel = function (loadingPanelId, gridId, show) {
                    if (loadingPanelId && gridId && $find(loadingPanelId)) {
                        if (show) {
                            $find(loadingPanelId).show(gridId);
                        }
                        else {
                            $find(loadingPanelId).hide(gridId);
                        }
                    }
                };
                RadGrid.PFMRadGridCommand = function (sender, args) {
                    args.set_cancel(true);
                    var commandName = args.get_commandName();
                    if (commandName == "Delete")
                        return;
                    var tableView = sender.get_masterTableView();
                    var pageSize = tableView.get_pageSize(), currentPageIndex = tableView.get_currentPageIndex() + 1 //Page index starts with 1 but telerik grid page number starts with 0.
                    , sortExpressions = sender.get_masterTableView().get_sortExpressions().toList(), filterExpressions = sender.get_masterTableView().get_filterExpressions().toList();
                    if (commandName == "PageSize") {
                        var size = args.get_commandArgument();
                        tableView.set_pageSize(size);
                        if (pageSize == size)
                            return;
                        pageSize = size;
                        var dataItems = tableView.get_dataItems();
                        for (var i = 0; i < dataItems.length; i++) {
                            tableView.deleteItem(dataItems[i].get_element());
                        }
                    }
                    if (commandName == "Filter") {
                        //PFM-5806
                        var command = args.get_commandArgument();
                        try {
                            var com = command.split('|');
                            if (com[2] === '?NoFilter') {
                                var inputControl = 'input[id*=' + com[0] + '_dateInput]';
                                var inputDatePicker = $($(inputControl)[0]);
                                if (inputDatePicker != undefined) {
                                    inputDatePicker.val('');
                                }
                            }
                        }
                        catch (err) {
                            PlatformConsole.log('PFMRadGridCommand.' + err);
                        }
                        currentPageIndex = 0;
                    }
                    //PLSUP-5037: Focus is lost when clicking on sort arrows
                    if (commandName === "Sort") {
                        //Get the id of one of the sort arrows associated with the column currently being sorted by
                        var AscArrowId = tableView.get_id() + "__" + args.get_commandArgument() + "__SortAsc";
                        if ($('#' + AscArrowId).length) {
                            //Give focus to the sorted column's header
                            $('#' + AscArrowId).siblings(':first').focus();
                        }
                        //TFS-7495 : Set Custom Sort to false to refresh custom sort display
                        RadGrid.IsCustomSorted.set(false);
                    }
                    if (commandName === "Page"
                        || commandName === "PageSize"
                        || commandName === "Filter"
                        || commandName === "Sort") {
                        //store grid settings in cache
                        if (Reisys.Platform.UI.RadGrid.PersistState) {
                            ReiSys.Platform.UI.RadGridPersistUtility.saveState(sender);
                        }
                        //refresh grid
                        Reisys.Platform.UI.RadGrid.RefreshGrid(sender, null);
                    }
                };
                /**
                 * Handles combo filter event
                 * @param filterClientId
                 * @param dataField
                 * @param dataKeyField
                 * @param columnUniqueName
                 * @param gridId
                 * @returns {}
                 */
                RadGrid.ComboFilterHandler = function (filterClientId, dataField, dataKeyField, columnUniqueName, gridId) {
                    //find grid
                    var grid = $telerik.findGrid(gridId);
                    //find filter control
                    var filterCtrl = $find(filterClientId);
                    //get current value
                    var filterValue = filterCtrl.get_value();
                    var filterText = filterCtrl.get_text();
                    //combo filters are always EqualTo filter functions
                    var filterFunction = Telerik.Web.UI.GridFilterFunction.EqualTo;
                    RadGrid.ApplyFilter(grid, columnUniqueName, dataField, filterFunction, filterText, filterValue);
                    grid.get_masterTableView().set_currentPageIndex(0);
                    //update grid settings stored in cache
                    if (Reisys.Platform.UI.RadGrid.PersistState) {
                        ReiSys.Platform.UI.RadGridPersistUtility.saveState(grid);
                    }
                    //refresh grid
                    Reisys.Platform.UI.RadGrid.RefreshGrid(grid, null);
                    return false;
                };
                RadGrid.SelectableColumnFilterHandler = function (filterClientId, columnUniqueName, gridId) {
                    var grid = $telerik.findGrid(gridId);
                    var filterCtrl = $find(filterClientId);
                    var filterText = filterCtrl.get_text();
                    var selectionValue = filterCtrl.get_value();
                    //todo - replace it with a better way of finding the group panel control
                    if (!window.masterPanel) {
                        PlatformConsole.log('masterPanel not setup');
                        return;
                    }
                    var masterPanel = window.masterPanel;
                    var selectedItems = masterPanel.getItems().values();
                    var controller = RadGrid.GetControllerInstance(gridId);
                    var keys = controller.gridDataKeyNames;
                    //no keys defined
                    if (keys.length == 0)
                        return;
                    //multiple keys not supported at the moment
                    if (keys.length > 1)
                        return;
                    var dataField = keys[0];
                    var filterValue = '';
                    if (selectionValue !== '-1') {
                        var argList = [];
                        for (var i = 0; i < selectedItems.length; i++) {
                            argList.push(selectedItems[i][keys[0]]);
                        }
                        filterValue = argList.join(',');
                        dataField += (selectionValue === '2' ? '_unselected' : '_selected');
                    }
                    RadGrid.ApplyFilter(grid, columnUniqueName, dataField, Telerik.Web.UI.GridFilterFunction.Custom, filterText, filterValue);
                    //update grid settings stored in cache
                    if (Reisys.Platform.UI.RadGrid.PersistState) {
                        ReiSys.Platform.UI.RadGridPersistUtility.saveState(grid);
                    }
                    //refresh grid
                    Reisys.Platform.UI.RadGrid.RefreshGrid(grid, null);
                    return false;
                };
                RadGrid.ApplyFilter = function (grid, columnUniqueName, dataField, filterFunction, filterText, filterValue, dataTypeName) {
                    var i, filterItem, tableView = grid.get_masterTableView(), filterExpressions = tableView.get_filterExpressions(), filterCount = filterExpressions.get_count();
                    //make sure that existing one is removed!
                    var filterArr = [];
                    for (i = 0; i < filterCount; i++) {
                        filterItem = filterExpressions.getItem(i);
                        if (filterItem.get_fieldName() === dataField
                            || filterItem.get_columnUniqueName() === columnUniqueName) {
                            filterArr.push(filterItem);
                        }
                    }
                    if (filterArr.length > 0) {
                        for (i = 0; i < filterArr.length; i++) {
                            filterExpressions.remove(filterArr[i]);
                        }
                    }
                    //following values are considered as the 'All' option
                    if (filterValue === '-1' || filterValue === '' || filterValue === 'All' || filterValue === '00000000-0000-0000-0000-000000000000') {
                        return;
                    }
                    //add a new filter
                    var filterExpression = new Telerik.Web.UI.GridFilterExpression();
                    var column = tableView.getColumnByUniqueName(columnUniqueName);
                    column.set_filterFunction("EqualTo");
                    filterExpression.set_fieldName(dataField);
                    filterExpression.set_fieldValue(filterValue);
                    filterExpression.set_filterFunction(filterFunction);
                    filterExpression.set_columnUniqueName(columnUniqueName);
                    if (dataTypeName)
                        filterExpression.set_dataTypeName(dataTypeName);
                    //grid.get_masterTableView()._updateFilterControlValue(filterValue, columnUniqueName, filterFunction);
                    filterExpressions.add(filterExpression);
                };
                //Create Row event
                RadGrid.OnRowCreated = function (sender, eventArgs) {
                    var grid = sender;
                    var index = eventArgs.get_itemIndexHierarchical();
                    //If template copying from the first row is enabled, then proceed
                    if (Reisys.Platform.UI.RadGrid.CopyTemplateFromFirstRowIsEnabled(grid)) {
                        Reisys.Platform.UI.RadGrid.CopyTemplateFromFirstRow(grid, eventArgs);
                    }
                };
                //Check if applying Template from the first row is enabled
                RadGrid.CopyTemplateFromFirstRowIsEnabled = function (grid) {
                    return grid.get_element().getAttribute("copyTemplateFromFIrstRow")
                        === 'true';
                };
                //Apply template from the first row including nested view
                RadGrid.CopyTemplateFromFirstRow = function (grid, rowCreatedEventArgs) {
                    var templateRow = grid.get_masterTableView().get_dataItems()[0].get_element();
                    var index = rowCreatedEventArgs.get_itemIndexHierarchical();
                    //skip the first row (template)
                    if (index === '0') {
                        return;
                    }
                    var currentRow = rowCreatedEventArgs.get_gridDataItem().get_element();
                    var i, j, templateCol = null;
                    for (i = 0; i < currentRow.cells.length; i++) {
                        //if it already has the expanded column information, all the required template info is already there
                        if (Reisys.Platform.UI.RadGrid.HasClass(currentRow.cells[i], 'rgExpandCol')) {
                            return;
                        }
                    }
                    for (i = 0; i < templateRow.cells.length; i++) {
                        //if it already has the expanded column information, all the required template info is already there
                        if (Reisys.Platform.UI.RadGrid.HasClass(templateRow.cells[i], 'rgExpandCol')) {
                            templateCol = templateRow.cells[i];
                            break;
                        }
                    }
                    //if the first row has a nested view, then copy a nested view over
                    if (templateCol !== null) {
                        //add nested view if any
                        var templateNestedView = templateRow.nextSibling, nestedRow;
                        if (!Reisys.Platform.UI.RadGrid.HasClass(templateNestedView, 'rgExpandCol')) {
                            nestedRow = templateNestedView.cloneNode(true);
                            if (currentRow.nextSibling) {
                                currentRow.parentNode.insertBefore(nestedRow, currentRow.nextSibling);
                            }
                            else {
                                currentRow.parentNode.appendChild(nestedRow);
                            }
                            //the row does not collapse until you expand it first(?)
                            rowCreatedEventArgs.get_gridDataItem().set_expanded(true);
                        }
                    }
                    for (i = 0; i < templateRow.cells.length; i++) {
                        templateCol = templateRow.cells[i];
                        for (j = 0; j < templateCol.attributes.length; j++) {
                            var a = templateCol.attributes[j];
                            $(currentRow.cells[i]).attr(a.name, a.value);
                        }
                        for (j = 0; j < templateCol.children.length; j++) {
                            currentRow.cells[i].appendChild(templateCol.children[j].cloneNode(true));
                        }
                    }
                };
                //todo - move this to a more generic place
                RadGrid.HasClass = function (elem, className) {
                    return elem.className !== undefined
                        && elem.className !== null
                        && elem.className.match(new RegExp('\\b' + className + '\\b')) !== null;
                };
                //Event when the data is bound to the row. Its used to create groups on the fly
                RadGrid.OnRowDatabound = function (sender, eventArgs) {
                    var item = eventArgs.get_item(), elem = item.get_element(), dataItem = eventArgs.get_dataItem(), itemIndex = item.get_itemIndexHierarchical(), footer = $(sender.get_element().getElementsByClassName("rgFooter")), len, i;
                    var columnCollections = $(sender.get_element()).data("columncollection");
                    RadGrid.ApplyGridColumnFormat(columnCollections, elem);
                    var groupByExpressionList = $(sender.get_element()).data("groupingfields");
                    if (groupByExpressionList === undefined || groupByExpressionList === null || groupByExpressionList.length === 0)
                        return;
                    var group = $(elem).prevAll('.rgGroupHeader').slice(-groupByExpressionList.length);
                    len = group.length - 1;
                    // Insert Group/Aggregate Template for multi level Groupping
                    for (i = 0; i < groupByExpressionList.length; i++) {
                        var templateRow = group[len];
                        var groupKey = RadGrid.GetGroupKey(dataItem, groupByExpressionList[i]);
                        var newGroup = null;
                        if (templateRow.__REIGroupKey === undefined) {
                            newGroup = templateRow;
                            templateRow.__REIDataItem = [];
                        }
                        else {
                            //no need to create a new group
                            if (templateRow.__REIGroupKey === groupKey) {
                                len--;
                                templateRow.__REIDataItem.push(dataItem); // Insert data though for aggregation to calculate later
                                continue;
                            }
                            if (i === 0) {
                                var j;
                                for (j = len - 1; j >= 0; j--) {
                                    // For new parent group we need to reset GroupKey for all child.
                                    group[j].__REIGroupKey = '';
                                    // For new parent group then we need to insert aggregate for all previous child group
                                    if (group[j].__REIDataItem.length > 0 && RadGrid.IsAggregateSet(columnCollections) && footer !== undefined && footer.length > 0) {
                                        var childFooterRow = footer[0].cloneNode(true);
                                        childFooterRow = RadGrid.ApplyAggregate(childFooterRow, columnCollections, group[j].__REIDataItem);
                                        elem.parentNode.insertBefore(childFooterRow, elem);
                                    }
                                    group[j].__REIDataItem = [];
                                }
                            }
                            newGroup = templateRow.cloneNode(true);
                            if (footer !== undefined && footer.length > 0) {
                                var footerRow = footer[0].cloneNode(true);
                                // Calculate aggregation and insert
                                if (templateRow.__REIDataItem.length > 0 && RadGrid.IsAggregateSet(columnCollections)) {
                                    footerRow = RadGrid.ApplyAggregate(footerRow, columnCollections, templateRow.__REIDataItem);
                                    elem.parentNode.insertBefore(footerRow, elem);
                                }
                            }
                            // Insert Group
                            elem.parentNode.insertBefore(newGroup, elem);
                            templateRow.__REIDataItem = [];
                        }
                        templateRow.__REIGroupKey = groupKey;
                        templateRow.__REIDataItem.push(dataItem);
                        // Update group header text
                        newGroup.getElementsByClassName('RadGridGroupP')[0].innerHTML = RadGrid.GetGroupHeader(dataItem, groupByExpressionList[i]);
                        len--;
                    }
                };
                RadGrid.ApplyGridColumnFormat = function (gridColumns, element) {
                    var obj;
                    for (obj in gridColumns) {
                        var columnItem = gridColumns[obj];
                        if (columnItem.hasOwnProperty("NumericType")) {
                            if (columnItem["NumericType"] !== null) {
                                //todo: need to do same for percentage and date if require
                                if (columnItem["NumericType"].toLowerCase() === "currency") {
                                    var value = $(element).find('td').not("[class]")[columnItem["OrderIndex"]].innerHTML;
                                    var answerValue = ReiSys.Platform.Utilities.CommonUtils.formatCurrency(value);
                                    $(element).find('td').not("[class]")[columnItem["OrderIndex"]].innerHTML = answerValue;
                                }
                            }
                        }
                    }
                };
                RadGrid.ApplyAggregateFormat = function (columnItem, aggregateValue) {
                    if (columnItem["NumericType"] !== null) {
                        //todo: need to do same for percentage and date if require
                        if (columnItem["NumericType"].toLowerCase() === "currency")
                            return ReiSys.Platform.Utilities.CommonUtils.formatCurrency(aggregateValue);
                    }
                    return aggregateValue;
                };
                /// Return true if Aggregate is set in Grid
                RadGrid.IsAggregateSet = function (gridColumns) {
                    var obj, isAggregate = false;
                    for (obj in gridColumns) {
                        var columnItem = gridColumns[obj];
                        if (columnItem.hasOwnProperty("Aggregate")) {
                            if (columnItem["Aggregate"] !== "None")
                                return true;
                        }
                    }
                    return isAggregate;
                };
                //Cacluate based on column configuration and return aggregation template row with all calculation
                RadGrid.ApplyAggregate = function (footerTemplateRow, gridColumns, dataItems) {
                    var obj, sum, count, avg;
                    for (obj in gridColumns) {
                        var columnItem = gridColumns[obj];
                        if (columnItem.hasOwnProperty("Aggregate")) {
                            var sum = 0, count = 0, avg = 0;
                            switch (columnItem["Aggregate"]) {
                                case "Sum":
                                    sum = RadGrid.AggregateSum(columnItem, dataItems);
                                    //Note: if it is sum then and then we are applying format, currently this format is specific for currency but in
                                    // future if we extend this functionality then we may need to revisit this logic as it is using "NumericType" to format
                                    // aggregate, ideally aggregate should have separate property to achive this.
                                    var answer = RadGrid.ApplyAggregateFormat(columnItem, sum);
                                    $(footerTemplateRow).find('td').not("[class]")[columnItem["OrderIndex"]].innerHTML = RadGrid.GetAggregateText(columnItem, answer);
                                    //$(footerTemplateRow).find('td').not(".rgGroupCol")[columnItem["OrderIndex"]].innerHTML = RadGrid.GetAggregateText(columnItem, sum);
                                    //$(footerTemplateRow).find('td:eq(' + columnItem["OrderIndex"] + ')').html(RadGrid.GetAggregateText(columnItem, sum));
                                    break;
                                case "Count":
                                    count = RadGrid.AggregateCount(dataItems);
                                    $(footerTemplateRow).find('td').not("[class]")[columnItem["OrderIndex"]].innerHTML = RadGrid.GetAggregateText(columnItem, count);
                                    break;
                                case "Avg":
                                    avg = RadGrid.AggregateAvg(columnItem, dataItems);
                                    var avgAnswer = RadGrid.ApplyAggregateFormat(columnItem, avg);
                                    $(footerTemplateRow).find('td').not("[class]")[columnItem["OrderIndex"]].innerHTML = RadGrid.GetAggregateText(columnItem, avgAnswer);
                                    break;
                            }
                        }
                    }
                    return footerTemplateRow;
                };
                //Calcuate aggregation sum based on data
                RadGrid.AggregateSum = function (columnItem, dataItems) {
                    var sum = 0, data;
                    for (data = 0; data < dataItems.length; data++) {
                        if (columnItem.hasOwnProperty("DataField")) {
                            sum += parseInt(dataItems[data][columnItem["DataField"]]);
                        }
                    }
                    return sum;
                };
                RadGrid.AggregateCount = function (dataItems) {
                    return dataItems.length;
                };
                RadGrid.AggregateAvg = function (columnItem, dataItems) {
                    var sum, count, avg = 0;
                    sum = RadGrid.AggregateSum(columnItem, dataItems);
                    count = RadGrid.AggregateCount(dataItems);
                    avg = +((sum / count).toFixed(2));
                    return avg;
                };
                RadGrid.GetAggregateText = function (columnItem, aggregateValue) {
                    var text;
                    if (columnItem.hasOwnProperty("OrderIndex") && columnItem.hasOwnProperty("FooterText")) {
                        text = columnItem["FooterText"] + aggregateValue;
                    }
                    return text;
                };
                RadGrid.GetGroupKey = function (dataItem, groupDetail) {
                    var i, len, key = [];
                    for (i = 0, len = groupDetail.GroupFields.length; i < len; i++) {
                        key.push(groupDetail.GroupFields[i].Name + ':' + dataItem[groupDetail.GroupFields[i].Name]);
                    }
                    return key.join(',');
                };
                RadGrid.GetGroupHeader = function (dataItem, groupDetail) {
                    var i, len, display = [];
                    for (i = 0, len = groupDetail.SelectFields.length; i < len; i++) {
                        var groupLabel = groupDetail.SelectFields[i].Alias;
                        if (groupDetail.SelectFields[i].HeaderText !== undefined && groupDetail.SelectFields[i].HeaderText !== null)
                            groupLabel = groupDetail.SelectFields[i].HeaderText;
                        display.push(groupLabel + ": <span>" + dataItem[groupDetail.SelectFields[i].Name] + "</span>");
                    }
                    return display.join(', ');
                };
                //Event when the data binding has been completed. It is used to create a hidden group
                //after the last visible row to make sure that unbound rows remain hidden
                RadGrid.OnDatabound = function (sender, eventArgs) {
                    var tableView = sender.get_masterTableView(), dataItems = tableView.get_dataItems();
                    if (dataItems.length == 0)
                        return;
                    var lastDataItem = dataItems[dataItems.length - 1], elem = lastDataItem.get_element();
                    var groupByExpressionList = $(sender.get_element()).data("groupingfields");
                    var columnCollections = $(sender.get_element()).data("columncollection");
                    //if (groupByExpressionList === undefined || groupByExpressionList === null || groupByExpressionList.length === 0)
                    //    return;
                    if (groupByExpressionList !== undefined && groupByExpressionList !== null && groupByExpressionList.length > 0) {
                        var group = $(elem).prevAll('.rgGroupHeader').slice(-groupByExpressionList.length);
                        //no groups defined (atleast the first row group show be there
                        //if (group.length === 0)
                        //    return;
                        var templateRow = group[groupByExpressionList.length - 1];
                        var newGroup = templateRow.cloneNode(true);
                        newGroup.__REIGroupKey = '__LASTGROUP__';
                        if ($(elem).children().hasClass("rgExpandCol"))
                            elem.parentNode.insertBefore(newGroup, elem.nextSibling.nextSibling);
                        else
                            elem.parentNode.insertBefore(newGroup, elem.nextSibling);
                        newGroup.getElementsByClassName('RadGridGroupP')[0].innerHTML = '';
                        newGroup.style.display = 'none';
                    }
                    if (RadGrid.IsAggregateSet(columnCollections)) {
                        if (groupByExpressionList !== undefined && groupByExpressionList !== null && groupByExpressionList.length > 0) {
                            var footerRow = $(sender.get_element().getElementsByClassName("rgFooter"))[0];
                            for (var i = groupByExpressionList.length - 1; i >= 0; i--) {
                                var newFooter = footerRow.cloneNode(true);
                                newFooter = RadGrid.ApplyAggregate(newFooter, columnCollections, group[i].__REIDataItem);
                                if ($(elem).children().hasClass("rgExpandCol"))
                                    elem.parentNode.insertBefore(newFooter, elem.nextSibling.nextSibling);
                                else
                                    elem.parentNode.insertBefore(newFooter, elem.nextSibling);
                            }
                        }
                        // Apply Aggreate on main Footer
                        var mainFooter = $(sender.get_element()).find(".rgFooter:last");
                        var alldataItems = [];
                        // Simply assume we have all data on one page and calcuate main aggregate
                        if (tableView.CurrentPageIndex === 0 && tableView.get_pageSize() > dataItems.length) {
                            dataItems.forEach(function (item) {
                                alldataItems.push(item.get_dataItem());
                            });
                            RadGrid.ApplyAggregate(mainFooter, columnCollections, alldataItems);
                        }
                        else {
                            var gridController = RadGrid.GetControllerInstance(sender.get_id());
                            var args = new Array();
                            args["IgnorePageSize"] = true;
                            //get the promise for data
                            gridController.GetData(args).then(function (data, setPaging) {
                                alldataItems = jQuery.parseJSON(data.Data);
                                RadGrid.ApplyAggregate(mainFooter, columnCollections, alldataItems);
                            }).fail(function (error) {
                                PlatformConsole.log('GetData Failed: ' + error);
                            });
                        }
                    }
                };
                RadGrid.OnGridCreating = function (sender, eventArgs) {
                    //move the 'NoRecordsTemplate' to the beginning of the TBODY to avoid influence by groups
                    var grid = sender.get_element();
                    var emptyRow = grid.getElementsByClassName('rgNoRecords');
                    if (emptyRow.length > 0) {
                        emptyRow[0].parentNode.insertBefore(emptyRow[0], emptyRow[0].parentNode.firstChild);
                    }
                };
                /**
                 * Gets sort expressions from the grid's group by expression list
                 * @param sender
                 * @param args
                 */
                RadGrid.GetGroupBySortExpression = function (sender, args) {
                    var groupExpression = [];
                    var groupByExpressionList = $(sender.get_element()).data("groupingfields");
                    if (groupByExpressionList === undefined || groupByExpressionList === null || groupByExpressionList.length === 0)
                        return args;
                    var j;
                    var i;
                    for (i = 0; i < groupByExpressionList.length; i++) {
                        var groupByExpression = groupByExpressionList[i];
                        for (j = 0; j < groupByExpression.GroupFields.length; j++) {
                            if (groupByExpression.GroupFields[j].Sort !== undefined && groupByExpression.GroupFields[j].Sort !== '') {
                                if (groupExpression.length === 0) {
                                    groupExpression.push(groupByExpression.GroupFields[j].Name + ' ' + groupByExpression.GroupFields[j].Sort);
                                }
                                else {
                                    groupExpression.push(groupByExpression.GroupFields[j].Name + ' ' + groupByExpression.GroupFields[j].Sort);
                                }
                            }
                        }
                    }
                    //check if custom expression is set
                    var index;
                    var customSortIndex = -1;
                    for (i = 0; i < args.length; i++) {
                        if (args[i].Key.toLowerCase() === "customsortexpression") {
                            customSortIndex = i;
                            break;
                        }
                    }
                    if (customSortIndex > -1) {
                        var sortObj = args[customSortIndex];
                        var sortItems = sortObj.Value.split(', ');
                        var customSortItems = [];
                        for (j = 0; j < sortItems.length; j++) {
                            var expr = sortItems[j].split(' ');
                            //TFS-7495 : Let's set Sort Expr to Ascending if nothing is defined 
                            if (expr[1] === undefined || expr[1] === null)
                                expr[1] = "ASC";
                            if (jQuery.inArray(expr[0] + ' ASC', groupExpression) > -1 || jQuery.inArray(expr[0] + ' DESC', groupExpression) > -1) {
                                index = jQuery.inArray(expr[0] + ' ASC', groupExpression);
                                if (index < 0)
                                    index = jQuery.inArray(expr[0] + ' DESC', groupExpression);
                                groupExpression[index] = expr[0] + ' ' + expr[1];
                            }
                            else {
                                customSortItems.push(expr[0] + ' ' + expr[1]);
                            }
                        }
                        if (customSortItems.length > 0)
                            groupExpression.push(customSortItems);
                        args.splice(customSortIndex);
                    }
                    else {
                        var tableView = sender.get_masterTableView();
                        var sortList = tableView.get_sortExpressions().toList();
                        // append any sort expression set by the user to the group sort order
                        if (sortList.length > 0) {
                            var sortExpression = [];
                            for (j = 0; j < sortList.length; j++) {
                                // sort expression set by the user to the group column should take precedence over the group sort order
                                if (jQuery.inArray(sortList[j].FieldName + ' ASC', groupExpression) > -1 || jQuery.inArray(sortList[j].FieldName + ' DESC', groupExpression) > -1) {
                                    index = jQuery.inArray(sortList[j].FieldName + ' ASC', groupExpression);
                                    if (index < 0)
                                        index = jQuery.inArray(sortList[j].FieldName + ' DESC', groupExpression);
                                    groupExpression[index] = sortList[j].FieldName + ' ' + (sortList[j].SortOrder === 1 ? 'ASC' : 'DESC');
                                }
                                else {
                                    sortExpression.push(sortList[j].FieldName + ' ' + (sortList[j].SortOrder === 1 ? 'ASC' : 'DESC'));
                                }
                            }
                            if (sortExpression.length > 0)
                                groupExpression.push(sortExpression);
                        }
                    }
                    if (groupExpression.length > 0)
                        args.push(new Reisys.Platform.UI.RadGridEventArgs('CustomSortExpression', groupExpression.join(', ')));
                    return args;
                };
                RadGrid.PersistState = false;
                RadGrid._selectedItemProperty = '__REI_IsSelected';
                //PLSUP-5124
                //Needed to add a variable to RadGrid to check if there is a custom sort currently applied
                RadGrid.IsCustomSorted = {
                    isCustomSorted: false,
                    set: function (bool) {
                        this.isCustomSorted = bool;
                    },
                    get: function () {
                        return this.isCustomSorted;
                    }
                };
                return RadGrid;
            }());
            UI.RadGrid = RadGrid;
            var RadGridEventArgs = (function () {
                function RadGridEventArgs(Key, Value) {
                    this.Key = Key;
                    this.Value = Value;
                }
                return RadGridEventArgs;
            }());
            UI.RadGridEventArgs = RadGridEventArgs;
            var GridSortModel = (function () {
                function GridSortModel(fieldName, title, sortOrder) {
                    this.fieldName = fieldName;
                    this.caption = title + ' ' + (sortOrder === 2 ? "DESC" : "ASC");
                }
                return GridSortModel;
            }());
            var GridGroupDetail = (function () {
                function GridGroupDetail() {
                }
                return GridGroupDetail;
            }());
            var GridGroupByField = (function () {
                function GridGroupByField() {
                }
                return GridGroupByField;
            }());
            var GridSortViewModel = (function () {
                function GridSortViewModel() {
                }
                return GridSortViewModel;
            }());
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = Reisys.Platform || (Reisys.Platform = {}));
})(Reisys || (Reisys = {}));
