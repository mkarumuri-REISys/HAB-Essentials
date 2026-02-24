/// <reference path="../ExternalTS/jquery.d.ts" />
var Platform;
(function (Platform) {
    var UI;
    (function (UI) {
        var PFMCkEditor = (function () {
            function PFMCkEditor() {
            }
            PFMCkEditor.LoadCkEditorControls = function (items) {
                items.forEach(function (item) {
                    CKEDITOR.replace(item[0], {
                        //toolbarGroups: [
                        //    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                        //    { name: 'links' },
                        //    { name: 'clipboard', groups: ['clipboard', 'undo'] }		// Group's name will be used to create voice label.
                        //],
                        toolbarGroups: [
                            { name: 'document', items: ['Source', '-', 'Print'] },
                            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
                            { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
                            //{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
                            '/',
                            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
                            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
                            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                            { name: 'insert', items: ['Table', 'SpecialChar'] },
                            '/',
                            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                            { name: 'colors', items: ['TextColor', 'BGColor'] },
                            { name: 'tools', items: ['Maximize'] },
                            {
                                name: 'about', items: ['InsertDate', 'InsertTime'] //'About',
                            }
                        ],
                        on: {
                            instanceReady: function () {
                                PFMCkEditor.CkEditorTextCount(item[0], item[1]);
                            },
                            key: function () {
                                setTimeout(function () {
                                    PFMCkEditor.CkEditorTextCount(item[0], item[1]);
                                }, 1);
                            },
                            paste: function () {
                                setTimeout(function () {
                                    PFMCkEditor.CkEditorTextCount(item[0], item[1]);
                                }, 1);
                            }
                        }
                    });
                });
            };
            PFMCkEditor.ExtractContent = function (s, space) {
                var span = document.createElement('span');
                span.innerHTML = s;
                if (space) {
                    var children = span.querySelectorAll('*');
                    for (var i = 0; i < children.length; i++) {
                        if (children[i].textContent)
                            children[i].textContent += ' ';
                        else
                            children[i].innerText += ' ';
                    }
                }
                return [span.textContent || span.innerText].toString().replace(/ +/g, ' ').trim();
            };
            PFMCkEditor.CkEditorTextCount = function (ckEditorTextId, maxLength) {
                var data = CKEDITOR.instances[ckEditorTextId].getData();
                var lblCharacterCountId = ckEditorTextId + "lbl";
                var content = PFMCkEditor.ExtractContent(data, false).trim();
                var contentLength = content.length;
                var objCnt = createObject(lblCharacterCountId);
                var goodMessage = 'Approximately 2 pages <a class="tooltip assistance-inline-icon" onkeypress="OnEnterKeyPressInfoIcon(event);" title="This estimation is based on 12 points font size, Arial font style, Without Spaces and Page Setup of 1 inch from top, bottom, left, and right margins." tabindex="0" > <span class="hidden-offscreen"> This estimation is based on 12 points font size, Arial font style, Without Spaces and Page Setup of 1 inch from top, bottom, left, and right margins.</span></a><span> (Max {1} Characters without spaces): </span><span class="colbd">{2}</span> Characters left.';
                var warningMessage = '<span class="fielderr_info"> Warning! You have exceeded the maximum limit of {1} characters by <span class="colbd">{2}</span> (without spaces).</span> ';
                var diff;
                if (maxLength < contentLength) {
                    diff = contentLength - maxLength;
                    objCnt.innerHTML = warningMessage.replace("{1}", maxLength).replace("{2}", diff);
                }
                else {
                    diff = maxLength - contentLength;
                    objCnt.innerHTML = goodMessage.replace("{1}", maxLength).replace("{2}", diff);
                }
            };
            PFMCkEditor.GetData = function (controlId) {
                return CKEDITOR.instances[controlId].getData();
            };
            PFMCkEditor.SetData = function (controlId, data) {
                CKEDITOR.instances[controlId].setData(data);
            };
            PFMCkEditor.GetPlainData = function (controlId) {
                var data = CKEDITOR.instances[controlId].getData();
                return PFMCkEditor.ExtractContent(data, false).trim();
            };
            return PFMCkEditor;
        }());
        UI.PFMCkEditor = PFMCkEditor;
    })(UI = Platform.UI || (Platform.UI = {}));
})(Platform || (Platform = {}));
