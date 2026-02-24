/// <reference path="../ExternalTS/UnofficialThirdParty.d.ts" />
/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../Utilities/Util.ts"/>
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var Timeout = (function () {
                //Sets default values for the timeout and session times
                function Timeout() {
                    this.Util = ReiSys.Utilities.Util;
                    this.UseWCF = false;
                    this.ContinueButtonId = 'timeoutOverlayContinueButton';
                    this.LogoutButtonId = 'timeoutOverlayLogoutButton';
                    this.LoginButtonId = 'timeoutOverlayLoginButton';
                    //default values overridden in Timeout.ascx
                    this.TimeTilWarningInSeconds = (30 - 5) * 60;
                    this.SessionLengthInSeconds = 30 * 60;
                    this.WarningCheckInterval = 60;
                    //this.CountDownTimeOut = true;
                    if (this.UseWCF) {
                        this.ServiceLocation = 'Platform/WebServices/UserAuthenticationWS.svc';
                    }
                    else {
                        this.ServiceLocation = 'Platform/Interface/Services/SessionService.aspx';
                    }
                }
                //Sets the overlay to the amount of time til 
                Timeout.prototype.SetInitialTimer = function () {
                    this.SetTimeTilOverlayCountDown(this.TimeTilWarningInSeconds);
                };
                //Sets the countdown to a specific amount of time
                Timeout.prototype.SetTimeTilOverlayCountDown = function (time) {
                    this.TimerId = setTimeout(function () { timeout.TimeElapsed(); }, time * 1000);
                };
                //Cancels the timeout timer
                Timeout.prototype.CancelTimer = function () {
                    window.clearTimeout(this.TimerId);
                };
                //Function that gets fired at the end of the time out
                Timeout.prototype.TimeElapsed = function () {
                    var timeRemaining = 0;
                    //Call web service and set timeRemaining
                    timeRemaining = this.GetTimeRemaining();
                    if (timeRemaining <= 0) {
                        //CallLogoutService
                        this.Logout();
                        //Timeout overlay
                        this.RemoveWarningOverlayContent();
                        this.ShowTimeoutOverlay();
                        //clear access token for autosave
                        window.sessionStorage.removeItem('pfm_access_token');
                    }
                    else if (timeRemaining <= this.WarningWindowLength) {
                        //Beging timer til logout
                        if (this.WarningCheckInterval > this.WarningWindowLength) {
                            this.SetTimeTilOverlayCountDown(timeRemaining);
                        }
                        else {
                            if (this.WarningCheckInterval < timeRemaining) {
                                this.SetTimeTilOverlayCountDown(this.WarningCheckInterval);
                            }
                            else {
                                this.SetTimeTilOverlayCountDown(timeRemaining);
                            }
                        }
                        this.RemoveTimeoutOverlayContent();
                        this.ShowWarningOverlay();
                        if (this.CountDownTimeOut) {
                            $('#warningWindowTimeDiv').html(Math.ceil(timeRemaining / 60) + '');
                        }
                    }
                    else {
                        this.SetTimeTilOverlayCountDown(timeRemaining - this.WarningWindowLength);
                        try {
                            $('#SessionWarningDivShadowbox').hide();
                            $('#SessionWarningDiv').overlay().close();
                            this.RemoveWarningOverlayContent();
                        }
                        catch (ex) {
                        }
                    }
                };
                //Creates the warning overlay window
                Timeout.prototype.CreateWarningOverlayContent = function () {
                    var warningWindow = '';
                    warningWindow += '<div class ="reimodal loopOnBlu " id="SessionWarningDiv" style="width: 600px; height: auto;" role="dialog" aria-labelledby="windowtitleWarning" aria-describedby="overLaybodyWarning">';
                    warningWindow += '    <div role="document">';
                    warningWindow += '        <div class ="mtitle" id="windowtitleWarning">';
                    warningWindow += '            Session Time Out Warning';
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
                    warningWindow += this.WarningWindowLength / 60;
                    warningWindow += '</span>';
                    warningWindow += '                minute(s).</b>';
                    warningWindow += '                    <br />';
                    warningWindow += '                    <br />';
                    warningWindow += '                    As a security precaution, your session is terminated after ';
                    warningWindow += this.SessionLengthInSeconds / 60;
                    warningWindow += '            minute(s) of inactivity.';
                    warningWindow += '            <br />';
                    warningWindow += '                    <br />';
                    warningWindow += '                    To continue your session, click the <b>\'Continue\'</b> button. To log out, click the <b>\'Logout\'</b>';
                    warningWindow += '            button.';
                    warningWindow += '                </div>';
                    warningWindow += '            </div>';
                    warningWindow += '            <div class ="greyline">';
                    warningWindow += '                &nbsp;';
                    warningWindow += '            </div>';
                    warningWindow += '            <br />';
                    warningWindow += '            <p class ="button btnLeft">';
                    warningWindow += '<input type="submit" class="hrsaSkinnedgobtn" id="' + this.LogoutButtonId + '" onclick="timeout.Logout(); timeout.NavigateToLogout(); " value="Logout" >';
                    warningWindow += '            </p>';
                    warningWindow += '            <p class ="button btnRight">';
                    warningWindow += '<input type="submit" class="hrsaSkinnedgobtn" id="' + this.ContinueButtonId + '" onclick="timeout.ContinueSession(); return false;" value="Continue" >';
                    warningWindow += '            </p>';
                    warningWindow += '        </div>';
                    warningWindow += '    </div>';
                    warningWindow += '</div>';
                    $('#SessionWarningDivShadowbox').append(warningWindow);
                };
                //Removes the warning overlay window
                Timeout.prototype.RemoveWarningOverlayContent = function () {
                    $('#SessionWarningDiv').remove();
                };
                //Creates the timedout overlay window
                Timeout.prototype.CreateTimeoutOverlayContent = function () {
                    var timeoutWindow = '';
                    timeoutWindow += '<div class ="reimodal loopOnBlur " id="SessionTimeOutDiv" style="width: 600px; height: auto;" role="dialog" aria-labelledby="windowtitle" aria-describedby="overLaybody">';
                    timeoutWindow += '      <div role="document">';
                    timeoutWindow += '          <div class ="hidden-offscreen">Beginning of dialog window.</div>';
                    timeoutWindow += '          <div class ="mtitle" id="windowtitle">';
                    timeoutWindow += '              Session Time Out';
                    timeoutWindow += '          </div>';
                    timeoutWindow += '          <div id="overLaybody">';
                    timeoutWindow += '              <div class ="modalwindow clearfix">';
                    timeoutWindow += '                  <div class ="confirm_left">';
                    timeoutWindow += '                      <div class ="confirm_warn">';
                    timeoutWindow += '   <span class = "hidden-offscreen" > Warning </span >';
                    timeoutWindow += '                      </div>';
                    timeoutWindow += '                  </div>';
                    timeoutWindow += '                  <div class ="confirm_right">';
                    timeoutWindow += '                      As a security precaution, your session was terminated after ';
                    timeoutWindow += timeout.SessionLengthInSeconds / 60;
                    timeoutWindow += '              minute(s) of inactivity.';
                    timeoutWindow += '              <br/>';
                    timeoutWindow += '              <br/>';
                    timeoutWindow += '              You were provided with an option to continue ';
                    timeoutWindow += timeout.WarningWindowLength / 60;
                    timeoutWindow += '              minute(s) before the time out.';
                    timeoutWindow += '              <br/>';
                    timeoutWindow += '              <br/>';
                    timeoutWindow += '              Since we did not detect any response from you, you were logged out.';
                    timeoutWindow += '              <br/>';
                    timeoutWindow += '              <br/>';
                    timeoutWindow += '              Please click on the <b>\'Login\'</b> button if you wish to log in again.';
                    timeoutWindow += '                  </div>';
                    timeoutWindow += '              </div>';
                    timeoutWindow += '              <div class ="greyline">';
                    timeoutWindow += '                  &nbsp;';
                    timeoutWindow += '              </div>';
                    timeoutWindow += '              <br />';
                    timeoutWindow += '              <p class ="button btnLeft">';
                    timeoutWindow += '<input type="submit" class="hrsaSkinnedgobtn" id="' + this.LoginButtonId + '" onclick="timeout.NavigateToLogin(); " value="Login" >';
                    timeoutWindow += '              </p>';
                    timeoutWindow += '              <p class ="button btnRight">';
                    timeoutWindow += '              </p>';
                    timeoutWindow += '          </div>';
                    timeoutWindow += '      </div>';
                    timeoutWindow += '  </div>';
                    $('#SessionTimeOutDivShadowbox').append(timeoutWindow);
                };
                //Removes the timedout overlay window
                Timeout.prototype.RemoveTimeoutOverlayContent = function () {
                    $('#SessionTimeOutDiv').remove();
                };
                //Displays the Time out overlay
                Timeout.prototype.ShowWarningOverlay = function () {
                    this.CreateWarningOverlayContent();
                    $('#SessionWarningDiv').overlay({
                        expose: {
                            color: '#000',
                            loadSpeed: 200,
                            opacity: 0.30
                        },
                        closeOnClick: false,
                        closeOnEsc: false,
                        load: true,
                        close: $('#' + timeout.ContinueButtonId),
                        onLoad: function () {
                            $('#exposeMask').show();
                            //bring focus to the continue button 
                            $('#' + timeout.ContinueButtonId).focus();
                            //add continue button lost focus to put focus to logout button
                            $('#' + timeout.ContinueButtonId).focusout(function () { $('#' + timeout.LogoutButtonId).focus(); });
                        },
                        onClose: function () {
                            $('#' + timeout.ContinueButtonId).off('focusout');
                            //remove lost  focus from continue button
                        }
                    }).load();
                    $('#SessionWarningDivShadowbox').show();
                    if (!$('#exposeMask').is(":visible")) {
                        $('#' + timeout.ContinueButtonId).focus();
                        //add continue button lost focus to put focus to logout button
                        $('#' + timeout.ContinueButtonId).focusout(function () { $('#' + timeout.LogoutButtonId).focus(); });
                        $('#SessionWarningDiv .close').remove();
                    }
                };
                //Displays the Time out overlay
                Timeout.prototype.ShowTimeoutOverlay = function () {
                    this.CreateTimeoutOverlayContent();
                    $('#SessionTimeOutDiv').overlay({
                        expose: {
                            color: '#000',
                            loadSpeed: 200,
                            opacity: 0.30
                        },
                        closeOnClick: false,
                        closeOnEsc: false,
                        load: true,
                        close: $('#' + timeout.LoginButtonId),
                        onLoad: function () {
                            $('#exposeMask').show();
                            //bring focus to the login button
                            $('#' + timeout.LoginButtonId).focus();
                            //add login button lost focus to put focus to login button
                            $('#' + timeout.LoginButtonId).blur(function () {
                                setTimeout(function () {
                                    $('#' + timeout.LoginButtonId).focus();
                                }, 5);
                            });
                        },
                        onClose: function () {
                            //remove sole focus from login button
                            $('#' + timeout.LoginButtonId).off('blur');
                        }
                    }).load();
                    $('#SessionTimeOutDivShadowbox').show();
                    if (!$('#exposeMask').is(":visible")) {
                        //bring focus to the login button
                        $('#' + timeout.LoginButtonId).focus();
                        //add login button lost focus to put focus to login button
                        $('#' + timeout.LoginButtonId).blur(function () {
                            setTimeout(function () {
                                $('#' + timeout.LoginButtonId).focus();
                            }, 5);
                        });
                        $('#SessionTimeOutDiv .close').remove();
                    }
                };
                //Gets the number of seconds remaining in the sesion
                Timeout.prototype.GetTimeRemaining = function () {
                    var toReturn = 0;
                    var url = this.Util.BaseUrl + this.ServiceLocation + '/TimeToSessionTimeout';
                    if (this.UseWCF) {
                        toReturn = parseInt(this.Util.PostJsonToServiceWithNoParams(url));
                    }
                    else {
                        toReturn = parseInt(this.Util.PostJsonToServiceWithNoParams(url).d);
                    }
                    return toReturn;
                };
                //Logs the user out
                Timeout.prototype.Logout = function () {
                    var url = this.Util.BaseUrl + this.ServiceLocation + '/Logout';
                    this.Util.PostJsonToServiceWithNoParams(url);
                    //clear access token for autosave
                    window.sessionStorage.removeItem('pfm_access_token');
                };
                //Continues the User session
                Timeout.prototype.ContinueSession = function () {
                    var url = this.Util.BaseUrl + this.ServiceLocation + '/ContinueSession';
                    this.Util.PostJsonToServiceWithNoParams(url);
                    $('#' + timeout.LoginButtonId).off('blur');
                    $('#SessionWarningDiv').overlay().close();
                    $('#SessionWarningDivShadowbox').hide();
                    this.RemoveWarningOverlayContent();
                    this.CancelTimer();
                    this.SetInitialTimer();
                };
                //Navigates the page to the logout page
                Timeout.prototype.NavigateToLogout = function () {
                    window.location.href = this.LogoutPage + "?" + this.LogoutParam + '=' + encodeURIComponent(window.location.href);
                };
                //navigates to the login page
                Timeout.prototype.NavigateToLogin = function () {
                    window.location.href = this.LoginPage + "?" + this.LogoutParam + '=' + encodeURIComponent(window.location.href);
                };
                return Timeout;
            }());
            UI.Timeout = Timeout;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
var timeout = new ReiSys.Platform.UI.Timeout();
