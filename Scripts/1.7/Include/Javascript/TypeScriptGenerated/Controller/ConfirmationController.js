var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="basecomponentcontroller.ts" />
var REISys;
(function (REISys) {
    var EPS;
    (function (EPS) {
        var UI;
        (function (UI) {
            var ConfirmationController = (function (_super) {
                __extends(ConfirmationController, _super);
                function ConfirmationController() {
                    _super.apply(this, arguments);
                }
                ConfirmationController.prototype.confirm = function () {
                    this.closeOverlay();
                    this._deffered.resolve(true);
                };
                ////
                // closes the overlay removes the validation and clears the fields
                ////
                ConfirmationController.prototype.cancel = function () {
                    this.closeOverlay();
                    this._deffered.resolve(false);
                };
                ////
                // closes the overlay
                ////
                ConfirmationController.prototype.closeOverlay = function () {
                    $("#" + this.FindClientId('overlayId')).overlay().close();
                };
                ////
                // Opens the overlay and takes in a message 
                ////
                ConfirmationController.prototype.openConfirmationWindow = function (message, warningMessage) {
                    if (warningMessage === void 0) { warningMessage = ''; }
                    this._deffered = $.Deferred();
                    $("#" + this.FindClientId('messageHolder')).html(message);
                    $("#" + this.FindClientId('warningMessageHolder')).html(warningMessage);
                    if (warningMessage != '') {
                        $("#" + this.FindClientId('warningHeaderOverlay')).show();
                    }
                    else {
                        $("#" + this.FindClientId('warningHeaderOverlay')).hide();
                    }
                    this.showOverlay();
                    return this._deffered;
                };
                ////
                // shows the overlay
                ////
                ConfirmationController.prototype.showOverlay = function () {
                    //ID of the overlay remove hard coded          
                    $("#" + this.FindClientId('overlayId')).overlay({
                        expose: {
                            color: '#000',
                            loadSpeed: 200,
                            opacity: 0.30
                        },
                        closeOnClick: false,
                        closeOnEsc: true,
                        load: true,
                        onLoad: function () {
                            var overlay = this.getOverlay();
                            var close = overlay.find(".close");
                            if ($(close).children('#imgClose').length == 0) {
                                close.append("<img id='imgClose' src='" + REISys.Platform.WebRoot + "/platform/include/skins/" + ReiSys.Utilities.Util.ImagePath + "/images/close_1.png" + "' alt='Close Window'/>");
                            }
                            //bring focus to the first Item 
                            $('#' + REISys.EPS.UI.confirmationController.FindClientId('cancelBtn')).focus();
                            //Last Item brings focus back to the esc button
                            $(close).attr('href', 'javascript:void(0)');
                            $('#' + REISys.EPS.UI.confirmationController.FindClientId('confirmBtn')).focusout(function () {
                                $(close).focus();
                            });
                            $(close).click(function () {
                                REISys.EPS.UI.confirmationController.cancel();
                            });
                        },
                        onClose: function () {
                            //bring focus back to the create new team button 
                            //  $('#' + this._returnFocusId).focus();
                            //   $('[id="' + REISys.EPS.UI.confirmationController.FindClientId('createTeamBtn') + '"]').parent().focus();
                            var deffered = REISys.EPS.UI.confirmationController._deffered;
                            if (deffered.state() != "resolved") {
                                deffered.resolve(false);
                            }
                        }
                    }).load();
                };
                ////
                // Registers the controls with their ids
                ////
                ConfirmationController.prototype.RegisterClientIds = function (clientIds) {
                    var _this = this;
                    _super.prototype.RegisterClientIds.call(this, clientIds);
                    $('#' + this.FindClientId('confirmBtn')).click(function (e) { _this.confirm(); e.stopPropagation(); });
                    $('#' + this.FindClientId('cancelBtn')).click(function (e) { _this.cancel(); e.stopPropagation(); });
                };
                return ConfirmationController;
            }(ReiSys.Platform.Controller.BaseComponentController));
            UI.ConfirmationController = ConfirmationController;
            UI.confirmationController = new ConfirmationController();
        })(UI = EPS.UI || (EPS.UI = {}));
    })(EPS = REISys.EPS || (REISys.EPS = {}));
})(REISys || (REISys = {}));
