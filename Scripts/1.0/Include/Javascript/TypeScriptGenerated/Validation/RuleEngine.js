/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="SimpleRule.ts" />
/// <reference path="CombinedRule.ts" />
/// <reference path="SQLRule.ts" />
/// <reference path="FunctionalRule.ts" />
/// <reference path="SQLRule.ts" />
/// <reference path="Validation.ts" />
var ReiSys;
(function (ReiSys) {
    var BusinessLayer;
    (function (BusinessLayer) {
        var BusinessLogic;
        (function (BusinessLogic) {
            var Validation;
            (function (Validation) {
                /**
            * This is the rule engine
            * It contains all of the validation rules and
            * it will validate all of the all of the rules when the validate function is called
            */
                var RuleEngine = (function () {
                    function RuleEngine() {
                        this.Rules = new Array();
                        this.sqlRules = new Array();
                    }
                    //adds a collection of rules  to the rules collection
                    RuleEngine.prototype.AddRules = function (rules) {
                        for (var i = 0; i < rules.length; i++) {
                            if (rules[i].hasOwnProperty('Type')) {
                                switch (rules[i].Type) {
                                    case 'SRule':
                                        this.Rules.push(new Validation.SimpleRule(rules[i]));
                                        break;
                                    case 'CRule':
                                        var combinedRule = new Validation.CombinedRule(rules[i]);
                                        this.sqlRules = this.sqlRules.concat(combinedRule.GetSQLRules());
                                        this.Rules.push(combinedRule);
                                        break;
                                    case 'FRule':
                                        this.Rules.push(new Validation.FunctionalRule(rules[i]));
                                        break;
                                    case 'SQLRule':
                                        var tempSQLRule = new Validation.SQLRule(rules[i]);
                                        this.Rules.push(tempSQLRule);
                                        this.sqlRules.push(tempSQLRule);
                                        break;
                                }
                            }
                        }
                    };
                    //adds a rule to the rules collection
                    RuleEngine.prototype.AddRule = function (rule) {
                        if (rule.hasOwnProperty('Type')) {
                            switch (rule.Type) {
                                case 'SRule':
                                    this.Rules.push(new Validation.SimpleRule(rule));
                                    break;
                                case 'CRule':
                                    var combinedRule = new Validation.CombinedRule(rule);
                                    this.sqlRules = this.sqlRules.concat(combinedRule.GetSQLRules());
                                    this.Rules.push(combinedRule);
                                    break;
                                case 'FRule':
                                    this.Rules.push(new Validation.FunctionalRule(rule));
                                    break;
                                case 'SQLRule':
                                    var tempSQLRule = new Validation.SQLRule(rule);
                                    this.Rules.push(tempSQLRule);
                                    this.sqlRules.push(tempSQLRule);
                                    break;
                            }
                        }
                    };
                    //validates the rules in the rules collection
                    RuleEngine.prototype.Validate = function (groupName) {
                        this.HandleSQLRuleData(groupName);
                        var ValidationResults = new Array;
                        for (var i = 0; i < this.Rules.length; i++) {
                            try {
                                if (this.Rules[i].IsRuleEnabled) {
                                    if (!ReiSys.Utilities.Comparer.IsNullEmptyUndefined(groupName)) {
                                        if (this.Rules[i].ValidationGroup == groupName) {
                                            var result = this.Rules[i].Validate();
                                            ValidationResults.push(result);
                                        }
                                    }
                                    else {
                                        if (ReiSys.Utilities.Comparer.IsNullEmptyUndefined(this.Rules[i].ValidationGroup)) {
                                            var result = this.Rules[i].Validate();
                                            ValidationResults.push(result);
                                        }
                                    }
                                }
                            }
                            catch (ex) {
                                PlatformConsole.log('Rule failed ' + this.Rules[i].Message + ' ' + this.Rules[i].VCode);
                            }
                        }
                        return ValidationResults;
                    };
                    //Removes All the added rules
                    RuleEngine.prototype.ClearRules = function () {
                        this.Rules = new Array();
                    };
                    /**
                    * Gets a rule by the rule id
                    */
                    RuleEngine.prototype.GetRule = function (ruleid) {
                        for (var i = 0; i < this.Rules.length; i++) {
                            if (this.Rules[i].RuleId == ruleid) {
                                return this.Rules[i];
                                break;
                            }
                        }
                        return null;
                    };
                    /**
                    * Takes care of collecting the Json for SQL Rules and
                    * posts that data to the web service and than
                    * takes the results and returns it to the SQL rules
                    */
                    RuleEngine.prototype.HandleSQLRuleData = function (groupName) {
                        if (this.sqlRules.length > 0) {
                            var tempRules = [];
                            for (var i = 0; i < this.sqlRules.length; i++) {
                                for (var i = 0; i < this.sqlRules.length; i++) {
                                    if (!ReiSys.Utilities.Comparer.IsNullEmptyUndefined(groupName)) {
                                        if (this.sqlRules[i].ValidationGroup == groupName) {
                                            tempRules.push(this.sqlRules[i].GetRule());
                                        }
                                    }
                                    else {
                                        if (ReiSys.Utilities.Comparer.IsNullEmptyUndefined(this.sqlRules[i].ValidationGroup)) {
                                            tempRules.push(this.sqlRules[i].GetRule());
                                        }
                                    }
                                }
                            }
                            var data = {
                                "ruleCollection": {
                                    "Rules": tempRules
                                }
                            };
                            var service = new ReiSys.BusinessLayer.BusinessLogic.Validation.SQLRuleServiceUtility();
                            var result = service.PostJSonToWebService(data);
                            for (var i = 0; i < this.sqlRules.length; i++) {
                                this.sqlRules[i].PopulateResult(result);
                            }
                        }
                    };
                    return RuleEngine;
                })();
                Validation.RuleEngine = RuleEngine;
            })(Validation = BusinessLogic.Validation || (BusinessLogic.Validation = {}));
        })(BusinessLogic = BusinessLayer.BusinessLogic || (BusinessLayer.BusinessLogic = {}));
    })(BusinessLayer = ReiSys.BusinessLayer || (ReiSys.BusinessLayer = {}));
})(ReiSys || (ReiSys = {}));
var ruleEngine = new ReiSys.BusinessLayer.BusinessLogic.Validation.RuleEngine();
//# sourceMappingURL=RuleEngine.js.map