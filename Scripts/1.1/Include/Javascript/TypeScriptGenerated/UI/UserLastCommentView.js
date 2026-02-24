/// <reference path="../externalts/platformlib.d.ts" />
/// <reference path="../utilities/utilities.ts" />
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var UserControls;
        (function (UserControls) {
            var UserLastCommentView;
            (function (UserLastCommentView) {
                var UserActionModel = (function () {
                    function UserActionModel() {
                    }
                    return UserActionModel;
                })();
                UserLastCommentView.UserActionModel = UserActionModel;
                var UserActionEventArgs = (function () {
                    function UserActionEventArgs() {
                    }
                    return UserActionEventArgs;
                })();
                UserLastCommentView.UserActionEventArgs = UserActionEventArgs;
                var ViewModel = (function () {
                    function ViewModel() {
                        var _this = this;
                        this.serviceUrl = REISys.Platform.WebRoot + "/api/Platform/Services/UserAction/GetUserLastComment";
                        this.Arguments = ko.observable();
                        this.Model = ko.observable();
                        this.MaxTextLength = 250;
                        this.Collapsed = ko.observable(true);
                        this.Visible = ko.observable(true);
                        //Following properties needs to be observable as we use in conditions.
                        this.Comments = ko.observable("");
                        this.ShortComments = ko.observable("");
                        this.NoRecordFoundMessage = ko.observable("");
                        this.ViewAllLink = ko.observable("");
                        this.HasData = ko.computed(function () {
                            return _this.Model() && _this.Model().ActionTakenBy && _this.Model().ActionTakenBy != "";
                        });
                        this.IsCollapsable = ko.computed(function () {
                            return _this.Model() && _this.Model().Comments.length > _this.MaxTextLength;
                        });
                        this.DataBind = function (koRoot, args) {
                            ko.applyBindings(_this, koRoot);
                            _this.Arguments(args);
                            //Business Logic
                            if (args.UseWorkFlow === true)
                                args.UserActionType = null;
                            if (args.Resources == null && args.Resource != null)
                                args.Resources = [args.Resource];
                            //Load data.
                            ReiSys.Platform.Utilities.WebServiceUtils.SendXmlHttpRequest(_this.serviceUrl, _this.DisplayComment, args);
                        };
                        this.ToggleExpandCollapse = function () {
                            _this.Collapsed(!_this.Collapsed());
                        };
                        this.Show = function () {
                            _this.Visible(true);
                        };
                        this.Hide = function () {
                            _this.Visible(false);
                        };
                        this.DisplayComment = function (data) {
                            _this.Model(data);
                            if (_this.HasData() === true) {
                                //Business Logic
                                _this.Comments(_this.Model().Comments);
                                _this.ViewAllLink(_this.Arguments().ViewAllLink);
                                _this.NoRecordFoundMessage(_this.Arguments().NoRecordFoundMessage);
                                if (_this.IsCollapsable() === true)
                                    _this.ShortComments(_this.Model().Comments.substring(0, _this.MaxTextLength));
                                // Configure tool-tip.  
                                $('#viewAllLink').tipTip();
                            }
                        };
                    }
                    return ViewModel;
                })();
                UserLastCommentView.ViewModel = ViewModel;
            })(UserLastCommentView = UserControls.UserLastCommentView || (UserControls.UserLastCommentView = {}));
        })(UserControls = Platform.UserControls || (Platform.UserControls = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
