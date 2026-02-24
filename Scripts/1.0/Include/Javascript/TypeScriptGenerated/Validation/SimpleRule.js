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
                /**
                 *This is the enumeration for the SRULE Vcodes
                */
                var SimpleRuleVCodes = (function () {
                    function SimpleRuleVCodes() {
                    }
                    SimpleRuleVCodes.Numeric = 'Numeric';
                    SimpleRuleVCodes.EQ = 'EQ';
                    SimpleRuleVCodes.GT = 'GT';
                    SimpleRuleVCodes.LT = 'LT';
                    SimpleRuleVCodes.GE = 'GE';
                    SimpleRuleVCodes.LE = 'LE';
                    SimpleRuleVCodes.NE = 'NE';
                    SimpleRuleVCodes.MAXLEN = 'MAXLEN';
                    SimpleRuleVCodes.MINLEN = 'MINLEN';
                    SimpleRuleVCodes.EXPRESSION = 'EXPRESSION';
                    SimpleRuleVCodes.Date = "Date";
                    SimpleRuleVCodes.Phone = "Phone";
                    SimpleRuleVCodes.Email = "Email";
                    SimpleRuleVCodes.Money = "Money";
                    SimpleRuleVCodes.SSN = "SSN";
                    SimpleRuleVCodes.Integer = "Integer";
                    SimpleRuleVCodes.Floating = "Floating";
                    SimpleRuleVCodes.Password = "Password";
                    SimpleRuleVCodes.Decimal = 'Decimal';
                    return SimpleRuleVCodes;
                })();
                Validation.SimpleRuleVCodes = SimpleRuleVCodes;
                /**
                *This class the Simple Rule class
                *it is used for validaing Simple rules
                */
                var SimpleRule = (function () {
                    function SimpleRule(json) {
                        this.value = null;
                        //This indicates if the rule is enabled and if it will validate 
                        this.IsRuleEnabled = true;
                        if (json.hasOwnProperty('Id')) {
                            this.Id = json.Id;
                        }
                        if (json.hasOwnProperty('VCode')) {
                            this.VCode = json.VCode;
                        }
                        if (json.hasOwnProperty('CompareValue')) {
                            this.CompareValue = json.CompareValue;
                        }
                        if (json.hasOwnProperty('EditCode')) {
                            this.editCode = json.editCode;
                        }
                        if (json.hasOwnProperty('Empty')) {
                            this.empty = json.Empty;
                        }
                        if (json.hasOwnProperty('Message')) {
                            this.Message = json.Message;
                        }
                        if (json.hasOwnProperty('Pass')) {
                            this.Pass = json.Pass;
                        }
                        if (json.hasOwnProperty('ValidationPlaceHolder')) {
                            this.placeHolderId = json.ValidationPlaceHolder;
                        }
                        if (json.hasOwnProperty('ValidationGroup')) {
                            this.ValidationGroup = json.ValidationGroup;
                        }
                        if (json.hasOwnProperty('RuleId')) {
                            this.RuleId = json.RuleId;
                        }
                    }
                    //validates the Simple Rule and returna result of that validaiton process
                    SimpleRule.prototype.Validate = function () {
                        var validationResult = new Validation.ValidationResult();
                        if (this.value == null) {
                            var inputValue = ReiSys.Utilities.Util.GetControlValue(this.Id, false);
                        }
                        else {
                            inputValue = this.value;
                        }
                        inputValue = ReiSys.Utilities.Util.TrimString(inputValue);
                        if (inputValue == '') {
                            if (!this.empty) {
                                this.SetValidationResult(validationResult);
                                PlatformConsole.log('Validate() id:' + this.Id + ' empty:' + this.empty + ' inputValue:empty');
                            }
                        }
                        else {
                            this.ValidateVCode(validationResult, inputValue);
                        }
                        return validationResult;
                    };
                    //Sets the validation result object
                    SimpleRule.prototype.SetValidationResult = function (validationResult) {
                        var placeHolderConrol = '';
                        if (this.placeHolderId != undefined) {
                            placeHolderConrol = this.placeHolderId;
                            validationResult.AddControl(this.Id);
                        }
                        else {
                            placeHolderConrol = this.Id;
                        }
                        validationResult.PopulateInvalid(this.Message, placeHolderConrol, this.Pass);
                    };
                    //valiates the vcode
                    SimpleRule.prototype.ValidateVCode = function (validationResult, inputValue) {
                        switch (this.VCode) {
                            case SimpleRuleVCodes.Numeric:
                                if (!this.IsValidNumeric(inputValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.EQ:
                                if (this.CompareValue == 'True') {
                                }
                                if (!ReiSys.Utilities.Comparer.IsEqual(inputValue.toLowerCase(), this.CompareValue.toLowerCase())) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.GT:
                                if (!ReiSys.Utilities.Comparer.GreaterThan(inputValue, this.CompareValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.LT:
                                if (!ReiSys.Utilities.Comparer.LessThan(inputValue, this.CompareValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.GE:
                                if (!ReiSys.Utilities.Comparer.GreaterThanEqual(inputValue, this.CompareValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.LE:
                                if (!ReiSys.Utilities.Comparer.LessThanEqual(inputValue, this.CompareValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.NE:
                                if (ReiSys.Utilities.Comparer.IsEqual(inputValue.toLowerCase(), this.CompareValue.toLowerCase())) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.MAXLEN:
                                if (inputValue.length > parseInt(this.CompareValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.MINLEN:
                                if (inputValue.length < parseInt(this.CompareValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.EXPRESSION:
                                if (!inputValue.match(this.CompareValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.Date:
                                if (!inputValue.match('^(?:\\s+)?(?=\\d)(?:(?:(?:(?:(?:0?[13578]|1[02])(\\/|-|\\.)31)\\1|(?:(?:0?[1,3-9]|1[0-2])(\\/|-|\\.)(?:29|30)\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{2})|(?:0?2(\\/|-|\\.)29\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))|(?:(?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.)(?:0?[1-9]|1\\d|2[0-8])\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{2}))($| (?=\\d)))?(((0?[1-9]|1[012])(:[0-5]\\d){0,2}( [AP]M))|([01]\\d|2[0-3])(:[0-5]\\d){1,2})?(?:\\s+)?$')) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.Phone:
                                if (!inputValue.match('^\\(?[\\d]{3}\\)?[\\s-]?[\\d]{3}[\\s-]?[\\d]{4}$')) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.Email:
                                if (!inputValue.match("(^(?!.*[\\.@]{2}))(^(?!\\.))[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?")) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.Money:
                                if (!inputValue.match('(^((-{0,1})(\\${0,1})?([1-9]{1}[0-9]{0,2}(,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$))|(^((\\()(\\${0,1})?([1-9]{1}[0-9]{0,2}(,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)(\\))$))|(^((\\${0,1})?([1-9]{1}[0-9]{0,2}(,[0-9]{3})*(\\.[0-9]{0,2})?|[1-9]{1}[0-9]{0,}(\\.[0-9]{0,2})?|0(\\.[0-9]{0,2})?|(\\.[0-9]{1,2})?)$))')) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.SSN:
                                var pattarn = new RegExp('^\\d{3}-\\d{2}-\\d{4}$');
                                if (!pattarn.test(inputValue)) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.Integer:
                                if (!inputValue.match('^(-{0,1})([0-9]{0,})$')) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.Floating:
                                if (!inputValue.match('[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?')) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.Decimal:
                                if (!inputValue.match('^(\\d{0,}\\.{0,1}\\d{0,2}?$)')) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                            case SimpleRuleVCodes.Password:
                                if (!inputValue.match('^.*(?=.{8,20}$)(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$')) {
                                    this.SetValidationResult(validationResult);
                                }
                                break;
                        }
                        PlatformConsole.log('ValidateVCode() id:' + this.Id + ' VCode' + this.VCode + ' pass:' + this.Pass + ' editCode:' + this.editCode + ' inputValue:' + inputValue + ' compareValue:' + this.CompareValue.toLowerCase() + ' validity:' + validationResult.Validity);
                    };
                    //Checks if is valid numeric for the numeric rule(has unique special cases)
                    SimpleRule.prototype.IsValidNumeric = function (inputValue) {
                        var isValid = false;
                        var numberPattern1 = new RegExp('^((?:(?:\\+|-)?(?:(?:\\d{1,3})(?:,\\d{3})*)(?:\\.\\d*)?)|(?:(?:\\+|-)?(?:\\d)*(?:\\.\\d*)?)|((?:\\+|-)?(?:\\d+)(?:E|e)(?:\\+|-)?(?:\\d+)))$');
                        if (numberPattern1.test(inputValue)) {
                            if (inputValue != '.' && inputValue != '+' && inputValue != '-' && inputValue != '') {
                                isValid = true;
                            }
                        }
                        return isValid;
                    };
                    //sets the value of the 
                    SimpleRule.prototype.SetValue = function (key, value) {
                        if (this.Id == key) {
                            this.value = value;
                        }
                    };
                    return SimpleRule;
                })();
                Validation.SimpleRule = SimpleRule;
            })(Validation = BusinessLogic.Validation || (BusinessLogic.Validation = {}));
        })(BusinessLogic = BusinessLayer.BusinessLogic || (BusinessLayer.BusinessLogic = {}));
    })(BusinessLayer = ReiSys.BusinessLayer || (ReiSys.BusinessLayer = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=SimpleRule.js.map