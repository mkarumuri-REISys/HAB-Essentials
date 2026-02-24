/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
var Platform;
(function (Platform) {
    var EAuthNS;
    (function (EAuthNS) {
        var Web;
        (function (Web) {
            var Script;
            (function (Script) {
                var Util = (function () {
                    function Util() {
                    }
                    Util.loopOnBlur = function (overLayObject) {
                        if (overLayObject.hasClass('loopOnBlur')) {
                            overLayObject.find(":focusable:last").bind('blur', function (e) {
                                var overlayElements = overLayObject.find(":focusable");
                                if (overlayElements.length > 1) {
                                    setTimeout(function () {
                                        overlayElements.first().focus();
                                    }, 10);
                                }
                                else {
                                    var self = $(e.srcElement);
                                    setTimeout(function () { self.focus(); }, 10);
                                }
                            });
                        }
                    };
                    return Util;
                })();
                Script.Util = Util;
                var TimeOut = (function () {
                    function TimeOut(config) {
                        this.config = config;
                        this.loginButtonId = "timeoutOverlayLoginButton";
                        this.logoutButtonId = "warningOverlayLogoutButton";
                        this.continueButtonId = "warningOverlayContinueButton";
                        this.timeoutOverlayPlaceHolder = "sm-timeout-dialog";
                        this.warningOverlayPlaceHolder = "sm-warning-dialog";
                        this.timeoutShadowboxPlaceHolder = "sm-timeout-dialog-shadowbox";
                        this.warningShadowboxPlaceHolder = "sm-warning-dialog-shadowbox";
                    }
                    TimeOut.prototype.getRemainingTime = function () {
                        var time = 0;
                        $.ajax({
                            url: this.config.getRemainingSessionPath,
                            headers: { "Allow-Anonymous": "true" },
                            cache: false,
                            async: false
                        }).done(function (data) {
                            time = data.timeRemaining;
                        });
                        return time;
                    };
                    TimeOut.prototype.navigateToLogin = function () {
                        this.cancelTimer();
                        location.href = this.config.loginPath + "?rUrl=" + window.location.href;
                    };
                    TimeOut.prototype.navigateToLogout = function () {
                        this.cancelTimer();
                        location.href = this.config.logoutPath;
                    };
                    TimeOut.prototype.continueSession = function () {
                        $.ajax({
                            url: this.config.continueSessionPath,
                            async: false
                        }).done(function () { });
                        if ($("#" + this.warningOverlayPlaceHolder).overlay() !== undefined)
                            $("#" + this.warningOverlayPlaceHolder).overlay().close();
                        $("#" + this.warningShadowboxPlaceHolder).hide();
                        this.removeWarningOverlayContent();
                        this.cancelTimer();
                        this.setInitialTimer();
                    };
                    TimeOut.prototype.logout = function () {
                        $.ajax({
                            url: this.config.forceLogoutPath,
                            headers: { "Allow-Anonymous": "true" },
                            cache: false,
                            async: false
                        }).done(function () { return true; });
                    };
                    //Creates the warning overlay window
                    TimeOut.prototype.createWarningOverlayContent = function () {
                        var warningWindow = '';
                        warningWindow += '    <div role="document">';
                        warningWindow += '        <div class ="mtitle" id="windowtitleWarning">';
                        warningWindow += '            Session Timeout Warning';
                        warningWindow += '        </div>';
                        warningWindow += '        <div id="overLaybodyWarning">';
                        warningWindow += '            <div class ="hidden-offscreen">Beginning of dialog window.</div>';
                        warningWindow += '            <div class ="modalwindow clearfix">';
                        warningWindow += '                <div class ="confirm_left">';
                        warningWindow += '                    <div class ="confirm_warn">';
                        warningWindow += ' <span class="hidden-offscreen">Warning</span> ';
                        warningWindow += '                    </div>';
                        warningWindow += '                </div>';
                        warningWindow += '                <div class ="confirm_right">';
                        warningWindow += '                    <b>Your session will be terminated in ';
                        warningWindow += '<span id="warningWindowTimeDiv">';
                        warningWindow += this.config.warningWindowLength / 60;
                        warningWindow += '                minute(s).';
                        warningWindow += '                </b>';
                        warningWindow += '</span>';
                        warningWindow += '                    <br />';
                        warningWindow += '                    <br />';
                        warningWindow += '                    As a security precaution, your session is terminated after ';
                        warningWindow += this.config.sessionLengthInSeconds / 60;
                        warningWindow += '            minute(s) of inactivity.';
                        warningWindow += '            <br />';
                        warningWindow += '                    <br />';
                        warningWindow += '                    To continue your session click the \'Continue\' button. To logout, click the \'Logout\'';
                        warningWindow += '            button.';
                        warningWindow += '                </div>';
                        warningWindow += '            </div>';
                        warningWindow += '            <div class ="greyline">';
                        warningWindow += '                &nbsp;';
                        warningWindow += '            </div>';
                        warningWindow += '            <br />';
                        warningWindow += '            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 ">';
                        warningWindow += '            <p class ="button">';
                        warningWindow += '<input type="submit" class="hrsaSkinnedgobtn" id="' + this.logoutButtonId + '" onclick="timeout.navigateToLogout(); " value="Logout" >';
                        warningWindow += '            </p></div>';
                        warningWindow += '            <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 "><p class ="button pull-right">';
                        warningWindow += '<input type="submit" class="hrsaSkinnedgobtn" id="' + this.continueButtonId + '" onclick="timeout.continueSession(); return false;" value="Continue" >';
                        warningWindow += '            </p></div></div>';
                        warningWindow += '        </div>';
                        warningWindow += '    </div>';
                        $("#" + this.warningOverlayPlaceHolder).html(warningWindow);
                        // Set aria-labelledby (if aria-label or aria-labelledby is not set in html)
                        if (!($("#" + this.warningOverlayPlaceHolder).attr("aria-labelledby"))) {
                            $("#" + this.warningOverlayPlaceHolder).attr('aria-labelledby', "windowtitleWarning");
                        }
                        // Set aria-labelledby (if aria-label or aria-labelledby is not set in html)
                        if (!($("#" + this.warningOverlayPlaceHolder).attr("aria-describedby"))) {
                            $("#" + this.warningOverlayPlaceHolder).attr('aria-describedby', "overLaybodyWarning");
                        }
                    };
                    //Removes the warning overlay window
                    TimeOut.prototype.removeWarningOverlayContent = function () {
                        $("#" + this.timeoutOverlayPlaceHolder).removeAttr("aria-labelledby");
                        $("#" + this.timeoutOverlayPlaceHolder).removeAttr("aria-describedby");
                        $("#" + this.warningOverlayPlaceHolder).empty();
                        $("#" + this.warningShadowboxPlaceHolder).hide();
                    };
                    //Creates the timeout overlay window
                    TimeOut.prototype.createTimeoutOverlayContent = function () {
                        var timeoutWindow = '';
                        timeoutWindow += '      <div role="document" >';
                        timeoutWindow += '          <div class ="hidden-offscreen">Beginning of dialog window.</div>';
                        timeoutWindow += '          <div class ="mtitle" id="windowtitle">';
                        timeoutWindow += '              Session Timeout';
                        timeoutWindow += '          </div>';
                        timeoutWindow += '          <div id="overLaybody">';
                        timeoutWindow += '              <div class ="modalwindow clearfix">';
                        timeoutWindow += '                  <div class ="confirm_left" >';
                        timeoutWindow += '                      <div class ="confirm_warn">';
                        timeoutWindow += '   <span class = "hidden-offscreen" > Warning </span >';
                        timeoutWindow += '                      </div>';
                        timeoutWindow += '                  </div>';
                        timeoutWindow += '                  <div class ="confirm_right">';
                        timeoutWindow += '                     <b>As a security precaution, your session was terminated after ';
                        timeoutWindow += this.config.sessionLengthInSeconds / 60;
                        timeoutWindow += '              minute(s) of inactivity.</b>';
                        timeoutWindow += '                  <br />';
                        timeoutWindow += '                  <br />';
                        timeoutWindow += '                      You were provided with an option to continue ';
                        timeoutWindow += this.config.warningWindowLength / 60;
                        timeoutWindow += '              minute(s) before the timeout. Since we did not detect any response from you, you';
                        timeoutWindow += '              were logged out. Please login again.';
                        timeoutWindow += '                  </div>';
                        timeoutWindow += '              </div>';
                        timeoutWindow += '              <div class ="greyline">';
                        timeoutWindow += '                  &nbsp;';
                        timeoutWindow += '              </div>';
                        timeoutWindow += '              <br />';
                        timeoutWindow += '              <p class ="button btnLeft">';
                        timeoutWindow += '<input type="submit" class="hrsaSkinnedgobtn" id="' + this.loginButtonId + '" onclick="timeout.navigateToLogin(); " value="Login" >';
                        timeoutWindow += '              </p>';
                        timeoutWindow += '              <p class ="button btnRight">';
                        timeoutWindow += '              </p>';
                        timeoutWindow += '          </div>';
                        timeoutWindow += '      </div>';
                        // Set aria-labelledby (if aria-label or aria-labelledby is not set in html)
                        if (!($("#" + this.timeoutOverlayPlaceHolder).attr("aria-labelledby"))) {
                            $("#" + this.timeoutOverlayPlaceHolder).attr('aria-labelledby', "windowtitle");
                        }
                        // Set aria-labelledby (if aria-label or aria-labelledby is not set in html)
                        if (!($("#" + this.timeoutOverlayPlaceHolder).attr("aria-describedby"))) {
                            $("#" + this.timeoutOverlayPlaceHolder).attr('aria-describedby', "overLaybody");
                        }
                        $("#" + this.timeoutOverlayPlaceHolder).html(timeoutWindow);
                    };
                    //Removes the warning overlay window
                    TimeOut.prototype.removeTimeoutOverlayContent = function () {
                        try {
                            $("#" + this.timeoutOverlayPlaceHolder).overlay().close();
                        }
                        catch (ex) {
                            if (window.console)
                                window.console.log(ex);
                        }
                        $("#" + this.timeoutOverlayPlaceHolder).removeAttr("aria-labelledby");
                        $("#" + this.timeoutOverlayPlaceHolder).removeAttr("aria-describedby");
                        $("#" + this.timeoutOverlayPlaceHolder).empty();
                    };
                    //Shows the timeout overlay window
                    TimeOut.prototype.showTimeoutOverlay = function () {
                        var _this = this;
                        this.createTimeoutOverlayContent();
                        $("#" + this.timeoutOverlayPlaceHolder).overlay({
                            expose: {
                                color: "#000",
                                loadSpeed: 200,
                                opacity: 0.30
                            },
                            closeOnClick: false,
                            closeOnEsc: false,
                            load: true,
                            close: $("#" + this.loginButtonId),
                            onLoad: function () {
                                $("#exposeMask").show();
                                //bring focus to the login button
                                $("#" + _this.loginButtonId).focus();
                                //add login button lost focus to put focus to login button
                                $("#" + _this.loginButtonId).blur(function () {
                                    setTimeout(function () {
                                        $("#" + _this.loginButtonId).focus();
                                    }, 5);
                                });
                                Util.loopOnBlur($("#" + _this.timeoutOverlayPlaceHolder));
                            },
                            onClose: function () {
                                //remove sole focus from login button
                                $("#" + _this.loginButtonId).off("blur");
                            }
                        }).load();
                        $("#" + this.timeoutShadowboxPlaceHolder).show();
                        var self = this;
                        if (!$("#exposeMask").is(":visible")) {
                            //bring focus to the login button
                            $("#" + this.loginButtonId).focus();
                            //add login button lost focus to put focus to login button
                            $("#" + this.loginButtonId).blur(function () {
                                setTimeout(function () {
                                    $("#" + self.loginButtonId).focus();
                                }, 5);
                            });
                            $("#" + this.timeoutOverlayPlaceHolder + ".close").remove();
                        }
                    };
                    //Shows session timeout warning window
                    TimeOut.prototype.showWarningOverlay = function () {
                        var _this = this;
                        this.createWarningOverlayContent();
                        $("#" + this.warningOverlayPlaceHolder).overlay({
                            expose: {
                                color: "#000",
                                loadSpeed: 200,
                                opacity: 0.30
                            },
                            closeOnClick: false,
                            closeOnEsc: false,
                            load: true,
                            close: $("#" + this.continueButtonId),
                            onLoad: function () {
                                $("#exposeMask").show();
                                //bring focus to the continue button 
                                $("#" + _this.continueButtonId).focus();
                                //add continue button lost focus to put focus to logout button
                                Util.loopOnBlur($("#" + _this.warningOverlayPlaceHolder));
                            },
                            onClose: function () {
                                $("#" + _this.continueButtonId).off("focusout");
                                //remove lost  focus from continue button
                            }
                        }).load();
                        $("#" + this.warningShadowboxPlaceHolder).show();
                        if (!$("#exposeMask").is(":visible")) {
                            $("#" + this.continueButtonId).focus();
                            //add continue button lost focus to put focus to logout button
                            $("#" + this.continueButtonId).focusout(function () { $("#" + _this.logoutButtonId).focus(); });
                            $("#" + this.warningOverlayPlaceHolder + ".close").remove();
                        }
                    };
                    //Function that gets fired at the end of the time out
                    TimeOut.prototype.timeElapsed = function (refreshWarningOverlay) {
                        var timeRemaining = this.getRemainingTime();
                        if (timeRemaining <= 0) {
                            this.logout();
                            this.removeWarningOverlayContent();
                            this.showTimeoutOverlay();
                        }
                        else if (timeRemaining <= this.config.warningWindowLength) {
                            if (this.config.warningCheckInterval > this.config.warningWindowLength) {
                                this.setTimeTilOverlayCountDown(timeRemaining * 1000, false);
                            }
                            else {
                                if (this.config.warningCheckInterval < timeRemaining) {
                                    this.setTimeTilOverlayCountDown(this.config.warningCheckInterval * 1000, false);
                                }
                                else {
                                    this.setTimeTilOverlayCountDown(timeRemaining * 1000, false);
                                }
                            }
                            if (refreshWarningOverlay) {
                                this.removeTimeoutOverlayContent();
                                this.showWarningOverlay();
                            }
                        }
                        else {
                            clearTimeout(this.warningCountdownIntervalId);
                            this.removeWarningOverlayContent();
                            this.setTimeTilOverlayCountDown((timeRemaining - this.config.warningWindowLength) * 1000, true);
                            try {
                                $("#" + this.warningOverlayPlaceHolder).overlay().close();
                                this.removeWarningOverlayContent();
                            }
                            catch (ex) {
                                if (window.console)
                                    window.console.log(ex);
                            }
                        }
                    };
                    //Sets the overlay to the amount of time til 
                    TimeOut.prototype.setInitialTimer = function () {
                        var timeTilWarningInSeconds = (this.config.sessionLengthInSeconds - this.config.warningWindowLength) * 1000;
                        this.setTimeTilOverlayCountDown(timeTilWarningInSeconds, true);
                    };
                    TimeOut.prototype.warningOverlayCountDown = function (timeRemainingInSec) {
                        var _this = this;
                        var count = timeRemainingInSec;
                        var countdown = function () {
                            var countInMin = Math.ceil(count / 60);
                            var unitToDisplay = countInMin >= 1 ? countInMin + " minute(s)." : Math.ceil(count) + " second(s).";
                            $("#warningWindowTimeDiv").html(unitToDisplay);
                            if (count === 0) {
                                $("#" + _this.warningOverlayPlaceHolder).overlay().close();
                                clearTimeout(_this.warningCountdownIntervalId);
                                _this.removeWarningOverlayContent();
                                _this.logout();
                                _this.showTimeoutOverlay();
                            }
                            count--;
                        };
                        countdown();
                        this.warningCountdownIntervalId = window.setInterval(countdown, 1000);
                    };
                    //Sets the countdown to a specific amount of time
                    TimeOut.prototype.setTimeTilOverlayCountDown = function (time, refreshWarningOverlay) {
                        var _this = this;
                        this.timerId = setTimeout(function () { _this.timeElapsed(refreshWarningOverlay); }, time);
                    };
                    //Cancels the timeout timer
                    TimeOut.prototype.cancelTimer = function () {
                        window.clearTimeout(this.timerId);
                        window.clearTimeout(this.warningCountdownIntervalId);
                    };
                    return TimeOut;
                })();
                Script.TimeOut = TimeOut;
            })(Script = Web.Script || (Web.Script = {}));
        })(Web = EAuthNS.Web || (EAuthNS.Web = {}));
    })(EAuthNS = Platform.EAuthNS || (Platform.EAuthNS = {}));
})(Platform || (Platform = {}));
//# sourceMappingURL=TimeOut.js.map