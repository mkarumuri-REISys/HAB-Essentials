var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var ComprehensiveActionHistory;
            (function (ComprehensiveActionHistory) {
                var ProcessAttribute = (function () {
                    function ProcessAttribute() {
                    }
                    return ProcessAttribute;
                }());
                ComprehensiveActionHistory.ProcessAttribute = ProcessAttribute;
                var resourceLink = (function () {
                    function resourceLink(link, resourceTypeCode, resourceValue) {
                        this.displayText = link.displayText;
                        this.displayOrder = link.displayOrder;
                        this.url = link.uri;
                        if (link.uri.indexOf('?') > -1) {
                            this.url += '&';
                        }
                        else {
                            this.url += '?';
                        }
                        this.url += 'rv=' + resourceValue + '&rtc=' + resourceTypeCode;
                    }
                    resourceLink.prototype.linkClicked = function () {
                        OpenPopupWithMenuBar(this.url, 600, 980, this.displayText);
                    };
                    return resourceLink;
                }());
                ComprehensiveActionHistory.resourceLink = resourceLink;
                //Model for process instances
                var SummaryProcessItem = (function () {
                    function SummaryProcessItem(jsonModel, resourceConfig) {
                        this.resourceTypeName = jsonModel.ResourceTypeName;
                        this.resourceTypeCode = jsonModel.ResourceTypeCode.toString();
                        this.name = jsonModel.Name;
                        this.value = jsonModel.ResourceValue;
                        this.trackingNo = jsonModel.TrackingNo;
                        this.dateCreated = this.loadCreateDate(jsonModel.AttributeList);
                        var configValue = ko.utils.arrayFilter(resourceConfig, function (i) { return i.resourceTypeCode === jsonModel.ResourceTypeCode; })[0];
                        if (configValue !== undefined) {
                            var configurationModel = configValue.configurationDetails;
                            this.color = configurationModel.color;
                            this.resourceTypeName = configValue.resourceName;
                            this.resourceLinks = configurationModel.resourceLinks.map(function (item) { return new resourceLink(item, jsonModel.ResourceTypeCode, jsonModel.ResourceValue); });
                            this.attributes = this.getViewableAttributes(jsonModel.AttributeList, configurationModel);
                        }
                    }
                    SummaryProcessItem.prototype.getViewableAttributes = function (list, configModel) {
                        var fields = configModel.displayFields.sort(function (a, b) { return a.displayOrder - b.displayOrder; });
                        var fieldLen = fields.length;
                        //Create list
                        var displayList = new Array();
                        for (var i = 0; i < fieldLen; i++) {
                            var configItem = fields[i];
                            var attributeItem = ko.utils.arrayFilter(list, function (i) { return i.Key === configItem.valueKey; })[0];
                            if (attributeItem !== null && attributeItem !== undefined) {
                                var newItem = new ProcessAttribute();
                                if (configItem.valueKey === 'CreatedDate') {
                                    if (attributeItem.Value !== null && attributeItem.Value !== undefined) {
                                        newItem.Value = attributeItem.Value.split(' ')[0];
                                    }
                                }
                                else {
                                    newItem.Value = attributeItem.Value;
                                }
                                newItem.DisplayValue = configItem.labelDisplayText;
                                displayList.push(newItem);
                            }
                            else {
                                var newItem = new ProcessAttribute();
                                if (configItem.valueKey === 'trackingNo') {
                                    newItem.Value = this.trackingNo;
                                }
                                else {
                                    newItem.Value = 'N/A';
                                }
                                newItem.DisplayValue = configItem.labelDisplayText;
                                displayList.push(newItem);
                            }
                        }
                        return displayList;
                    };
                    SummaryProcessItem.prototype.loadCreateDate = function (objArr) {
                        var createDateArr = objArr.filter(function (i) { return i.Key === "CreatedDate"; });
                        if (createDateArr === null || createDateArr === undefined || createDateArr.length === 0)
                            return void 0;
                        return new Date(createDateArr[0].Value);
                    };
                    return SummaryProcessItem;
                }());
                ComprehensiveActionHistory.SummaryProcessItem = SummaryProcessItem;
                var SummaryProcessTypeItem = (function () {
                    function SummaryProcessTypeItem(resourceConfigItem) {
                        this.id = resourceConfigItem.resourceTypeCode.toString();
                        this.name = resourceConfigItem.resourceName;
                        if (resourceConfigItem.configurationDetails) {
                            this.color = resourceConfigItem.configurationDetails.color;
                        }
                    }
                    return SummaryProcessTypeItem;
                }());
                ComprehensiveActionHistory.SummaryProcessTypeItem = SummaryProcessTypeItem;
                ///Model for the summary panel controller
                var SummaryProcessModel = (function () {
                    function SummaryProcessModel() {
                        this.runClick = true;
                        //create getClickedValues.  Defining this here ensures correct 'this'
                        this.selectedProcessItems = ko.observableArray();
                        this.selectedProcessTypeItems = ko.observableArray();
                        this.processItems = [];
                        this.processTypeItems = [];
                        //make variable for bind function here to reuse in order to reduce memory footprint
                        //Get processItems from passed Json
                        this.onClick = new GlobalPlatformEvent('summaryPanelClick');
                        this.loadProcessTypes = function (resourceConfig) {
                            this.processTypeItems = resourceConfig.sort(function compare(a, b) {
                                if (a.resourceName < b.resourceName)
                                    return -1;
                                if (a.resourceName > b.resourceName)
                                    return 1;
                                return 0;
                            }).map(function (item) { return new SummaryProcessTypeItem(item); });
                        };
                        this.clearAll = function () {
                            this.runClick = false;
                            this.selectedProcessItems.removeAll();
                            this.runClick = true;
                            this.selectedProcessTypeItems.removeAll();
                        };
                        this.selectedProcessTypeItems.subscribe(this.onProcessTypeChange.bind(this));
                        this.selectedProcessItems.subscribe(this.onProcessChange.bind(this));
                    }
                    //pass all checked items to the onClick event
                    SummaryProcessModel.prototype.processSortFunc = function (a, b) {
                        return a.dateCreated > b.dateCreated ? -1 : a.dateCreated < b.dateCreated ? 1 : 0;
                    };
                    SummaryProcessModel.prototype.loadProcesses = function (data, resourceConfig) {
                        this.processItems = data.map(function (d) { return new SummaryProcessItem(d, resourceConfig); }).sort(this.processSortFunc);
                    };
                    SummaryProcessModel.prototype.onProcessTypeChange = function () {
                        this.runClick = false;
                        var resourceTypes = this.selectedProcessTypeItems();
                        var processFilter = function (item) { return resourceTypes.indexOf(item.resourceTypeCode) >= 0; };
                        var processMap = function (item) { return item.value; };
                        var ids = this.processItems.filter(processFilter).map(processMap);
                        this.selectedProcessItems(ids);
                        this.runClick = true;
                        this.onProcessChange();
                    };
                    SummaryProcessModel.prototype.onProcessChange = function () {
                        if (this.runClick) {
                            var args = [];
                            args["processes"] = this.selectedProcessItems().join(',');
                            this.onClick.raise(this, args);
                        }
                        return false;
                    };
                    return SummaryProcessModel;
                }());
                ComprehensiveActionHistory.SummaryProcessModel = SummaryProcessModel;
            })(ComprehensiveActionHistory = UI.ComprehensiveActionHistory || (UI.ComprehensiveActionHistory = {}));
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
