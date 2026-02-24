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
                //The Viewmodel for the team dropdown
                var TeamSelectorViewModel = (function (_super) {
                    __extends(TeamSelectorViewModel, _super);
                    function TeamSelectorViewModel(textFieldId, args) {
                        var _this = this;
                        _super.call(this, textFieldId);
                        this.teamProfileUrl = null;
                        this.getTeamProfileUrl = function () {
                            if (!_this.teamProfileUrl)
                                return null;
                            var selected = _this.selectedValue();
                            if (!selected)
                                return null;
                            return _this.teamProfileUrl + selected.TeamId;
                        };
                        this.setModelData = function (teamId, teams) {
                            _this.availableTeams(teams);
                            var defaultTeam = _this.getDefaultTeam(teamId);
                            _this.selectedTeam(defaultTeam);
                        };
                        this.availableTeams = this.availableItems;
                        this.selectedValue = this.selectedTeam = this.selectedItem;
                        this.isTeamSelected = ko.computed(function () { return !!_this.selectedValue; }, this);
                        if (args.TeamProfileUrl) {
                            this.teamProfileUrl = args.TeamProfileUrl + '?TeamId=';
                        }
                    }
                    TeamSelectorViewModel.prototype.mapItem = function (team) {
                        return {
                            label: team.TeamName,
                            value: team.TeamName,
                            model: team
                        };
                    };
                    TeamSelectorViewModel.prototype.getLabel = function (item) {
                        if (item) {
                            return item.TeamName;
                        }
                        else {
                            return '';
                        }
                    };
                    TeamSelectorViewModel.prototype.getDefaultTeam = function (teamId) {
                        if (teamId) {
                            var teams = this.availableTeams();
                            var defaultTeam = ko.utils.arrayFirst(teams, function (team) { return team.TeamId === teamId; });
                            return defaultTeam || null;
                        }
                        return null;
                    };
                    return TeamSelectorViewModel;
                }(Assignment.UserRoleTeamSelectorAutocomplete));
                Assignment.TeamSelectorViewModel = TeamSelectorViewModel;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
