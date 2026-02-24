/* Used in old UI MasterPage.master.cs */



//JavaScript Document
//Copyright Kerberos Internet Services, CC; All rights reserved.
//info@kerberosb2b.com
//helpdesk@kerberosb2b.com
//http://www.kerberosb2b.com; http://www.kerberosdev.net
isIE4 = document.all ? true : false;
isIE6 = document.getElementById && document.all ? true : false;
isNS4 = document.layers ? true : false;
isNS6 = document.getElementById && !document.all ? true : false;
//Object & container prefixes
var DATE_CONTAINER_PREFIX = "DATE_CONTAINER";
var DATE_DISPLAY_PREFIX = "DATE_DISPLAY";
var DATE_BUTTON_PREFIX = "DATE_BUTTON";
var DATE_INPUT_PREFIX = "DATE_INPUT";
var DATE_DROPDOWN_PREFIX = "DATE_DROPDOWN";
var DATE_MONTHYEARDISPLAY_PREFIX = "DATE_MONTHYEARDISPLAY";
var DATE_HEADERTD_PREFIX = "DATE_HEADERTD";
var DATE_HEADERTR_PREFIX = "DATE_HEADERTR";
var DATE_WEEKTD_PREFIX = "DATE_WEEKTD";
var DATE_WEEKTR_PREFIX = "DATE_WEEKTR";
var DATE_DAY_PREFIX = "DATE_DAY";
var DATE_LINK_DAY_PREFIX = "DATE_LINK_DAY";
var DATE_LINK_MONTH_PREFIX = "DATE_LINK_MONTH";
var DATE_LINK_YEAR_PREFIX = "DATE_LINK_YEAR";
var DATE_SIMPLEEVENT_PREFIX = "DATE_SIMPLEEVENT";
//Reference Objects
var DatePicker_idGenerator = new IDGenerator(0);
var datePickerMap = new Object();
var datePickerIDGenerator = null;
//Date Picker Constants
var CSS_TITLE = "TITLE";
var CSS_NAV_YEAR = "NAV_YEAR";
var CSS_NAV_MONTH = "NAV_MONTH";
var CSS_DATE_TEXT = "DATE_TEXT";
var CSS_CALENDAR = "CALENDAR_BACKGROUND";
var CSS_DISPLAY_AREA = "DISPLAY_AREA";
var CSS_BUTTON = "BUTTON";
var CSS_BUTTON_TEXT = "BUTTON_TEXT";
var CSS_MOUSEOVER = "MOUSEOVER";
var CSS_MOUSESELECT = "MOUSESELECT";
var CSS_DATEHEADER_ROW = "DATEHEADERROW";
var CSS_DATEHEADER_CELL = "DATEHEADERCELL";
var CSS_DATEWEEK_ROW = "DATEWEEK_ROW";
var CSS_DATEWEEK_CELL = "DATEWEEK_CELL";
var CSS_DATEDAY = "DATEDAY";
var CSS_EVENT = "EVENT";

//Language Constants
if (!LinguaFranca){
	var LinguaFranca = new Object();
	LinguaFranca["EN"] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct","Nov", "Dec","No Date Selected","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
}
//Utility Functions
function IDGenerator(nextID){
	this.nextID = nextID;
	this.GenerateID = IDGeneratorGenerateID;
}
function IDGeneratorGenerateID(){
	return this.nextID++;
}
function getDOMObject (documentID){
	if (isIE4)return document.all[documentID];
	else if(isIE6)return document.getElementById(documentID);
	else if (isNS4)return document.layers[documentID];
	else if (isNS6)return document.getElementById(documentID);
}
function DatePicker_Util_getDayLimit(testDate){
	switch(testDate.getMonth()){
		case 0:	return 31;
		case 1:	return (testDate.getFullYear() % 4==0 ? 29:28);
		case 2:	return 31;
		case 3:	return 30;
		case 4:	return 31;
		case 5:	return 30;
		case 6:	return 31;
		case 7:	return 31;
		case 8:	return 30;
		case 9: return 31;
		case 10: return 30;
		case 11: return 31;
	}
}
function DatePicker_Util_getDayLimit_MonthID(testMonth, testYear){
	switch(testMonth){
		case 0:	return 31;
		case 1:	return (testYear % 4==0 ? 29:28);
		case 2:	return 31;
		case 3:	return 30;
		case 4:	return 31;
		case 5:	return 30;
		case 6:	return 31;
		case 7:	return 31;
		case 8:	return 30;
		case 9: return 31;
		case 10: return 30;
		case 11: return 31;
	}
}
function DatePicker (boundControl, returnFormat, displayFormat, scriptAction, width, returnNullDates, showWeekDays, ISOLanguageCode,LayoutOption){
	this.idGenerator = DatePicker_idGenerator;
	this.scriptAction = scriptAction;
	this.returnFormat = String(returnFormat).toLowerCase();
	this.displayFormat = String(displayFormat).toLowerCase();
	this.boundControl = boundControl;
	this.instantiated = false;
	this.width = '100%';
	this.height = "16px";
	this.layoutOption = LayoutOption;
	this.displayOption = 2;
	this.RTL = false;
	this.returnNullDate = false;
	this.showWeekDays = false;
	this.showYearNav = true;
	this.showMonthNav = true;
	this.simpleEvents = null;
	this.ISOLanguageCode = "EN";
	if (ISOLanguageCode) this.ISOLanguageCode = String(ISOLanguageCode).toUpperCase();
	if (showWeekDays == true ) this.showWeekDays = true;
	if (returnNullDates == true) this.returnNullDate = true;
	if (width) this.width = width;
	this.CSS_Title = "font: 12px verdana; text-decoration:none; color: #666666";
	this.CSS_NavYear = "font: bold 18px verdana; text-decoration:none; color: #FF0000";
	this.CSS_NavMonth = "font: bold 18px verdana; text-decoration:none; color: #0066CC";
	this.CSS_DateText = "font: 11px verdana; text-decoration:none; color: #666666";
	this.CSS_Calendar = "border: 1px solid #CCCCCC; background: #FFFFEE;";
	this.CSS_DisplayArea = "border:1px solid #CCCCCC; font: 10px verdana;";
	this.CSS_Button = "border:1px raised #CCCCCC; background-color: #EEEEEE; font: 14px arial";
	this.CSS_ButtonText = String.fromCharCode(9698);
	this.CSS_Mouseover = "background: #0000FF";
	this.CSS_Mouseselect = "background: #FF0000";
	this.CSS_DateHeaderTD = "";
	this.CSS_DateHeaderTR = "";
	this.CSS_DateWeekTD = "font: bold 10px verdana; text-decoration:none; color: #000000";
	this.CSS_DateWeekTR = "";
	this.CSS_DateDay = "";
	this.CSS_SimpleEvent = "font: bold 10px verdana; text-decoration:none; color: #FF0000";
	this.NavYearPrevious = "&lt;";
	this.NavYearNext = "&gt;";
	this.NavMonthPrevious = "&lt;";
	this.NavMonthNext = "&gt;";
	this.NavNull = "X";
	this.zOrderProblemElements = new Array();
	this.currentDate = new Date();
	this.isNullDate = false;
	this.isPickerVisible = false;
	this.getLayout = DatePicker_GetLayout;
	this.getDisplayOption = DatePicker_GetDisplayOption;
	this.Instantiate = DatePicker_Instantiate;
	this.parseInitDateString = DatePicker_parseInitDateString;
	this.parseDateString = DatePicker_parseDateString;
	this.displayDate = DatePicker_DisplayDate;
	this.getMonthName = DatePicker_GetMonthName;
	this.getDayLimit = DatePicker_GetDayLimit;
	this.show = DatePicker_ShowPicker;
	
	this.hide = DatePicker_HidePicker;
	
	this.setCSSAttribute = DatePicker_SetCSSAttribute;
	this.isSimpleEvent = DatePicker_IsSimpleEvent;
	this.setSimpleEvents = DatePicker_SetSimpleEvents;
	this.addZOrderElement = DatePicker_addZOrderElement;
	this.toggleZOrderElements = DatePicker_toggleZOrderElements;
	this.showDate = true;
}
function DatePicker_addZOrderElement(elementName){
	this.zOrderProblemElements.push(elementName);
}
function DatePicker_toggleZOrderElements(showAction){
	for (zO = 0; zO < this.zOrderProblemElements.length; zO += 1){
		getDOMObject(this.zOrderProblemElements[zO]).style.visibility = showAction == true ? 'visible' : 'hidden';
	}
}
function DatePicker_IsSimpleEvent(checkDate){
	if (this.simpleEvents == null) return "";
	var checkMonth = this.currentDate.getMonth();
	var checkYear = this.currentDate.getFullYear();
	for (xi = 0; xi < this.simpleEvents.length; xi++){
		if (checkDate == new Date(this.simpleEvents[xi][0]).getDate() && checkMonth == new Date(this.simpleEvents[xi][0]).getMonth() && String(this.simpleEvents[xi][2]).toLowerCase()=="true"){
			return this.simpleEvents[xi][1];
		}
		if (checkDate == new Date(this.simpleEvents[xi][0]).getDate() && checkMonth == new Date(this.simpleEvents[xi][0]).getMonth() && checkYear == new Date(this.simpleEvents[xi][0]).getFullYear() && String(this.simpleEvents[xi][2]).toLowerCase()=="false"){
			return this.simpleEvents[xi][1];
		}
	}
	return "";
}
function DatePicker_SetSimpleEvents(eventArray){
	this.simpleEvents = new Array();
	var rowArray = eventArray.split("||");
	for (i = 0; i < rowArray.length; i++){
		this.simpleEvents.push (rowArray[i].split("|"));
	}
}
function DatePicker_SetCSSAttribute(attribute, cssValue){
	switch (attribute){
		case CSS_TITLE:
			this.CSS_Title = cssValue;
			break;
		case CSS_NAV_YEAR:
			this.CSS_NavYear = cssValue;
			break;
		case CSS_NAV_MONTH:
			this.CSS_NavMonth = cssValue;
			break;
		case CSS_DATE_TEXT:
			this.CSS_DateText = cssValue;
			break;
		case CSS_CALENDAR:
			this.CSS_Calendar = cssValue;
			break;
		case CSS_BUTTON_TEXT:
			this.CSS_ButtonText = cssValue;
			break;
		case CSS_BUTTON:
			this.CSS_Button = cssValue;
			break;
		case CSS_DISPLAY_AREA:
			this.CSS_DisplayArea = cssValue;
			break;
		case CSS_MOUSEOVER:
			this.CSS_Mouseover = cssValue;
			break;
		case CSS_MOUSESELECT:
			this.CSS_Mouseselect = cssValue;
			break;
		case CSS_DATEHEADER_ROW:
			this.CSS_DateHeaderTR = cssValue;
			break;
		case CSS_DATEHEADER_CELL:
			this.CSS_DateHeaderTD = cssValue;
			break;
		case CSS_DATEWEEK_ROW:
			this.CSS_DateWeekTR = cssValue;
			break;
		case CSS_DATEWEEK_CELL:
			this.CSS_DateWeekTD = cssValue;
			break;
		case CSS_DATEDAY:
			this.CSS_DateDay = cssValue;
			break;
		case CSS_EVENT:
			this.CSS_SimpleEvent = cssValue;
			break;
	}
}
function DatePicker_GetLayout(){
	var dohtml = "#" + DATE_DROPDOWN_PREFIX + this.id + "{position:absolute; display:none; height: 164px; width:164px; " + this.CSS_Calendar + ";";
	switch (this.layoutOption){
		case 1: dohtml += "top:0px; left: " + this.width + ";"; break;
		case 2:	dohtml += "top:0px; left: -164px;";break;
		case 3: dohtml += "top:-164px; left: 0px;";break;break;
		case 4: dohtml += "top:" +this.height+ "; left: 0px;";break;break;
	}
	dohtml += "}";
	return dohtml;
}
function DatePicker_GetDisplayOption(){
	var lhtml = "";
	if (this.displayOption == 3)lhtml += "<input name='"+DATE_INPUT_PREFIX+this.id+"' id='"+DATE_INPUT_PREFIX+this.id+"' value='' onblur='datePickerMap["+this.id+"].parseDateString(this.value, \""+this.displayFormat+"\", true)' style='height:"+this.height+";width:100%; "+this.CSS_DisplayArea+";'>";
	return lhtml;
}
function DatePicker_Instantiate(){
	if (this.instantiated) {
		return;
	}
	this.id = this.idGenerator.GenerateID();
	datePickerMap[this.id] = this;
	datePickerIDGenerator = this.idGenerator;
	var html = "";
	html += "<STYLE>";
	html += "#" + DATE_CONTAINER_PREFIX + this.id + "{position: relative; width:" + this.width + "; height:"+this.height+"}";
	html += "#" + DATE_DISPLAY_PREFIX + this.id + "{height:"+this.height+";width:100%; "+this.CSS_DisplayArea+"}";
	html += this.getLayout();
	html += "#" + DATE_BUTTON_PREFIX + this.id + "{height:" + this.height+"; width:"+this.height+"; " + this.CSS_Button + ";}";
	html += "#" + DATE_HEADERTR_PREFIX + this.id + "{" + this.CSS_DateHeaderTR + "}";
	html += "#" + DATE_HEADERTD_PREFIX + this.id + "{width:14%; height:12%; text-align: center; vertical-align: middle;" + this.CSS_DateHeaderTD + "}";
	html += "#" + DATE_WEEKTR_PREFIX + this.id + "{" + this.CSS_DateWeekTR + "}";
	html += "#" + DATE_WEEKTD_PREFIX + this.id + "{width:14%; height:12%; text-align: center; vertical-align: middle;" + this.CSS_DateWeekTD + "}";
	html += "#" + DATE_DAY_PREFIX + this.id + "{width:14%; height:12%; text-align: center; vertical-align: middle;" + this.CSS_DateDay + "}";
	html += "#" + DATE_MONTHYEARDISPLAY_PREFIX + this.id + "{" + this.CSS_Title + "}";
	html += "#" + DATE_SIMPLEEVENT_PREFIX + this.id + "{display: block; width:100%; height:100%; " + this.CSS_SimpleEvent + "}";
	html += "#" + DATE_LINK_DAY_PREFIX + this.id + " {display:block; text-align: center; vertical-align: middle; width:20px; height:20px; " + this.CSS_DateText + ";}";
	html += "#" + DATE_LINK_DAY_PREFIX + this.id + ":hover {" + this.CSS_Mouseover + "}";
	html += "</STYLE>";
	/*--------------------ORIGINAL CODE-------------------------*/
	//html += "<DIV id='" + DATE_CONTAINER_PREFIX + this.id + "' name='" + DATE_CONTAINER_PREFIX + this.id + "'>";
	//html += "<TABLE cellpadding=0 cellspacing=0 border=0 " + (this.RTL ? "dir='RTL'" : "") + ">";	
	//html += "<TR><TD id='" + DATE_DISPLAY_PREFIX + this.id + "' name='" + DATE_DISPLAY_PREFIX + this.id + "' align='center' valign='middle' nowrap>";
	//html += this.getDisplayOption();
	//html += "</TD><TD width='"+this.height+"'>";
	//html += "<INPUT id='" + DATE_BUTTON_PREFIX + this.id + "' name='" + DATE_BUTTON_PREFIX + this.id + "' TYPE='button' VALUE='" + this.CSS_ButtonText + "' onClick='DatePicker_TogglePicker(" + this.id + ");' TITLE='Click to Open / Close'></TD></TR></TABLE>";
	//html += "<DIV id='" + DATE_DROPDOWN_PREFIX + this.id + "' name='" + DATE_DROPDOWN_PREFIX + this.id + "'></DIV>";
	//html += "</DIV>";
	/*----------------------------------------------------------*/
	/*--------------------NEW CODE HERE--------------------------*/
	html += "<SPAN id='" + DATE_CONTAINER_PREFIX + this.id + "' name='" + DATE_CONTAINER_PREFIX + this.id + "'>";
	html += "<INPUT id='" + DATE_BUTTON_PREFIX + this.id + "' name='" + DATE_BUTTON_PREFIX + this.id + "' TYPE='button' VALUE='" + this.CSS_ButtonText + "' onClick='DatePicker_TogglePicker(" + this.id + ");' TITLE='Click to Open / Close'>";
	html += "<DIV id='" + DATE_DROPDOWN_PREFIX + this.id + "' name='" + DATE_DROPDOWN_PREFIX + this.id + "'></DIV>";
	html += "</SPAN>";
	/*----------------------------------------------------------*/
	document.write (html);
	this.parseInitDateString();
	this.displayDate();
	this.instantiated = true;
}

//function DatePicker_GetXCoord(){
//	var curleftPos =  0;
//        var curtopPos = 0;
//		var Controlobj=document.getElementById(DATE_BUTTON_PREFIX + this.id);
//		this.getLayout = DatePicker_GetLayout;
//	if (Controlobj.offsetParent)
//        {
//         do {
//        	    curleftPos += Controlobj.offsetLeft;
//		        curtopPos += Controlobj.offsetTop;
//     	    }   while (Controlobj = Controlobj.offsetParent);
//        }
//return [curleftPos,curtopPos];
//}


function DatePicker_parseDateString(dateString, format, displayUpdate){
	//This line removed to accomadate not showing a blank text box on initialize.
	//if (dateString == "" || dateString == "undefined")return;
	if (String(dateString).toLowerCase() == "" && this.returnNullDate){
		this.isNullDate = true;
		if (displayUpdate) this.displayDate();
		return;
	}else if (String(dateString).toLowerCase() != "null"){
		if (String(format).toLowerCase() == "unix"){
			if (isNaN(dateString))return;
			this.currentDate.setTime(parseInt(dateString) * 1000);
			if (displayUpdate) this.displayDate();
			return;
		}else if (String(format).toLowerCase() == "mysql3"){
			if (isNaN(initialDateString))return;
			dateString = dateString.slice(0,4) + "/" + dateString.slice(4,6) + "/" + dateString.slice(6);
		}else{//Standardized return formats; JavaScript can only accept / as a delimeter
			dateString = dateString.replace(/[\-\@]/gi,"/");
		}
	}
	var newDate = new Date(dateString);
	if (!isNaN(newDate.getDate())){
		this.currentDate = new Date(dateString);
		if (displayUpdate) this.displayDate();
	}else{
		if (displayUpdate)alert("The date you entered is invalid");
		if (displayUpdate) this.displayDate();
		this.currentDate = new Date();
	}
}
function DatePicker_parseInitDateString(){
	var initialDateString = getDOMObject(this.boundControl).value;
	if (!this.showDate){
	initialDateString = this.currentDate;
	}
	this.parseDateString (initialDateString, this.returnFormat, false);
	return;
}

function DatePicker_DisplayDate(){
	var displayString = "";
	var returnString = "";
	var simpleEventString = "";
	if (this.isNullDate && this.returnNullDate){
		displayString = LinguaFranca[this.ISOLanguageCode][12] + "...";
		returnString = "";
	}else{
		displayString = getThisDateString(this.displayFormat, this);
		returnString = getThisDateString(this.returnFormat, this);
	}
	
	var html = "";
	html += "<table width='100%' height='100%' cellspacing='0' cellpadding='0' border='0'  " + (this.RTL ? "dir='RTL'" : "") + "><tr ID='" + DATE_HEADERTR_PREFIX + this.id + "'><td ID='" + DATE_HEADERTD_PREFIX + this.id + "' >";
	if (this.showYearNav) html += "<A HREF='javascript:DatePicker_DecrementYear(" + this.id + ")' STYLE='" + this.CSS_NavYear + "'>" + this.NavYearPrevious + "</A>";
	html += "</td><td ID='" + DATE_HEADERTD_PREFIX + this.id + "' >";
	if (this.showMonthNav) html += "<A HREF='javascript:DatePicker_DecrementMonth(" + this.id + ")' STYLE='" + this.CSS_NavMonth + "'>" + this.NavMonthPrevious + "</A>";
	html += "</td>";
	html += "<td ID='" + DATE_HEADERTD_PREFIX + this.id + "'  colspan='3'><SPAN id='" + DATE_MONTHYEARDISPLAY_PREFIX + this.id + "' name='" + DATE_MONTHYEARDISPLAY_PREFIX + this.id + "'>" + this.getMonthName() + "<BR/>" + this.currentDate.getFullYear() + "</SPAN></td>";
	html += "<td ID='" + DATE_HEADERTD_PREFIX + this.id + "' >";
	if (this.showMonthNav) html += "<A HREF='javascript:DatePicker_IncrementMonth(" + this.id + ")' STYLE='" + this.CSS_NavMonth + "'>" + this.NavMonthNext + "</A>";
	html += "</td><td ID='" + DATE_HEADERTD_PREFIX + this.id + "' >";
	if (this.showYearNav) html += "<A HREF='javascript:DatePicker_IncrementYear(" + this.id + ")' STYLE='" + this.CSS_NavYear + "'>" + this.NavYearNext + "</A>";
	html += "</td></tr>";
	var dayOffset = 0;
	if (this.showWeekDays){
		html += "<tr ID='" + DATE_WEEKTR_PREFIX + this.id + "'>";
		for (iDay = 13; iDay <= 19; iDay += 1)html += "<td ID='" + DATE_WEEKTD_PREFIX + this.id + "'>" + LinguaFranca[this.ISOLanguageCode][iDay].slice(0,1) + "</td>";
		html += "</tr>";
		var testDate = new Date();
		testDate.setDate(1);
		testDate.setMonth(parseInt(this.currentDate.getMonth()));
		testDate.setFullYear(parseInt(this.currentDate.getFullYear()));
		dayOffset = testDate.getDay();
	}
	for (i = 0; i < ((this.getDayLimit() + dayOffset) < 35 ? 5 : 6); i++){
		html += "<tr>";
		for (ii = 1; ii <= 7; ii++){
			if (ii-1 < dayOffset && i == 0){
				html += "<td ID='" + DATE_DAY_PREFIX + this.id + "'>&nbsp;</td>";
			}else{
				if ((i * 7 + ii - dayOffset) <= this.getDayLimit()){
					simpleEventString = this.isSimpleEvent (i*7+ii - dayOffset);
					html += "<td ID='" + DATE_DAY_PREFIX + this.id + "' >";
					html += "<A id='" + DATE_LINK_DAY_PREFIX + this.id + "' HREF='javascript:DatePicker_SetDay (" + this.id + "," + eval(i*7+ii - dayOffset) + ");' title=\"" + simpleEventString + "\" " + (!this.isNullDate && (i*7+ii - dayOffset) == this.currentDate.getDate() ? " STYLE='" + this.CSS_Mouseselect + "'" : "") + ">"+ (simpleEventString != "" ? "<DIV ID='" + DATE_SIMPLEEVENT_PREFIX + this.id + "'>"+eval(i*7+ii - dayOffset)+"</DIV>" : eval(i*7+ii - dayOffset) ) +"</a></td>";
				}else{
					if (this.returnNullDate && (i*7+ii - dayOffset) == this.getDayLimit()+1){
						html += "<td ID='" + DATE_DAY_PREFIX + this.id + "' COLSPAN='" + eval(7 - ii + 1 + 6 - dayOffset) + "' STYLE='text-align:right;'><A ID='" + DATE_LINK_DAY_PREFIX + this.id + "' HREF='javascript:DatePicker_SetDay (" + this.id + ", 32);' " + (this.isNullDate ? " STYLE='" + this.CSS_Mouseselect + "'" : "") + "> " + this.NavNull + "</a></td>";
					}else if (!this.returnNullDate){
						html += "<td ID='" + DATE_DAY_PREFIX + this.id + "'>&nbsp;</td>";
					}			
				}
			}
		}
		html += "</tr>";
	}
	html += "</table>";
	
	if (this.showDate){
		getDOMObject(this.boundControl).value = returnString;
	}
	getDOMObject(DATE_DROPDOWN_PREFIX+this.id).innerHTML = html;
	switch (this.displayOption){
		case 1: getDOMObject(DATE_DISPLAY_PREFIX+this.id).innerHTML = displayString; break;
		case 2: break; //Do Nothing
		case 3: getDOMObject(DATE_INPUT_PREFIX+this.id).value = displayString; break;
	}
	function getThisDateString(thisFormat, DPO){
		switch (String(thisFormat)){
			case "1":return eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getDate() + "/" + DPO.currentDate.getFullYear();
			case "2":return DPO.currentDate.getFullYear() + "." + eval(DPO.currentDate.getMonth()+1) + "." + DPO.currentDate.getDate();
			case "3":return DPO.currentDate.getDate() + "/" + eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getFullYear();
			case "4":return DPO.currentDate.getDate() + "-" + eval(DPO.currentDate.getMonth()+1) + "-" + DPO.currentDate.getFullYear();
			case "5":return DPO.currentDate.getDate() + "/" + eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getFullYear();
			case "6":return DPO.currentDate.getDate() + "." + eval(DPO.currentDate.getMonth()+1) + "." + DPO.currentDate.getFullYear();
			case "7":return DPO.currentDate.getFullYear() + "/" + eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getDate();
			case "8":return DPO.currentDate.getFullYear() + "/" + eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getDate();
			case "9":return eval(DPO.currentDate.getMonth()+1) + "-" + DPO.currentDate.getDate() + "-" + DPO.currentDate.getFullYear();
			case "10":return eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getDate() + "/" + DPO.currentDate.getFullYear();
			case "11":return DPO.currentDate.getDate() + "/" + eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getFullYear();
			case "12":return DPO.currentDate.getFullYear() + "/" + eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getDate();
			case "short":return eval(DPO.currentDate.getMonth()+1) + " / " + DPO.currentDate.getDate() + " / " + DPO.currentDate.getFullYear();
			case "long":return DPO.getMonthName() + " " + DPO.currentDate.getDate() + " " + DPO.currentDate.getFullYear();
			case "long2":return DPO.currentDate.getDate() + " " + DPO.getMonthName() + " " + DPO.currentDate.getFullYear();
			case "long3":return LinguaFranca[DPO.ISOLanguageCode][13 + DPO.currentDate.getDay()].slice(0,3) + ", " + DPO.currentDate.getDate() + " " + DPO.getMonthName() + " " + DPO.currentDate.getFullYear();
			case "long4":return LinguaFranca[DPO.ISOLanguageCode][13 + DPO.currentDate.getDay()].slice(0,3) + ", " + DPO.getMonthName() + " " + DPO.currentDate.getDate() + " " + DPO.currentDate.getFullYear();
			case "long5":return LinguaFranca[DPO.ISOLanguageCode][13 + DPO.currentDate.getDay()] + ", " + DPO.currentDate.getDate() + " " + DPO.getMonthName() + " " + DPO.currentDate.getFullYear();
			case "long6":return LinguaFranca[DPO.ISOLanguageCode][13 + DPO.currentDate.getDay()] + ", " + DPO.getMonthName() + " " + DPO.currentDate.getDate() + " " + DPO.currentDate.getFullYear();
			case "abbr1":return DPO.currentDate.getDate() + " " + DPO.getMonthName().slice(0,3) + ", " + DPO.currentDate.getFullYear();
			case "abbr2":return DPO.getMonthName().slice(0,3) + " " + DPO.currentDate.getDate() + ", " + DPO.currentDate.getFullYear();
			case "abbr3":return LinguaFranca[DPO.ISOLanguageCode][13 + DPO.currentDate.getDay()].slice(0,3) + ", " + DPO.currentDate.getDate() + " " + DPO.getMonthName().slice(0,3) + " " + DPO.currentDate.getFullYear();
			case "abbr4":return LinguaFranca[DPO.ISOLanguageCode][13 + DPO.currentDate.getDay()].slice(0,3) + ", " + DPO.getMonthName().slice(0,3) + " " + DPO.currentDate.getDate() + " " + DPO.currentDate.getFullYear();
			case "abbr5":return LinguaFranca[DPO.ISOLanguageCode][13 + DPO.currentDate.getDay()] + ", " + DPO.currentDate.getDate() + " " + DPO.getMonthName().slice(0,3) + " " + DPO.currentDate.getFullYear();
			case "abbr6":return LinguaFranca[DPO.ISOLanguageCode][13 + DPO.currentDate.getDay()] + ", " + DPO.getMonthName().slice(0,3) + " " + DPO.currentDate.getDate() + " " + DPO.currentDate.getFullYear();
			case "utc":return DPO.currentDate.toUTCString();
			case "gmt":return DPO.currentDate.toGMTString();
			case "unix":return String(parseInt(DPO.currentDate.getTime() / 1000));
			case "mysql1":return DPO.currentDate.getFullYear() + "-" + eval(DPO.currentDate.getMonth()+1) + "-" + DPO.currentDate.getDate();
			case "mysql2":return DPO.currentDate.getFullYear() + "@" + eval(DPO.currentDate.getMonth()+1) + "@" + DPO.currentDate.getDate();
			case "mysql3":return DPO.currentDate.getFullYear() + (String(eval(DPO.currentDate.getMonth()+1)).length==1?"0" + String(eval(DPO.currentDate.getMonth()+1)) : String(eval(DPO.currentDate.getMonth()+1))) + (String(eval(DPO.currentDate.getDate())).length == 1? "0" + String(eval(DPO.currentDate.getDate())):String(eval(DPO.currentDate.getDate())));
			case "mysql4":return DPO.currentDate.getFullYear() + "@" + (String(eval(DPO.currentDate.getMonth()+1)).length==1?"0" + String(eval(DPO.currentDate.getMonth()+1)) : String(eval(DPO.currentDate.getMonth()+1))) + "@" + (String(eval(DPO.currentDate.getDate())).length == 1? "0" + String(eval(DPO.currentDate.getDate())):String(eval(DPO.currentDate.getDate())));
			case "mysql5":return DPO.currentDate.getFullYear() + "-" + (String(eval(DPO.currentDate.getMonth()+1)).length==1?"0" + String(eval(DPO.currentDate.getMonth()+1)) : String(eval(DPO.currentDate.getMonth()+1))) + "-" + (String(eval(DPO.currentDate.getDate())).length == 1? "0" + String(eval(DPO.currentDate.getDate())):String(eval(DPO.currentDate.getDate())));
			case "vt_date":
				var dtString = "";
				try {
					dtString = DPO.currentDate.getVarDate();
				}catch (e){
					dtString = DPO.currentDate.toUTCString();
				} 
				return dtString;
			default:
				alert ('Format Case Failure. Defaulting...');
				return eval(DPO.currentDate.getMonth()+1) + "/" + DPO.currentDate.getDate() + "/" + DPO.currentDate.getFullYear();
		}
	}
}
function DatePicker_GetMonthName(){
	return String(LinguaFranca[this.ISOLanguageCode][this.currentDate.getMonth()]);
}
function DatePicker_SetDay (id, tdID){
	if (tdID != 32) {
		datePickerMap[id].isNullDate = false;
		datePickerMap[id].currentDate.setDate(tdID);
		datePickerMap[id].showDate = true;
	}else{
		datePickerMap[id].isNullDate = true;
	}
	datePickerMap[id].displayDate();
	datePickerMap[id].hide();
	if (datePickerMap[id].instantiated) eval(datePickerMap[id].scriptAction);
}
function DatePicker_IncrementMonth(id){
	var currentMonth = parseInt(datePickerMap[id].currentDate.getMonth());
	var currentYear = parseInt(datePickerMap[id].currentDate.getFullYear());
	var currentDate = parseInt (datePickerMap[id].currentDate.getDate());
	if (currentMonth == 11){
		currentMonth = 0;
		currentYear += 1;
	}else{
		currentMonth += 1;
	}
	var incDayLimit = DatePicker_Util_getDayLimit_MonthID(currentMonth, currentYear);
	if (currentDate > incDayLimit)currentDate=incDayLimit;
	datePickerMap[id].currentDate.setDate(currentDate);
	datePickerMap[id].currentDate.setMonth(currentMonth);
	datePickerMap[id].currentDate.setFullYear(currentYear);
	datePickerMap[id].displayDate();
	if (datePickerMap[id].instantiated) eval(datePickerMap[id].scriptAction);
}
function DatePicker_DecrementMonth(id){
	var currentMonth = parseInt(datePickerMap[id].currentDate.getMonth());
	var currentYear = parseInt(datePickerMap[id].currentDate.getFullYear());
	var currentDate = parseInt (datePickerMap[id].currentDate.getDate());
	if (currentMonth == 0){
		currentMonth = 11;
		currentYear -= 1;
	}else{
		currentMonth -= 1;
	}
	var decDayLimit = DatePicker_Util_getDayLimit_MonthID(currentMonth, currentYear);
	if (currentDate > decDayLimit)currentDate=decDayLimit;
	datePickerMap[id].currentDate.setDate(currentDate);
	datePickerMap[id].currentDate.setMonth(currentMonth);
	datePickerMap[id].currentDate.setFullYear(currentYear);
	datePickerMap[id].displayDate();
	if (datePickerMap[id].instantiated) eval(datePickerMap[id].scriptAction);
}
function DatePicker_IncrementYear(id){
	var currentMonth = parseInt(datePickerMap[id].currentDate.getMonth());
	var currentYear = parseInt(datePickerMap[id].currentDate.getFullYear());
	var currentDate = parseInt (datePickerMap[id].currentDate.getDate());
	currentYear += 1;
	var incDayLimit = DatePicker_Util_getDayLimit_MonthID(currentMonth, currentYear);
	if (currentDate > incDayLimit)currentDate=incDayLimit;
	datePickerMap[id].currentDate.setDate(currentDate);
	datePickerMap[id].currentDate.setMonth(currentMonth);
	datePickerMap[id].currentDate.setFullYear(currentYear);
	datePickerMap[id].displayDate();
	if (datePickerMap[id].instantiated) eval(datePickerMap[id].scriptAction);
}
function DatePicker_DecrementYear(id){
	var currentMonth = parseInt(datePickerMap[id].currentDate.getMonth());
	var currentYear = parseInt(datePickerMap[id].currentDate.getFullYear());
	var currentDate = parseInt (datePickerMap[id].currentDate.getDate());
	currentYear -= 1;
	var decDayLimit = DatePicker_Util_getDayLimit_MonthID(currentMonth, currentYear);
	if (currentDate > decDayLimit)currentDate=decDayLimit;
	datePickerMap[id].currentDate.setDate(currentDate);
	datePickerMap[id].currentDate.setMonth(currentMonth);
	datePickerMap[id].currentDate.setFullYear(currentYear);
	datePickerMap[id].displayDate();
	if (datePickerMap[id].instantiated) eval(datePickerMap[id].scriptAction);
}
function DatePicker_GetDayLimit(){
	return DatePicker_Util_getDayLimit (this.currentDate);
}
function DatePicker_TogglePicker(id){
	for (picker in datePickerMap)if (id != picker)datePickerMap[picker].hide();
	if (datePickerMap[id].isPickerVisible){
	datePickerMap[id].hide();
	}
	else{
		datePickerMap[id].show();
	}
}
function DatePicker_HidePicker(){
	getDOMObject(DATE_DROPDOWN_PREFIX+this.id).style.display='none';
	this.isPickerVisible = false;
	this.toggleZOrderElements(!this.isPickerVisible);
}
function DatePicker_ShowPicker(){
//	this.getXPos=DatePicker_GetXCoord;
//	var coord=this.getXPos();
//	var xcoord=coord[0];
//	var ycoord=coord[1];

	getDOMObject(DATE_DROPDOWN_PREFIX+this.id).style.display='block';
	this.isPickerVisible = true;
	this.toggleZOrderElements(!this.isPickerVisible);
		
}


