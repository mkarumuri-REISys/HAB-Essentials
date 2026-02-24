/// <reference path="../controller/basecontroller.ts" />
/// <reference path="../controller/hierarchicalcheckbox.ts" />
/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../externalts/telerik.d.ts" />
/// <reference path="../ExternalTS/knockout.d.ts" />
/// <reference path="../ExternalTS/Platformlib.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ReiSys;
(function (ReiSys) {
    var Utilities;
    (function (Utilities) {
        var Util = (function () {
            function Util() {
            }
            //removes control by class
            Util.RemoveAllControlsByClass = function (className) {
                $('.' + className).remove();
            };
            // Gets the control by its full id
            Util.GetInputControlFullId = function (controlId) {
                return $('#' + controlId);
            };
            //Gets the control for a given id
            Util.GetControl = function (controlId) {
                return $('[id*="' + controlId + '"]');
            };
            //format date based on the specified patter
            //pattern is set to "d" by default (mm/dd/yyyy)
            Util.formatDate = function (date, pattern) {
                if (pattern === void 0) { pattern = "d"; }
                if (pattern === "d") {
                    var ymd = date.split("-");
                    var mdy = "";
                    //this code removes 0s from the front of days or months
                    if (ymd.length > 2) {
                        if (ymd[1].charAt(0) === "0")
                            ymd[1] = ymd[1].replace("0", "");
                        if (ymd[2].charAt(0) === "0")
                            ymd[2] = ymd[2].replace("0", "");
                        mdy = ymd[1] + "/" + ymd[2] + "/" + ymd[0];
                    }
                    return mdy;
                }
                return date;
            };
            //Sets the value on a control
            Util.SetValueForControl = function (controlId, value) {
                var control = $('[id*="' + controlId + '"]');
                if (control.hasClass('hierarchicalCheckboxControl')) {
                    var controlId = control.attr('id');
                    if (REISys.Platform.Web.hierarchicalCheckboxContainer) {
                        var hierarchicalCheckboxContainer = REISys.Platform.Web.hierarchicalCheckboxContainer.instances[controlId];
                        hierarchicalCheckboxContainer.setValue(value);
                    }
                }
                else {
                    var controlType = control.attr('type');
                    if (controlType === 'checkbox') {
                        var bitVal = false;
                        bitVal = value == 'true';
                        control.attr('checked', bitVal);
                    }
                    else {
                        if (control.hasClass('RadComboBoxDropDown')) {
                            var telControl = $find(controlId);
                            if (telControl === undefined || telControl === null) {
                                telControl = $find(control.attr('id'));
                            }
                            if (telControl !== undefined && telControl !== null) {
                                if (telControl.get_enabled()) {
                                    var comboItem = telControl.findItemByValue(value);
                                    if (comboItem !== null) {
                                        comboItem.select();
                                    }
                                    else if (value === "") {
                                        telControl.get_items().getItem(0).select();
                                    }
                                }
                            }
                        }
                        else {
                            var controlType = ReiSys.Utilities.Util.GetControlType(control);
                            if (control.hasClass('RadListBox')) {
                                var telControl = $find(controlId);
                                var splitValues = value.split(',');
                                var totalSplitVals = splitValues.length;
                                //telControl.clearSelection();
                                var prevCheckedItems = telControl.get_checkedItems();
                                var prevCheckedItemsLength = prevCheckedItems.length;
                                for (var x = 0; x < prevCheckedItemsLength; x++) {
                                    prevCheckedItems[x].uncheck();
                                }
                                for (var i = 0; i < totalSplitVals; i++) {
                                    var currentVal = splitValues[i];
                                    if (currentVal.charAt(0) === '"') {
                                        currentVal = currentVal.substring(1, currentVal.length - 1);
                                    }
                                    if (currentVal.charAt(currentVal.length - 1) === '"') {
                                        currentVal = currentVal.substring(0, currentVal.length - 1);
                                    }
                                    var selectedItem = telControl.findItemByValue(currentVal);
                                    if (selectedItem !== null && selectedItem !== undefined) {
                                        selectedItem.check();
                                    }
                                }
                            }
                            //PLSUP-5106
                            //Add a condition for RadDatePicker so that the value can get properly set on the control
                            else if (control.hasClass('RadPicker')) {
                                var toId = controlId.replace("From", "To");
                                var toControl = $("#" + toId);
                                if (value !== null) {
                                    var values = value.split(",");

                                    ////bsl adds _wrapper around their ids for telerik datepickers, they need to be removed so that we can use $find on the ids
                                    if (controlId.indexOf("_wrapper") !== -1)
                                        controlId = controlId.substring(0, controlId.lastIndexOf("_wrapper"));

                                    var ids = [];
                                    ids[0] = controlId;
                                    ids[1] = controlId.replace("From", "To");

                                    for (var i = 0; i < ids.length; i++) {
                                        var ctrlId = ids[i];
                                        var date = values[i];
                                        if (ctrlId !== "" && date != null) {
                                            var ctrl = $find(ctrlId);
                                            //case where we are clearing the datepicker
                                            if (date === undefined || date === "") {
                                                ctrl.clear();
                                                ctrl.set_focusedDate(new Date());
                                            }
                                                //We need to format the date because even though telerik will reformat the date when you call set_selectedDate(),
                                                //when the page is reloaded the date values for the datepicker were getting decremented when we weren't formatting the date beforehand.
                                            else
                                                ctrl.set_selectedDate(new Date(this.formatDate(date)));
                                        }
                                    }
                                }
                            }                            
                                //plsup
                                //check for checkboxlist, radiobuttonlist, and listbox, these controls can't be checked by 'hasClass'
                                //code review make the controltype checks case insensitive
                                else if (controlType == "checkbox") {
                                    
                                    var boxes = control.find("span[datavalue]");
                                    var values = value.split(",");
                                    for (var i = 0; i < boxes.length; i++) {
                                        //if the array of values contains the datavalue of this checkbox input, check the box, else uncheck it
                                        if (values.indexOf($(boxes[i]).attr("datavalue")) != -1)
                                            $(boxes[i]).find("input").attr("checked", function () { return true; });
                                        else
                                            $(boxes[i]).find("input").attr("checked", function () { return false; });
                                    }
                                }
                                else if (controlType == "radio") {
                                    if (value.indexOf(",") == -1)
                                        control.find('input[value=' + value + ']').attr("checked", function () { return true; });
                                }
                                 else if (control.is("select")) {
                                    var options = control.find("option");
                                    var values = value.split(",");
                                    for (var i = 0; i < options.length; i++) {
                                        if (values.indexOf($(options[i]).val()) != -1)
                                            $(options[i]).attr("selected", function () { return true;});
                                        else
                                            $(options[i]).attr("selected", function () { return false; });
                                    }
                                }
                                else {
                                    control.val(value);
                                }
                                    
                            
                        }
                    }
                }
            };
            //Safe version of GetControlValue Returns changes arrays into CSV and replaces |
            Util.GetControlValueCSV = function (controlId, controlType) {
                // PLSUP-5077 -- Read the PLSUP-5077 comments in GetControlValue to understand why the 'true' flag was added.
                var csv = ReiSys.Utilities.Util.GetControlValue(controlId, true);
                var returnCsv = '';
                var isFirst = 'true';
                switch (controlType) {
                    case 'REITextBox':
                        returnCsv = csv;
                        break;
                    case 'REIDropDownList':
                        returnCsv = csv;
                        break;
                    case 'REIListBox':
                        var REIListBoxCsv = '';
                        if (csv != undefined && csv != '') {
                            var csvLen = csv.length;
                            for (var i = 0; i < csvLen; i++) {
                                if (isFirst == 'true') {
                                    REIListBoxCsv = csv[i];
                                }
                                else {
                                    REIListBoxCsv += "," + csv[i];
                                }
                                isFirst = 'false';
                            }
                        }
                        returnCsv = REIListBoxCsv;
                        returnCsv = ReiSys.Utilities.Util.AddQuotes(returnCsv);
                        break;
                    case 'REITextBox':
                        returnCsv = csv;
                        break;
                    case 'REICheckBoxList':
                        returnCsv = csv;
                        break;
                    case 'REIRadComboBox':
                        returnCsv = csv;
                        break;
                    case 'REIRadioButtonList':
                        returnCsv = csv;
                        break;
                    case 'REIDatePicker':
                        returnCsv = csv;
                        break;
                    case 'REIRadListBox':
                        var REIRadListBoxCsv = csv.split('|').join(',');
                        returnCsv = REIRadListBoxCsv;
                        returnCsv = ReiSys.Utilities.Util.AddQuotes(returnCsv);
                        break;
                    case undefined:
                        if (csv != null)
                            returnCsv = csv.replace(/\|/g, ',');
                        break;
                }
                return returnCsv;
            };
            // Add quotes to a CSV list
            Util.AddQuotes = function (csv) {
                return csv.split(',').map(function (item) { return item.trim(); }).filter(Boolean).map(function (item) { return "'" + item + "'"; }).join(',');
            };
            //Gets the value from the control
            Util.GetControlValue = function (controlId, fromCSV) {
                if (typeof (fromCSV) === 'undefined')
                    fromCSV = false;
                var value = '';
                var control = $('[id="' + controlId + '"]');
                if (control.hasClass('hierarchicalCheckboxControl')) {
                    var controlId = control.attr('id');
                    if (REISys.Platform.Web.hierarchicalCheckboxContainer) {
                        var hierarchicalCheckboxContainer = REISys.Platform.Web.hierarchicalCheckboxContainer.instances[controlId];
                        value = hierarchicalCheckboxContainer.getValue();
                    }
                }
                else {
                    if (control.length == 0 || control == null || control == undefined) {
                        control = $('[id*="' + controlId + '"]');
                    }
                    if (control.length > 1) {
                        if (!$(control[0]).hasClass('RadEditor')) {
                            if (!$(control[0]).hasClass('RadListBox')) {
                                if (!$(control[0]).hasClass('RadComboBox')) {
                                    var controlType = ReiSys.Utilities.Util.GetControlType(control);
                                    if (controlType != undefined) {
                                        if (controlType == 'radio') {
                                            var control2Len = control.length;
                                            for (var i = 0; i < control2Len; i++) {
                                                var loopInstance = $(control[i]);
                                                if (loopInstance.attr('type') == 'radio') {
                                                    if (loopInstance.is(":checked")) {
                                                        if (value != '') {
                                                            value += '|';
                                                        }
                                                        value += loopInstance.val();
                                                    }
                                                }
                                            }
                                        }
                                        else if (controlType == 'checkbox') {
                                            var controlLen = control.length;
                                            for (var i = 0; i < controlLen; i++) {
                                                var loopInstance = $(control[i]);
                                                if (loopInstance.attr('type') == 'checkbox') {
                                                    if (loopInstance.is(":checked")) {
                                                        value += 'checked'; //loopInstance.val();
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            if (control[0].id.indexOf("wrapper") !== -1) {
                                                value = $(control[1]).val();
                                            }
                                            else {
                                                var tempControl = $('[id$="' + controlId + '"]');
                                                if (tempControl.length === 1) {
                                                    if (tempControl.hasClass('RadComboBox')) {
                                                        var tempTelControl = $find(tempControl.attr('id'));
                                                        value = String(tempTelControl.get_value());
                                                    }
                                                    else {
                                                        value = tempControl.val();
                                                    }
                                                }
                                                else {
                                                    value = $(control[1]).val();
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        var controlTextLen = control.length;
                                        for (var i = 0; i < controlTextLen; i++) {
                                            var loopInstance = $(control[i]);
                                            if (loopInstance.is("textarea")) {
                                                value = loopInstance.val();
                                            }
                                            else {
                                            }
                                        }
                                    }
                                }
                                else {
                                    var telcontrol = $find(control[0].id);
                                    var value = String(telcontrol.get_value());
                                }
                            }
                            else {
                                value = Util.GetTelerikListBoxValue(control[0].id);
                            }
                        }
                        else {
                            //RadEditor
                            value = Util.GetTelerikEditorControlValue(control[0].id);
                        }
                    }
                    else if (control.length == 0 || control == null || control == undefined) {
                        throw new Error('Control with id of ' + controlId + ' could not be found');
                    }
                    else {
                        if (control.attr('type') == 'radio' || control.attr('type') == 'checkbox') {
                            value = control.is(":checked") + '';
                        }
                        else if (control.hasClass('RadEditor')) {
                            value = Util.GetTelerikEditorControlValue(controlId);
                        }
                        else if (control.hasClass('RadListBox')) {
                            value = Util.GetTelerikListBoxValue(controlId);
                        }
                        else if (control.hasClass('RadComboBox')) {
                            var telcontrol = $find(controlId);
                            value = String(telcontrol.get_value());
                        }
                        else {
                            if (control.is('table') || control.is('span')) {
                                if (fromCSV) {
                                    /*
                                     * PLSUP-5077 -- Gets the DataValues of selected checkbox items in the checkboxlist.
                                     * The reason we are not using GetControlValue is because that method is used by multiple
                                     * components and any change made to Get DataValue from checkbox list will be tricky. In this method, instead of returning a list of checked items separated by a pipe('|')
                                     * sign, we will be returning values with a comma separated list. This method, for now, will only be invoked for CSLF search panel so that any SQL queries that are generated
                                     * do not use the pipe sign in where conditions. Doing so breaks the SQL queries. Solutions should also change any of their SQL query's where conditions to CAST the field
                                     * that they are comparing the checkboxlist value to a VARCHAR. If your field is of type 'bit' and you're trying to compare with this returned value, things will break.
                                    */
                                    var loopCollection = $('input', control);
                                    // PLSUP-5077 -- Get all the spans that contain the "datavalue" attribute
                                    var loopSpanCollection = $('span', control);
                                    if (loopCollection.length != 0) {
                                        for (var i = 0; i < loopCollection.length; i++) {
                                            var loopInstance = $(loopCollection[i]);
                                            //plsup
                                            //added this if condition to check if the input element is radio type, and if so gets the whatever value is checked.
                                            //the code below that checks for radio type is never reached for reiradiobuttonlist control because loopspancollection.length will be 0
                                            //also, reiradiobuttonlist only supports single selection, so it doesn't need to loop over each item, just find the one that is checked using jquery
                                            if (loopInstance.attr("type") == "radio")
                                                value = control.find(":checked").val();
                                            if (loopSpanCollection.length != 0) {
                                                // PLSUP-5077 -- For the current checkbox item, get the span
                                                var spanInstance = $(loopSpanCollection[i]);
                                                var lookUpType = loopInstance.attr('type');
                                                if (lookUpType == 'radio' || lookUpType == 'checkbox') {
                                                    if (loopInstance.is(":checked")) {
                                                        if (value != '') {
                                                            value += ',';
                                                        }
                                                        if (lookUpType == 'radio') {
                                                            value += loopInstance.val();
                                                        }
                                                        else {
                                                            // PLSUP-5077 -- Get the DataValue for the checked item
                                                            value += spanInstance.attr('datavalue');
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        loopCollection = $('select', control);
                                        if (loopCollection.length != 0) {
                                            value = loopCollection.val();
                                        }
                                        else {
                                            value = control.val();
                                        }
                                    }
                                }
                                else {
                                    var loopCollection = $('input', control);
                                    if (loopCollection.length != 0) {
                                        for (var i = 0; i < loopCollection.length; i++) {
                                            var loopInstance = $(loopCollection[i]);
                                            var lookUpType = loopInstance.attr('type');
                                            if (lookUpType == 'radio' || lookUpType == 'checkbox') {
                                                if (loopInstance.is(":checked")) {
                                                    if (value != '') {
                                                        value += '|';
                                                    }
                                                    if (lookUpType == 'radio') {
                                                        value += loopInstance.val();
                                                    }
                                                    else {
                                                        value += 'checked';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        loopCollection = $('select', control);
                                        if (loopCollection.length != 0) {
                                            value = loopCollection.val();
                                        }
                                        else {
                                            value = control.val();
                                        }
                                    }
                                }
                            }
                            else {
                                value = control.val();
                            }
                        }
                    }
                    
                    if (value == null || value == undefined) {
                        value = '';
                    }
                }
                return value;
            };
            Util.GetTelerikEditorControlValue = function (controlId) {
                var telcontrol = $find(controlId);
                var value = telcontrol.get_text();
                return value;
            };
            Util.GetTelerikListBoxValue = function (controlId) {
                var telcontrol = $find(controlId);
                var value = '';
                var selectedItems = telcontrol.get_selectedItems();
                var checkedItems = telcontrol.get_checkedItems();
                var chkboxes = $('#' + controlId + ' input[type=checkbox]');
                if (chkboxes.length === 0) {
                    for (var i = 0; i < selectedItems.length; i++) {
                        if (value.length != 0) {
                            value += '|';
                        }
                        value += selectedItems[i].get_value();
                    }
                }
                else {
                    for (var i = 0; i < checkedItems.length; i++) {
                        if (value.length != 0) {
                            value += '|';
                        }
                        value += checkedItems[i].get_value();
                    }
                }
                return value;
            };
            Util.GetControlType = function (control) {
                var controlType = '';
                if (control.length > 0) {
                    for (var i = 1; i < control.length; i++) {
                        var loopInstance = $(control[i]);
                        controlType = loopInstance.attr('type');
                    }
                }
                else {
                    controlType = control.attr('type');
                }
                return controlType;
            };
            //Set the attrivute for a control
            Util.SetControlAttribute = function (controlId, attribute, value) {
                $('[id*="' + controlId + '"]').attr(attribute, value);
            };
            Util.AddClass = function (controlId, value) {
                $('[id*="' + controlId + '"]').addClass(value);
            };
            //gets the atttribute of a control
            Util.GetControlAttributeValue = function (controlId, attribute) {
                return $('[id*="' + controlId + '"]').attr(attribute);
            };
            //gets the atttribute of a control
            Util.RemoveClassFromAllControls = function (className) {
                $('.' + className + '').removeClass(className);
            };
            //Checks if is valid numeric
            Util.IsValidNumeric = function (inputValue) {
                var isValid = false;
                var numberPattern1 = new RegExp('^((?:(?:\\+|-)?(?:(?:\\d{1,3})(?:,\\d{3})*)(?:\\.\\d*)?)|(?:(?:\\+|-)?(?:\\d)*(?:\\.\\d*)?))$');
                if (numberPattern1.test(inputValue)) {
                    if (inputValue != '.' && inputValue != '+' && inputValue != '-' && inputValue != '') {
                        isValid = true;
                    }
                }
                return isValid;
            };
            //trims a string IE8 does not support default trim function
            Util.TrimString = function (input) {
                return $.trim(input);
            };
            Util.EndsWith = function (str, suffix) {
                return str.indexOf(suffix, str.length - suffix.length) !== -1;
            };
            //Posts Json to a given service URL
            Util.PostJsonToService = function (serviceUrl, jsonString) {
                var result = null;
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: serviceUrl,
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    data: jsonString,
                    headers: {
                        "SetAnon": "true"
                    },
                    success: function (html) {
                        result = html;
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var localConsole = new ReiSys.Utilities.PlatformConsole();
                        localConsole.log(errorThrown + ' ' + jsonString);
                    }
                });
                return result;
            };
            Util.PostJsonToServiceWithNoParams = function (serviceUrl) {
                var result = null;
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: serviceUrl,
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    headers: {
                        "SetAnon": "true"
                    },
                    success: function (html) {
                        result = html;
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var localConsole = new ReiSys.Utilities.PlatformConsole();
                        localConsole.log(errorThrown);
                    }
                });
                return result;
            };
            Util.PostJsonToServiceAsync = function (serviceUrl, jsonString, successCallback, errorCallback) {
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: serviceUrl,
                    async: true,
                    contentType: 'application/json; charset=utf-8',
                    data: jsonString,
                    headers: {
                        "SetAnon": "true"
                    },
                    success: function (data) {
                        if (successCallback) {
                            successCallback(data);
                        }
                    },
                    error: function (xhr, status, error) {
                        if (errorCallback) {
                            errorCallback(xhr, status, error);
                        }
                    }
                });
            };
            Util.PostJsonToServiceWithNoParamsAndIncreaseTime = function (serviceUrl) {
                var result = null;
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: serviceUrl,
                    async: false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (html) {
                        result = html;
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var localConsole = new ReiSys.Utilities.PlatformConsole();
                        localConsole.log(errorThrown);
                    }
                });
                return result;
            };
            //Make an ajax request and get the promise back
            Util.MakeAjaxRequest = function (url, jsonString, action, contentType, dataType) {
                if (action === void 0) { action = 'GET'; }
                if (contentType === void 0) { contentType = "application/json; charset=utf-8"; }
                if (dataType === void 0) { dataType = "json"; }
                var promise = $.ajax({
                    type: action,
                    url: url,
                    contentType: contentType,
                    dataType: dataType,
                    data: jsonString,
                    async: true
                });
                promise.fail(function (args) {
                    if (args.status == 401) {
                        ReiSys.Platform.Controller.BaseController.RedirectToLoginPage();
                    }
                });
                return promise;
            };
            Util.FocusOnControl = function (controlId) {
                $('#' + controlId).focus();
            };
            Util.FocusOnControlFirstInput = function (controlId) {
                var focusFound = true;
                //focusable control
                var control = $('[id*="' + controlId + '"]:focusable:visible:first:not("a")');
                if (control.length > 0) {
                    var radControl = $find(control[0].id);
                    if (radControl !== null && radControl.get_dateInput) {
                        radControl.get_dateInput().focus();
                    }
                    else if (radControl !== null && radControl.setFocus) {
                        radControl.setFocus();
                    }
                    else {
                        control.focus();
                    }
                }
                else {
                    //control with a focusable descendant control
                    control = $('[id*="' + controlId + '"] :focusable:visible:first:not("a")');
                    if (control.length > 0) {
                        control.focus();
                    }
                    else {
                        //RadEditor
                        control = $('[id*="' + controlId + '_rEditor"]');
                        if (control.length > 0) {
                            var radControl = $find(control[0].id);
                            if (radControl !== null && radControl.setFocus) {
                                radControl.setFocus();
                            }
                            else {
                                focusFound = false;
                            }
                        }
                        else {
                            //set tabindex on control with matching ID
                            control = $('[id*="' + controlId + '"]:visible:first');
                            if (control.length > 0) {
                                //RadListBox
                                var liItems = control.find('div li');
                                if (liItems.length > 0) {
                                    control.attr('tabindex', '-1');
                                    control.focus();
                                    liItems.focus(function () {
                                        $(this).addClass('rlbActive'); //console.log('focus: ' + $(this).attr("id"));
                                    });
                                    liItems.blur(function () {
                                        $(this).removeClass('rlbActive');
                                    });
                                    liItems.attr('tabindex', '0');
                                }
                                else
                                    focusFound = false;
                            }
                            else
                                focusFound = false;
                        }
                    }
                }
                return focusFound;
            };
            Util.BringFocusToControlOrPlaceHolder = function (controlId, placeholderId) {
                if (controlId === '') {
                    PlatformUtil.BringFocusToDivValidation(placeholderId);
                }
                else {
                    //look for exact ID match
                    var control = $('#' + controlId + ':focusable:visible');
                    if (control.length > 0) {
                        control.focus();
                    }
                    else {
                        //repeaters - controlId passed contains a unique "_ctlX_" which we will use to find an exact placeholder match
                        //otherwise PlatformUtil.FocusOnControlFirstInput uses id contains, which will find something unexpected to focus on since there will be many elements sharing the same ID fragment
                        //there should not be multiple placeholders with the exact same ID, but this is how our legacy validation framework works for repeaters - too much code to rewrite right now
                        var phItemsWithId = $('[id="' + placeholderId + '"]');
                        var repeaterPlaceholderFound = false;
                        if (phItemsWithId.length > 1) {
                            control = $('[id^="' + controlId + '_"] #' + placeholderId + ' > span.tooltip');
                            if (control.length > 0) {
                                control.focus();
                                repeaterPlaceholderFound = true;
                            }
                        }
                        if (!repeaterPlaceholderFound) {
                            //look for a focusable control with the control ID
                            var foundFocus = PlatformUtil.FocusOnControlFirstInput(controlId);
                            if (!foundFocus) {
                                //focus on placeholder
                                PlatformUtil.BringFocusToDivValidation(placeholderId);
                            }
                        }
                    }
                }
                window.scrollBy(0, 50);
            };
            Util.BringFocusToDivValidation = function (placeholderId) {
                var item = $('#' + placeholderId + ' span.tooltip');
                if (item.length == 0) {
                    //client side validation
                    item = $(".fielderr_info.ClientValidationClass[id='-" + placeholderId + "'] > span.tooltip");
                }
                item.focus();
            };
            Util.BringFocusToControlsOrPlaceHolder = function (controlIds, placeholderId) {
                if (controlIds.length === 1) {
                    PlatformUtil.BringFocusToControlOrPlaceHolder(controlIds[0], placeholderId);
                }
                else {
                    PlatformUtil.BringFocusToControlOrPlaceHolder('', placeholderId);
                }
            };
            Util.Contains = function (inputArray, keyToFind) {
                if (inputArray != null && inputArray.length > 0) {
                    for (var i = 0; i < inputArray.length; i++) {
                        if (inputArray[i] === keyToFind)
                            return true;
                    }
                }
                return false;
            };
            Util.GetQueryStringParameter = function (key) {
                var sPageURL = window.location.search.substring(1);
                var sURLVariables = sPageURL.split('&');
                for (var i = 0; i < sURLVariables.length; i++) {
                    var sParameterName = sURLVariables[i].split('=');
                    if (sParameterName[0] == key) {
                        return sParameterName[1];
                    }
                }
                return null;
            };
            /**
             * update filter control value/display based on filter expression
             * @param filterExpression
             */
            Util.SetValueForFilterControl = function (gridId, columnUniqueName, fieldValue) {
                var grid = $telerik.findGrid(gridId);
                if (grid !== undefined) {
                    if (grid) {
                        var tableView = grid.get_masterTableView();
                        var filterCell = tableView._getFilterCellByColumnUniqueName(columnUniqueName);
                        var filterCtrl = filterCell.getElementsByTagName("input")[0];
                        if (!filterCtrl)
                            return;
                        var ctrl = $find(filterCtrl.id.replace("_Input", ""));
                        if (ctrl === null || ctrl === undefined) {
                            if (filterCtrl.type === "text")
                                filterCtrl.value = fieldValue;
                        }
                        else {
                            if (Object.getType(ctrl).getName() === 'Telerik.Web.UI.RadComboBox') {
                                ctrl.trackChanges();
                                if (fieldValue === "") {
                                    ctrl.get_items().getItem(0).select();
                                }
                                else {
                                    var item = ctrl.findItemByValue(fieldValue);
                                    ctrl.get_items().getItem(item.get_index()).select();
                                }
                                ctrl.updateClientState();
                                ctrl.commitChanges();
                            }
                            else if (Object.getType(ctrl).getName() === 'Telerik.Web.UI.RadDatePicker') {
                                if (fieldValue === "") {
                                    ctrl.clear();
                                    ctrl.set_focusedDate(new Date());
                                }
                                else {
                                    ctrl.set_selectedDate(new Date(fieldValue));
                                }
                            }
                            else {
                                var value = fieldValue.replace(/'/g, "").split("|").join(",");
                                ReiSys.Utilities.Util.SetValueForControl(filterCtrl.id.replace("_Input", ""), value);
                            }
                        }
                    }
                }
            };
            //PLSUP-5125
            Util.GetControlText = function (controlId, controlType) {
                var value = "";
                var control = $('[id="' + controlId + '"]');
                //How to get the text varies depending on the control. These are all of the controls supported by CSLF
                switch (controlType) {
                    case "REIRadListBox":
                        var telControl = $find(controlId);
                        var checked = telControl.get_checkedItems();
                        for (var i = 0; i < checked.length; i++) {
                            if (checked[i].get_text().toLowerCase().contains("all")) {
                                value += "All";
                                break;
                            }
                            else {
                                value += checked[i].get_text();
                                if (i != checked.length - 1)
                                    value += ", ";
                            }
                        }
                        break;
                    case "REIDatePicker":
                        value = control.val();
                        break;
                    case "REIDropDownList":
                        value = control.val();
                        break;
                    case "REIRadioButtonList":
                        var loopCollection = $('input', control);
                        for (var i = 0; i < loopCollection.length; i++) {
                            var loopInstance = $(loopCollection[i]);
                            if (loopInstance.is(":checked")) {
                                value = $("label[for='" + loopInstance[0].id + "']").text();
                                break;
                            }
                        }
                        break;
                    case "REICheckBoxList":
                        var loopCollection = $('input', control);
                        var checkedCount = 0;
                        for (var i = 0; i < loopCollection.length; i++) {
                            var loopInstance = $(loopCollection[i]);
                            if (loopInstance.is(":checked")) {
                                checkedCount++;
                                value += $("label[for='" + loopInstance[0].id + "']").text() + ", ";
                                if (checkedCount == loopCollection.length)
                                    value = "All";
                            }
                        }
                        value = value.substring(0, value.lastIndexOf(", "));
                        break;
                    case "REITextBox":
                        value = control.val();
                        break;
                    case "REIListBox":
                        var REIListBoxOptionElement = (function (_super) {
                            __extends(REIListBoxOptionElement, _super);
                            function REIListBoxOptionElement() {
                                _super.apply(this, arguments);
                            }
                            return REIListBoxOptionElement;
                        })(Element);
                        var allSelected = true;
                        var children = control[0].children;
                        for (var i = 0; i < children.length; i++) {
                            var optionElement = children[i];
                            if (optionElement.selected)
                                value += children[i].textContent + ", ";
                            else
                                allSelected = false;
                        }
                        if (allSelected)
                            value = "All";
                        else
                            value = value.substring(0, value.lastIndexOf(", "));
                        break;
                }
                return value;
            };
            return Util;
        })();
        Utilities.Util = Util;
        //This classes methods compare one value to another and handle types
        var Comparer = (function () {
            function Comparer() {
            }
            //Compares 2 values (number, date or string) and determines if they are equal
            Comparer.IsEqual = function (inputValue, compareValue) {
                var isEqual = false;
                var dateNumberCompare = Date.parse(compareValue);
                if (isNaN(dateNumberCompare)) {
                    if (ReiSys.Utilities.Util.IsValidNumeric(compareValue)) {
                        var compareValNum = parseFloat(compareValue.replace(',', ''));
                        if (ReiSys.Utilities.Util.IsValidNumeric(compareValue)) {
                            var inputvalNum = parseFloat(inputValue.replace(',', ''));
                            if (compareValNum == inputvalNum) {
                                isEqual = true;
                            }
                        }
                    }
                    else {
                        if (compareValue == inputValue) {
                            isEqual = true;
                        }
                    }
                }
                else {
                    var inputDate = Date.parse(inputValue);
                    if (dateNumberCompare == inputDate) {
                        isEqual = true;
                    }
                }
                return isEqual;
            };
            //Compares 2 values (number, date) and determines if they are if the input is greater to or equal than the comparevalue
            Comparer.GreaterThanEqual = function (inputValue, compareValue) {
                var pass = true;
                if (ReiSys.Utilities.Comparer.IsValidNumericOperations(compareValue)) {
                    var compareValueParse = parseFloat(compareValue.replace(',', ''));
                    if (!ReiSys.Utilities.Comparer.IsValidNumericOperations(inputValue)) {
                        pass = false;
                    }
                    else {
                        var valueParse = parseFloat(inputValue.replace(',', ''));
                        if (valueParse < compareValueParse) {
                            pass = false;
                        }
                    }
                }
                else {
                    var datecompareValueParse = Date.parse(compareValue);
                    if (!isNaN(datecompareValueParse)) {
                        var dateinputValue = Date.parse(inputValue);
                        if (!isNaN(dateinputValue)) {
                            if (dateinputValue < datecompareValueParse) {
                                pass = false;
                            }
                        }
                        else {
                            pass = false;
                        }
                    }
                    else {
                        pass = false;
                    }
                }
                return pass;
            };
            //Compares 2 values (number, date) and determines if they are if the input is less than or equal to the comparevalue
            Comparer.LessThanEqual = function (inputValue, compareValue) {
                var pass = true;
                if (ReiSys.Utilities.Comparer.IsValidNumericOperations(compareValue)) {
                    var compareValueParse = parseFloat(compareValue.replace(',', ''));
                    if (!ReiSys.Utilities.Comparer.IsValidNumericOperations(inputValue)) {
                        pass = false;
                    }
                    else {
                        var valueParse = parseFloat(inputValue.replace(',', ''));
                        if (valueParse > compareValueParse) {
                            pass = false;
                        }
                    }
                }
                else {
                    var datecompareValueParse = Date.parse(compareValue);
                    if (!isNaN(datecompareValueParse)) {
                        var dateinputValue = Date.parse(inputValue);
                        if (!isNaN(dateinputValue)) {
                            if (dateinputValue > datecompareValueParse) {
                                pass = false;
                            }
                        }
                        else {
                            pass = false;
                        }
                    }
                    else {
                        pass = false;
                    }
                }
                return pass;
            };
            //Compares 2 values (number, date) and determines if they are if the input is greater than the comparevalue
            Comparer.GreaterThan = function (inputValue, compareValue) {
                var pass = true;
                if (ReiSys.Utilities.Comparer.IsValidNumericOperations(compareValue)) {
                    var compareValueParse = parseFloat(compareValue.replace(',', ''));
                    if (!ReiSys.Utilities.Comparer.IsValidNumericOperations(inputValue)) {
                        pass = false;
                    }
                    else {
                        var valueParse = parseFloat(inputValue.replace(',', ''));
                        if (valueParse <= compareValueParse) {
                            pass = false;
                        }
                    }
                }
                else {
                    var datecompareValueParse = Date.parse(compareValue);
                    if (!isNaN(datecompareValueParse)) {
                        var dateinputValue = Date.parse(inputValue);
                        if (!isNaN(dateinputValue)) {
                            if (dateinputValue <= datecompareValueParse) {
                                pass = false;
                            }
                        }
                        else {
                            pass = false;
                        }
                    }
                    else {
                        pass = false;
                    }
                }
                return pass;
            };
            //Compares 2 values (number, date) and determines if they are if the input is less than the comparevalue
            Comparer.LessThan = function (inputValue, compareValue) {
                var pass = true;
                if (ReiSys.Utilities.Comparer.IsValidNumericOperations(compareValue)) {
                    var compareValueParse = parseFloat(compareValue.replace(',', ''));
                    if (!ReiSys.Utilities.Comparer.IsValidNumericOperations(inputValue)) {
                        pass = false;
                    }
                    else {
                        var valueParse = parseFloat(inputValue.replace(',', ''));
                        if (valueParse >= compareValueParse) {
                            pass = false;
                        }
                    }
                }
                else {
                    var datecompareValueParse = Date.parse(compareValue);
                    if (!isNaN(datecompareValueParse)) {
                        var dateinputValue = Date.parse(inputValue);
                        if (!isNaN(dateinputValue)) {
                            if (dateinputValue >= datecompareValueParse) {
                                pass = false;
                            }
                        }
                        else {
                            pass = false;
                        }
                    }
                    else {
                        pass = false;
                    }
                }
                return pass;
            };
            // returns true if the value Is null empty undefined
            Comparer.IsNullEmptyUndefined = function (value) {
                var toReturn = false;
                if (value == undefined || value == null) {
                    toReturn = true;
                }
                else {
                    if (value == '') {
                        toReturn = true;
                    }
                }
                return toReturn;
            };
            //This is only used for the number to compare to valid number for mathmatical operaters
            Comparer.IsValidNumericOperations = function (inputValue) {
                var isValid = false;
                var numberPattern1 = new RegExp('^((?:(?:\\+|-)?(?:(?:\\d{1,3})(?:,\\d{3})*)(?:\\.\\d*)?)|(?:(?:\\+|-)?(?:\\d)*(?:\\.\\d*)?))$');
                if (numberPattern1.test(inputValue)) {
                    if (inputValue != '.' && inputValue != '+' && inputValue != '-' && inputValue != '') {
                        isValid = true;
                    }
                }
                return isValid;
            };
            return Comparer;
        })();
        Utilities.Comparer = Comparer;
        //platform console.
        var PlatformConsole = (function () {
            function PlatformConsole() {
            }
            //will display in console if console is avalible and if dbg is set to 1 or 2 in the query string
            PlatformConsole.prototype.log = function (message) {
                if (typeof console != "undefined") {
                    var dbg = this.getURLParameter('dbg');
                    if (dbg != null) {
                        if (dbg == '1' || dbg == '2') {
                            console.log(message);
                        }
                    }
                }
            };
            //checks the query string for a value
            PlatformConsole.prototype.getURLParameter = function (name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
            };
            return PlatformConsole;
        })();
        Utilities.PlatformConsole = PlatformConsole;
        var CookieHandler = (function () {
            function CookieHandler() {
            }
            CookieHandler.GetCookie = function (cookieName) {
                var c_value = document.cookie;
                var c_start = c_value.indexOf(" " + cookieName + "=");
                if (c_start == -1) {
                    c_start = c_value.indexOf(cookieName + "=");
                }
                if (c_start == -1) {
                    c_value = null;
                }
                else {
                    c_start = c_value.indexOf("=", c_start) + 1;
                    var c_end = c_value.indexOf(";", c_start);
                    if (c_end == -1) {
                        c_end = c_value.length;
                    }
                    c_value = unescape(c_value.substring(c_start, c_end));
                }
                return c_value;
            };
            //Get 
            CookieHandler.SetCookie = function (cookieName, value, expirationInDay) {
                var exdate = new Date();
                exdate.setTime(exdate.getTime() + (expirationInDay * 24 * 60 * 60 * 1000));
                var c_value = escape(value) + ((expirationInDay == null) ? "" : "; expires=" + exdate.toUTCString()) + ";path=/";
                document.cookie = cookieName + "=" + c_value;
            };
            return CookieHandler;
        })();
        Utilities.CookieHandler = CookieHandler;
    })(Utilities = ReiSys.Utilities || (ReiSys.Utilities = {}));
})(ReiSys || (ReiSys = {}));
// global instance of a platform console
var PlatformConsole = new ReiSys.Utilities.PlatformConsole();
var PlatformUtil = ReiSys.Utilities.Util;
var ReiSys;
(function (ReiSys) {
    var Utilities;
    (function (Utilities) {
        var PlatformEvent = (function () {
            function PlatformEvent() {
                this.fn = [];
            }
            //subscribe a function to the event (Should have (sender, args) as its arguments)
            PlatformEvent.prototype.subscribe = function (fn) {
                this.fn[this.fn.length] = fn;
            };
            //unsubscribe a function from an event
            PlatformEvent.prototype.unsubscribe = function (fn) {
                var i = 0;
                for (i = 0; i < this.fn.length; i++) {
                    if (this.fn[i] == fn) {
                        this.fn.splice(i, 1);
                        break;
                    }
                }
            };
            //Raise the event with given parameters
            PlatformEvent.prototype.raise = function (sender, args) {
                var i = 0;
                for (i = 0; i < this.fn.length; i++) {
                    this.fn[i](sender, args);
                }
            };
            return PlatformEvent;
        })();
        Utilities.PlatformEvent = PlatformEvent;
    })(Utilities = ReiSys.Utilities || (ReiSys.Utilities = {}));
})(ReiSys || (ReiSys = {}));
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Utils;
        (function (Utils) {
            var Dictionary = (function () {
                function Dictionary() {
                    this._keys = new Array();
                    this._values = new Array();
                }
                Dictionary.prototype.add = function (key, value) {
                    this[key] = value;
                    this._keys.push(key);
                    this._values.push(value);
                };
                Dictionary.prototype.getValue = function (key) {
                    for (var i = 0; i < this._keys.length; i++) {
                        if (this._keys[i] === key && this._values[i] != null) {
                            return this._values[i];
                        }
                    }
                    return null;
                };
                Dictionary.prototype.remove = function (key) {
                    var index = this._keys.indexOf(key, 0);
                    this._keys.splice(index, 1);
                    this._values.splice(index, 1);
                    delete this[key];
                };
                Dictionary.prototype.keys = function () {
                    return this._keys;
                };
                Dictionary.prototype.values = function () {
                    return this._values;
                };
                Dictionary.prototype.containsKey = function (key) {
                    if (typeof this[key] === "undefined") {
                        return false;
                    }
                    //var index = this._keys.indexOf(key, 0);
                    //if (index > -1) {
                    //    return true;
                    //}
                    return true;
                };
                Dictionary.prototype.length = function () {
                    return this._keys.length;
                };
                Dictionary.prototype.toLookup = function () {
                    return this;
                };
                Dictionary.prototype.clear = function () {
                    var tmpKeys = this.keys();
                    for (var i = 0; i < tmpKeys.length; i++) {
                        this.remove(tmpKeys[i]);
                    }
                };
                return Dictionary;
            })();
            Utils.Dictionary = Dictionary;
            function updateQueryStringParameter(uri, key, value) {
                var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
                var separator = uri.indexOf('?') !== -1 ? "&" : "?";
                if (uri.match(re)) {
                    return uri.replace(re, '$1' + key + "=" + value + '$2');
                }
                else {
                    return uri + separator + key + "=" + value;
                }
            }
            Utils.updateQueryStringParameter = updateQueryStringParameter;
            function getQueryStringParameterValue(uri, key) {
                key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + key + "=([^&#]*)", 'i'), results = regex.exec(uri);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            }
            Utils.getQueryStringParameterValue = getQueryStringParameterValue;
            function addQueryStringVarFromUrl(uri, querystring) {
                if (!querystring || querystring.length === 0)
                    return uri;
                if (uri.indexOf('?') < 0) {
                    uri += '?';
                }
                var val;
                for (var i = 0; i < querystring.length; i++) {
                    val = ReiSys.Platform.Utils
                        .getQueryStringParameterValue(window.location.href, querystring[i]);
                    if (val !== '') {
                        uri += '&' + querystring[i] + '=' + val;
                    }
                }
                return uri;
            }
            Utils.addQueryStringVarFromUrl = addQueryStringVarFromUrl;
        })(Utils = Platform.Utils || (Platform.Utils = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=util.js.map