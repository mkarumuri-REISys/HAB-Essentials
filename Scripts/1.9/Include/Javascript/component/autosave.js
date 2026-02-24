define(function () {
    return {
        Start: (function Start(config) {

            /* AutoSave Code Starts here */

            var nextFocusId = "feedbackDiv";
            var feedbackDiv = "div#feedbackDiv";
            var autosaveToolbarNameSpace = "REISys.Platform.Web.Layout.ToolBar.AutoSave";
            var autoSaveToolbarMessageTimeout = parseInt($("[ID$='AutoSave_ToolbarMessageTimeout']").val()); //Need to be set from configuration
            var autoSaveToolbarMessageTimeout_default = 10;
            var autoSaveToolbarNextMessageTimeout = 3; //Need to be set from configuration 
            var AutoSaveToolbarMessageTimer; // Timer which controls the reseting of toolbar message with blank string
            var jsonExistingAutoSaveSnapshots = [];
            var triggerCount = 0;  // Helps us to determine whether it first call of autosave kick off or subsequent change
            var AutoSaveWebRoot = "";
            //var pageURL = config.pageURL; //'<%= Request.Url.AbsolutePath.Substring(Request.Url.AbsolutePath.LastIndexOf('/')+1) %>';
            var AutoResume = false;

            // JSON object for holding page's control values/states
            autoSavePageValues = [];
            tempAutoSavePageValues = [];
            var hiddenFields = [];
            /*
            hiddenFields = [] , associative array
            */

            var validationMessageVisible = false;
            // timer
            var AutoSaveTimerId = 0;

            var AutoSaveToolbarMessageTimerId;
            var NextMessageTimer;
            var NextAutoSaveTime;
            var dirtyData = false;
            var autoSaveStartTime = new Date();
            var secDiff = 0;

            // Web Service URLs
            var useService = false; // switch between using web service and Page WebMethod
            var Autosave_WebService_Get;
            var Autosave_WebService_CleanForAllUsers;
            var Autosave_WebService_CleanForCurrentUser;
            var Autosave_WebService_Delete;
            var Autosave_WebService_Create;
            var Autosave_WebService_Update;

            if (isNaN(autoSaveToolbarMessageTimeout)) {
                autoSaveToolbarMessageTimeout = autoSaveToolbarMessageTimeout_default;
            }
            // for compatibility with array.foreach in IE 8
            if (!Array.prototype.forEach) {
                Array.prototype.forEach = function (fn, scope) {
                    'use strict';
                    var i, len;
                    for (i = 0, len = this.length; i < len; ++i) {
                        if (i in this) {
                            fn.call(scope, this[i], i, this);
                        }
                    }
                };
            }

            String.prototype.escapeSpecialChars = function () {
                return this
                    .replace(/[\\]/g, '\\\\')
                    .replace(/[\/]/g, '\\/')
                    .replace(/[\b]/g, '\\b')
                    .replace(/[\f]/g, '\\f')
                    .replace(/[\n]/g, '\\n')
                    .replace(/[\r]/g, '\\r')
                    .replace(/[\t]/g, '\\t');
            };


            //var pageURL = 'AutoSaveTestPage.aspx';

            // make a custom selector ":noParentsWith" to EXclude by selector those controls descending from parents which pass the given selector
            // currently this will let us exclude the entire footersearch DIV  <div class=​"footersearch">​
            // Parameters:
            // a -> the DOM object collection on which the .filter() function is operating (usually creatd by jQuery Selector)
            // i -> the index of "this", the DOM object from the collection "a" currently being processed
            // m -> not sure (sorry)
            // m[3] -> the passed in SELECTOR against which the parents of "this" are compared
            // DOM objects from the collection "a" for which the function returns true are added to the output DOM object collection of the custom selector
            jQuery.expr[':'].noParentsWith = function (a, i, m) {
                return jQuery(a).parents(m[3]).length < 1;
            };
            // make a custom selector ":parentsWith" to INclude by selector those controls descending from parents which pass the given selector
            // currently this will let us exclude the entire footersearch DIV  <div class=​"footersearch">​
            // Parameters:
            // a -> the DOM object collection on which the .filter() function is operating (usually creatd by jQuery Selector)
            // i -> the index of "this", the DOM object from the collection "a" currently being processed
            // m -> not sure (sorry)
            // m[3] -> the passed in SELECTOR against which the parents of "this" are compared
            // DOM objects from the collection "a" for which the function returns true are added to the output DOM object collection of the custom selector
            jQuery.expr[':'].parentsWith = function (a, i, m) {
                return jQuery(a).parents(m[3]).length > 0;
            };

            //// example:
            //// this will return all <select> controls that do not descend from an objuect with class '.footersearch'
            //$('select').filter(':parents(.footersearch)');


            /* attaching methods to public objects 
            These will be available in REISys.Platform.Web.AutoSave.
            */

            this.DeletePreviousSnapshot = DeletePreviousSnapshot; // Used in Discard link
            this.LoadSnapshot = LoadSnapshot;  // used in Resume link 
            this.CaptureChanges = CaptureChanges;
            this.UnCaptureChanges = UnCaptureChanges;
            this.TriggerTimer = TriggerTimer;
            this.FadeOutRecovery = FadeOutRecovery;
            this.SavePageValues = SavePageValues;
            this.HasDirtyData = HasDirtyData;

            var IsChangesCaptured = false;

            //handle partial page load and unload

            Sys.Application.add_load(function (sender, e) {
                var isActivated = $("[ID$='AutoSave_Activated']").val() == "true";
                //capture changes only if activated
                if (isActivated) {
                    UnCaptureChanges(); // remove event binding from all other controls that are not partially loaded
                    CaptureChanges();   // add event binding on all controls
                }
            });

            Sys.Application.add_unload(function (sender, e) {
                if (IsChangesCaptured) {
                    UnCaptureChanges();
                }
            });

            //start 
            var appStarted = false;
            init();

            function init() {
                AutoSaveWebRoot = $("[ID$='AutoSave_WebRoot']").val();
                AutoResume = $("[ID$='AutoSave_ReloadMode']").val().toLowerCase() != "showoption";
                MultiUser = $("[ID$='AutoSave_MultiUser']").val().toLowerCase() == "true";

                var webServiceRoot = "";
                if (useService) {
                    webServiceRoot = AutoSaveWebRoot + "Platform/WebServices/AutoSaveWebService.svc";
                } else {
                    webServiceRoot = AutoSaveWebRoot + "Platform/Interface/Services/AutoSaveService.aspx";
                }
                Autosave_WebService_Get = webServiceRoot + "/Get";
                Autosave_WebService_Create = webServiceRoot + "/Create";
                Autosave_WebService_Update = webServiceRoot + "/Update";
                Autosave_WebService_Delete = webServiceRoot + "/Delete";
                Autosave_WebService_CleanForCurrentUser = webServiceRoot + "/CleanForCurrentUser";
                Autosave_WebService_CleanForAllUsers = webServiceRoot + "/CleanForAllUsers";

                PopulateHiddenFields(config.hiddenFields);
                // expand the value of jsonExistingAutoSaveSnapshots so we can load the structure on the server side and just pop it in here.
                var jsonExistingAutoSaveSnapshots = config.jsonExistingAutoSaveSnapshots; //<%= JsonExistingAutoSaveSnapshots %>
                if (AutoResume && !MultiUser) {
                    AutoResumeEdits(jsonExistingAutoSaveSnapshots);

                } else {
                    // process any existing snapshots that were found server-side during load
                    if (jsonExistingAutoSaveSnapshots.length > 0) { // var jsonExistingAutoSaveSnapshots = [...] is created and registered with the script dynamically from code behond at page INIT
                        GiveChoicesForExistingEdits(jsonExistingAutoSaveSnapshots);
                    }
                }
                unapplyBindings(document.getElementById('feedbackDiv'), false);
                var isActivated = $("[ID$='AutoSave_Activated']").val() == "true";
                //capture changes only if activated
                if (isActivated) {
                    CaptureChanges();
                    IsChangesCaptured = true;

                    //start autosave timer
                    newKickOffSaveAndTimer();
                }
                secDiff = autoSaveStartTime.getTime() - REISys.Platform.ServerTime.getTime();
                appStarted = true;
            }

            /* Adds passed fields to the list of hidden fields */
            /* param : fields - it can be array of ids or just a single id (string)*/
            function PopulateHiddenFields(fields) {
                if (fields instanceof Array) {
                    for (var i = 0; i < fields.length; i++) {
                        if (fields[i] == null) continue;
                        if (fields[i] == '') continue;
                        key = fields[i];
                        if (key.toLowerCase().indexOf("class") != -1) {
                            var pair = key.split(":");
                            if (pair.length == 2) {
                                var className = pair[1];
                                $("." + className + "").each(function () {
                                    var element = $(this);
                                    var id = element.attr("id");
                                    if (id != null && hiddenFields[id] == null) {
                                        hiddenFields[id] = "";
                                    }
                                });
                            }
                        }
                        else {
                            $("[ID$='" + key + "']").each(function () {
                                var id = $(this).attr("id");
                                if (id != null && hiddenFields[id] == null) {
                                    hiddenFields[id] = "";
                                }
                            });
                        }
                    }
                }
                if (typeof fields === "string") {
                    var array = [];
                    array.push(fields);
                    PopulateHiddenFields(array);
                }
            }
            //* trigger timer with extra fields to check *//

            function TriggerTimer(args) {
                PopulateHiddenFields(args);
                newKickOffSaveAndTimer();
            }

            function CaptureChanges() {
                CaptureRadBoxChanges();
                CaptureListBoxChanges();
                CaptureCheckBoxChanges();
                CaptureRadioButtonChanges();
                CaptureTextBoxChanges();
                CaptureTextAreaChanges();
                CaptureDropDownChanges();
                CaptureRadEditorEvents();
                CaptureRadCalenderEvents();
                CaptureRadCalendarTimeViewEvents();
                IsChangesCaptured = true;
            }

            function UnCaptureChanges() {
                UnCaptureRadBoxChanges();
                UnCaptureListBoxChanges();
                UnCaptureCheckBoxChanges();
                UnCaptureRadioButtonChanges();
                UnCaptureTextBoxChanges();
                UnCaptureTextAreaChanges();
                UnCaptureDropDownChanges();
                UnCaptureRadEditorEvents();
                UnCaptureRadCalenderEvents();
                UnCaptureRadCalendarTimeViewEvents();
                IsChangesCaptured = false;
            }

            function CaptureRadBoxChanges() {
                // capture RadComboBox changes
                $('div.RadComboBox').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rcb = $find(element.id);
                        if (rcb != null) {
                            if (rcb._checkBoxes) {
                                rcb.add_itemChecked(newKickOffSaveAndTimer); // this captures the selection change event for CheckBox-enabled RCB
                            } else {
                                rcb.add_selectedIndexChanged(newKickOffSaveAndTimer); // this captures the selection change event for non-CheckBox-enabled RCB
                            }
                        }
                    }
                );
            }

            function UnCaptureRadBoxChanges() {
                // uncapture RadComboBox changes
                $('div.RadComboBox').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rcb = $find(element.id);
                        if (rcb != null) {
                            if (rcb._checkBoxes) {
                                rcb.remove_itemChecked(newKickOffSaveAndTimer);
                            } else {
                                rcb.remove_selectedIndexChanged(newKickOffSaveAndTimer);
                            }
                        }
                    }
                );
            }

            function CaptureListBoxChanges() {
                // capture listbox changes
                $('div.RadListBox').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rlb = $find(element.id);
                        if (rlb != null) {
                            if (rlb._checkBoxes) {
                                rlb.add_itemChecked(newKickOffSaveAndTimer); // this captures the selection change event for CheckBox-enabled RLB
                            } else {
                                rlb.add_selectedIndexChanged(newKickOffSaveAndTimer); // this captures the selection change event for non-CheckBox-enabled RLB
                            }
                        }
                    }
                );
            }

            function UnCaptureListBoxChanges() {
                // uncapture listbox changes
                $('div.RadListBox').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rlb = $find(element.id);
                        if (rlb != null) {
                            if (rlb._checkBoxes) {
                                rlb.remove_itemChecked(newKickOffSaveAndTimer);
                            } else {
                                rlb.remove_selectedIndexChanged(newKickOffSaveAndTimer);
                            }
                        }
                    }
                );
            }

            function CaptureCheckBoxChanges() {
                // capture checkbox changes
                $('input:checkbox:not([class*="rcbCheckBox"] , [class*="rlbCheck"])').filter(':parentsWith(#mainarea)').on("change", newKickOffSaveAndTimer);

            }

            function UnCaptureCheckBoxChanges() {
                // uncapture checkbox changes
                $('input:checkbox:not([class*="rcbCheckBox"] , [class*="rlbCheck"])').filter(':parentsWith(#mainarea)').off("change", newKickOffSaveAndTimer);

            }

            function CaptureRadioButtonChanges() {
                // capture radio button changes
                $('input:radio').filter(':parentsWith(#mainarea)').on("change", newKickOffSaveAndTimer);
            }

            function UnCaptureRadioButtonChanges() {
                // uncapture radio button changes
                $('input:radio').filter(':parentsWith(#mainarea)').off("change", newKickOffSaveAndTimer);
            }

            function CaptureTextBoxChanges() {
                // capture text box changes
                // intentionally exclude hidden controls, any global search text boxes, and RadComboBox and RadListBox embedded inputs
                $('input:text:not( [type="hidden"] , [class*="searchbox"] , [class*="rcbInput"] , [class*="rcbCheckBox"] , [class*="rlbCheck"] , [class*="RadCalendar"] )').filter(':parentsWith(#mainarea)').on("paste cut delete insert drop keyup", newKickOffSaveAndTimer);

            }

            function UnCaptureTextBoxChanges() {
                // uncapture text box changes
                // intentionally exclude hidden controls and any global search text boxes
                $('input:text:not( [type="hidden"] , [class*="searchbox"] , [class*="rcbInput"] )').filter(':parentsWith(#mainarea)').off("paste cut delete insert drop keyup", newKickOffSaveAndTimer);

            }

            function CaptureTextAreaChanges() {
                // capture textarea changes (radtextbox, richtextview)
                $('textarea:visible').filter(':parentsWith(#mainarea)').on("paste cut delete insert drop keyup", newKickOffSaveAndTimer);
            }

            function UnCaptureTextAreaChanges() {
                // uncapture textarea changes (radtextbox, richtextview)
                $('textarea:visible').filter(':parentsWith(#mainarea)').off("paste cut delete insert drop keyup", newKickOffSaveAndTimer);
            }

            function CaptureDropDownChanges() {
                // capture dropdown changes (excludes toolbar and global search dropdowns by excluding those with class containing 'searchselect_top')
                //$("select:not([class*='searchselect_top'])")[0]).parents(".SkipAutoSave").length < 1
                $("select:not([class*='searchselect_top'])").filter(':parentsWith(#mainarea)').on("change", function (event) {
                    if (jQuery(this).parents(".SkipAutoSave").length < 1) {
                        newKickOffSaveAndTimer();
                    }
                });
            }

            function UnCaptureDropDownChanges() {
                // uncapture dropdown changes (excludes toolbar and global search dropdowns by excluding those with class containing 'searchselect_top')
                $("select:not([class*='searchselect_top'])").filter(':parentsWith(#mainarea)').off("change");
            }

            function CaptureRadEditorEvents() {
                // capture RadEditor events
                $('.RadEditor').filter(':parentsWith(#mainarea)').each(
                    function (index) {
                        var editor = $find(this.id);
                        if (editor != null) {
                            editor._events.addHandler("commandExecuted", ClientCommandExecutedHandler);

                            // this is where we trap the keyboard cut & paste and toolbar commands

                            var htmlArea = editor.get_textArea();
                            var contentArea = editor.get_contentArea();

                            // trap keyup events here (might not be necessary for htmlArea)
                            if (htmlArea) {
                                htmlArea.onkeyup = AreaChangedEventHandler;
                            }

                            // trap keydown events here 
                            if (contentArea) {
                                contentArea.onkeyup = AreaChangedEventHandler;
                            }
                        }
                    }
                );
            }

            function UnCaptureRadEditorEvents() {
                // uncapture RadEditor events
                $('.RadEditor').filter(':parentsWith(#mainarea)').each(
                    function (index) {
                        var editor = $find(this.id);
                        if (editor != null) {
                            editor._events.removeHandler("commandExecuted", ClientCommandExecutedHandler);
                        }
                    }
                );
            }

            function CaptureRadCalenderEvents() {
                $('.RadCalendar').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rcal = $find(element.id);
                        if (rcal != null) {
                            rcal.add_dateSelected(newKickOffSaveAndTimer); // this captures the select date
                        }
                    }
                );
            }

            function UnCaptureRadCalenderEvents() {
                $('table.RadCalendar').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rcal = $find(element.id);
                        if (rcal != null) {
                            rcal.remove_dateSelected(newKickOffSaveAndTimer);  // this uncaptures the select date 
                        }
                    }
                );
            }

            function CaptureRadCalendarTimeViewEvents() {
                $('.RadCalendarTimeView').filter(':parentsWith(#mainarea)').each(
                function (i, element) {
                    var rcal = $find($(element).parent().attr('id'));
                    if (rcal != null) {
                        rcal.add_clientTimeSelected(newKickOffSaveAndTimer); // this captures the select date
                    }
                }
                );
            }

            function UnCaptureRadCalendarTimeViewEvents() {
                $('.RadCalendarTimeView').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rcal = $find($(element).parent().attr('id'));
                        if (rcal != null) {
                            rcal.remove_clientTimeSelected(newKickOffSaveAndTimer); // this captures the select date
                        }
                    }
                );
            }

            function AreaChangedEventHandler(event) {
                // event was handled, need to process the timer and Save if needed
                newKickOffSaveAndTimer()
            }

            function contentAreaDetectChanges(event) {
                // event was handled, need to process the timer and Save if needed
                newKickOffSaveAndTimer()
            }

            function ClientCommandExecutedHandler(editor, command) {
                var trackedChangeCommands = [
                    "Bold",
                    "Italic",
                    "Underline",
                    "Indent",
                    "Outdent",
                    "JustifyLeft",
                    "JustifyRight",
                    "JustifyCenter",
                    "JustifyFull",
                    "JustifyNone",
                    "Superscript",
                    "Subscript",
                    "InsertTable",
                    "TableWizard",
                    "Undo",
                    "Redo",
                    "Cut",
                    "Paste",
                    "PasteFromWord",
                    "PasteFromWordNoFontsNoSizes",
                    "PastePlainText",
                    "PasteAsHtml",
                    "PasteHtml",
                    "InsertParagraph",
                    "InsertGroupbox",
                    "InsertDate",
                    "InsertTime",
                    "InsertHorizontalRule",
                    "InsertOrderedList",
                    "InsertUnorderedList",
                    "InsertSymbol",
                    "InsertTable",
                    "InsertForm",
                    "InsertButton",
                    "InsertCheckbox",
                    "InsertHidden",
                    "InsertFormPassword",
                    "InsertFormRadio",
                    "InsertFormReset",
                    "InsertFormSelect",
                    "InsertFormSubmit",
                    "InsertFormTextarea",
                    "InsertFormTextbox",
                    "ForeColor",
                    "BackColor",
                    "ApplyClass",
                    "StripAll",
                    "StripCss",
                    "StripFont",
                    "StripSpan",
                    "StripWord",
                    "ConvertToLower",
                    "ConvertToUpper"
                ];
                var commandName = null == command._name ? "null" : command._name;
                var tool = null == command._tool ? "null" : command._tool;
                var toolname = (null == command._tool || null == command._tool._name) ? "null" : command._tool._name;
                if (jQuery.inArray(commandName, trackedChangeCommands) > -1 || jQuery.inArray(toolname, trackedChangeCommands) > -1 || jQuery.inArray(tool, trackedChangeCommands) > -1) {
                    // Command was handled, need to process the timer and Save if needed
                    newKickOffSaveAndTimer()
                }
            }

            function KickOffSaveAndTimer(timerInterval) {
                dirtyData = true;
                ClearRecovery();
                window.clearInterval(AutoSaveTimerId);
                AutoSaveTimerId = window.setInterval(function () {
                    if ($("[ID$='AutoSave_Activated']").val() == "true") {
                        // AutoSave does a check to confirme the user is still logged in BEFORE it tries to save anything
                        // It's a quick AJAX call to find session info in the page
                        // much cheaper and faster than going through SVC to WS to Service to Repository and asking the DB for session info
                        // IsUserLoggedIn(SavePageValues);
                        SavePageValues();
                    }
                    // depending on configured timer type, clear the timer and wait for another change
                    // "WaitForChange" -> timer ALWAYS waits for change before starting, 
                    // "Continuous" -> timer only waits for the FIRST change, then runs continuously, firing and restarting until page is exited -->
                    if ($("[ID$='AutoSave_IntervalType']").val() == "WaitForChange") {
                        window.clearInterval(AutoSaveTimerId);
                    }
                }, timerInterval);
            }

            this.TriggerSaveAndTimer = function () {
                newKickOffSaveAndTimer();
            }

            function newKickOffSaveAndTimer() {
                PlatformConsole.log('AutoSave triggered');
                triggerCount = triggerCount + 1;
                if (appStarted) {
                    dirtyData = true;
                    ClearRecovery();
                }
                PlatformConsole.log("Has Dirty data? " + dirtyData);
                var waitForChange = $("[ID$='AutoSave_IntervalType']").val().toLowerCase() == "WaitForChange".toLowerCase();

                if ((!waitForChange && triggerCount > 1)) return;
                window.clearInterval(AutoSaveTimerId);
                AutoSaveTimerId = window.setInterval(function () {
                    if ($("[ID$='AutoSave_Activated']").val() == "true") {
                        // AutoSave does a check to confirme the user is still logged in BEFORE it tries to save anything
                        // It's a quick AJAX call to find session info in the page
                        // much cheaper and faster than going through SVC to WS to Service to Repository and asking the DB for session info
                        SavePageValues();
                        // IsUserLoggedIn(SavePageValues);
                    }
                    // depending on configured timer type, clear the timer and wait for another change
                    // "WaitForChange" -> timer ALWAYS waits for change before starting, 
                    // "Continuous" -> timer only waits for the FIRST change, then runs continuously, firing and restarting until page is exited -->
                    if (waitForChange) {
                        window.clearInterval(AutoSaveTimerId);
                    }
                }, $("[ID$='AutoSave_TimerInterval']").val());
            }

            // home-grown encode so the embedded quotes in text boxes and RadEditors can be (de)serialized to/from the database with JSON
            //simply replaces all occurrences of the following characters with their corresponding html entities
            function Encode(source) {
                if (source == null) return '';
                return source.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }

            // home-grown decode so the embedded quotes in text boxes and RadEditors can be (de)serialized to/from the database with JSON
            //simply replaces all occurrences of the following html entities with their corresponding character representation
            function Decode(source) {
                return source.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            }

            function SavePageValues() {
                var jsonData = {}; // reset 
                jsonData.autoSaveData = {};
                jsonData.autoSaveData.UserId = $("[ID$='AutoSave_UserId']").val();
                jsonData.autoSaveData.PageId = $("[ID$='AutoSave_PageId']").val();
                if (null != $("[ID$='AutoSave_ResourceValue']").val() && "" != $("[ID$='AutoSave_ResourceValue']").val()) {
                    jsonData.autoSaveData.ResourceValue = $("[ID$='AutoSave_ResourceValue']").val(); // $("**#<%= ResourceValue.ClientID %>**").text();
                }
                if (null != $("[ID$='AutoSave_ResourceTypeCode']").val() && "" != $("[ID$='AutoSave_ResourceTypeCode']").val()) {
                    jsonData.autoSaveData.ResourceTypeCode = $("[ID$='AutoSave_ResourceTypeCode']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                }
                if (null != $("[ID$='AutoSave_ResourceInstance']").val() && "" != $("[ID$='AutoSave_ResourceInstance']").val()) {
                    jsonData.autoSaveData.ResourceInstance = $("[ID$='AutoSave_ResourceInstance']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                }
                if (null != $("[ID$='AutoSave_ViewParams']").val() && "" != $("[ID$='AutoSave_ViewParams']").val()) {
                    jsonData.autoSaveData.ViewParams = $("[ID$='AutoSave_ViewParams']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                }

                GetPageValues();
                jsonData.autoSaveData.JSONStringOfSavedData = JSON.stringify(autoSavePageValues);
                if (dirtyData) {
                    SavePageData(jsonData);
                }
                else {
                    window.clearTimeout(AutoSaveToolbarMessageTimer);
                    OnAutoSave(null, true);
                }
            }

            // Get the values/states of the page's controls
            function GetPageValues() {
                autoSavePageValues = []; // need to reset with every call to GetPageValues otherwise we'll get duplicates, then triplicates, etc
                getInputValues();
                getHiddenFieldValues();
                getRadComboBoxValues();
                getRadListBoxValues();
                getTextAreaValues();
                getSelectValues();
                getRadEditorValues();
                getRadCalendarValues();
            }

            // get the values/states of the page's INPUT controls
            // intentionally exclude buttons, submit controls, hidden controls, any global search text boxes, and RadComboBox and RadListBox embedded inputs
            function getInputValues() { // values is a {} array ultimately passed in from SavePageValues, it gets set into jsonData.autoSaveData.JSONStringOfSavedData
                var arr = autoSavePageValues;
                $("input:not( [type='submit'] , [type='button'] , [type='hidden'], [class*='searchbox'] , [class*='rcbInput'] , [class*='rcbCheckBox'] , [class*='rlbCheck'] ) ").filter(':parentsWith(#mainarea)').each(

                    function (index) {
                        var valuestring = function (control) {
                            switch (control.type) {
                                case 'checkbox':
                                    return '"checked":"' + control.checked + '"';
                                case 'radio':
                                    return '"checked":"' + control.checked + '"';
                                case 'text':
                                    return '"value":"' + Encode($(control).val()) + '"';
                                default:
                                    return '"value":"' + $(control).val() + '"';
                            }
                        };
                        arr.push('{ "ID" : "' + this.id + '", "Type" : "' + this.type + '", ' + valuestring(this) + ' }');
                    }
                );
            }

            function getHiddenFieldValues() {
                var arr = autoSavePageValues;
                for (var key in hiddenFields) {
                    var ele = $("#" + key);
                    if (ele != null) {
                        hiddenFields[key] = ele.val();
                    }
                }
                for (var key in hiddenFields) {
                    if (hiddenFields[key] != null) {
                        var data = '{ "ID" : "' + key + '", "Type" : "hidden", "value" : "' + Encode(hiddenFields[key]) + '" }';
                        arr.push(data);
                    }
                }
            }
            // get the values/states of the page's TEXTAREA controls
            // selecting only visible text areas avoids the hidden areas from radEditors
            function getTextAreaValues() {
                var arr = autoSavePageValues;
                $("textarea:visible").filter(':parentsWith(#mainarea)').each(
                    function (index) {
                        var value = "";
                        // if it's a RadTextBox textarea we want to use get_textBoxValue/set_textBoxValue
                        var ctrl = $find(this.id);
                        if (null != ctrl) {
                            if (ctrl.get_textBoxValue() != ctrl.get_emptyMessage())
                                value = Encode(ctrl.get_textBoxValue());
                        } else {
                            value = Encode(this.value);
                        }
                        arr.push('{ "ID" : "' + this.id + '", "Type" : "textarea", "value":"' + value + '" }');
                    }
                );
            };

            // get the values and formatting (the HTML!) of the page's RadEditor controls (RichTextBoxView)
            // we get the ID of the internal RadEditor by looking for the DIV that renders with the ID, the use Telerik's FIND to look in the DOM to get the object
            function getRadEditorValues() {
                var arr = autoSavePageValues;
                $('.RadEditor').filter(':parentsWith(#mainarea)').each(
                    function (index) {
                        ctrl = $find(this.id);
                        if (ctrl != null) {
                            arr.push('{ "ID" : "' + this.id + '", "Type" : "RadEditor", "value":"' + Encode(ctrl.get_html()) + '" }');
                        }
                    }
                );
            }

            // get the checked/selected states of the page's LISTBOX items
            function getRadComboBoxValues() {
                var arr = autoSavePageValues;
                $('div.RadComboBox').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rcb = $find(element.id);
                        if (rcb != null) {
                            var items = rcb.get_items();
                            items.forEach(function (item) {
                                arr.push('{ "ID" : "' + element.id + '", "Type" : "rcbItem", "checked" : "' + item.get_checked() + '", "selected" : "' + item.get_selected() + '", "text" : "' + Encode(item.get_text()) + '", "value" : "' + Encode(item.get_value()) + '" }');
                            });
                        }
                    }
                );
            };

            function getRadCalendarValues() {
                var arr = autoSavePageValues;
                $('table.RadCalendar').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rcb = $find(element.id);
                        if (rcb != null) {
                            var rDatePicker = $find(element.id.replace('_calendar', ''));
                            if (rDatePicker != null && rDatePicker instanceof Telerik.Web.UI.RadDatePicker) {
                                var item = rDatePicker.get_selectedDate();
                                if (item != null) {
                                    arr.push('{ "ID" : "' + element.id + '", "Type" : "rcalItem", "value" : "' + item.getFullYear() + '/' + (item.getMonth() + 1) + '/' + item.getDate() + '" }');
                                }
                            } else if (rDatePicker != null && rDatePicker instanceof Telerik.Web.UI.RadDateTimePicker) {
                                var item = rDatePicker.get_selectedDate();
                                if (item != null) {
                                    arr.push('{ "ID" : "' + element.id + '", "Type" : "rcalItem", "value" : "' + item.getFullYear() + '/' + item.getMonth() + '/' + item.getDate() + '/' + item.getHours() + '/' + item.getMinutes() + '" }');
                                }
                            }
                            else {
                                var items2 = rcb.get_selectedDates();
                                items2.forEach(function (item) {
                                    arr.push('{ "ID" : "' + element.id + '", "Type" : "rcalItem", "value" : "' + item.join('/') + '" }');
                                });
                            }
                        }
                    }
                );
            }
            // get the checked/selected states of the page's LISTBOX items
            function getRadListBoxValues() {
                var arr = autoSavePageValues;
                $('div.RadListBox').filter(':parentsWith(#mainarea)').each(
                    function (i, element) {
                        var rlb = $find(element.id);
                        if (rlb != null) {
                            var items = rlb.get_items();
                            items.forEach(function (item) {
                                arr.push('{ "ID" : "' + element.id + '", "Type" : "rlbItem", "checkable" : "' + item.get_checkable() + '", "checked" : "' + item.get_checked() + '", "selected" : "' + item.get_selected() + '", "text" : "' + Encode(item.get_text()) + '", "value" : "' + Encode(item.get_value()) + '" }');
                            });
                        }
                    }
                );
            };

            // get the checked/selected states of the page's select items
            // (excludes toolbar and global search dropdowns by excluding those with class containing 'searchselect_top')
            function getSelectValues() {
                var arr = autoSavePageValues;
                $("select:not([class*='searchselect_top'])").filter(':parentsWith(#mainarea)').each(
                    function (index) {
                        if (this.type != 'hidden') {
                            $('#' + this.id + ' option').each(
                                function (index2) {
                                    arr.push('{ "ID" : "' + this.parentElement.id + '", "Type" : "select-option", "selected" : "' + this.selected + '","value" : "' + Encode(this.value) + '", "innerText" : "' + Encode(this.innerText) + '" }');
                                }
                            );
                        }
                    }
                );
            };

            // the following function looks for existing unsaved edits in PFM_AutoSave_P and displays options to the user
            //function LoadSnapshot(autoSaveId, EditsAreByCurrentUser)
            function LoadSnapshot(autoSaveId, EditsAreByCurrentUser) {
                // gather controls' current values/states
                GetPageValues();
                tempAutoSavePageValues = autoSavePageValues;
                // fetch the existing edits from the database
                GetSnapshotAndLoadIntoPageControls(autoSaveId, EditsAreByCurrentUser); // have to do it in once step for now, the $.AJAX call is asynchronous and allows execution to continue before the snapshot data has been returned
            }

            function IgnorePreviousSnapshots(autoSaveId, deleteSnapShot) {
                ParseAndPopulate(JSON.stringify(tempAutoSavePageValues));
                if (deleteSnapShot) {
                    this.DeletePreviousSnapshot(autoSaveId, null);
                } else {
                    // we don't have to check for length here because they must have at least one snapshot to show, the one they just ignored
                    //$(feedbackDiv).text("");    // don't hide the list after an "ignore", they might want to review multiple snapshots
                    GiveChoicesForExistingEdits(jsonExistingAutoSaveSnapshots);
                }
            }

            function ParseAndPopulate(JSONStringOfSavedData) {
                UnCaptureChanges();

                $.each(
                    JSON.parse(JSONStringOfSavedData), function (i, val) {
                        try {
                            var ctrl = JSON.parse(val.escapeSpecialChars());
                            var jCtrl = $("#" + ctrl.ID);
                            if (jCtrl.length != 0) { // checking if it exists
                                switch (ctrl.Type) {
                                    case "radio":
                                        jCtrl.prop('checked', ctrl.checked == "true");
                                        break; //end type=radio  

                                    case "checkbox":
                                        jCtrl.prop('checked', ctrl.checked == "true");
                                        break; //end type=checkbox  

                                    case "text":
                                        var isRadTextBox = jCtrl.hasClass("riTextBox");
                                        if (isRadTextBox) {
                                            var txtBox = $find(ctrl.ID);
                                            if (txtBox == null) break;
                                            if (ctrl.value != txtBox.get_emptyMessage()) {
                                                jCtrl.val(Decode(ctrl.value));
                                                if (jCtrl.hasClass("filter-textbox")) {
                                                    jCtrl.trigger("keyup");
                                                }
                                            }
                                        }
                                        else {
                                            jCtrl.val(Decode(ctrl.value));
                                        }
                                        break; //end type=text 
                                    case "textarea":
                                        // if it's a RAD textarea we want to use get_value/set_value
                                        // the $find call returns null if the textarea being processed is from a simple html tag
                                        // the $find call returns a Telerik.Web.UI.RadTextBox obj if the text area was rendered by a RadTextBox
                                        //      $find("ctl00_MainContent_RadTextBox1") => Telerik.Web.UI.RadTextBox {_element: textarea#ctl00_MainContent_RadTextBox1.riTextBox riEnabled, _clientStateFieldID: "ctl00_MainContent_RadTextBox1_ClientState", _shouldUpdateClientState: true, _invisibleParents: Array[0], _autoPostBack: false…}
                                        // saving the returned object into a var turns it into a reference to just the textarea control and not the Telerik object that we need
                                        //      var ctrl = $find("ctl00_MainContent_RadTextBox1");
                                        //      ctrl => Object {ID: "ctl00_MainContent_RadTextBox1", Type: "textarea", value: "this is text"}

                                        if (null != $find(ctrl.ID)) {
                                            // PLSUP-4790 : use telerik set_value method instead of set_textBoxValue to fix the issue where text disappears when you click on the textbox 
                                            $find(ctrl.ID).set_value(Decode(ctrl.value));
                                        } else {
                                            jCtrl.val(Decode(ctrl.value));
                                        }
                                        break; //end type=textarea 

                                    case "li":
                                        if (ctrl.checkable == "true") {
                                            jCtrl.addClass('rlbCheckable');
                                        } else {
                                            jCtrl.removeClass('rlbCheckable');
                                        }

                                        if (ctrl.checked == "true") {
                                            jCtrl.addClass('rlbChecked');
                                        } else {
                                            jCtrl.removeClass('rlbChecked');
                                        }

                                        if (ctrl.selected == "true") {
                                            jCtrl.addClass('rlbSelected');
                                        } else {
                                            jCtrl.removeClass('rlbSelected');
                                        }
                                        break; //end type=rlbItem 

                                        // RadComboBox                                                                         
                                    case "rcbItem":
                                        //find the item by text, and set its selected property
                                        var tCtrl = $find(ctrl.ID);
                                        if (tCtrl == null) break;
                                        var item = tCtrl.findItemByText(Decode(ctrl.text));
                                        //                        item.set_selected(ctrl.selected == "true");   // this method is not getting the selection set in the parent RadListBox
                                        if (item == null) break;
                                        if (ctrl.selected == "true") {
                                            tCtrl.set_selectedItem(item);
                                            item.select(true); // this method fires the change event! we can't use it until that can be resolved  
                                        }
                                        item.set_checked(ctrl.checked == "true");
                                        break;

                                        // RadListBox                                                                         
                                    case "rlbItem":

                                        //find the item by text, and set its selected property
                                        var tCtrl = $find(ctrl.ID);
                                        if (tCtrl == null) break;
                                        var item = tCtrl.findItemByText(Decode(ctrl.text));
                                        if (item == null) break;
                                        item.set_selected(ctrl.selected == "true");
                                        item.set_checked(ctrl.checked == "true");
                                        break;


                                        // "select-option" is an OPTION in a DROPDOWN, and ctrl.ID is the id for the DROPDOWN rather than the OPTION                                                                             
                                        // the dropdowns are $('#' + ctrl.ID:option)                                                                          
                                    case "select-option":
                                        //find the item by text and value, and set its selected property
                                        // $(blah) returns a list in this case, so we need to index into the list to position zero ot get the actual entity we want to manipulate
                                        // strings are "truthy" so convert ctrl.selected into boolean true/false by comparing to the string "true"
                                        var selector = "#" + ctrl.ID + " option[value=\"" + Decode(ctrl.value) + "\"],[innerText=\"" + Decode(ctrl.innerText) + "\"]";
                                        if ($(selector).length == 0) break;
                                        $(selector)[0].selected = (ctrl.selected === "true");
                                        break;
                                    case "RadEditor":
                                        var editor = $find(ctrl.ID);
                                        if (editor == null) break;
                                        editor.set_html(Decode(ctrl.value));
                                        break;

                                        // rad calendar item         
                                    case "rcalItem":
                                        var item = $find(ctrl.ID);
                                        if (item == null)
                                            break;
                                        var rDateTimePicker = $find(ctrl.ID.replace('_calendar', ''));
                                        if (rDateTimePicker != null && rDateTimePicker instanceof Telerik.Web.UI.RadDateTimePicker) {
                                            var temp = ctrl.value.split('/');
                                            var dt = new Date(temp[0], temp[1], temp[2], temp[3], temp[4], null, null);
                                            rDateTimePicker.set_selectedDate(dt);
                                            rDateTimePicker.get_timeView().setTime(dt.getHours(), dt.getMinutes(), 0, null);
                                        } else {
                                            var dt = ctrl.value.split('/');
                                            item.selectDate(dt);
                                        }
                                        break;
                                    case "hidden":
                                        var item = jCtrl;
                                        if (item != null) {
                                            item.val(Decode(ctrl.value));
                                        }
                                        break;
                                } // end switch
                            } //end if
                        }
                        catch (ex) {
                            ShowErrorMessage("An error occured while loading Autosave data");
                        }
                    }
                );

                CaptureChanges();


            }

            function GetSnapshotAndLoadIntoPageControls(autoSaveId, EditsAreByCurrentUser) {
                var data = useService ? autoSaveId : { autoSaveID: autoSaveId };
                $.ajax({
                    type: "POST",
                    url: Autosave_WebService_Get,
                    data: JSON.stringify(data),
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        "SetAnon": "true"
                    },
                    dataType: "json",
                    success: function (snapshot) {
                        if (!useService)
                            snapshot = snapshot.d;
                        if (snapshot != null) {
                            // show them the fetched data
                            ParseAndPopulate(snapshot.JSONStringOfSavedData);
                            FadeOutRecovery();
                            // place focus where 508 wants it
                            FocusOnNextElement($('div#feedbackDiv')[0]);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        PlatformConsole.log(jqXHR);
                        PlatformConsole.log(textStatus);
                        PlatformConsole.log(errorThrown);
                        ShowErrorMessage("An error occured while loading Autosave data");
                    }
                });
            }


            //function CleanForCurrentUser() {
            this.DiscardForCurrentUser = function () {
                if ($("[ID$='AutoSave_Activated']").val() == "true") {
                    var jsonData = {}; // reset 
                    jsonData.criteria = {};
                    jsonData.criteria.UserId = $("[ID$='AutoSave_UserId']").val();
                    jsonData.criteria.PageId = $("[ID$='AutoSave_PageId']").val();
                    if (null != $("[ID$='AutoSave_ResourceValue']").val() && "" != $("[ID$='AutoSave_ResourceValue']").val()) {
                        jsonData.criteria.ResourceValue = $("[ID$='AutoSave_ResourceValue']").val(); // $("**#<%= ResourceValue.ClientID %>**").text();
                    }
                    if (null != $("[ID$='AutoSave_ResourceTypeCode']").val() && "" != $("[ID$='AutoSave_ResourceTypeCode']").val()) {
                        jsonData.criteria.ResourceTypeCode = $("[ID$='AutoSave_ResourceTypeCode']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                    }
                    if (null != $("[ID$='AutoSave_ResourceInstance']").val() && "" != $("[ID$='AutoSave_ResourceInstance']").val()) {
                        jsonData.criteria.ResourceInstance = $("[ID$='AutoSave_ResourceInstance']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                    }
                    if (null != $("[ID$='AutoSave_ViewParams']").val() && "" != $("[ID$='AutoSave_ViewParams']").val()) {
                        jsonData.criteria.ViewParams = $("[ID$='AutoSave_ViewParams']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                    }
                    $.ajax({
                        type: "POST",
                        url: Autosave_WebService_CleanForCurrentUser,
                        headers: {
                            "SetAnon": "true"
                        },
                        data: JSON.stringify(jData),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (snapshots) {
                            PlatformConsole.log("Cleaned up the no-longer-needed/wanted snapshots");
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            PlatformConsole.log(jqXHR + " : " + textStatus + " : " + errorThrown);
                            ShowErrorMessage("An error occured while clearing Autosave data for current user.");
                        }
                    });
                }
            }

            this.DiscardForAllUsers = function () {
                if ($("[ID$='AutoSave_Activated']").val() == "true") {
                    var jsonData = {}; // reset 
                    jsonData.criteria = {};
                    jsonData.criteria.PageId = $("[ID$='AutoSave_PageId']").val();
                    if (null != $("[ID$='AutoSave_ResourceValue']").val() && "" != $("[ID$='AutoSave_ResourceValue']").val()) {
                        jsonData.criteria.ResourceValue = $("[ID$='AutoSave_ResourceValue']").val(); // $("**#<%= ResourceValue.ClientID %>**").text();
                    }
                    if (null != $("[ID$='AutoSave_ResourceTypeCode']").val() && "" != $("[ID$='AutoSave_ResourceTypeCode']").val()) {
                        jsonData.criteria.ResourceTypeCode = $("[ID$='AutoSave_ResourceTypeCode']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                    }
                    if (null != $("[ID$='AutoSave_ResourceInstance']").val() && "" != $("[ID$='AutoSave_ResourceInstance']").val()) {
                        jsonData.criteria.ResourceInstance = $("[ID$='AutoSave_ResourceInstance']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                    }
                    if (null != $("[ID$='AutoSave_ViewParams']").val() && "" != $("[ID$='AutoSave_ViewParams']").val()) {
                        jsonData.criteria.ViewParams = $("[ID$='AutoSave_ViewParams']").val(); // $("**#<%= ResourceTypeCode.ClientID %>**").text();
                    }
                    $.ajax({
                        type: "POST",
                        url: Autosave_WebService_CleanForAllUsers,
                        data: JSON.stringify(jData),
                        headers: {
                            "SetAnon": "true"
                        },
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (snapshots) {
                            PlatformConsole.log("Cleaned up the no-longer-needed/wanted snapshots");
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            PlatformConsole.log(jqXHR + " : " + textStatus + " : " + errorThrown);
                        }
                    });
                }
            }

            //function DeletePreviousSnapshot(autoSaveId, row) {
            function DeletePreviousSnapshot(autoSaveId, row) {
                var data = useService ? autoSaveId : { autoSaveID: autoSaveId };
                $.ajax({
                    type: "POST",
                    url: Autosave_WebService_Delete,
                    data: JSON.stringify(data),
                    headers: {
                        "SetAnon": "true"
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (result) {
                        // clear the hidden save id and feedback row for the snapshot we just deleted
                        $("[ID$='AutoSaveId']").val("");
                        if (null != row) {
                            $(row).remove();
                        }
                        jsonExistingAutoSaveSnapshots.forEach(
                            function (element, index, array) {
                                if (element.AutoSaveId == autoSaveId) {
                                    array.splice(index, 1);
                                }
                            }
                        );
                        // if they just deleted the only snapshot
                        if (jsonExistingAutoSaveSnapshots.length == 0) {
                            ClearRecovery(); // clear the feedback div since there are no more snaphot rows to show
                            // place focus where 508 wants it
                            FocusOnNextElement($('div#feedbackDiv')[0]);
                        } else {
                            GiveChoicesForExistingEdits(jsonExistingAutoSaveSnapshots);
                        }

                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        PlatformConsole.log(jqXHR);
                        PlatformConsole.log(textStatus);
                        PlatformConsole.log(errorThrown);
                        ShowErrorMessage("An error occured while deleting Autosave data");
                    }
                });
            }


            function AutoResumeEdits(existingAutoSaveSnapshots) {
                $.each(existingAutoSaveSnapshots, function (i, snapshot) {
                    if (snapshot.EditsAreByCurrentUser) {
                        LoadSnapshot(snapshot.AutoSaveId, snapshot.EditsAreByCurrentUser);
                    }
                });
            }

            function GiveChoicesForExistingEdits(existingAutoSaveSnapshots) {

                var tmpModel = {
                    model: {
                        rows: []
                    }
                };
                var hasResume = false;
                $.each(existingAutoSaveSnapshots, function (i, snapshot) {

                    var concurrencyDate = new Date(parseInt(snapshot.ConcurrencyDate.replace("/Date(", "").replace(")", "")));
                    var userName = snapshot.UserName;
                    if (snapshot.EditsAreByCurrentUser) {
                        userName = "(you)";
                    }
                    var itemModel = {
                        dateValue: concurrencyDate,
                        UserNameValue: userName,
                        Links: []
                    };
                    var createLink = function (id, href, onClick, text) {
                        return {
                            Id: id,
                            Href: href,
                            OnClick: onClick,
                            Text: text
                        };
                    }
                    itemModel.Links.push(createLink("Resume_" + i, "#", "javascript:REISys.Platform.Web.AutoSave.LoadSnapshot('" + snapshot.AutoSaveId + "', " + snapshot.EditsAreByCurrentUser + " );", "Recover"));
                    if (snapshot.EditsAreByCurrentUser) {
                        itemModel.Links.push(createLink("Discard_" + i, "#", "javascript:REISys.Platform.Web.AutoSave.DeletePreviousSnapshot('" + snapshot.AutoSaveId + "', " + "'div#row_" + i + "');return false;", "Discard"));
                    }
                    tmpModel.model.rows.push(itemModel);
                    hasResume = true;
                })

                $(feedbackDiv).addClass('autosavebase');
                var node = document.getElementById('feedbackDiv');
                ko.applyBindings(tmpModel, node);

                if (hasResume && $('span#Resume_0 a')[0])
                    $('span#Resume_0 a')[0].focus();
            }

            function unapplyBindings($node, remove) {
                // unbind events
                $node = $($node);
                $node.find("*").each(function () {
                    //$(this).unbind();
                    $(this).removeAttr("data-bind");
                });

                // Remove KO subscriptions and references
                if (remove) {
                    ko.removeNode($node[0]);
                } else {
                    ko.cleanNode($node[0]);
                }
            };

            function ContinueWithPreviousSnapshot() {
                // remove the feedback message
                ClearRecovery();
                FocusOnNextElement($(feedbackDiv)[0]);
            }

            function FocusOnNextElement(afterThisElement) {
                if (!afterThisElement) {
                    return;
                }

                var allElements = document.getElementsByTagName('*');
                var elementListLength = allElements.length;

                var found = false;
                var focusedElement = false;
                var start = 0;

                for (var i = 0; i < elementListLength - 1; i++) { // length -1 keeps us from finding our starting object at the end and attempting to set focus out of bounds
                    if (allElements[i] == afterThisElement) {
                        found = true;
                        start = i + 1;
                        break;
                    }
                }

                for (var i = start; i < elementListLength - 1; i++) {
                    try {
                        allElements[i].focus();
                    }
                    catch (e) {
                        //fail silently for IE8;
                    }
                    if (document.activeElement === allElements[i]) {
                        break;
                    }
                }

                if (i == allElements.length - 1) {
                }
            }

            //The following function initializes variables which are defined above to make a call to the service.
            function SavePageData(jData) { // jData is a {} array ultimately passed in from SavePageValues
                var message = "Create";
                var svcUrl = Autosave_WebService_Create; //AutoSaveWebRoot + "Platform/WebServices/AutoSaveWebService.svc/Create";
                if (null != $("[ID$='AutoSaveId']").val() && "" != $("[ID$='AutoSaveId']").val()) {
                    jData.autoSaveData.Id = $("[ID$='AutoSaveId']").val();
                    message = "Update";
                    svcUrl = Autosave_WebService_Update; //AutoSaveWebRoot + "Platform/WebServices/AutoSaveWebService.svc/Update";
                }
                var time = new Date($.now());
                try {
                    var nextTime = parseInt($("[ID$='AutoSave_TimerInterval']").val());
                    time.setSeconds(time.getSeconds() + nextTime / 1000);
                }
                catch (e) {
                }
                time.setTime(time.getTime() - secDiff);
                NextAutoSaveTime = time;
                $.ajax({
                    type: "POST",
                    url: svcUrl,
                    data: JSON.stringify(jData),
                    headers: {
                        "SetAnon": "true"
                    },
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (autoSaveResults) {
                        if (!useService)
                            autoSaveResults = autoSaveResults.d;
                        // if session times out show popup otherwise continue                                    
                        if (!autoSaveResults.IsUserLoggedIn) {
                            //ShowSessionTimeOutWarning();
                            ShowErrorMessage("Autosave has detected that you are NOT logged in, and therefore it cannot automatically save your data entries. Please login to the system to proceed.");
                            $("[ID$='AutoSave_Activated']").val("false");
                        }
                        else {
                            dirtyData = false;
                            OnAutoSave(autoSaveResults.AutoSaveId);
                            if (validationMessageVisible) {
                                ShowErrorMessage("");
                            }
                        }
                    },
                    error: function (result) { // When Service call fails
                        PlatformConsole.log('Service call to ' + message + ' autosave snapshot failed: ' + result.status + '' + result.statusText);
                        ShowErrorMessage("An error occurred while saving data using Autosave");
                    }
                });
            }

            function OnAutoSave(autoSaveId, autoSaveSkipped) {
                if (!autoSaveSkipped) {
                    $("[ID$='AutoSaveId']").val(autoSaveId);
                }
                var currentTime = new Date($.now());
                currentTime.setTime(currentTime.getTime() - secDiff);
                var msg = "Autosaved at <b>" + FormatTime(currentTime) + "</b> ET ";
                DisplayMessage(msg);
            }

            function FormatTime(date) {
                var ret = "";
                if (date instanceof Date) {
                    var hour = date.getHours();
                    hour = hour == 12 ? 12 : hour % 12;
                    ret = pad(hour, 2) + ":" + pad(date.getMinutes(), 2) + ":" + pad(date.getSeconds(), 2) + " " + (date.getHours() > 12 ? "P.M." : "A.M.");
                }
                return ret;
            }

            function FormatNextTime(seconds) {
                var ret = "";
                var sec = 0, min = 0, hr = 0;
                if (!isNaN(seconds)) {
                    if (seconds >= 3600) {
                        hr = Math.floor(seconds / 3600);
                        seconds -= hr * 3600;
                    }
                    if (seconds >= 60) {
                        min = Math.floor(seconds / 60);
                        seconds -= min * 60;
                    }
                    sec = seconds;
                    if (hr > 0)
                        ret += hr + " hr ";
                    if (min > 0)
                        ret += min + " min ";
                    if (sec > 0)
                        ret += sec + " sec ";
                }
                return ret;
            }

            function pad(n, width, z) {
                z = z || '0';
                n = n + '';
                return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
            }
            function GetImageHtml() {
                return "<img src='" + REISys.Platform.ImageRoot + "/autosave3.png' alt='Draft' />";
            }

            function DisplayMessage(msg) {
                var toolbar = Namespace(autosaveToolbarNameSpace);
                if ($("[ID$='IntervalType']").val().toLowerCase() == "continuous") {
                    var nextTime = $("[ID$='AutoSave_TimerInterval']").val();
                    try {
                        msg += "(Next in <b>" + FormatNextTime(parseInt(nextTime) / 1000) + "</b>)";
                    }
                    catch (e) { }
                }
                toolbar.SetMessage(msg, GetImageHtml());
                AutoSaveToolbarMessageTimer = setTimeout(function () {
                    toolbar.SetMessage('');
                    //DisplayNextAutoSaveTime(NextAutoSaveTime);                    
                }, autoSaveToolbarMessageTimeout * 1000);
                //clearTimeout(NextMessageTimer);
            }

            function DisplayNextAutoSaveTime(time) {
                if ($("[ID$='IntervalType']").val().toLowerCase() != "continuous")
                    return;
                var toolbar = Namespace(autosaveToolbarNameSpace);
                var msg = "Next autosave will be performed at " + time;
                toolbar.SetMessage(msg, GetImageHtml());
                var NextMessageTimer = setTimeout(function () {
                    toolbar.SetMessage('');
                }, autoSaveToolbarNextMessageTimeout * 1000);

            }

            // The CallService function sends requests to the service by setting data in $.ajax.
            // Function to call WCF  Service       

            function CallService(Type, Url, Data, ContentType, DataType) {
                $.ajax({
                    type: Type, //GET or POST or PUT or DELETE verb
                    url: Url, // Location of the service
                    data: Data, //Data sent to server
                    headers: {
                        "SetAnon": "true"
                    },
                    contentType: ContentType, // content type sent to server
                    dataType: DataType, //Expected data format from server
                    success: function (msg) { //On Successfull service call
                        ServiceSucceeded(msg);
                    },
                    error: ServiceFailed // When Service call fails
                });
            }

            // The following code checks the result.GetUserResult statement, so your result object gets the property your service method name + Result. Otherwise, it will give an error like object not found in Javascript.

            function ServiceSucceeded(result) {
                var msg = "Autosave performed at " + new Date($.now());
                $(feedbackDiv).html(msg);


                if (DataType == "json") {
                    resultObject = result.GetUserResult;

                    for (i = 0; i < resultObject.length; i++) {
                        PlatformConsole.log(resultObject[i]);
                    }
                }
            }

            function ServiceFailed(xhr) {
                PlatformConsole.log(xhr.responseText);

                if (xhr.responseText) {
                    var err = xhr.responseText;
                    if (err)
                        error(err);
                    else
                        error({
                            Message: "Unknown server error."
                        })
                }
                return;
            }

            function ClearRecovery() {
                $(feedbackDiv).removeClass('autosavebase');
                $(feedbackDiv).text('');
            }

            function FadeOutRecovery() {
                ClearRecovery();
            }
            function HasDirtyData() {
                return dirtyData;
            }
            function ShowSessionTimeOutWarning() {
                $('#divSessionTimoutWarning').overlay({
                    expose: {
                        color: '#000',
                        loadSpeed: 200,
                        opacity: 0.30
                    },
                    closeOnClick: false,
                    closeOnEsc: false,
                    load: true,
                    close: $('input[id*="btnLogin"]'),
                    onLoad: function () {
                        $('#exposeMask').show();
                        $('input[id*="btnLogin"]').focus();
                        $('input[id*="btnLogin"]').focusout(function () {
                            $('input[id*="btnLogin"]').focus();
                        });
                    },
                    onClose: function () {
                        $('input[id*="btnLogin"]').off('focusout');
                    }
                }).load();
            }

            function ShowErrorMessage(message, pass, title) {
                PlatformConsole.log(message);
                var passText = "YES"; //default
                var titleText = "";
                if (arguments.length > 1) {
                    passText = pass;
                }
                if (arguments.length > 2) {
                    titleText = title;
                }
                var customErrorPlaceHolder = false;
                var panel = $("[ID$='MessageUpdatePanel']");
                if (message != null && message != '') {
                    validationMessageVisible = true;
                    if ($(".valError").length == 0) {
                        panel.append("<div data-bind=\"template: { name: 'errorMessage', data: model }\"></div>");
                        var model = { model: { Icon: REISys.Platform.ImageRoot + "/val_msgheader.png", Messages: [{ Text: message }] } };
                        ko.applyBindings(model, panel[0]);
                        customErrorPlaceHolder = true;

                    }
                    else {
                        var li = "<li class='autosaveli'>" + message + "</li>";
                        if ($(".valError li.autosaveli").length == 0)
                            $(".valError").append(li);
                    }
                }
                else {
                    validationMessageVisible = false;
                    $(".valError li.autosaveli").remove();
                    if ($(".valError li").length == 0) {
                        $(".errorMessagePlaceholder").hide(); // ko binded error placeholder
                    }
                }

                //if (validaitonInvoker !== null) {
                //    if (message != null && message != '') {
                //        var validationObject = new ReiSys.BusinessLayer.BusinessLogic.Validation.ValidationResult();
                //        if (validationObject != null) {
                //            validationObject.PopulateInvalid(message, null, passText);
                //            validationObject.Image = null;
                //            validaitonInvoker.ValidationRenderer.RenderValidations(new Array(validationObject));
                //            validationMessageVisible = true;
                //        }
                //    }
                //    else {
                //        validaitonInvoker.ValidationRenderer.RenderValidations(new Array());
                //    }
                //}
            }
        }),
        LoadSnapShot: {},
        DeletePreviousSnapshot: {},
        TriggerSaveAndTimer: {},
        CaptureChanges: {},
        UnCaptureChanges: {},
        TriggerTimer: {},
        FadeOutRecovery: {},
        HasDirtyData: {},
        SavePageValues: {},
        DiscardForAllUsers: {},
        DiscardForCurrentUser: {}
    }
});