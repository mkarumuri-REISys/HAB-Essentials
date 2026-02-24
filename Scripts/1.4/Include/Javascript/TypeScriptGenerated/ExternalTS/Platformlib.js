/// <reference path="../ExternalTS/jquery.d.ts" />
/**
* this file exists for prexisiting platform functions what would need to be called for
**/
(function ($) {
    $.fn.tipTip = function () {
    };
})(jQuery);
;
var allUIMenus;
var ContextMenuOnClick;
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var ErrorMessages = (function () {
                function ErrorMessages() {
                }
                ErrorMessages.addMessages = function (message) { };
                ErrorMessages.setVisible = function (flag) { };
                ErrorMessages.removeAllMessages = function () { };
                return ErrorMessages;
            }());
            Layout.ErrorMessages = ErrorMessages;
            var SuccessMessages = (function () {
                function SuccessMessages() {
                }
                SuccessMessages.addMessages = function (message) { };
                SuccessMessages.setVisible = function (flag) { };
                SuccessMessages.removeAllMessages = function () { };
                return SuccessMessages;
            }());
            Layout.SuccessMessages = SuccessMessages;
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
