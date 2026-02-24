var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var KOTelerikCustomBinding;
            (function (KOTelerikCustomBinding) {
                function IntializeCustomBindings() {
                    InitSkipBinding();
                    InitRadComboBinding();
                }
                KOTelerikCustomBinding.IntializeCustomBindings = IntializeCustomBindings;
                function CompareArrays(array1, array2, valueProp) {
                    // if the other array is a falsy value, return
                    if (array1 === null || array1 == undefined
                        || array2 === null || array2 == undefined)
                        return false;
                    // compare lengths - can save a lot of time 
                    if (array1.length != array2.length)
                        return false;
                    for (var i = 0, l = array1.length; i < l; i++) {
                        if (array1[i][valueProp] !== array2[i][valueProp]) {
                            return false;
                        }
                    }
                    return true;
                }
                function BuildCombo(combo, modelList, defaultValue, textField, valueField) {
                    //clear current items
                    combo.trackChanges();
                    combo.clearItems();
                    combo.clearSelection();
                    var itemList = combo.get_items();
                    //var defaultValue = ko.utils.unwrapObservable(bindings['SelectedItem']) || null;
                    for (var i = 0, len = modelList.length; i < len; i++) {
                        var model = modelList[i];
                        var comboItem = new Telerik.Web.UI.RadComboBoxItem();
                        comboItem.set_text(model[textField]);
                        comboItem.set_value(model[valueField]);
                        itemList.add(comboItem);
                        if (defaultValue !== null && defaultValue === model) {
                            comboItem.select();
                        }
                    }
                    combo.commitChanges();
                }
                function InitRadComboBinding() {
                    if (!ko.bindingHandlers.radComboBinder) {
                        ko.bindingHandlers.radComboBinder = {
                            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                                var bindings = allBindings();
                                var onChange = bindings['OnChange'];
                                var selectedItem = bindings['SelectedItem'];
                                var valueField = bindings['DataValueField'] || 'Value';
                                if (typeof onChange === "function") {
                                    //set 'this' to the ViewModel
                                    onChange = onChange.bind(bindingContext.$data);
                                }
                                var combo = null;
                                combo = $find(element.id);
                                combo.add_selectedIndexChanged(function (sender, args) {
                                    var modelList = ko.utils.unwrapObservable(valueAccessor());
                                    var val = sender.get_value();
                                    var currentValue = selectedItem();
                                    if ((currentValue === null && val === null)
                                        || (currentValue !== null && currentValue[valueField] === val)) {
                                        //nothing really changed
                                        return;
                                    }
                                    var item = ko.utils.arrayFirst(modelList, function (item) {
                                        return item[valueField] == val;
                                    });
                                    selectedItem(item);
                                    if (typeof onChange === "function") {
                                        onChange(sender, args);
                                    }
                                });
                                //do not bind decendant elements. That will be done in update
                                return { 'controlsDescendantBindings': true };
                            },
                            update: function (element, valueAccessor, allBindings) {
                                var bindings, textField, valueField, modelList, combo;
                                bindings = allBindings();
                                textField = bindings['DataTextField'] || 'Text';
                                valueField = bindings['DataValueField'] || 'Value';
                                modelList = ko.utils.unwrapObservable(valueAccessor());
                                if (!Array.isArray(modelList)) {
                                    throw Error('Bound to a non array model');
                                }
                                combo = $find(element.id);
                                var selectedItem = ko.utils.unwrapObservable(bindings['SelectedItem']) || null;
                                if (!CompareArrays(element.CachedData, modelList, valueField)) {
                                    PlatformConsole.log('New datasource - Updating combo: ' + element.id);
                                    //only reset combo if collection changes
                                    element.CachedData = modelList.slice(0);
                                    BuildCombo(combo, modelList, selectedItem, textField, valueField);
                                }
                                else if (selectedItem !== null && selectedItem !== undefined) {
                                    PlatformConsole.log('combo value changed: ' + element.id);
                                    var item = combo.findItemByValue(selectedItem[valueField]);
                                    if (item != null && item != undefined && !item.get_selected()) {
                                        item.select();
                                    }
                                }
                            }
                        };
                    }
                }
                function InitSkipBinding() {
                    if (!ko.bindingHandlers.stopBinding) {
                        ko.bindingHandlers.stopBinding = {
                            init: function () {
                                return { controlsDescendantBindings: true };
                            }
                        };
                        ko.virtualElements.allowedBindings.stopBinding = true;
                    }
                }
            })(KOTelerikCustomBinding = UI.KOTelerikCustomBinding || (UI.KOTelerikCustomBinding = {}));
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
REISys.Platform.UI.KOTelerikCustomBinding.IntializeCustomBindings();
