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
                //The three modes the controller can be set to
                (function (AssignmentModes) {
                    AssignmentModes[AssignmentModes["DirectOrIndirect"] = 1] = "DirectOrIndirect";
                    AssignmentModes[AssignmentModes["OfficeRoleUsers"] = 2] = "OfficeRoleUsers";
                    AssignmentModes[AssignmentModes["RoleUsers"] = 3] = "RoleUsers";
                })(Assignment.AssignmentModes || (Assignment.AssignmentModes = {}));
                var AssignmentModes = Assignment.AssignmentModes;
                //Controller for the control
                var UserRoleTeamSelectorController = (function (_super) {
                    __extends(UserRoleTeamSelectorController, _super);
                    function UserRoleTeamSelectorController(args, clientIds) {
                        _super.call(this);
                        this.args = args;
                        this.model = null;
                        this.map = {};
                        _super.prototype.RegisterClientIds.call(this, clientIds);
                        this.RegisterController(this.FindClientId(UserRoleTeamSelectorController.userControlId));
                        this.model = new Assignment.UserRoleTeamSelectorViewModel(args, this.FindClientId(UserRoleTeamSelectorController.txtTeam), this.FindClientId(UserRoleTeamSelectorController.txtUser));
                        this.hiddenField = document.getElementById(this.FindClientId(UserRoleTeamSelectorController.hdnSelectedValue));
                        this.model.selectedValue.subscribe(this.updateHiddenField.bind(this));
                        ko.applyBindings(this.model, document.getElementById(this.FindClientId(UserRoleTeamSelectorController.containerDivId)));
                        var tryInit = this.tryInitializeRole();
                        if (tryInit) {
                            this.model.roleViewModel.selectedRole.subscribe(this.setRoleHandler, this);
                        }
                        else {
                            this.initSubscription = this.model.roleViewModel.selectedRole.subscribe(this.initRoleHandler, this);
                        }
                        $('.tooltip').tipTip();
                    }
                    UserRoleTeamSelectorController.prototype.updateHiddenField = function (value) {
                        this.hiddenField.value = JSON.stringify(value);
                    };
                    UserRoleTeamSelectorController.prototype.tryInitializeRole = function () {
                        var defaultValues = new Assignment.DefaultSelectorValues(this.args);
                        var role;
                        if (defaultValues.roleId) {
                            var role = ko.utils.arrayFirst(this.args.Roles, function (r) { return r.RoleId === defaultValues.roleId; });
                            if (role) {
                                var doneFunc = function (roleResult) {
                                    this.model.setRoleRelatedData(roleResult, defaultValues);
                                }.bind(this);
                                this.loadRoleData(this.args, role)
                                    .done(doneFunc)
                                    .fail(this.showErrorMessages);
                                return true;
                            }
                        }
                        return false;
                    };
                    UserRoleTeamSelectorController.prototype.initRoleHandler = function (role) {
                        var values = new Assignment.DefaultSelectorValues(this.args);
                        var doneFunc = function (role) {
                            this.initSubscription.dispose();
                            this.model.setRoleRelatedData(role, values);
                            this.model.roleViewModel.selectedRole.subscribe(this.setRoleHandler, this);
                        }.bind(this);
                        this.loadRoleData(this.args, role)
                            .done(doneFunc)
                            .fail(this.showErrorMessages);
                    };
                    UserRoleTeamSelectorController.prototype.setRoleHandler = function (role) {
                        var doneFunc = function (role) {
                            this.model.setRoleRelatedData(role, null);
                        }.bind(this);
                        this.loadRoleData(this.args, role)
                            .done(doneFunc)
                            .fail(this.showErrorMessages);
                    };
                    UserRoleTeamSelectorController.prototype.showErrorMessages = function () {
                        REISys.Platform.Layout.ErrorMessages.addMessages('An unkown error has occured when trying to fetch user information');
                        REISys.Platform.Layout.ErrorMessages.setVisible(true);
                    };
                    UserRoleTeamSelectorController.prototype.loadRoleData = function (args, role) {
                        var deferred = $.Deferred();
                        var key = args.Mode + '_' + role.RoleId + '_' + args.OfficeId;
                        if (this.map[key]) {
                            deferred.resolve(this.map[key]);
                        }
                        else {
                            var urlString = REISys.Platform.WebsiteUrl + '/api/Assignment/GetRoleAssignees?';
                            var url = this.generateUrl(urlString, args, role);
                            var doneFunc = function (result) {
                                this.map[key] = result;
                                deferred.resolve(result);
                            }.bind(this);
                            var failFunc = function (jqXHR, textStatus, errorThrown) {
                                deferred.reject.apply(null);
                                PlatformConsole.log('StateDivisionLookup: Error occurred while making request' + errorThrown);
                            };
                            ReiSys.Utilities.Util.MakeAjaxRequest(url, null, 'GET').done(doneFunc).fail(failFunc);
                        }
                        return deferred.promise();
                    };
                    UserRoleTeamSelectorController.prototype.generateUrl = function (url, args, role) {
                        var values = {
                            assignmentMode: args.Mode,
                            roleId: role.RoleId,
                            officeId: (args.Mode === AssignmentModes.OfficeRoleUsers) ? args.OfficeId : null,
                            processDetailCode: args.ProcessDetailCode,
                            enterprizeProcessCode: args.EnterprizeProcessCode,
                            resourceValue: args.DefaultResourceValue,
                            resourceTypeCode: args.DefaultResourceTypeCode
                        };
                        for (var key in values) {
                            var val = values[key];
                            if (val !== undefined && val !== null) {
                                url += key + '=' + val + '&';
                            }
                        }
                        return url.slice(0, -1);
                    };
                    UserRoleTeamSelectorController.prototype.SelectedValue = function () {
                        return this.model.selectedValue();
                    };
                    UserRoleTeamSelectorController.prototype.SetMode = function (mode) {
                        this.args.Mode = mode;
                        this.model.roleViewModel.selectedRole(this.model.roleViewModel.selectedRole());
                    };
                    UserRoleTeamSelectorController.containerDivId = 'containerDivId';
                    UserRoleTeamSelectorController.userControlId = 'userControlId';
                    UserRoleTeamSelectorController.hdnSelectedValue = 'hdnSelectedValue';
                    UserRoleTeamSelectorController.txtTeam = 'txtTeam';
                    UserRoleTeamSelectorController.txtUser = 'txtUser';
                    return UserRoleTeamSelectorController;
                }(ReiSys.Platform.Controller.BaseComponentController));
                Assignment.UserRoleTeamSelectorController = UserRoleTeamSelectorController;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
