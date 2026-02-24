/* Used in old UI MasterPage.master.cs */

// JavaScript Document
//Copyright Kerberos Internet Services, CC; All rights reserved.
//info@kerberosb2b.com
//helpdesk@kerberosb2b.com
//http://www.kerberosb2b.com
var OPERATOR_SMALLERTHAN = "SMALLERTHAN";
var OPERATOR_LARGERTHAN = "LARGERTHAN";
var OPERATOR_EQUALTO = "EQUALTO";
var OPERATOR_NOTEQUALTO = "NOTEQUALTO";
function DatePicker_Util_TimeFrameTest(datePickerControl, minimumTimeFrame, action1, action2){
	if (!datePickerControl.instantiated)return false;
	var currentDate = new Date();
	var currentTimeFrame = currentDate.getFullYear() - datePickerControl.currentDate.getFullYear();
	if (currentTimeFrame <= minimumTimeFrame)eval(action1);
	else eval(action2);
}
//Test if a testDate is larger than a baseDate. dayOffset provides a minimum offset between the two.
function DatePicker_Util_GreaterThan_Test(testDate, baseDate, dayOffset){
	if (testDate.getFullYear() == baseDate.getFullYear()){
		if (testDate.getMonth() == baseDate.getMonth()){
			if (testDate.getDate() > baseDate.getDate() + dayOffset){
				return true;
			}
		}else if (testDate.getMonth() > baseDate.getMonth()){
			if (testDate.getMonth() == baseDate.getMonth() + 1){
				if (dayOffset > (testDate.getDate() + (DatePicker_Util_getDayLimit(baseDate) - baseDate.getDate()))){
					return true;
				}
			}else{
				return true;
			}
			return true;
		}
	}else if (testDate.getFullYear() > baseDate.getFullYear()){
		if (testDate.getMonth() == 0 && baseDate.getMonth() == 11 && (testDate.getFullYear() - 1) == baseDate.getFullYear()){
			if (dayOffset > (testDate.getDate() + (DatePicker_Util_getDayLimit(baseDate) - baseDate.getDate()))){
				return true;
			}
			return true;
		}else{
			return true;
		}
	}
	return false;
}
function DatePicker_Util_LessThan_Test(testDate, baseDate, dayOffset){
	if (testDate.getFullYear() == baseDate.getFullYear()){
		if (testDate.getMonth() == baseDate.getMonth()){
			if (testDate.getDate() + dayOffset <= baseDate.getDate()){
				return true;
			}
		}else if (testDate.getMonth() < baseDate.getMonth()){
			if (testDate.getMonth() == baseDate.getMonth() - 1){
				if (dayOffset >= (baseDate.getDate() + (DatePicker_Util_getDayLimit(testDate) - testDate.getDate()))){
					return true;
				}
			}else{
				return true;
			}
			return true;
		}
	}else if (testDate.getFullYear() < baseDate.getFullYear()){
		if (testDate.getMonth() == 11 && baseDate.getMonth() == 0 && (testDate.getFullYear() + 1) == baseDate.getFullYear()){
			if (dayOffset >= (baseDate.getDate() + (DatePicker_Util_getDayLimit(testDate) - testDate.getDate()))){
				return true;
			}
			return true;
		}else{
			return true;
		}
	}
	return false;
}
function DatePicker_Util_EqualTo_Test(testDate, thresholdDate){
	if (testDate.getFullYear() == thresholdDate.getFullYear())
		if (testDate.getMonth() == thresholdDate.getMonth())
			if (testDate.getDate() == thresholdDate.getDate())return true;
	return false;
}
function DatePicker_Util_AdjustDates_Inc(datePickerControl, baseDate, dayOffset){
	if (!datePickerControl.instantiated)return false;
	datePickerControl.currentDate.setDate(baseDate.getDate());
	datePickerControl.currentDate.setMonth(baseDate.getMonth());
	datePickerControl.currentDate.setFullYear(baseDate.getFullYear());
	var dayLimit = datePickerControl.getDayLimit();
	var currentDate = datePickerControl.currentDate.getDate(); 
	if (dayOffset < 0) dayOffset = 0;
	if ((currentDate + dayOffset) > dayLimit){
		if (datePickerControl.currentDate.getMonth() == 11){
			datePickerControl.currentDate.setDate(dayOffset - (dayLimit - currentDate));
			datePickerControl.currentDate.setMonth(0);
			datePickerControl.currentDate.setFullYear(datePickerControl.currentDate.getFullYear() + 1);
		}else{
			datePickerControl.currentDate.setDate(dayOffset - (dayLimit - currentDate));
			datePickerControl.currentDate.setMonth(datePickerControl.currentDate.getMonth() + 1);
		}
	}else{
		datePickerControl.currentDate.setDate(currentDate + dayOffset);
	}
	datePickerControl.displayDate();
}
function DatePicker_Util_AdjustDates_Dec(datePickerControl, baseDate, dayOffset){
	if (!datePickerControl.instantiated)return false;
	datePickerControl.currentDate.setDate(baseDate.getDate());
	datePickerControl.currentDate.setMonth(baseDate.getMonth());
	datePickerControl.currentDate.setFullYear(baseDate.getFullYear());
	var dayLimit = datePickerControl.getDayLimit();
	var currentDate = datePickerControl.currentDate.getDate(); 
	if (dayOffset < 0) dayOffset = 0;
	if ((currentDate - dayOffset) < 0){
		if (datePickerControl.currentDate.getMonth() == 0){
			datePickerControl.currentDate.setMonth(11);
			dayLimit = datePickerControl.getDayLimit();
			datePickerControl.currentDate.setDate(dayLimit - (currentDate - dayOffset));
			datePickerControl.currentDate.setFullYear(datePickerControl.currentDate.getFullYear() - 1);
		}else{
			datePickerControl.currentDate.setDate(currentDate - dayOffset);
			datePickerControl.currentDate.setMonth(datePickerControl.currentDate.getMonth() - 1);
		}
	}else{
		datePickerControl.currentDate.setDate(currentDate - dayOffset);
	}
	datePickerControl.displayDate();
}
function DatePicker_Util_ThresholdTest(datePickerControl, operator, thresholdDate, action1, action2, dayOffset){
	if (!datePickerControl.instantiated)return false;
	var testPassed = false;
	if (!dayOffset) dayOffset = 0;
	switch (operator){
		case OPERATOR_LARGERTHAN:
			testPassed = DatePicker_Util_GreaterThan_Test(datePickerControl.currentDate, thresholdDate, dayOffset);
			break;
		case OPERATOR_SMALLERTHAN:
			testPassed = DatePicker_Util_LessThan_Test(datePickerControl.currentDate, thresholdDate, dayOffset);
			break;
		case OPERATOR_EQUALTO:
			testPassed = DatePicker_Util_EqualTo_Test(datePickerControl.currentDate, thresholdDate);
			break;
		case OPERATOR_NOTEQUALTO:
			testPassed = !DatePicker_Util_EqualTo_Test(datePickerControl.currentDate, thresholdDate);
			break;
	}
	if (testPassed)eval(action1);else eval(action2);
	return testPassed;
}
function DatePicker_Util_ThresholdTest_AdjustDates(datePickerControl, operator, thresholdDate, action1, action2, dayOffset){
	if (!datePickerControl.instantiated)return false;
	if (!dayOffset)dayOffset = 0;
	if (DatePicker_Util_ThresholdTest(datePickerControl, operator, thresholdDate, action1, action2, dayOffset)){
		DatePicker_Util_AdjustDates_Inc (datePickerControl, thresholdDate, dayOffset);
		return true;
	}
	return false;
}

function DatePicker_Util_SmallLargeTest(smallerControl, largerControl, type, action1, action2, dayOffset){
	if (!smallerControl.instantiated)return false;
	if (!largerControl.instantiated)return false;
	if ((!DatePicker_Util_ThresholdTest(largerControl, OPERATOR_LARGERTHAN, smallerControl.currentDate, '', '', dayOffset))){
		if (type == 1)DatePicker_Util_AdjustDates_Dec (smallerControl, largerControl.currentDate, dayOffset);
		if (type == 2)DatePicker_Util_AdjustDates_Inc (largerControl, smallerControl.currentDate, dayOffset);
		eval(action1);
		return true;
	}else{
		eval(action2);
		return false;
	}
}
function DatePicker_Util_RestrictDays(datePickerControl, restrictedDays, action1, action2, type){
	if (!datePickerControl.instantiated)return false;
	var selectedDay = datePickerControl.currentDate.getDay();
	var isDayCorrect = false;
	var dayDifference = 0;
	var isChanged = false;
	if (!type) type = 2;
	if (restrictedDays.length == 0){
		alert ("Plugin Failure: Provide day restrictions.");
		return false;
	}
	while (!isDayCorrect){
		selectedDay = datePickerControl.currentDate.getDay();	
		for (i = 0; i < restrictedDays.length; i++){
			if (selectedDay == restrictedDays[i]){
				isDayCorrect = true;
				break;
			}
		}
		if (!isDayCorrect && type == 1){
			DatePicker_Util_AdjustDates_Dec (datePickerControl, datePickerControl.currentDate, 1);
			isChanged = true;
		}else if (!isDayCorrect && type == 2){
			DatePicker_Util_AdjustDates_Inc (datePickerControl, datePickerControl.currentDate, 1);
			isChanged = true;
		}
		selectedDay = datePickerControl.currentDate.getDay();
		for (i = 0; i < restrictedDays.length; i++){
			if (selectedDay == restrictedDays[i]){
				isDayCorrect = true;
				break;
			}
		}
	}
	if (isChanged){
		eval (action1);
		return true;
	}else{
		eval (action2)
		return false;
	}
}
function DatePicker_Util_RangeRestrictDays(smallerControl, largerControl, type, dayOffset, restrictedDays, action1, action2){
	if (!smallerControl.instantiated)return false;
	if (!largerControl.instantiated)return false;
	var isRestrictDate1 = true;
	var isRestrictDate2 = true;
	var isSmallLarge = true;
	var isChanged = false
	while (isSmallLarge && (isRestrictDate1 || isRestrictDate2)){
		isSmallLarge = DatePicker_Util_SmallLargeTest(smallerControl, largerControl, type, '', '', dayOffset);
		isRestrictDate1 = DatePicker_Util_RestrictDays(smallerControl, restrictedDays, '', '', type);
		isRestrictDate2 = DatePicker_Util_RestrictDays(largerControl, restrictedDays, '', '', type);
		if (isRestrictDate1 || isRestrictDate2)isSmallLarge = true;
		if (isSmallLarge || isRestrictDate1 || isRestrictDate2)isChanged = true;
	}
	if (isChanged){
		eval (action1);
		return true;
	}else{
		eval (action2);
		return false;
	}
}

function DatePicker_Util_RestrictSimpleEvents(datePickerControl, scriptAction1, scriptAction2, type){
	if (!datePickerControl.instantiated)return false;
	var simpleEventString = datePickerControl.isSimpleEvent(datePickerControl.currentDate.getDate());
	var isEvent = simpleEventString != "";
	var execScriptAction = isEvent;
	if (!type)type = 2;
	while (isEvent){
		simpleEventString = datePickerControl.isSimpleEvent(datePickerControl.currentDate.getDate());
		isEvent = simpleEventString != "";
		if (isEvent && type == 2)DatePicker_Util_AdjustDates_Inc (datePickerControl, datePickerControl.currentDate, 1);
		if (isEvent && type == 1)DatePicker_Util_AdjustDates_Dec (datePickerControl, datePickerControl.currentDate, 1);
	}
	if (execScriptAction){
		eval (scriptAction1);
		return true;
	}else{
		eval (scriptAction2);
		return false;
	}
}

function DatePicker_Util_AllowSimpleEventsOnly(datePickerControl, scriptAction1, scriptAction2, type){
	if (!datePickerControl.instantiated)return false;
	var simpleEventString = datePickerControl.isSimpleEvent(datePickerControl.currentDate.getDate());
	var isNotEvent = simpleEventString == "";
	var execScriptAction = isNotEvent;
	if (!type)type = 2;
	while (isNotEvent){
		simpleEventString = datePickerControl.isSimpleEvent(datePickerControl.currentDate.getDate());
		isNotEvent = simpleEventString == "";
		if (isNotEvent && type == 2)DatePicker_Util_AdjustDates_Inc (datePickerControl, datePickerControl.currentDate, 1);
		if (isNotEvent && type == 1)DatePicker_Util_AdjustDates_Dec (datePickerControl, datePickerControl.currentDate, 1);
	}
	if (execScriptAction){
		eval (scriptAction1);
		return true;
	}else{
		eval (scriptAction2);
		return false;
	}
}

function DatePicker_Util_RestrictWeekdaysSimpleEvents(datePickerControl, restrictedDays, scriptAction1, scriptAction2, type){
	if (!datePickerControl.instantiated)return false;
	var isRestrictDate = true;
	var isEvent = true;
	var isChanged = false;
	if (!type) type = 2;
	while (isEvent || isRestrictDate){
		isRestrictDate = DatePicker_Util_RestrictDays(datePickerControl, restrictedDays, '', '', type);
		isEvent = DatePicker_Util_RestrictSimpleEvents(datePickerControl, '', '', type);
		if (isRestrictDate || isEvent)isChanged = true;
	}
	if (isChanged){
		eval (scriptAction1);
		return true;
	}else{
		eval (scriptAction2);
		return false;
	}
}
function DatePicker_Util_RangeRestrictSimpleEvents(smallerControl, largerControl, type, dayOffset, scriptAction1, scriptAction2){
	if (!smallerControl.instantiated)return false;
	if (!largerControl.instantiated)return false;
	var isSmallLarge = true;
	var isSimpleEvent1 = true;
	var isSimpleEvent2 = true;
	var isChanged = false
	while (isSmallLarge && (isSimpleEvent1 || isSimpleEvent2)){
		isSmallLarge = DatePicker_Util_SmallLargeTest(smallerControl, largerControl, type, '', '', dayOffset);
		isSimpleEvent1 = DatePicker_Util_RestrictSimpleEvents(smallerControl, '', '', type);
		isSimpleEvent2 = DatePicker_Util_RestrictSimpleEvents(largerControl, '', '', type);
		if (isSimpleEvent1 || isSimpleEvent2)isSmallLarge = true;
		if (isSmallLarge || isSimpleEvent1 || isSimpleEvent2)isChanged = true;
	}
	if (isChanged){
		eval (scriptAction1);
		return true;
	}else{
		eval (scriptAction2);
		return false;
	}
}
function DatePicker_Util_RangeRestrictWeekdaysSimpleEvents(smallerControl, largerControl, type, dayOffset, restrictedDays, action1, action2){
	if (!smallerControl.instantiated)return false;
	if (!largerControl.instantiated)return false;
	var isSmallLarge = true;
	var isWeekdaySimpleEvent1 = true;
	var isWeekdaySimpleEvent2 = true;
	var isChanged = false
	while (isSmallLarge && (isWeekdaySimpleEvent1 || isWeekdaySimpleEvent2)){
		isSmallLarge = DatePicker_Util_SmallLargeTest(smallerControl, largerControl, type, '', '', dayOffset);
		isWeekdaySimpleEvent1 = DatePicker_Util_RestrictWeekdaysSimpleEvents(smallerControl, restrictedDays, '', '', type);
		isWeekdaySimpleEvent2 = DatePicker_Util_RestrictWeekdaysSimpleEvents(largerControl, restrictedDays, '', '', type);
		if (isWeekdaySimpleEvent1 || isWeekdaySimpleEvent2)isSmallLarge = true;
		if (isSmallLarge || isWeekdaySimpleEvent1 || isWeekdaySimpleEvent2)isChanged = true;
	}
	if (isChanged){
		eval (action1);
		return true;
	}else{
		eval (action2);
		return false;
	}
}
function DatePicker_Util_RangeLimit (smallerControl, largerControl, lowerLimit, upperLimit, atype, dayOffset, action1, action2){
	if (!smallerControl.instantiated)return false;
	if (!largerControl.instantiated)return false;
	var isSmallLarge = false;
	var isLowerLimit = false;
	var isUpperLimit = false;
	var isChanged = false; 
	isSmallLarge = DatePicker_Util_SmallLargeTest(smallerControl, largerControl, atype, '', '', dayOffset);
	isLowerLimit = DatePicker_Util_ThresholdTest_AdjustDates(smallerControl, OPERATOR_SMALLERTHAN, lowerLimit, '', '', 0);
	isUpperLimit = DatePicker_Util_ThresholdTest_AdjustDates(largerControl, OPERATOR_LARGERTHAN, upperLimit, '', '', 0);
	if (isUpperLimit){
		largerControl.currentDate = new Date(upperLimit);
		atype = 1;
	}else if (isLowerLimit){
		smallerControl.currentDate =  new Date(lowerLimit);
		atype = 2;
	}
	isSmallLarge = DatePicker_Util_SmallLargeTest(smallerControl, largerControl, atype, '', '', dayOffset);
	if (isSmallLarge && (isUpperLimit || isLowerLimit))isChanged = true;
	if (isChanged){
		smallerControl.displayDate();
		largerControl.displayDate();
		eval (action1);
		return true;
	}else{
		eval (action2);
		return false;
	}
}
function DatePicker_Util_RangeLimitSimpleEvents (smallerControl, largerControl, lowerLimit, upperLimit, type, dayOffset, action1, action2){
	if (!smallerControl.instantiated)return false;
	if (!largerControl.instantiated)return false;
	var isSmallLarge = true;
	var isSimpleEvent1 = true;
	var isSimpleEvent2 = true;
	var isChanged = false; 
	while (isSmallLarge && (isSimpleEvent1 || isSimpleEvent2)){
		isSmallLarge = DatePicker_Util_RangeLimit(smallerControl, largerControl, lowerLimit, upperLimit, type, dayOffset, '', '');
		isSimpleEvent1 = DatePicker_Util_RestrictSimpleEvents(smallerControl, '', '', type);
		isSimpleEvent2 = DatePicker_Util_RestrictSimpleEvents(largerControl, '', '', type);
		isSmallLarge = DatePicker_Util_RangeLimit(smallerControl, largerControl, lowerLimit, upperLimit, type, dayOffset, '', '');
		if (isSimpleEvent1 && isSmallLarge && type==1)type = 2;
		if (isSimpleEvent2 && isSmallLarge && type==2)type = 1;
		if (isSmallLarge || isSimpleEvent1 || isSimpleEvent2)isChanged = true;
	}
	if (isChanged){
		smallerControl.displayDate();
		largerControl.displayDate();
		eval (action1);
		return true;
	}else{
		eval (action2);
		return false;
	}
}
function DatePicker_Util_RangeLimitRestrictDays(smallerControl, largerControl, lowerLimit, upperLimit, type, dayOffset, restrictedDays, action1, action2){
	if (!smallerControl.instantiated)return false;
	if (!largerControl.instantiated)return false;
	var isSmallLarge = true;
	var isRestrictDate1 = true;
	var isRestrictDate2 = true;
	
	var isChanged = false; 
	while (isSmallLarge && (isRestrictDate1 || isRestrictDate2)){
		isSmallLarge = DatePicker_Util_RangeLimit(smallerControl, largerControl, lowerLimit, upperLimit, type, dayOffset, '', '');
		isRestrictDate1 = DatePicker_Util_RestrictDays(smallerControl, restrictedDays, '', '', type);
		isRestrictDate2 = DatePicker_Util_RestrictDays(largerControl, restrictedDays, '', '', type);
		isSmallLarge = DatePicker_Util_RangeLimit(smallerControl, largerControl, lowerLimit, upperLimit, type, dayOffset, '', '');
		if (isRestrictDate1 && isSmallLarge && type==2)type = 1;
		else if (isRestrictDate2 && isSmallLarge && type==1)type = 2;
		if (isSmallLarge || isRestrictDate1 || isRestrictDate2)isChanged = true;
	}
	if (isChanged){
		smallerControl.displayDate();
		largerControl.displayDate();
		eval (action1);
		return true;
	}else{
		eval (action2);
		return false;
	}
}
function DatePicker_Util_RangeLimitRestrictWeekdaysSimpleEvents(smallerControl, largerControl, lowerLimit, upperLimit, type, dayOffset, restrictedDays, action1, action2){
	if (!smallerControl.instantiated)return false;
	if (!largerControl.instantiated)return false;
	var isSmallLarge = true;
	var isWeekdaySimpleEvent1 = true;
	var isWeekdaySimpleEvent2 = true;
	var isWeekdaySimpleEvent3 = false;
	var isChanged = false;
	var myType = type;
	while ((isSmallLarge || isWeekdaySimpleEvent3)&& (isWeekdaySimpleEvent1 || isWeekdaySimpleEvent2)){
		isSmallLarge = DatePicker_Util_RangeLimit(smallerControl, largerControl, lowerLimit, upperLimit, myType, dayOffset, '', '');
		isWeekdaySimpleEvent2 = DatePicker_Util_RestrictWeekdaysSimpleEvents(smallerControl, restrictedDays, '', '', type);
		isWeekdaySimpleEvent1 = DatePicker_Util_RestrictWeekdaysSimpleEvents(largerControl, restrictedDays, '', '', type);
		isSmallLarge = DatePicker_Util_RangeLimit(smallerControl, largerControl, lowerLimit, upperLimit, myType, dayOffset, '', '');
		if ((isWeekdaySimpleEvent1 || isWeekdaySimpleEvent2) && isSmallLarge){
			if (type == 1)type = 2; else type = 1;
		}else if ((isWeekdaySimpleEvent1 || isWeekdaySimpleEvent2) && !isSmallLarge){
			isWeekdaySimpleEvent3 = DatePicker_Util_RangeRestrictWeekdaysSimpleEvents(smallerControl, largerControl, type, dayOffset, restrictedDays, '', '')
			if (type == 1)type = 2; else type = 1;
		}
		if (isSmallLarge || isWeekdaySimpleEvent2 || isWeekdaySimpleEvent1)isChanged = true;
	}
	if (isChanged){
		eval (action1);
		return true;
	}else{
		eval (action2);
		return false;
	}
}