setupTimeOut((lngTimeOut-lngTimeOutWarning)*60*1000);
var timerId;
function setupTimeOut(curTimeOut){	
	timerId = window.setTimeout('OpenPopup(strRoot + "TimeoutMsg.asp?lA=" + datLastAccess,400, 600, "winTimeout")', curTimeOut);   
}
function resetTimeOut(){	
	clearTimeout(timerId);	setupTimeOut((lngTimeOut-lngTimeOutWarning)*60*1000);
}	



function fnClientGoButtonClick(button, clientID) {
    try {
        var control = $('#' + clientID);

        if ($("option:selected", control).attr('actionoption') != null && $("option:selected", control).attr("enablesubsequentevents") != null) {
            if ($("option:selected", control).attr('actionoption') == "DoPostBack" && $("option:selected", control).attr("enablesubsequentevents").toLowerCase() == "false") {
                fnDisable(button);
            }
        }
    } catch (ex) {
        PlatformConsole.log('fnClientGoButtonClick:' + ex);
    }
}

function fnClientPageActionsExecuteClientScript(button, clientID) {
    var control = $('#' + clientID);
    var actionOption = '';
    var clientSideScript = '';
    var returnValue = true;
    try {
        if ($("option:selected", control).attr('actionoption') != null) {
            actionOption = $("option:selected", control).attr('actionoption');
            if (actionOption != undefined && actionOption == 'JavaScript') {
                clientSideScript = $("option:selected", control).attr('ClientSideScript');
                var tmpFunc = new Function(clientSideScript);
                returnValue = tmpFunc();
            }
        }
        fnClientGoButtonClick(this, clientID);
    } catch (ex) {
        PlatformConsole.log('fnClientPageActionsExecuteClientScript.' + ex + ' ' + actionOption + ' ' + clientSideScript);
    }

    return false;
}

function fnDisable(control) {
    if (validaitonInvoker.ErrorsOnPage === undefined || validaitonInvoker.ErrorsOnPage === 0) {
        setTimeout(function () {
            $(control).attr('disabled', 'disabled');
            $(control).removeClass('hrsaSkinnedButton');
            $(control).addClass('hrsaSkinneddisbled');
        }, 10);
    }
}