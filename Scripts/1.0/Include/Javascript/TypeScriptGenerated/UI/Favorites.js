/// <reference path="../utilities/util.ts" />
/// <reference path="../ExternalTS/knockout.d.ts" /> 
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Favorites;
        (function (Favorites) {
            var FavoritesDataModel = (function () {
                function FavoritesDataModel() {
                    var _this = this;
                    this.isLoaded = false;
                    this.showMenueAfterLoad = true;
                    this.fvoriteItems = ko.observableArray();
                    this.MapToDataModel = function (input) {
                        if (input == null || input == '' || input == 'undefined')
                            return;
                        var data = JSON.parse(input);
                        _this.fvoriteItems.removeAll();
                        for (var i = 0; i < data.length; i++) {
                            var item = new Object();
                            for (var property in data[i]) {
                                //handle the null value from serverside.                
                                var value = (data[i][property] == null || data[i][property] == 'undefined') ? "" : data[i][property];
                                // Set the regular properties.
                                item[property] = value;
                            }
                            _this.fvoriteItems.push(item);
                        }
                    };
                    this.DataBind = function (koRoot, websiteUrl) {
                        try {
                            _this.websiteUrl = websiteUrl;
                            _this.userId = REISys.Platform.CurrentUserId;
                            ko.applyBindings(_this, koRoot);
                        }
                        catch (e) {
                            PlatformConsole.log(e);
                        }
                    };
                    this.LoadFavorites = function () {
                        //Lock in js, to prvent multiple ajax calls at a time.
                        if (_this.isLoaded === true)
                            return;
                        _this.isLoaded = true;
                        var url = _this.websiteUrl + '/Platform/Interface/Services/FavoritesService.aspx/LoadFavorites';
                        var params = '{ "userId":"' + _this.userId + '" }';
                        ReiSys.Utilities.Util.PostJsonToServiceAsync(url, params, function (data) {
                            _this.MapToDataModel(data.d);
                            //Convigure Flyout menue jquery plugin.
                            $('#favoritesRoot > .reiflyovermenu-favorites').each(function (menuElement) {
                                var id = $(this).parent().attr('id');
                                $(this).fgmenu({ content: $(this).next().html(), flyOut: true, id: $(this).parent().attr('id') });
                            });
                            var menu = allUIMenus.find('favoritesRoot');
                            if (menu != null && menu != 'undefined' && _this.showMenueAfterLoad)
                                menu.showMenu();
                        }, function (xhr, status, error) {
                            _this.isLoaded = false;
                            PlatformConsole.log(xhr.responseText);
                        });
                    };
                }
                return FavoritesDataModel;
            })();
            Favorites.FavoritesDataModel = FavoritesDataModel;
            var AddRemoveFavoritesModel = (function () {
                function AddRemoveFavoritesModel() {
                }
                AddRemoveFavoritesModel.OnAddRemoveClick = function () {
                    if (!AddRemoveFavoritesModel.Enable())
                        return;
                    AddRemoveFavoritesModel.CallService(AddRemoveFavoritesModel.Action());
                };
                AddRemoveFavoritesModel.CallService = function (apiMethod) {
                    var url = AddRemoveFavoritesModel.WebSiteUrl + "/api/Platform/Favorites/" + apiMethod;
                    var params = JSON.stringify({ Id: AddRemoveFavoritesModel.FavoriteId, Status: "", Text: AddRemoveFavoritesModel.LayoutDisplayText, BigText: "", AdditionalParams: AddRemoveFavoritesModel.AdditionalParameters });
                    ReiSys.Utilities.Util.PostJsonToServiceAsync(url, params, function (data) {
                        AddRemoveFavoritesModel.Text(data.Text);
                        AddRemoveFavoritesModel.BigText(data.BigText);
                        if (data.Action == 0)
                            AddRemoveFavoritesModel.Enable(false);
                        AddRemoveFavoritesModel.Action(data.Action);
                        if (apiMethod != "IsFavorite" && myFavModel != null && myFavModel.isLoaded === true) {
                            myFavModel.isLoaded = myFavModel.showMenueAfterLoad = false;
                            myFavModel.LoadFavorites();
                        }
                    }, function (xhr, status, error) { });
                };
                AddRemoveFavoritesModel.Enable = ko.observable(true);
                AddRemoveFavoritesModel.Action = ko.observable("");
                AddRemoveFavoritesModel.Text = ko.observable('');
                AddRemoveFavoritesModel.BigText = ko.observable('');
                AddRemoveFavoritesModel.CssClass = ko.computed(function () {
                    if (!AddRemoveFavoritesModel.Enable())
                        return "toolsicon f_nofav";
                    return AddRemoveFavoritesModel.Action() == "AddToFavorites" ? "toolsicon f_addfav" : "toolsicon f_removefav";
                });
                AddRemoveFavoritesModel.Init = function (root, webRootUrl, favoriteOptionsId, additionalParams, favText) {
                    AddRemoveFavoritesModel.WebSiteUrl = webRootUrl;
                    AddRemoveFavoritesModel.FavoriteId = favoriteOptionsId;
                    AddRemoveFavoritesModel.AdditionalParameters = additionalParams;
                    AddRemoveFavoritesModel.LayoutDisplayText = favText;
                    ko.applyBindings(AddRemoveFavoritesModel, root);
                    if (favoriteOptionsId == '')
                        AddRemoveFavoritesModel.Enable(false);
                    AddRemoveFavoritesModel.CallService("IsFavorite");
                };
                return AddRemoveFavoritesModel;
            })();
            Favorites.AddRemoveFavoritesModel = AddRemoveFavoritesModel;
        })(Favorites = Platform.Favorites || (Platform.Favorites = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=Favorites.js.map