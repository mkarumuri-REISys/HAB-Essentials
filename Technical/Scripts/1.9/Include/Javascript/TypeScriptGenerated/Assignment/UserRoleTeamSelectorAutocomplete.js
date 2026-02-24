var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            var Assignment;
            (function (Assignment) {
                //Custom one for the UserRoleTeamSelector
                var UserRoleTeamSelectorAutocomplete = (function (_super) {
                    __extends(UserRoleTeamSelectorAutocomplete, _super);
                    function UserRoleTeamSelectorAutocomplete(textFieldId) {
                        _super.call(this, '#' + textFieldId, []);
                        this.availableItems = ko.observableArray([]);
                        this.selectedItem = ko.observable(null);
                        this.textField.val('');
                        this.textField.on("autocompleteselect", this.changeValue.bind(this));
                        this.textField.on("autocompleteclose", this.validateValue.bind(this));
                        this.selectedItem.subscribe(this.textFieldHandler, this);
                        this.textField.bind('focus', function () {
                            $(this).autocomplete("search");
                        });
                        this.textField.keypress(function (e) {
                            var code = (e.keyCode ? e.keyCode : e.which);
                            if (code == 13) {
                                return false;
                            }
                        });
                        this.textField.autocomplete({
                            source: this.sourceFunction.bind(this),
                            minLength: 0,
                            response: this.noResultsHandler.bind(this)
                        });
                    }
                    UserRoleTeamSelectorAutocomplete.prototype.changeValue = function (e, ui) {
                        if (!ui) {
                            this.selectedItem(null);
                        }
                        else {
                            this.selectedItem(ui.item.model);
                        }
                    };
                    UserRoleTeamSelectorAutocomplete.prototype.noResultsHandler = function (e, ui) {
                        if (!ui.content.length) {
                            var noResult = { value: "", label: "No results found", model: null };
                            ui.content.push(noResult);
                        }
                    };
                    UserRoleTeamSelectorAutocomplete.prototype.validateValue = function (e, ui) {
                        var text = this.textField.val();
                        var selectedText = this.getLabel(this.selectedItem());
                        if (text !== selectedText) {
                            this.textField.val(selectedText);
                        }
                    };
                    UserRoleTeamSelectorAutocomplete.prototype.textFieldHandler = function (item) {
                        if (item) {
                            this.textField.val(this.getLabel(item));
                        }
                        else {
                            this.textField.val('');
                        }
                    };
                    UserRoleTeamSelectorAutocomplete.prototype.sourceFunction = function (request, response) {
                        var filterFunc = this.getLabel;
                        var re = $.ui.autocomplete.escapeRegex(request.term);
                        var matcher = new RegExp(re, 'i');
                        var items = this.availableItems();
                        var filtered = $.grep(items, function (item, index) {
                            return matcher.test(filterFunc(item));
                        });
                        response(filtered.map(this.mapItem));
                    };
                    return UserRoleTeamSelectorAutocomplete;
                }(Assignment.AutocompleteController));
                Assignment.UserRoleTeamSelectorAutocomplete = UserRoleTeamSelectorAutocomplete;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
