/// <reference path="../externalts/knockout.d.ts" />
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
                var HideableControlModel = (function () {
                    function HideableControlModel(visible) {
                        this.Visible = visible;
                    }
                    return HideableControlModel;
                }());
                Models.HideableControlModel = HideableControlModel;
                var DisableableControlModel = (function (_super) {
                    __extends(DisableableControlModel, _super);
                    function DisableableControlModel(enable) {
                        _super.call(this, false);
                        this.Enabled = enable || false;
                    }
                    return DisableableControlModel;
                }(HideableControlModel));
                Models.DisableableControlModel = DisableableControlModel;
                var BaseNavigationItemModel = (function (_super) {
                    __extends(BaseNavigationItemModel, _super);
                    function BaseNavigationItemModel() {
                        _super.call(this, false);
                        this.Id = "";
                        this.MarkupId = "";
                        this.Text = "";
                        this.Destination = "";
                        this.AccessKey = "";
                        this.ToolTip = "";
                        this.Class = "";
                        this.Target = "";
                    }
                    return BaseNavigationItemModel;
                }(DisableableControlModel));
                Models.BaseNavigationItemModel = BaseNavigationItemModel;
                var NavigationItemModel = (function (_super) {
                    __extends(NavigationItemModel, _super);
                    function NavigationItemModel() {
                        _super.call(this);
                        this.PrivilegeId = 0;
                        this.ResourceId = "";
                        this.ImageAltText = "";
                        this.ImageToolTip = "";
                        this.PopUp = false;
                        this.IsExpanded = "";
                        this.ChildNavigationItems = new Array();
                    }
                    return NavigationItemModel;
                }(BaseNavigationItemModel));
                Models.NavigationItemModel = NavigationItemModel;
                var SelectableNavigationControlModel = (function (_super) {
                    __extends(SelectableNavigationControlModel, _super);
                    function SelectableNavigationControlModel() {
                        _super.call(this, false);
                        this.CurrentMarkupId = "";
                        this.RootMarkupId = "";
                        this.Exception = "";
                        this.Roles = new Array();
                        this.Items = new Array();
                    }
                    return SelectableNavigationControlModel;
                }(HideableControlModel));
                Models.SelectableNavigationControlModel = SelectableNavigationControlModel;
            })(Models = Layout.Models || (Layout.Models = {}));
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
/// Observable version of models 
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var ObservableModels;
            (function (ObservableModels) {
                var HideableControlModelObservable = (function () {
                    function HideableControlModelObservable(model) {
                        var visible = false;
                        if (model) {
                            visible = model.Visible;
                        }
                        this.Visible = ko.observable(visible);
                    }
                    return HideableControlModelObservable;
                }());
                ObservableModels.HideableControlModelObservable = HideableControlModelObservable;
                var DisableableControlModelObservable = (function (_super) {
                    __extends(DisableableControlModelObservable, _super);
                    function DisableableControlModelObservable(model) {
                        _super.call(this, model);
                        var enable = true;
                        if (model)
                            enable = model.Enabled;
                        this.Enabled = ko.observable(enable);
                    }
                    return DisableableControlModelObservable;
                }(HideableControlModelObservable));
                ObservableModels.DisableableControlModelObservable = DisableableControlModelObservable;
                var BaseNavigationItemModelObservable = (function (_super) {
                    __extends(BaseNavigationItemModelObservable, _super);
                    function BaseNavigationItemModelObservable(model) {
                        _super.call(this, model);
                        var id = '', markupid = '', text = '', destination = '', accesskey = '', tooltip = '', cssClass = '', target = '';
                        if (model) {
                            id = model.Id;
                            markupid = model.MarkupId;
                            text = model.Text;
                            destination = model.Destination;
                            accesskey = model.AccessKey;
                            tooltip = model.ToolTip;
                            cssClass = model.Class;
                        }
                        this.Id = ko.observable(id);
                        this.MarkupId = ko.observable(markupid);
                        this.Text = ko.observable(text);
                        this.Destination = ko.observable(destination);
                        this.AccessKey = ko.observable(accesskey);
                        this.ToolTip = ko.observable(tooltip);
                        this.Class = ko.observable(cssClass);
                        this.Target = ko.observable(target);
                    }
                    return BaseNavigationItemModelObservable;
                }(DisableableControlModelObservable));
                ObservableModels.BaseNavigationItemModelObservable = BaseNavigationItemModelObservable;
                var NavigationItemModelObservable = (function (_super) {
                    __extends(NavigationItemModelObservable, _super);
                    function NavigationItemModelObservable(model) {
                        var _this = this;
                        _super.call(this, model);
                        this.Model = model;
                        this.Clickable = ko.observable(true);
                        this.ShowIcon = ko.observable(false);
                        this.IconBaseUrl = ReiSys.Utilities.Util.BaseUrl + "Platform/Include/Skins/" + ReiSys.Utilities.Util.ImagePath + "/Images/sidemenu.png";
                        this.IconUrl = ko.computed({
                            owner: this,
                            read: function () {
                                return _this.ShowIcon() ? _this.IconBaseUrl : "";
                            },
                            write: function (val) {
                                _this.IconBaseUrl = val;
                            }
                        });
                        this.Separator = ko.computed({
                            owner: this, read: function () {
                                return REISys.Platform.Layout.BreadCrumb.Separator;
                            }
                        });
                        this.FinalToolTip = ko.computed({
                            owner: this,
                            read: function () {
                                return _this.ToolTip && _this.ToolTip() == "" ? _this.Text() : _this.ToolTip();
                            }
                        });
                        var privilegeId = 0, resourceId = '', imageAltText = '', imageToolTip = '', popUp = true, isExpanded = '';
                        if (model) {
                            this.ChildNavigationItems = ko.observableArray();
                            if (model.ChildNavigationItems) {
                                for (var i = 0; i < model.ChildNavigationItems.length; i++) {
                                    var obj = new NavigationItemModelObservable(model[i]);
                                    obj.bid = Math.random();
                                    this.ChildNavigationItems.push(obj);
                                }
                            }
                            privilegeId = model.PrivilegeId;
                            resourceId = model.ResourceId;
                            imageAltText = model.ImageAltText;
                            imageToolTip = model.ImageToolTip;
                            popUp = model.PopUp;
                            isExpanded = model.IsExpanded;
                        }
                        this.PrivilegeId = ko.observable(privilegeId);
                        this.ResourceId = ko.observable(resourceId);
                        this.ImageAltText = ko.observable(imageAltText);
                        this.ImageToolTip = ko.observable(imageToolTip);
                        this.PopUp = ko.observable(popUp);
                        this.IsExpanded = ko.observable(isExpanded);
                        this.bid = Math.random();
                    }
                    return NavigationItemModelObservable;
                }(BaseNavigationItemModelObservable));
                ObservableModels.NavigationItemModelObservable = NavigationItemModelObservable;
                var SelectableNavigationControlModelObservable = (function (_super) {
                    __extends(SelectableNavigationControlModelObservable, _super);
                    function SelectableNavigationControlModelObservable(model) {
                        _super.call(this, model);
                        this.Items = ko.observableArray();
                        this.CurrentMarkupId = ko.observable();
                        this.RootMarkupId = ko.observable();
                        this.Exception = ko.observable();
                        if (model) {
                            this.CurrentMarkupId(model.CurrentMarkupId);
                            this.RootMarkupId(model.RootMarkupId);
                            for (var i = 0; i < model.Items.length; i++) {
                                var item = new NavigationItemModelObservable(model.Items[i]);
                                this.Items.push(item);
                            }
                            this.Exception(model.Exception);
                        }
                    }
                    return SelectableNavigationControlModelObservable;
                }(HideableControlModelObservable));
                ObservableModels.SelectableNavigationControlModelObservable = SelectableNavigationControlModelObservable;
            })(ObservableModels = Layout.ObservableModels || (Layout.ObservableModels = {}));
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var BreadCrumb;
            (function (BreadCrumb) {
                var Models;
                (function (Models) {
                    var BreadCrumbNavigationItemModel = (function (_super) {
                        __extends(BreadCrumbNavigationItemModel, _super);
                        function BreadCrumbNavigationItemModel() {
                            _super.apply(this, arguments);
                        }
                        return BreadCrumbNavigationItemModel;
                    }(REISys.Platform.Layout.Models.NavigationItemModel));
                    Models.BreadCrumbNavigationItemModel = BreadCrumbNavigationItemModel;
                    var BreadCrumbModel = (function (_super) {
                        __extends(BreadCrumbModel, _super);
                        function BreadCrumbModel() {
                            _super.apply(this, arguments);
                        }
                        return BreadCrumbModel;
                    }(REISys.Platform.Layout.Models.SelectableNavigationControlModel));
                    Models.BreadCrumbModel = BreadCrumbModel;
                    var BreadcrumbSelectableNavigationControlModel = (function (_super) {
                        __extends(BreadcrumbSelectableNavigationControlModel, _super);
                        function BreadcrumbSelectableNavigationControlModel() {
                            _super.apply(this, arguments);
                        }
                        return BreadcrumbSelectableNavigationControlModel;
                    }(REISys.Platform.Layout.Models.SelectableNavigationControlModel));
                    Models.BreadcrumbSelectableNavigationControlModel = BreadcrumbSelectableNavigationControlModel;
                })(Models = BreadCrumb.Models || (BreadCrumb.Models = {}));
            })(BreadCrumb = Layout.BreadCrumb || (Layout.BreadCrumb = {}));
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var BreadCrumb;
            (function (BreadCrumb) {
                var ObservableModels;
                (function (ObservableModels) {
                    var BreadcrumbSelectableNavigationControlModelObservable = (function (_super) {
                        __extends(BreadcrumbSelectableNavigationControlModelObservable, _super);
                        function BreadcrumbSelectableNavigationControlModelObservable(model) {
                            _super.call(this, model);
                            this.dataModel = model;
                            if (model) {
                                this.LeftNavigationDimensionItem = new REISys.Platform.Layout.ObservableModels.NavigationItemModelObservable(model.LeftNavigationDimensionItem);
                                this.ParentPage = new REISys.Platform.Layout.ObservableModels.NavigationItemModelObservable(model.ParentPage);
                                for (var i = 0; i < this.Items().length; i++) {
                                    var item = this.Items()[i];
                                    var isLeftNavigationItem = JSON.stringify(item.Model) == JSON.stringify(model.LeftNavigationDimensionItem);
                                    var clickable = !isLeftNavigationItem;
                                    item.ShowIcon(isLeftNavigationItem);
                                    clickable = (item.Text() == "Browse" || (!item.Enabled() && REISys.Platform.Layout.BreadCrumb.AllowDisable)) ? false : clickable;
                                    item.Clickable(clickable);
                                }
                            }
                        }
                        return BreadcrumbSelectableNavigationControlModelObservable;
                    }(REISys.Platform.Layout.ObservableModels.SelectableNavigationControlModelObservable));
                    ObservableModels.BreadcrumbSelectableNavigationControlModelObservable = BreadcrumbSelectableNavigationControlModelObservable;
                })(ObservableModels = BreadCrumb.ObservableModels || (BreadCrumb.ObservableModels = {}));
            })(BreadCrumb = Layout.BreadCrumb || (Layout.BreadCrumb = {}));
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
//APIs exposed via REISys.Platform.Layout.BreadCrumb
//module containing direct Methods and model
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var BreadCrumb;
            (function (BreadCrumb) {
                BreadCrumb.Model = new REISys.Platform.Layout.BreadCrumb.ObservableModels.BreadcrumbSelectableNavigationControlModelObservable(new REISys.Platform.Layout.BreadCrumb.Models.BreadcrumbSelectableNavigationControlModel());
                BreadCrumb.AllowDisable = false;
                BreadCrumb.Separator = " » ";
                function CreateNavigationItemModelObservable(text, url) {
                    if (!text || text == '')
                        return null;
                    var item = new REISys.Platform.Layout.Models.NavigationItemModel();
                    item.Text = text;
                    item.Destination = url;
                    item.Visible = true;
                    item.Enabled = true;
                    item.ToolTip = text;
                    item.bid = Math.random();
                    var oItem = new REISys.Platform.Layout.ObservableModels.NavigationItemModelObservable(item);
                    return oItem;
                }
                /// Add a BreadCrumb with parameters 
                /// text : text to be displayed
                /// url : url for the breadcrumb link
                /// additional properties can be set with the object returned from this method
                function addBreadCrumb(text, url) {
                    var oItem = CreateNavigationItemModelObservable(text, url);
                    if (oItem != null)
                        BreadCrumb.Model.Items.push(oItem);
                    return oItem;
                }
                BreadCrumb.addBreadCrumb = addBreadCrumb;
                /// Add a BreadCrumb at a particular index 
                /// index : location at which the breadcrumb is to be added
                /// text : text to be displayed
                /// url : url for the breadcrumb link
                function addBreadCrumbAt(index, text, url) {
                    var oItem = CreateNavigationItemModelObservable(text, url);
                    if (oItem != null) {
                        if (BreadCrumb.Model.Items().length > index) {
                            BreadCrumb.Model.Items.splice(index, 0, oItem);
                            return oItem;
                        }
                    }
                    return null;
                }
                BreadCrumb.addBreadCrumbAt = addBreadCrumbAt;
                /// Removes the last breadcrumb 
                function removeLastItem() {
                    if (BreadCrumb.Model.Items().length > 0)
                        BreadCrumb.Model.Items.splice(BreadCrumb.Model.Items().length - 1, 1);
                }
                BreadCrumb.removeLastItem = removeLastItem;
                /// Counts the breadcrumb for ease
                function count() {
                    return BreadCrumb.Model.Items().length;
                }
                BreadCrumb.count = count;
                /// Gets breadcrumb at given index 
                function getBreadCrumbAt(index) {
                    var count = count();
                    if (count > 0 && count > index && index >= 0)
                        return BreadCrumb.Model.Items()[index];
                    return null;
                }
                BreadCrumb.getBreadCrumbAt = getBreadCrumbAt;
                var TextComparer = (function () {
                    function TextComparer() {
                    }
                    TextComparer.prototype.Compare = function (text, item) {
                        return item && text === item.Text();
                    };
                    return TextComparer;
                }());
                var IdComparer = (function () {
                    function IdComparer() {
                    }
                    IdComparer.prototype.Compare = function (text, item) {
                        return item && text === item.Id();
                    };
                    return IdComparer;
                }());
                function findBreadCrumb(item, comparer) {
                    var items = BreadCrumb.Model.Items();
                    for (var i = 0; i < items.length; i++)
                        if (comparer && comparer.Compare && typeof comparer.Compare === 'function') {
                            if (comparer.Compare(item, BreadCrumb.Model.Items()[i])) {
                                return BreadCrumb.Model.Items()[i];
                            }
                        }
                    return null;
                }
                /// Finds breadcrumb by Id, if it has one and returns its index
                function findBreadCrumbById(id) {
                    if (id && id != '')
                        return findBreadCrumb(id, new IdComparer());
                    return null;
                }
                BreadCrumb.findBreadCrumbById = findBreadCrumbById;
                /// Find breadcrumb by text 
                /// using a a custom comparer
                function findBreadCrumbItemByText(text) {
                    return findBreadCrumb(text, new TextComparer());
                }
                BreadCrumb.findBreadCrumbItemByText = findBreadCrumbItemByText;
                /// for future enhancement 
                function onnLoad(func) {
                    this.Events = this.Events || [];
                    if (func && typeof func === "function")
                        this.Events.push(func);
                    else
                        return this.Events;
                }
                /// Remove a breadcrumb 
                function removeBreadCrumbByText(text) {
                    var items = BreadCrumb.Model.Items();
                    var toRemove = BreadCrumb.findBreadCrumbItemByText(text);
                    if (toRemove)
                        for (var i = 0; i < items.length; i++) {
                            if (items[i] && items[i].bid === toRemove.bid) {
                                BreadCrumb.Model.Items.splice(i, 1);
                                break;
                            }
                        }
                }
                BreadCrumb.removeBreadCrumbByText = removeBreadCrumbByText;
                /// Remove a breadcrumb 
                function removeBreadCrumb(item) {
                    var items = BreadCrumb.Model.Items();
                    if (item) {
                        for (var i = 0; i < items.length; i++) {
                            if (items[i] && items[i].bid === item.bid) {
                                BreadCrumb.Model.Items.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
                BreadCrumb.removeBreadCrumb = removeBreadCrumb;
                function toggleBreadCrumbs(start, end) {
                    var items = REISys.Platform.Layout.BreadCrumb.Model.Items();
                    if (items.length > 5) {
                        for (var i = start; i < items.length - end; i++) {
                            items[i].Visible(!items[i].Visible());
                        }
                    }
                }
                function collapseBreadCrumbs(start, end) {
                    toggleBreadCrumbs(start || 1, end || 2);
                }
                BreadCrumb.collapseBreadCrumbs = collapseBreadCrumbs;
                function expandBreadCrumbs(start, end) {
                    toggleBreadCrumbs(start || 1, end || 2);
                }
                BreadCrumb.expandBreadCrumbs = expandBreadCrumbs;
            })(BreadCrumb = Layout.BreadCrumb || (Layout.BreadCrumb = {}));
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
