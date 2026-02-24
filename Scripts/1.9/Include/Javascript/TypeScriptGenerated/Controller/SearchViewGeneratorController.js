var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../ui/contextmenu.ts" />
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var SearchViewGeneratorController = (function (_super) {
                __extends(SearchViewGeneratorController, _super);
                function SearchViewGeneratorController(args) {
                    _super.call(this, args.GridClientId, args.NestedViewConfig);
                    //this.SetDefaultSearchParameters();
                    var grid = this.RadGrid.grid;
                    //subscribing to the row databound event
                    grid.add_rowDataBound(this.Grid_RowDataBound.bind(this));
                    //add support for context menu
                    $(document).ready(function () {
                        ContextMenuOnClick.subscribe(Reisys.Platform.UI.ContextMenu.ContextMenuGenerator.CreateContextMenuOnClick);
                    });
                    //this.DefaultSortExpression = 'TeamName';
                    //render grid
                    this.InitializeGrid();
                }
                //This is an example of how one might set the default search parameters in page controller.
                SearchViewGeneratorController.prototype.SetDefaultSearchParameters = function () {
                    //this.addDefaultSearchParameters('TeamName_Search', 'LIKE', 'Abeba');
                    //this.addDefaultSearchParameters('TeamDescription_Search', 'LIKE', 'Queen');
                    //     this.addDefaultSearchParameters('Bureau_Search', '=', '705');
                    //this.addDefaultSearchParameters('OrgLevel_Search', 'IN', '904,919');
                    //   this.addDefaultSearchParameters('OrgLevel_Search', 'IN', '1,15');
                };
                // Event Handler for onRowDataBound event of the grid
                SearchViewGeneratorController.prototype.Grid_RowDataBound = function (sender, args) {
                    var elem = args.get_item().get_element().nextSibling;
                    if (elem != null
                        && elem.className !== undefined
                        && elem.className !== null
                        && elem.className.match(/\brgRow\b/) === null) {
                        var dataItem = args.get_dataItem();
                        //clean up existing bindings if any
                        ko.cleanNode(elem);
                        //bind with the incoming data
                        ko.applyBindings(dataItem, elem);
                    }
                    this.BuildContextMenu(sender, args);
                };
                //Build context menu
                SearchViewGeneratorController.prototype.BuildContextMenu = function (sender, args) {
                    //get context menu placeholder (or create it if its not already there)
                    var contextMenuElement = args.get_item().findElement("lblContextMenu");
                    if (contextMenuElement == null) {
                        var tr = args.get_item().get_element();
                        var td = $(tr).find('td:last-child')[0];
                        contextMenuElement = document.createElement('span');
                        contextMenuElement.id = tr.id + '_lblContextMenu';
                        td.appendChild(contextMenuElement);
                    }
                    //Build Json for the context menu
                    var dataItems = args.get_dataItem();
                    var options = new Array();
                    //  var contextMenuBuilder = new Reisys.Platform.UI.ContextMenu.ContextMenuGenerator(jsonData);
                    // contextMenuBuilder.CreateContextMenuDefaultItem();
                };
                return SearchViewGeneratorController;
            }(REISys.Platform.UI.BaseSearchAndList.BaseSearchAndListController));
            UI.SearchViewGeneratorController = SearchViewGeneratorController;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
