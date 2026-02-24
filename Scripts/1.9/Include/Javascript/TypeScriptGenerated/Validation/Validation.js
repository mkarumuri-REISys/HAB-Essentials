/// <reference path="../ExternalTS/jquery.d.ts" />
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
                *This is the object returned as the result from
                */
                var ValidationResult = (function () {
                    function ValidationResult() {
                        this.Controls = new Array();
                        this.Validity = ValidationResultStatus.Valid;
                    }
                    //takes information about a rule and populates  the validation result object
                    ValidationResult.prototype.PopulateInvalid = function (message, controlId, pass) {
                        this.Message = message;
                        this.ControlId = controlId;
                        if (pass == 'WARNING') {
                            this.Validity = ValidationResultStatus.InValidWithWarning;
                        }
                        else if (pass == 'YES') {
                            this.Validity = ValidationResultStatus.InValidWithException;
                        }
                        else if (pass == null || pass == undefined || pass == 'NO') {
                            this.Validity = ValidationResultStatus.InValid;
                        }
                        this.SetAltText();
                        this.SetImage();
                        this.SetTitle();
                    };
                    //sets the collection of controls that were validated
                    ValidationResult.prototype.SetControls = function (controls) {
                        this.Controls = controls;
                    };
                    //add a control to the validate control set
                    ValidationResult.prototype.AddControl = function (control) {
                        this.Controls.push(control);
                    };
                    //gets the collection of controls that have been validated
                    ValidationResult.prototype.GetControls = function () {
                        return this.Controls;
                    };
                    //sets the alt text property for the proper  validation type
                    ValidationResult.prototype.SetAltText = function () {
                        var altText = '';
                        switch (this.Validity) {
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValid:
                                altText = 'Rigid Error: Data will not be saved until this error is fixed.'; //FTCAMMX-1335
                                break;
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithException:
                                altText = 'Non-Rigid Error: Section will not be completed until this error is fixed.';
                                break;
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithWarning:
                                altText = 'Warning: Data may be saved but handling this warning is recommended.';
                                break;
                        }
                        this.AltText = altText;
                    };
                    //sets the image property for the proper  validation type
                    ValidationResult.prototype.SetImage = function () {
                        var img = '';
                        switch (this.Validity) {
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValid:
                                img = 'rigid';
                                break;
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithException:
                                img = 'non-rigid';
                                break;
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithWarning:
                                img = 'explain';
                                break;
                        }
                        this.Image = ReiSys.Utilities.Util.BaseImagePath + '/Platform/Include/Skins/' + ReiSys.Utilities.Util.ImagePath + '/Images/' + img + '.png';
                    };
                    //sets the title property for the proper  validation type
                    ValidationResult.prototype.SetTitle = function () {
                        var title = '';
                        switch (this.Validity) {
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValid:
                                title = 'Rigid Error: Data will not be saved until this error is fixed.'; //FTCAMMX-1335
                                break;
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithException:
                                title = 'Non-Rigid Error: Section will not be completed until this error is fixed.';
                                break;
                            case ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResultStatus.InValidWithWarning:
                                title = 'Warning: Data may be saved but handling this warning is recommended.';
                                break;
                        }
                        this.Title = title;
                    };
                    return ValidationResult;
                }());
                Validation.ValidationResult = ValidationResult;
                /**
                * This is an enuimeration of the validation results
                */
                var ValidationResultStatus = (function () {
                    function ValidationResultStatus() {
                    }
                    ValidationResultStatus.Valid = 'Valid';
                    ValidationResultStatus.InValid = 'Invalid';
                    ValidationResultStatus.InValidWithException = 'InValidWithException';
                    ValidationResultStatus.InValidWithWarning = 'InValidWithWarning';
                    return ValidationResultStatus;
                }());
                Validation.ValidationResultStatus = ValidationResultStatus;
            })(Validation = BusinessLogic.Validation || (BusinessLogic.Validation = {}));
        })(BusinessLogic = BusinessLayer.BusinessLogic || (BusinessLayer.BusinessLogic = {}));
    })(BusinessLayer = ReiSys.BusinessLayer || (ReiSys.BusinessLayer = {}));
})(ReiSys || (ReiSys = {}));
