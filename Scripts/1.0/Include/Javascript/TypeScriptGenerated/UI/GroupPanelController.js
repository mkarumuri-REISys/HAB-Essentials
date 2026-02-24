/// <reference path="radgrid.ts" />
/// <reference path="../utilities/util.ts" />
/// <reference path="../externalts/telerik.d.ts" />
/// <reference path="../LocalStorage/StoreManager.ts"/>
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var StoreManager = ReiSys.Platform.LocalStorage.StoreManager;
            var GroupPanelController = (function () {
                function GroupPanelController(gridId, groupName, isMasterPanel, masterPanel, itemCountBtnId, viewAllBtnId, viewPopupBtnId, viewPopupBtnUrl) {
                    this.groupName = groupName;
                    this.isMasterPanel = isMasterPanel;
                    this.masterPanel = masterPanel;
                    this.itemCountBtnId = itemCountBtnId;
                    this.viewAllBtnId = viewAllBtnId;
                    this.viewPopupBtnId = viewPopupBtnId;
                    this.viewPopupBtnUrl = viewPopupBtnUrl;
                    this.items = new ReiSys.Platform.Utils.Dictionary();
                    this.SizeChangedEvent = new GlobalPlatformEvent('SizeChanged');
                    this.ViewAllEvent = new GlobalPlatformEvent('viewAll');
                    this.viewSelectedEvent = new GlobalPlatformEvent('viewAll');
                    this.ItemToggleEvent = new GlobalPlatformEvent('itemToggle');
                    if (this.isMasterPanel) {
                        this.grid = Reisys.Platform.UI.RadGrid.GetControllerInstance(gridId);
                        this.grid.ItemSelectedEvent.subscribe(this.selectItem.bind(this));
                        this.grid.ItemSelectedEvent.subscribe(this.toggleItem.bind(this));
                        this.grid.ItemUnselectedEvent.subscribe(this.unselectItem.bind(this));
                        this.grid.ItemUnselectedEvent.subscribe(this.toggleItem.bind(this));
                        this.grid.ClearSelectionEvent.subscribe(function () {
                            this.items = new ReiSys.Platform.Utils.Dictionary();
                            this.updateView();
                        }.bind(this));
                        Reisys.Platform.UI.OnBeforeDataBind.subscribe(this.updateGridModelWithSelection.bind(this));
                        this.gridDataKeyNames = this.grid.gridDataKeyNames;
                        // Give a unique key name in order to store the selected items to local storage
                        this.localStorageKeyName = this.getLocalStorageKeyName(gridId);
                    }
                    else {
                        if (this.masterPanel !== null) {
                            this.masterPanel.ViewAllEvent.subscribe(this.viewAllBtnHide.bind(this));
                            this.masterPanel.viewSelectedEvent.subscribe(this.viewAllBtnShow.bind(this));
                            this.masterPanel.SizeChangedEvent.subscribe(this.updateView.bind(this));
                        }
                    }
                    // Whenever the page gets loaded, check to see if there are some items in local storage and update the view of the group action panel
                    this.updateView();
                }
                GroupPanelController.prototype.toggleItem = function () {
                    this.ItemToggleEvent.raise();
                };
                GroupPanelController.prototype.updateView = function () {
                    if (this.isMasterPanel) {
                        this.SizeChangedEvent.raise();
                    }
                    var itemCountBtn = $('#' + this.itemCountBtnId);
                    itemCountBtn.html('' + this.getNumberSelected());
                    var viewPopupBtn = $('#' + this.viewPopupBtnId);
                    // Make the itemCountBtn keyboard accessible by adding empty href action. User can hit "Enter" key to access the count button
                    itemCountBtn.attr('href', 'javascript:;');
                    viewPopupBtn.attr('href', 'javascript:;');
                    //PLSUP-5242
                    //Fixed 508 issue with color contrast, changed color: GrayText to color: #414141
                    if (this.getNumberSelected() == 0) {
                        itemCountBtn.attr('disabled', 'disabled');
                        itemCountBtn.attr('style', 'color: #414141; cursor: auto');
                        itemCountBtn.removeAttr('tabindex');
                        viewPopupBtn.attr('disabled', 'disabled');
                        viewPopupBtn.attr('style', 'color: #414141; cursor: auto');
                        viewPopupBtn.removeAttr('tabindex');
                        viewPopupBtn.attr('onclick', 'function(){return false}');
                    }
                    else {
                        itemCountBtn.removeAttr('disabled');
                        itemCountBtn.attr('style', 'cursor: pointer');
                        itemCountBtn.attr('tabindex', '0');
                        viewPopupBtn.removeAttr('disabled');
                        viewPopupBtn.attr('style', 'cursor: pointer');
                        viewPopupBtn.attr('tabindex', '0');
                        viewPopupBtn.attr("onclick", "javascript:OpenPopup('" + this.viewPopupBtnUrl + "'); return false;");
                    }
                };
                GroupPanelController.prototype.viewAllBtnHide = function () {
                    $('#' + this.viewAllBtnId).hide();
                };
                GroupPanelController.prototype.viewAllBtnShow = function () {
                    $('#' + this.viewAllBtnId).show();
                };
                ////
                //
                ////
                GroupPanelController.prototype.selectAllPage = function () {
                    if (this.isMasterPanel) {
                        var items = this.grid.GetCurrentPageKeysSelect();
                        this.grid.SelectAllItemsOnPage();
                        this.addItems(items);
                        this.updateView();
                        this.toggleItem();
                    }
                    else {
                        if (this.masterPanel !== null || this.masterPanel !== undefined) {
                            this.masterPanel.selectAllPage();
                        }
                    }
                };
                ////
                //
                ////
                GroupPanelController.prototype.unselectAllPage = function () {
                    if (this.isMasterPanel) {
                        var items = this.grid.GetCurrentPageKeysUnselect();
                        this.grid.UnselectAllItemsOnPage();
                        this.removeItems(items);
                        this.updateView();
                        this.toggleItem();
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            this.masterPanel.unselectAllPage();
                        }
                    }
                };
                ////
                //
                ////
                GroupPanelController.prototype.selectAllAcrossPages = function () {
                    if (this.isMasterPanel) {
                        var loadingPanelId = Reisys.Platform.UI.RadGrid.GetLoadingPanelId(this.grid.grid);
                        Reisys.Platform.UI.RadGrid.ShowHideLoadingPanel(loadingPanelId, this.grid.gridId, true);
                        var self = this;
                        this.grid.GeAllKeysSelect().done(function (items) {
                            self.items = new ReiSys.Platform.Utils.Dictionary();
                            self.addItems(items);
                            self.updateView();
                            self.toggleItem();
                        }).always(function () {
                            Reisys.Platform.UI.RadGrid.ShowHideLoadingPanel(loadingPanelId, self.grid.gridId, false);
                        });
                        this.grid.SelectAllItemsOnPage();
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            this.masterPanel.selectAllAcrossPages();
                        }
                    }
                };
                ////
                //
                ////
                GroupPanelController.prototype.unselectAllAcrossPages = function () {
                    if (this.isMasterPanel) {
                        this.grid.UnselectAllItemsOnPage();
                        // Remove all items from local storage
                        this.removeFromLocalStorage(this.localStorageKeyName);
                        this.items = new ReiSys.Platform.Utils.Dictionary();
                        this.updateView();
                        this.toggleItem();
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            this.masterPanel.unselectAllAcrossPages();
                        }
                    }
                };
                ////
                //
                ////
                GroupPanelController.prototype.selectItem = function (item) {
                    if (this.isMasterPanel) {
                        // Get the items from local storage
                        this.items = this.getItemsFromLocalStorage(this.localStorageKeyName);
                        // If the local storage key doesn't have group panel selected items yet, create a new dictionary.
                        if (this.items === null)
                            this.items = new ReiSys.Platform.Utils.Dictionary();
                        this.addItem(item);
                        // Add the latest collection of items to local storage
                        this.addToLocalStorage(this.localStorageKeyName, this.items);
                        this.updateView();
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            this.masterPanel.selectItem(item);
                        }
                    }
                };
                GroupPanelController.prototype.updateGridModelWithSelection = function (grid, data) {
                    var len, dataLen, i, j, k, selection, selectedItems, keyList = [], prop, areEqual, dataItem;
                    //wrong grid!
                    if (grid.get_id() !== this.grid.gridId) {
                        return;
                    }
                    //get current selection
                    selection = this.getItems();
                    selectedItems = selection.values();
                    if (selectedItems.length === 0)
                        return;
                    var item = selectedItems[0];
                    for (var property in item) {
                        if (item.hasOwnProperty(property)) {
                            keyList.push(property);
                        }
                    }
                    var dataLen = data.length;
                    var selectedItemLen = selectedItems.length;
                    var keyLen = keyList.length;
                    for (i = 0; i < dataLen; i++) {
                        dataItem = data[i];
                        areEqual = false;
                        for (j = 0; j < selectedItemLen; j++) {
                            item = selectedItems[j];
                            areEqual = false;
                            for (k = 0; k < keyLen; k++) {
                                prop = keyList[k];
                                if (dataItem[prop] !== item[prop]) {
                                    areEqual = false;
                                    break;
                                }
                                else {
                                    areEqual = true;
                                }
                            }
                            if (areEqual)
                                break;
                        }
                        dataItem[Reisys.Platform.UI.RadGrid._selectedItemProperty] = areEqual;
                    }
                };
                ////
                //
                ////
                GroupPanelController.prototype.unselectItem = function (item) {
                    if (this.isMasterPanel) {
                        this.removeItem(item);
                        this.updateView();
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            this.masterPanel.unselectItem(item);
                        }
                    }
                };
                GroupPanelController.prototype.viewAll = function () {
                    var itemCountBtn = $('#' + this.itemCountBtnId);
                    if (this.isMasterPanel) {
                        this.grid.ViewAll();
                        this.ViewAllEvent.raise();
                        this.viewAllBtnHide();
                        itemCountBtn.focus();
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            this.masterPanel.viewAll();
                            this.viewAllBtnHide();
                            itemCountBtn.focus();
                        }
                    }
                };
                GroupPanelController.prototype.viewSelected = function () {
                    if (this.isMasterPanel) {
                        if (this.getNumberSelected() > 0) {
                            this.grid.ViewSelected(this.items);
                            //TODO: add Logic 
                            // Show View All button 
                            // Have Grid search with only  keys (Give get keys and search)
                            this.viewSelectedEvent.raise();
                            this.viewAllBtnShow();
                        }
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            if (this.getNumberSelected() > 0) {
                                this.masterPanel.viewSelected();
                                this.viewAllBtnShow();
                            }
                        }
                    }
                };
                GroupPanelController.prototype.getNumberSelected = function () {
                    if (this.isMasterPanel) {
                        // Get items from local storage
                        this.items = this.getItemsFromLocalStorage(this.localStorageKeyName);
                        // If there are no items found, return empty dictionary
                        if (!this.items) {
                            this.items = new ReiSys.Platform.Utils.Dictionary();
                        }
                        return this.items.length();
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            return this.masterPanel.getNumberSelected();
                        }
                    }
                };
                GroupPanelController.prototype.addItem = function (item) {
                    var key = this.generateKey(item);
                    if (!this.items.containsKey(key)) {
                        this.items.add(key, item);
                    }
                };
                GroupPanelController.prototype.addItems = function (inputItems) {
                    var len = inputItems.length;
                    // Get the items from local storage
                    this.items = this.getItemsFromLocalStorage(this.localStorageKeyName);
                    // If the local storage key doesn't have group panel selected items yet, create a new dictionary.
                    if (this.items === null)
                        this.items = new ReiSys.Platform.Utils.Dictionary();
                    for (var i = 0; i < len; i++) {
                        this.addItem(inputItems[i]);
                    }
                    // Add the latest collection of items to local storage
                    this.addToLocalStorage(this.localStorageKeyName, this.items);
                };
                GroupPanelController.prototype.removeItem = function (item) {
                    var key = this.generateKey(item);
                    // Get the items from local storage
                    this.items = this.getItemsFromLocalStorage(this.localStorageKeyName);
                    if (this.items.containsKey(key)) {
                        this.items.remove(key);
                    }
                    // Add the latest collection of items to local storage
                    this.addToLocalStorage(this.localStorageKeyName, this.items);
                };
                GroupPanelController.prototype.generateKey = function (item) {
                    var gridDataKeyNamesLen = this.gridDataKeyNames.length;
                    var toReturn = '';
                    for (var i = 0; i < gridDataKeyNamesLen; i++) {
                        toReturn += item[this.gridDataKeyNames[i]];
                        if (i < gridDataKeyNamesLen - 1) {
                            toReturn += '_';
                        }
                    }
                    return toReturn;
                };
                GroupPanelController.prototype.removeItems = function (items) {
                    var len = items.length;
                    for (var i = 0; i < len; i++) {
                        this.removeItem(items[i]);
                    }
                };
                GroupPanelController.prototype.getItems = function () {
                    if (this.isMasterPanel) {
                        // Get items from local storage
                        this.items = this.getItemsFromLocalStorage(this.localStorageKeyName);
                        // If there are any items found, return them else return empty dictionary
                        if (this.items) {
                            return this.items;
                        }
                        else {
                            return new ReiSys.Platform.Utils.Dictionary();
                        }
                    }
                    else {
                        if (this.masterPanel !== null && this.masterPanel !== undefined) {
                            this.masterPanel.getItems();
                        }
                    }
                };
                GroupPanelController.prototype.getLocalStorageKeyName = function (gridId) {
                    //Added a null check, this code would fail if gridDataKeyNames is null
                    var returnValue = "";
                    if (this.gridDataKeyNames != null)
                        returnValue = REISys.Platform.CurrentSessionID + "_" + gridId + "_" + this.gridDataKeyNames.toString();
                    return returnValue;
                };
                /**
                 * Adds the key to LocalStorage
                 * @param key - Key to be used to add the value to local storage
                 * @param value - Dictionary object containing items to be added to local storage
                 * @returns void
                 */
                GroupPanelController.prototype.addToLocalStorage = function (key, value) {
                    // Remove existing key from local storage if it exists and add the new key
                    StoreManager.set(key, value, true);
                };
                /**
                 * Removes the key to LocalStorage
                 * @param key - Key to be used to remove the value from local storage
                 * @returns void
                 */
                GroupPanelController.prototype.removeFromLocalStorage = function (key) {
                    if (StoreManager.has(key)) {
                        StoreManager.remove(key);
                    }
                };
                /**
                 * Gets the items stored in LocalStorage
                 * @param key - Key to be used to get the value from local storage
                 * @returns void
                 */
                GroupPanelController.prototype.getItemsFromLocalStorage = function (key) {
                    if (StoreManager.has(key)) {
                        // Store Manager just returns an object, we need to explicitly convert it to Platform Dictionary
                        var storeObj = StoreManager.get(key);
                        var returnValue = new ReiSys.Platform.Utils.Dictionary();
                        for (var i = 0; i < storeObj._keys.length; i++) {
                            returnValue._keys.push(storeObj._keys[i]);
                            returnValue._values.push(storeObj._values[i]);
                            returnValue[storeObj._keys[i]] = storeObj._values[i];
                        }
                        return returnValue;
                    }
                    else {
                        return null;
                    }
                };
                return GroupPanelController;
            })();
            UI.GroupPanelController = GroupPanelController;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
//# sourceMappingURL=GroupPanelController.js.map