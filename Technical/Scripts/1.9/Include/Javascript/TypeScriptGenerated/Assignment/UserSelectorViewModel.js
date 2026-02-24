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
                //The Viewmodel for the user dropdown
                var UserSelectorViewModel = (function (_super) {
                    __extends(UserSelectorViewModel, _super);
                    function UserSelectorViewModel(textFieldId, args) {
                        var _this = this;
                        _super.call(this, textFieldId);
                        //Instance functions ensures proper 'this' context
                        this.selectedValue = function () {
                            //prevents returning undefined
                            var selected = _this.selectedUser() || null;
                            if (selected && selected.UserId === '-1') {
                                selected = null;
                            }
                            return selected;
                        };
                        this.setModelData = function (userId, users) {
                            _this.availableUsers(users);
                            var defaultUser = _this.getDefaultUser(userId);
                            _this.selectedUser(defaultUser);
                        };
                        this.getDefaultUser = function (userId) {
                            var defaultUser = null;
                            if (userId) {
                                var users = _this.availableUsers();
                                defaultUser = ko.utils.arrayFirst(users, function (user) { return user.UserId === userId; });
                            }
                            return defaultUser || null;
                        };
                        this.availableUsers = this.availableItems;
                        this.selectedUser = this.selectedItem;
                    }
                    UserSelectorViewModel.prototype.getLabel = function (item) {
                        if (item) {
                            return item.FullName;
                        }
                        else {
                            return '';
                        }
                    };
                    UserSelectorViewModel.prototype.mapItem = function (item) {
                        return {
                            label: item.FullName,
                            value: item.FullName,
                            model: item
                        };
                    };
                    return UserSelectorViewModel;
                }(Assignment.UserRoleTeamSelectorAutocomplete));
                Assignment.UserSelectorViewModel = UserSelectorViewModel;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
