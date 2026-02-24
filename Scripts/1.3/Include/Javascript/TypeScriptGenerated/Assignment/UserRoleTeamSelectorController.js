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
                var AssignmentModes;
                (function (AssignmentModes) {
                    AssignmentModes[AssignmentModes["DirectOrIndirect"] = 1] = "DirectOrIndirect";
                    AssignmentModes[AssignmentModes["OfficeRoleUsers"] = 2] = "OfficeRoleUsers";
                    AssignmentModes[AssignmentModes["RoleUsers"] = 3] = "RoleUsers";
                })(AssignmentModes || (AssignmentModes = {}));
                var UserRoleTeamSelectorViewModel = (function () {
                    function UserRoleTeamSelectorViewModel(roles, teamProfileUrl, postBackData, preSelectedTeamId, preSelectedUserId) {
                        this.postBackData = postBackData;
                        this.preSelectedTeamId = preSelectedTeamId;
                        this.preSelectedUserId = preSelectedUserId;
                        this.teamProfileUrl = null;
                        this.UserCache = {};
                        this.Roles = roles; //todo: clone?
                        this.SelectedRole = ko.observable(null);
                        this.AvailableTeams = ko.observableArray([]);
                        this.SelectedTeam = ko.observable(null);
                        this.AvailableUsers = ko.observableArray([]);
                        this.SelectedUser = ko.observable(null);
                        this.IsTeamSelected = ko.computed(function () {
                            var selectedTeam = this.SelectedTeam();
                            if (selectedTeam !== null && selectedTeam.TeamId !== '-1') {
                                return true;
                            }
                            return false;
                        }, this);
                        var self = this;
                        this.SelectedValue = ko.computed(function () {
                            var selectedRole = self.SelectedRole();
                            var selectedUser = self.SelectedUser();
                            var selectedTeam = self.SelectedTeam();
                            if (selectedTeam !== null && selectedTeam.TeamId === '-1')
                                selectedTeam = null;
                            if (selectedUser !== null && selectedUser.UserId === '-1')
                                selectedUser = null;
                            return { Role: selectedRole, Team: selectedTeam, User: selectedUser };
                        }, this).extend({ throttle: 50 });
                        if (!teamProfileUrl) {
                            this.teamProfileUrl = null;
                        }
                        else {
                            this.teamProfileUrl = teamProfileUrl + '?TeamId=';
                        }
                    }
                    UserRoleTeamSelectorViewModel.prototype.OnRoleChanged = function (sender, args) {
                    };
                    UserRoleTeamSelectorViewModel.prototype.SetRoleRelatedData = function (roleRelated) {
                        this.UserCache = {};
                        var userCache = this.UserCache;
                        var self = this;
                        var teams = roleRelated.BureauTeams.map(function (t) {
                            var userList = t.TeamUsers.map(function (u) {
                                return self.MapToUserModel(u);
                            });
                            userList.unshift({ UserId: '-1', FullName: 'Team Unassigned Pool', RequiresBackup: false });
                            userCache[t.TeamId] = userList;
                            return { TeamId: t.TeamId, TeamName: t.TeamName };
                        });
                        //entry for bureau level users
                        userCache['-1'] = roleRelated.BureauUsers.map(function (u) {
                            return self.MapToUserModel(u);
                        });
                        //add empty entry
                        teams.unshift({ TeamId: '-1', TeamName: 'No Team Selected' });
                        this.AvailableTeams(teams);
                        var defaultTeam = this.GetDefaultTeam(roleRelated.DefaultAssignment, teams);
                        var availableUserList = userCache[defaultTeam.TeamId];
                        this.AvailableUsers(availableUserList);
                        var defaultUser = this.GetDefaultUser(roleRelated.DefaultAssignment, availableUserList);
                        this.SelectedTeam(defaultTeam);
                        this.SelectedUser(defaultUser);
                        //postbackdata must only be used once
                        this.postBackData = null;
                        this.preSelectedTeamId = null;
                        this.preSelectedUserId = null;
                    };
                    UserRoleTeamSelectorViewModel.prototype.MapToUserModel = function (u) {
                        var model = {
                            UserId: u.UserId,
                            FullName: u.FullName,
                            RequiresBackup: u.RequiresBackup,
                            BackupTeamId: u.BackupTeamId,
                            BackupUserId: u.BackupUserId,
                            BackupTeamName: u.BackupTeamName,
                            BackupUserFullName: u.BackupUserFullName,
                        };
                        if (model.RequiresBackup)
                            model.FullName += ' *';
                        return model;
                    };
                    UserRoleTeamSelectorViewModel.prototype.OnTeamChanged = function (sender, args) {
                        var selectedTeam = this.SelectedTeam();
                        var selectedUser = null;
                        var userList = this.UserCache[selectedTeam.TeamId];
                        if (userList === undefined || userList === null)
                            userList = [];
                        if (selectedTeam.TeamId !== '-1') {
                            selectedUser = userList[0];
                        }
                        this.AvailableUsers(userList);
                        this.SelectedUser(selectedUser);
                    };
                    UserRoleTeamSelectorViewModel.prototype.ShowTeamProfilePopup = function () {
                        var selectedTeam = this.SelectedTeam();
                        if (this.teamProfileUrl === null
                            || selectedTeam === null
                            || selectedTeam.TeamId === '-1')
                            return false;
                        var url = this.teamProfileUrl + selectedTeam.TeamId;
                        OpenPopupWithMenuBar(url, '600', '980', 'PopUp');
                    };
                    UserRoleTeamSelectorViewModel.prototype.GetDefaultTeam = function (defaultAssignment, teams) {
                        var defaultTeamId = null, defaultTeam = null;
                        if (this.postBackData !== null) {
                            if (this.postBackData.Team !== null) {
                                defaultTeamId = this.postBackData.Team.TeamId;
                            }
                        }
                        else if (this.preSelectedTeamId !== null) {
                            defaultTeamId = this.preSelectedTeamId;
                            //only use the preselection once
                            this.preSelectedTeamId = null;
                        }
                        else if (defaultAssignment !== null
                            && defaultAssignment.TeamId !== null) {
                            defaultTeamId = defaultAssignment.TeamId;
                        }
                        if (defaultTeamId !== null) {
                            defaultTeam = ko.utils.arrayFirst(teams, function (team) {
                                return team.TeamId === defaultTeamId;
                            });
                        }
                        if (defaultTeam === null) {
                            defaultTeam = teams[0];
                        }
                        return defaultTeam;
                    };
                    UserRoleTeamSelectorViewModel.prototype.GetDefaultUser = function (defaultAssignment, users) {
                        var defaultUserId = null, defaultUser = null;
                        if (this.postBackData !== null) {
                            if (this.postBackData.User !== null) {
                                defaultUserId = this.postBackData.User.UserId;
                            }
                        }
                        else if (this.preSelectedUserId !== null) {
                            defaultUserId = this.preSelectedUserId;
                            //only use the preselection once
                            this.preSelectedUserId = null;
                        }
                        else if (defaultAssignment !== null
                            && defaultAssignment.UserId !== null) {
                            defaultUserId = defaultAssignment.UserId;
                        }
                        if (defaultUserId !== null) {
                            defaultUser = ko.utils.arrayFirst(users, function (user) {
                                return user.UserId === defaultUserId;
                            });
                        }
                        if (defaultUser === null
                            && users.length > 0
                            && users[0].UserId === '-1') {
                            defaultUser = users[0];
                        }
                        return defaultUser;
                    };
                    return UserRoleTeamSelectorViewModel;
                }());
                var UserRoleTeamSelectorController = (function (_super) {
                    __extends(UserRoleTeamSelectorController, _super);
                    function UserRoleTeamSelectorController(args, clientIds) {
                        _super.call(this);
                        this.args = args;
                        this.model = null;
                        this.map = {};
                        _super.prototype.RegisterClientIds.call(this, clientIds);
                        this.RegisterController(this.FindClientId(UserRoleTeamSelectorController.userControlId));
                        this.model = new UserRoleTeamSelectorViewModel(this.args.Roles, this.args.TeamProfileUrl, args.PostBackData, args.PreSelectedTeamId, args.PreSelectedUserId);
                        var self = this;
                        this.model.SelectedRole.subscribe(function (role) {
                            self.loadRoleData(self.args.Mode, role.RoleId, self.args.OfficeId, self.args.ProcessDetailCode, self.args.EnterprizeProcessCode, self.args.DefaultResourceValue, self.args.DefaultResourceTypeCode)
                                .done(function (result) {
                                self.model.SetRoleRelatedData(result);
                            }).fail(function () {
                                REISys.Platform.Layout.ErrorMessages.addMessages('An unkown error has occured when trying to fetch user information');
                                REISys.Platform.Layout.ErrorMessages.setVisible(true);
                            });
                        }.bind(this));
                        this.model.SelectedValue.subscribe(function (value) {
                            var json = JSON.stringify(value);
                            var hdnSelectedValue = document.getElementById(this.FindClientId(UserRoleTeamSelectorController.hdnSelectedValue));
                            hdnSelectedValue.value = json;
                        }.bind(this));
                        this.setInitiallySelectedRole(this.args.PostBackData, this.args.PreSelectedRoleId);
                        ko.applyBindings(this.model, document.getElementById(this.FindClientId(UserRoleTeamSelectorController.containerDivId)));
                    }
                    UserRoleTeamSelectorController.prototype.setInitiallySelectedRole = function (postBackData, initRoleId) {
                        var currentRole = null;
                        if (this.model.Roles.length === 1) {
                            currentRole = this.model.Roles[0];
                        }
                        else {
                            var applicableRoleId = null;
                            if (postBackData !== null && postBackData.Role !== null) {
                                applicableRoleId = postBackData.Role.RoleId;
                            }
                            else {
                                applicableRoleId = initRoleId;
                            }
                            if (applicableRoleId !== null) {
                                currentRole = ko.utils.arrayFirst(this.model.Roles, function (role) {
                                    return role.RoleId === applicableRoleId;
                                });
                            }
                        }
                        if (currentRole !== null) {
                            this.model.SelectedRole(currentRole);
                        }
                    };
                    UserRoleTeamSelectorController.prototype.loadRoleData = function (mode, roleId, officeId, processDetailCode, enterprizeProcessCode, resourceValue, resourceTypeCode) {
                        var deferred = $.Deferred();
                        var key = mode + '_' + roleId + '_' + officeId;
                        if (this.map[key] !== undefined) {
                            deferred.resolve(this.map[key]);
                            return deferred.promise();
                        }
                        var args = {
                            assignmentMode: mode,
                            roleId: roleId,
                            officeId: null,
                            processDetailCode: processDetailCode,
                            enterprizeProcessCode: enterprizeProcessCode,
                            resourceValue: resourceValue,
                            resourceTypeCode: resourceTypeCode
                        };
                        if (mode === AssignmentModes.OfficeRoleUsers) {
                            args.officeId = officeId;
                        }
                        var serviceUrl = this.generateUrl(REISys.Platform.WebsiteUrl + '/api/Assignment/GetRoleAssignees?', args);
                        var self = this;
                        ReiSys.Utilities.Util.MakeAjaxRequest(serviceUrl, null, 'GET').done(function (result) {
                            self.map[key] = result;
                            deferred.resolve(result);
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            deferred.reject.apply(null);
                            PlatformConsole.log('StateDivisionLookup: Error occurred while making request' + errorThrown);
                        });
                        return deferred.promise();
                    };
                    UserRoleTeamSelectorController.prototype.generateUrl = function (url, args) {
                        for (var key in args) {
                            var val = args[key];
                            if (this.IsValid(val)) {
                                url += key + '=' + val + '&';
                            }
                        }
                        return url.slice(0, -1);
                    };
                    UserRoleTeamSelectorController.prototype.IsValid = function (obj) {
                        return obj !== undefined && obj !== null;
                    };
                    UserRoleTeamSelectorController.prototype.SelectedValue = function () {
                        return this.model.SelectedValue();
                    };
                    UserRoleTeamSelectorController.prototype.SetMode = function (mode) {
                        this.args.Mode = mode;
                        this.model.SelectedRole(this.model.SelectedRole());
                    };
                    UserRoleTeamSelectorController.containerDivId = 'containerDivId';
                    UserRoleTeamSelectorController.userControlId = 'userControlId';
                    UserRoleTeamSelectorController.hdnSelectedValue = 'hdnSelectedValue';
                    return UserRoleTeamSelectorController;
                }(ReiSys.Platform.Controller.BaseComponentController));
                Assignment.UserRoleTeamSelectorController = UserRoleTeamSelectorController;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
