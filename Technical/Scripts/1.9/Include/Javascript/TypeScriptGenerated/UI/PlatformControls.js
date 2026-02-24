/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../ExternalTS/Platformlib.ts" />
/// <reference path="../ExternalTS/Telerik.ts"/>
/// <reference path="../Utilities/Util.ts"/>
var REISys;
(function (REISys) {
    (function (Platform) {
        (function (Web) {
            var StatusReview = (function () {
                function StatusReview() {
                }
                StatusReview.OnStatusReviewLoad = new GlobalPlatformEvent('OnStatusReviewLoad');
                StatusReview.DataSouce = {};
                StatusReview.TOCGridVisible = {};
                StatusReview.TOCNavigatorVisible = {};
                return StatusReview;
            })();
            Web.StatusReview = StatusReview;
        })(Platform.Web || (Platform.Web = {}));
        var Web = Platform.Web;
    })(REISys.Platform || (REISys.Platform = {}));
    var Platform = REISys.Platform;
})(REISys || (REISys = {}));
//# sourceMappingURL=PlatformControls.js.map
