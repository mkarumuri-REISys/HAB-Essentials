/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../ExternalTS/Platformlib.ts" />
/// <reference path="../ExternalTS/Telerik.ts" />
/// <reference path="../Utilities/Util.ts"/>
var REISys;
(function (REISys) {
    (function (Platform) {
        (function (Web) {
            (function (UI) {
                var REIRadComboBoxItem = (function () {
                    function REIRadComboBoxItem() {
                    }
                    return REIRadComboBoxItem;
                })();
                UI.REIRadComboBoxItem = REIRadComboBoxItem;

                var REIRadComboBox = (function () {
                    function REIRadComboBox(id) {
                        if (id) {
                            this.instance = $find(id);
                        }
                    }
                    REIRadComboBox.prototype.BindData = function (data, successCallback) {
                        var success = false;
                        if (data && data instanceof Array) {
                            for (var i = 0; i < data.length; i++) {
                                if (this.instance) {
                                    var comboItem = data[i];
                                    this.instance.trackChanges();
                                    this.instance.get_items().add(comboItem);
                                    //comboItem.select();
                                    //this.instance.commitChanges();
                                }
                            }
                            success = true;
                        } else {
                            PlatformConsole.log('either server error occurred or no data found for Rad comboBox');
                        }
                        if (typeof successCallback === 'function') {
                            successCallback(this.instance);
                        }
                    };
                    return REIRadComboBox;
                })();
                UI.REIRadComboBox = REIRadComboBox;
            })(Web.UI || (Web.UI = {}));
            var UI = Web.UI;
        })(Platform.Web || (Platform.Web = {}));
        var Web = Platform.Web;
    })(REISys.Platform || (REISys.Platform = {}));
    var Platform = REISys.Platform;
})(REISys || (REISys = {}));
//# sourceMappingURL=RadComboBox.js.map
