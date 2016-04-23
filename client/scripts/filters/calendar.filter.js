angular
  .module('Root')
  .filter('calendar', calendar);
 
function calendar () {
  return function (time) {
    if (!time) return;
 
    return moment(time).calendar(null, {
      lastDay : '[Yesterday] LT',
      sameDay : 'LT',
      lastWeek : 'dddd LT',
      sameElse : 'DD/MM/YY LT'
    });
  };
}