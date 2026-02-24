var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var Models;
            (function (Models) {
                var ResourceNavigationItemModel = (function (_super) {
                    __extends(ResourceNavigationItemModel, _super);
                    function ResourceNavigationItemModel() {
                        _super.call(this);
                        this.IsPopUp = false;
                        this.Height = 600;
                        this.Width = 980;
                        this.PopUpTitle = "";
                    }
                    return ResourceNavigationItemModel;
                }(Models.NavigationItemModel));
                Models.ResourceNavigationItemModel = ResourceNavigationItemModel;
            })(Models = Layout.Models || (Layout.Models = {}));
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var ResourcesTabs = (function () {
            function ResourcesTabs(id) {
                this.Id = id;
                this.IsAllLinksinExtwindow = true;
                this.ImageRoot = "";
            }
            ResourcesTabs.prototype.FixData = function (data) {
                if (data != null && data instanceof Array) {
                    for (var i = 0; i < data.length; i++) {
                        var navigationItem = data[i];
                        if (navigationItem.IsPopUp && navigationItem.Destination && !navigationItem.Destination.startsWith("javascript")) {
                            if (data[i].Destination != null) {
                                var url = "javascript:OpenPopupWithMenuBar('" + (navigationItem.Destination) + "', " +
                                    navigationItem.Height + ", " + navigationItem.Width + ", ' " +
                                    navigationItem.PopUpTitle + "')";
                                navigationItem.Destination = url;
                            }
                            else {
                                var urlSafe = "javascript:OpenPopupWithMenuBar('', " + navigationItem.Height + ", " + navigationItem.Width + ", ' " + navigationItem.PopUpTitle + "')";
                                navigationItem.Destination = urlSafe;
                            }
                        }
                        if (navigationItem.ChildNavigationItems != null && navigationItem.ChildNavigationItems.length > 0)
                            navigationItem.ChildNavigationItems = this.FixData(navigationItem.ChildNavigationItems);
                    }
                }
                return data;
            };
            ResourcesTabs.prototype.RenderTabs = function () {
                var tabStrip = $find(this.Id);
                tabStrip.get_tabs().clear();
                var resoruceSubTabs = $find(this.ResourceSubTabsId);
                var pageViews = resoruceSubTabs.get_pageViews();
                while (pageViews.get_count() > 0)
                    pageViews.removeAt(0);
                var data = this.ResourceDetails;
                if (data && data instanceof Array) {
                    data = this.FixData(data);
                    for (var i = 0; i < data.length; i++) {
                        this.CreateTabs(tabStrip, data[i]);
                    }
                    if (data.length > 0)
                        tabStrip.set_selectedIndex(0);
                    if (resoruceSubTabs.get_pageViews().get_count() > 0) {
                        resoruceSubTabs.set_selectedIndex(0);
                    }
                }
            };
            ResourcesTabs.prototype.CreateTabs = function (tabStrip, navigationItem) {
                var tab = new Telerik.Web.UI.RadTab();
                tab.set_text(navigationItem.Text);
                tabStrip.trackChanges();
                tabStrip.get_tabs().add(tab);
                var pageView = new Telerik.Web.UI.RadPageView();
                pageView.set_id(tabStrip.get_id() + '_' + navigationItem.Text.replaceAll(' ', ''));
                var resoruceSubTabs = $find(this.ResourceSubTabsId);
                resoruceSubTabs.get_pageViews().add(pageView);
                if (navigationItem.ChildNavigationItems && navigationItem.ChildNavigationItems instanceof Array) {
                    this.RenderPageView(pageView, tabStrip, navigationItem, navigationItem.ChildNavigationItems);
                }
                tabStrip.commitChanges();
            };
            ResourcesTabs.prototype.RenderPageView = function (pageView, tabStrip, navItem, childItem) {
                if (pageView == null)
                    return;
                var id = pageView.get_id();
                var container = $("#" + id);
                if (container) {
                    var htmlArr = [];
                    htmlArr.push("<div width=\"100%\">");
                    htmlArr.push("<div class=\"linksRT\"><ul class=\"linklist\">");
                    if (childItem && childItem instanceof Array) {
                        for (var i = 0; i < childItem.length; i++) {
                            htmlArr.push(this.CreateSubTab(childItem[i]));
                        }
                    }
                    htmlArr.push("</ul></div></div>");
                    container.html(htmlArr.join(''));
                }
            };
            ResourcesTabs.prototype.CreateSubTab = function (item) {
                var markup = "";
                var anchorMarkUp = "<li><a id=\"{0}\" href=\"{2}\" {4}> {1} {3}</a></li>";
                var strTarget = item.IsPopUp ? this.Format("class=\"popUpClass\" popUpheight=\"{0}\" popUpWidth=\"{1}\" popUpTitle=\"{2}\" ", item.Height, item.Width, item.PopUpTitle) : '';
                var strPopUpMarkUp = this.IsAllLinksinExtwindow && item.IsPopUp ? this.PopUpImage : "";
                strPopUpMarkUp = strPopUpMarkUp || '';
                if (item != null && item.Destination != null) {
                    markup = this.Format(anchorMarkUp, "", item.Text, item.Destination, strPopUpMarkUp, strTarget);
                }
                else {
                    markup = this.Format(anchorMarkUp, "", item.Text, "", strPopUpMarkUp, strTarget);
                }
                return markup;
            };
            ResourcesTabs.prototype.Format = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (args.length > 0) {
                    var result = args[0];
                    for (var i = 1; i < args.length; i++) {
                        var replacethis = '{' + (i - 1) + '}';
                        result = result.replace(replacethis, arguments[i]);
                    }
                    return result;
                }
                return "";
            };
            ResourcesTabs.prototype.BindData = function (data) {
                if (data && data instanceof Array) {
                    this.ResourceDetails = data;
                }
                this.RenderTabs();
            };
            return ResourcesTabs;
        }());
        Platform.ResourcesTabs = ResourcesTabs;
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var ResourcesFlyout = (function () {
            function ResourcesFlyout(id) {
                this.Id = id;
            }
            ResourcesFlyout.prototype.FixData = function (data) {
                if (data != null && data instanceof Array) {
                    for (var i = 0; i < data.length; i++) {
                        var navigationItem = data[i];
                        if (navigationItem.IsPopUp && navigationItem.Destination && !navigationItem.Destination.startsWith("javascript")) {
                            if (data[i].Destination != null) {
                                var url = "javascript:OpenPopupWithMenuBar('" + (navigationItem.Destination) + "', " +
                                    navigationItem.Height + ", " + navigationItem.Width + ", ' " +
                                    navigationItem.PopUpTitle + "')";
                                navigationItem.Destination = url;
                            }
                            else {
                                var urlSafe = "javascript:OpenPopupWithMenuBar('', " + navigationItem.Height + ", " + navigationItem.Width + ", ' " + navigationItem.PopUpTitle + "')";
                                navigationItem.Destination = urlSafe;
                            }
                            var strPopUpImage = " <img alt=\"View in external page\" class=\"extLink\" src=\"" + this.ImageRoot + "/extlink.png\">";
                            navigationItem.Text = navigationItem.Text + strPopUpImage;
                        }
                        if (navigationItem.ChildNavigationItems != null && navigationItem.ChildNavigationItems.length > 0)
                            navigationItem.ChildNavigationItems = this.FixData(navigationItem.ChildNavigationItems);
                    }
                }
                return data;
            };
            ResourcesFlyout.prototype.RenderMenu = function (data) {
                var el = document.getElementById(this.Id);
                if (!el)
                    return;
                data = this.FixData(data);
                if (el)
                    ko.applyBindings({ flyoutResources: data }, el);
                if (data.length > 0) {
                    var menu = $(el).find(":first-child");
                    if (allUIMenus && allUIMenus instanceof Array) {
                        var me = allUIMenus.find(this.Id);
                        for (var i = 0; i < allUIMenus.length; i++) {
                            if (me == allUIMenus[i]) {
                                me.kill();
                                allUIMenus.splice(i, 1);
                            }
                        }
                    }
                    if (menu) {
                        menu.fgmenu({ content: menu.next().html(), flyOut: true, id: this.Id });
                    }
                }
            };
            ResourcesFlyout.prototype.BindData = function (data) {
                if (data && data instanceof Array) {
                    this.ResourceDetails = data;
                }
                this.RenderMenu(this.ResourceDetails);
            };
            return ResourcesFlyout;
        }());
        Platform.ResourcesFlyout = ResourcesFlyout;
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
