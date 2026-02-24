/// <reference path="../ui/contextmenu.ts" />
/// <reference path="../controller/basesearchandlistcontroller.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            var UserSearchListController = (function (_super) {
                __extends(UserSearchListController, _super);
                function UserSearchListController(args) {
                    _super.call(this, args.gridId, args.NestedViewConfig);
                    this.selectionActionLabel = args.selectionActionLabel;
                    var grid = this.RadGrid.grid;
                    //subscribing to the row databound event
                    grid.add_rowDataBound(this.Grid_RowDataBound.bind(this));
                    this.OnUserSelected = new ReiSys.Utilities.PlatformEvent();
                    this.RegisterController(UserSearchListController.ControllerInstanceId);
                    this.EPSBaseURL = args.EPSBaseURL;
                    //subscribing to the event @ which the nested data is available
                    this.OnNestedViewDataBound.subscribe(function (elem, args) {
                        //clean up existing bindings if any
                        ko.cleanNode(elem);
                        //bind with the incoming data
                        ko.applyBindings(args.subItem, elem);
                    });
                    //add support for context menu
                    $(document).ready(function () {
                        ContextMenuOnClick.subscribe(Reisys.Platform.UI.ContextMenu.ContextMenuGenerator.CreateContextMenuOnClick);
                    });
                    this.DefaultSortExpression = "LastName,FirstName";
                    //render grid
                    this.InitializeGrid();
                }
                // Event Handler for onRowDataBound event of the grid
                UserSearchListController.prototype.Grid_RowDataBound = function (sender, args) {
                    this.BuildContextMenu(sender, args);
                };
                //Build context menu
                UserSearchListController.prototype.BuildContextMenu = function (sender, args) {
                    //get context menu placeholder (or create it if its not already there)
                    var contextMenuElement = args.get_item().findElement("lblContextMenu");
                    if (contextMenuElement == null) {
                        var tr = args.get_item().get_element();
                        var td = $(tr).find('td:last-child')[0];
                        contextMenuElement = document.createElement('span');
                        contextMenuElement.id = tr.id + '_lblContextMenu';
                        td.appendChild(contextMenuElement);
                    }
                    var dataItems = args.get_dataItem();
                    if (contextMenuElement != null && contextMenuElement != undefined) {
                        var jsonData = {
                            contextMenuControlId: contextMenuElement.id,
                            defaultItem: {
                                //id: defaultId,
                                name: 'SelectionAction',
                                text: this.selectionActionLabel,
                                itemType: 'Item',
                                navigationUrl: 'javascript:ReiSys.Platform.Controller.BaseController.FindController(REISys.Platform.Controller.UserSearchListController.ControllerInstanceId).SelectUser(\'' + dataItems["UserId"] + '\'); return false;',
                            },
                            items: [
                                {
                                    text: 'Action',
                                    itemType: 'Group'
                                },
                                {
                                    id: 'SelectionAction',
                                    name: 'SelectionAction',
                                    text: this.selectionActionLabel,
                                    itemType: 'Item',
                                    navigationUrl: 'javascript:ReiSys.Platform.Controller.BaseController.FindController(REISys.Platform.Controller.UserSearchListController.ControllerInstanceId).SelectUser(\'' + dataItems["UserId"] + '\'); return false;',
                                },
                                {
                                    text: 'View',
                                    itemType: 'Group'
                                },
                                {
                                    id: 'ViewWorkAreas',
                                    name: 'ViewWorkAreas',
                                    text: 'View Work Areas',
                                    itemType: 'PopUpItem',
                                    enabled: true,
                                    navigationUrl: ReiSys.Platform.Utils.addQueryStringVarFromUrl(this.EPSBaseURL + '/Interface/ManageWorkArea/ViewWorkAreas.aspx?uId=' + dataItems["UserId"], ['PRoleId']),
                                },
                                {
                                    id: 'UserProfile',
                                    name: 'UserProfile',
                                    text: 'User Profile',
                                    itemType: 'PopUpItem',
                                    enabled: true,
                                    navigationUrl: ReiSys.Platform.Utils.addQueryStringVarFromUrl(this.EPSBaseURL + '/Interface/common/AccessControl/ViewUserProfile.aspx?uId=' + dataItems["UserId"], ['PRoleId']),
                                }
                            ]
                        };
                        var contextMenuBuilder = new Reisys.Platform.UI.ContextMenu.ContextMenuGenerator(jsonData);
                        contextMenuBuilder.CreateContextMenuDefaultItem();
                    }
                };
                UserSearchListController.prototype.SelectUser = function (userId) {
                    this.OnUserSelected.raise(this, userId);
                };
                //extends ReiSys.Platfrom.UI.BaseSearchAndListController {
                UserSearchListController.ControllerInstanceId = 'SEARCH_USER_LIST_CONTROLLER';
                return UserSearchListController;
            })(REISys.Platform.UI.BaseSearchAndList.BaseSearchAndListController);
            Controller.UserSearchListController = UserSearchListController;
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
//# sourceMappingURL=UserSearchAndListController.js.map