/// <reference path="../utilities/util.ts" />
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var RecentlyAccessed;
        (function (RecentlyAccessed) {
            var RecentlyAccessedDataModel = (function () {
                function RecentlyAccessedDataModel() {
                    var _this = this;
                    this.isLoaded = false;
                    this.localConsole = new ReiSys.Utilities.PlatformConsole();
                    this.modelItems = ko.observableArray();
                    this.MapToDataModel = function (input) {
                        if (input == null || input == '' || input == 'undefined')
                            return;
                        var data = JSON.parse(input);
                        for (var i = 0; i < data.length; i++) {
                            var item = new Object();
                            for (var property in data[i]) {
                                //handle the null value from serverside.                
                                var value = (data[i][property] == null || data[i][property] == 'undefined') ? "" : data[i][property];
                                // Set the regular properties.
                                item[property] = value;
                            }
                            _this.modelItems.push(item);
                        }
                    };
                    this.DataBind = function (koRoot, websiteUrl) {
                        try {
                            _this.websiteUrl = websiteUrl;
                            _this.userId = REISys.Platform.CurrentUserId;
                            ko.applyBindings(_this, koRoot);
                        }
                        catch (e) {
                            _this.localConsole.log(e);
                        }
                    };
                    this.LoadData = function () {
                        //Lock in js, to prvent multiple ajax calls at a time.
                        if (_this.isLoaded === true)
                            return;
                        _this.isLoaded = true;
                        var url = _this.websiteUrl + '/Platform/Interface/Services/RecentlyAccessedService.aspx/LoadRecentlyAccessed';
                        var params = '{ "userId":"' + _this.userId + '" }';
                        ReiSys.Utilities.Util.PostJsonToServiceAsync(url, params, function (data) {
                            _this.MapToDataModel(data.d);
                            //Convigure Flyout menue jquery plugin.
                            $('#recentlyAccessedRoot > .reiflyovermenu-recentlyAccessed').each(function (menuElement) {
                                var id = $(this).parent().attr('id');
                                $(this).fgmenu({ content: $(this).next().html(), flyOut: true, id: $(this).parent().attr('id') });
                                var menu = allUIMenus.find(id);
                                if (menu != null && menu != 'undefined')
                                    menu.showMenu();
                            });
                        }, function (xhr, status, error) {
                            _this.isLoaded = false;
                            _this.localConsole.log(xhr.responseText);
                        });
                    };
                }
                return RecentlyAccessedDataModel;
            }());
            RecentlyAccessed.RecentlyAccessedDataModel = RecentlyAccessedDataModel;
        })(RecentlyAccessed = Platform.RecentlyAccessed || (Platform.RecentlyAccessed = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
