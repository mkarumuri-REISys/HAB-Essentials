var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            var Assignment;
            (function (Assignment) {
                //The main Viewmodel for the controller
                var UserRoleTeamSelectorViewModel = (function () {
                    function UserRoleTeamSelectorViewModel(args, teamFieldId, userFieldId) {
                        this.userCache = {};
                        this.roleViewModel = new Assignment.RoleSelectorViewModel(args);
                        this.teamViewModel = new Assignment.TeamSelectorViewModel(teamFieldId, args);
                        this.userViewModel = new Assignment.UserSelectorViewModel(userFieldId, args);
                        this.defaultValues = new Assignment.DefaultSelectorValues(args);
                        this.selectedValue = ko.computed(this.selectedValueHandler, this).extend({ throttle: 50 });
                        this.teamViewModel.selectedTeam.subscribe(this.teamChangeHandler, this);
                    }
                    UserRoleTeamSelectorViewModel.prototype.selectedValueHandler = function () {
                        return {
                            Role: this.roleViewModel.selectedValue(),
                            Team: this.teamViewModel.selectedValue(),
                            User: this.userViewModel.selectedValue()
                        };
                    };
                    UserRoleTeamSelectorViewModel.prototype.setRoleRelatedData = function (roleRelated, values) {
                        values = values || new Assignment.DefaultSelectorValues(null);
                        values.withDefaultAssignment(roleRelated.DefaultAssignment);
                        var sRole = this.roleViewModel.selectedRole();
                        if (!sRole || sRole.RoleId !== roleRelated.RoleId) {
                            var role = ko.utils.arrayFirst(this.roleViewModel.roles, function (r) { return r.RoleId === roleRelated.RoleId; });
                            if (role) {
                                this.roleViewModel.selectedRole(role);
                            }
                        }
                        var cache = this.getUserCache(roleRelated);
                        this.userCache = cache.userCache;
                        this.teamViewModel.setModelData(values.teamId, cache.teams);
                        var team = this.teamViewModel.selectedTeam() || { TeamId: '-1' };
                        var users = this.userCache[team.TeamId];
                        this.userViewModel.setModelData(values.userId, users);
                    };
                    UserRoleTeamSelectorViewModel.prototype.getUserCache = function (roleRelated) {
                        var _this = this;
                        var userCache = {};
                        var unassigned = { UserId: '-1', FullName: 'Team Unassigned Pool', RequiresBackup: false };
                        var teams = roleRelated.BureauTeams.map(function (t) {
                            var userList = t.TeamUsers.map(_this.mapUserModel).sort(_this.compareUsers);
                            userList.unshift(unassigned);
                            userCache[t.TeamId] = userList;
                            return { TeamId: t.TeamId, TeamName: t.TeamName };
                        }).sort(this.compareTeams);
                        //entry for bureau level users
                        userCache['-1'] = roleRelated.BureauUsers.map(this.mapUserModel).sort(this.compareUsers);
                        return {
                            teams: teams,
                            userCache: userCache
                        };
                    };
                    UserRoleTeamSelectorViewModel.prototype.compareUsers = function (a, b) {
                        var first = (a.FullName || '').toLowerCase();
                        var second = (b.FullName || '').toLowerCase();
                        if (first < second)
                            return -1;
                        if (first > second)
                            return 1;
                        return 0;
                    };
                    UserRoleTeamSelectorViewModel.prototype.compareTeams = function (a, b) {
                        var first = (a.TeamName || '').toLowerCase();
                        var second = (b.TeamName || '').toLowerCase();
                        if (first < second)
                            return -1;
                        if (first > second)
                            return 1;
                        return 0;
                    };
                    UserRoleTeamSelectorViewModel.prototype.mapUserModel = function (result) {
                        var model = {
                            UserId: result.UserId,
                            FullName: result.FullName,
                            RequiresBackup: result.RequiresBackup,
                            BackupTeamId: result.BackupTeamId,
                            BackupUserId: result.BackupUserId,
                            BackupTeamName: result.BackupTeamName,
                            BackupUserFullName: result.BackupUserFullName
                        };
                        if (model.RequiresBackup) {
                            model.FullName += ' *';
                        }
                        return model;
                    };
                    UserRoleTeamSelectorViewModel.prototype.teamChangeHandler = function (team) {
                        var selectedRole = this.roleViewModel.selectedValue();
                        if (selectedRole) {
                            var userList;
                            var userId = null;
                            var selectedUser = this.userViewModel.selectedValue();
                            if (team) {
                                userList = this.userCache[team.TeamId];
                            }
                            else {
                                userList = this.userCache['-1'];
                                if (selectedUser) {
                                    userId = selectedUser.UserId;
                                }
                            }
                            userList = userList || [];
                            this.userViewModel.availableUsers(userList);
                            selectedUser = this.userViewModel.getDefaultUser(userId);
                            this.userViewModel.selectedUser(selectedUser);
                        }
                    };
                    UserRoleTeamSelectorViewModel.prototype.showTeamProfilePopup = function () {
                        var url = this.teamViewModel.getTeamProfileUrl();
                        if (!url)
                            return false;
                        OpenPopupWithMenuBar(url, '600', '980', 'PopUp');
                    };
                    return UserRoleTeamSelectorViewModel;
                }());
                Assignment.UserRoleTeamSelectorViewModel = UserRoleTeamSelectorViewModel;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
