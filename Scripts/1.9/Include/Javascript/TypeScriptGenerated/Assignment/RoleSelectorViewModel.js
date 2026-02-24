var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            var Assignment;
            (function (Assignment) {
                //The Viewmodel for the role dropdown.
                var RoleSelectorViewModel = (function () {
                    function RoleSelectorViewModel(args) {
                        var _this = this;
                        //Instance function ensures proper 'this' context
                        this.selectedValue = function () { return _this.selectedRole(); };
                        this.roles = args.Roles.sort(this.compareRoles);
                        this.selectedRole = ko.observable(null);
                        this.rowLabelDisplay = (args.HideRoleLabel) ? 'none' : 'block';
                    }
                    RoleSelectorViewModel.prototype.compareRoles = function (a, b) {
                        var first = (a.RoleName || '').toLowerCase();
                        var second = (b.RoleName || '').toLowerCase();
                        if (first < second)
                            return -1;
                        if (first > second)
                            return 1;
                        return 0;
                    };
                    return RoleSelectorViewModel;
                }());
                Assignment.RoleSelectorViewModel = RoleSelectorViewModel;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
