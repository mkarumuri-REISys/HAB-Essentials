/// <reference path="../externalts/platformlib.ts" />
/// <reference path="../externalts/telerik.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../utilities/util.ts" />
/// <reference path="../externalts/jquery.d.ts" />
/// <reference path="hierarchicalcheckbox.ts" />
/// <reference path="../externalts/knockout.d.ts" />
/// <reference path="BaseComponentController.ts" />
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var SearchPeristancePanelController = (function (_super) {
                __extends(SearchPeristancePanelController, _super);
                //The default constructor for this class.
                function SearchPeristancePanelController() {
                    _super.call(this);
                    //members of this controller.
                    this.collectItemEvent = new ReiSys.Utilities.PlatformEvent();
                    this.flattenedObjectArray = {};
                    this.defaultSearchParamList = new Array(); //default search param list.
                    this.enablePersistence = false;
                    this.sortControlContainerId = '';
                }
                SearchPeristancePanelController.prototype.collectSearchParameters = function () {
                    if (this.searchParamControls === null || this.searchParamControls === undefined) {
                        this.searchParamControls = $('[ModelFieldName]');
                    }
                    var searchParamControls = this.searchParamControls;
                    var searchParamControlsLength = searchParamControls.length;
                    var searchParamItems = new UI.SearchParametersModel();
                    this.displayTextNewItem = '';
                    this.serverValueNewItem = '{';
                    for (var i = 0; i < searchParamControlsLength; i++) {
                        var item = $(searchParamControls.get(i));
                        var operation = item.attr('Operation');
                        var modelFieldName = item.attr('modelFieldName');
                        var value = '';
                        var id = item.attr('id');
                        if (id !== undefined) {
                            value = PlatformUtil.GetControlValue(id, false);
                        }
                        else {
                            var childItem = item.children().first();
                            id = childItem.attr('id');
                            value = PlatformUtil.GetControlValue(id, false);
                        }
                        value = value.trim();
                        var literalDisplayValue = '';
                        if (item.hasClass('RadListBox')) {
                            if (value.indexOf('All|') === -1) {
                                var telItem = $find(id).get_checkedItems();
                                for (var t = 0; t < telItem.length; t++) {
                                    var tempText = telItem[t].get_text();
                                    if (tempText.trim() !== 'All') {
                                        var literalDisplayValueLen = literalDisplayValue.length;
                                        literalDisplayValue += (literalDisplayValueLen === 0 ? '' : ', ') + tempText;
                                    }
                                }
                            }
                            var isString = false;
                            value = value.replace('All|', '').replace(/\|/g, ',');
                            if (value != '') {
                                value = ReiSys.Utilities.Util.AddQuotes(value);
                            }
                        }
                        else if (item.hasClass('hierarchicalCheckboxControl')) {
                            var controlId = item.attr('id');
                            if (REISys.Platform.Web.hierarchicalCheckboxContainer) {
                                var hierarchicalCheckboxContainer = REISys.Platform.Web.hierarchicalCheckboxContainer.instances[controlId];
                                literalDisplayValue = hierarchicalCheckboxContainer.getText();
                            }
                            if (value != '') {
                                value = ReiSys.Utilities.Util.AddQuotes(value);
                            }
                        }
                        else if (item.hasClass("RadPicker")) {
                            var fromValue = $('#' + id).find('input');
                            var myValue = '';
                            if (fromValue != null)
                                value = fromValue.first().val();
                            if (value !== '') {
                                literalDisplayValue = "Between:" + value + ";";
                                var toValue = $('#' + id).nextAll('.RadPicker').find('input');
                                if (toValue != null)
                                    myValue = toValue.first().val();
                                value += '' ? myValue : ',' + myValue;
                                literalDisplayValue += "and:" + myValue;
                            }
                            else {
                                var toControl = $('#' + id).nextAll('.RadPicker').find('input');
                                var toVal = '';
                                if (toControl != null) {
                                    toVal = toControl.first().val();
                                }
                                if (toVal !== '') {
                                    value += ',' + toVal;
                                    literalDisplayValue = "Between: ; and:" + toVal;
                                }
                            }
                        }
                        else {
                            if (operation.toUpperCase() == 'IN') {
                                value = ReiSys.Utilities.Util.AddQuotes(value);
                            }
                            literalDisplayValue = value;
                        }
                        var searchDisplayText = item.attr('SearchDisplayText');
                        // id, searchDisplayText, literalDisplayValue)
                        var paramItem = new UI.SearchParameterModel(value, operation, modelFieldName);
                        if (value != '') {
                            searchParamItems.items.push(paramItem);
                            this.serverValueNewItem += this.formatServerValue(escape(value), id);
                            if (i < searchParamControlsLength - 1) {
                                this.serverValueNewItem += ',';
                            }
                        }
                        if (searchDisplayText !== undefined) {
                            this.displayTextNewItem += searchDisplayText + ': ' + (literalDisplayValue == '' ? 'All' : literalDisplayValue) + ';';
                        }
                    }
                    //plsup
                    //added this code to remove the last comma from the string so that it can be properly deserialized as a json string
                    //add check that the last character is in fact a comma
                    if (this.serverValueNewItem.lastIndexOf(",") == this.serverValueNewItem.length - 1)
                        this.serverValueNewItem = this.serverValueNewItem.substring(0, this.serverValueNewItem.length - 1) + '}';
                    // if persistence is enabled, refresh the search param controls stored in cache
                    if (this.enablePersistence) {
                        Reisys.Platform.UI.SearchPanelPersistUtility.saveSearchParameters(this.gridClientId, searchParamControls);
                    }
                    return searchParamItems;
                };
                SearchPeristancePanelController.prototype.formatServerValue = function (value, id) {
                    var toReturn = '';
                    if (value != '') {
                        toReturn = '"' + id + '":';
                        toReturn += '"' + value + '"';
                    }
                    return toReturn;
                };
                SearchPeristancePanelController.prototype.collectOrderBy = function () {
                    //Determines if grid or custom sort is selected
                    var isCustomSortSelected = $('[id$=btnSearch]').attr('CustomSortSelected').toLowerCase() === 'true';
                    var sortItems = new UI.SortParametersModel();
                    if (isCustomSortSelected) {
                        var sortFilterControls = $('div[id*=' + this.sortControlContainerId + '] div.RadComboBox');
                        var sortFilterControlsLength = sortFilterControls.length;
                        for (var i = 0; i < sortFilterControlsLength; i = i + 2) {
                            var itemFieldControl = $(sortFilterControls.get(i));
                            var idFieldControl = itemFieldControl.attr('id');
                            var valueField = PlatformUtil.GetControlValue(idFieldControl, false);
                            var itemSortControl = $(sortFilterControls.get(i + 1));
                            var idSortControl = itemSortControl.attr('id');
                            var valueSort = PlatformUtil.GetControlValue(idSortControl, false);
                            if (valueField !== '' && valueField !== '_blank' && valueSort !== '') {
                                var sortItem = new UI.SortParameterModel(valueSort, valueField);
                                sortItems.items.push(sortItem);
                            }
                        }
                        // if persistence is enabled, refresh the search param controls stored in cache
                        if (this.enablePersistence) {
                            Reisys.Platform.UI.SearchPanelPersistUtility.saveSearchSortFilters(this.gridClientId, sortFilterControls, true, this.sortControlContainerId);
                        }
                    }
                    return sortItems;
                };
                SearchPeristancePanelController.prototype.collectSearchName = function () {
                    return PlatformUtil.GetControlValue('SearchNameBox1', false).trim();
                };
                SearchPeristancePanelController.prototype.collectSearch = function () {
                    return new UI.SearchModel(this.collectSearchParameters(), this.collectOrderBy());
                };
                SearchPeristancePanelController.prototype.search = function (isSaveSearch) {
                    if (this.enablePersistence) {
                        Reisys.Platform.UI.SearchPanelPersistUtility.clearSearchParameters(this.gridClientId);
                        Reisys.Platform.UI.SearchPanelPersistUtility.clearSearchSortFilters(this.gridClientId);
                    }
                    if (isSaveSearch) {
                        validaitonInvoker.InvokeValidation('SaveSearch');
                        if (validaitonInvoker.IsValid) {
                            //validate search name
                            this.clearSelected();
                            var searchName = this.collectSearchName();
                            var searchItems = this.collectSearch();
                            this.collectItemEvent.raise(this, searchItems);
                            var newSearch = new UI.SavedSearchModel(this.serverValueNewItem, REISys.Platform.CurrentUserId, true, searchName, '', '', '', '', this.groupName, this.displayTextNewItem, '', '');
                            this.save(newSearch);
                            PlatformConsole.log('Save Search worked: call web service, update drop down');
                        }
                    }
                    else {
                        //send data to grid
                        this.collectItemEvent.raise(this, this.collectSearch());
                    }
                    this.hideSearchPanel();
                    this.addTooltiptoSearchBtn();
                    $('.tooltip').tipTip();
                };
                SearchPeristancePanelController.prototype.clearSearchItems = function () {
                    if (this.searchParamControls === null || this.searchParamControls === undefined) {
                        this.searchParamControls = $('[ModelFieldName]');
                    }
                    var searchParamControls = this.searchParamControls;
                    var searchParamControlsLength = searchParamControls.length;
                    for (var i = 0; i < searchParamControlsLength; i++) {
                        var item = $(searchParamControls[i]);
                        var id = item.attr('id');
                        if (id !== undefined) {
                            if (item.attr('type') !== 'hidden') {
                                //PLSUP-5106
                                //Added this code because now that datepicker is correctly populated when using saved search,
                                //it is not being cleared properly when performing another search. This code checks if the control
                                //is a DatePicker type and clears with ',' instead of '' because DateRangePicker will read that as
                                //empty for both of the DatePicker entries
                                var control = $("#" + id);
                                if (control.hasClass("RadPicker"))
                                    ReiSys.Utilities.Util.SetValueForControl(id, ',');
                                else
                                    ReiSys.Utilities.Util.SetValueForControl(id, '');
                            }
                        }
                        else {
                            var childItem = item.children().first();
                            id = childItem.attr('id');
                            ReiSys.Utilities.Util.SetValueForControl(id, '');
                        }
                    }
                };
                SearchPeristancePanelController.prototype.getSavedSearch = function (menu) {
                    this.savedSearch = menu;
                    var menuItemCount = menu.length;
                    if (menu.length > 0) {
                        var arrayOfObservableleItems = new Array();
                        for (var i = 0; i < menuItemCount; i++) {
                            var newItem = new UI.SavedSearchModelObservable(menu[i]);
                            arrayOfObservableleItems.push(newItem);
                        }
                        this.SavedSearchModel = ko.observableArray(arrayOfObservableleItems);
                        this.bindSavedSearches();
                    }
                    $(".tooltip, .rgHeader>a, .rgPager input , input.rgFilter, input.rgSortAsc , input.rgSortDesc ").tipTip();
                };
                SearchPeristancePanelController.prototype.bindSavedSearches = function () {
                    var bindingElement = $('[id*=savedSearches]');
                    bindingElement.show();
                    ko.applyBindings({ SavedSearch: this.SavedSearchModel }, bindingElement[0]);
                };
                SearchPeristancePanelController.prototype.save = function (savedSearchModel) {
                    var obeservableModel = new UI.SavedSearchModelObservable(savedSearchModel);
                    if (this.SavedSearchModel === undefined) {
                        this.SavedSearchModel = ko.observableArray(new Array());
                        this.SavedSearchModel.push(obeservableModel);
                        this.bindSavedSearches();
                    }
                    else {
                        var existingItem = this.findSearchBySearchName(obeservableModel.SearchName());
                        if (existingItem === null) {
                            this.SavedSearchModel.push(obeservableModel);
                        }
                        else {
                            existingItem.Value(obeservableModel.Value());
                            existingItem.DisplayText(obeservableModel.DisplayText());
                            existingItem.Selected(true);
                            obeservableModel = existingItem;
                        }
                    }
                    try {
                        $.ajax({
                            type: 'POST',
                            contentType: 'application/json',
                            dataType: 'json',
                            url: ReiSys.Utilities.Util.BaseUrl + 'api/Platform/Services/SearchPersistenceWebAPI/Save',
                            //data: JSON.stringify({ ErrorDesc: 'This is information about Client Error that had Occurred', ClientBrowser: clientBrowser, ClientOS: clientOS, ClientUrl: clientUrl, ErrorMessage: errorMessage, StackTrace: stackTrace, ExceptionCategory: exceptionCategory, MethodName: methodName }),
                            data: JSON.stringify({ "SavedSearchId": obeservableModel.Id(), "CurrentUserId": obeservableModel.UserId(), "GroupName": obeservableModel.GroupName(), "SearchName": obeservableModel.SearchName(), "Value": obeservableModel.Value(), "DisplayText": obeservableModel.DisplayText() }),
                            //done: function (data) {
                            //    //Need to add Id to the final item
                            //    PlatformConsole.log('Done');
                            //},
                            success: function (data) {
                                //Need to add Id to the final item
                                obeservableModel.Id(data);
                                PlatformConsole.log('Success');
                                // REISys.Platform.UI.searchPanel.UpdateLastModel(data);
                            },
                        });
                    }
                    catch (err) {
                        PlatformConsole.log('Error Occured' + err);
                    }
                    return false;
                };
                SearchPeristancePanelController.prototype.performSaveSearch = function (searchId) {
                    this.search(false);
                    this.showSearchPanel();
                };
                SearchPeristancePanelController.prototype.populateControls = function (saveSearch) {
                    this.clearSearchItems();
                    //plsup
                    //changed the code to use JSON.parse instead
                    var searchValue = saveSearch.Value();
                    var jsonObj = JSON.parse(searchValue);
                    var keys = Object.keys(jsonObj);
                    for (var i = 0; i < keys.length; i++) {
                        var value = jsonObj[keys[i]].toString();
                        var valParsed = this.trimDoubleQuotes(unescape(value).substring(0, value.length)).replace(/'/g, '');
                        ReiSys.Utilities.Util.SetValueForControl(keys[i], valParsed);
                    }
                    //this code was commented out because the previous implementation was not using JSON.parse to parse the json string,
                    //and when implementing client-side saved search for cslf this approach was not working. For this to work, a change needed to be made to remove the last
                    //comma from the serverValueNewItem string so that it could be json parsed.

                    //var searchFields = searchValue.substring(1, searchValue.length - 1).split(',');
                    //var searchFieldsLength = searchFields.length;
                    //for (var i = 0; i < searchFieldsLength; i++) {
                    //    var searchItem = searchFields[i];
                    //    var searchItemParts = searchItem.split(':');
                    //    if (searchItemParts.length > 1) {
                    //        var controlId = this.trimDoubleQuotes(searchItemParts[0].substring(0, searchItemParts[0].length));
                    //        var value = this.trimDoubleQuotes(unescape(searchItemParts[1]).substring(0, searchItemParts[1].length));
                    //        //PLSUP-5106
                    //        //Strip the quotes so that values are populated correctly
                    //        value = value.replace(/'/g, "");
                    //        console.log(controlId + " " + value);
                    //        ReiSys.Utilities.Util.SetValueForControl(controlId, value);
                    //    }
                    //}
                    ReiSys.Utilities.Util.SetValueForControl('SearchNameBox1', saveSearch.SearchName());
                };
                SearchPeristancePanelController.prototype.trimDoubleQuotes = function (value) {
                    if (value.charAt(0) === '"') {
                        value = value.substring(1, value.length - 1);
                    }
                    if (value.charAt(value.length - 1) === '"') {
                        value = value.substring(0, value.length - 1);
                    }
                    return value;
                };
                SearchPeristancePanelController.prototype.addTooltiptoSearchBtn = function () {
                    $('[id*=SearchImage]').attr('title', this.displayTextNewItem);
                };
                //Delete a saved search from search panel
                SearchPeristancePanelController.prototype.deleteSavedSearch = function (searchId) {
                    this.SavedSearchModel.remove(function (model) {
                        return model.Id() == searchId;
                    });
                    try {
                        $.ajax({
                            type: 'GET',
                            contentType: 'application/json',
                            dataType: 'json',
                            url: ReiSys.Utilities.Util.BaseUrl + 'api/Platform/Services/SearchPersistenceWebAPI/Delete?Id=' + searchId,
                        });
                    }
                    catch (err) {
                        PlatformConsole.log('Error Occured' + err);
                    }
                };
                //Get saved search details to bind to the search panel controls
                SearchPeristancePanelController.prototype.getSavedSearchDetails = function (saveSearchId) {
                    //PLSUP-5106
                    //added this line to make sure that the div for saved searches is hidden when any of the saved searches are selected
                    $("#savedsearch").hide();
                    var searchItem = this.findSearchById(saveSearchId);
                    this.clearSelected();
                    searchItem.Selected(true);
                    this.populateControls(searchItem);
                    this.search(false);
                    this.showSearchPanel();
                };
                SearchPeristancePanelController.prototype.updateSaveSearch = function (saveSearchId) {
                    this.clearSelected();
                    var searchItem = this.findSearchById(saveSearchId);
                    searchItem.Selected(true);
                    this.populateControls(searchItem);
                    this.showSearchPanel();
                };
                //changed the show/hide methods to use the 'display:none' style instead of using jquery.hide(), 
                //because it was causing the RadAjaxLoadingPanel to not display in the proper location when the search panel is hidden after performing a search
                SearchPeristancePanelController.prototype.showSearchPanel = function () {
                    $('#tblSearchPanel').css("display", "block");
                    ReiSys.Platform.UI.EnableSearchLink();
                    $('#tblSearchPanel').attr('SearchPanelExpanded', 'true');
                    $("html, body").animate({ scrollTop: 0 }, 1); //Scroll page
                };
                SearchPeristancePanelController.prototype.hideSearchPanel = function () {
                    $('#tblSearchPanel').css("display", "none");
                    ReiSys.Platform.UI.EnableSearchLink();
                    $('#tblSearchPanel').attr('SearchPanelExpanded', 'false');
                    $("html, body").animate({ scrollTop: 0 }, 1); //Scroll page
                };
                SearchPeristancePanelController.prototype.findSearchById = function (saveSearchId) {
                    var searchItem = ko.utils.arrayFirst(this.SavedSearchModel(), function (model) {
                        return model.Id() === saveSearchId;
                    });
                    return searchItem;
                };
                SearchPeristancePanelController.prototype.clearSelected = function () {
                    if (this.SavedSearchModel !== null && this.SavedSearchModel !== undefined) {
                        var searchItem = ko.utils.arrayFirst(this.SavedSearchModel(), function (model) {
                            return model.Selected() === true;
                        });
                        if (searchItem !== null && searchItem !== undefined) {
                            searchItem.Selected(false);
                        }
                    }
                    $('[id*=SelItemImgDefault]').remove();
                    $('.search_selected').removeClass('search_selected');
                };
                SearchPeristancePanelController.prototype.findSearchBySearchName = function (searchName) {
                    var searchItem = ko.utils.arrayFirst(this.SavedSearchModel(), function (model) {
                        return model.SearchName() === searchName;
                    });
                    return searchItem;
                };
                //create a search model based on default search parameters passed in from child.
                SearchPeristancePanelController.prototype.getDefaultSavedSearchModel = function () {
                    //PLSUP-5106
                    //added this line to make sure the div for saved searches hides when Default Parameters is selected
                    $("#savedsearch").hide();
                    if (this.searchParamControls === null || this.searchParamControls === undefined) {
                        this.searchParamControls = $('[ModelFieldName]');
                    }
                    var searchParamControls = this.searchParamControls;
                    var searchParamControlsLength = searchParamControls.length;
                    var searchParamItems = new UI.SearchParametersModel();
                    //console.log(this.searchParamControls);
                    //this.displayTextNewItem = '';
                    var tmpValueItem = '{';
                    for (var i = 0; i < searchParamControlsLength; i++) {
                        var item = $(searchParamControls.get(i));
                        var operation = item.attr('Operation');
                        var modelFieldName = item.attr('modelFieldName');
                        var value = '';
                        var id = item.attr('id');
                        if (id !== undefined) {
                            value = PlatformUtil.GetControlValue(id, false);
                        }
                        else {
                            var childItem = item.children().first();
                            id = childItem.attr('id');
                            value = PlatformUtil.GetControlValue(id, false);
                        }
                        var literalDisplayValue = '';
                        for (var j = 0; j < this.defaultSearchParamList.length; j++) {
                            if (this.defaultSearchParamList[j].modelFieldName == modelFieldName &&
                                this.defaultSearchParamList[j].operation == operation) {
                                value = this.defaultSearchParamList[j].value;
                                break;
                            }
                        }
                        var searchDisplayText = item.attr('SearchDisplayText');
                        // id, searchDisplayText, literalDisplayValue)
                        if (value != '') {
                            tmpValueItem += this.formatServerValue(escape(value), id);
                            if (i < searchParamControlsLength - 1) {
                                tmpValueItem += ',';
                            }
                        }
                        if (this.serverValueNewItem.lastIndexOf(",") == this.serverValueNewItem.length - 1)
                            this.serverValueNewItem = this.serverValueNewItem.substring(0, this.serverValueNewItem.length - 1);
                        this.serverValueNewItem += '}';
                    }
                    tmpValueItem += '}';
                    this.serverValueNewItem = tmpValueItem;
                    var tmpSavedSearchModel = new UI.SavedSearchModel(this.serverValueNewItem, REISys.Platform.CurrentUserId, true, '', '', '', '', '', this.groupName, this.displayTextNewItem, '', '');
                    return tmpSavedSearchModel;
                };
                //clear all the default search parameters that are already set (i.e. first name, last name, etc).
                SearchPeristancePanelController.prototype.clearAllDefaultSearchParameters = function () {
                    for (var j = 0; j < this.defaultSearchParamList.length; j++) {
                        this.defaultSearchParamList.splice(j);
                    }
                };
                //add all the default search parameters, like first name, last name, email, etc.
                SearchPeristancePanelController.prototype.addDefaultSearchParameters = function (modelFieldName, operation, fieldValue) {
                    var paramItem = new UI.SearchParameterModel(fieldValue, operation, modelFieldName);
                    this.defaultSearchParamList.push(paramItem);
                };
                //collect default search parameters. The child pages will override this function.
                SearchPeristancePanelController.prototype.doCollectDefaultSearchParameters = function () {
                    var searchParamItems = new UI.SearchParametersModel();
                    for (var j = 0; j < this.defaultSearchParamList.length; j++) {
                        searchParamItems.items.push(this.defaultSearchParamList[j]);
                    }
                    return searchParamItems;
                };
                //do the dafault search
                //raiseDefaultSearchEvent(){
                //    this.collectItemEvent.raise(this, this.doCollectDefaultSearchParameters());
                //}
                //The execute function is called from the page OnClientClick.
                SearchPeristancePanelController.prototype.executeDefaultSearch = function () {
                    this.clearSearchItems();
                    var tmpSavedSearchModel = this.getDefaultSavedSearchModel();
                    this.setDefaultSearchModel(tmpSavedSearchModel);
                    this.populateControls(this.defaultSearchModel);
                    //this.raiseDefaultSearchEvent();
                    this.search(false);
                };
                //Create the default search model based on what the default params are.
                SearchPeristancePanelController.prototype.setDefaultSearchModel = function (dfltSavedSearchModel) {
                    if (this.defaultSearchModel === undefined || this.defaultSearchModel === null) {
                        this.defaultSearchModel = new UI.SavedSearchModelObservable(dfltSavedSearchModel);
                    }
                    this.defaultSearchModel.updateModel(dfltSavedSearchModel);
                    //console.log(this.defaultSearchModel);
                    $(".tooltip").tipTip();
                };
                return SearchPeristancePanelController;
            })(ReiSys.Platform.Controller.BaseComponentController);
            UI.SearchPeristancePanelController = SearchPeristancePanelController;
            UI.searchPanel = new REISys.Platform.UI.SearchPeristancePanelController();
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
//# sourceMappingURL=searchpanelcontroller.js.map