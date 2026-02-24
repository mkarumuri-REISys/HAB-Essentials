
var isNS4		= (document.layers)? true : false;
var isIE4		= (document.all && !document.getElementById)? true : false;
var isIE5		= (document.all && document.getElementById)? true : false;
var isNS6		= (!document.all && document.getElementById)? true : false;


document.cookie = "javascript=true";

// Update the label to display the remaining number of characters allowed.
function taCount(taObj,lblCharacterCount, maxL) {
    objCnt=createObject(lblCharacterCount);
    objVal=taObj.value;
	var diff;
	if (maxL < objVal.length)
	{
	   diff = objVal.length-maxL;
       objCnt.innerHTML = "<font color='red'> Warning! You have exceeded the maximum limit of " + maxL +" characters by " + diff + "</font>";
	}	
	else
	{
	diff = maxL-objVal.length;
	objCnt.innerText = "You have " + diff + " characters remaining out of maximum limit of " + maxL;
	}
	    	
	return true;
}
function createObject(objId) {
    if (document.getElementById) return document.getElementById(objId);
	else if (document.layers) return eval("document." + objId);
	else if (document.all) return eval("document.all." + objId);
	else return eval("document." + objId);
}

function CheckDropdownForOpen(selDropdown, ehbPath,epsUrl){
	var objOption;
	var arrPageAttr;
	var blnOpenAsPopup;
	var strURL;
	
	objOption = selDropdown.options[selDropdown.selectedIndex];		
	arrPageAttr = objOption.value.split("|");
	blnOpenAsPopup = arrPageAttr[0];

	if (arrPageAttr[3] == "isEPS" && epsUrl != null && epsUrl!="") {
	    strURL = epsUrl + arrPageAttr[2];
	}
	else {
	    strURL = ehbPath + arrPageAttr[2];
	}
	if (arrPageAttr.length <= 1)
	    return false;
	if (blnOpenAsPopup == "true") {
	    //strURL = arrPageAttr[1] + arrPageAttr[2];
		OpenPopup(strURL, 600, 980);
		return(false);
	}
	else
	{
	    document.location.href = strURL;
	    //if (ehbPath)
	    //{
	    //    document.forms[0].action = ehbPath;
	    //    document.forms[0].submit();
	    //}
		return(true);
	}	
}
	
function OpenPopup(strURL, lngHeight, lngWidth, strWindowName){
	var objNewWindow;
	if(!strWindowName) {
		strWindowName = "GemsPopup"
	}	
	objNewWindow = window.open(strURL,strWindowName , "status=yes,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,height=" +  lngHeight + ",width=" + lngWidth);
	objNewWindow.focus();
}

function OpenPopupWithMenuBar(strURL, lngHeight, lngWidth, strWindowName){
	var objNewWindow;
	if(!strWindowName) {
		strWindowName = "GemsPopup"
	}	
	objNewWindow = window.open(strURL,strWindowName , "status=yes,resizable=yes,scrollbars=yes,toolbar=yes,menubar=yes,location=no,height=" +  lngHeight + ",width=" + lngWidth);
	objNewWindow.focus();
}

function characterLimit(intCharacter)
{	
	var characterObj = event.srcElement;
	if (characterObj.value.length==intCharacter) 
		return false;
}

function characterCount(visCnt, intCharacter) 
{	
	var characterObj=event.srcElement;
	if (characterObj.value!=null) {
	    if (characterObj.value.length>intCharacter*1) 
		    characterObj.value=characterObj.value.substring(0,intCharacter*1);
	    if (visCnt) 
		    visCnt.innerText=intCharacter-characterObj.value.length;
    }
}


function getElement(name)
{
	var value = null;
	if(isIE4 || isIE5){
		value = document.all(name);
	}else if (isNS6){
		value = document.getElementById(name);
	}
	return value;
}

function SelectCheckBox(chkBoxName)
{
	var chkBox = getElement(chkBoxName);
	
	if(null != chkBox && !(chkBox.checked))
	{
		chkBox.checked = true;
	}

}

function ClearRadioButtons(chkBoxName, chkBoxID)
{
	var chkBox		= getElement(chkBoxName);
	var ChkBoxIdLen = "Q" + chkBoxID;

	if(null != chkBox && !(chkBox.checked))
	{
		var form		= getElement("form1");
		var listitems	= form.getElementsByTagName("input");
		for (i=0; i<listitems.length; i++)
		{
			if(listitems[i] != null && listitems[i].name != null && listitems[i].name.indexOf(chkBoxID) > 0)
			{
				listitems[i].checked = false;
			}
		}
	}
	
}

function autotab(cur_field, char_max, next_field)
{  
	if (cur_field.value.length == char_max)
	{
		next_field.focus();
	}
}

function validateFaxPurpose(objPurpose, objErrorMsg, strNumber)
{
	var strPurpose;
	strPurpose = objPurpose.value;
	if (strPurpose == "0")
	{
		if (strNumber.length == 0)
		{	
			objErrorMsg.style.display="none";
			return true;
		}
		else
		{	
			objErrorMsg.style.display="inline";
			return false;
		}
	}
	else
	{
		objErrorMsg.style.display="none";
		return false;
	}
}

function validatePhonePurpose(objPurpose, objErrorMsg, strNumber, strExtn)
{
	var strPurpose;
	strPurpose = objPurpose.value;
	if (strPurpose == "0")
	{
		if (strExtn.length == 0 && strNumber.length == 0)
		{	objErrorMsg.style.display="none";
			return false;
		}else
		{	objErrorMsg.style.display="inline";
			return true;
		}
	}
	else
	{
		objErrorMsg.style.display="none";
		return true;
	}
}

function hidePurposeError(curObj, objErrorMsg)
{	
	var strPurpose, i;
	for (i = 0; i < curObj.length; i++) 
	{
		if (curObj[i].selected) 
		{
			strPurpose = curObj[i].value;
		} 
	}
	if (strPurpose != "0")
	{
		objErrorMsg.style.display="none";
		return true;
	}
}

function formatCurrency(num) 
{
    num = num.toString().replace(/\$|\,/g,'');
    
    if(isNaN(num))
        num = "0";
    
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num = Math.floor(num/100).toString();
    
    if(cents<10)
        cents = "0" + cents;
    
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
        num = num.substring(0,num.length-(4*i+3))+','+
    
    num.substring(num.length-(4*i+3));
    
    return (((sign)?'':'(') + '$' + num + '.' + cents + ((sign)?'':')'));
}
    
function unformatCurrency(num)
{
    var noJunk = "";
    var withDollar = "";
    var foundDecimal = 0;
    var foundAlphaChar = 0;
    var foundBraces = "";
    var sign = "";
    num += "";

    if (num == "") { return(0); }
    if(num.substring(0, 1) == '(' && num.substring(num.length-1, num.length) == ')')
        foundBraces = '-';
    else if(num.substring(0, 1) == '-')
        sign = '-';
    for (i=0; i <= num.length; i++)
    {
        var thisChar = num.substring(i, i+1);
        if (thisChar == ".")
        {
          foundDecimal = 1;
          noJunk = noJunk + thisChar;
        }
        if ((thisChar < "0") || (thisChar > "9"))
        {
          if ((thisChar != "$") && (thisChar !=".") && (thisChar != ",") && (thisChar != " ") && (thisChar !="")) foundAlphaChar = 1;
        }
        else
         {
            withDollar = withDollar + thisChar
            noJunk = noJunk + thisChar
         }

         if ((thisChar == "$") || (thisChar == ".") || (thisChar == ","))
         {
           withDollar = withDollar + thisChar
         }
      }
      if (foundDecimal) { return parseFloat(foundBraces + sign + noJunk); }
      else if (noJunk.length > 0) { return parseFloat(foundBraces + sign + noJunk); }
      else return 0;
}


var currentSectionIndex = 1;
function ShowSectionError(divSectionIndex)
{
    document.getElementById('divSection' + currentSectionIndex).style['display'] = "none";
    document.getElementById('divSection' + divSectionIndex).style['display'] = "inline";
    currentSectionIndex = divSectionIndex;
}

String.prototype.startsWith = function(str) {
    return (this.indexOf(str) === 0);
}