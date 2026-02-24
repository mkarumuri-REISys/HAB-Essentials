var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Controller/BaseSearchAndListController.ts" />
/// <reference path="../UI/ContextMenu.ts" />
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            var TeamSearchListController = (function (_super) {
                __extends(TeamSearchListController, _super);
                function TeamSearchListController(args) {
                    _super.call(this, args.gridId, null);
                    this.selectionActionLabel = args.selectionActionLabel;
                    this.viewTeamProfileURL = args.viewTeamProfileURL;
                    this.OnTeamMemberSelected = new ReiSys.Utilities.PlatformEvent();
                    //register controller
                    this.RegisterController(TeamSearchListController.ControllerInstanceId);
                    //subscribing to the row databound event
                    this.RadGrid.grid.add_rowDataBound(this.Grid_RowDataBound.bind(this));
                    //add support for context menu
                    $(document).ready(function () {
                        ContextMenuOnClick.subscribe(Reisys.Platform.UI.ContextMenu.ContextMenuGenerator.CreateContextMenuOnClick);
                    });
                    this.DefaultSortExpression = 'TeamName';
                    //render grid
                    this.InitializeGrid();
                }
                //This is an example of how one might set the default search parameters in page controller.
                TeamSearchListController.prototype.SetDefaultSearchParameters = function () {
                    //this.addDefaultSearchParameters('TeamName_Search', 'LIKE', 'Abeba');
                    //this.addDefaultSearchParameters('TeamDescription_Search', 'LIKE', 'Queen');
                    this.addDefaultSearchParameters('Bureau_Search', '=', '705');
                    //this.addDefaultSearchParameters('OrgLevel_Search', 'IN', '904,919');
                    this.addDefaultSearchParameters('OrgLevel_Search', 'IN', '1,15');
                };
                // Event Handler for onRowDataBound event of the grid
                TeamSearchListController.prototype.Grid_RowDataBound = function (sender, args) {
                    var elem = args.get_item().get_element().nextSibling;
                    if (elem != null && elem.className !== undefined && elem.className !== null && elem.className.match(/\brgRow\b/) === null) {
                        var dataItem = args.get_dataItem();
                        //bind with the incoming data
                        ko.applyBindings(dataItem, elem);
                    }
                    this.BuildContextMenu(sender, args);
                };
                //Build context menu
                TeamSearchListController.prototype.BuildContextMenu = function (sender, args) {
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
                        var list = [
                            {
                                text: 'Action',
                                itemType: 'Group'
                            },
                            {
                                id: 'SelectionAction',
                                name: 'SelectionAction',
                                text: this.selectionActionLabel,
                                itemType: 'Item',
                                navigationUrl: 'javascript:ReiSys.Platform.Controller.BaseController.FindController(ReiSys.Platform.Controller.TeamSearchListController.ControllerInstanceId).SelectTeam(\'' + dataItems["TeamId"] + '\'); return false;',
                            },
                            {
                                text: 'View',
                                itemType: 'Group'
                            },
                            {
                                id: 'ViewTeamProfile',
                                name: 'ViewTeamProfile',
                                text: 'Team Profile',
                                itemType: 'PopUpItem',
                                enabled: true,
                                navigationUrl: this.viewTeamProfileURL,
                            }
                        ];
                        var jsonData = {
                            contextMenuControlId: contextMenuElement.id,
                            defaultItem: list[1],
                            items: list
                        };
                        var contextMenuBuilder = new Reisys.Platform.UI.ContextMenu.ContextMenuGenerator(jsonData);
                        contextMenuBuilder.CreateContextMenuDefaultItem();
                    }
                };
                //Parse through the json object and pull LastUpdateDate and format it based
                //what the BA's or customer requirements are and then update the json object.
                TeamSearchListController.prototype.FormatData = function (data) {
                    var itemList = jQuery.parseJSON(data.Data);
                    for (var i = 0; i < itemList.length; i++) {
                        var item = itemList[i];
                        if (item["LastUpdateDate"] != null) {
                            var currentTime = new Date(item["LastUpdateDate"]);
                        }
                    }
                };
                TeamSearchListController.prototype.SelectTeam = function (teamId) {
                    this.OnTeamMemberSelected.raise(this, teamId);
                };
                TeamSearchListController.hdnCurrentSelectionId = 'hdnCurrentSelectionId';
                TeamSearchListController.ControllerInstanceId = 'SEARCH_TEAM_LIST_CONTROLLER';
                return TeamSearchListController;
            })(REISys.Platform.UI.BaseSearchAndList.BaseSearchAndListController);
            Controller.TeamSearchListController = TeamSearchListController;
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=TeamSearchAndListController.js.map