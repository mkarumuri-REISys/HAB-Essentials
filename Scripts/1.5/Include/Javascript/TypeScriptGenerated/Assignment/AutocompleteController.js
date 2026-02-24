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
                //Controller to handle autocomplete setup, including 508.
                var AutocompleteController = (function (_super) {
                    __extends(AutocompleteController, _super);
                    function AutocompleteController(textFieldId, source) {
                        _super.call(this);
                        this.textField = $(textFieldId);
                        // handle/run/apply proto functions.  Doing this ensures proper use of 'this'
                        this.setLiveText();
                        var thisCreate = this.createCallBack.bind(this);
                        //create callback function for options.
                        //'this' needs to be whatever called the function, NOT AutocompleteController
                        var createFunc = function (event, ui) {
                            thisCreate(event, ui);
                            return this._super();
                        };
                        //Setting the Autocomplete Options
                        var options = {
                            delay: 600,
                            autoFocus: false,
                            source: source,
                            _create: createFunc,
                            _renderItem: this.renderItem
                        };
                        this.textField.autocomplete(options);
                    }
                    AutocompleteController.prototype.setLiveText = function () {
                        if ($('#liveText').length === 0) {
                            $('body').prepend('<div id="liveText" class="sr-only" aria-live="assertive"></div>');
                        }
                        this.liveText = $('#liveText');
                    };
                    //callback for create on autocomplete.  adds aria attributes to assist with 508.
                    AutocompleteController.prototype.createCallBack = function (event, ui) {
                        var selectCallbackFunc = function (event, ui) {
                            this.liveText.html(ui.item ? 'Selected: ' + ui.item.value : 'Nothing selected');
                        }.bind(this);
                        this.textField.attr("aria-controls", "list").attr("aria-haspopup", "true");
                        this.textField.on("autocompleteselect", selectCallbackFunc);
                    };
                    //item formatter for autocomplete's dropdown menu.  Ensures selectability.
                    //'this' needs to be whatever called the function, NOT AutocompleteController
                    AutocompleteController.prototype.renderItem = function (ul, item) {
                        var term = this.element.val(), html = item.label;
                        return $("<li></li>")
                            .append($("<a></a>").html(html))
                            .appendTo(ul);
                    };
                    return AutocompleteController;
                }(ReiSys.Platform.Controller.BaseComponentController));
                Assignment.AutocompleteController = AutocompleteController;
            })(Assignment = Controller.Assignment || (Controller.Assignment = {}));
        })(Controller = Platform.Controller || (Platform.Controller = {}));
    })(Platform = REISys.Platform || (REISys.Platform = {}));
})(REISys || (REISys = {}));
