/// <reference path="../jquery.js" />
/// <reference path="../script.js" />
/// <reference path="../plugins/tipsy.js" />
/// <reference path="../plugins/truncate.js" />
/// <reference path="../lib/PlatformLib.js" />

// Function to create namespaces.
function newfilernamespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';
    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    return parent;
}

///////////////////////////////////////////////////////////////////////////////////////
// creates the name space for contributions
var filerNS = newfilernamespace('REISys.Platform.Web.Filer');

///////////////////////////////////////////////////////////////////////////////////////
///  Test method for the upload service
///
filerNS.uploadQuickNote = function () {
    try {
        var unfiledNoteId = urlNS.GetGuid();
        var subject = $('input[id*=txtQuickNoteSubject]')[0].value;
        var bodyAsString = "";
        var body = $('input[id*=txtQuickNoteDetail]')[0].value;
        var valid = filerNS.validate();
        
        if (body != undefined) {
            bodyAsString = JSON.parse(body).valueAsString;
        }

        if (valid) {
            var result = filerNS.uploadQuickNoteItem(unfiledNoteId, subject, bodyAsString, REISys.Platform.CurrentUserId);
            filerNS.showSuccessMessage();
            setTimeout(function () { $('.toolbar_note_menu').fadeOut(filerNS.clearInputs) }, 3000);
        }
    }
    catch (err) {
        console.log("filerNS.uploadQuickNote error:" + err);
    }
    return false;
}


///////////////////////////////////////////////////////////////////////////////////////
/// Upload a note to the EPS File Note Upload service.
/// 
filerNS.uploadQuickNoteItem = function (unfiledNoteId, subject, body, userId) {
    var serviceUrl = urlNS.GetUrl('815A84F5-726A-455A-8682-F9C0ABEEE9E6') + '/UploadQuickNoteItem';
    var noteItemData = { "UnfiledNoteId": unfiledNoteId, "Subject": subject, "Body": body, "CreatorId": userId };
    var result = false;
//    serviceUrl = serviceUrl.replace("http:", "https:");
    var noteItemStr = '{"item":' + JSON.stringify(noteItemData) + '}';
//    if (!urlNS.IsSSL()) {
//        alert('filerNS.uploadQuickNoteItem. Enable SSL');
//    } else {
        $telerik.$.ajax({
            type: "POST",
            dataType: "json",
            url: serviceUrl,
            async: false,
            contentType: 'application/json; charset=utf-8',
            data: noteItemStr,
            success: function (html) {
                result = html;
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("filerNS.uploadQuickNoteItem error: " + textStatus + " - " + errorThrown + " - " + data);
            }
        });
//    }
    return result;
}

///////////////////////////////////////////////////////////////////////////////////////
/// Validation, updates layout accordingly
/// 
filerNS.validate = function () {
    filerNS.resetLayout();
    // These two id's are retrieved from the script in the QuickNoteToast.ascx file.
    var subject = $find(quickNote.idList.subject).get_value();
    var detailValue = $find(quickNote.idList.detail).get_value();
    subject = subject.trim();
    detailValue = detailValue.trim();
    var numErrors = 0;

    if (subject === "") {
        $('#subjectError').show();
        numErrors++;
    }

    if (detailValue === "") {
        $('#detailError').show();
        numErrors++;
    }

    filerNS.adjustForErrors(numErrors);

    return (numErrors === 0);
}

filerNS.resetLayout = function () {
    $('.toolbar_note_menu').css('height', '260px');
    $('#subjectError').hide();
    $('#detailError').hide();
    $('#noteSuccessMsg').hide();
    $('#divHideNoteArea').show();
    $('.toolbar_note:first').focus();
}

filerNS.showSuccessMessage = function () {
    $('#noteSuccessMsg').show();
    $('#divHideNoteArea').hide();
    $('.toolbar_note_menu').css('height', '100px');
}

filerNS.clearInputs = function () {
    // These two id's are retrieved from the script in the QuickNoteToast.ascx file.
    $find(quickNote.idList.subject).clear();
    // Must clear twice in order to get the character count label to update.
    $find(quickNote.idList.detail).clear();
    $find(quickNote.idList.detail).clear();

    filerNS.resetLayout();
}

filerNS.adjustForErrors = function (numErrors) {
    var flyoutHeight = $('.toolbar_note_menu').height();
    var errorHeight = $('#subjectError').height();
    $('.toolbar_note_menu').css('height', flyoutHeight + (numErrors * errorHeight));
}