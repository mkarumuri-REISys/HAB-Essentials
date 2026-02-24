/// <reference path="Validation.ts" />
/// <reference path="RuleEngine.ts" />
/// <reference path="ValidationRenderer.ts" />
/// <reference path="../Utilities/Util.ts"/>
var ReiSys;
(function (ReiSys) {
    var BusinessLayer;
    (function (BusinessLayer) {
        var BusinessLogic;
        (function (BusinessLogic) {
            var Validation;
            (function (Validation) {
                //This is the invoker class
                var Invoker = (function () {
                    function Invoker() {
                        //contains an instance of the validation renderer
                        this.ValidationRenderer = new Validation.ValidationRenderer();
                        //event exposed to add and remove items to the validation results
                        this.ValidationInvokeEvent = new ReiSys.Utilities.PlatformEvent();
                    }
                    Invoker.prototype.InvokeValidationWithoutRender = function (groupName) {
                        return this.PerformInvokeValidation(groupName, false, null);
                    };
                    //method to call to invoke validation and to run the validations and render the results
                    Invoker.prototype.InvokeValidation = function (groupName) {
                        return this.PerformInvokeValidation(groupName, true, null);
                    };
                    Invoker.prototype.InvokeValidationWithCustomSummarySection = function (summaryFieldId, groupName) {
                        return this.PerformInvokeValidation(groupName, true, summaryFieldId);
                    };
                    Invoker.prototype.PerformInvokeValidation = function (groupName, renderValidations, summaryFieldId) {
                        var totalValidations;
                        try {
                            this.ErrorsOnPage = 0;
                            this.IsValid = true;
                            this.IsInValidWithException = true;
                            this.IsInValidWithWarning = true;
                            var validationResults = ruleEngine.Validate(groupName);
                            this.ValidationInvokeEvent.raise(this, new InvokerEventArgs(validationResults, groupName));
                            try {
                                for (var i = 0; i < validationResults.length; i++) {
                                    if (validationResults[i].Validity != undefined) {
                                        if (validationResults[i].Validity == ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValid) {
                                            this.IsValid = false;
                                        }
                                        if (validationResults[i].Validity == ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithException) {
                                            this.IsInValidWithException = false;
                                        }
                                        if (validationResults[i].Validity == ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithWarning) {
                                            this.IsInValidWithWarning = false;
                                        }
                                        if (validationResults[i].Validity != ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.Valid) {
                                            this.ErrorsOnPage++;
                                        }
                                    }
                                }
                            }
                            catch (ex) {
                                PlatformConsole.log('InvokeValidation:' + groupName + ' ' + ex);
                            }
                            totalValidations = this.ErrorsOnPage;
                            if (renderValidations) {
                                totalValidations = this.ValidationRenderer.RenderValidations(validationResults, summaryFieldId);
                                if (totalValidations > 0) {
                                    if (summaryFieldId === null || summaryFieldId === undefined) {
                                        $('.msgFail').focus();
                                    }
                                    else {
                                        $('.msgFail', $('#' + summaryFieldId)).focus();
                                    }
                                }
                            }
                        }
                        catch (ex) {
                            PlatformConsole.log("InvokeValidation. " + groupName + " " + ex);
                        }
                        return totalValidations;
                    };
                    // PFM-7288(CSV - Validation during save and continue. Need separated validate and render.)
                    Invoker.prototype.InvokeValidateOnly = function (groupName) {
                        try {
                            this.ErrorsOnPage = 0;
                            this.IsValid = true;
                            this.IsInValidWithException = true;
                            this.IsInValidWithWarning = true;
                            var validationResults = ruleEngine.Validate(groupName);
                            this.ValidationInvokeEvent.raise(this, new InvokerEventArgs(validationResults, groupName));
                            try {
                                for (var i = 0; i < validationResults.length; i++) {
                                    if (validationResults[i].Validity != undefined) {
                                        if (validationResults[i].Validity == ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValid) {
                                            this.IsValid = false;
                                        }
                                        if (validationResults[i].Validity == ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithException) {
                                            this.IsInValidWithException = false;
                                        }
                                        if (validationResults[i].Validity == ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithWarning) {
                                            this.IsInValidWithWarning = false;
                                        }
                                        if (validationResults[i].Validity != ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.Valid) {
                                            this.ErrorsOnPage++;
                                        }
                                    }
                                }
                            }
                            catch (ex) {
                                PlatformConsole.log('InvokeValidateOnly: ' + groupName + ' ' + ex);
                            }
                            if (this.IsValid === false) {
                                validaitonInvoker.Render(validationResults);
                            }
                        }
                        catch (ex) {
                            PlatformConsole.log("InvokeValidateOnly. " + groupName + " " + ex);
                        }
                        return validationResults;
                    };
                    // PFM-7288(CSV - Validation during save and continue. Need separated validate and render.)
                    Invoker.prototype.InvokeRenderOnly = function (validationResults) {
                        var totalValidations;
                        try {
                            totalValidations = validaitonInvoker.Render(validationResults);
                        }
                        catch (ex) {
                            PlatformConsole.log('InvokeRenderOnly: ' + ex);
                        }
                        return totalValidations;
                    };
                    //PFM-7288 - Moved the render method because code was duplicated in multiple methods above.
                    Invoker.prototype.Render = function (validationResults) {
                        var totalValidations;
                        totalValidations = this.ValidationRenderer.RenderValidations(validationResults);
                        if (totalValidations > 0) {
                            $('.msgFail').focus();
                        }
                        return totalValidations;
                    };
                    return Invoker;
                })();
                Validation.Invoker = Invoker;
                var InvokerEventArgs = (function () {
                    function InvokerEventArgs(validationResults, groupName) {
                        this.ValidationResults = validationResults;
                        this.GroupName = groupName;
                    }
                    return InvokerEventArgs;
                })();
                Validation.InvokerEventArgs = InvokerEventArgs;
            })(Validation = BusinessLogic.Validation || (BusinessLogic.Validation = {}));
        })(BusinessLogic = BusinessLayer.BusinessLogic || (BusinessLayer.BusinessLogic = {}));
    })(BusinessLayer = ReiSys.BusinessLayer || (ReiSys.BusinessLayer = {}));
})(ReiSys || (ReiSys = {}));
var validaitonInvoker = new ReiSys.BusinessLayer.BusinessLogic.Validation.Invoker();
//Works with the buttins and invokes for the page action buttons
$('input[CausesValidation="true"]').on('click', function (event) {
    var totalVal = validaitonInvoker.InvokeValidation($(this).attr('ValidationGroup'));
    if (totalVal != 0) {
        EnableButton(this);
        return false;
    }
});
//this is meant for the 
$('a[CausesValidation="true"]').on('click', function (event) {
    var totalVal = validaitonInvoker.InvokeValidation($(this).attr('ValidationGroup'));
    if (totalVal != 0) {
        return false;
    }
});
//THis is added that if validation occurs it will undisable the buttons
function EnableButton(control) {
    setTimeout(function () {
        $(control).removeAttr('disabled');
        if ($(control).hasClass('hrsaSkinneddisbled')) {
            $(control).addClass('hrsaSkinnedButton');
            $(control).removeClass('hrsaSkinneddisbled');
        }
    }, 10);
}
var pageActionButtonButtonClicked = false;
$("input[id*=ddlGo]").click(function (e) {
    pageActionButtonButtonClicked = true;
    if (validaitonInvoker.ErrorsOnPage > 0) {
        EnableButton(this);
    }
});
$("#aspnetForm").submit(function (e) {
    if (pageActionButtonButtonClicked) {
        pageActionButtonButtonClicked = false;
        if (validaitonInvoker.ErrorsOnPage > 0) {
            //  EnableButton($('input[id*=ddlGo]'));
            return false;
        }
        else {
            var control = $('select[id*=ddlActions]');
            var selectedItem = $("option:selected", control);
            var causesValidation = Boolean(selectedItem.attr('CausesValidation'));
            var validationGroup = selectedItem.attr('ValidationGroup');
            //if (selectedItem.attr('actionoption') != null){
            if (causesValidation) {
                var totalVal = validaitonInvoker.InvokeValidation(validationGroup);
                if (totalVal != 0) {
                    //  EnableButton($('input[id*=ddlGo]'));
                    return false;
                }
            }
        }
    }
    return true;
});
//# sourceMappingURL=Invoker.js.map