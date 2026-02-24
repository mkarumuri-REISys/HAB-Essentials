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
            var UserRoleTeamModel = (function () {
                function UserRoleTeamModel(model) {
                    this.Mode = model.Mode;
                    this.OfficeId = model.OfficeId;
                    this.DefaultResourceValue = model.DefaultResourceValue;
                    this.DefaultResourceTypeCode = model.DefaultResourceTypeCode;
                    this.IsGetDetails = model.IsGetDetails;
                    this.IsBackup = model.IsBackup;
                    this.IsPostback = model.IsPostback;
                    this.IsclientSide = model.IsclientSide;
                    this.TeamsOnly = model.TeamsOnly;
                    this.TeamUserId = model.TeamUserId;
                    this.ProcessDetailCode = model.ProcessDetailCode;
                    this.RoleItems = model.RoleItems;
                    this.RoleIdValueSubmittedOnPostback = model.RoleIdValueSubmittedOnPostback;
                    this.TeamOrUserValueSubmittedOnPostback = model.TeamOrUserValueSubmittedOnPostback;
                    this.PreSelectedRoleId = model.PreSelectedRoleId;
                    this.ShowRefreshButton = model.ShowRefreshButton;
                    this.DisableValidation = model.DisableValidation;
                    this.HideControlForTeamsOnly = model.HideControlForTeamsOnly;
                    this.AssignmentUsers = model.AssignmentUsers;
                    this.Roles = model.Roles;
                    this.EnterprizeProcessCode = model.EnterprizeProcessCode;
                }
                return UserRoleTeamModel;
            }());
            Controller.UserRoleTeamModel = UserRoleTeamModel;
            var RoleItems = (function () {
                function RoleItems(LookupCode, DisplayValue) {
                    this.LookupCode = LookupCode;
                    this.DisplayValue = DisplayValue;
                }
                return RoleItems;
            }());
            Controller.RoleItems = RoleItems;
            var Teams = (function () {
                function Teams(TeamId, TeamName, Users) {
                    this.TeamId = TeamId;
                    this.TeamName = TeamName;
                    this.Users = Users;
                }
                return Teams;
            }());
            Controller.Teams = Teams;
            var User = (function () {
                function User() {
                }
                return User;
            }());
            Controller.User = User;
            var MultiTeamUserController = (function (_super) {
                __extends(MultiTeamUserController, _super);
                function MultiTeamUserController(Model, clientIds, controlClientId) {
                    _super.call(this);
                    this.ControlClientId = controlClientId;
                    this.RegisterController(this.ControlClientId);
                    this.RegisterClientIds(clientIds);
                    this.Model = new UserRoleTeamModel(Model);
                    if (this.Model.IsclientSide) {
                        if (this.Model.TeamsOnly) {
                            this.HideAllControlsExceptTeamsDropDown();
                            this.FillTeamsModel().done(function () {
                                if (this.Model.HideControlForTeamsOnly && this.Model.AssignmentUsers.Teams.length == 1) {
                                    this.SetVisibilitForUserDropDown(false);
                                }
                                else {
                                    this.SetTeamsDropDown();
                                }
                            }.bind(this)).fail(function () { });
                        }
                        else {
                            this.FillRoleItemModel().done(function () {
                                this.SetRolesDropDown();
                                this.FillTeamsModel().done(function () {
                                    if (this.Model.HideControlForTeamsOnly && this.Model.AssignmentUsers.Teams.length == 1) {
                                        this.SetVisibilitForUserDropDown(false);
                                    }
                                    else {
                                        this.SetTeamsDropDown();
                                    }
                                }.bind(this)).fail(function () {
                                });
                            }.bind(this)).fail(function () {
                            });
                        }
                    }
                    else {
                        if (this.Model.TeamsOnly) {
                            this.HideAllControlsExceptTeamsDropDown();
                            if (this.Model.HideControlForTeamsOnly && this.Model.AssignmentUsers.Teams.length == 1) {
                                this.SetVisibilitForUserDropDown(false);
                            }
                            else {
                                this.SetTeamsDropDown();
                            }
                        }
                        else {
                            this.SetRolesDropDown();
                            this.SetTeamsDropDown();
                        }
                    }
                    if (this.Model.ShowRefreshButton) {
                        this.ShowRefreshButton(true);
                    }
                }
                Object.defineProperty(MultiTeamUserController.prototype, "Mode", {
                    set: function (value) {
                        this.Model.Mode = value;
                        this.serilializeModel();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(MultiTeamUserController.prototype, "SerializeData", {
                    set: function (value) {
                        if (value == true) {
                            this.serilializeModel();
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                MultiTeamUserController.prototype.serilializeModel = function () {
                    var hiddenModel = this.FindClientId('hiddenModel');
                    $("#" + hiddenModel).val(JSON.stringify(this.Model));
                };
                MultiTeamUserController.prototype.SetRolesDropDown = function () {
                    var roleItems = this.Model.RoleItems;
                    if (roleItems.length == 1) {
                        this.SetVisibilitForRoleDropDown(false);
                        this.HideOrShowRoleNameAndLabel(true, roleItems[0].DisplayValue);
                        this.ShowRefreshButton(false);
                    }
                    else {
                        this.HideOrShowRoleNameAndLabel(false, "");
                        this.SetVisibilitForRoleDropDown(true);
                        this.ShowRefreshButton(true);
                        var roleDropDownId = this.FindClientId('roleDropDown');
                        var roleDropDown = $find(roleDropDownId);
                        var items = roleDropDown.get_items();
                        roleDropDown.trackChanges();
                        roleDropDown.clearItems();
                        roleDropDown.clearSelection();
                        var selectusercombo = new Telerik.Web.UI.RadComboBoxItem();
                        selectusercombo.set_text("Select a Role");
                        selectusercombo.set_value("-1");
                        selectusercombo.set_clientTemplate("<b> #= Text #</b>");
                        selectusercombo.bindTemplate();
                        items.add(selectusercombo);
                        var defaultroleExists = false;
                        for (var i = 0; i < roleItems.length; i++) {
                            var selectusercombo = new Telerik.Web.UI.RadComboBoxItem();
                            selectusercombo.set_text(roleItems[i].DisplayValue);
                            selectusercombo.set_value(roleItems[i].LookupCode);
                            items.add(selectusercombo);
                            if (roleItems[i].LookupCode == this.Model.PreSelectedRoleId) {
                                defaultroleExists = true;
                            }
                        }
                        roleDropDown.commitChanges();
                        if (this.Model.IsPostback) {
                            this.setselectedRoleBeforePostback();
                        }
                        else {
                            if (defaultroleExists) {
                                this.preSelectRoleForRolesDropDown();
                            }
                        }
                    }
                };
                MultiTeamUserController.prototype.SetTeamsDropDown = function () {
                    var teamsDDClientID = this.FindClientId('teamsDD');
                    var teamsDD = $find(teamsDDClientID);
                    var items = teamsDD.get_items();
                    teamsDD.trackChanges();
                    teamsDD.clearItems();
                    teamsDD.clearSelection();
                    if (this.Model.Mode == 1 && !this.Model.TeamsOnly) {
                        var selectusercombo = new Telerik.Web.UI.RadComboBoxItem();
                        selectusercombo.set_text(this.Model.AssignmentUsers.DefaultUserName);
                        selectusercombo.set_value(this.Model.AssignmentUsers.DefaultUserValue);
                        items.add(selectusercombo);
                        selectusercombo.select();
                        teamsDD.commitChanges();
                    }
                    else {
                        if (this.Model.Mode > 1 || (this.Model.TeamsOnly && this.Model.AssignmentUsers.Teams.length > 1)) {
                            var selectusercombo = new Telerik.Web.UI.RadComboBoxItem();
                            if (this.Model.TeamsOnly) {
                                selectusercombo.set_text("Select a Team");
                            }
                            else {
                                selectusercombo.set_text("Select a User/ Team");
                            }
                            selectusercombo.set_value("-1");
                            selectusercombo.set_clientTemplate("<b> #= Text #</b>");
                            selectusercombo.bindTemplate();
                            items.add(selectusercombo);
                        }
                        if ((!this.Model.TeamsOnly) && this.Model.AssignmentUsers.Teams.length > 0) {
                            var comboItem = new Telerik.Web.UI.RadComboBoxItem();
                            comboItem.set_text("Assign to Team (Team Unassigned Tasks)");
                            comboItem.set_value("-2");
                            comboItem.set_isSeparator(true);
                            comboItem.set_clientTemplate("<b> #= Text #</b>");
                            comboItem.bindTemplate();
                            items.add(comboItem);
                        }
                        for (var i = 0; i < this.Model.AssignmentUsers.Teams.length; i++) {
                            var comboItemTeams = new Telerik.Web.UI.RadComboBoxItem();
                            comboItemTeams.set_text(this.Model.AssignmentUsers.Teams[i].TeamName);
                            comboItemTeams.set_value(this.Model.AssignmentUsers.Teams[i].TeamId);
                            items.add(comboItemTeams);
                        }
                        if (!this.Model.TeamsOnly) {
                            if (this.Model.AssignmentUsers.UsersWithTeams.length > 0) {
                                var comboItem = new Telerik.Web.UI.RadComboBoxItem();
                                comboItem.set_text("Assign to Individual within a Team");
                                comboItem.set_value("-3");
                                comboItem.set_isSeparator(true);
                                comboItem.set_clientTemplate("<b> #= Text #</b>");
                                comboItem.bindTemplate();
                                items.add(comboItem);
                            }
                            for (var i = 0; i < this.Model.AssignmentUsers.UsersWithTeams.length; i++) {
                                var comboItemUsersWithTeams = new Telerik.Web.UI.RadComboBoxItem();
                                comboItemUsersWithTeams.set_text(this.Model.AssignmentUsers.UsersWithTeams[i].UserName);
                                comboItemUsersWithTeams.set_value(this.Model.AssignmentUsers.UsersWithTeams[i].UserId);
                                items.add(comboItemUsersWithTeams);
                            }
                            if (this.Model.AssignmentUsers.AllUsers.length > 0) {
                                var comboItem = new Telerik.Web.UI.RadComboBoxItem();
                                comboItem.set_text("Assign to Individual outside a Team");
                                comboItem.set_value("-4");
                                comboItem.set_isSeparator(true);
                                comboItem.set_clientTemplate("<b> #= Text #</b>");
                                comboItem.bindTemplate();
                                items.add(comboItem);
                            }
                            for (var i = 0; i < this.Model.AssignmentUsers.AllUsers.length; i++) {
                                var comboItemAllUsers = new Telerik.Web.UI.RadComboBoxItem();
                                comboItemAllUsers.set_text(this.Model.AssignmentUsers.AllUsers[i].UserName);
                                comboItemAllUsers.set_value(this.Model.AssignmentUsers.AllUsers[i].UserId);
                                items.add(comboItemAllUsers);
                            }
                        }
                        teamsDD.commitChanges();
                        if (this.Model.AssignmentUsers.DefaultUserValue != null && this.Model.AssignmentUsers.DefaultUserValue != "") {
                            var item = teamsDD.findItemByValue(this.Model.AssignmentUsers.DefaultUserValue);
                            if (item != null && item != undefined) {
                                item.set_text(this.Model.AssignmentUsers.DefaultUserName);
                                item.select();
                            }
                        }
                        else {
                            var selectedtextcombo = items.getItem(0);
                            selectedtextcombo.select();
                        }
                        if (this.Model.IsPostback) {
                            this.setselectedUserOrTeamBeforePostback();
                        }
                        teamsDD.commitChanges();
                    }
                };
                MultiTeamUserController.prototype.CheckIfValueIsNullOrEmptyGuid = function (temp) {
                    if (temp == "00000000-0000-0000-0000-000000000000" || temp == "")
                        return false;
                    else
                        return true;
                };
                MultiTeamUserController.prototype.SetVisibilitForRoleDropDown = function (show) {
                    var roleDropDownId = this.FindClientId('roleDropDown');
                    if (show) {
                        $find(roleDropDownId).clearItems();
                        $find(roleDropDownId).set_visible(true);
                    }
                    else {
                        $find(roleDropDownId).set_visible(false);
                    }
                };
                MultiTeamUserController.prototype.SetVisibilitForUserDropDown = function (show) {
                    var teamsDD = this.FindClientId('teamsDD');
                    if (show) {
                        $find(teamsDD).clearItems();
                        $find(teamsDD).set_visible(true);
                    }
                    else
                        $find(teamsDD).set_visible(false);
                };
                MultiTeamUserController.prototype.setErrorMessage = function (message) {
                    REISys.Platform.Layout.ErrorMessages.addMessages(message);
                    REISys.Platform.Layout.ErrorMessages.setVisible(true);
                };
                MultiTeamUserController.prototype.clearErrorMessages = function () {
                    REISys.Platform.Layout.ErrorMessages.removeAllMessages();
                    REISys.Platform.Layout.ErrorMessages.setVisible(false);
                };
                MultiTeamUserController.prototype.setselectedUserOrTeamBeforePostback = function () {
                    if (this.Model.TeamOrUserValueSubmittedOnPostback != "") {
                        var self = REISys.Platform.Controller.MultiTeamUserController.FindController(this.ControlClientId);
                        var userdropdownId = self.FindClientId('teamsDD');
                        var teamsDD = $find(userdropdownId);
                        var items = teamsDD.get_items();
                        for (var i = 0; i < items.get_count(); i++) {
                            var comboItem = new Telerik.Web.UI.RadComboBoxItem();
                            comboItem = items.getItem(i);
                            if (comboItem.get_value() == this.Model.TeamOrUserValueSubmittedOnPostback) {
                                comboItem.select();
                            }
                        }
                    }
                };
                MultiTeamUserController.prototype.setselectedRoleBeforePostback = function () {
                    if (this.Model.RoleIdValueSubmittedOnPostback != "") {
                        var self = REISys.Platform.Controller.MultiTeamUserController.FindController(this.ControlClientId);
                        var roleDropDownId = self.FindClientId('roleDropDown');
                        var roleDropDown = $find(roleDropDownId);
                        var item = roleDropDown.findItemByValue(this.Model.RoleIdValueSubmittedOnPostback);
                        if (item != null && item != undefined) {
                            item.select();
                        }
                    }
                };
                MultiTeamUserController.prototype.preSelectRoleForRolesDropDown = function () {
                    var self = REISys.Platform.Controller.MultiTeamUserController.FindController(this.ControlClientId);
                    var roleDropDownId = self.FindClientId('roleDropDown');
                    var roleDropDown = $find(roleDropDownId);
                    var item = roleDropDown.findItemByValue(this.Model.PreSelectedRoleId);
                    if (item != null && item != undefined) {
                        item.select();
                    }
                };
                MultiTeamUserController.prototype.HideOrShowRoleNameAndLabel = function (show, roleLabelText) {
                    var roleLabelHeader = this.FindClientId('roleLabelHeader');
                    var roleLabel = this.FindClientId('rolelabel');
                    if (show) {
                        $('#' + roleLabelHeader).html("Role : ");
                        $('#' + roleLabel).html(roleLabelText);
                    }
                    else {
                        $('#' + roleLabelHeader).html("");
                        $('#' + roleLabel).html("");
                    }
                };
                MultiTeamUserController.prototype.ShowRefreshButton = function (show) {
                    var refreshBtn = this.FindClientId('refreshBtn');
                    if (show) {
                        $('#' + refreshBtn).show();
                    }
                    else {
                        $('#' + refreshBtn).hide();
                    }
                };
                MultiTeamUserController.prototype.HideAllControlsExceptTeamsDropDown = function () {
                    this.HideOrShowRoleNameAndLabel(false, "");
                    this.SetVisibilitForRoleDropDown(false);
                    this.ShowRefreshButton(false);
                };
                MultiTeamUserController.prototype.RegisterClientIds = function (clientIds) {
                    var _this = this;
                    _super.prototype.RegisterClientIds.call(this, clientIds);
                    var refreshBtn = this.FindClientId('refreshBtn');
                    $('#' + refreshBtn).click(function (e) { _this.UpdateUSers(); return false; });
                };
                MultiTeamUserController.prototype.UpdateUSers = function () {
                    this.Model.RoleIdValueSubmittedOnPostback = "";
                    this.Model.TeamOrUserValueSubmittedOnPostback = "";
                    this.FillTeamsModel().done(function () {
                        this.SetTeamsDropDown();
                    }.bind(this)).fail(function () {
                    });
                };
                MultiTeamUserController.prototype.FillTeamsModel = function () {
                    var self = REISys.Platform.Controller.MultiTeamUserController.FindController(this.ControlClientId);
                    var userdropdownclientId = self.FindClientId('teamsDD');
                    var serviceUrl;
                    var returnedData = null;
                    var myTeams;
                    var jasonRequestData;
                    var deferred = $.Deferred();
                    var ajaxPromise = null;
                    if (this.Model.TeamsOnly) {
                        serviceUrl = REISys.Platform.WebsiteUrl + '/api/Assignment/GetTeamsByUserId?userId=' + this.Model.TeamUserId;
                        var requestJson = '';
                        ReiSys.Utilities.Util.MakeAjaxRequest(serviceUrl, requestJson, 'GET')
                            .done(function (result) {
                            self.Model.AssignmentUsers = result;
                            self.serilializeModel();
                            self.clearErrorMessages();
                            deferred.resolve();
                        }).fail(function (jqXHR, textStatus, errorThrown) {
                            self.SetVisibilitForUserDropDown(false);
                            self.setErrorMessage("Error occured");
                            deferred.reject();
                        });
                    }
                    else {
                        serviceUrl = REISys.Platform.WebsiteUrl + '/api/Assignment/GetUsers';
                        var roledropdownId = self.FindClientId('roleDropDown');
                        var roleVal;
                        if (this.Model.RoleItems.length == 1) {
                            roleVal = this.Model.RoleItems[0].LookupCode;
                        }
                        else {
                            roleVal = $find(roledropdownId).get_value();
                        }
                        if (roleVal == -1) {
                            this.setErrorMessage("Valid role should be selected");
                            deferred.reject();
                        }
                        else {
                            var requestJson = JSON.stringify({
                                SelectedRoleId: roleVal,
                                IsGetDetails: self.Model.IsGetDetails,
                                IsGetBackup: self.Model.IsBackup,
                                OfficeId: self.Model.OfficeId,
                                mode: self.Model.Mode,
                                DefaultResourceValue: this.Model.DefaultResourceValue,
                                DefaultResourceTypeCode: self.Model.DefaultResourceTypeCode,
                                ProcessDetailCode: self.Model.ProcessDetailCode,
                                EnterprizeProcessCode: self.Model.EnterprizeProcessCode
                            });
                            ReiSys.Utilities.Util.MakeAjaxRequest(serviceUrl, requestJson, 'POST')
                                .done(function (result) {
                                self.SetVisibilitForUserDropDown(true);
                                self.Model.AssignmentUsers = result;
                                self.serilializeModel();
                                self.clearErrorMessages();
                                deferred.resolve();
                            }).fail(function (jqXHR, textStatus, errorThrown) {
                                self.SetVisibilitForUserDropDown(false);
                                self.setErrorMessage("Error occured");
                                deferred.reject();
                            });
                        }
                    }
                    return deferred.promise();
                };
                MultiTeamUserController.prototype.FillRoleItemModel = function () {
                    var self = REISys.Platform.Controller.MultiTeamUserController.FindController(this.ControlClientId);
                    var serviceUrl = REISys.Platform.WebsiteUrl + '/api/Assignment/GetRolesFromLookupService';
                    var roles = [];
                    var myroles = this.Model.Roles;
                    for (var i = 0; i < myroles.length; i++) {
                        roles.push(myroles[i]);
                    }
                    var requestJson = JSON.stringify({ RoleIds: roles });
                    var deferred = $.Deferred();
                    ReiSys.Utilities.Util.MakeAjaxRequest(serviceUrl, requestJson, 'POST')
                        .done(function (result) {
                        var roleItems = new Array();
                        for (var i = 0; i < result.length; i++) {
                            roleItems.push(new RoleItems(result[i].RoleId, result[i].RoleName));
                        }
                        self.Model.RoleItems = roleItems;
                        self.serilializeModel();
                        self.clearErrorMessages();
                        deferred.resolve();
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        self.SetVisibilitForUserDropDown(false);
                        self.setErrorMessage("Error occured");
                        deferred.reject();
                    });
                    return deferred.promise();
                };
                return MultiTeamUserController;
            }(ReiSys.Platform.Controller.BaseComponentController));
            Controller.MultiTeamUserController = MultiTeamUserController;
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
