var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var Toolbar;
            (function (Toolbar) {
                var Arguments = (function () {
                    function Arguments() {
                    }
                    return Arguments;
                })();
                var MenuItem = (function () {
                    function MenuItem() {
                    }
                    return MenuItem;
                })();
                var ResultSet = (function () {
                    function ResultSet() {
                    }
                    return ResultSet;
                })();
                var ToolbarSearchViewModel = (function () {
                    function ToolbarSearchViewModel() {
                    }
                    ToolbarSearchViewModel.IsDataLoaded = ko.observable(false);
                    ToolbarSearchViewModel.SelectedItem = ko.observable();
                    ToolbarSearchViewModel.DataItems = ko.observableArray();
                    ToolbarSearchViewModel.Init = function (root, toolbarSearchType) {
                        ToolbarSearchViewModel.ToolbarSearchType = toolbarSearchType;
                        ko.applyBindings(ToolbarSearchViewModel, root);
                    };
                    ToolbarSearchViewModel.OnSearchClick = function () {
                        if (ToolbarSearchViewModel.ToolbarSearchType == "CaseBasedView") {
                            OpenPopup(ToolbarSearchViewModel.SelectedItem().Url, 400, 600);
                            return false;
                        }
                        else {
                        }
                    };
                    ToolbarSearchViewModel.LoadData = function () {
                        if (ToolbarSearchViewModel.IsDataLoaded() === true)
                            return;
                        var params = { UserId: ReiSys.Platform.sCurrentUserId, ToolbarSearchType: "" };
                        var url;
                        if (ToolbarSearchViewModel.ToolbarSearchType == "CaseBasedView") {
                            url = REISys.Platform.WebRoot + "/api/Platform/Services/Toolbar/GetFolders";
                        }
                        else if (ToolbarSearchViewModel.ToolbarSearchType == "FolderBasedView") {
                        }
                        ReiSys.Platform.Utilities.WebServiceUtils.SendXmlHttpRequest(url, ToolbarSearchViewModel.OnDataLoadSuccess, params);
                    };
                    ToolbarSearchViewModel.OnDataLoadSuccess = function (data) {
                        PlatformConsole.log(data);
                        ToolbarSearchViewModel.DataItems(ReiSys.Platform.Utilities.Mapping.mapToKnockout(data, MenuItem));
                        ToolbarSearchViewModel.IsDataLoaded(true);
                    };
                    return ToolbarSearchViewModel;
                })();
                Toolbar.ToolbarSearchViewModel = ToolbarSearchViewModel;
                var HelpLinkViewModel = (function () {
                    function HelpLinkViewModel() {
                    }
                    HelpLinkViewModel.IsDataLoaded = ko.observable(false);
                    HelpLinkViewModel.ShowMenuAfterDataLoad = ko.observable(true);
                    HelpLinkViewModel.IsHelpDefinded = ko.observable(false);
                    HelpLinkViewModel.Icon = ko.observable("ui-icon ui-icon-nohelp");
                    HelpLinkViewModel.DataItems = ko.observableArray();
                    HelpLinkViewModel.CreateNewHelpPage = ko.observable("");
                    HelpLinkViewModel.ManageAssociation = ko.observable("");
                    HelpLinkViewModel.ShowManageHelp = ko.computed(function () {
                        for (var i = 0; i < HelpLinkViewModel.DataItems().length; i++) {
                            if (HelpLinkViewModel.DataItems()[i].LinkType === 3 || HelpLinkViewModel.DataItems()[i].LinkType === 9)
                                return true;
                        }
                        return false;
                    });
                    HelpLinkViewModel.Init = function (root, toolbarSearchType) {
                        HelpLinkViewModel.Args = toolbarSearchType;
                        ko.applyBindings(HelpLinkViewModel, root);
                        HelpLinkViewModel.IsHelpAssociated();
                    };
                    HelpLinkViewModel.IsHelpAssociated = function (forceDataLoad) {
                        var url = REISys.Platform.WebRoot + "/api/Platform/Services/Toolbar/IsHelpAssociated";
                        ReiSys.Platform.Utilities.WebServiceUtils.SendXmlHttpRequest(url, function (data) {
                            if (data && data.Status && data.Status == true) {
                                HelpLinkViewModel.IsHelpDefinded(true);
                                HelpLinkViewModel.Icon("ui-icon ui-icon-help1");
                            }
                            else {
                                HelpLinkViewModel.IsHelpDefinded(false);
                                HelpLinkViewModel.Icon("ui-icon ui-icon-nohelp");
                            }
                        }, HelpLinkViewModel.Args);
                        if (forceDataLoad === true) {
                            HelpLinkViewModel.IsDataLoaded(false);
                            HelpLinkViewModel.ShowMenuAfterDataLoad(false);
                            HelpLinkViewModel.LoadData();
                        }
                    };
                    HelpLinkViewModel.LoadData = function () {
                        if (HelpLinkViewModel.IsDataLoaded() === false) {
                            var url = REISys.Platform.WebRoot + "/api/Platform/Services/Toolbar/GetHelpLinks";
                            ReiSys.Platform.Utilities.WebServiceUtils.SendXmlHttpRequest(url, HelpLinkViewModel.OnDataLoadSuccess, HelpLinkViewModel.Args);
                        }
                    };
                    HelpLinkViewModel.OnDataLoadSuccess = function (data) {
                        PlatformConsole.log(data);
                        HelpLinkViewModel.CreateNewHelpPage(data.CreateNewHelpPage);
                        HelpLinkViewModel.ManageAssociation(data.ManageAssociation);
                        HelpLinkViewModel.DataItems(ReiSys.Platform.Utilities.Mapping.mapToKnockout(data.Data, MenuItem));
                        HelpLinkViewModel.BindMenue();
                        HelpLinkViewModel.IsDataLoaded(true);
                    };
                    HelpLinkViewModel.BindMenue = function () {
                        $('#toolbarHelpLink > .reiflyovermenu-helplinks').each(function (menuElement) {
                            $(this).fgmenu({ content: $(this).next().html(), flyOut: true, id: 'toolbarHelpLink' });
                            var menu = allUIMenus.find('toolbarHelpLink');
                            if (HelpLinkViewModel.ShowMenuAfterDataLoad() === true && menu != null && menu != 'undefined') {
                                menu.showMenu();
                            }
                        });
                    };
                    return HelpLinkViewModel;
                })();
                Toolbar.HelpLinkViewModel = HelpLinkViewModel;
            })(Toolbar = Layout.Toolbar || (Layout.Toolbar = {}));
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
