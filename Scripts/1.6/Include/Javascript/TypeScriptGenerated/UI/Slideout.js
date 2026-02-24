var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var SlideoutController = (function (_super) {
                __extends(SlideoutController, _super);
                function SlideoutController(settings) {
                    _super.call(this);
                    this.settings = settings;
                    ////
                    // raised before the slideout opens
                    ////
                    this.OnPreOpen = new GlobalPlatformEvent('OnPreOpen');
                    ////
                    // raised after the slideout opens
                    ////
                    this.OnOpenComplete = new GlobalPlatformEvent('OnOpenComplete');
                    ////
                    // raised before the slideout closes
                    ////
                    this.OnPreClose = new GlobalPlatformEvent('OnPreClose');
                    ////
                    // raised after the slideout closes
                    ////
                    this.OnCloseComplete = new GlobalPlatformEvent('OnCloseComplete');
                    this.RegisterController(settings.ControlId);
                    this.createDefinitions();
                }
                SlideoutController.prototype.createDefinitions = function () {
                    if (this.settings.Direction === 0 /* RIGHT */) {
                        this.openDefinition = { right: this.settings.SlideAmount };
                        this.closeDefinition = { right: '-' + this.settings.Width };
                    }
                    else if (this.settings.Direction === 1 /* LEFT */) {
                        this.openDefinition = { left: this.settings.SlideAmount };
                        this.closeDefinition = { left: '-' + this.settings.Width };
                    }
                };
                ////
                // opens the slide out
                ////
                SlideoutController.prototype.open = function (top, shiftToCurrentViewport) {
                    this.OnPreOpen.raise(this, this.settings);
                    var control = $('#' + this.settings.ControlClientId);
                    if (top) {
                        if (shiftToCurrentViewport) {
                            var windowScrollTop = $(window).scrollTop();
                            var windowHeight = $(window).height();
                            var sliderHeight = $('#' + this.settings.ControlClientId).height();
                            //if top is above the viewport, then bring it down
                            if (top < windowScrollTop) {
                                top = windowScrollTop + 10;
                            }
                            else if ((top + sliderHeight) > (windowScrollTop + windowHeight)) {
                                top = (windowScrollTop + windowHeight) - sliderHeight - 60;
                            }
                            //make sure that it is above the footer if present
                            var footer = document.getElementById('footer');
                            if (footer !== null) {
                                var maxHeight = footer.getBoundingClientRect().top + windowScrollTop;
                                if ((top + sliderHeight) > maxHeight) {
                                    top -= (top + sliderHeight - maxHeight);
                                }
                            }
                        }
                        control.css('top', top);
                    }
                    control.show();
                    $(':focusable', control).first().focus();
                    var promise = control.animate({
                        right: this.settings.SlideAmount,
                    }).promise();
                    this.OnOpenComplete.raise(this, this.settings);
                    return promise;
                };
                ////
                // closes the slide out
                ////
                SlideoutController.prototype.close = function () {
                    this.OnPreClose.raise(this, this.settings);
                    var control = $('#' + this.settings.ControlClientId);
                    control.animate(this.closeDefinition, 400, function () {
                        control.hide();
                    });
                    this.OnCloseComplete.raise(this, this.settings);
                };
                return SlideoutController;
            })(ReiSys.Platform.Controller.BaseComponentController);
            UI.SlideoutController = SlideoutController;
            var SlideoutSettings = (function () {
                function SlideoutSettings(ControlId, ControlClientId, BodyId, HeaderId, FooterId, Direction, SlideAmount, Width) {
                    this.ControlId = ControlId;
                    this.ControlClientId = ControlClientId;
                    this.BodyId = BodyId;
                    this.HeaderId = HeaderId;
                    this.FooterId = FooterId;
                    this.Direction = Direction;
                    this.SlideAmount = SlideAmount;
                    this.Width = Width;
                }
                return SlideoutSettings;
            })();
            UI.SlideoutSettings = SlideoutSettings;
            (function (SlideoutDirection) {
                SlideoutDirection[SlideoutDirection["RIGHT"] = 0] = "RIGHT";
                SlideoutDirection[SlideoutDirection["LEFT"] = 1] = "LEFT";
            })(UI.SlideoutDirection || (UI.SlideoutDirection = {}));
            var SlideoutDirection = UI.SlideoutDirection;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
//# sourceMappingURL=Slideout.js.map