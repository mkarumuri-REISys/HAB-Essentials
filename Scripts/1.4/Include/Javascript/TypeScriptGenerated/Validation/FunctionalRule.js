/// <reference path="Validation.ts" />
/// <reference path="../Utilities/Util.ts"/>
var ReiSys;
(function (ReiSys) {
    var BusinessLayer;
    (function (BusinessLayer) {
        var BusinessLogic;
        (function (BusinessLogic) {
            var Validation;
            (function (Validation) {
                //functional rule class
                var FunctionalRule = (function () {
                    //constructor
                    function FunctionalRule(json) {
                        //This indicates if the rule is enabled and if it will validate 
                        this.IsRuleEnabled = true;
                        this.FRuleParam = [];
                        this.controlIds = [];
                        if (json.hasOwnProperty('VCode')) {
                            this.VCode = json.VCode;
                        }
                        if (json.hasOwnProperty('ValidationPlaceHolder')) {
                            this.ValidationPlaceHolder = json.ValidationPlaceHolder;
                        }
                        if (json.hasOwnProperty('Name')) {
                            this.Name = json.Name;
                        }
                        if (json.hasOwnProperty('Message')) {
                            this.Message = json.Message;
                        }
                        if (json.hasOwnProperty('Pass')) {
                            this.Pass = json.Pass;
                        }
                        if (json.hasOwnProperty('Params')) {
                            for (var i = 0; i < json.Params.length; i++) {
                                var fruleParam = new FRuleParam(json.Params[i]);
                                this.controlIds = this.controlIds.concat(fruleParam.GetParams());
                                this.FRuleParam.push(fruleParam);
                            }
                        }
                        if (json.hasOwnProperty('ValidationGroup')) {
                            this.ValidationGroup = json.ValidationGroup;
                        }
                        if (json.hasOwnProperty('RuleId')) {
                            this.RuleId = json.RuleId;
                        }
                    }
                    //validates the functional rule
                    FunctionalRule.prototype.Validate = function () {
                        var validationResult = new Validation.ValidationResult();
                        var returnVal1 = this.FRuleParam[0].CalculateResult();
                        var returnVal2 = this.FRuleParam[1].CalculateResult();
                        var value1 = returnVal1.Value;
                        var value2 = returnVal2.Value;
                        if (returnVal1.ValueType != ValueReturnType.NAN && returnVal2.ValueType != ValueReturnType.NAN) {
                            if ((returnVal1.ValueType == returnVal2.ValueType) && returnVal1.ValueType != null) {
                                switch (this.VCode) {
                                    case FunctionalRuleVCodes.EQ:
                                        if (value1 != value2) {
                                            validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        }
                                        break;
                                    case FunctionalRuleVCodes.GT:
                                        if (value1 <= value2) {
                                            validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        }
                                        break;
                                    case FunctionalRuleVCodes.GE:
                                        if (value1 < value2) {
                                            validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        }
                                        break;
                                    case FunctionalRuleVCodes.LT:
                                        if (value1 >= value2) {
                                            validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        }
                                        break;
                                    case FunctionalRuleVCodes.LE:
                                        if (value1 > value2) {
                                            validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        }
                                        break;
                                    case FunctionalRuleVCodes.NE:
                                        if (value1 == value2) {
                                            validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        }
                                        break;
                                }
                            }
                            else {
                                validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                            }
                        }
                        validationResult.SetControls(this.controlIds);
                        return validationResult;
                    };
                    //returns the concontrols used for the frule
                    FunctionalRule.prototype.GetParams = function () {
                        return this.controlIds;
                    };
                    FunctionalRule.prototype.SetValue = function (key, value) {
                        for (var i = 0; i < this.FRuleParam.length; i++) {
                            this.FRuleParam[i].SetValue(key, value);
                        }
                    };
                    return FunctionalRule;
                }());
                Validation.FunctionalRule = FunctionalRule;
                var FRuleParam = (function () {
                    //constructor
                    function FRuleParam(json) {
                        //collection of the params
                        this.params = new Array();
                        this.paramValueSet = [];
                        if (json.hasOwnProperty('Name')) {
                            this.Name = json.Name;
                        }
                        if (json.hasOwnProperty('VCode')) {
                            this.VCode = json.VCode;
                        }
                        if (json.hasOwnProperty('ControlIds')) {
                            for (var i = 0; i < json.ControlIds.length; i++) {
                                this.params.push(json.ControlIds[i]);
                            }
                        }
                    }
                    //Sets the value for the param
                    FRuleParam.prototype.SetValue = function (key, value) {
                        if (this.params.indexOf(key) > -1) {
                            var index = this.GetIndexInArrayOfKey(key);
                            if (index == -1) {
                                this.paramValueSet.push({ 'key': key, 'value': (value + '') });
                            }
                            else {
                                this.paramValueSet[index].value = (value + '');
                            }
                        }
                    };
                    //gets the value of the control( or from a value that has been set)
                    FRuleParam.prototype.GetControlsValue = function (paramName) {
                        if (this.paramValueSet.length > 0) {
                            var index = this.GetIndexInArrayOfKey(paramName);
                            if (index == -1) {
                                return ReiSys.Utilities.Util.GetControlValue(paramName, false);
                            }
                            else {
                                return this.paramValueSet[index].value;
                            }
                        }
                        else {
                            return ReiSys.Utilities.Util.GetControlValue(paramName, false);
                        }
                    };
                    FRuleParam.prototype.GetIndexInArrayOfKey = function (key) {
                        var toReturn = -1;
                        for (var i = 0; i < this.paramValueSet.length; i++) {
                            if (this.paramValueSet[i].key == key) {
                                toReturn = i;
                                break;
                            }
                        }
                        return toReturn;
                    };
                    //calculates the result of the FRuleParam returns a number or a date
                    FRuleParam.prototype.CalculateResult = function () {
                        var valueReturn = new FRuleParamResult();
                        switch (this.VCode) {
                            case FunctionalRuleVCodes.ADD:
                                var value = 0;
                                for (var i = 0; i < this.params.length; i++) {
                                    value += parseFloat(this.GetControlsValue(this.params[i]));
                                }
                                if (isNaN(value)) {
                                    valueReturn.Set(null, ValueReturnType.NAN);
                                }
                                else {
                                    valueReturn.Set(value, ValueReturnType.NUMBER);
                                }
                                break;
                            case FunctionalRuleVCodes.SUB:
                                var value = parseFloat(this.GetControlsValue(this.params[0]));
                                for (var i = 1; i < this.params.length; i++) {
                                    value -= parseFloat(this.GetControlsValue(this.params[i]));
                                }
                                if (isNaN(value)) {
                                    valueReturn.Set(null, ValueReturnType.NAN);
                                }
                                else {
                                    valueReturn.Set(value, ValueReturnType.NUMBER);
                                }
                                break;
                            case FunctionalRuleVCodes.MUL:
                                var value = parseFloat(this.GetControlsValue(this.params[0]));
                                for (var i = 1; i < this.params.length; i++) {
                                    value *= parseFloat(this.GetControlsValue(this.params[i]));
                                }
                                if (isNaN(value)) {
                                    valueReturn.Set(null, ValueReturnType.NAN);
                                }
                                else {
                                    valueReturn.Set(value, ValueReturnType.NUMBER);
                                }
                                break;
                            case FunctionalRuleVCodes.DIV:
                                var value = parseFloat(this.GetControlsValue(this.params[0]));
                                for (var i = 1; i < this.params.length; i++) {
                                    value /= parseFloat(this.GetControlsValue(this.params[i]));
                                }
                                if (isNaN(value)) {
                                    valueReturn.Set(null, ValueReturnType.NAN);
                                }
                                else {
                                    valueReturn.Set(value, ValueReturnType.NUMBER);
                                }
                                break;
                            case FunctionalRuleVCodes.AVG:
                                var value = 0;
                                for (var i = 0; i < this.params.length; i++) {
                                    value += parseFloat(this.GetControlsValue(this.params[i]));
                                }
                                value /= this.params.length;
                                if (isNaN(value)) {
                                    valueReturn.Set(null, ValueReturnType.NAN);
                                }
                                else {
                                    valueReturn.Set(value, ValueReturnType.NUMBER);
                                }
                                break;
                            case FunctionalRuleVCodes.ABS:
                                var value = Math.abs(parseFloat(this.GetControlsValue(this.params[0])));
                                if (isNaN(value)) {
                                    valueReturn.Set(null, ValueReturnType.NAN);
                                }
                                else {
                                    valueReturn.Set(value, ValueReturnType.NUMBER);
                                }
                                break;
                            default:
                                var controlValue = this.GetControlsValue(this.params[0]);
                                var dateNumber = Date.parse(controlValue);
                                if (isNaN(dateNumber)) {
                                    if (ReiSys.Utilities.Util.IsValidNumeric(controlValue)) {
                                        var value = parseFloat(controlValue.replace(',', ''));
                                        valueReturn.Set(value, ValueReturnType.NUMBER);
                                    }
                                    else {
                                        valueReturn.Set(null, ValueReturnType.NAN);
                                    }
                                }
                                else {
                                    valueReturn.Set(dateNumber, ValueReturnType.DATE);
                                }
                                break;
                        }
                        return valueReturn;
                    };
                    //Gets the controls used for the Frule
                    FRuleParam.prototype.GetParams = function () {
                        return this.params;
                    };
                    return FRuleParam;
                }());
                //return type for 
                var ValueReturnType = (function () {
                    function ValueReturnType() {
                    }
                    ValueReturnType.DATE = 'DATE';
                    ValueReturnType.NUMBER = 'NUMBER';
                    ValueReturnType.NAN = 'NAN';
                    return ValueReturnType;
                }());
                //Result object of a functional rule param
                var FRuleParamResult = (function () {
                    function FRuleParamResult() {
                    }
                    FRuleParamResult.prototype.Set = function (value, valueType) {
                        this.Value = value;
                        this.ValueType = valueType;
                    };
                    return FRuleParamResult;
                }());
                //vcode enumeration for an FunctionalRule
                var FunctionalRuleVCodes = (function () {
                    function FunctionalRuleVCodes() {
                    }
                    FunctionalRuleVCodes.EQ = 'EQ';
                    FunctionalRuleVCodes.GT = 'GT';
                    FunctionalRuleVCodes.LT = 'LT';
                    FunctionalRuleVCodes.GE = 'GE';
                    FunctionalRuleVCodes.LE = 'LE';
                    FunctionalRuleVCodes.NE = 'NE';
                    FunctionalRuleVCodes.ADD = 'ADD';
                    FunctionalRuleVCodes.SUB = 'SUB';
                    FunctionalRuleVCodes.MUL = 'MUL';
                    FunctionalRuleVCodes.AVG = 'AVG';
                    FunctionalRuleVCodes.ABS = 'ABS';
                    FunctionalRuleVCodes.DIV = 'DIV';
                    return FunctionalRuleVCodes;
                }());
                Validation.FunctionalRuleVCodes = FunctionalRuleVCodes;
            })(Validation = BusinessLogic.Validation || (BusinessLogic.Validation = {}));
        })(BusinessLogic = BusinessLayer.BusinessLogic || (BusinessLayer.BusinessLogic = {}));
    })(BusinessLayer = ReiSys.BusinessLayer || (ReiSys.BusinessLayer = {}));
})(ReiSys || (ReiSys = {}));
