/// <reference path="../ExternalTS/Platformlib.ts" />
/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../externalts/telerik.d.ts" />
// Module
var Reisys;
(function (Reisys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var ContextMenu;
            (function (ContextMenu) {
                var ContextMenuItemType = (function () {
                    function ContextMenuItemType() {
                    }
                    ContextMenuItemType.Group = 'Group';
                    ContextMenuItemType.SubGroup = 'SubGroup';
                    ContextMenuItemType.Item = 'Item';
                    ContextMenuItemType.SubMenu = 'SubMenu';
                    ContextMenuItemType.Separator = 'Separator';
                    ContextMenuItemType.GroupSeparator = 'GroupSeparator';
                    ContextMenuItemType.PopUpItem = 'PopUpItem';
                    ContextMenuItemType.LinkButton = 'LinkButton';
                    ContextMenuItemType.OverlayItem = 'OverlayItem';
                    return ContextMenuItemType;
                }());
                ContextMenu.ContextMenuItemType = ContextMenuItemType;
                // Class
                var ContextMenuGenerator = (function () {
                    // Constructor
                    function ContextMenuGenerator(contextMenuJSON) {
                        this.contextMenuJSON = contextMenuJSON;
                        this.menuJsonData = contextMenuJSON;
                        this.contextMenuControlId = this.menuJsonData.contextMenuControlId;
                        if (this.menuJsonData.items.length > 0) {
                            this.menuId = this.contextMenuControlId + "_menu";
                        }
                    }
                    // Method to create the default item for the context menu
                    ContextMenuGenerator.prototype.CreateContextMenuDefaultItem = function () {
                        var defaultItem = this.menuJsonData.defaultItem;
                        defaultItem.id = this.contextMenuControlId + '_default';
                        if (defaultItem.id == null || defaultItem.id == '')
                            defaultItem.id = this.contextMenuControlId + '_default';
                        var navigateUrl;
                        var strCssClass = 'tooltip';
                        var strTarget;
                        var relId;
                        if (defaultItem.enabled == null || defaultItem.enabled == undefined) {
                            defaultItem.enabled = true;
                        }
                        if (defaultItem.enabled) {
                            strCssClass += " showContext aclink";
                        }
                        else {
                            strCssClass += " cmDisabled";
                        }
                        if (defaultItem.itemType == ContextMenuItemType.LinkButton) {
                            navigateUrl = "javascript:__doPostBack(\'" + this.contextMenuControlId + "\',\'" + defaultItem.id + "$" + defaultItem.commandArgs + "\')";
                        }
                        else if (defaultItem.itemType == ContextMenuItemType.OverlayItem) {
                            navigateUrl = "#";
                            relId = defaultItem.overLayWindowId.substring(0, 1) == "#" ? defaultItem.overLayWindowId : "#" + defaultItem.overLayWindowId;
                            strCssClass += " modalInput";
                        }
                        else if (defaultItem.itemType == ContextMenuItemType.PopUpItem) {
                            strCssClass += " popUpClass";
                            strTarget = "_blank";
                            //Add check for built in popup handling if not handle well handle
                            navigateUrl = 'javascript:OpenPopupWithMenuBar(\'' + defaultItem.navigationUrl + '\',\'600\', \'980\', \'PopUp\')';
                        }
                        else if (defaultItem.navigationUrl == '') {
                            navigateUrl = "#";
                        }
                        else {
                            navigateUrl = defaultItem.navigationUrl;
                        }
                        var defaultItemDivMarkup = document.createElement('div');
                        defaultItemDivMarkup.setAttribute('class', 'action-menu');
                        var defaultItemAnchorTag = document.createElement('a');
                        if (navigateUrl.toLowerCase().indexOf("javascript") > -1) {
                            defaultItemAnchorTag.setAttribute('onclick', navigateUrl);
                            defaultItemAnchorTag.href = "#";
                        }
                        else {
                            defaultItemAnchorTag.href = navigateUrl;
                        }
                        if (relId) {
                            defaultItemAnchorTag.rel = relId;
                        }
                        defaultItemAnchorTag.setAttribute('class', strCssClass);
                        //defaultItemAnchorTag.innerHTML = defaultItem.text;
                        if (defaultItem.imagePath) {
                            var defaultItemImg = document.createElement('img');
                            defaultItemImg.src = defaultItem.imagePath;
                            defaultItemImg.style.cssText = 'margin-right: 3px';
                            defaultItemImg.alt = '';
                            defaultItemAnchorTag.appendChild(defaultItemImg);
                        }
                        defaultItemAnchorTag.innerHTML += defaultItem.text;
                        defaultItemDivMarkup.appendChild(defaultItemAnchorTag);
                        if (defaultItem.tooltipText !== undefined) {
                            defaultItemAnchorTag.title = defaultItem.tooltipText;
                        }
                        var defaultItemImageAnchorTag = document.createElement('a');
                        // If default item is disabled, the image anchor should not be disbaled too.
                        // To avoid that tabindex is removed and below css class is added
                        strCssClass = 'tooltip showContext aclink';
                        defaultItemImageAnchorTag.setAttribute('class', strCssClass);
                        defaultItemImageAnchorTag.href = '#';
                        defaultItemImageAnchorTag.rel = this.menuId;
                        defaultItemImageAnchorTag.id = defaultItem.id;
                        defaultItemImageAnchorTag.setAttribute('onclick', 'return false;');
                        defaultItemImageAnchorTag.setAttribute('tooltip-pos', 'top');
                        var defaultItemImage = document.createElement('img');
                        defaultItemImage.src = REISys.Platform.WebRoot + "/Platform/Include/Skins/EHB/Images/contextmenu_arrow.png";
                        defaultItemImage.setAttribute('class', 'menuicon');
                        defaultItemImage.alt = 'Click to see more options';
                        defaultItemImage.style.borderWidth = '0px';
                        defaultItemImage.id = "cmImg" + defaultItem.id;
                        var gridContextMenu = $('#' + this.contextMenuControlId);
                        if (gridContextMenu && gridContextMenu.length > 0) {
                            if (defaultItem.enabled) {
                                var hiddenTextElement = document.createElement('span');
                                hiddenTextElement.setAttribute('class', 'hidden-offscreen');
                                hiddenTextElement.textContent = 'Click to see more options';
                                defaultItemImageAnchorTag.title = 'Click to see more options';
                                defaultItemImageAnchorTag.appendChild(hiddenTextElement);
                            }
                            defaultItemImageAnchorTag.appendChild(defaultItemImage);
                            gridContextMenu.html('');
                            $('#' + this.contextMenuControlId).append(defaultItemDivMarkup);
                            $(defaultItemImageAnchorTag).data('child', this.menuJsonData);
                        }
                        else {
                            defaultItemImageAnchorTag.appendChild(defaultItemImage);
                        }
                        defaultItemDivMarkup.appendChild(defaultItemImageAnchorTag);
                        $('.tooltip').tipTip();
                    };
                    // Method to create context menu
                    ContextMenuGenerator.prototype.CreateContextMenu = function () {
                        //Create context menu based on the json object
                        if (this.menuJsonData.items.length > 0) {
                            var contextMenuDivElement = document.createElement('div');
                            contextMenuDivElement.setAttribute('class', 'contextmenu');
                            contextMenuDivElement.setAttribute('orientation-vertical', 'down');
                            contextMenuDivElement.setAttribute('orientation-horizontal', 'right');
                            contextMenuDivElement.setAttribute('style', 'display:block;');
                            contextMenuDivElement.id = this.menuId;
                            var ulElement = this.CreateChildItems();
                            contextMenuDivElement.appendChild(ulElement);
                            return contextMenuDivElement;
                        }
                    };
                    //Method to create the <ul> for the context menu items.
                    ContextMenuGenerator.prototype.CreateChildItems = function () {
                        var itemUlElement = document.createElement('ul');
                        itemUlElement.setAttribute('class', 'cmMenuVertical cmlevel1');
                        for (var index = 0; index < this.menuJsonData.items.length; index++) {
                            var itemLiElement;
                            itemLiElement = this.CreateMenuItem(this.menuJsonData.items[index], null);
                            if (itemLiElement) {
                                itemUlElement.appendChild(itemLiElement);
                            }
                        }
                        return itemUlElement;
                    };
                    //Build Context Menu Item Markup based on the Context Menu ItemType
                    ContextMenuGenerator.prototype.CreateMenuItem = function (menuItem, parentItem) {
                        var element;
                        var markupText = '';
                        switch (menuItem.itemType) {
                            case ContextMenuItemType.Group:
                                var itemMarkup = new MenuItemHelper("cmHeader", menuItem.text).GetLiMarkUp();
                                return itemMarkup;
                            //break;
                            case ContextMenuItemType.GroupSeparator:
                                var separatorDivElement = document.createElement('div');
                                separatorDivElement.setAttribute('class', 'cmGroupSeperator');
                                return separatorDivElement;
                            //break;
                            case ContextMenuItemType.Item:
                                markupText = this.CreateItemMarkup(menuItem);
                                var itemMarkup = new MenuItemHelper("cmItem", markupText).GetLiMarkUp();
                                return itemMarkup;
                            //break;
                            case ContextMenuItemType.LinkButton:
                                markupText = this.CreateItemMarkup(menuItem);
                                var itemMarkup = new MenuItemHelper("cmItem", markupText).GetLiMarkUp();
                                return itemMarkup;
                            //break;
                            case ContextMenuItemType.PopUpItem:
                                markupText = this.CreatePopItemMarkup(menuItem);
                                var itemMarkup = new MenuItemHelper("cmItem", markupText).GetLiMarkUp();
                                return itemMarkup;
                            //break;
                            case ContextMenuItemType.SubGroup:
                                var itemMarkup = new MenuItemHelper("cmGroupHeader", menuItem.text).GetLiMarkUp();
                                return itemMarkup;
                            //break;
                            case ContextMenuItemType.SubMenu:
                                markupText = this.CreateSubMenuItemMarkup(menuItem, parentItem);
                                var itemMarkup = new MenuItemHelper("cmItem cmFlyout", markupText).GetLiMarkUp();
                                return itemMarkup;
                            //break;
                            case ContextMenuItemType.OverlayItem:
                                markupText = this.CreateItemMarkup(menuItem);
                                var itemMarkup = new MenuItemHelper("cmItem", markupText).GetLiMarkUp();
                                return itemMarkup;
                            //break;
                            case ContextMenuItemType.Separator:
                                var separatorDivElement = document.createElement('div');
                                separatorDivElement.setAttribute('class', 'cmSeperator');
                                return separatorDivElement;
                            //break;
                            default:
                                markupText = this.CreateItemMarkup(menuItem);
                                var itemMarkup = new MenuItemHelper("cmItem", markupText).GetLiMarkUp();
                                return itemMarkup;
                        }
                        //return element;
                    };
                    //Method to create markup for itemtype - Item
                    ContextMenuGenerator.prototype.CreateItemMarkup = function (item) {
                        var spanElement = document.createElement('span');
                        spanElement.innerHTML = item.text;
                        var imageElement;
                        if (item.imagePath != null && item.imagePath != undefined && item.imagePath != '') {
                            imageElement = this.CreateMenuItemImage(item);
                        }
                        if (item.enabled == null || item.enabled == undefined) {
                            item.enabled = true;
                        }
                        if (item.enabled) {
                            spanElement.setAttribute('class', 'cmText');
                            var anchorElement = document.createElement('a');
                            anchorElement.setAttribute('class', 'tooltip cmLink');
                            if (item.tooltipText !== undefined) {
                                anchorElement.title = item.tooltipText;
                            }
                            if (item.itemType == ContextMenuItemType.LinkButton) {
                                var strPostBack = "javascript:__doPostBack(\'" + this.contextMenuControlId + "\',\'" + item.id + "$" + item.commandArgs + "\')";
                                anchorElement.href = strPostBack;
                            }
                            else {
                                if (item.navigationUrl != null && item.navigationUrl != undefined && item.navigationUrl != '') {
                                    if (item.navigationUrl.toLowerCase().indexOf("javascript") > -1) {
                                        anchorElement.setAttribute('onclick', item.navigationUrl);
                                        anchorElement.href = "#";
                                    }
                                    else {
                                        anchorElement.href = item.navigationUrl;
                                    }
                                }
                            }
                            if (item.itemType == ContextMenuItemType.OverlayItem) {
                                anchorElement.rel = item.overLayWindowId.substring(0, 1) == "#" ? item.overLayWindowId : "#" + item.overLayWindowId;
                                anchorElement.setAttribute('class', 'tooltip cmLink modalInput');
                            }
                            anchorElement.appendChild(spanElement);
                            if (imageElement != null) {
                                anchorElement.insertBefore(imageElement, spanElement);
                            }
                            return anchorElement.outerHTML;
                        }
                        else {
                            spanElement.setAttribute('class', 'cmText cmDisabled tooltip');
                            if (imageElement != null) {
                                return imageElement.outerHTML + spanElement.outerHTML;
                            }
                            return spanElement.outerHTML;
                        }
                    };
                    //Method to create markup for itemtype - PopupItem
                    ContextMenuGenerator.prototype.CreatePopItemMarkup = function (item) {
                        var anchorElement = document.createElement('a');
                        var spanElement = document.createElement('span');
                        spanElement.setAttribute('class', 'cmText');
                        spanElement.innerHTML = item.text;
                        var popupImageElement = document.createElement('img');
                        popupImageElement.src = REISys.Platform.WebRoot + "/Platform/Include/Skins/EHB/Images/extlink.png";
                        popupImageElement.setAttribute('class', 'extLink');
                        popupImageElement.alt = 'This link opens a new window';
                        spanElement.appendChild(popupImageElement);
                        var imageElement;
                        if (item.enabled == null || item.enabled == undefined) {
                            item.enabled = true;
                        }
                        if (item.imagePath != null && item.imagePath != undefined && item.imagePath != '') {
                            imageElement = this.CreateMenuItemImage(item);
                        }
                        if (item.enabled) {
                            anchorElement.setAttribute('class', 'tooltip cmLink popUpClass');
                            if (item.navigationUrl != null && item.navigationUrl != undefined && item.navigationUrl != '') {
                                //Open popups in same or differenct window.
                                var windowName = (ReiSys && ReiSys.Platform && ReiSys.Platform.OpenPopupInSameWindow === true) ? 'Popup' : ReiSys.Platform.Utilities.CommonUtils.NewGuid();
                                anchorElement.href = 'javascript:OpenPopupWithMenuBar(\'' + item.navigationUrl + '\',\'600\', \'980\', \'' + windowName + '\')';
                            }
                            anchorElement.appendChild(spanElement);
                            if (imageElement != null) {
                                anchorElement.insertBefore(imageElement, spanElement);
                            }
                            return anchorElement.outerHTML;
                        }
                        else {
                            var divElement = document.createElement('div');
                            divElement.setAttribute('class', 'tooltip cmLink cmDisabled');
                            divElement.appendChild(spanElement);
                            if (imageElement != null) {
                                divElement.insertBefore(imageElement, spanElement);
                            }
                            return divElement.outerHTML;
                        }
                    };
                    //Method to create subMenu item
                    ContextMenuGenerator.prototype.CreateSubMenuItemMarkup = function (item, parentItem) {
                        var anchorElement = document.createElement('a');
                        var spanElement = document.createElement('span');
                        anchorElement.href = 'javascript:void(0)';
                        spanElement.setAttribute('class', 'cmText');
                        spanElement.innerHTML = item.text;
                        anchorElement.appendChild(spanElement);
                        var imageElement;
                        if (item.imagePath != null && item.imagePath != undefined && item.imagePath != '') {
                            imageElement = this.CreateMenuItemImage(item);
                            anchorElement.insertBefore(imageElement, spanElement);
                        }
                        var level = this.GetSubMenuLevel(item, parentItem, 1) + 1;
                        var uLElement = document.createElement('ul');
                        uLElement.setAttribute('class', 'cmlevel' + level);
                        for (var index = 0; index < item.items.length; index++) {
                            var itemLiElement;
                            itemLiElement = this.CreateMenuItem(item.items[index], item);
                            uLElement.appendChild(itemLiElement);
                        }
                        return anchorElement.outerHTML + uLElement.outerHTML;
                    };
                    //Method to get the level of the subMenu item so the css class can be set correctly for the flyout menu.
                    ContextMenuGenerator.prototype.GetSubMenuLevel = function (item, parentItem, level) {
                        if (parentItem != null && parentItem.itemType == ContextMenuItemType.SubMenu)
                            return this.GetSubMenuLevel(item, null, ++level);
                        return level;
                    };
                    //Method to create an image for the context menu item if the imagePath is provided.
                    ContextMenuGenerator.prototype.CreateMenuItemImage = function (item) {
                        var imageElement;
                        imageElement = document.createElement('img');
                        imageElement.src = item.imagePath;
                        imageElement.setAttribute('class', 'cmLeftImg');
                        imageElement.alt = '';
                        return imageElement;
                    };
                    //method 
                    ContextMenuGenerator.CreateContextMenuOnClick = function (sender, args) {
                        var jsonData;
                        var contextMenuElement;
                        jsonData = $(sender).data('child');
                        //$('div.contextmenu').remove();
                        if (jsonData) {
                            var contextMenuBuilder = new Reisys.Platform.UI.ContextMenu.ContextMenuGenerator(jsonData);
                            var gridContextMenu = $('#' + jsonData.contextMenuControlId);
                            if (gridContextMenu && $('div.contextmenu', gridContextMenu).length == 0)
                                $('#' + jsonData.contextMenuControlId).append(contextMenuBuilder.CreateContextMenu());
                        }
                    };
                    return ContextMenuGenerator;
                }());
                ContextMenu.ContextMenuGenerator = ContextMenuGenerator;
                //a Helper class to build markup for each <li> element
                var MenuItemHelper = (function () {
                    function MenuItemHelper(css, text) {
                        this.cssClass = css;
                        this.text = text;
                    }
                    MenuItemHelper.prototype.GetLiMarkUp = function () {
                        var liElement = document.createElement('li');
                        if (this.cssClass != '' && this.cssClass != undefined) {
                            liElement.setAttribute('class', this.cssClass);
                            liElement.innerHTML = this.text;
                        }
                        else {
                            liElement.innerHTML = this.text;
                        }
                        return liElement;
                    };
                    return MenuItemHelper;
                }());
            })(ContextMenu = UI.ContextMenu || (UI.ContextMenu = {}));
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = Reisys.Platform || (Reisys.Platform = {}));
})(Reisys || (Reisys = {}));
