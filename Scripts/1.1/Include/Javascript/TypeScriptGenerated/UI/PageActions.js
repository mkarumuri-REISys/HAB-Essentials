/// <reference path="../utilities/Utilities.ts" />
/// <reference path="../externalts/knockout.d.ts" />
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            Layout.GoButtonId = "GoButton";
            (function (Align) {
                Align[Align["Right"] = 0] = "Right";
                Align[Align["Left"] = 1] = "Left";
            })(Layout.Align || (Layout.Align = {}));
            var Align = Layout.Align;
            (function (LayoutType) {
                LayoutType[LayoutType["Button"] = 0] = "Button";
                LayoutType[LayoutType["Dropdown"] = 1] = "Dropdown";
            })(Layout.LayoutType || (Layout.LayoutType = {}));
            var LayoutType = Layout.LayoutType;
            (function (DisplayActionType) {
                DisplayActionType[DisplayActionType["Toolbar"] = 0] = "Toolbar";
                DisplayActionType[DisplayActionType["PageActionMenu"] = 1] = "PageActionMenu";
            })(Layout.DisplayActionType || (Layout.DisplayActionType = {}));
            var DisplayActionType = Layout.DisplayActionType;
            (function (LayoutSections) {
                LayoutSections[LayoutSections["All"] = 0] = "All";
                LayoutSections[LayoutSections["Panel"] = 1] = "Panel";
                LayoutSections[LayoutSections["ToolBar"] = 2] = "ToolBar";
            })(Layout.LayoutSections || (Layout.LayoutSections = {}));
            var LayoutSections = Layout.LayoutSections;
            (function (ActionOptions) {
                ActionOptions[ActionOptions["DoPostBack"] = 0] = "DoPostBack";
                ActionOptions[ActionOptions["OpenPopUp"] = 1] = "OpenPopUp";
                ActionOptions[ActionOptions["Redirect"] = 2] = "Redirect";
                ActionOptions[ActionOptions["JavaScript"] = 3] = "JavaScript";
            })(Layout.ActionOptions || (Layout.ActionOptions = {}));
            var ActionOptions = Layout.ActionOptions;
            //copied from pageActionsPanel.ascx
            (function (PageActionMode) {
                PageActionMode[PageActionMode["StandardActionButton"] = 0] = "StandardActionButton";
                PageActionMode[PageActionMode["StandardActionDropdown"] = 1] = "StandardActionDropdown";
                PageActionMode[PageActionMode["Custom"] = 2] = "Custom";
            })(Layout.PageActionMode || (Layout.PageActionMode = {}));
            var PageActionMode = Layout.PageActionMode;
            var Option = (function () {
                function Option() {
                }
                return Option;
            })();
            Layout.Option = Option;
            var OptionsGroup = (function () {
                function OptionsGroup() {
                }
                return OptionsGroup;
            })();
            Layout.OptionsGroup = OptionsGroup;
            var PageActionItem = (function () {
                function PageActionItem() {
                    var _this = this;
                    this.Text = ko.observable();
                    this.Visible = ko.observable();
                    this.TabIndex = ko.observable();
                    this.Enabled = ko.observable();
                    this.ActionOption = ko.observable();
                    /*! Page ActionItem Properties*/
                    this.GroupName = ko.observable();
                    this.LayoutAlign = ko.observable();
                    this.LayoutType = ko.observable();
                    this.ValidationGroup = ko.observable();
                    this.DefaultFocus = ko.observable();
                    this.DefaultSubmitBehavior = ko.observable();
                    this.CausesValidation = ko.observable();
                    this.DisplayAction = ko.observable();
                    this.ApplicableSections = ko.observable();
                    this.EnableSubsequentEvents = ko.observable();
                    /*! Toolbar ActionItem Properties*/
                    this.CssClass = ko.observable();
                    //public ImageClass: KnockoutObservable<string> = ko.observable<string>();
                    /* New Properites */
                    this.IsSelected = ko.observable(false);
                    /* Common functions and events */
                    this.ButtonCssClass = ko.computed(function () {
                        if (!_this.Enabled())
                            return "hrsaSkinneddisbled";
                        if (_this.IsGoButton())
                            return "hrsaSkinnedgobtn";
                        return "hrsaSkinnedButton";
                    });
                    this.AnchorCssClass = ko.computed(function () {
                        return _this.Enabled() ? "fg-button ui-widget ui-actions ui-state-default" : "fg-button ui-widget ui-actionsdisable ui-state-default";
                    });
                    this.ImageClass = ko.computed(function () {
                        var className = "";
                        switch (_this.Id) {
                            case 'Save':
                                className = 'ui-icon ui-icon-save';
                                break;
                            case 'SaveandContinue':
                                className = 'ui-icon ui-icon-savecont';
                                break;
                            case 'Cancel':
                                className = 'ui-icon ui-icon-return';
                                break;
                            case 'MarkasComplete':
                                className = 'ui-icon ui-icon-mcomplete';
                                break;
                            case 'ReturntoList':
                                className = 'ui-icon ui-icon-return';
                                break;
                            case 'Edit':
                                className = 'ui-icon ui-icon-edit';
                                break;
                            case 'Close':
                                className = 'ui-icon ui-icon-closewindow';
                                break;
                            case 'Confirm':
                                className = 'ui-icon ui-icon-confirm';
                                break;
                            case 'Word':
                                className = 'ui-icon ui-icon-word';
                                break;
                            case 'Continue':
                                className = 'ui-icon ui-icon-continue';
                                break;
                            case 'PreviousPage':
                                className = 'ui-icon ui-icon-previous';
                                break;
                            case 'NextPage':
                                className = 'ui-icon ui-icon-nextpage';
                                break;
                            default:
                                className = 'ui-icon ui-icon-save';
                        }
                        return _this.Enabled() ? className : className + "disable";
                    });
                    this.IsLeftAligned = ko.computed(function () { return _this.Visible() && _this.LayoutAlign() === Align.Left; });
                    this.IsDropdownItem = ko.computed(function () { return _this.Visible() && _this.LayoutType() === LayoutType.Dropdown; });
                    this.IsButton = ko.computed(function () { return _this.Visible() && _this.LayoutType() === LayoutType.Button; });
                    this.IsGoButton = ko.computed(function () { return _this.IsButton() && _this.Id === Layout.GoButtonId; });
                    this.IsForToolbar = ko.computed(function () { return _this.Visible() && (_this.DisplayAction() === DisplayActionType.Toolbar && (_this.ApplicableSections() == LayoutSections.All || _this.ApplicableSections() == LayoutSections.ToolBar)); });
                    this.IsForPanel = ko.computed(function () {
                        return _this.IsButton() && (_this.DisplayAction() === DisplayActionType.PageActionMenu || _this.ApplicableSections() === LayoutSections.All || _this.ApplicableSections() === LayoutSections.Panel);
                    });
                    this.InputType = ko.computed(function () { return (_this.ActionOption() === ActionOptions.DoPostBack || _this.DefaultSubmitBehavior()) ? "submit" : "button"; });
                    this.HasGroupName = ko.computed(function () { return (_this.GroupName() != null && _this.GroupName() != ""); });
                    this.OnClick = function (eventArgs) {
                        if (!_this.Enabled())
                            return false;
                        if (_this.ActionOption() === ActionOptions.DoPostBack) {
                            if (eventArgs == null || eventArgs == "" || eventArgs == 'undefined')
                                eventArgs = "PageActionMenu";
                            _this.Enabled(false);
                            __doPostBack(_this.Id, eventArgs);
                            PlatformConsole.log("__doPostBack with id:" + _this.Id);
                        }
                        else if (_this.ActionOption() === ActionOptions.Redirect) {
                            document.location.href = _this.NavigateUrl;
                            PlatformConsole.log("Redirecting to:" + _this.NavigateUrl);
                        }
                        else if (_this.ActionOption() === ActionOptions.OpenPopUp) {
                            try {
                                OpenPopupWithMenuBar(_this.NavigateUrl, '600', '980', '');
                                PlatformConsole.log("OpenPopupWithMenuBar for url:" + _this.NavigateUrl);
                                return false;
                            }
                            catch (e) {
                                PlatformConsole.log("Unable to open popup window (" + _this.Id + "):" + e);
                            }
                        }
                        else if (_this.ActionOption() === ActionOptions.JavaScript) {
                            try {
                                if (_this.Id == "Close")
                                    _this.ClientSideScript += "  closeWindow(); return false;";
                                // Don't use Eval() to execute js, it does not support return statment in js string i.e. ShowOverlay();return false; (this will break js).
                                new Function('return ' + _this.ClientSideScript)();
                                PlatformConsole.log("Excuting ClientSideScript:" + _this.ClientSideScript);
                            }
                            catch (e) {
                                PlatformConsole.log("Error in actionItem(" + _this.Id + ") ClientSideScript property:" + e);
                            }
                        }
                        else {
                            PlatformConsole.log("ActionOption :" + _this.Id + ", is not supported.");
                        }
                    };
                }
                return PageActionItem;
            })();
            Layout.PageActionItem = PageActionItem;
            var PageActionsViewModel = (function () {
                /* Public Methods > API */
                function PageActionsViewModel() {
                    var _this = this;
                    /* Properties */
                    this.PageActionsDetails = ko.observableArray([]);
                    this.SelectedItem = ko.observable();
                    this.Mode = ko.observable();
                    this.Enabled = ko.observable();
                    this.DisplayType = ko.observable(DisplayActionType.PageActionMenu);
                    this.IsDataBinded = false;
                    /* Computed Properties*/
                    this.ItemGroups = ko.computed(function () {
                        var items = [];
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            var currentItem = _this.PageActionsDetails()[i];
                            if (currentItem.HasGroupName()
                                && !ReiSys.Utilities.Util.Contains(items, currentItem.GroupName())
                                && _this.GetItemCountByGroupNameLayoutType(currentItem.GroupName(), LayoutType.Dropdown) > 0)
                                items.push(currentItem.GroupName());
                        }
                        return items;
                    });
                    this.HasDropdownlistItems = ko.computed(function () {
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            if (_this.PageActionsDetails()[i].LayoutType() === LayoutType.Dropdown)
                                return true;
                        }
                        return false;
                    });
                    this.DropdownItemsWithoutGroups = ko.computed(function () {
                        var items = [];
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            var currentItem = _this.PageActionsDetails()[i];
                            if (currentItem.IsDropdownItem() && !currentItem.HasGroupName()) {
                                var opt = new Option();
                                opt.Value = currentItem.Id;
                                opt.Text = currentItem.Text();
                                items.push(opt);
                            }
                        }
                        return items;
                    });
                    this.DropdownItemsWithGroups = ko.computed(function () {
                        var items = [];
                        for (var i = 0; i < _this.ItemGroups().length; i++) {
                            var obj = new OptionsGroup();
                            obj.Label = _this.ItemGroups()[i];
                            obj.Children = _this.GetItemsByGroupName(_this.ItemGroups()[i], Align.Right);
                            items.push(obj);
                        }
                        return items;
                    });
                    // Toolbar Specific Code
                    this.ToolbarActionItems = ko.computed(function () {
                        var toolbarItems = [];
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            var currentItem = _this.PageActionsDetails()[i];
                            if (currentItem.Visible() === true && currentItem.DisplayAction() == DisplayActionType.Toolbar && (currentItem.ApplicableSections() == LayoutSections.All || currentItem.ApplicableSections() == LayoutSections.ToolBar))
                                toolbarItems.push(currentItem);
                        }
                        return toolbarItems;
                    });
                    this.ToolbarPageActionMenuItems = ko.computed(function () {
                        var toolbarItems = [];
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            var currentItem = _this.PageActionsDetails()[i];
                            if (currentItem.Visible() === true && currentItem.DisplayAction() === DisplayActionType.PageActionMenu && (currentItem.ApplicableSections() == LayoutSections.All || currentItem.ApplicableSections() == LayoutSections.ToolBar))
                                toolbarItems.push(currentItem);
                        }
                        return toolbarItems;
                    });
                    this.ToolbarItemGroups = ko.computed(function () {
                        var items = [];
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            var currentItem = _this.PageActionsDetails()[i];
                            if (currentItem.DisplayAction() == DisplayActionType.PageActionMenu && currentItem.HasGroupName()
                                && !ReiSys.Utilities.Util.Contains(items, currentItem.GroupName())
                                && _this.GetItemCountByGroupName(currentItem.GroupName()) > 0)
                                items.push(currentItem.GroupName());
                        }
                        return items;
                    });
                    this.AddItem = function (item) {
                        _this.PageActionsDetails.push(item);
                    };
                    this.EnableItem = function (buttonId) {
                        _this.ChangeItem(buttonId, true);
                    };
                    this.DisableItem = function (buttonId) {
                        _this.ChangeItem(buttonId, false, true);
                    };
                    this.ShowItem = function (buttonId) {
                        _this.ChangeItem(buttonId, false, false, true);
                    };
                    this.HideItem = function (buttonId) {
                        _this.ChangeItem(buttonId, false, false, false, true);
                    };
                    this.RemoveItem = function (buttonId) {
                        _this.ChangeItem(buttonId, false, false, false, false, true);
                    };
                    this.ChangeText = function (buttonId, newText) {
                        _this.ChangeItem(buttonId, false, false, false, false, false, false, newText);
                    };
                    this.OnButtonClick = function (button) {
                        var argument = (_this.DisplayType() == DisplayActionType.PageActionMenu ? "PageActionMenu" : "Toolbar");
                        //If its regular button other than GO; trigger click event.
                        if (!button.IsGoButton()) {
                            button.OnClick(argument);
                        }
                        else {
                            //If its not regular button than its Go button find the selected item in dropdown and trigger click.
                            _this.TriggerClick(_this.SelectedItem(), argument);
                        }
                        (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
                        return false;
                    };
                    this.TriggerClick = function (sender, eventArg) {
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            if (_this.PageActionsDetails()[i].Id == sender) {
                                _this.PageActionsDetails()[i].OnClick(eventArg);
                                break;
                            }
                        }
                    };
                    this.GetItemsByGroupName = function (groupName, align) {
                        var items = [];
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            if (_this.PageActionsDetails()[i].GroupName() === groupName && _this.PageActionsDetails()[i].LayoutAlign() === align) {
                                var option = new Option();
                                option.Value = _this.PageActionsDetails()[i].Id;
                                option.Text = _this.PageActionsDetails()[i].Text();
                                items.push(option);
                            }
                        }
                        return items;
                    };
                    this.DataBind = function (inputData, koRoot, enabled, mode, isToolbar) {
                        _this.PageActionsDetails(ReiSys.Platform.Utilities.Mapping.mapToKnockout(inputData, PageActionItem));
                        try {
                            ko.applyBindings(_this, koRoot);
                            _this.IsDataBinded = true;
                        }
                        catch (e) {
                            PlatformConsole.log("SetupBinding Faild:" + e);
                        }
                        if (isToolbar === true)
                            _this.DisplayType(DisplayActionType.Toolbar);
                        if (enabled === false)
                            _this.Enabled(false);
                        if (mode != null && mode != '' && mode != 'undefined')
                            _this.Mode(mode);
                    };
                    /*Private Methods*/
                    this.GetItemCountByGroupNameLayoutType = function (groupName, filter) {
                        var couunt = 0;
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            if (_this.PageActionsDetails()[i].GroupName() === groupName && _this.PageActionsDetails()[i].LayoutType() == filter)
                                couunt++;
                        }
                        return couunt;
                    };
                    this.GetItemCountByGroupName = function (groupName) {
                        var couunt = 0;
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            if (_this.PageActionsDetails()[i].GroupName() === groupName)
                                couunt++;
                        }
                        return couunt;
                    };
                    this.ChangeItem = function (buttonId, enable, disable, show, hide, remove, select, newText) {
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            if (_this.PageActionsDetails()[i].Id == buttonId) {
                                if (enable)
                                    _this.PageActionsDetails()[i].Enabled(true);
                                else if (disable)
                                    _this.PageActionsDetails()[i].Enabled(false);
                                else if (show)
                                    _this.PageActionsDetails()[i].Visible(true);
                                else if (hide)
                                    _this.PageActionsDetails()[i].Visible(false);
                                else if (remove)
                                    _this.PageActionsDetails.remove(_this.PageActionsDetails()[i]);
                                else if (select)
                                    _this.PageActionsDetails()[i].IsSelected(true);
                                else if (newText && newText != null && newText != 'undefined')
                                    _this.PageActionsDetails()[i].Text(newText);
                                break;
                            }
                        }
                    };
                    this.SelectedItem.subscribe(function (itemId) {
                        _this.ChangeItem(itemId, false, false, false, false, false, true);
                    });
                    this.Mode.subscribe(function (item) {
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            if (PageActionMode[item] == PageActionMode.StandardActionButton) {
                                if (_this.PageActionsDetails()[i].IsGoButton()) {
                                    _this.PageActionsDetails()[i].Visible(false);
                                }
                                else {
                                    _this.PageActionsDetails()[i].LayoutType(LayoutType.Button);
                                }
                            }
                            else if (PageActionMode[item] == PageActionMode.StandardActionDropdown) {
                                if (_this.PageActionsDetails()[i].IsGoButton()) {
                                    _this.PageActionsDetails()[i].Visible(true);
                                    _this.PageActionsDetails()[i].LayoutType(LayoutType.Button);
                                }
                                else if (_this.PageActionsDetails()[i].LayoutAlign() === Align.Right) {
                                    _this.PageActionsDetails()[i].LayoutType(LayoutType.Dropdown);
                                }
                            }
                        }
                    });
                    this.Enabled.subscribe(function (item) {
                        for (var i = 0; i < _this.PageActionsDetails().length; i++) {
                            _this.PageActionsDetails()[i].Enabled(item);
                        }
                    });
                    this.PageActionsDetails.subscribe(function (item) {
                        if (_this.IsDataBinded && _this.DisplayType() == DisplayActionType.Toolbar)
                            _this.RebindFlyoutMenu();
                    });
                }
                PageActionsViewModel.prototype.RebindFlyoutMenu = function () {
                    try {
                        $('#toolbarPageActionsOther > .reiflyovermenu').each(function (menuElement) {
                            $(this).fgmenu({ content: $(this).next().html(), flyOut: true, id: 'toolbarPageActionsOther' });
                        });
                    }
                    catch (e) {
                        PlatformConsole.log("Failed to bind fgmenue:" + e);
                    }
                    try {
                        //Bind the flyout menu for page actions buttons inside toolbar.
                        $('#toolbarPageActionsOther a.reiflyovermenu').mouseenter(function () {
                            $('#toolbarPageActionsOther a.reiflyovermenu small, #toolbarPageActionsOther a.reiflyovermenu big').hide();
                            if (!$(this).is('.fg-menu-open, .menu-open'))
                                $('small, big', this).show();
                        });
                        $('#toolbarPageActionsOther a.reiflyovermenu').mouseleave(function () {
                            $('#toolbarPageActionsOther a.reiflyovermenu small, #toolbarPageActionsOther a.reiflyovermenu big').hide();
                        });
                        $('#toolbarPageActionsOther a.reiflyovermenu').tipTip();
                    }
                    catch (e) {
                        PlatformConsole.log("Failed to bind tooltip on flyoutMenue in toolbar:" + e);
                    }
                    try {
                        //Tooltip for page action buttons in toolbar.
                        $('.toolbar-actionbutton a').mouseenter(function () {
                            $('.toolbar-actionbutton a small, .toolbar-actionbutton a big').hide();
                            if (!$(this).is('.fg-menu-open, .menu-open'))
                                $('small, big', this).show();
                        });
                        $('.toolbar-actionbutton a').mouseleave(function () {
                            $('.toolbar-actionbutton a small, .toolbar-actionbutton a big').hide();
                        });
                        $('.toolbar-actionbutton a').tipTip();
                    }
                    catch (e) {
                        PlatformConsole.log("Failed to re-bind tooltips page action buttons in toolbar." + e);
                    }
                };
                return PageActionsViewModel;
            })();
            Layout.PageActionsViewModel = PageActionsViewModel;
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
 