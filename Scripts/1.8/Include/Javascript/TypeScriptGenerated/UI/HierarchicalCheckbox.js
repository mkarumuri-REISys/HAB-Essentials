/// <reference path="../externalts/knockout.d.ts" />
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Web;
        (function (Web) {
            var HierarchicalCheckboxController = (function () {
                function HierarchicalCheckboxController(listClientId, filterClientId, onlyReturnChildValue, selectParentSelectChild, collapsable) {
                    if (collapsable === void 0) { collapsable = false; }
                    this.listClientId = listClientId;
                    this.filterClientId = filterClientId;
                    this.onlyReturnChildValue = onlyReturnChildValue;
                    this.selectParentSelectChild = selectParentSelectChild;
                    this.hierarchicalFilterTextChangeTimeout = null;
                    this.isCollapsable = collapsable;
                    document.getElementById(filterClientId).addEventListener('keyup', function () {
                        var controller = this;
                        if (this.hierarchicalFilterTextChangeTimeout !== null) {
                            clearTimeout(this.hierarchicalFilterTextChangeTimeout);
                        }
                        this.hierarchicalFilterTextChangeTimeout = setTimeout(function () {
                            var filterBox = $find(controller.filterClientId);
                            var text = filterBox.get_textBoxValue();
                            text = text.trim();
                            PlatformConsole.log('Value: ' + text);
                            if (text != 'Type Here to Filter') {
                                controller.filter(text);
                            }
                        }.bind(this), 1000);
                    }.bind(this));
                }
                HierarchicalCheckboxController.prototype.BindDataSource = function (model) {
                    this.model = model;
                    ko.applyBindings({ Model: this.model }, document.getElementById(this.listClientId).getElementsByTagName('ul')[0]);
                };
                HierarchicalCheckboxController.prototype.BindDataSourceFlat = function (model) {
                    this.flatModel = new Array();
                    this.model = new Array();
                    var dictionary = {};
                    var modelLength = model.length;
                    for (var i = 0; i < modelLength; i++) {
                        var currentItem = new Web.HierarchicalCheckboxItem(model[i], this.selectParentSelectChild, this.isCollapsable);
                        if (currentItem.parentId === '') {
                            this.model.push(currentItem);
                            this.flatModel.push(currentItem);
                            dictionary[currentItem.id] = currentItem;
                        }
                        else {
                            var parentItem = dictionary[currentItem.parentId];
                            if (parentItem !== null && parentItem !== undefined) {
                                parentItem.children.push(currentItem);
                                this.flatModel.push(currentItem);
                            }
                            else {
                            }
                        }
                    }
                    this.BindDataSource(this.model);
                };
                // returns comma seperated list
                HierarchicalCheckboxController.prototype.getValue = function () {
                    var flatModelLength = this.flatModel.length;
                    var selectedValues = '';
                    for (var i = 0; i < flatModelLength; i++) {
                        var currentItem = this.flatModel[i];
                        if (currentItem.isSelected()) {
                            if (selectedValues.length > 0) {
                                selectedValues += ',';
                            }
                            if ((this.onlyReturnChildValue && currentItem.children.length === 0) || !this.onlyReturnChildValue) {
                                selectedValues += currentItem.value;
                            }
                        }
                    }
                    return selectedValues;
                };
                HierarchicalCheckboxController.prototype.getText = function () {
                    var flatModelLength = this.flatModel.length;
                    var selectedValues = '';
                    var isAllSelected = true;
                    for (var i = 0; i < flatModelLength; i++) {
                        var currentItem = this.flatModel[i];
                        if (currentItem.isSelected()) {
                            if (selectedValues.length > 0) {
                                selectedValues += ', ';
                            }
                            selectedValues += currentItem.displayText;
                        }
                        else {
                            isAllSelected = false;
                        }
                    }
                    if (isAllSelected) {
                        selectedValues = 'All';
                    }
                    return selectedValues;
                };
                //takes in a comma seperated list
                HierarchicalCheckboxController.prototype.setValue = function (values) {
                    var valueArray = values.split(',');
                    var valueLength = valueArray.length;
                    var flatModelLength = this.flatModel.length;

                    this.clearAll();
                    for (var x = 0; x < valueLength; x++) {
                        var currentVal = valueArray[x];

                        if (currentVal[0] === '\'' && currentVal[currentVal.length - 1] === '\'') {
                            currentVal = currentVal.substring(1, currentVal.length - 1);
                        }

                        for (var y = 0; y < flatModelLength; y++) {
                            var currentItem = this.flatModel[y];
                            if (currentItem.value === currentVal) {
                                y = flatModelLength;
                                currentItem.isSelected(true);
                            }
                        }
                    }
                };
                HierarchicalCheckboxController.prototype.clearAll = function () {
                    var flatModelLength = this.flatModel.length;
                    for (var y = 0; y < flatModelLength; y++) {
                        var currentItem = this.flatModel[y];
                        currentItem.isSelected(false);
                    }
                };
                HierarchicalCheckboxController.prototype.selectAll = function () {
                    var flatModelLength = this.flatModel.length;
                    for (var y = 0; y < flatModelLength; y++) {
                        var currentItem = this.flatModel[y];
                        currentItem.isSelected(true);
                    }
                };
                HierarchicalCheckboxController.prototype.filter = function (filterText) {
                    filterText = filterText.trim().toLowerCase();
                    if (filterText !== '') {
                        var modelLength = this.model.length;
                        for (var y = 0; y < modelLength; y++) {
                            var currentItem = this.model[y];
                            var displayText = currentItem.displayText.toLowerCase();
                            PlatformConsole.log(currentItem.displayText + ' :' + displayText.indexOf(filterText));
                            if (displayText.indexOf(filterText) === -1) {
                                if (!this.checkChildrenForText(filterText, currentItem.children)) {
                                    currentItem.visible(false);
                                }
                                else {
                                    currentItem.visible(true);
                                }
                            }
                            else {
                                currentItem.visible(true);
                                this.checkChildrenForText(filterText, currentItem.children);
                            }
                        }
                    }
                    else {
                        var modelLength = this.flatModel.length;
                        for (var y = 0; y < modelLength; y++) {
                            var currentItem = this.flatModel[y];
                            currentItem.visible(true);
                        }
                    }
                };
                HierarchicalCheckboxController.prototype.checkChildrenForText = function (filterText, children) {
                    //set this flag to true if any one of items are visible
                    var childrenContainsFilterText = false;
                    var childrenLength = children.length;
                    for (var y = 0; y < childrenLength; y++) {
                        var currentItem = children[y];
                        var displayText = currentItem.displayText.toLowerCase();
                        PlatformConsole.log(currentItem.displayText + ' :' + displayText.indexOf(filterText));
                        if (displayText.toLowerCase().indexOf(filterText) === -1) {
                            if (!this.checkChildrenForText(filterText, currentItem.children)) {
                                currentItem.visible(false);
                            }
                            else {
                                currentItem.visible(true);
                                childrenContainsFilterText = true;
                            }
                        }
                        else {
                            currentItem.visible(true);
                            childrenContainsFilterText = true;
                        }
                    }
                    return childrenContainsFilterText;
                };
                return HierarchicalCheckboxController;
            })();
            Web.HierarchicalCheckboxController = HierarchicalCheckboxController;
            var HierarchicalCheckboxContainer = (function () {
                function HierarchicalCheckboxContainer() {
                    this.instances = {};
                }
                return HierarchicalCheckboxContainer;
            })();
            Web.HierarchicalCheckboxContainer = HierarchicalCheckboxContainer;
            ;
            Web.hierarchicalCheckboxContainer = new HierarchicalCheckboxContainer();
        })(Web = Platform.Web || (Platform.Web = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Web;
        (function (Web) {
            var HierarchicalCheckboxItem = (function () {
                function HierarchicalCheckboxItem(flatItem, selectChildren, collapsable) {
                    if (collapsable === void 0) { collapsable = false; }
                    this.id = flatItem.Id;
                    this.displayText = flatItem.DisplayText;
                    this.value = flatItem.Value;
                    this.isSelected = ko.observable(flatItem.IsSelected);
                    this.visible = ko.observable(true);
                    this.children = new Array();
                    this.parentId = flatItem.ParentId;
                    this.isCollapsable = collapsable;
                    this.isCollapsed = ko.observable(collapsable);
                    if (selectChildren) {
                        var self = this;
                        this.isSelected.subscribe(function (newValue) {
                            var childLen = self.children.length;
                            PlatformConsole.log('StateLen: ' + childLen);
                            for (var i = 0; i < childLen; i++) {
                                self.children[i].isSelected(newValue);
                            }
                        });
                    }
                }
                HierarchicalCheckboxItem.prototype.toggleItem = function (item, event) {
                    this.isCollapsed(!this.isCollapsed());
                    if (this.isCollapsed()) {
                        event.target.src = event.target.src.replace('minus_toggle', 'plus_toggle');
                        var imageItem = $(event.target);
                        imageItem.attr('alt', 'Expand');
                        imageItem.attr('title', 'Expand');
                    }
                    else {
                        event.target.src = event.target.src.replace('plus_toggle', 'minus_toggle');
                        var imageItem = $(event.target);
                        imageItem.attr('alt', 'Collapse');
                        imageItem.attr('title', 'Collapse');
                    }
                    $('.tooltip').tipTip();
                };
                return HierarchicalCheckboxItem;
            })();
            Web.HierarchicalCheckboxItem = HierarchicalCheckboxItem;
        })(Web = Platform.Web || (Platform.Web = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
//# sourceMappingURL=hierarchicalcheckbox.js.map