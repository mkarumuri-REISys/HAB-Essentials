var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var LastActions;
        (function (LastActions) {
            var LastActionItem = (function () {
                function LastActionItem(url, ajaxRequestUrls, pageActions) {
                    this.url = url;
                    this.ajaxRequestUrls = ajaxRequestUrls;
                    this.pageActions = pageActions;
                }
                return LastActionItem;
            })();
            LastActions.LastActionItem = LastActionItem;
            var LastActionsModel = (function () {
                function LastActionsModel(json) {
                    this.items = [];
                    if (json != null) {
                        var temp = JSON.parse(json);
                        this.items = temp.items;
                    }
                }
                ;
                LastActionsModel.prototype.addUrl = function (url) {
                    //for now hardcode to 5, later set to a configured value
                    if (this.items.length == 5)
                        this.items = this.items.splice(1);
                    this.items.push(new LastActionItem(url, [], []));
                };
                LastActionsModel.prototype.addAjaxRequestUrl = function (url, pageUrl) {
                    for (var i = this.items.length - 1; i >= 0; i--) {
                        if (this.items[i].url == pageUrl) {
                            if (this.items[i].ajaxRequestUrls.length == 10)
                                this.items[i].ajaxRequestUrls = this.items[i].ajaxRequestUrls.splice(1);
                            this.items[i].ajaxRequestUrls.push(url);
                            return;
                        }
                    }
                };
                LastActionsModel.prototype.addPageAction = function (actionName, pageUrl) {
                    for (var i = this.items.length - 1; i >= 0; i--) {
                        if (this.items[i].url == pageUrl) {
                            this.items[i].pageActions.push(actionName);
                            return;
                        }
                    }
                };
                return LastActionsModel;
            })();
            LastActions.LastActionsModel = LastActionsModel;
        })(LastActions = Platform.LastActions || (Platform.LastActions = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=LastActionsModel.js.map