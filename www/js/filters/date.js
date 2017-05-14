var DEVICE_WIDTH_THRESHOLD = 412;

angular.module('starter')
.filter('formatDate', function () {
    return function (date) {
  		var newDate = new Date(date);
  		if (window.screen.width >= DEVICE_WIDTH_THRESHOLD) {
  			var daysList = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
  			var monthsList = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout" , "Septembre", "Octobre", "Novembre", "Décembre"];
  			var newDayInteger = newDate.getDay() - 1;
  			var newDayString = daysList[newDayInteger];
        if (newDayInteger == 1) {
          newDayInteger = "1er";
        }
  			var newMonthInteger = newDate.getMonth();
  			var newMonthString = monthsList[newMonthInteger];
  			var newYear = newDate.getFullYear();
  			var newMonthString = monthsList[newMonthInteger];
  			newDayString += " " + newDayInteger + " " + newMonthString + " " + newYear;
  		} else { // smaller devices
  			var month = newDate.getMonth();
  			month = (month < 10) ? "0" + month : month;
  			newDayString = newDate.getDate() + "/" + month + "/" + newDate.getFullYear();
  		}
  		return newDayString;
    };
})
.filter('test', function () {
    return function (item) {
  		debugger;
  		return item;
    };
})
;
