/// <reference path="Validation.ts" />
/// <reference path="../Utilities/Util.ts"/>
/// <reference path="../ExternalTS/Platformlib.ts"/>
var ReiSys;
(function (ReiSys) {
    var BusinessLayer;
    (function (BusinessLayer) {
        var BusinessLogic;
        (function (BusinessLogic) {
            var Validation;
            (function (Validation) {
                var ValidationRenderer = (function () {
                    function ValidationRenderer() {
                        //bool to see if validation has been run this improves performance
                        this.HasValidationBeenRun = false;
                        //IsValidationSummaryDisabled is a property that will not show the validation sumamry if it is set to true (default false)
                        this.IsValidationSummaryDisabled = false;
                    }
                    //This renders the field level errors
                    ValidationRenderer.prototype.RenderFieldLevel = function (validationResults) {
                        if (this.HasValidationBeenRun) {
                            ReiSys.Utilities.Util.RemoveClassFromAllControls('fieldreq');
                            ReiSys.Utilities.Util.RemoveAllControlsByClass('ClientValidationClass');
                        }
                        for (var i = 0; i < validationResults.length; i++) {
                            var validationResult = validationResults[i];
                            if (validationResult.Validity != ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.Valid) {
                                this.HasValidationBeenRun = true;
                                if (validationResult.ControlId != undefined) {
                                    this.FieldLevelValidations++;
                                    var highlightControls = validationResult.GetControls();
                                    this.HighlightControls(highlightControls);
                                    this.PopulatePlaceHolder(validationResult);
                                }
                                else {
                                    this.SummaryLevelValidations++;
                                }
                            }
                        }
                    };
                    ValidationRenderer.prototype.PopulatePlaceHolder = function (validationResult) {
                        var control = ReiSys.Utilities.Util.GetControl(validationResult.ControlId);
                        var controlType = ReiSys.Utilities.Util.GetControlType(control);
                        var controls = null;
                        if (controlType != 'radio' && controlType != 'checkbox') {
                            if (control.length > 1) {
                                if (ReiSys.Utilities.Util.EndsWith(control[0].id, '_Valid')) {
                                    $(control[0]).remove();
                                    control = $(control[1]);
                                }
                                else {
                                    controls = control;
                                    if (ReiSys.Utilities.Util.EndsWith(control[0].id, '_wrapper')) {
                                        control = $(control[1]);
                                    }
                                    else {
                                        control = $(control[0]);
                                    }
                                }
                            }
                            if (control.attr('type') != undefined) {
                                control.before($(this.MakFieldHeader(validationResult)));
                                validationResult.ControlId = '-' + validationResult.ControlId;
                                control.addClass('fieldreq');
                            }
                            else {
                                control = ReiSys.Utilities.Util.GetInputControlFullId(validationResult.ControlId);
                                validationResult.ControlId = control.attr('id');
                                control.removeClass('fieldreq');
                                control.before($(this.MakFieldHeader(validationResult)));
                            }
                        }
                        else {
                            if (controlType == 'radio' || controlType == 'checkbox') {
                                for (var f = 1; f < control.length; f++) {
                                    ReiSys.Utilities.Util.AddClass(control[f].id, 'fieldreq');
                                }
                                if (ReiSys.Utilities.Util.EndsWith(control[0].id, '_wrapper')) {
                                    $(control[0]).before($(this.MakFieldHeader(validationResult)));
                                }
                                else {
                                    $(control[0]).before($(this.MakFieldHeader(validationResult)));
                                }
                                validationResult.ControlId = '-' + validationResult.ControlId;
                                $(control[0]).addClass('fieldreq');
                            }
                            else {
                            }
                        }
                    };
                    ValidationRenderer.prototype.HighlightControls = function (highlightControls) {
                        for (var f = 0; f < highlightControls.length; f++) {
                            var tempControl = $('#' + highlightControls[f]);
                            if (tempControl.hasClass('RadEditor') || tempControl.hasClass('RadComboBox')) {
                                tempControl.addClass('fieldreq');
                            }
                            else if ($('#' + highlightControls[f] + '_wrapper').hasClass('RadPicker')) {
                                $('#' + highlightControls[f] + '_wrapper').addClass('fieldreq');
                            }
                            else if (tempControl.attr('type') == 'radio' || tempControl.attr('type') == 'checkbox') {
                                tempControl.addClass('fieldreq');
                            }
                            else {
                                tempControl.addClass('fieldreq');
                            }
                        }
                    };
                    //generates the string to be used to create the field level error
                    ValidationRenderer.prototype.MakFieldHeader = function (valResult) {
                        var toReturn = '<div id="-' + valResult.ControlId + '" class="fielderr_info ClientValidationClass">';
                        toReturn += '<span tabindex="0" class="tooltip"><img class="valimg tooltip" title="' + valResult.Title + '" alt="' + valResult.AltText + '" src="' + valResult.Image + '" />';
                        toReturn += valResult.Message;
                        toReturn += '</span><span class="topicon_area">';
                        toReturn += '(';
                        toReturn += '<a class="topicon tooltip"  href="javascript:void(0)"  onclick="$(\'.msgFail\').focus(); return false;">';
                        toReturn += '<img alt="Go to error summary" src="' + ReiSys.Utilities.Util.BaseImagePath + '/Platform/Include/Skins/' + ReiSys.Utilities.Util.ImagePath + '/images/errortop.png"/>';
                        toReturn += '</a>';
                        toReturn += ')';
                        toReturn += '</span>';
                        toReturn += '</div > ';
                        return toReturn;
                    };
                    //This renders the summary view
                    ValidationRenderer.prototype.RenderSummaryLevel = function (validationResults, summaryFieldId) {
                        if (summaryFieldId === null || summaryFieldId === undefined) {
                            summaryFieldId = 'clientValidationContainer';
                        }
                        var scope = $('[id$="' + summaryFieldId + '"]');
                        ko.applyBindings({ ValidationResults: validationResults }, $('.fielderr_list', scope)[0]);
                        ko.applyBindings({ ValidationResults: validationResults }, $('.val_list', scope)[0]);
                        if (this.FieldLevelValidations > 0) {
                            $('.fielderr_head', scope).show();
                            $(".fielderr_ins", scope).show();
                        }
                        else {
                            $('.fielderr_head', scope).hide();
                            $(".fielderr_ins", scope).hide();
                        }
                        if (this.FieldLevelValidations > 0 && this.SummaryLevelValidations > 0) {
                            $('.val_line', scope).show();
                        }
                        else {
                            $('.val_line', scope).hide();
                        }
                    };
                    //Called to render the validations
                    ValidationRenderer.prototype.RenderValidations = function (validationResults, summaryFieldId) {
                        this.FieldLevelValidations = 0;
                        this.SummaryLevelValidations = 0;
                        ErrorCounter.ResetCount();
                        this.RenderFieldLevel(validationResults);
                        this.RenderSummaryLevel(validationResults, summaryFieldId);
                        if ((this.FieldLevelValidations > 0 || this.SummaryLevelValidations > 0) && !this.IsValidationSummaryDisabled) {
                            this.ShowValidationSummary(summaryFieldId);
                        }
                        else {
                            this.HideValidationSummary(summaryFieldId);
                        }
                        //This forces the tool tip to work-
                        $('.tooltip').tipTip();
                        return (this.FieldLevelValidations + this.SummaryLevelValidations);
                    };
                    //Shos the validation summary
                    ValidationRenderer.prototype.ShowValidationSummary = function (summaryFieldId) {
                        if (summaryFieldId === null || summaryFieldId === undefined) {
                            summaryFieldId = 'clientValidationContainer';
                        }
                        var scope = $('[id$="' + summaryFieldId + '"]');
                        $('#valBase', scope).show();
                        $('.topicon_area', scope).show();
                    };
                    //Hides the validation sumamry
                    ValidationRenderer.prototype.HideValidationSummary = function (summaryFieldId) {
                        if (summaryFieldId === null || summaryFieldId === undefined) {
                            summaryFieldId = 'clientValidationContainer';
                        }
                        var scope = $('[id$="' + summaryFieldId + '"]');
                        $('#valBase', scope).hide();
                        $('.topicon_area', scope).hide();
                    };
                    return ValidationRenderer;
                }());
                Validation.ValidationRenderer = ValidationRenderer;
                //Keeps track of the number of field level errors for the error count
                var ErrorCounter = (function () {
                    function ErrorCounter() {
                    }
                    //gets the error count and increments by 1
                    ErrorCounter.GetErrorCount = function () {
                        var tempCount = this.ErrorCount;
                        this.ErrorCount++;
                        return tempCount;
                    };
                    //resets the error count
                    ErrorCounter.ResetCount = function () {
                        this.ErrorCount = 1;
                    };
                    ErrorCounter.ErrorCount = 1;
                    return ErrorCounter;
                }());
                Validation.ErrorCounter = ErrorCounter;
            })(Validation = BusinessLogic.Validation || (BusinessLogic.Validation = {}));
        })(BusinessLogic = BusinessLayer.BusinessLogic || (BusinessLayer.BusinessLogic = {}));
    })(BusinessLayer = ReiSys.BusinessLayer || (ReiSys.BusinessLayer = {}));
})(ReiSys || (ReiSys = {}));
