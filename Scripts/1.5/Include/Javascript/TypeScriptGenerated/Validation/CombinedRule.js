/// <reference path="Validation.ts" />
/// <reference path="SimpleRule.ts" />
/// <reference path="FunctionalRule.ts" />
/// <reference path="SQLRule.ts" />
var ReiSys;
(function (ReiSys) {
    var BusinessLayer;
    (function (BusinessLayer) {
        var BusinessLogic;
        (function (BusinessLogic) {
            var Validation;
            (function (Validation) {
                ///This is the combination rule object
                var CombinedRule = (function () {
                    //Constructor
                    function CombinedRule(json) {
                        this.Rules = new Array();
                        this.sqlRules = new Array();
                        this.controlIds = new Array();
                        //This indicates if the rule is enabled and if it will validate 
                        this.IsRuleEnabled = true;
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
                        if (json.hasOwnProperty('ValidationGroup')) {
                            this.ValidationGroup = json.ValidationGroup;
                        }
                        if (json.hasOwnProperty('RuleId')) {
                            this.RuleId = json.RuleId;
                        }
                        if (json.hasOwnProperty('Rules')) {
                            for (var i = 0; i < json.Rules.length; i++) {
                                if (json.Rules[i].hasOwnProperty('Type')) {
                                    switch (json.Rules[i].Type) {
                                        case 'SRule':
                                            var simpleRule = new Validation.SimpleRule(json.Rules[i]);
                                            this.controlIds.push(simpleRule.Id);
                                            this.Rules.push(simpleRule);
                                            break;
                                        case 'CRule':
                                            var combinedRule = new CombinedRule(json.Rules[i]);
                                            this.sqlRules = this.sqlRules.concat(combinedRule.GetSQLRules());
                                            this.controlIds = this.controlIds.concat(combinedRule.GetControls());
                                            this.Rules.push(combinedRule);
                                            break;
                                        case 'FRule':
                                            var fRule = new Validation.FunctionalRule(json.Rules[i]);
                                            this.controlIds = this.controlIds.concat(fRule.GetParams());
                                            this.Rules.push(fRule);
                                            break;
                                        case 'SQLRule':
                                            var sqlRule = new Validation.SQLRule(json.Rules[i]);
                                            this.controlIds = this.controlIds.concat(sqlRule.params);
                                            this.sqlRules.push(sqlRule);
                                            this.Rules.push(sqlRule);
                                            break;
                                    }
                                }
                            }
                        }
                    }
                    //Validates the combined rule
                    CombinedRule.prototype.Validate = function () {
                        var validationResult = new Validation.ValidationResult();
                        switch (this.VCode) {
                            case CombinedRuleVCodes.Then:
                                var rule1 = this.Rules[0].Validate();
                                var rule2 = this.Rules[1].Validate();
                                if (rule1.Validity == Validation.ValidationResultStatus.Valid) {
                                    if (rule2 != undefined) {
                                        if (rule2.Validity != Validation.ValidationResultStatus.Valid) {
                                            validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        }
                                        else {
                                            PlatformConsole.log('Validate() CRule: name:' + this.RuleId + ' VCode:' + this.VCode + ' ' + rule2.ControlId + ' rule2 invalid');
                                        }
                                    }
                                    else {
                                        PlatformConsole.log('Validate() CRule: name:' + this.RuleId + ' missing second rule or invalid');
                                    }
                                }
                                else {
                                    PlatformConsole.log('Validate() CRule: name:' + this.RuleId + ' VCode:' + this.VCode + ' ' + rule1.ControlId + ' rule1 invalid');
                                }
                                break;
                            case CombinedRuleVCodes.AND:
                                for (var i = 0; i < this.Rules.length; i++) {
                                    var tempResult = this.Rules[i].Validate();
                                    if (tempResult.Validity != Validation.ValidationResultStatus.Valid) {
                                        validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        break;
                                    }
                                    else {
                                        PlatformConsole.log('Validate() CRule: name:' + this.RuleId + ' VCode:' + this.VCode + ' ' + tempResult.ControlId + ' rule' + i + ' invalid');
                                    }
                                }
                                break;
                            case CombinedRuleVCodes.NOT:
                                for (var i = 0; i < this.Rules.length; i++) {
                                    var tempResult = this.Rules[i].Validate();
                                    if (tempResult.Validity == Validation.ValidationResultStatus.Valid) {
                                        validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                        break;
                                    }
                                }
                                break;
                            case CombinedRuleVCodes.OR:
                                var passed = false;
                                for (var i = 0; i < this.Rules.length; i++) {
                                    var tempResult = this.Rules[i].Validate();
                                    if (this.Rules[i].Validate().Validity == Validation.ValidationResultStatus.Valid) {
                                        passed = true;
                                        break;
                                    }
                                }
                                if (!passed) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                            case CombinedRuleVCodes.EXOR:
                                var rule1 = this.Rules[0].Validate();
                                var rule2 = this.Rules[1].Validate();
                                if (rule1.Validity == Validation.ValidationResultStatus.Valid) {
                                    if (rule2.Validity == Validation.ValidationResultStatus.Valid) {
                                        validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                    }
                                }
                                else {
                                    if (rule2.Validity != Validation.ValidationResultStatus.Valid) {
                                        validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                    }
                                }
                                break;
                            case CombinedRuleVCodes.NAND:
                                var passed = false;
                                for (var i = 0; i < this.Rules.length; i++) {
                                    var tempResult = this.Rules[i].Validate();
                                    if (tempResult.Validity != Validation.ValidationResultStatus.Valid) {
                                        passed = true;
                                    }
                                }
                                if (!passed) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                            case CombinedRuleVCodes.NOR:
                                var passed = false;
                                for (var i = 0; i < this.Rules.length; i++) {
                                    var tempResult = this.Rules[i].Validate();
                                    if (tempResult.Validity == Validation.ValidationResultStatus.Valid) {
                                        passed = true;
                                        break;
                                    }
                                }
                                if (passed) {
                                    validationResult.PopulateInvalid(this.Message, this.ValidationPlaceHolder, this.Pass);
                                }
                                break;
                        }
                        validationResult.SetControls(this.controlIds);
                        return validationResult;
                    };
                    //THus returns the SQL rules that belongs to the crule
                    CombinedRule.prototype.GetSQLRules = function () {
                        return this.sqlRules;
                    };
                    //gets the collection of controls used to validate the combined rule
                    CombinedRule.prototype.GetControls = function () {
                        return this.controlIds;
                    };
                    //Sets the value of the controls.
                    CombinedRule.prototype.SetValue = function (key, value) {
                        for (var i = 0; i < this.Rules.length; i++) {
                            this.Rules[i].SetValue(key, value);
                        }
                    };
                    return CombinedRule;
                }());
                Validation.CombinedRule = CombinedRule;
                //this is the enumeration of the combined rule vcodes
                var CombinedRuleVCodes = (function () {
                    function CombinedRuleVCodes() {
                    }
                    CombinedRuleVCodes.Then = 'THEN';
                    CombinedRuleVCodes.AND = 'AND';
                    CombinedRuleVCodes.NOT = 'NOT';
                    CombinedRuleVCodes.OR = 'OR';
                    CombinedRuleVCodes.EXOR = 'XOR';
                    CombinedRuleVCodes.NAND = 'NAND';
                    CombinedRuleVCodes.NOR = 'NOR';
                    return CombinedRuleVCodes;
                }());
                Validation.CombinedRuleVCodes = CombinedRuleVCodes;
            })(Validation = BusinessLogic.Validation || (BusinessLogic.Validation = {}));
        })(BusinessLogic = BusinessLayer.BusinessLogic || (BusinessLayer.BusinessLogic = {}));
    })(BusinessLayer = ReiSys.BusinessLayer || (ReiSys.BusinessLayer = {}));
})(ReiSys || (ReiSys = {}));
