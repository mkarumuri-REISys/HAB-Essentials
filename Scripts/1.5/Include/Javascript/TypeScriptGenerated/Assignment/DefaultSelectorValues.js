var REISys;
(function (REISys) {
    var Platform;
    (function (Platform) {
        var Controller;
        (function (Controller) {
            var Assignment;
            (function (Assignment) {
                //The default selections for the page, passed on postback data, preselections, and default values.
                //Encapsulates it here to keep it from being scatter-shot across the controller
                var DefaultSelectorValues = (function () {
                    function DefaultSelectorValues(args) {
                        var _this = this;
                        this.roleId = null;
                        this.teamId = null;
                        this.userId = null;
                        this.withDefaultAssignment = function (assignment) {
                            if (assignment) {
                                _this.teamId = _this.teamId || assignment.TeamId;
                                _this.userId = _this.userId || assignment.UserId;
                            }
                        };
                        var values = this.getArgsValues(args);
                        this.roleId = values.roleId;
                        this.teamId = values.teamId;
                        this.userId = values.userId;
                    }
                    DefaultSelectorValues.prototype.getArgsValues = function (args) {
                        var result = {
                            roleId: null,
                            teamId: null,
                            userId: null
                        };
                        if (!args)
                            return result;
                        if (args.PostBackData) {
                            if (args.PostBackData.Role) {
                                result.roleId = args.PostBackData.Role.RoleId;
                            }
                            if (args.PostBackData.Team) {
                                result.teamId = args.PostBackData.Team.TeamId;
                            }
                            if (args.PostBackData.User) {
                                result.userId = args.PostBackData.User.UserId;
                            }
                        }
                        else {
                            if (args.PreSelectedRoleId) {
                                result.roleId = args.PreSelectedRoleId;
                            }
                            if (args.PreSelectedTeamId) {
                                result.teamId = args.PreSelectedTeamId;
                            }
                            if (args.PreSelectedUserId) {
                                result.userId = args.PreSelectedUserId;
                            }
                        }
                        if (args.Roles.length === 1) {
                            result.roleId = args.Roles[0].RoleId;
                        }
                        return result;
                    };
                    return DefaultSelectorValues;
                }());
                Assignment.DefaultSelectorValues = DefaultSelectorValues;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
