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
                var SQLRule = (function () {
                    //constructor
                    function SQLRule(json) {
                        this.params = new Array();
                        this.paramValueSet = [];
                        this.value = null;
                        //This indicates if the rule is enabled and if it will validate 
                        this.IsRuleEnabled = true;
                        if (json.hasOwnProperty('VCode')) {
                            this.VCode = json.VCode;
                        }
                        if (json.hasOwnProperty('Pass')) {
                            this.Pass = json.Pass;
                        }
                        if (json.hasOwnProperty('Message')) {
                            this.Message = json.Message;
                        }
                        if (json.hasOwnProperty('ValidationPlaceHolder')) {
                            this.ValidationPlaceHolder = json.ValidationPlaceHolder;
                        }
                        if (json.hasOwnProperty('Name')) {
                            this.Name = json.Name;
                        }
                        if (json.hasOwnProperty('Id')) {
                            this.Id = json.Id;
                        }
                        if (json.hasOwnProperty('CompareValue')) {
                            this.CompareValue = json.CompareValue;
                        }
                        if (json.hasOwnProperty('Statement')) {
                            this.Statement = json.Statement;
                        }
                        if (json.hasOwnProperty('Component')) {
                            this.Component = json.Component;
                        }
                        if (json.hasOwnProperty('RuleId')) {
                            this.RuleId = json.RuleId;
                        }
                        if (json.hasOwnProperty('Params')) {
                            for (var i = 0; i < json.Params.length; i++) {
                                this.params.push(json.Params[i]);
                            }
                        }
                        if (json.hasOwnProperty('ValidationGroup')) {
                            this.ValidationGroup = json.ValidationGroup;
                        }
                    }
                    //validates the sql rule
                    SQLRule.prototype.Validate = function () {
                        var validationResult = new Validation.ValidationResult();
                        var inputValue = null;
                        if (this.value == null) {
                            inputValue = this.sqlResultValue;
                        }
                        else {
                            inputValue = this.value;
                        }
                        switch (this.VCode) {
                            case SqlRuleVCodes.EQ:
                                if (!ReiSys.Utilities.Comparer.IsEqual(inputValue.toLowerCase(), this.CompareValue.toLowerCase())) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                            case SqlRuleVCodes.NE:
                                if (ReiSys.Utilities.Comparer.IsEqual(inputValue.toLowerCase(), this.CompareValue.toLowerCase())) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                            case SqlRuleVCodes.GT:
                                if (!ReiSys.Utilities.Comparer.GreaterThan(inputValue, this.CompareValue)) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                            case SqlRuleVCodes.GE:
                                if (!ReiSys.Utilities.Comparer.GreaterThanEqual(inputValue, this.CompareValue)) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                            case SqlRuleVCodes.LT:
                                if (!ReiSys.Utilities.Comparer.LessThan(inputValue, this.CompareValue)) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                            case SqlRuleVCodes.LE:
                                if (!ReiSys.Utilities.Comparer.LessThanEqual(inputValue, this.CompareValue)) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                        }
                        validationResult.SetControls(this.params);
                        return validationResult;
                    };
                    /**
                    * Generated the JSon to be sent back to the web service
                    */
                    SQLRule.prototype.GetRule = function () {
                        var tempParams = [];
                        for (var i = 0; i < this.params.length; i++) {
                            var value = this.GetControlsValue(this.params[i]);
                            tempParams.push({ "Key": this.params[i], "Value": value });
                        }
                        var statment = this.Statement;
                        var component = this.Component;
                        var id = this.Name;
                        return {
                            "Id": id, "Component": component, "Statement": statment, "Params": tempParams
                        };
                    };
                    /**
                    * populates the result from the web service
                    */
                    SQLRule.prototype.PopulateResult = function (result) {
                        if (result != null) {
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].Id == this.Name) {
                                    this.sqlResultValue = result[i].Value;
                                }
                            }
                        }
                    };
                    //Sets the value that it will compare agaisnt
                    SQLRule.prototype.SetValue = function (key, value) {
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
                    SQLRule.prototype.GetControlsValue = function (paramName) {
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
                    SQLRule.prototype.GetIndexInArrayOfKey = function (key) {
                        var toReturn = -1;
                        for (var i = 0; i < this.paramValueSet.length; i++) {
                            if (this.paramValueSet[i].key == key) {
                                toReturn = i;
                                break;
                            }
                        }
                        return toReturn;
                    };
                    return SQLRule;
                }());
                Validation.SQLRule = SQLRule;
                //SqlRUle Vcodes enumeration
                var SqlRuleVCodes = (function () {
                    function SqlRuleVCodes() {
                    }
                    SqlRuleVCodes.EQ = 'EQ';
                    SqlRuleVCodes.GT = 'GT';
                    SqlRuleVCodes.LT = 'LT';
                    SqlRuleVCodes.GE = 'GE';
                    SqlRuleVCodes.LE = 'LE';
                    SqlRuleVCodes.NE = 'NE';
                    return SqlRuleVCodes;
                }());
                Validation.SqlRuleVCodes = SqlRuleVCodes;
                var SQLRuleServiceUtility = (function () {
                    function SQLRuleServiceUtility() {
                    }
                    SQLRuleServiceUtility.prototype.PostJSonToWebService = function (data) {
                        // $.support.cors = true;
                        this.URL = ReiSys.Utilities.Util.BaseUrl + 'Platform/WebServices/ValidationClientService.svc/Validate';
                        return ReiSys.Utilities.Util.PostJsonToService(this.URL, JSON.stringify(data));
                    };
                    return SQLRuleServiceUtility;
                }());
                Validation.SQLRuleServiceUtility = SQLRuleServiceUtility;
            })(Validation = BusinessLogic.Validation || (BusinessLogic.Validation = {}));
        })(BusinessLogic = BusinessLayer.BusinessLogic || (BusinessLayer.BusinessLogic = {}));
    })(BusinessLayer = ReiSys.BusinessLayer || (ReiSys.BusinessLayer = {}));
})(ReiSys || (ReiSys = {}));
