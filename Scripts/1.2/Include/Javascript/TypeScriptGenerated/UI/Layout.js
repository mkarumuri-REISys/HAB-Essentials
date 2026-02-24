/// <reference path="../externalts/knockout.d.ts" />
/// <reference path="../ExternalTS/jquery.d.ts" />
var ReiSys;
(function (ReiSys) {
    var Layout;
    (function (Layout) {
        var Messages;
        (function (Messages) {
            var SystemMessage = (function () {
                function SystemMessage() {
                }
                //Check visibility of message banner
                SystemMessage.IsVisibile = function () {
                    return $('div[id*=masterSystemMessage]').is(":visible");
                };
                //Set the visibility
                SystemMessage.SetVisibility = function (visibility) {
                    if (visibility) {
                        $('div[id*=masterSystemMessage]').removeClass('hideItem');
                        $('div[id*=masterSystemMessage] div').html('System Alert ');
                    }
                    else {
                        $('div[id*=masterSystemMessage]').addClass('hideItem');
                        $('div[id*=masterSystemMessage] div').html('');
                    }
                };
                //Set the system message
                SystemMessage.AddMessage = function (message) {
                    $('div[id*=masterSystemMessage] .messageGL').append($('<span>' + message + '</span>'));
                };
                //Clears the messages
                SystemMessage.ClearMessages = function () {
                    $('div[id*=masterSystemMessage] .messageGL span').remove();
                };
                return SystemMessage;
            }());
            Messages.SystemMessage = SystemMessage;
        })(Messages = Layout.Messages || (Layout.Messages = {}));
    })(Layout = ReiSys.Layout || (ReiSys.Layout = {}));
})(ReiSys || (ReiSys = {}));
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var LeftSideMenu = (function () {
                function LeftSideMenu() {
                    // this is a single array containing all of the left menu objects 
                    this.flattenedObjectArray = {};
                }
                ////
                //Loads the initial Menu object
                ////
                LeftSideMenu.prototype.LoadMenu = function (menu) {
                    this.leftSideMenuItems = menu;
                    var menuItemCount = menu.length;
                    var arrayOfObservableleItems = new Array();
                    for (var i = 0; i < menuItemCount; i++) {
                        var newItem = new LeftSideMenuItemObservablele(menu[i]);
                        arrayOfObservableleItems.push(newItem);
                    }
                    this.Model = ko.observableArray(arrayOfObservableleItems);
                };
                ////
                // Adds a new menu item that is provided to the item by the given markup id
                ////
                LeftSideMenu.prototype.addItem = function (markupId, menuItem) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        menuItem.Parent = item;
                        item.ChildNavigationItems.push(menuItem);
                    }
                    else if (markupId == '') {
                        this.Model.push(menuItem);
                    }
                    if (this.getItem(menuItem.MarkupId()) == undefined) {
                        this.flattenedObjectArray[menuItem.MarkupId()] = menuItem;
                    }
                    SetupButtonClickEventsForLeftSideMenu();
                };
                ////
                // Removes the menu by the given markup id
                ////
                LeftSideMenu.prototype.removeItem = function (markupId) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        if (item.Parent != undefined) {
                            item.Parent.ChildNavigationItems.remove(item);
                        }
                        else {
                            this.Model.remove(item);
                        }
                    }
                    this.flattenedObjectArray[markupId] = undefined;
                };
                ////
                // Sets the provided image src for the given markup id
                ////
                LeftSideMenu.prototype.setImageSrcForItem = function (markupId, imageSrc) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        item.IconImageUrl(imageSrc);
                    }
                };
                ////
                // Sets the tool tip image for the given markup id
                ////
                LeftSideMenu.prototype.setImageToolTipItem = function (markupId, imageTooltip) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        item.ImageToolTip(imageTooltip);
                    }
                    $('.tooltip').tipTip();
                };
                ////
                // Sets the provided image alt text for the given markup id
                ////
                LeftSideMenu.prototype.setImageAltTextItem = function (markupId, altText) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        item.ImageAltText(altText);
                    }
                };
                ////
                // Sets the provided image alt text for the given markup id
                ////
                LeftSideMenu.prototype.setImageForItem = function (markupId, altText, imageSrc) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        item.ImageAltText(altText);
                        item.IconImageUrl(imageSrc);
                    }
                };
                ////
                // Sets the tooltip for the menu item for the given markup id
                ////
                LeftSideMenu.prototype.setTooltipForItem = function (markupId, tooltip) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        item.ToolTip(tooltip);
                    }
                    $('.tooltip').tipTip();
                };
                ////
                // Sets the text for the given markup id
                ////
                LeftSideMenu.prototype.setTextForItem = function (markupId, text) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        item.Text(text);
                    }
                };
                ////
                // Sets the destination (Navigation URL) for the given markup id
                ////
                LeftSideMenu.prototype.setDestinationForItem = function (markupId, destination) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        item.Destination(destination);
                    }
                };
                ////
                // Sets visibility for the menu item by the given markup id
                ////
                LeftSideMenu.prototype.setVisibleForItem = function (markupId, visible) {
                    var item = this.getItem(markupId);
                    if (item != undefined) {
                        item.Visible(visible);
                    }
                };
                ////
                // Gets the item by given markup id
                ////
                LeftSideMenu.prototype.getItem = function (markupId) {
                    return REISys.Platform.Layout.LeftMenu.flattenedObjectArray[markupId];
                };
                ////
                //  Hides the left menu (removes the elment from the  page)
                ////
                LeftSideMenu.prototype.hideMenu = function () {
                    var colLeft = $('#colleft');
                    var lmBase = $('.lmBase');
                    if (colLeft.length > 0 && lmBase.length > 0) {
                        ko.cleanNode(lmBase[0]);
                        lmBase.empty();
                        this.leftMenuInnerLayout = colLeft.html();
                        colLeft.hide();
                        colLeft.empty();
                    }
                };
                ////
                // Shows the menu (This will rerender the item)
                ////
                LeftSideMenu.prototype.showMenu = function () {
                    var colLeft = $('#colleft');
                    if (this.leftMenuInnerLayout) {
                        colLeft.html(this.leftMenuInnerLayout);
                        ko.applyBindings(this, $('.lmBase')[0]);
                        colLeft.show();
                        //Called to readd the proper click events to the anchor tags
                        SetupButtonClickEventsForLeftSideMenu();
                        SetUpLeftMenuEvents();
                        this.leftMenuInnerLayout = undefined;
                    }
                };
                ////
                // Expands the menu
                ////
                LeftSideMenu.prototype.expandMenu = function () {
                    var button = $('#anchorExpand');
                    if (button.is(':visible')) {
                        button.click();
                    }
                };
                ////
                // Collapse the menu
                ////
                LeftSideMenu.prototype.collapseMenu = function () {
                    var button = $('#anchorCollapse');
                    if (button.is(':visible')) {
                        button.click();
                    }
                };
                ////
                // Sets the menu title
                ////
                LeftSideMenu.prototype.setMenuTitle = function (title) {
                    $('.left_title').text(title);
                };
                ////
                // Gets the menu title
                ////
                LeftSideMenu.prototype.getMenuTitle = function () {
                    return $('.left_title').text();
                };
                ////
                // Disables the menu -- display:none, also adjusts right hand side div
                ////
                LeftSideMenu.prototype.disableLeftMenu = function () {
                    var colleft = document.getElementById("colleft");
                    // Disable the LeftMenu Panel.
                    if (colleft)
                        colleft.style.display = "none";
                    var colright = document.getElementById("colright");
                    // Move the grid's container's left margin to fit the print page.
                    if (colright)
                        colright.style.marginLeft = "-10px";
                };
                ////
                // Enables the menu -- display:block, also adjusts right hand side div
                ////
                LeftSideMenu.prototype.enableLeftMenu = function () {
                    // Show Left Menu after printing
                    var colright = document.getElementById("colright");
                    // Move the grid's container's left margin to fit the Left Menu panel appropriately in the page.
                    if (colright)
                        colright.style.marginLeft = "180px";
                    var colleft = document.getElementById("colleft");
                    // Enable the LeftMenu Panel.
                    if (colleft)
                        colleft.style.display = "block";
                };
                ;
                return LeftSideMenu;
            }());
            Layout.LeftSideMenu = LeftSideMenu;
            ////
            // This is the knockout obeservable objects 
            ////
            var LeftSideMenuItemObservablele = (function () {
                ////
                // This takes in an a left menu item (JSON) and also an optional parent used for remove
                // This makes all of the items observable
                ////
                function LeftSideMenuItemObservablele(leftMenuItem, parentItem) {
                    this.RoleId = ko.observable(leftMenuItem.RoleId);
                    this.IconImageUrl = ko.observable(leftMenuItem.IconImageUrl);
                    this.ImageAltText = ko.observable(leftMenuItem.ImageAltText);
                    this.ImageToolTip = ko.observable(leftMenuItem.ImageToolTip);
                    this.PopUp = ko.observable(leftMenuItem.PopUp);
                    this.IsExpanded = ko.observable(leftMenuItem.IsExpanded);
                    this.MarkupId = ko.observable(leftMenuItem.MarkupId);
                    this.Class = ko.observable(leftMenuItem.Class);
                    this.Target = ko.observable(leftMenuItem.Target);
                    this.Text = ko.observable(leftMenuItem.Text);
                    this.Destination = ko.observable(leftMenuItem.Destination);
                    this.ToolTip = ko.observable(leftMenuItem.ToolTip);
                    this.Enabled = ko.observable(leftMenuItem.Enabled);
                    this.Visible = ko.observable(leftMenuItem.Visible);
                    var childItemCount = leftMenuItem.ChildNavigationItems.length;
                    var arrayOfObservableleItems = new Array();
                    this.Parent = parentItem;
                    if (childItemCount > 0) {
                        for (var i = 0; i < childItemCount; i++) {
                            var newItem = new LeftSideMenuItemObservablele(leftMenuItem.ChildNavigationItems[i], this);
                            arrayOfObservableleItems.push(newItem);
                        }
                        this.ChildNavigationItems = ko.observableArray(arrayOfObservableleItems);
                    }
                    else {
                        this.ChildNavigationItems = ko.observableArray(arrayOfObservableleItems);
                    }
                    if (this.MarkupId() != null && this.MarkupId() != '') {
                        REISys.Platform.Layout.LeftMenu.flattenedObjectArray[this.MarkupId()] = this;
                    }
                }
                return LeftSideMenuItemObservablele;
            }());
            Layout.LeftSideMenuItemObservablele = LeftSideMenuItemObservablele;
            Layout.LeftMenu = new REISys.Platform.Layout.LeftSideMenu();
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Layout;
        (function (Layout) {
            var Window = (function () {
                function Window() {
                }
                ////
                // Gets the window title
                ////
                Window.getTitle = function () {
                    return document.title;
                };
                ////
                // Sets the window title
                ////
                Window.setTitle = function (title) {
                    var oldTitle = this.getTitle();
                    var items = oldTitle.split('|');
                    var titleEnding = '';
                    if (items.length > 1) {
                        if (items.length > 2) {
                            for (var i = items.length - 1; i > items.length - 3; i--) {
                                titleEnding = ' | ' + items[i] + titleEnding;
                            }
                        }
                        else {
                            for (var i = items.length - 1; i > items.length - 2; i--) {
                                titleEnding = ' | ' + items[i] + titleEnding;
                            }
                        }
                    }
                    var ListAppened = ' - List';
                    var AddAppened = ' - Add';
                    var EditAppened = ' - Edit';
                    var ConfirmAppened = ' - Confirm';
                    var DeleteAppened = ' - Delete';
                    var CancelAppened = ' - Cancel';
                    if (oldTitle.indexOf(ListAppened) > 0) {
                        title += ListAppened;
                    }
                    else if (oldTitle.indexOf(AddAppened) > 0) {
                        title += AddAppened;
                    }
                    else if (oldTitle.indexOf(EditAppened) > 0) {
                        title += EditAppened;
                    }
                    else if (oldTitle.indexOf(ConfirmAppened) > 0) {
                        title += ConfirmAppened;
                    }
                    else if (oldTitle.indexOf(DeleteAppened) > 0) {
                        title += DeleteAppened;
                    }
                    else if (oldTitle.indexOf(CancelAppened) > 0) {
                        title += CancelAppened;
                    }
                    document.title = title + ' ' + titleEnding;
                };
                return Window;
            }());
            Layout.Window = Window;
            var Page = (function () {
                function Page() {
                }
                ////
                // Gets the page title
                ////
                Page.getTitle = function () {
                    return $('.main_title span').text();
                };
                ////
                // Sets the page title
                ////
                Page.setTitle = function (title) {
                    var titleImage = $('.titleimg');
                    var titleDiv = $('.main_title span');
                    var ListAppened = ' - List';
                    var AddAppened = ' - Add';
                    var EditAppened = ' - Edit';
                    var ConfirmAppened = ' - Confirm';
                    var DeleteAppened = ' - Delete';
                    var CancelAppened = ' - Cancel';
                    var oldTitle = REISys.Platform.Layout.Page.getTitle();
                    if (oldTitle.indexOf(ListAppened) > 0) {
                        title += ListAppened;
                    }
                    else if (oldTitle.indexOf(AddAppened) > 0) {
                        title += AddAppened;
                    }
                    else if (oldTitle.indexOf(EditAppened) > 0) {
                        title += EditAppened;
                    }
                    else if (oldTitle.indexOf(ConfirmAppened) > 0) {
                        title += ConfirmAppened;
                    }
                    else if (oldTitle.indexOf(DeleteAppened) > 0) {
                        title += DeleteAppened;
                    }
                    else if (oldTitle.indexOf(CancelAppened) > 0) {
                        title += CancelAppened;
                    }
                    titleDiv.html(title);
                    titleDiv.prepend(titleImage);
                };
                Page.hideTitle = function () {
                    $('.main_title span').hide();
                };
                Page.showTitle = function () {
                    $('.main_title span').show();
                };
                return Page;
            }());
            Layout.Page = Page;
        })(Layout = Platform.Layout || (Platform.Layout = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
