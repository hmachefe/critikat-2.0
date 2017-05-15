var DEVICE_WIDTH_THRESHOLD = 412;

angular.module('starter')
.filter('formatDate', function () {
    return function (date) {
      //debugger;
      moment.locale('fr');
      return moment(date).format('Do MMMM YYYY');
    }
})
.filter('test', function () {
    return function (item) {
  		//debugger;
  		return item;
    };
})
;
